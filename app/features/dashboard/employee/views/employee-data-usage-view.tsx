import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmployeePreviewNotice } from '../employee-preview-notice'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeDataUsageViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}

export function EmployeeDataUsageView({ onSelectTab }: EmployeeDataUsageViewProps) {
  const { i18n, t } = useTranslation('dashboard')
  const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN'
  const formatSampleDate = (value: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  const formatUsage = (minutes: number) =>
    t('employee.dataUsage.activeMinutesFormatted', {
      hours: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(minutes / 60),
      minutes: new Intl.NumberFormat(locale).format(minutes)
    })

  const monitoredDomains = [
    { activeMinutes: 1420, category: 'design', domain: 'figma.com', lastActive: '2026-09-28T11:30:00' },
    { activeMinutes: 2850, category: 'development', domain: 'github.com', lastActive: '2026-09-28T12:15:00' },
    { activeMinutes: 980, category: 'productivity', domain: 'atlassian.net', lastActive: '2026-09-27T17:00:00' },
    { activeMinutes: 620, category: 'communication', domain: 'notion.so', lastActive: '2026-09-26T09:00:00' }
  ] as const

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

      <EmployeePreviewNotice>{t('employee.preview.usage')}</EmployeePreviewNotice>

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
        <div className='grid gap-3 md:hidden'>
          {monitoredDomains.map((domain) => (
            <article className='rounded-xl border border-border bg-surface-subtle/40 p-4' key={domain.domain}>
              <h3 className='font-mono text-base font-bold text-foreground'>{domain.domain}</h3>
              <p className='mt-1 text-sm text-muted-foreground'>
                {t(`employee.dataUsage.categories.${domain.category}`)}
              </p>
              <dl className='mt-3 grid grid-cols-2 gap-3 text-sm'>
                <div>
                  <dt className='text-muted-foreground'>{t('employee.dataUsage.colTotalActive')}</dt>
                  <dd className='mt-1 font-semibold text-foreground'>{formatUsage(domain.activeMinutes)}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{t('employee.dataUsage.colLastSync')}</dt>
                  <dd className='mt-1 font-semibold text-foreground'>{formatSampleDate(domain.lastActive)}</dd>
                </div>
              </dl>
              <p className='mt-3 inline-flex items-center gap-1 text-sm font-semibold text-success-ink'>
                <CheckCircle2 aria-hidden='true' className='size-4' />
                {t('employee.dataUsage.contentProtected')}
              </p>
            </article>
          ))}
        </div>
        <div className='hidden overflow-x-auto md:block'>
          <table className='w-full text-left text-sm whitespace-nowrap'>
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
                  <td className='py-3.5 px-4 text-muted-foreground'>
                    {t(`employee.dataUsage.categories.${d.category}`)}
                  </td>
                  <td className='py-3.5 px-4 font-medium text-foreground'>{formatUsage(d.activeMinutes)}</td>
                  <td className='py-3.5 px-4 text-muted-foreground'>{formatSampleDate(d.lastActive)}</td>
                  <td className='py-3.5 px-4 text-right'>
                    <span className='inline-flex items-center gap-1 text-sm font-bold text-success-ink'>
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
