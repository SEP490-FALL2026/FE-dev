import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, LoaderCircle } from 'lucide-react'
import { useEffect, useState, useSyncExternalStore, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router'
import { toast } from 'sonner'

import { authRedeemInvitation } from '~/shared/api/generated/operations/auth/auth-redeem-invitation'
import { authRequestPasswordReset } from '~/shared/api/generated/operations/auth/auth-request-password-reset'
import { authResetPassword } from '~/shared/api/generated/operations/auth/auth-reset-password'
import { meChangePassword } from '~/shared/api/generated/operations/me/me-change-password'
import { useDocumentTitle } from '~/shared/lib/use-document-title'
import { BrandMark } from '~/shared/ui/brand-mark'
import { LanguageSwitch } from '~/shared/ui/language-switch'
import { ThemeSwitch } from '~/shared/ui/theme-switch'
import { clearAuthSession, getAuthState, initializeAuthSession, subscribeAuthSession } from './auth-session'
import { getRetryDelaySeconds } from './retry-delay'
import { getInvalidFields } from './validation-issues'

export type AuthAction = 'forgot' | 'reset' | 'activate' | 'change'

function isInvalidTokenError(error: unknown) {
  const code = axios.isAxiosError(error) ? error.response?.data?.error?.code : undefined
  return code === 'AUTH.PASSWORD_RESET_INVALID' || code === 'AUTH.INVITATION_INVALID'
}

function getActionErrorKey(error: unknown, retrySeconds: number) {
  const code = axios.isAxiosError(error) ? error.response?.data?.error?.code : undefined
  if (code === 'VALIDATION_ERROR') return 'actions.validation'
  if (code === 'AUTH.CURRENT_PASSWORD_INVALID') return 'actions.currentPasswordInvalid'
  if (code === 'AUTH.PASSWORD_POLICY_VIOLATION') return 'actions.passwordPolicy'
  if (code === 'HTTP_TOO_MANY_REQUESTS' || code === 'AUTH.LOGIN_TEMPORARILY_BLOCKED') {
    return retrySeconds > 0 ? 'actions.rateLimitedWait' : 'actions.rateLimited'
  }
  if (code === 'AUTH.UNAVAILABLE' || code === 'SERVICE_UNAVAILABLE') return 'actions.unavailable'
  return 'actions.genericError'
}

function readFragmentToken() {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.hash.slice(1)).get('token') ?? ''
}

