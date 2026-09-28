import {
  Activity,
  BellRing,
  CircleCheckBig,
  DatabaseZap,
  ReceiptText,
  ShieldCheck,
  UserRoundCheck,
  WalletCards
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'

const lifecycleNodes = [
  {
    className: 'left-[7%] top-[16%]',
    icon: ReceiptText,
    key: 'purchased'
  },
  {
    className: 'right-[5%] top-[18%]',
    icon: UserRoundCheck,
    key: 'assigned'
  },
  {
    className: 'bottom-[16%] left-[7%]',
    icon: Activity,
    key: 'used'
  },
  {
    className: 'right-[4%] bottom-[18%]',
    icon: CircleCheckBig,
    key: 'needed'
  }
] as const

export function LandingVisual() {
  const { t } = useTranslation('landing')
  const shouldReduceMotion = useReducedMotion()

  const orbitTransition = shouldReduceMotion
    ? undefined
    : {
        duration: 24,
        ease: 'linear' as const,
        repeat: Infinity
      }

  return (
    <div
      aria-hidden='true'
      className='relative mx-auto aspect-square min-w-0 w-full max-w-full select-none sm:max-w-[590px] lg:max-w-none'
    >
      <motion.div
        animate={shouldReduceMotion ? undefined : { opacity: [0.45, 0.75, 0.45], scale: [0.94, 1.05, 0.94] }}
        className='absolute inset-[13%] rounded-full bg-primary-soft blur-3xl'
        transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
      />

      <div className='absolute inset-[8%] rounded-full border border-border/70' />
      <motion.div
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        className='absolute inset-[15%] rounded-full border border-dashed border-primary/45'
        transition={orbitTransition}
      />
      <motion.div
        animate={shouldReduceMotion ? undefined : { rotate: -360 }}
        className='absolute inset-[25%] rounded-full border border-dashed border-info/35'
        transition={shouldReduceMotion ? undefined : { ...orbitTransition, duration: 18 }}
      />

      <div className='absolute inset-x-[17%] top-1/2 h-px bg-linear-to-r from-transparent via-border to-transparent' />
      <div className='absolute inset-y-[17%] left-1/2 w-px bg-linear-to-b from-transparent via-border to-transparent' />

      {!shouldReduceMotion && (
        <>
          <motion.span
            animate={{ left: ['20%', '79%'], opacity: [0, 1, 0] }}
            className='absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_18px_var(--theme-primary)]'
            transition={{ duration: 3.8, ease: 'easeInOut', repeat: Infinity }}
          />
          <motion.span
            animate={{ opacity: [0, 1, 0], top: ['21%', '78%'] }}
            className='absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-info shadow-[0_0_18px_var(--theme-info)]'
            transition={{ delay: 1.2, duration: 4.2, ease: 'easeInOut', repeat: Infinity }}
          />
        </>
      )}

      <motion.div
        animate={shouldReduceMotion ? undefined : { y: [0, -7, 0] }}
        className='absolute top-1/2 left-1/2 z-20 flex size-[31%] min-h-36 min-w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[2rem] border border-primary/35 bg-surface/90 p-5 text-center shadow-[0_26px_80px_var(--theme-primary-soft)] backdrop-blur-xl'
        transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : { boxShadow: ['0 0 0 0 var(--theme-primary-soft)', '0 0 0 14px transparent'] }
          }
          className='grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground'
          transition={{ duration: 2.4, ease: 'easeOut', repeat: Infinity }}
        >
          <ShieldCheck className='size-6' strokeWidth={1.8} />
        </motion.div>
        <p className='mt-3 text-xs font-semibold tracking-[0.18em] text-primary uppercase'>
          {t('visual.controlCenter')}
        </p>
        <div className='mt-2 flex items-center gap-1.5 text-[0.65rem] font-medium text-muted-foreground'>
          <span className='size-1.5 rounded-full bg-success' />
          {t('visual.systemOnline')}
        </div>
      </motion.div>

      {lifecycleNodes.map(({ className, icon: Icon, key }, index) => (
        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, index % 2 === 0 ? -8 : 8, 0] }}
          className={`absolute z-30 flex min-w-[7.5rem] items-center gap-2.5 rounded-2xl border border-border bg-surface/90 px-3.5 py-3 shadow-[0_16px_45px_var(--theme-primary-soft)] backdrop-blur-xl ${className}`}
          key={key}
          transition={{ delay: index * 0.4, duration: 4 + index * 0.35, ease: 'easeInOut', repeat: Infinity }}
        >
          <span className='grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary'>
            <Icon className='size-[1.125rem]' strokeWidth={1.9} />
          </span>
          <span className='text-xs font-semibold whitespace-nowrap text-foreground'>{t(`lifecycle.${key}`)}</span>
        </motion.div>
      ))}

      <motion.div
        animate={shouldReduceMotion ? undefined : { x: [0, 6, 0], y: [0, -4, 0] }}
        className='absolute top-[43%] left-0 z-30 hidden items-center gap-2 rounded-xl border border-border bg-surface/85 px-3 py-2 text-[0.68rem] font-medium text-muted-foreground shadow-lg backdrop-blur md:flex'
        transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
      >
        <WalletCards className='size-4 text-success' />
        {t('visual.availableSeats')}
      </motion.div>

      <motion.div
        animate={shouldReduceMotion ? undefined : { x: [0, -6, 0], y: [0, 5, 0] }}
        className='absolute top-[45%] right-0 z-30 hidden items-center gap-2 rounded-xl border border-border bg-surface/85 px-3 py-2 text-[0.68rem] font-medium text-muted-foreground shadow-lg backdrop-blur md:flex'
        transition={{ delay: 0.8, duration: 5, ease: 'easeInOut', repeat: Infinity }}
      >
        <BellRing className='size-4 text-warning' />
        {t('visual.renewalAttention')}
      </motion.div>

      <motion.div
        animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
        className='absolute bottom-[3%] left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 rounded-xl border border-border bg-surface/85 px-3 py-2 text-[0.68rem] font-medium whitespace-nowrap text-muted-foreground shadow-lg backdrop-blur sm:flex'
        transition={{ delay: 1.4, duration: 4.7, ease: 'easeInOut', repeat: Infinity }}
      >
        <DatabaseZap className='size-4 text-info' />
        {t('visual.evidenceReady')}
      </motion.div>
    </div>
  )
}
