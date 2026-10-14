import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'

import { useDocumentTitle } from '~/shared/lib/use-document-title'
import { BrandMark } from '~/shared/ui/brand-mark'
import { LanguageSwitch } from '~/shared/ui/language-switch'
import { ThemeSwitch } from '~/shared/ui/theme-switch'

import { demoAccounts, matchDemoAccount } from './demo-accounts'

export function LoginPage() {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [hasError, setHasError] = useState(false)

  useDocumentTitle(t('documentTitle'))

  function selectAccount(account: (typeof demoAccounts)[number]) {
    setEmail(account.email)
    setPassword(account.password)
    setHasError(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const account = matchDemoAccount(email, password)

    if (!account) {
      setHasError(true)
      return
    }

    navigate(`/dashboard/${account.role}`)
  }

  return (
    <main className='relative min-h-screen overflow-hidden bg-background px-5 py-5 sm:px-8 sm:py-8'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -top-48 -left-40 size-[34rem] rounded-full bg-primary-soft/80 blur-3xl'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute right-[-14rem] bottom-[-18rem] size-[42rem] rounded-full bg-primary-soft/55 blur-3xl'
      />

      <div className='relative z-10 mx-auto max-w-7xl'>
        <header className='flex flex-wrap items-center justify-between gap-4'>
          <Link
            className='inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary'
            to='/'
          >
            <ArrowLeft aria-hidden='true' className='size-4' />
            {t('backHome')}
          </Link>
          <div className='flex items-center gap-2'>
            <ThemeSwitch />
            <LanguageSwitch />
          </div>
        </header>

        <section className='mt-8 grid overflow-hidden rounded-[2rem] border border-border bg-surface/90 shadow-[0_28px_90px_var(--theme-primary-soft)] backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]'>
          <div className='relative overflow-hidden border-b border-border p-6 sm:p-9 lg:border-r lg:border-b-0 lg:p-12'>
            <div
              aria-hidden='true'
              className='absolute -top-24 -right-20 size-72 rounded-[42%_58%_55%_45%] bg-primary-soft/70'
            />
            <div className='relative'>
              <div className='flex items-center gap-3'>
                <span className='grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_12px_32px_var(--theme-primary-soft)]'>
                  <BrandMark className='size-6' />
                </span>
                <span className='text-lg font-bold tracking-[-0.02em]'>{tCommon('brand')}</span>
              </div>
              <p className='mt-10 text-xs font-bold tracking-[0.18em] text-primary uppercase'>{t('eyebrow')}</p>
              <h1 className='mt-4 max-w-xl text-4xl leading-tight font-bold tracking-[-0.04em] sm:text-5xl'>
                {t('title')}
              </h1>
              <p className='mt-5 max-w-xl text-base leading-7 text-muted-foreground'>{t('description')}</p>

              <div className='mt-8 rounded-2xl border border-primary/20 bg-primary-soft/60 p-4'>
                <div className='flex gap-3'>
                  <ShieldCheck aria-hidden='true' className='mt-0.5 size-5 shrink-0 text-primary' />
                  <div>
                    <h2 className='font-semibold'>{t('demo.title')}</h2>
                    <p className='mt-1 text-sm leading-6 text-muted-foreground'>{t('demo.description')}</p>
                    <p className='mt-3 text-sm font-semibold text-primary'>
                      {t('demo.password')}: <span className='font-mono'>{demoAccounts[0].password}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                {demoAccounts.map((account) => {
                  const roleLabel = t(`roles.${account.role}.label`)

                  return (
                    <button
                      aria-label={t('account.use', { role: roleLabel })}
                      className='group rounded-2xl border border-border bg-background/70 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                      key={account.role}
                      onClick={() => selectAccount(account)}
                      type='button'
                    >
                      <span className='block text-sm font-bold text-foreground group-hover:text-primary'>
                        {roleLabel}
                      </span>
                      <span className='mt-1 block truncate text-xs text-muted-foreground'>{account.email}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className='flex items-center p-6 sm:p-9 lg:p-12'>
            <form className='w-full' noValidate onSubmit={handleSubmit}>
              <h2 className='text-2xl font-bold tracking-tight'>{t('formTitle')}</h2>
              <p className='mt-2 text-sm leading-6 text-muted-foreground'>{t('account.description')}</p>

              <div className='mt-8'>
                <label className='text-sm font-semibold' htmlFor='login-email'>
                  {t('email.label')}
                </label>
                <input
                  autoComplete='username'
                  className='mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-3 focus:ring-primary-soft'
                  id='login-email'
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setHasError(false)
                  }}
                  placeholder={t('email.placeholder')}
                  type='email'
                  value={email}
                />
              </div>

              <div className='mt-5'>
                <label className='text-sm font-semibold' htmlFor='login-password'>
                  {t('password.label')}
                </label>
                <div className='relative mt-2'>
                  <input
                    aria-describedby={hasError ? 'login-error' : undefined}
                    autoComplete='current-password'
                    className='h-12 w-full rounded-xl border border-border bg-background px-4 pr-12 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-3 focus:ring-primary-soft'
                    id='login-password'
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setHasError(false)
                    }}
                    placeholder={t('password.placeholder')}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                  />
                  <button
                    aria-label={t(showPassword ? 'password.hide' : 'password.show')}
                    className='absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-primary'
                    onClick={() => setShowPassword((visible) => !visible)}
                    type='button'
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden='true' className='size-[1.125rem]' />
                    ) : (
                      <Eye aria-hidden='true' className='size-[1.125rem]' />
                    )}
                  </button>
                </div>
              </div>

              {hasError && (
                <p
                  className='mt-4 rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger'
                  id='login-error'
                  role='alert'
                >
                  {t('invalidCredentials')}
                </p>
              )}

              <button
                className='mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[0_12px_30px_var(--theme-primary-soft)] transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                type='submit'
              >
                {t('submit')}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
