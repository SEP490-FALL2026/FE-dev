import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useEffect, useState, useSyncExternalStore, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { authRedeemInvitation } from '~/shared/api/generated/operations/auth/auth-redeem-invitation'
import type { ErrorEnvelopeDto } from '~/shared/api/generated/model/errorEnvelopeDto'
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

function getActionErrorCode(error: unknown) {
  return axios.isAxiosError<ErrorEnvelopeDto>(error) ? error.response?.data?.error?.code : undefined
}

function isInvalidTokenError(error: unknown) {
  const code = getActionErrorCode(error)
  return code === 'AUTH.PASSWORD_RESET_INVALID' || code === 'AUTH.INVITATION_INVALID'
}

function getActionErrorKey(error: unknown, retrySeconds: number, action: AuthAction) {
  if (action === 'activate' && axios.isAxiosError(error) && (!error.response || error.response.status >= 500)) {
    return 'actions.activate.uncertainResult'
  }
  const code = getActionErrorCode(error)
  if (code === 'VALIDATION_ERROR') return 'actions.validation'
  if (code === 'AUTH.CURRENT_PASSWORD_INVALID') return 'actions.currentPasswordInvalid'
  if (code === 'AUTH.PASSWORD_POLICY_VIOLATION') return 'actions.passwordPolicy'
  if (code === 'HTTP_TOO_MANY_REQUESTS' || code === 'AUTH.LOGIN_TEMPORARILY_BLOCKED') {
    return retrySeconds > 0 ? 'actions.rateLimitedWait' : 'actions.rateLimited'
  }
  if (code === 'AUTH.UNAVAILABLE' || code === 'SERVICE_UNAVAILABLE') return 'actions.unavailable'
  return 'actions.genericError'
}

function readFragmentToken(action: AuthAction) {
  if (typeof window === 'undefined') return ''
  const tokens = new URLSearchParams(window.location.hash.slice(1)).getAll('token')
  const token = tokens[0] ?? ''
  if (action === 'activate' && (tokens.length !== 1 || !token.trim() || token.length > 256)) return ''
  return token
}

