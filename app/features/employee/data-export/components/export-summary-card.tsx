import { Check, FileText, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { DataExportFormData, ExportCategoryItem } from '../data-export.types'

interface ExportSummaryCardProps {
  formData: DataExportFormData
  categories: ExportCategoryItem[]
}

export function ExportSummaryCard({ formData, categories }: ExportSummaryCardProps) {
  const { t } = useTranslation()

  const selectedCount = categories.filter((cat) => formData.selectedCategories[cat.id]).length
  const totalApproxBytes = categories
    .filter((cat) => formData.selectedCategories[cat.id])
    .reduce((acc, cat) => acc + cat.approxBytes, 0)

  const formattedSize =
    totalApproxBytes >= 1024 * 1024
      ? `${(totalApproxBytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(totalApproxBytes / 1024)} KB`

  return (
    <div className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs'>
      <h3 className='flex items-center gap-2 border-b border-neutral-200 pb-3 text-sm font-bold text-neutral-900'>
        <FileText className='h-4 w-4 text-brand-500' />
        <span>{t('dataExport.summary.title')}</span>
      </h3>

      <div className='space-y-2.5 py-3.5 text-xs'>
        <div className='flex items-center justify-between'>
          <span className='text-neutral-500'>{t('dataExport.summary.requesterLabel')}</span>
          <span className='font-bold text-neutral-900'>{t('dataExport.summary.requesterValue')}</span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-neutral-500'>{t('dataExport.summary.categoriesLabel')}</span>
          <span className='font-bold text-brand-500'>
            {t('dataExport.summary.categoriesValue', {
              count: selectedCount,
              size: formattedSize
            })}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-neutral-500'>{t('dataExport.summary.formatLabel')}</span>
          <span className='font-semibold text-neutral-900'>
            {formData.format === 'json' ? t('dataExport.summary.formatJson') : t('dataExport.summary.formatCsv')}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-neutral-500'>{t('dataExport.summary.encryptionLabel')}</span>
          {formData.passwordProtection ? (
            <span className='inline-flex items-center gap-1 font-semibold text-status-active'>
              <Check className='h-3.5 w-3.5 stroke-[2.5]' />
              {t('dataExport.summary.encryptionEnabled')}
            </span>
          ) : (
            <span className='font-medium text-neutral-500'>{t('dataExport.summary.encryptionDisabled')}</span>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-neutral-500'>{t('dataExport.summary.slaLabel')}</span>
          <span className='font-bold text-neutral-900'>{t('dataExport.summary.slaValue')}</span>
        </div>
      </div>

      {/* Information notice box */}
      <div className='mt-2 flex items-start gap-2.5 rounded-xl border border-neutral-200 bg-[#FEFBF7] p-3.5'>
        <Info className='mt-0.5 h-4 w-4 shrink-0 text-brand-500' />
        <p className='text-[11px] leading-relaxed text-neutral-500'>{t('dataExport.summary.retentionNotice')}</p>
      </div>
    </div>
  )
}
