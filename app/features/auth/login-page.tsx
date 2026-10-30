import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { MotionConfig, motion } from 'motion/react'
import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

import { useDocumentTitle } from '~/shared/lib/use-document-title'
import { BrandMark } from '~/shared/ui/brand-mark'
import { LanguageSwitch } from '~/shared/ui/language-switch'
import { ThemeSwitch } from '~/shared/ui/theme-switch'
import { login } from './auth-session'
import { LoginShowcase } from './components/login-showcase'
import { getRetryDelaySeconds } from './retry-delay'
import { getInvalidFields } from './validation-issues'
import './login.css'

function getLoginErrorKey(error: unknown, retrySeconds: number) {
  const code = axios.isAxiosError(error) ? error.response?.data?.error?.code : undefined
  if (code === 'AUTH.INVALID_CREDENTIALS') return 'errors.invalidCredentials'
  if (code === 'VALIDATION_ERROR') return 'errors.validation'
  if (code === 'AUTH.LOGIN_TEMPORARILY_BLOCKED') return retrySeconds > 0 ? 'errors.blocked' : 'errors.rateLimited'
  if (code === 'HTTP_TOO_MANY_REQUESTS') return retrySeconds > 0 ? 'errors.rateLimitedWait' : 'errors.rateLimited'
  if (code === 'AUTH.UNAVAILABLE' || code === 'SERVICE_UNAVAILABLE') return 'errors.unavailable'
  return 'errors.generic'
}

