import { ArrowUpRight, Braces, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { LanguageSwitch } from '~/shared/ui/language-switch'
import { ThemeSwitch } from '~/shared/ui/theme-switch'

import { LandingVisual } from './landing-visual'

const lifecycleKeys = ['purchased', 'assigned', 'used', 'needed'] as const

export function HomePage() {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('landing')

  return (
    <div className='relative min-h-screen overflow-hidden bg-background'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--theme-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--theme-border)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.22] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -top-32 -left-36 size-[32rem] rounded-full bg-primary-soft opacity-65 blur-3xl'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute right-[-12rem] bottom-[-16rem] size-[38rem] rounded-full bg-primary-soft opacity-50 blur-3xl'
      />

      <header className='relative z-50 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10 lg:py-7'>
        <div className='flex items-center gap-3'>
          <span className='grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_10px_30px_var(--theme-primary-soft)]'>
            <Braces aria-hidden='true' className='size-5' strokeWidth={2.2} />
          </span>
          <span className='text-lg font-bold tracking-[-0.02em] text-foreground'>{tCommon('brand')}</span>
        </div>

        <nav aria-label={t('navigation')} className='flex flex-wrap items-center justify-end gap-2 sm:gap-2.5'>
          <ThemeSwitch />
          <LanguageSwitch />
          <button
            className='inline-flex h-10 items-center justify-center rounded-full border border-border bg-surface/80 px-4 text-sm font-semibold text-foreground backdrop-blur transition hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            type='button'
          >
            {t('actions.login')}
          </button>
          <button
            className='group inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_var(--theme-primary-soft)] transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            type='button'
          >
            {t('actions.register')}
            <ArrowUpRight
              aria-hidden='true'
              className='size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
            />
          </button>
        </nav>
      </header>

      <main className='relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 pt-6 pb-14 sm:px-8 sm:pt-10 lg:min-h-[calc(100vh-108px)] lg:px-10 lg:pt-0 lg:pb-16'>
        <section className='grid min-w-0 w-full grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:gap-10 xl:gap-20'>
          <div className='mx-auto min-w-0 w-full max-w-full text-center sm:max-w-2xl lg:mx-0 lg:text-left'>
            <div className='inline-flex max-w-full items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3.5 py-2 text-xs font-semibold tracking-[0.12em] whitespace-normal text-primary uppercase'>
              <span className='size-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--theme-primary)]' />
              <span>{t('eyebrow')}</span>
            </div>

            <h1 className='mt-6 text-4xl leading-[1.08] font-bold tracking-[-0.045em] text-balance text-foreground sm:text-5xl xl:text-[4.35rem]'>
              {t('title')}
            </h1>
            <p className='mx-auto mt-6 max-w-xl text-base leading-7 text-pretty text-muted-foreground sm:text-lg sm:leading-8 lg:mx-0'>
              {t('description')}
            </p>

            <div className='mt-7 flex items-start justify-center gap-3 text-left lg:justify-start'>
              <span className='mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-surface text-primary'>
                <UsersRound aria-hidden='true' className='size-[1.125rem]' />
              </span>
              <p className='max-w-lg text-sm leading-6 text-muted-foreground'>{t('audience')}</p>
            </div>

            <div className='mt-8 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:justify-center lg:justify-start'>
              {lifecycleKeys.map((key, index) => (
                <div
                  className='flex items-center gap-2 rounded-xl border border-border bg-surface/75 px-3 py-2.5 text-sm font-semibold text-foreground backdrop-blur'
                  key={key}
                >
                  <span className='grid size-5 place-items-center rounded-md bg-primary-soft text-[0.65rem] font-bold text-primary'>
                    {index + 1}
                  </span>
                  {t(`lifecycle.${key}`)}
                </div>
              ))}
            </div>
          </div>

          <LandingVisual />
        </section>
      </main>
    </div>
  )
}