export function AuthActionPage({ action }: { action: AuthAction }) {
  const { t: translate } = useTranslation('auth')
  const { t: common } = useTranslation('common')
  const navigate = useNavigate()
  const session = useSyncExternalStore(subscribeAuthSession, getAuthState, getAuthState)
  const [token] = useState(() => readFragmentToken(action))
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [validationError, setValidationError] = useState<'mismatch' | 'policy' | null>(null)
  const [retrySeconds, setRetrySeconds] = useState(0)
  const mutation = useMutation({
    retry: false,
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
      toast.error(translate(getActionErrorKey(error, seconds, action), { seconds }), {
        id: `auth-${action}`,
        description: typeof requestId === 'string' ? translate('errors.requestId', { requestId }) : undefined
      })
    },
    onSuccess: () => {
      toast.success(translate(`actions.${action}.success`), { id: `auth-${action}` })
      if (action === 'change' || action === 'reset') clearAuthSession()
      if (action === 'activate') navigate('/login', { replace: true })
    }
  })

  useDocumentTitle(translate(`actions.${action}.title`))
  useEffect(() => {
    if (action === 'activate' || (token && action === 'reset')) {
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
    if (mutation.isPending || retrySeconds > 0 || invalidLink) return
    setValidationError(null)
    if (action !== 'forgot' && newPassword !== confirmPassword) {
      setValidationError('mismatch')
      return
    }
    if (action !== 'forgot' && (newPassword.length < 12 || newPassword.length > 128)) {
      setValidationError('policy')
      return
    }
    toast.dismiss(`auth-${action}`)
    mutation.mutate()
  }

  const invalidFields = getInvalidFields(mutation.error)
  const invalidLink = (action === 'reset' || action === 'activate') && (!token || isInvalidTokenError(mutation.error))
  const invalidPassword =
    validationError === 'policy' ||
    invalidFields.has(action === 'activate' ? 'password' : 'newPassword') ||
    getActionErrorCode(mutation.error) === 'AUTH.PASSWORD_POLICY_VIOLATION'
  const localError = validationError
    ? translate(validationError === 'mismatch' ? 'actions.passwordMismatch' : 'actions.passwordPolicy')
    : ''

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
            <ArrowLeft aria-hidden='true' className='size-4' strokeWidth={1.5} />
            {translate('actions.back')}
          </Link>
          <h1 className='mt-7 text-3xl font-semibold tracking-[-0.04em]'>{translate(`actions.${action}.title`)}</h1>
          <p className='mt-3 text-sm leading-6 text-muted-foreground'>{translate(`actions.${action}.description`)}</p>
          {mutation.isSuccess ? (
            <Link className='mt-8 inline-flex text-sm font-semibold text-primary-ink underline' to='/login'>
              {translate('actions.backToLogin')}
            </Link>
          ) : invalidLink ? (
            <div className='mt-7 space-y-4 text-sm'>
              <p role='alert' className='text-danger-ink'>
                {translate('actions.invalidLink')}
              </p>
              {action === 'reset' ? (
                <Link to='/forgot-password' className='font-medium text-primary-ink underline'>
                  {translate('actions.requestNewLink')}
                </Link>
              ) : (
                <>
                  <p className='text-muted-foreground'>{translate('actions.contactAdmin')}</p>
                  <p className='text-muted-foreground'>{translate('actions.activate.alreadySubmitted')}</p>
                </>
              )}
            </div>
          ) : action === 'change' && session.status === 'unavailable' ? (
            <div className='mt-7 text-sm text-muted-foreground'>
              <p role='alert'>{translate('session.unavailable')}</p>
              <button
                type='button'
                className='mt-4 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground'
                onClick={() => void initializeAuthSession()}
              >
                {translate('session.retry')}
              </button>
            </div>
          ) : action === 'change' && session.status !== 'authenticated' ? (
            <p role='status' className='mt-7 text-sm text-muted-foreground'>
              {translate('session.checking')}
            </p>
          ) : (
            <form className='mt-8 space-y-4' onSubmit={submit}>
              {action === 'forgot' && (
                <label className='block text-sm font-medium'>
                  {translate('email.label')}
                  <input
                    autoComplete='email'
                    aria-invalid={invalidFields.has('email') || undefined}
                    aria-description={invalidFields.has('email') ? translate('actions.validation') : undefined}
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
                  {translate('actions.currentPassword')}
                  <input
                    autoComplete='current-password'
                    aria-invalid={invalidFields.has('currentPassword') || undefined}
                    aria-description={
                      invalidFields.has('currentPassword') ? translate('actions.currentPasswordInvalid') : undefined
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
                    {translate('actions.newPassword')}
                    <input
                      autoComplete='new-password'
                      aria-invalid={invalidPassword || undefined}
                      aria-describedby={
                        validationError === 'policy' ? 'auth-password-policy auth-local-error' : 'auth-password-policy'
                      }
                      aria-description={
                        invalidFields.has(action === 'activate' ? 'password' : 'newPassword')
                          ? translate('actions.validation')
                          : undefined
                      }
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
                    {translate('actions.passwordPolicy')}
                  </p>
                  <div className='block text-sm font-medium'>
                    <label htmlFor='confirm-password'>{translate('actions.confirmPassword')}</label>
                    <div className='relative'>
                      <input
                        id='confirm-password'
                        autoComplete='new-password'
                        aria-invalid={validationError === 'mismatch' || undefined}
                        aria-describedby={validationError === 'mismatch' ? 'auth-local-error' : undefined}
                        className='mt-2 h-11 w-full rounded-lg border border-border bg-background pr-12 pl-3.5 text-base outline-none focus:border-primary'
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                        type={showConfirmation ? 'text' : 'password'}
                        value={confirmPassword}
                      />
                      <button
                        type='button'
                        aria-label={translate(
                          showConfirmation ? 'actions.hideConfirmation' : 'actions.showConfirmation'
                        )}
                        aria-pressed={showConfirmation}
                        className='absolute right-1 top-2 grid size-11 place-items-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'
                        onClick={() => setShowConfirmation((value) => !value)}
                      >
                        {showConfirmation ? (
                          <EyeOff aria-hidden='true' className='size-5' />
                        ) : (
                          <Eye aria-hidden='true' className='size-5' />
                        )}
                      </button>
                    </div>
                  </div>
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
                {mutation.isPending && (
                  <LoaderCircle aria-hidden='true' className='size-4 animate-spin' strokeWidth={1.5} />
                )}
                {retrySeconds > 0
                  ? translate('retryIn', { seconds: retrySeconds })
                  : translate(`actions.${action}.submit`)}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}
