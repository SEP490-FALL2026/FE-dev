import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { EmployeeSoftwareItem } from '../../employee-data'
import type { EmployeeTabKey } from '../../employee-nav'

interface EmployeeUsageSummaryCardProps {
  averageUsage: number
  employeeSoftwareCount: number
  formatNumber: (value: number) => string
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  usageChartItems: EmployeeSoftwareItem[]
}

export function EmployeeUsageSummaryCard({
  averageUsage,
  employeeSoftwareCount,
  formatNumber,
  onSelectTab,
  usageChartItems
}: EmployeeUsageSummaryCardProps) {
  const { t } = useTranslation('dashboard')

  return (
    <section
      aria-labelledby='employee-usage-title'
      className='rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6'
    >
      <div className='flex flex-wrap items-start justify-between gap-3 border-b border-border pb-5'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='grid size-9 place-items-center rounded-lg bg-primary-soft text-primary'>
              <Sparkles aria-hidden='true' className='size-4' />
            </span>
            <h2 className='text-lg font-bold text-foreground' id='employee-usage-title'>
              {t('employee.overview.usageSummary.title')}
            </h2>
          </div>
          <p className='mt-2 text-sm text-muted-foreground'>{t('employee.overview.usageSummary.description')}</p>
        </div>
        <button
          className='inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-semibold text-primary-ink transition hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
          onClick={() => onSelectTab('my-software')}
          type='button'
        >
          {t('employee.mySoftware.filterAll')}
          <ArrowRight aria-hidden='true' className='size-4' />
        </button>
      </div>

      <div className='grid gap-6 pt-6 xl:grid-cols-[minmax(0,1fr)_17rem] xl:gap-10'>
        <figure aria-labelledby='employee-usage-title' className='min-w-0'>
          <div className='space-y-4'>
            {usageChartItems.map((item) => (
              <div
                className='grid grid-cols-[6.5rem_minmax(0,1fr)_3rem] items-center gap-3 sm:grid-cols-[9rem_minmax(0,1fr)_3.5rem]'
                key={item.id}
              >
                <span className='truncate text-sm font-semibold text-foreground' title={item.name}>
                  {item.name}
                </span>
                <div aria-hidden='true' className='h-4 overflow-hidden rounded-full bg-primary-soft/60'>
                  <div
                    className='h-full rounded-full bg-primary'
                    style={{ width: `${Math.max(0, Math.min(item.usage, 100))}%` }}
                  />
                </div>
                <span className='text-right text-sm font-bold tabular-nums text-foreground'>
                  {t('employee.overview.usageSummary.percentFormat', { value: formatNumber(item.usage) })}
                </span>
              </div>
            ))}
          </div>
          <div
            aria-hidden='true'
            className='ml-[7.25rem] mt-3 flex justify-between text-xs text-muted-foreground sm:ml-[9.75rem]'
          >
            {[0, 50, 100].map((value) => (
              <span key={value}>
                {t('employee.overview.usageSummary.percentFormat', { value: formatNumber(value) })}
              </span>
            ))}
          </div>
          <figcaption className='mt-4 text-xs leading-relaxed text-muted-foreground'>
            {t('employee.overview.usageSummary.sampleNote')}
          </figcaption>
        </figure>

        <div className='flex flex-col justify-center rounded-2xl border border-primary/20 bg-primary-soft/40 p-5'>
          <p className='text-sm font-semibold text-primary-ink'>{t('employee.overview.usageSummary.averageLabel')}</p>
          <p className='mt-2 text-5xl font-bold tracking-tight tabular-nums text-foreground'>
            {t('employee.overview.usageSummary.percentFormat', { value: formatNumber(averageUsage) })}
          </p>
          <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
            {t('employee.overview.usageSummary.averageContext', { count: employeeSoftwareCount })}
          </p>
        </div>
      </div>
    </section>
  )
}
