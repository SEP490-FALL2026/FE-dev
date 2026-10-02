import { ArrowLeft, Check, Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeDataExportViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}

export function EmployeeDataExportView({ onSelectTab }: EmployeeDataExportViewProps) {
  const { t } = useTranslation('dashboard')
  const [downloaded, setDownloaded] = useState<string | null>(null)

  const handleDownload = (format: string) => {
    setDownloaded(format)
    setTimeout(() => setDownloaded(null), 2500)
  }

  return (
    <div className='mx-auto max-w-4xl space-y-6'>
      {/* Header */}
      <div>
        <button
          className='inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground'
          onClick={() => onSelectTab('profile')}
          type='button'
        >
          <ArrowLeft aria-hidden='true' className='size-4' />
          <span>{t('employee.dataExport.backToProfile')}</span>
        </button>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.dataExport.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.dataExport.subtitle')}</p>
      </div>

      {/* Export Options Cards */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div>
            <span className='grid size-10 place-items-center rounded-xl bg-success/10 text-success'>
              <FileSpreadsheet aria-hidden='true' className='size-5' />
            </span>
            <h2 className='mt-3 text-sm font-bold text-foreground'>{t('employee.dataExport.formatCsv')}</h2>
            <p className='mt-1 text-[0.72rem] text-muted-foreground'>{t('employee.dataExport.formatCsvDesc')}</p>
          </div>
          <button
            className='mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-xs transition hover:bg-primary/90'
            onClick={() => handleDownload('csv')}
            type='button'
          >
            {downloaded === 'csv' ? (
              <>
                <Check aria-hidden='true' className='size-3.5' />
                <span>{t('employee.dataExport.downloaded')}</span>
              </>
            ) : (
              <>
                <Download aria-hidden='true' className='size-3.5' />
                <span>{t('employee.dataExport.downloadCsv')}</span>
              </>
            )}
          </button>
        </div>

        <div className='flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div>
            <span className='grid size-10 place-items-center rounded-xl bg-info/10 text-info'>
              <FileJson aria-hidden='true' className='size-5' />
            </span>
            <h2 className='mt-3 text-sm font-bold text-foreground'>{t('employee.dataExport.formatJson')}</h2>
            <p className='mt-1 text-[0.72rem] text-muted-foreground'>{t('employee.dataExport.formatJsonDesc')}</p>
          </div>
          <button
            className='mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-xs transition hover:bg-primary/90'
            onClick={() => handleDownload('json')}
            type='button'
          >
            {downloaded === 'json' ? (
              <>
                <Check aria-hidden='true' className='size-3.5' />
                <span>{t('employee.dataExport.downloaded')}</span>
              </>
            ) : (
              <>
                <Download aria-hidden='true' className='size-3.5' />
                <span>{t('employee.dataExport.downloadJson')}</span>
              </>
            )}
          </button>
        </div>

        <div className='flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div>
            <span className='grid size-10 place-items-center rounded-xl bg-danger/10 text-danger'>
              <FileText aria-hidden='true' className='size-5' />
            </span>
            <h2 className='mt-3 text-sm font-bold text-foreground'>{t('employee.dataExport.formatPdf')}</h2>
            <p className='mt-1 text-[0.72rem] text-muted-foreground'>{t('employee.dataExport.formatPdfDesc')}</p>
          </div>
          <button
            className='mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-xs transition hover:bg-primary/90'
            onClick={() => handleDownload('pdf')}
            type='button'
          >
            {downloaded === 'pdf' ? (
              <>
                <Check aria-hidden='true' className='size-3.5' />
                <span>{t('employee.dataExport.downloaded')}</span>
              </>
            ) : (
              <>
                <Download aria-hidden='true' className='size-3.5' />
                <span>{t('employee.dataExport.downloadPdf')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* History */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <h2 className='text-sm font-bold text-foreground'>{t('employee.dataExport.recentExports')}</h2>
        <div className='mt-4 divide-y divide-border text-xs'>
          {[
            { id: '1', fileName: 'personal_telemetry_2026_09.csv', meta: '28/09/2026 16:42 · 14.2 KB' },
            { id: '2', fileName: 'gdpr_compliance_export_full.json', meta: '15/08/2026 09:15 · 88.6 KB' }
          ].map((item) => (
            <div key={item.id} className='flex items-center justify-between py-3'>
              <div>
                <p className='font-bold text-foreground'>{item.fileName}</p>
                <p className='text-[0.68rem] text-muted-foreground'>{item.meta}</p>
              </div>
              <span className='rounded-md bg-success/10 px-2 py-0.5 text-[0.7rem] font-bold text-success'>
                {t('employee.dataExport.statusSuccess')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
