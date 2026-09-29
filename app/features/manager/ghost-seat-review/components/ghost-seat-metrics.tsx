import { CircleCheck, Ghost, PiggyBank, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function GhostSeatMetrics() {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const cards = [
    { key: 'total', value: number.format(24), icon: Ghost },
    { key: 'pending', value: number.format(18), icon: CircleCheck },
    { key: 'critical', value: number.format(6), icon: TriangleAlert },
    {
      key: 'savings',
      value: new Intl.NumberFormat(i18n.resolvedLanguage, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(4320),
      icon: PiggyBank
    }
  ] as const
  return (
    <section aria-label={t('ghostSeat.overview')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {cards.map(({ key, value, icon: Icon }) => (
        <div key={key} className='flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm'>
          <span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600'>
            <Icon size={22} aria-hidden='true' />
          </span>
          <div>
            <p className='text-xs font-medium text-neutral-500'>{t(`ghostSeat.metrics.${key}`)}</p>
            <p className='mt-1 text-2xl font-bold'>{value}</p>
            <p className='mt-1 text-xs text-neutral-500'>{t(`ghostSeat.metrics.${key}Hint`)}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