export function AuthActionPage({ action }: { action: AuthAction }) {
  const { t } = useTranslation('auth')
  const { t: common } = useTranslation('common')
  const session = useSyncExternalStore(subscribeAuthSession, getAuthState, getAuthState)
  const [token] = useState(readFragmentToken)
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [retrySeconds, setRetrySeconds] = useState(0)
  const mutation = useMutation({
    mutationFn: async () => {
      if (action === 'forgot')
        return authRequestPasswordReset({ email: email.trim() }, { skipAuth: true, skipAuthRefresh: true })
      if (action === 'reset')
        return authResetPassword({ token, newPassword }, { skipAuth: true, skipAuthRefresh: true })
      if (action === 'activate')
        return authRedeemInvitation({ token, password: newPassword }, { skipAuth: true, skipAuthRefresh: true })
      return meChangePassword({ currentPassword, newPassword })
    },
    onError: (error) => {
      if (isInvalidTokenError(error)) return
      const seconds = getRetryDelaySeconds(error)
      setRetrySeconds(seconds)
      const requestId = axios.isAxiosError(error) ? error.response?.data?.error?.requestId : undefined
      toast.error(t(getActionErrorKey(error, seconds), { seconds }), {
        id: `auth-${action}`,
        description: typeof requestId === 'string' ? t('errors.requestId', { requestId }) : undefined
      })
    },
    onSuccess: () => {
      toast.success(t(`actions.${action}.success`), { id: `auth-${action}` })
      if (action === 'change' || action === 'reset') clearAuthSession()
    }
  })

  useDocumentTitle(t(`actions.${action}.title`))
  useEffect(() => {
    if (token && (action === 'reset' || action === 'activate')) {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search)
    }
  }, [action, token])
  useEffect(() => {
    if (retrySeconds <= 0) return
    const timeout = window.setTimeout(() => setRetrySeconds((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearTimeout(timeout)
  }, [retrySeconds])

  if (action === 'change' && session.status === 'guest') return <Navigate replace to='/login' />

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mutation.isPending || retrySeconds > 0) return
    setLocalError('')
    if (action !== 'forgot' && newPassword !== confirmPassword) {
      setLocalError(t('actions.passwordMismatch'))
      return
    }
    if (action !== 'forgot' && (newPassword.length < 12 || newPassword.length > 128)) {
      setLocalError(t('actions.passwordPolicy'))
      return
    }
    toast.dismiss(`auth-${action}`)
    mutation.mutate()
  }

  const invalidFields = getInvalidFields(mutation.error)
  const invalidLink = (action === 'reset' || action === 'activate') && (!token || isInvalidTokenError(mutation.error))

  return (
    <main className='min-h-screen bg-background px-5 py-6 text-foreground sm:px-8'>
      <div className='mx-auto max-w-5xl'>
        <header className='flex items-center justify-between gap-4'>
          <Link to='/' className='flex items-center gap-2 font-semibold'>
            <span className='grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground'>
              <BrandMark className='size-5' />
            </span>
            {common('brand')}
          </Link>
          <div className='flex gap-2'>
            <ThemeSwitch />
            <LanguageSwitch />
          </div>
        </header>
        <section className='mx-auto mt-16 max-w-md rounded-2xl border border-border bg-surface p-6 shadow-sm sm:mt-24 sm:p-9'>
          <Link
            to='/login'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
          >
            <ArrowLeft aria-hidden='true' className='size-4' />
            {t('actions.back')}
          </Link>
          <h1 className='mt-7 text-3xl font-semibold tracking-[-0.04em]'>{t(`actions.${action}.title`)}</h1>
          <p className='mt-3 text-sm leading-6 text-muted-foreground'>{t(`actions.${action}.description`)}</p>
          {mutation.isSuccess ? (
            <Link className='mt-8 inline-flex text-sm font-semibold text-primary-ink underline' to='/login'>
              {t('actions.backToLogin')}
            </Link>
          ) : invalidLink ? (
            <div className='mt-7 space-y-4 text-sm'>
              <p role='alert' className='text-danger-ink'>
                {t('actions.invalidLink')}
              </p>
              {action === 'reset' ? (
                <Link to='/forgot-password' className='font-medium text-primary-ink underline'>
                  {t('actions.requestNewLink')}
                </Link>
              ) : (
                <p className='text-muted-foreground'>{t('actions.contactAdmin')}</p>
              )}
            </div>
          ) : action === 'change' && session.status === 'unavailable' ? (
            <div className='mt-7 text-sm text-muted-foreground'>
              <p role='alert'>{t('session.unavailable')}</p>
              <button
                type='button'
                className='mt-4 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground'
                onClick={() => void initializeAuthSession()}
              >
                {t('session.retry')}
              </button>
            </div>
          ) : action === 'change' && session.status !== 'authenticated' ? (
            <p role='status' className='mt-7 text-sm text-muted-foreground'>
              {t('session.checking')}
            </p>
          ) : (
            <form className='mt-8 space-y-4' onSubmit={submit}>
              {action === 'forgot' && (
                <label className='block text-sm font-medium'>
                  {t('email.label')}
                  <input
                    autoComplete='email'
                    aria-invalid={invalidFields.has('email') || undefined}
                    aria-description={invalidFields.has('email') ? t('actions.validation') : undefined}
                    className='mt-2 h-11 w-full rounded-lg border border-border bg-background px-3.5 text-base outline-none focus:border-primary'
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    type='email'
                    value={email}
                  />
                </label>
              )}
              {action === 'change' && (
                <label className='block text-sm font-medium'>
                  {t('actions.currentPassword')}
                  <input
                    autoComplete='current-password'
                    aria-invalid={invalidFields.has('currentPassword') || undefined}
                    aria-description={
                      invalidFields.has('currentPassword') ? t('actions.currentPasswordInvalid') : undefined
                    }
                    className='mt-2 h-11 w-full rounded-lg border border-border bg-background px-3.5 text-base outline-none focus:border-primary'
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    required
                    type='password'
                    value={currentPassword}
                  />
                </label>
              )}
              {action !== 'forgot' && (
                <>
                  <label className='block text-sm font-medium'>
                    {t('actions.newPassword')}
                    <input
                      autoComplete='new-password'
                      aria-invalid={invalidFields.has(action === 'activate' ? 'password' : 'newPassword') || undefined}
                      aria-describedby='auth-password-policy'
                      className='mt-2 h-11 w-full rounded-lg border border-border bg-background px-3.5 text-base outline-none focus:border-primary'
                      onChange={(event) => setNewPassword(event.target.value)}
                      minLength={12}
                      maxLength={128}
                      required
                      type='password'
                      value={newPassword}
                    />
                  </label>
                  <p id='auth-password-policy' className='text-xs leading-5 text-muted-foreground'>
                    {t('actions.passwordPolicy')}
                  </p>
                  <label className='block text-sm font-medium'>
                    {t('actions.confirmPassword')}
                    <input
                      autoComplete='new-password'
                      aria-invalid={!!localError || undefined}
                      aria-describedby={localError ? 'auth-local-error' : undefined}
                      className='mt-2 h-11 w-full rounded-lg border border-border bg-background px-3.5 text-base outline-none focus:border-primary'
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                      type='password'
                      value={confirmPassword}
                    />
                  </label>
                </>
              )}
              {localError && (
                <p id='auth-local-error' role='alert' className='text-sm text-danger-ink'>
                  {localError}
                </p>
              )}
              <button
                aria-busy={mutation.isPending}
                className='flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60'
                disabled={mutation.isPending || retrySeconds > 0}
                type='submit'
              >
                {mutation.isPending && <LoaderCircle aria-hidden='true' className='size-4 animate-spin' />}
                {retrySeconds > 0 ? t('retryIn', { seconds: retrySeconds }) : t(`actions.${action}.submit`)}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}
