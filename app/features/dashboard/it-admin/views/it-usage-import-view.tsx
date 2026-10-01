import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Database,
  FileSpreadsheet,
  RefreshCw,
  ShieldAlert,
  UploadCloud
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { itUsageSources, type UsageDataSource } from '../it-admin-data'

export function ItUsageImportView() {
  const { t } = useTranslation('dashboard')
  const [isUploading, setIsUploading] = useState(false)

  const metricValues = {
    connected: 6,
    events: '245.8K',
    healthy: 3,
    outdated: 1
  }

  const steps = [
    { desc: t('itAdmin.usageImport.step1'), id: 1 },
    { desc: t('itAdmin.usageImport.step2'), id: 2 },
    { desc: t('itAdmin.usageImport.step3'), id: 3 },
    { desc: t('itAdmin.usageImport.step4'), id: 4 },
    { desc: t('itAdmin.usageImport.step5'), id: 5 },
    { desc: t('itAdmin.usageImport.step6'), id: 6 }
  ]

  const statusConfig: Record<UsageDataSource['status'], { label: string; tone: string }> = {
    active: {
      label: t('itAdmin.usageImport.statusActive'),
      tone: 'bg-success/10 text-success border-success/25'
    },
    blocked: {
      label: t('itAdmin.usageImport.statusBlocked'),
      tone: 'bg-muted/40 text-muted-foreground border-border'
    },
    needsUpdate: {
      label: t('itAdmin.usageImport.statusNeedsUpdate'),
      tone: 'bg-warning/15 text-warning border-warning/30'
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.usageImport.title')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.usageImport.subtitle')}</p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
            onClick={() => setIsUploading(!isUploading)}
            type='button'
          >
            <UploadCloud aria-hidden='true' className='size-4' />
            <span>{t('itAdmin.usageImport.step1')}</span>
          </button>
        </div>
      </div>

      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <Database aria-hidden='true' className='size-4 text-primary' />
            <span>{t('itAdmin.usageImport.metricConnected')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricValues.connected}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <CheckCircle2 aria-hidden='true' className='size-4 text-success' />
            <span>{t('itAdmin.usageImport.metricHealthy')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricValues.healthy}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <Clock aria-hidden='true' className='size-4 text-warning' />
            <span>{t('itAdmin.usageImport.metricOutdated')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricValues.outdated}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <RefreshCw aria-hidden='true' className='size-4 text-info' />
            <span>{t('itAdmin.usageImport.metricEvents')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricValues.events}</p>
        </div>
      </div>

      {isUploading && (
        <div className='rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft/20 p-8 text-center'>
          <div className='mx-auto grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary'>
            <FileSpreadsheet aria-hidden='true' className='size-6' />
          </div>
          <h3 className='mt-3 text-base font-bold text-foreground'>{t('itAdmin.usageImport.step1')}</h3>
          <p className='mt-1 text-xs text-muted-foreground'>{t('itAdmin.usageImport.step2')}</p>
          <div className='mt-4 flex justify-center gap-3'>
            <span className='inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground'>
              <ShieldAlert aria-hidden='true' className='size-3.5 text-primary' />
              <span>{t('itAdmin.usageImport.step1')}</span>
            </span>
          </div>
        </div>
      )}

      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
        <div className='flex items-center gap-2 border-b border-border pb-3'>
          <ShieldAlert aria-hidden='true' className='size-5 text-warning shrink-0' />
          <div>
            <h2 className='text-sm font-bold text-foreground'>{t('itAdmin.usageImport.step3')}</h2>
            <p className='text-xs text-muted-foreground'>{t('itAdmin.deviceCollectors.blockedAppsDesc')}</p>
          </div>
        </div>

        <div className='mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
          {steps.map((step) => (
            <div
              className='flex items-start gap-2.5 rounded-xl border border-border bg-surface-subtle/50 p-3'
              key={step.id}
            >
              <span className='grid size-6 shrink-0 place-items-center rounded-lg bg-surface border border-border text-[0.7rem] font-bold text-muted-foreground'>
                {step.id}
              </span>
              <p className='text-xs font-medium text-foreground'>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='rounded-2xl border border-border bg-surface shadow-sm'>
        <div className='flex items-center justify-between border-b border-border p-4'>
          <div>
            <h2 className='text-base font-bold text-foreground'>{t('itAdmin.usageImport.sourcesTitle')}</h2>
            <p className='text-xs text-muted-foreground'>{t('itAdmin.usageImport.subtitle')}</p>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
              <tr>
                <th className='p-3 font-semibold'>{t('itAdmin.usageImport.colSource')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.usageImport.colType')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.usageImport.colCoverage')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.usageImport.colLastSync')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.usageImport.colStatus')}</th>
                <th className='p-3 font-semibold text-right'>{t('itAdmin.provisioning.colActions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {itUsageSources.map((source) => {
                const cfg = statusConfig[source.status]

                return (
                  <tr className='transition hover:bg-surface-subtle/60' key={source.id}>
                    <td className='p-3 font-semibold text-foreground'>{source.name}</td>
                    <td className='p-3 text-muted-foreground'>{source.type}</td>
                    <td className='p-3 font-mono text-muted-foreground'>{source.coverage}</td>
                    <td className='p-3 text-muted-foreground'>{source.lastSync}</td>
                    <td className='p-3'>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${cfg.tone}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className='p-3 text-right'>
                      <button
                        className='inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold hover:border-primary hover:text-primary'
                        type='button'
                      >
                        <span>{t('savings.action')}</span>
                        <ArrowUpRight aria-hidden='true' className='size-3' />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
