import { ArrowLeft, ArrowRight, Package } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { catalogSoftwareList } from '../../employee-data'
import type { EmployeeTabKey } from '../../employee-nav'
import { employeeRequestPlanOptions } from '../employee-request-plan-options'
import { EmployeeRequestStepper } from '../components/employee-request-stepper'
import { EmployeeTeamRequestFields } from '../components/employee-team-request-fields'
import { parseTeamMemberIds } from '../employee-team-request-draft'

interface EmployeeRequestSoftwareDetailsViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  initialParams: Record<string, string>
}

export function EmployeeRequestSoftwareDetailsView({
  onSelectTab,
  initialParams
}: EmployeeRequestSoftwareDetailsViewProps) {
  const { t } = useTranslation('dashboard')
  const [otherSoftwareName, setOtherSoftwareName] = useState(initialParams.otherSoftwareName || '')
  const [plan, setPlan] = useState(
    employeeRequestPlanOptions.some((option) => option.value === initialParams.plan) ? initialParams.plan : ''
  )
  const [usageMode, setUsageMode] = useState<'personal' | 'team' | ''>(
    initialParams.usageMode === 'personal' || initialParams.usageMode === 'team' ? initialParams.usageMode : ''
  )
  const [reason, setReason] = useState(initialParams.reason || '')
  const [selectedTeamMemberIds, setSelectedTeamMemberIds] = useState(() =>
    parseTeamMemberIds(initialParams.teamMemberIds)
  )
  const selectedSoftware = catalogSoftwareList.find((software) => software.id === initialParams.softwareId)
  const isOtherSoftware = initialParams.softwareId === 'other'
  const requestType = initialParams.type === 'changePlan' ? 'changePlan' : 'newSoftware'
  const selectionParams = {
    ...Object.fromEntries(
      Object.entries(initialParams).filter(
        ([key]) => key !== 'tab' && key !== 'project' && key !== 'teamDraft' && key !== 'teamMemberIds'
      )
    ),
    otherSoftwareName,
    plan,
    usageMode,
    reason,
    type: requestType,
    ...(usageMode === 'team' ? { teamMemberIds: selectedTeamMemberIds.join(',') } : {})
  }
  const canContinue =
    plan.trim().length > 0 &&
    usageMode !== '' &&
    reason.trim().length > 0 &&
    (!isOtherSoftware || otherSoftwareName.trim().length > 0)

  if (!selectedSoftware && !isOtherSoftware) {
    return (
      <div className='mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-6'>
        <h1 className='text-2xl font-bold text-foreground'>{t('employee.requestNewSoftware.selectionRequired')}</h1>
        <button
          className='mt-5 min-h-11 rounded-xl bg-primary-action px-4 text-sm font-bold text-white'
          onClick={() => onSelectTab('request-new-software', { type: requestType })}
          type='button'
        >
          {t('employee.requestNewSoftware.backToSoftware')}
        </button>
      </div>
    )
  }

  const softwareName = isOtherSoftware ? otherSoftwareName.trim() : selectedSoftware!.name

  const handleContinue = () => {
    if (!canContinue) return
    onSelectTab('review-request', {
      ...selectionParams,
      softwareName
    })
  }

  const handleBackToSoftware = () => {
    onSelectTab('request-new-software', selectionParams)
  }

  return (
    <div className='mx-auto max-w-4xl space-y-6'>
      <div>
        <button
          className='inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground'
          onClick={handleBackToSoftware}
          type='button'
        >
          <ArrowLeft aria-hidden='true' className='size-4' />
          <span>{t('employee.requestNewSoftware.backToSoftware')}</span>
        </button>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>
          {t('employee.requestNewSoftware.detailsTitle')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.requestNewSoftware.detailsSubtitle')}</p>
      </div>

      <EmployeeRequestStepper currentStep={2} firstStepLabel={t('employee.requestNewSoftware.step1')} fourStep />

      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6 space-y-5'>
        <div>
          <p className='mb-1.5 text-sm font-semibold text-muted-foreground'>
            {t('employee.requestNewSoftware.fieldSoftware')}
          </p>
          <div className='flex items-center gap-3 rounded-xl border border-border bg-surface-subtle/50 p-3'>
            {isOtherSoftware ? (
              <span className='grid size-9 place-items-center rounded-lg border border-border bg-surface'>
                <Package aria-hidden='true' className='size-5 text-muted-foreground' />
              </span>
            ) : (
              <img
                alt={selectedSoftware!.name}
                className='size-9 rounded-lg border border-border bg-surface object-contain p-1'
                src={selectedSoftware!.logoUrl}
              />
            )}
            <span>
              <span className='block text-sm font-bold text-foreground'>
                {isOtherSoftware ? t('employee.requestNewSoftware.otherSoftware') : selectedSoftware!.name}
              </span>
              {!isOtherSoftware && (
                <span className='block text-xs text-muted-foreground'>{selectedSoftware!.category}</span>
              )}
            </span>
          </div>
        </div>

        {isOtherSoftware && (
          <div>
            <label
              className='mb-1.5 block text-sm font-semibold text-foreground'
              htmlFor='employee-request-other-software'
            >
              {t('employee.requestNewSoftware.fieldOtherSoftwareName')}
            </label>
            <input
              className='h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action sm:text-sm'
              id='employee-request-other-software'
              onChange={(event) => setOtherSoftwareName(event.target.value)}
              value={otherSoftwareName}
            />
          </div>
        )}

        <div>
          <label className='mb-1.5 block text-sm font-semibold text-foreground' htmlFor='employee-request-plan'>
            {t('employee.requestNewSoftware.fieldPlan')}
          </label>
          <select
            className='h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action sm:text-sm'
            id='employee-request-plan'
            onChange={(event) => setPlan(event.target.value)}
            value={plan}
          >
            <option disabled value=''>
              {t('employee.requestNewSoftware.selectPlan')}
            </option>
            {employeeRequestPlanOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className='mb-2 text-sm font-semibold text-foreground'>
            {t('employee.requestNewSoftware.fieldUsageMode')}
          </legend>
          <div className='grid gap-3 sm:grid-cols-2'>
            {(['personal', 'team'] as const).map((mode) => (
              <label
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  usageMode === mode
                    ? 'border-primary bg-primary-soft/50 text-foreground'
                    : 'border-border bg-background text-muted-foreground hover:bg-surface-subtle'
                }`}
                key={mode}
              >
                <input
                  checked={usageMode === mode}
                  className='accent-primary-action'
                  name='employee-request-usage-mode'
                  onChange={() => setUsageMode(mode)}
                  type='radio'
                  value={mode}
                />
                <span>
                  {t(
                    mode === 'personal'
                      ? 'employee.requestNewSoftware.usagePersonal'
                      : 'employee.requestNewSoftware.usageTeam'
                  )}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {usageMode === 'team' && (
          <EmployeeTeamRequestFields selectedMemberIds={selectedTeamMemberIds} onChange={setSelectedTeamMemberIds} />
        )}

        <div>
          <label className='mb-1.5 block text-sm font-semibold text-foreground' htmlFor='employee-request-reason'>
            {t('employee.requestNewSoftware.fieldReason')}
          </label>
          <textarea
            className='w-full rounded-xl border border-border bg-background p-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action sm:text-sm'
            id='employee-request-reason'
            onChange={(event) => setReason(event.target.value)}
            placeholder={t('employee.requestNewSoftware.fieldReasonPlaceholder')}
            rows={3}
            value={reason}
          />
        </div>

        {!canContinue && (
          <p className='text-sm text-danger-ink' role='status'>
            {t(
              !plan.trim() || !reason.trim()
                ? 'employee.requestNewSoftware.completeFields'
                : !usageMode
                  ? 'employee.requestNewSoftware.usageModeRequired'
                  : 'employee.requestNewSoftware.otherSoftwareNameRequired'
            )}
          </p>
        )}

        <div className='flex items-center justify-between gap-3 border-t border-border pt-5'>
          <button
            className='min-h-11 rounded-xl border border-border px-4 text-sm font-semibold text-muted-foreground transition hover:text-foreground'
            onClick={handleBackToSoftware}
            type='button'
          >
            {t('employee.requestNewSoftware.backToSoftware')}
          </button>
          <button
            className='inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-action px-5 text-sm font-bold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action disabled:cursor-not-allowed disabled:opacity-50'
            disabled={!canContinue}
            onClick={handleContinue}
            type='button'
          >
            <span>{t('employee.requestNewSoftware.actContinue')}</span>
            <ArrowRight aria-hidden='true' className='size-4' />
          </button>
        </div>
      </div>
    </div>
  )
}
