import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'

import { RenewalFormPanel } from './components/renewal-form-panel'
import { RenewalSummaryPanel } from './components/renewal-summary-panel'
import { TemporaryRenewalStepper } from './components/temporary-renewal-stepper'
import type { RenewalSummaryData, TemporaryRenewalFormData } from './temporary-renewal.types'

const defaultFormData: TemporaryRenewalFormData = {
  newExpirationDate: 'Dec 31, 2026',
  duration: '92 days',
  durationRange: 'From Oct 01, 2026 to Dec 31, 2026',
  reason: 'Project extended. Need more time to complete design work for Project Alpha.',
  project: 'Project Alpha',
  costCenter: 'CC-001 - Product Development',
  additionalNotes:
    'We are entering the final design phase and need to continue using Figma for collaboration and handoff.'
}

const defaultSummaryData: RenewalSummaryData = {
  softwareName: 'Figma',
  planName: 'Professional Plan',
  status: 'active',
  currentExpiration: 'Sep 30, 2026',
  newExpiration: 'Dec 31, 2026',
  duration: '92 days',
  project: 'Project Alpha',
  costCenter: 'CC-001',
  requestedBy: 'Nguyễn Minh An',
  requestType: 'Temporary Renewal'
}

export function TemporaryRenewalPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<TemporaryRenewalFormData>(defaultFormData)

  const handleFieldChange = <K extends keyof TemporaryRenewalFormData>(
    field: K,
    value: TemporaryRenewalFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    navigate('/employee/create-request')
  }

  const handleReview = () => {
    navigate('/employee/create-request/review?type=temporary-renewal')
  }

  const summaryData: RenewalSummaryData = {
    ...defaultSummaryData,
    newExpiration: formData.newExpirationDate || 'Dec 31, 2026',
    duration: formData.duration,
    project: formData.project,
    costCenter: formData.costCenter.split(' ')[0]
  }

  return (
    <div className='mx-auto max-w-[1200px] space-y-6'>
      {/* Breadcrumbs */}
      <nav
        aria-label={t('temporaryRenewal.breadcrumbs.ariaLabel')}
        className='flex items-center gap-2 text-sm font-medium text-neutral-500'
      >
        <Link className='transition-colors hover:text-neutral-900' to='/employee/dashboard'>
          {t('temporaryRenewal.breadcrumbs.dashboard')}
        </Link>
        <ChevronRight className='h-3.5 w-3.5 text-brand-300' />
        <Link className='transition-colors hover:text-neutral-900' to='/employee/my-software'>
          {t('temporaryRenewal.breadcrumbs.mySoftware')}
        </Link>
        <ChevronRight className='h-3.5 w-3.5 text-brand-300' />
        <Link className='transition-colors hover:text-neutral-900' to='/employee/my-software/1'>
          {t('temporaryRenewal.breadcrumbs.software')}
        </Link>
        <ChevronRight className='h-3.5 w-3.5 text-brand-300' />
        <span className='text-neutral-900'>{t('temporaryRenewal.breadcrumbs.current')}</span>
      </nav>

      {/* Header and Stepper */}
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-end'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl'>
            {t('temporaryRenewal.header.title')}
          </h1>
          <p className='mt-1 text-sm text-neutral-600 sm:text-base'>{t('temporaryRenewal.header.subtitle')}</p>
        </div>
        <TemporaryRenewalStepper currentStep={1} />
      </div>

      {/* Main Grid Layout */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Left Column (2 cols): Form */}
        <div className='lg:col-span-2'>
          <RenewalFormPanel
            formData={formData}
            onCancel={handleCancel}
            onChangeField={handleFieldChange}
            onReview={handleReview}
          />
        </div>

        {/* Right Column (1 col): Summary */}
        <div className='lg:col-span-1'>
          <RenewalSummaryPanel data={summaryData} />
        </div>
      </div>
    </div>
  )
}