export function LoginPage() {
  const { t: translate } = useTranslation('auth')
  const { t: common } = useTranslation('common')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [retrySeconds, setRetrySeconds] = useState(0)
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onError: (error) => {
      const seconds = getRetryDelaySeconds(error)
      setRetrySeconds(seconds)
      const requestId = axios.isAxiosError(error) ? error.response?.data?.error?.requestId : undefined
      toast.error(translate(getLoginErrorKey(error, seconds), { seconds }), {
        id: 'auth-login',
        description: typeof requestId === 'string' ? translate('errors.requestId', { requestId }) : undefined
      })
    },
    onSuccess: (session) => {
      if (!session.role) {
        toast.error(translate('errors.noWorkspace'), { id: 'auth-login' })
        return
      }
      toast.success(translate('signedIn'), { id: 'auth-login' })
      const requested = searchParams.get('redirectTo')
      const safeRedirect = requested?.startsWith('/dashboard/') && !requested.startsWith('//') ? requested : null
      const requestedRole = safeRedirect?.split('/')[2]
      navigate(
        safeRedirect && session.roles.includes(requestedRole as typeof session.role)
          ? safeRedirect
          : `/dashboard/${session.role}`,
        { replace: true }
      )
    }
  })

  useDocumentTitle(translate('documentTitle'))

  useEffect(() => {
    if (retrySeconds <= 0) return
    const timeout = window.setTimeout(() => setRetrySeconds((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearTimeout(timeout)
  }, [retrySeconds])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mutation.isPending || retrySeconds > 0) return
    toast.dismiss('auth-login')
    mutation.mutate({ email: email.trim(), password })
  }

  const invalidFields = getInvalidFields(mutation.error)

  return (
    <MotionConfig reducedMotion='user'>
      <main className='login-page text-foreground'>
        <div className='login-shell'>
          <section className='login-form-column'>
            <header className='login-toolbar'>
              <div className='flex shrink-0 items-center gap-1.5'>
                <ThemeSwitch />
                <LanguageSwitch />
              </div>
            </header>

            <div className='login-form-region'>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className='login-form-card'
              >
                <div className='mb-6 flex items-center gap-2.5 text-base font-semibold tracking-tight'>
                  <span className='login-brand-tile grid size-9 place-items-center rounded-lg'>
                    <BrandMark className='size-5' />
                  </span>
                  {common('brand')}
                </div>
                <h1 className='login-title'>{translate('formTitle')}</h1>
                <p className='mt-3 max-w-xs text-sm leading-6 text-muted-foreground'>{translate('formDescription')}</p>

                <form className='mt-7 space-y-5' onSubmit={submit}>
                  <div>
                    <label className='block text-sm font-medium' htmlFor='login-email'>
                      {translate('email.label')}
                    </label>
                    <div className='relative mt-2'>
                      <Mail
                        aria-hidden='true'
                        className='pointer-events-none absolute top-3.5 left-3.5 size-[18px] text-muted-foreground'
                        strokeWidth={1.5}
                      />
                      <input
                        id='login-email'
                        aria-invalid={invalidFields.has('email') || undefined}
                        aria-description={invalidFields.has('email') ? translate('errors.validation') : undefined}
                        autoComplete='username'
                        autoCapitalize='none'
                        spellCheck={false}
                        autoFocus
                        className='login-input h-12 w-full rounded-lg border border-border pr-3.5 pl-11 text-base outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/65 focus:border-primary focus:ring-3 focus:ring-primary/10 aria-invalid:border-danger md:text-sm'
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder={translate('email.placeholder')}
                        required
                        type='email'
                        value={email}
                      />
                    </div>
                  </div>
                  <div>
                    <div className='flex items-center justify-between gap-4'>
                      <label className='text-sm font-medium' htmlFor='login-password'>
                        {translate('password.label')}
                      </label>
                    </div>
                    <div className='relative mt-2'>
                      <LockKeyhole
                        aria-hidden='true'
                        className='pointer-events-none absolute top-3.5 left-3.5 size-[18px] text-muted-foreground'
                        strokeWidth={1.5}
                      />
                      <input
                        id='login-password'
                        aria-invalid={invalidFields.has('password') || undefined}
                        aria-description={invalidFields.has('password') ? translate('errors.validation') : undefined}
                        autoComplete='current-password'
                        className='login-input h-12 w-full rounded-lg border border-border pr-12 pl-11 text-base outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/65 focus:border-primary focus:ring-3 focus:ring-primary/10 aria-invalid:border-danger md:text-sm'
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={translate('password.placeholder')}
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                      />
                      <button
                        aria-label={translate(showPassword ? 'password.hide' : 'password.show')}
                        aria-pressed={showPassword}
                        className='absolute top-0.5 right-0.5 grid size-11 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary'
                        onClick={() => setShowPassword((value) => !value)}
                        type='button'
                      >
                        {showPassword ? (
                          <EyeOff className='size-[18px]' aria-hidden='true' strokeWidth={1.5} />
                        ) : (
                          <Eye className='size-[18px]' aria-hidden='true' strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                    <div className='mt-3 text-right'>
                      <Link
                        className='inline-flex min-h-8 items-center text-sm font-medium text-primary-ink underline-offset-4 hover:underline'
                        to='/forgot-password'
                      >
                        {translate('forgotPassword')}
                      </Link>
                    </div>
                  </div>
                  <button
                    className='group flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60'
                    disabled={mutation.isPending || retrySeconds > 0}
                    aria-busy={mutation.isPending}
                    type='submit'
                  >
                    {mutation.isPending ? (
                      <LoaderCircle
                        aria-hidden='true'
                        className='size-4 animate-spin motion-reduce:animate-none'
                        strokeWidth={1.5}
                      />
                    ) : null}
                    {mutation.isPending
                      ? translate('submitting')
                      : retrySeconds > 0
                        ? translate('retryIn', { seconds: retrySeconds })
                        : translate('submit')}
                    {!mutation.isPending && retrySeconds === 0 && (
                      <ArrowRight
                        aria-hidden='true'
                        className='size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none'
                        strokeWidth={1.5}
                      />
                    )}
                  </button>
                </form>

                <p className='mt-6 text-center text-xs leading-6 text-muted-foreground'>{translate('accountNotice')}</p>
                <div className='mt-5 flex items-start justify-center gap-2 border-t border-border/70 pt-4 text-[11px] leading-5 text-muted-foreground'>
                  <ShieldCheck className='mt-0.5 size-3.5 shrink-0' aria-hidden='true' strokeWidth={1.5} />
                  {translate('securityNote')}
                </div>
              </motion.div>
            </div>
          </section>
          <LoginShowcase />
        </div>
        <footer className='login-footer text-center text-xs leading-5 text-muted-foreground'>
          {translate('loginFooter')}
        </footer>
      </main>
    </MotionConfig>
  )
}
