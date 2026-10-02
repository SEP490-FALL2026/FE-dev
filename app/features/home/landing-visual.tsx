import {
  Activity,
  BellRing,
  CircleCheckBig,
  DatabaseZap,
  Flower2,
  Layers3,
  ReceiptText,
  UserRoundCheck,
  WalletCards
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'

const lifecycleNodes = [
  {
    className: 'left-[4%] top-[15%]',
    icon: ReceiptText,
    key: 'purchased'
  },
  {
    className: 'right-[2%] top-[19%]',
    icon: UserRoundCheck,
    key: 'assigned'
  },
  {
    className: 'bottom-[15%] left-[7%]',
    icon: Activity,
    key: 'used'
  },
  {
    className: 'right-[2%] bottom-[17%]',
    icon: CircleCheckBig,
    key: 'needed'
  }
] as const

const evidencePaths = [
  'M104 118 C190 132 190 244 294 292',
  'M502 132 C408 142 410 246 306 292',
  'M112 472 C198 454 198 350 294 308',
  'M500 466 C412 450 410 350 306 308'
] as const

export function LandingVisual() {
  const { t } = useTranslation('landing')
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden='true'
      className='relative mx-auto aspect-square min-w-0 w-full max-w-full select-none sm:max-w-[590px] lg:max-w-none'
    >
      <motion.div
        animate={shouldReduceMotion ? undefined : { rotate: [2, 5, 2], y: [0, -5, 0] }}
        className='absolute inset-[7%] rotate-2 rounded-[33%_67%_48%_52%/50%_38%_62%_50%] border border-border/70 bg-surface-subtle/70'
        transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        animate={shouldReduceMotion ? undefined : { rotate: [-4, -1, -4], scale: [0.98, 1.02, 0.98] }}
        className='absolute inset-[14%] -rotate-4 rounded-[62%_38%_58%_42%/42%_57%_43%_58%] bg-primary-soft/70 blur-sm'
        transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
      />
      <div className='absolute top-[9%] right-[13%] grid size-11 place-items-center rounded-full border border-border bg-surface text-primary shadow-lg'>
        <Flower2 className='size-5' strokeWidth={1.7} />
      </div>
      <div className='absolute bottom-[9%] left-[17%] flex gap-1.5'>
        <span className='size-2 rounded-full bg-primary' />
        <span className='size-2 rounded-full bg-warning' />
        <span className='size-2 rounded-full bg-info' />
      </div>

      <svg className='absolute inset-[6%] size-[88%] overflow-visible text-primary/35' viewBox='0 0 600 600'>
        {evidencePaths.map((path, index) => (
          <motion.path
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: [0.25, 0.75, 0.25],
                    pathLength: [0.35, 1, 0.35]
                  }
            }
            d={path}
            fill='none'
            key={path}
            stroke='currentColor'
            strokeDasharray='5 9'
            strokeLinecap='round'
            strokeWidth='2'
            transition={{ delay: index * 0.45, duration: 4.8, ease: 'easeInOut', repeat: Infinity }}
          />
        ))}
      </svg>

      <motion.div
        animate={shouldReduceMotion ? undefined : { rotate: [5, 8, 5], y: [0, -5, 0] }}
        className='absolute top-1/2 left-1/2 z-10 h-[11.5rem] w-[10.5rem] -translate-x-1/2 -translate-y-1/2 rotate-6 rounded-[2.25rem] bg-primary-soft'
        transition={{ duration: 6.5, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        animate={shouldReduceMotion ? undefined : { rotate: [-4, -7, -4], y: [0, 5, 0] }}
        className='absolute top-1/2 left-1/2 z-10 h-[11.5rem] w-[10.5rem] -translate-x-1/2 -translate-y-1/2 -rotate-5 rounded-[2.25rem] border border-border bg-surface-subtle'
        transition={{ duration: 7.2, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
        className='absolute top-1/2 left-1/2 z-20 flex h-48 w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[2.25rem] border border-primary/30 bg-surface/95 p-5 text-center shadow-[0_28px_80px_var(--theme-primary-soft)] backdrop-blur-xl'
        transition={{ duration: 5.4, ease: 'easeInOut', repeat: Infinity }}
      >
        <div className='relative grid size-12 place-items-center overflow-hidden rounded-2xl bg-primary text-primary-foreground'>
          <span className='absolute -top-2 -right-2 size-5 rounded-full bg-primary-foreground/20' />
          <Layers3 className='size-6' strokeWidth={1.8} />
        </div>
        <p className='mt-3 min-h-8 text-xs leading-4 font-semibold tracking-[0.08em] text-primary uppercase'>
          {t('visual.controlCenter')}
        </p>
        <div className='mt-2 flex min-h-9 items-start justify-center gap-1.5 text-[0.65rem] leading-4 font-medium text-muted-foreground'>
          <span className='mt-1 size-1.5 shrink-0 rounded-full bg-success' />
          <span>{t('visual.systemOnline')}</span>
        </div>
      </motion.div>

      {lifecycleNodes.map(({ className, icon: Icon, key }, index) => (
        <motion.div
          animate={shouldReduceMotion ? undefined : { rotate: [0, index % 2 === 0 ? -1.5 : 1.5, 0], y: [0, -7, 0] }}
          className={`absolute z-30 flex h-[4.25rem] w-[8.25rem] items-center gap-2.5 rounded-2xl border border-border bg-surface/95 px-3 shadow-[0_16px_45px_var(--theme-primary-soft)] backdrop-blur-xl ${className}`}
          key={key}
          transition={{ delay: index * 0.35, duration: 4.8 + index * 0.3, ease: 'easeInOut', repeat: Infinity }}
        >
          <span className='grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary'>
            <Icon className='size-[1.125rem]' strokeWidth={1.9} />
          </span>
          <span className='min-w-0 text-xs leading-4 font-semibold text-foreground'>{t(`lifecycle.${key}`)}</span>
        </motion.div>
      ))}

      <motion.div
        animate={shouldReduceMotion ? undefined : { x: [0, 5, 0], y: [0, -4, 0] }}
        className='absolute top-[44%] left-0 z-30 hidden h-10 w-[8.5rem] items-center gap-2 rounded-xl border border-border bg-surface/90 px-3 text-[0.68rem] leading-4 font-medium text-muted-foreground shadow-lg backdrop-blur md:flex'
        transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
      >
        <WalletCards className='size-4 shrink-0 text-success' />
        {t('visual.availableSeats')}
      </motion.div>

      <motion.div
        animate={shouldReduceMotion ? undefined : { x: [0, -5, 0], y: [0, 4, 0] }}
        className='absolute top-[46%] right-0 z-30 hidden h-10 w-[8.75rem] items-center gap-2 rounded-xl border border-border bg-surface/90 px-3 text-[0.68rem] leading-4 font-medium text-muted-foreground shadow-lg backdrop-blur md:flex'
        transition={{ delay: 0.8, duration: 5, ease: 'easeInOut', repeat: Infinity }}
      >
        <BellRing className='size-4 shrink-0 text-warning' />
        {t('visual.renewalAttention')}
      </motion.div>

      <motion.div
        animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
        className='absolute bottom-[2%] left-1/2 z-30 hidden h-10 w-[9.25rem] -translate-x-1/2 items-center justify-center gap-2 rounded-xl border border-border bg-surface/90 px-3 text-[0.68rem] leading-4 font-medium text-muted-foreground shadow-lg backdrop-blur sm:flex'
        transition={{ delay: 1.4, duration: 4.7, ease: 'easeInOut', repeat: Infinity }}
      >
        <DatabaseZap className='size-4 shrink-0 text-info' />
        {t('visual.evidenceReady')}
      </motion.div>
    </div>
  )
}
