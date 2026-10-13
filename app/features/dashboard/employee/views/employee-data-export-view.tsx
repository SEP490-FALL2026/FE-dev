import { ArrowLeft, Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmployeePreviewNotice } from '../employee-preview-notice'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeDataExportViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}

export function EmployeeDataExportView({ onSelectTab }: EmployeeDataExportViewProps) {
  const { t } = useTranslation('dashboard')
  const formats = [
    {
      description: t('employee.dataExport.formatCsvDesc'),
      icon: FileSpreadsheet,
      label: t('employee.dataExport.formatCsv'),
      action: t('employee.dataExport.downloadCsv'),
      tone: 'bg-success/10 text-success-ink'
    },
    {
      description: t('employee.dataExport.formatJsonDesc'),
      icon: FileJson,
      label: t('employee.dataExport.formatJson'),
      action: t('employee.dataExport.downloadJson'),
      tone: 'bg-info/10 text-info-ink'
    },
    {
      description: t('employee.dataExport.formatPdfDesc'),
      icon: FileText,
      label: t('employee.dataExport.formatPdf'),
      action: t('employee.dataExport.downloadPdf'),
      tone: 'bg-danger/10 text-danger-ink'
    }
  ]

  return (
    <div className='mx-auto max-w-5xl space-y-6'>
      <div>
        <button
          className='inline-flex min-h-11 items-center gap-2 text-sm font-bold text-foreground hover:text-primary-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
          onClick={() => onSelectTab('profile')}
          type='button'
        >
          <ArrowLeft aria-hidden='true' className='size-4' />
          {t('employee.dataExport.backToProfile')}
        </button>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.dataExport.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.dataExport.subtitle')}</p>
      </div>

      <EmployeePreviewNotice>{t('employee.preview.export')}</EmployeePreviewNotice>

      <section aria-label={t('employee.dataExport.title')} className='grid gap-4 md:grid-cols-3'>
        {formats.map(({ action, description, icon: Icon, label, tone }) => (
          <article className='flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm' key={label}>
            <span className={`grid size-11 place-items-center rounded-xl ${tone}`}>
              <Icon aria-hidden='true' className='size-5' />
            </span>
            <h2 className='mt-4 text-base font-bold text-foreground'>{label}</h2>
            <p className='mt-2 flex-1 text-sm leading-relaxed text-muted-foreground'>{description}</p>
            <button
              className='mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-subtle px-3 text-sm font-semibold text-muted-foreground disabled:cursor-not-allowed'
              disabled
              type='button'
            >
              <Download aria-hidden='true' className='size-4' />
              {action}
            </button>
          </article>
        ))}
      </section>

      <section className='rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6'>
        <h2 className='text-base font-bold text-foreground'>{t('employee.dataExport.recentExports')}</h2>
        <p className='mt-3 text-sm text-muted-foreground'>{t('employee.dataExport.emptyHistory')}</p>
      </section>
    </div>
  )
}
