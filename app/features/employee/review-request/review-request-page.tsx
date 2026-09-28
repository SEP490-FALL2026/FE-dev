import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { ApprovalFlowCard } from './components/approval-flow-card'
import { RequestDetailsCard } from './components/request-details-card'
import { RequestSummaryCard } from './components/request-summary-card'
import { ReviewStepper } from './components/review-stepper'
import { WhatHappensNextCard } from './components/what-happens-next-card'

export function ReviewRequestPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestType = searchParams.get('type') || 'new-software'

  const getPreviousRoute = () => {
    if (requestType === 'temporary-renewal') return '/employee/create-request/temporary-renewal'
    if (requestType === 'return-license') return '/employee/create-request/return-license'
    return '/employee/create-request/new-software'
  }

  const getPreviousLabel = () => {
    if (requestType === 'temporary-renewal') return t('reviewRequest.breadcrumbs.temporaryRenewal')
    if (requestType === 'return-license') return t('reviewRequest.breadcrumbs.returnLicense')
    return t('reviewRequest.breadcrumbs.newSoftware')
  }

  const handleBack = () => {
    navigate(getPreviousRoute())
  }

  const handleSubmit = () => {
    navigate(`/employee/create-request/success?type=${requestType}&id=REQ-1027`)
  }

  return (
    <div className='mx-auto max-w-6xl pb-10'>
      {/* Breadcrumbs & Header */}
      <div className='mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end'>
        <div>
          <nav className='mb-3 flex items-center gap-2 text-sm text-neutral-500'>
            <Link className='transition-colors hover:text-neutral-900' to='/employee/dashboard'>
              {t('reviewRequest.breadcrumbs.dashboard')}
            </Link>
            <ChevronRight className='h-3.5 w-3.5' />
            <Link className='transition-colors hover:text-neutral-900' to='/employee/create-request'>
              {t('reviewRequest.breadcrumbs.createRequest')}
            </Link>
            <ChevronRight className='h-3.5 w-3.5' />
            <Link className='transition-colors hover:text-neutral-900' to={getPreviousRoute()}>
              {getPreviousLabel()}
            </Link>
            <ChevronRight className='h-3.5 w-3.5' />
            <span className='font-semibold text-neutral-900'>{t('reviewRequest.breadcrumbs.review')}</span>
          </nav>

          <h1 className='mb-2 text-3xl font-bold tracking-tight text-neutral-900'>{t('reviewRequest.header.title')}</h1>
          <p className='text-sm text-neutral-500'>{t('reviewRequest.header.subtitle')}</p>
        </div>

        {/* Stepper */}
        <ReviewStepper />
      </div>

      {/* Main Grid: 2/3 Left (8 cols), 1/3 Right (4 cols) */}
      <div className='grid grid-cols-12 gap-6'>
        {/* Left Column: Summary, Details & Buttons */}
        <div className='col-span-8 space-y-6'>
          <RequestSummaryCard requestType={requestType} />
          <RequestDetailsCard requestType={requestType} />

          {/* Action Buttons */}
          <div className='flex items-center justify-between pt-2'>
            <button
              className='flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50'
              onClick={handleBack}
              type='button'
            >
              <ArrowLeft className='h-4 w-4' />
              {t('reviewRequest.actions.back')}
            </button>

            <button
              className='flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-brand-600'
              onClick={handleSubmit}
              type='button'
            >
              {t('reviewRequest.actions.submit')}
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>
        </div>

        {/* Right Column: Approval Flow & What happens next */}
        <div className='col-span-4 space-y-6'>
          <ApprovalFlowCard />
          <WhatHappensNextCard />
        </div>
      </div>
    </div>
  )
}
