import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmployeePreviewNotice } from '../employee-preview-notice'
import { roleProfiles } from '../../dashboard-data'
import type { EmployeeTabKey } from '../employee-nav'
import { employeeRequestPlanOptions } from '../employee-request-plan-options'
import { EmployeeRequestStepper } from '../employee-request-stepper'
import { eligibleTeamMembers, parseTeamMemberIds } from '../employee-team-request-draft'

interface EmployeeReviewRequestViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  requestParams?: Record<string, string>
}

export function EmployeeReviewRequestView({ onSelectTab, requestParams = {} }: EmployeeReviewRequestViewProps) {
  const { t } = useTranslation('dashboard')

  const hasDraft = Boolean(requestParams.type && requestParams.softwareName)
  const softwareName = requestParams.softwareName || t('employee.reviewRequest.notProvided')
  const planOption = employeeRequestPlanOptions.find((option) => option.value === requestParams.plan)
  const plan = planOption ? t(planOption.labelKey) : t('employee.reviewRequest.notProvided')
  const reason = requestParams.reason || requestParams.note || t('employee.reviewRequest.notProvided')
  const requestType = requestParams.type || 'newSoftware'
  const isTeamRequest =
    (requestType === 'newSoftware' || requestType === 'changePlan') && requestParams.usageMode === 'team'
  const selectedTeamMemberIds = isTeamRequest ? parseTeamMemberIds(requestParams.teamMemberIds) : []
  const selectedTeamMembers = eligibleTeamMembers.filter((member) => selectedTeamMemberIds.includes(member.id))
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
    if (requestType === 'newSoftware' || requestType === 'changePlan') {
      delete draft.project
      delete draft.teamDraft
    }
    if (requestType === 'renewal') {
      onSelectTab('temporary-renewal', draft)
    } else if (requestType === 'returnLicense') {
      onSelectTab('return-license', draft)
    } else {
      onSelectTab('request-software-details', draft)
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
        <p className='mt-1 text-sm text-muted-foreground'>
          {t(
            requestType === 'newSoftware' || requestType === 'changePlan'
              ? 'employee.reviewRequest.subtitleFourStep'
              : 'employee.reviewRequest.subtitle'
          )}
        </p>
      </div>

      <EmployeePreviewNotice>{t('employee.preview.request')}</EmployeePreviewNotice>

      <EmployeeRequestStepper
        currentStep={requestType === 'newSoftware' || requestType === 'changePlan' ? 3 : 2}
        fourStep={requestType === 'newSoftware' || requestType === 'changePlan'}
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
                    <span className='text-muted-foreground'>{t('employee.requestNewSoftware.fieldUsageMode')}</span>
                    <span className='font-medium text-foreground'>
                      {requestParams.usageMode === 'personal'
                        ? t('employee.requestNewSoftware.usagePersonal')
                        : requestParams.usageMode === 'team'
                          ? t('employee.requestNewSoftware.usageTeam')
                          : t('employee.reviewRequest.notProvided')}
                    </span>
                  </div>
                </>
              )}
              {isTeamRequest && (
                <div className='space-y-3 py-4'>
                  <div>
                    <h3 className='font-semibold text-foreground'>
                      {t('employee.reviewRequest.teamRecipients', { count: selectedTeamMembers.length + 1 })}
                    </h3>
                    <ul className='mt-2 space-y-2'>
                      <li className='rounded-xl border border-border bg-surface-subtle/50 p-3'>
                        <span className='block font-semibold text-foreground'>
                          {roleProfiles.employee.displayName} · {t('employee.requestNewSoftware.teamRepresentative')}
                        </span>
                        <span className='text-muted-foreground'>
                          {t('employee.requestNewSoftware.teamRepresentativeHint')}
                        </span>
                      </li>
                      {selectedTeamMembers.map((member) => (
                        <li className='rounded-xl border border-border bg-surface-subtle/50 p-3' key={member.id}>
                          <span className='block font-semibold text-foreground'>{member.name}</span>
                          <span className='text-muted-foreground'>{member.email}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
          {isTeamRequest && (
            <div className='rounded-2xl border border-primary/25 bg-primary-soft/20 p-5 text-sm'>
              <h2 className='font-bold text-foreground'>{t('employee.reviewRequest.teamFlowTitle')}</h2>
              <p className='mt-2 text-muted-foreground'>{t('employee.reviewRequest.teamFlowDescription')}</p>
            </div>
          )}
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
            <h2 className='text-sm font-bold text-foreground'>{t('employee.reviewRequest.approvalFlowTitle')}</h2>
            <div className='mt-4 space-y-4 border-l-2 border-border/80 pl-4 ml-2 text-xs'>
              <div>
                <p className='font-bold text-foreground'>{t('employee.reviewRequest.flowStep1Title')}</p>
                <p className='text-muted-foreground text-[0.7rem]'>{t('employee.reviewRequest.flowStep1Desc')}</p>
              </div>
              <div>
                <p className='font-bold text-foreground'>{t('employee.reviewRequest.flowStep2Title')}</p>
                <p className='text-muted-foreground text-[0.7rem]'>
                  {t(
                    isTeamRequest ? 'employee.reviewRequest.teamFlowStep2Desc' : 'employee.reviewRequest.flowStep2Desc'
                  )}
                </p>
              </div>
              <div>
                <p className='font-bold text-muted-foreground'>{t('employee.reviewRequest.flowStep3Title')}</p>
                <p className='text-muted-foreground text-[0.7rem]'>
                  {t(
                    isTeamRequest ? 'employee.reviewRequest.teamFlowStep3Desc' : 'employee.reviewRequest.flowStep3Desc'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
