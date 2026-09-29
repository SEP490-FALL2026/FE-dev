import { CalendarDays, CircleCheck, Ghost, Monitor, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function SoftwareMetrics() {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const percent = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'percent', maximumFractionDigits: 0 })
  const metrics = [
    { key: 'software', value: 8, icon: Monitor, tone: 'bg-brand-100 text-brand-600', hint: t('teamSoftware.across') },
    {
      key: 'total',
      value: 31,
      icon: CircleCheck,
      tone: 'bg-brand-100 text-brand-600',
      hint: t('teamSoftware.allocated')
    },
    {
      key: 'inUse',
      value: 28,
      icon: UsersRound,
      tone: 'bg-brand-100 text-brand-600',
      hint: t('teamSoftware.inUseHint', { value: percent.format(28 / 31) })
    },
    {
      key: 'available',
      value: 3,
      icon: CalendarDays,
      tone: 'bg-brand-100 text-brand-600',
      hint: t('teamSoftware.availableHint', { value: percent.format(3 / 31) })
    },
    { key: 'ghost', value: 3, icon: Ghost, tone: 'bg-brand-100 text-brand-600', hint: t('teamSoftware.needsReview') }
  ] as const
  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
      {metrics.map(({ key, value, icon: Icon, tone, hint }) => (
        <section
          key={key}
          className='flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm'
        >
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tone}`}>
            <Icon size={20} aria-hidden='true' />
          </span>
          <div>
            <h2 className='mb-1 text-xs font-medium text-neutral-500'>{t(`teamSoftware.metrics.${key}`)}</h2>
            <p className='mb-1 text-2xl font-bold tabular-nums'>{number.format(value)}</p>
            <p className='text-xs text-neutral-500'>{hint}</p>
          </div>
        </section>
      ))}
    </div>
  )
}
