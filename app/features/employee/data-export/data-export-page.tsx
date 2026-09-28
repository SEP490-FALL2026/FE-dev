import { ArrowLeft, Upload } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'

import { ExportCategoriesCard } from './components/export-categories-card'
import { ExportOptionsCard } from './components/export-options-card'
import { ExportSummaryCard } from './components/export-summary-card'
import { ExportWorkflowCard } from './components/export-workflow-card'
import { RecentExportsCard } from './components/recent-exports-card'
import type {
  DataExportFormData,
  ExportCategoryId,
  ExportCategoryItem,
  ExportFormat,
  RecentExportItem
} from './data-export.types'

const categoryItems: ExportCategoryItem[] = [
  {
    id: 'personal',
    titleKey: 'dataExport.step1.categories.personal.title',
    sizeKey: 'dataExport.step1.categories.personal.size',
    descriptionKey: 'dataExport.step1.categories.personal.description',
    approxBytes: 120 * 1024
  },
  {
    id: 'software',
    titleKey: 'dataExport.step1.categories.software.title',
    sizeKey: 'dataExport.step1.categories.software.size',
    descriptionKey: 'dataExport.step1.categories.software.description',
    approxBytes: 240 * 1024
  },
  {
    id: 'requests',
    titleKey: 'dataExport.step1.categories.requests.title',
    sizeKey: 'dataExport.step1.categories.requests.size',
    descriptionKey: 'dataExport.step1.categories.requests.description',
    approxBytes: 480 * 1024
  },
  {
    id: 'telemetry',
    titleKey: 'dataExport.step1.categories.telemetry.title',
    sizeKey: 'dataExport.step1.categories.telemetry.size',
    descriptionKey: 'dataExport.step1.categories.telemetry.description',
    approxBytes: 1.8 * 1024 * 1024
  }
]

const recentExportsList: RecentExportItem[] = [
  {
    id: '1',
    name: 'export_2026_01_15.zip',
    format: 'ZIP',
    details: 'Jan 15, 2026 • 640 KB • All Profile Data',
    isExpired: false
  },
  {
    id: '2',
    name: 'export_2025_06_10.zip',
    format: 'CSV',
    details: 'Jun 10, 2025 • Expired (7-day SLA passed)',
    isExpired: true
  }
]

export function DataExportPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<DataExportFormData>({
    selectedCategories: {
      personal: true,
      software: true,
      requests: true,
      telemetry: false
    },
    format: 'json',
    email: 'nguyen.tuan@company.com',
    passwordProtection: true,
    passphrase: '••••••••••••',
    purpose: ''
  })

  const handleToggleCategory = (id: ExportCategoryId) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: {
        ...prev.selectedCategories,
        [id]: !prev.selectedCategories[id]
      }
    }))
  }

  const handleToggleAll = () => {
    const allSelected = categoryItems.every((cat) => formData.selectedCategories[cat.id])
    const newSelected = {} as Record<ExportCategoryId, boolean>
    categoryItems.forEach((cat) => {
      newSelected[cat.id] = !allSelected
    })
    setFormData((prev) => ({
      ...prev,
      selectedCategories: newSelected
    }))
  }

  const handleChangeFormat = (format: ExportFormat) => {
    setFormData((prev) => ({ ...prev, format }))
  }

  const handleTogglePassword = () => {
    setFormData((prev) => ({
      ...prev,
      passwordProtection: !prev.passwordProtection
    }))
  }

  const handleChangePassphrase = (passphrase: string) => {
    setFormData((prev) => ({ ...prev, passphrase }))
  }

  const handleChangePurpose = (purpose: string) => {
    setFormData((prev) => ({ ...prev, purpose }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/employee/profile')
  }

  return (
    <div className='mx-auto max-w-6xl space-y-6 pb-12'>
      {/* Breadcrumb & Title Section */}
      <div>
        <Link
          className='mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-500 transition-colors hover:text-brand-600'
          to='/employee/profile#data-privacy'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>{t('dataExport.header.backLink')}</span>
        </Link>

        <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl'>
              {t('dataExport.header.title')}
            </h1>
            <p className='mt-1 text-xs text-neutral-500 sm:text-sm'>{t('dataExport.header.subtitle')}</p>
          </div>

          <div className='inline-flex items-center gap-2 self-start rounded-xl border border-neutral-200 bg-[#FEFBF7] px-3 py-1.5 shadow-2xs sm:self-auto'>
            <span className='h-2 w-2 rounded-full bg-status-active' />
            <span className='text-[11px] font-medium text-neutral-600'>{t('dataExport.header.regulatoryBadge')}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Form (7 cols) + Summary & Workflow (5 cols) */}
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 items-start gap-6 lg:grid-cols-12'>
          {/* Left Column: Form Cards */}
          <div className='space-y-6 lg:col-span-7'>
            <ExportCategoriesCard
              categories={categoryItems}
              onToggleAll={handleToggleAll}
              onToggleCategory={handleToggleCategory}
              selectedCategories={formData.selectedCategories}
            />

            <ExportOptionsCard
              formData={formData}
              onChangeFormat={handleChangeFormat}
              onChangePassphrase={handleChangePassphrase}
              onChangePurpose={handleChangePurpose}
              onTogglePassword={handleTogglePassword}
            />

            {/* Form Actions */}
            <div className='flex items-center justify-between pt-1'>
              <Link
                className='rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900'
                to='/employee/profile'
              >
                {t('dataExport.actions.cancel')}
              </Link>

              <button
                className='flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-600'
                type='submit'
              >
                <Upload className='h-4 w-4' />
                <span>{t('dataExport.actions.submit')}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Summary, Timeline, Recent */}
          <div className='space-y-6 lg:col-span-5'>
            <ExportSummaryCard categories={categoryItems} formData={formData} />
            <ExportWorkflowCard />
            <RecentExportsCard exportsList={recentExportsList} />
          </div>
        </div>
      </form>
    </div>
  )
}
