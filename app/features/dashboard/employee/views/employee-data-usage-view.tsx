import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeDataUsageViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}

export function EmployeeDataUsageView({ onSelectTab }: EmployeeDataUsageViewProps) {
  const { t } = useTranslation('dashboard')

  const monitoredDomains = [
    { activeMinutes: 1420, category: 'Design', domain: 'figma.com', lastActive: 'Hôm nay 11:30' },
    { activeMinutes: 2850, category: 'Development', domain: 'github.com', lastActive: 'Hôm nay 12:15' },
    { activeMinutes: 980, category: 'Productivity', domain: 'atlassian.net', lastActive: 'Hôm qua 17:00' },
    { activeMinutes: 620, category: 'Communication', domain: 'notion.so', lastActive: '26/09/2026' }
  ]

  return (
    <div className='mx-auto max-w-5xl space-y-6'>
      {/* Header */}
      <div>
        <button
          className='inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground'
          onClick={() => onSelectTab('profile')}
          type='button'
        >
          <ArrowLeft aria-hidden='true' className='size-4' />
          <span>{t('employee.dataUsage.backToProfile')}</span>
        </button>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.dataUsage.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.dataUsage.subtitle')}</p>
      </div>

      {/* Metrics Row */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <p className='text-xs font-semibold text-muted-foreground'>{t('employee.dataUsage.metricMonitored')}</p>
          <p className='mt-2 text-2xl font-bold text-primary'>{6}</p>
        </div>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <p className='text-xs font-semibold text-muted-foreground'>{t('employee.dataUsage.metricExcluded')}</p>
          <p className='mt-2 text-2xl font-bold text-success'>
            {t('employee.dataUsage.excludedAppsValue', { count: 5 })}
          </p>
        </div>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <p className='text-xs font-semibold text-muted-foreground'>{t('employee.dataUsage.metricRetention')}</p>
          <p className='mt-2 text-2xl font-bold text-foreground'>
            {t('employee.dataUsage.retentionDaysValue', { days: 90 })}
          </p>
        </div>
      </div>

      {/* Privacy Guarantee Box */}
      <div className='rounded-2xl border border-primary/20 bg-primary-soft/40 p-5 flex items-start gap-4'>
        <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground'>
          <ShieldCheck aria-hidden='true' className='size-6' />
        </span>
        <div>
          <h2 className='text-sm font-bold text-foreground'>{t('employee.dataUsage.privacyGuaranteesTitle')}</h2>
          <p className='mt-1 text-xs text-muted-foreground leading-relaxed'>
            {t('employee.dataUsage.privacyGuaranteesDesc')}
          </p>
        </div>
      </div>

      {/* Monitored Domains Table */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <h2 className='text-sm font-bold text-foreground mb-4'>{t('employee.dataUsage.monitoredAppsTitle')}</h2>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs whitespace-nowrap'>
            <thead className='border-b border-border bg-surface-subtle/50 text-muted-foreground'>
              <tr>
                <th className='py-3 px-4 font-semibold'>{t('employee.dataUsage.colDomain')}</th>
                <th className='py-3 px-4 font-semibold'>{t('employee.dataUsage.colCategory')}</th>
                <th className='py-3 px-4 font-semibold'>{t('employee.dataUsage.colTotalActive')}</th>
                <th className='py-3 px-4 font-semibold'>{t('employee.dataUsage.colLastSync')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('employee.dataUsage.colContentProtection')}</th>
              </tr>
            </thead>
            <tbody className='divide-y border-border/60'>
              {monitoredDomains.map((d) => (
                <tr className='group transition hover:bg-surface-subtle/40' key={d.domain}>
                  <td className='py-3.5 px-4 font-mono font-bold text-foreground'>{d.domain}</td>
                  <td className='py-3.5 px-4 text-muted-foreground'>{d.category}</td>
                  <td className='py-3.5 px-4 font-medium text-foreground'>
                    {t('employee.dataUsage.activeMinutesFormatted', {
                      hours: (d.activeMinutes / 60).toFixed(1),
                      minutes: d.activeMinutes
                    })}
                  </td>
                  <td className='py-3.5 px-4 text-muted-foreground'>{d.lastActive}</td>
                  <td className='py-3.5 px-4 text-right'>
                    <span className='inline-flex items-center gap-1 text-[0.7rem] font-bold text-success'>
                      <CheckCircle2 aria-hidden='true' className='size-3.5' />
                      <span>{t('employee.dataUsage.contentProtected')}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
