import { Activity, Check, Clock, Cpu, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { UsageMetric } from '../data-usage.types'

export function DataUsageMetricsGrid() {
  const { t } = useTranslation()

  const metrics: UsageMetric[] = [
    {
      id: 'monitoredApps',
      label: t('dataUsage.metrics.monitoredApps.label'),
      value: t('dataUsage.metrics.monitoredApps.value'),
      suffix: t('dataUsage.metrics.monitoredApps.suffix'),
      sub: t('dataUsage.metrics.monitoredApps.sub'),
      icon: Cpu,
      subIcon: Check
    },
    {
      id: 'telemetryEvents',
      label: t('dataUsage.metrics.telemetryEvents.label'),
      value: t('dataUsage.metrics.telemetryEvents.value'),
      suffix: t('dataUsage.metrics.telemetryEvents.suffix'),
      sub: t('dataUsage.metrics.telemetryEvents.sub'),
      icon: Activity
    },
    {
      id: 'auditedAccess',
      label: t('dataUsage.metrics.auditedAccess.label'),
      value: t('dataUsage.metrics.auditedAccess.value'),
      suffix: t('dataUsage.metrics.auditedAccess.suffix'),
      sub: t('dataUsage.metrics.auditedAccess.sub'),
      icon: ShieldCheck
    },
    {
      id: 'retention',
      label: t('dataUsage.metrics.retention.label'),
      value: t('dataUsage.metrics.retention.value'),
      suffix: t('dataUsage.metrics.retention.suffix'),
      sub: t('dataUsage.metrics.retention.sub'),
      icon: Clock
    }
  ]

  return (
    <div className='grid grid-cols-4 gap-5'>
      {metrics.map((item) => (
        <div
          className='flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs'
          key={item.id}
        >
          <div>
            <span className='text-xs font-semibold uppercase tracking-wider text-neutral-500'>{item.label}</span>
            <div className='mt-1 text-2xl font-extrabold text-neutral-900'>
              {item.value}
              {item.suffix ? <span className='ml-1 text-xs font-medium text-neutral-500'>{item.suffix}</span> : null}
            </div>
            <p
              className={`mt-1 flex items-center gap-1 text-xs ${
                item.id === 'monitoredApps' || item.id === 'auditedAccess'
                  ? 'font-semibold text-emerald-600'
                  : 'text-neutral-500'
              }`}
            >
              {item.subIcon ? <item.subIcon className='h-3.5 w-3.5 stroke-[2.5]' /> : null}
              {item.sub}
            </p>
          </div>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500'>
            <item.icon className='h-6 w-6' />
          </div>
        </div>
      ))}
    </div>
  )
}
