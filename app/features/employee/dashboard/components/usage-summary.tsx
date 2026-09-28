import { useTranslation } from 'react-i18next'

interface UsageLegendItem {
  labelKey: string
  count: number
  percentage: number
  color: string
}

interface UsageSummaryProps {
  averageUsage: number
  legend: UsageLegendItem[]
}

export function UsageSummary({ averageUsage, legend }: UsageSummaryProps) {
  const { t } = useTranslation()

  // Build conic-gradient from legend data
  const gradientSegments = legend.reduce<{ segments: string[]; offset: number }>(
    (acc, item) => {
      const end = acc.offset + item.percentage
      acc.segments.push(`${item.color} ${acc.offset}% ${end}%`)
      return { segments: acc.segments, offset: end }
    },
    { segments: [], offset: 0 }
  )

  return (
    <section className='rounded-xl border border-neutral-200 bg-white p-5 shadow-sm'>
      <h3 className='mb-4 font-semibold text-neutral-900'>{t('dashboard.usageSummary.title')}</h3>

      <div className='flex items-center gap-6'>
        {/* Donut chart */}
        <div
          className='relative flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-full'
          style={{ background: `conic-gradient(${gradientSegments.segments.join(', ')})` }}
        >
          <div className='absolute h-[90px] w-[90px] rounded-full bg-white' />
          <div className='relative z-10 text-center'>
            <span className='block text-2xl font-bold leading-none text-neutral-900'>{averageUsage}%</span>
            <span className='text-[10px] text-neutral-500'>{t('dashboard.usageSummary.avgUsage')}</span>
          </div>
        </div>

        {/* Legend */}
        <div className='flex-1 space-y-3'>
          {legend.map((item) => (
            <div className='flex items-center justify-between text-xs' key={item.labelKey}>
              <div className='flex items-center gap-2'>
                <span className='block h-2.5 w-2.5 rounded-full' style={{ backgroundColor: item.color }} />
                <span className='font-medium text-neutral-500'>{t(item.labelKey)}</span>
              </div>
              <span className='font-semibold text-neutral-900'>
                {item.count} <span className='font-normal text-neutral-500/70'>({item.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
