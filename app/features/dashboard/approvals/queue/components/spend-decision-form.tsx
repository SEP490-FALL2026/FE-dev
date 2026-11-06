import { AlertTriangle } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import type { SpendDecisionBodyDto } from '~/shared/api/generated/model/spend-approvals/spendDecisionBodyDto'
import type { LineSpendDecisionBodyDto } from '~/shared/api/generated/model/group-requests/lineSpendDecisionBodyDto'
import {
  ApprovalsButton,
  ApprovalsField,
  ApprovalsSection,
  ApprovalsSelect,
  approvalsInputClass
} from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { useSpendBeneficiaries } from '../hooks/use-spend-beneficiaries'
import { useSpendDecision } from '../hooks/use-spend-decision'
import type { useSpendYears } from '../hooks/use-spend-years'
import { SPEND_DECISION } from '../enums/spend-decision'
import { SPEND_STEP_STATE } from '../enums/spend-step-state'
import { BUDGET_YEAR_CODE } from '../enums/budget-year-code'
import { BENEFICIARY_STATE } from '../enums/beneficiary-state'
import type { SpendApproval } from './spend-request-facts'

type Year = ReturnType<typeof useSpendYears>['years'][number]
export function SpendDecisionForm({
  approval,
  isGroup,
  years,
  ready,
  blocked
}: {
  approval: SpendApproval
  isGroup: boolean
  years: Year[]
  ready: boolean
  blocked: boolean
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const submissionLocked = useRef(false)
  const me = useMeGet()
  const employeeId = me.data?.data?.employee?.id
  const beneficiaries = useSpendBeneficiaries(approval.requestId, isGroup, approval.request.lineCount)
  const mutations = useSpendDecision()
  const [decision, setDecision] = useState('')
  const [reason, setReason] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [lineDrafts, setLineDrafts] = useState<Record<string, { decision: string; reason: string }>>({})
  const confirmedLines = beneficiaries.lines.filter((line) => line.state === BENEFICIARY_STATE.NEED_CONFIRMED)
  const ownsRequest =
    employeeId === approval.request.requester.employeeId ||
    employeeId === approval.request.beneficiary?.employeeId ||
    beneficiaries.lines.some((line) => line.employee.employeeId === employeeId)
  const canDecide = Boolean(
    employeeId &&
    !me.isError &&
    !me.isFetching &&
    employeeId === approval.step.assignee?.employeeId &&
    !ownsRequest &&
    approval.step.state === SPEND_STEP_STATE.PENDING &&
    ready &&
    !blocked &&
    !mutations.isPending &&
    (!isGroup || beneficiaries.isComplete)
  )
  const deficientYears = years
    .filter(
      (year) => year.code === BUDGET_YEAR_CODE.INSUFFICIENT_BUDGET || year.code === BUDGET_YEAR_CODE.NO_ACTIVE_BUDGET
    )
    .map((year) => year.year)
  const allLinesDecided =
    confirmedLines.length > 0 &&
    confirmedLines.length <= 100 &&
    confirmedLines.every((line) => {
      const draft = lineDrafts[line.employee.employeeId]
      return (
        draft &&
        (draft.decision === SPEND_DECISION.APPROVE ||
          (draft.decision === SPEND_DECISION.REJECT && Boolean(draft.reason.trim())))
      )
    })
  // QĐ-97c: a year short of budget (or without one) blocks approval; only rejection or waiting remains.
  // The approved subset of a group is rechecked by BE, which answers SPEND.OVERRIDE_REQUIRED when still short.
  const approvalBlocked = !isGroup && deficientYears.length > 0
  const decisionValid = isGroup
    ? allLinesDecided
    : (decision === SPEND_DECISION.APPROVE && !approvalBlocked) ||
      (decision === SPEND_DECISION.REJECT && Boolean(reason.trim()))
  const valid = canDecide && confirmed && decisionValid
  const rejectOption = { value: SPEND_DECISION.REJECT, label: translate('reject') }
  const options = [
    { value: '', label: translate('choose') },
    { value: SPEND_DECISION.APPROVE, label: translate('approve') },
    rejectOption
  ]
  const singleOptions = approvalBlocked ? [options[0], rejectOption] : options
  const changeLine = (id: string, patch: Partial<{ decision: string; reason: string }>) =>
    setLineDrafts((previous) => ({
      ...previous,
      [id]: { ...(previous[id] ?? { decision: '', reason: '' }), ...patch }
    }))
  return (
    <ApprovalsSection title={translate('decision')}>
      <ApprovalsQueryState query={me}>{null}</ApprovalsQueryState>
      {!canDecide && !mutations.isPending && (
        <p className='text-sm text-muted-foreground'>{translate(!ready ? 'yearLoading' : 'waiting')}</p>
      )}
      {isGroup && (
        <ApprovalsQueryState query={beneficiaries}>
          <p className='text-sm text-muted-foreground'>{translate('groupHint')}</p>
          {!beneficiaries.isComplete && (
            <p role='status' className='text-sm text-muted-foreground'>
              {translate('linesUnavailable')}
            </p>
          )}
        </ApprovalsQueryState>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!valid || submissionLocked.current) return
          submissionLocked.current = true
          const submissionOptions = {
            onSettled: () => {
              submissionLocked.current = false
            }
          }
          if (isGroup) {
            const lines: LineSpendDecisionBodyDto['lines'] = confirmedLines.map((line) => {
              const draft = lineDrafts[line.employee.employeeId]
              return draft.decision === SPEND_DECISION.APPROVE
                ? { employeeId: line.employee.employeeId, decision: SPEND_DECISION.APPROVE }
                : { employeeId: line.employee.employeeId, decision: SPEND_DECISION.REJECT, reason: draft.reason.trim() }
            })
            mutations.group.mutate({ id: approval.requestId, data: { lines } }, submissionOptions)
          } else if (decision === SPEND_DECISION.APPROVE || decision === SPEND_DECISION.REJECT) {
            const data: SpendDecisionBodyDto = {
              decision,
              ...(decision === SPEND_DECISION.REJECT ? { reason: reason.trim() } : {})
            }
            mutations.single.mutate({ id: approval.requestId, data }, submissionOptions)
          }
        }}
        className='space-y-4 rounded-lg border border-border/70 bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]'
      >
        <fieldset disabled={!canDecide} className='space-y-4 disabled:opacity-60'>
          {isGroup ? (
            <div className='space-y-3'>
              {confirmedLines.map((line) => (
                <div key={line.employee.employeeId} className='space-y-3 rounded-md border border-border/70 p-4'>
                  <p className='truncate text-sm font-medium' title={line.employee.fullName}>
                    {line.employee.fullName}
                  </p>
                  <ApprovalsSelect
                    label={translate('decision')}
                    options={options}
                    value={lineDrafts[line.employee.employeeId]?.decision ?? ''}
                    onChange={(value) => changeLine(line.employee.employeeId, { decision: value })}
                    disabled={!canDecide}
                  />
                  {lineDrafts[line.employee.employeeId]?.decision === SPEND_DECISION.REJECT && (
                    <ApprovalsField label={translate('lineReason', { name: line.employee.fullName })} required>
                      <textarea
                        rows={3}
                        className={approvalsInputClass}
                        value={lineDrafts[line.employee.employeeId]?.reason ?? ''}
                        onChange={(event) => changeLine(line.employee.employeeId, { reason: event.target.value })}
                        placeholder={translate('linePlaceholder')}
                        required
                        maxLength={1000}
                      />
                    </ApprovalsField>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <ApprovalsSelect
                label={translate('decision')}
                value={decision}
                options={singleOptions}
                onChange={setDecision}
                disabled={!canDecide}
              />
              {decision === SPEND_DECISION.REJECT && (
                <ApprovalsField label={translate('rejectReason')} required>
                  <textarea
                    rows={3}
                    className={approvalsInputClass}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder={translate('rejectPlaceholder')}
                    required
                    maxLength={1000}
                  />
                </ApprovalsField>
              )}
            </>
          )}
          {deficientYears.length > 0 && (
            <p
              role='status'
              className='flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-ink'
            >
              <AlertTriangle aria-hidden className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
              {translate(isGroup ? 'budgetShortGroup' : 'budgetShort', {
                years: deficientYears.join(', ')
              })}
            </p>
          )}
          <label className='flex min-h-11 items-start gap-3 text-sm'>
            <input
              className='mt-0.5 size-4 accent-primary'
              type='checkbox'
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
            />
            {translate('decisionConfirmation')}
          </label>
        </fieldset>
        <div className='flex justify-end border-t border-border/60 pt-4'>
          <ApprovalsButton variant='primary' type='submit' disabled={!valid} pending={mutations.isPending}>
            {translate('decide')}
          </ApprovalsButton>
        </div>
      </form>
    </ApprovalsSection>
  )
}
