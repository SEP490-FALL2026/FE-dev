import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'

import { ReturnLicenseFormPanel } from './components/return-license-form-panel'
import { ReturnLicenseStepper } from './components/return-license-stepper'
import { ReturnSummaryPanel } from './components/return-summary-panel'
import type { ReturnLicenseFormData, ReturnReasonKey, ReturnSoftwareDetail } from './return-license.types'

const defaultSoftware: ReturnSoftwareDetail = {
  name: 'Figma',
  plan: 'Professional Plan',
  status: 'active',
  assignedDate: 'Jan 15, 2026',
  expirationDate: 'Dec 31, 2026',
  assignedBy: 'IT Admin',
  project: 'Project Alpha',
  costCenter: 'CC-001',
  requestedBy: 'Nguyễn Minh An'
}

const defaultFormData: ReturnLicenseFormData = {
  reason: 'project_completed',
  additionalNotes: 'Project Alpha is complete. We no longer need Figma for the current phase.\nThank you!'
}

export function ReturnLicensePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ReturnLicenseFormData>(defaultFormData)

  const handleReasonChange = (reason: ReturnReasonKey) => {
    setFormData((prev) => ({ ...prev, reason }))
  }

  const handleNotesChange = (additionalNotes: string) => {
    setFormData((prev) => ({ ...prev, additionalNotes }))
  }

  const handleReview = () => {
    navigate('/employee/create-request/review?type=return-license')
  }

  return (
    <div className='mx-auto max-w-[1200px] space-y-6 pb-10'>
      {/* Breadcrumb Navigation */}
      <nav
        aria-label={t('returnLicense.breadcrumbs.ariaLabel')}
        className='flex items-center space-x-2 text-sm font-medium text-neutral-500'
      >
        <Link className='transition-colors hover:text-neutral-900' to='/employee/dashboard'>
          {t('returnLicense.breadcrumbs.dashboard')}
        </Link>
        <ChevronRight className='h-3.5 w-3.5 text-brand-300' />
        <Link className='transition-colors hover:text-neutral-900' to='/employee/my-requests'>
          {t('returnLicense.breadcrumbs.myRequests')}
        </Link>
        <ChevronRight className='h-3.5 w-3.5 text-brand-300' />
        <span className='font-semibold text-neutral-900'>{t('returnLicense.breadcrumbs.current')}</span>
      </nav>

      {/* Header and Stepper */}
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-end'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl'>
            {t('returnLicense.header.title')}
          </h1>
          <p className='mt-1 text-sm text-neutral-600 sm:text-base'>{t('returnLicense.header.subtitle')}</p>
        </div>
        <ReturnLicenseStepper currentStep={1} />
      </div>

      {/* Main Grid Layout: 2/3 Form, 1/3 Summary */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='min-w-0 lg:col-span-2'>
          <ReturnLicenseFormPanel
            formData={formData}
            onChangeNotes={handleNotesChange}
            onChangeReason={handleReasonChange}
            onReview={handleReview}
            software={defaultSoftware}
          />
        </div>
        <div className='min-w-0 lg:col-span-1'>
          <ReturnSummaryPanel software={defaultSoftware} />
        </div>
      </div>
    </div>
  )
}
