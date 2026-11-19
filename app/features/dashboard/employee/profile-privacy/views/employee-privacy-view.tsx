import { Download, FileSpreadsheet, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { employeeProfileData } from '../../employee-data'
import type { EmployeeTabKey } from '../../employee-nav'
import { EmployeePreviewNotice } from '../../shared/components/employee-preview-notice'

interface EmployeePrivacyViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}

export function EmployeePrivacyView({ onSelectTab }: EmployeePrivacyViewProps) {
  const { t } = useTranslation('dashboard')
  const { privacy } = employeeProfileData

  return (
    <div className='max-w-5xl space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{t('employee.privacy.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.privacy.subtitle')}</p>
      </div>

      <EmployeePreviewNotice>{t('employee.preview.privacy')}</EmployeePreviewNotice>

      <section className='space-y-5 rounded-2xl border border-primary/25 bg-surface p-6 shadow-sm'>
        <div className='flex items-center gap-2 text-primary'>
          <ShieldCheck aria-hidden='true' className='size-5' />
          <h2 className='text-base font-bold text-foreground'>{t('employee.profile.dataPrivacyTitle')}</h2>
        </div>
        <p className='text-sm leading-relaxed text-muted-foreground'>{t('employee.profile.privacyDesc')}</p>

        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='rounded-xl border border-border bg-surface-subtle/50 p-4'>
            <p className='text-sm text-muted-foreground'>{t('employee.profile.fieldMonitoredApps')}</p>
            <p className='mt-1 font-bold text-foreground'>
              {t('employee.profile.appsCount', { count: privacy.monitoredAppsCount })}
            </p>
          </div>
          <div className='rounded-xl border border-border bg-surface-subtle/50 p-4'>
            <p className='text-sm text-muted-foreground'>{t('employee.profile.fieldRetention')}</p>
            <p className='mt-1 font-bold text-foreground'>
              {t('employee.profile.daysCount', { count: privacy.dataRetentionDays })}
            </p>
          </div>
        </div>

        <div className='grid gap-3 sm:grid-cols-2'>
          <button
            className='inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-left text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary-soft/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            onClick={() => onSelectTab('data-export')}
            type='button'
          >
            <Download aria-hidden='true' className='size-4 text-primary' />
            {t('employee.profile.actExportData')}
          </button>
          <button
            className='inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-left text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary-soft/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            onClick={() => onSelectTab('data-usage')}
            type='button'
          >
            <FileSpreadsheet aria-hidden='true' className='size-4 text-primary' />
            {t('employee.profile.actViewUsage')}
          </button>
        </div>
      </section>
    </div>
  )
}
