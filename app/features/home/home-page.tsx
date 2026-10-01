import { Layers3, UsersRound } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { LanguageSwitch } from '~/shared/ui/language-switch'
import { ThemeSwitch } from '~/shared/ui/theme-switch'

import { LandingVisual } from './landing-visual'

const lifecycleKeys = ['purchased', 'assigned', 'used', 'needed'] as const

export function HomePage() {
  const { t: tCommon } = useTranslation('common')
  const { i18n, t } = useTranslation('landing')
  const shouldReduceMotion = useReducedMotion()
  const language = i18n.resolvedLanguage ?? 'vi'

  return (
    <div className='relative min-h-screen overflow-hidden bg-background'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -top-36 -left-28 size-[34rem] rounded-[42%_58%_67%_33%/46%_36%_64%_54%] bg-primary-soft opacity-70 blur-3xl'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute right-[-11rem] bottom-[-15rem] size-[38rem] rounded-[57%_43%_36%_64%/49%_62%_38%_51%] bg-primary-soft opacity-55 blur-3xl'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute top-[18%] left-[5%] size-24 rotate-12 rounded-[2rem] border border-primary/15 bg-surface/45 backdrop-blur-xl'
      />

      <header className='relative z-50 flex w-full flex-wrap items-center justify-between gap-4 border-b border-border/55 bg-background/70 px-5 py-5 backdrop-blur-xl'>
        <div className='flex items-center gap-3'>
          <span className='relative grid size-10 place-items-center overflow-hidden rounded-[0.9rem] bg-primary text-primary-foreground shadow-[0_10px_30px_var(--theme-primary-soft)]'>
            <span
              aria-hidden='true'
              className='absolute -top-2 -right-2 size-5 rounded-full bg-primary-foreground/20'
            />
            <Layers3 aria-hidden='true' className='size-5' strokeWidth={2.1} />
          </span>
          <span className='text-lg font-bold tracking-[-0.02em] text-foreground'>{tCommon('brand')}</span>
        </div>

        <nav
          aria-label={t('navigation')}
          className='flex w-full flex-nowrap items-center justify-start gap-2 sm:w-auto sm:justify-end'
        >
          <ThemeSwitch />
          <LanguageSwitch />
          <Link
            className='inline-flex h-10 w-[5.75rem] shrink-0 items-center justify-center rounded-full border border-border bg-surface/80 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            to='/login'
          >
            {t('actions.login')}
          </Link>
        </nav>
      </header>

      <main className='relative z-10 mx-auto flex w-full max-w-7xl items-center px-5 pt-6 pb-14 sm:px-8 sm:pt-10 lg:min-h-[calc(100vh-108px)] lg:px-10 lg:pt-0 lg:pb-16'>
        <section className='grid min-w-0 w-full max-w-[calc(100vw-2.5rem)] grid-cols-[minmax(0,1fr)] items-center gap-12 sm:max-w-none lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:gap-10 xl:gap-20'>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='mx-auto min-w-0 w-full max-w-full text-center sm:max-w-2xl lg:mx-0 lg:text-left'
            initial={shouldReduceMotion ? false : { opacity: 0.45, y: 5 }}
            key={language}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className='inline-flex max-w-full items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3.5 py-2 text-xs font-semibold tracking-[0.12em] whitespace-normal text-primary uppercase'>
              <span className='size-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--theme-primary)]' />
              <span className='min-w-0'>{t('eyebrow')}</span>
            </div>

            <h1
              aria-label={t('title')}
              className='mt-6 text-4xl leading-[1.08] font-bold tracking-[-0.045em] text-balance text-foreground sm:text-5xl xl:text-[4.35rem]'
            >
              <span aria-hidden='true' className='block'>
                {t('titleLead')}
              </span>
              <span aria-hidden='true' className='relative mt-1 inline-block text-primary'>
                <span className='relative z-10'>{t('titleAccent')}</span>
                <span className='absolute right-0 bottom-[0.04em] left-0 h-[0.16em] -rotate-1 rounded-full bg-primary-soft' />
              </span>
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

            <div className='mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4'>
              {lifecycleKeys.map((key, index) => (
                <div
                  className='flex min-w-0 items-center gap-2 rounded-xl border border-border bg-surface/75 px-3 py-2.5 text-sm font-semibold text-foreground backdrop-blur'
                  key={key}
                >
                  <span className='grid size-5 place-items-center rounded-md bg-primary-soft text-[0.65rem] font-bold text-primary'>
                    {index + 1}
                  </span>
                  {t(`lifecycle.${key}`)}
                </div>
              ))}
            </div>
          </motion.div>

          <LandingVisual />
        </section>
      </main>
    </div>
  )
}
