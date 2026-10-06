import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmployeePreviewNotice } from '../employee-preview-notice'
import type { EmployeeTabKey } from '../employee-nav'
import { EmployeeRequestStepper } from '../employee-request-stepper'

interface EmployeeReviewRequestViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  requestParams?: Record<string, string>
}

export function EmployeeReviewRequestView({ onSelectTab, requestParams = {} }: EmployeeReviewRequestViewProps) {
  const { t } = useTranslation('dashboard')

  const hasDraft = Boolean(requestParams.type && requestParams.softwareName)
  const softwareName = requestParams.softwareName || t('employee.reviewRequest.notProvided')
  const plan = requestParams.plan || t('employee.reviewRequest.notProvided')
  const reason = requestParams.reason || requestParams.note || t('employee.reviewRequest.notProvided')
  const project = requestParams.project || t('employee.reviewRequest.notProvided')
  const requestType = requestParams.type || 'newSoftware'
  const duration =
    requestParams.duration === '1month'
      ? t('employee.temporaryRenewal.duration1Month')
      : requestParams.duration === '3months'
        ? t('employee.temporaryRenewal.duration3Months')
        : requestParams.duration === '6months'
          ? t('employee.temporaryRenewal.duration6Months')
          : t('employee.reviewRequest.notProvided')
  const returnReason =
    requestParams.reasonCategory === 'projectEnded'
      ? t('employee.returnLicense.reasonProjectEnded')
      : requestParams.reasonCategory === 'alternative'
        ? t('employee.returnLicense.reasonAlternative')
        : requestParams.reasonCategory === 'rarelyUsed'
          ? t('employee.returnLicense.reasonRarelyUsed')
          : t('employee.reviewRequest.notProvided')

  const handleBack = () => {
    const draft = Object.fromEntries(Object.entries(requestParams).filter(([key]) => key !== 'tab'))
    if (requestType === 'renewal') {
      onSelectTab('temporary-renewal', draft)
    } else if (requestType === 'returnLicense') {
      onSelectTab('return-license', draft)
    } else {
      onSelectTab('request-new-software', draft)
    }
  }

  if (!hasDraft) {
    return (
      <div className='mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-6 sm:p-8'>
        <h1 className='text-2xl font-bold text-foreground'>{t('employee.reviewRequest.missingDraftTitle')}</h1>
        <p className='mt-2 text-sm text-muted-foreground'>{t('employee.reviewRequest.missingDraftDescription')}</p>
        <button
          className='mt-5 min-h-11 rounded-xl bg-primary-action px-4 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
          onClick={() => onSelectTab('create-request')}
          type='button'
        >
          {t('employee.requestNewSoftware.backToSelection')}
        </button>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-5xl space-y-6'>
      {/* Heading */}
      <div>
        <button
          className='inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground'
          onClick={handleBack}
          type='button'
        >
          <ArrowLeft aria-hidden='true' className='size-4' />
          <span>{t('employee.reviewRequest.actBack')}</span>
        </button>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.reviewRequest.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.reviewRequest.subtitle')}</p>
      </div>

      <EmployeePreviewNotice>{t('employee.preview.request')}</EmployeePreviewNotice>

      <EmployeeRequestStepper
        currentStep={2}
        firstStepLabel={t(
          requestType === 'renewal'
            ? 'employee.temporaryRenewal.step1'
            : requestType === 'returnLicense'
              ? 'employee.returnLicense.step1'
              : 'employee.requestNewSoftware.step1'
        )}
      />

      {/* Grid: 7 cols Left, 5 cols Right */}
      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left Column */}
        <div className='space-y-6 lg:col-span-7'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
            <h2 className='text-sm font-bold text-foreground'>{t('employee.reviewRequest.summaryTitle')}</h2>

            <div className='divide-y divide-border/70 text-sm'>
              <div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-2.5'>
                <span className='text-muted-foreground'>{t('employee.requestDetail.software')}</span>
                <span className='font-bold text-foreground'>{softwareName}</span>
              </div>
              {(requestType === 'newSoftware' || requestType === 'changePlan') && (
                <>
                  <div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-2.5'>
                    <span className='text-muted-foreground'>{t('employee.requestDetail.plan')}</span>
                    <span className='font-medium text-foreground'>{plan}</span>
                  </div>
                  <div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-2.5'>
                    <span className='text-muted-foreground'>{t('employee.requestDetail.project')}</span>
                    <span className='font-medium text-foreground'>{project}</span>
                  </div>
                </>
              )}
              {requestType === 'renewal' && (
                <div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-2.5'>
                  <span className='text-muted-foreground'>{t('employee.temporaryRenewal.fieldDuration')}</span>
                  <span className='font-medium text-foreground'>{duration}</span>
                </div>
              )}
              {requestType === 'returnLicense' && (
                <div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-2.5'>
                  <span className='text-muted-foreground'>{t('employee.returnLicense.fieldReason')}</span>
                  <span className='font-medium text-foreground'>{returnReason}</span>
                </div>
              )}
              <div className='py-2.5'>
                <span className='text-muted-foreground'>
                  {t(
                    requestType === 'returnLicense'
                      ? 'employee.returnLicense.additionalNotes'
                      : 'employee.requestDetail.reason'
                  )}
                </span>
                <p className='mt-1 rounded-xl border border-border/70 bg-surface-subtle/50 p-3 text-foreground'>
                  {reason}
                </p>
              </div>
            </div>

            <div className='flex items-center justify-between pt-4 border-t border-border'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
                onClick={handleBack}
                type='button'
              >
                {t('employee.reviewRequest.actBack')}
              </button>
              <button
                className='inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface-subtle px-6 py-2.5 text-sm font-bold text-muted-foreground disabled:cursor-not-allowed'
                disabled
                type='button'
              >
                <span>{t('employee.reviewRequest.actSubmit')}</span>
                <ArrowRight aria-hidden='true' className='size-3.5' />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Approval Path Preview */}
        <div className='space-y-6 lg:col-span-5'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
            <h2 className='text-sm font-bold text-foreground'>{t('employee.reviewRequest.approvalFlowTitle')}</h2>
            <div className='mt-4 space-y-4 border-l-2 border-border/80 pl-4 ml-2 text-xs'>
              <div>
                <p className='font-bold text-foreground'>{t('employee.reviewRequest.flowStep1Title')}</p>
                <p className='text-muted-foreground text-[0.7rem]'>{t('employee.reviewRequest.flowStep1Desc')}</p>
              </div>
              <div>
                <p className='font-bold text-foreground'>{t('employee.reviewRequest.flowStep2Title')}</p>
                <p className='text-muted-foreground text-[0.7rem]'>{t('employee.reviewRequest.flowStep2Desc')}</p>
              </div>
              <div>
                <p className='font-bold text-muted-foreground'>{t('employee.reviewRequest.flowStep3Title')}</p>
                <p className='text-muted-foreground text-[0.7rem]'>{t('employee.reviewRequest.flowStep3Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
