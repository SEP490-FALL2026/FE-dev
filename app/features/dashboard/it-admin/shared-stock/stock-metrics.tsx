import { useTranslation } from 'react-i18next'
import { useDashboardFormat } from '../../dashboard-ui'

export type StockMetric = { label: string; value: number | null; highlight?: boolean }

export function StockMetrics({ items }: { items: StockMetric[] }) {
  const { t } = useTranslation('itAdmin')
  const { formatNumber } = useDashboardFormat()
  return (
    <dl className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
      {items.map(({ label, value, highlight }) => (
        <div
          key={label}
          className={`min-w-0 rounded-md px-3 py-2.5 ${highlight ? 'bg-primary-soft text-primary-ink' : 'bg-surface-subtle'}`}
        >
          <dt className='text-xs font-medium'>{label}</dt>
          <dd className='mt-1 break-words font-mono text-xl font-semibold tabular-nums'>
            {value == null ? t('unknown') : formatNumber(value)}
          </dd>
        </div>
      ))}
    </dl>
  )
}
