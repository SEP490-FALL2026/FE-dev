import { UsersRound, Layers, ClipboardCheck, CircleCheck, ShieldCheck, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const metrics = [
  { key: 'scope', value: 31, icon: UsersRound },
  { key: 'assignments', value: 68, icon: Layers },
  { key: 'pending', value: 25, icon: ClipboardCheck },
  { key: 'reviewed', value: 12, icon: CircleCheck },
  { key: 'exempt', value: 2, icon: ShieldCheck },
  { key: 'overdue', value: 11, icon: Clock }
] as const

export function AccessReviewMetrics() {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  return (
    <section
      aria-label={t('accessReview.overview')}
      className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6'
    >
      {metrics.map((metric) => (
        <div
          key={metric.key}
          className={`rounded-xl border bg-white p-5 shadow-sm ${metric.key === 'pending' ? 'border-brand-500 border-l-4' : 'border-neutral-200'}`}
        >
          <div className='flex items-center justify-between gap-2 text-sm text-neutral-500'>
            <h2>{t(`accessReview.metrics.${metric.key}`)}</h2>
            <metric.icon size={18} aria-hidden='true' className='shrink-0 text-brand-500' />
          </div>
          <p className='mt-3 text-3xl font-bold'>{number.format(metric.value)}</p>
          <p className='mt-2 text-xs text-neutral-500'>
            {t(`accessReview.metricNotes.${metric.key}`, {
              value: number.format(8),
              percent: new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'percent' }).format(0.37)
            })}
          </p>
        </div>
      ))}
    </section>
  )
}
