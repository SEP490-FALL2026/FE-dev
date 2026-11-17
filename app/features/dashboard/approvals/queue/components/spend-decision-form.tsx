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
import { DecisionChecklistPanel } from '../../shared/components/decision-checklist'
import { CHECKLIST_ANSWER, DECISION_STEP, useDecisionChecklist } from '../../shared/hooks/use-decision-checklist'
import { useSpendBeneficiaries } from '../hooks/use-spend-beneficiaries'
import { useSpendDecision } from '../hooks/use-spend-decision'
import type { useSpendYears } from '../hooks/use-spend-years'
import { SPEND_DECISION } from '../enums/spend-decision'
import { SPEND_STEP_STATE } from '../enums/spend-step-state'
import { BENEFICIARY_STATE } from '../enums/beneficiary-state'
import { SpendDeclineDialog, type DeclineKind } from './spend-decline-dialog'
import type { SpendApproval } from './spend-request-facts'

type Year = ReturnType<typeof useSpendYears>['years'][number]
export function SpendDecisionForm({
  approval,
  isGroup,
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
  const checklist = useDecisionChecklist(DECISION_STEP.SPEND)
  const [declining, setDeclining] = useState<DeclineKind | null>(null)
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
  const allLinesDecided =
    confirmedLines.length > 0 &&
    confirmedLines.length <= 100 &&
    confirmedLines.every((line) => {
      const draft = lineDrafts[line.employee.employeeId]
      return (
        draft &&
        (draft.decision === SPEND_DECISION.APPROVE ||
          ((draft.decision === SPEND_DECISION.REJECT || draft.decision === SPEND_DECISION.RETURN) &&
            Boolean(draft.reason.trim())))
      )
    })
  const returnedLines = confirmedLines.filter(
    (line) => lineDrafts[line.employee.employeeId]?.decision === SPEND_DECISION.RETURN
  ).length
  const returnAllOrNone = returnedLines === 0 || returnedLines === confirmedLines.length
  const approving = confirmedLines.some(
    (line) => lineDrafts[line.employee.employeeId]?.decision === SPEND_DECISION.APPROVE
  )
  const groupValid =
    isGroup &&
    canDecide &&
    confirmed &&
    allLinesDecided &&
    returnAllOrNone &&
    checklist.complete &&
    !(approving && checklist.hasNo)
  // One request: the three buttons are the decision. A No in the checklist blocks only the approval,
  // and rejecting or returning needs a reason.
  const answered = canDecide && confirmed && checklist.complete
  const canApprove = answered && !checklist.hasNo
  const canDecline = answered
  const agreeAll = confirmed && checklist.complete && !checklist.hasNo
  const pendingDecision = mutations.single.isPending ? mutations.single.variables?.data.decision : undefined
  const options = [
    { value: '', label: translate('choose') },
    { value: SPEND_DECISION.APPROVE, label: translate('approve') },
    { value: SPEND_DECISION.REJECT, label: translate('reject') },
    { value: SPEND_DECISION.RETURN, label: translate('return') }
  ]
  const submitSingle = (
    decision: typeof SPEND_DECISION.APPROVE | typeof SPEND_DECISION.REJECT | typeof SPEND_DECISION.RETURN,
    reason = ''
  ) => {
    const checklistPayload = checklist.payload()
    const allowed = decision === SPEND_DECISION.APPROVE ? canApprove : canDecline
    if (!allowed || !checklistPayload || submissionLocked.current) return
    submissionLocked.current = true
    const data: SpendDecisionBodyDto = {
      decision,
      checklist: checklistPayload,
      ...(decision !== SPEND_DECISION.APPROVE ? { reason: reason.trim() } : {})
    }
    mutations.single.mutate(
      { id: approval.requestId, data },
      {
        onSettled: () => {
          submissionLocked.current = false
        },
        onSuccess: () => setDeclining(null),
        onError: checklist.handleError
      }
    )
  }
  // A group goes back to its head as a whole: choosing RETURN for one person chooses it for everyone,
  // and moving one person away from RETURN clears the others that were returned.
  const changeLine = (id: string, patch: Partial<{ decision: string; reason: string }>) =>
    setLineDrafts((previous) => {
      const next = { ...previous, [id]: { ...(previous[id] ?? { decision: '', reason: '' }), ...patch } }
      if (patch.decision === undefined) return next
      for (const line of confirmedLines) {
        const key = line.employee.employeeId
        if (key === id) continue
        const draft = next[key] ?? { decision: '', reason: '' }
        if (patch.decision === SPEND_DECISION.RETURN) next[key] = { ...draft, decision: SPEND_DECISION.RETURN }
        else if (draft.decision === SPEND_DECISION.RETURN) next[key] = { ...draft, decision: '' }
      }
      return next
    })
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
          const checklistPayload = checklist.payload()
          if (!isGroup || !groupValid || !checklistPayload || submissionLocked.current) return
          submissionLocked.current = true
          const lines: LineSpendDecisionBodyDto['lines'] = confirmedLines.map((line) => {
            const draft = lineDrafts[line.employee.employeeId]
            return draft.decision === SPEND_DECISION.APPROVE
              ? { employeeId: line.employee.employeeId, decision: SPEND_DECISION.APPROVE }
              : {
                  employeeId: line.employee.employeeId,
                  decision: draft.decision === SPEND_DECISION.RETURN ? SPEND_DECISION.RETURN : SPEND_DECISION.REJECT,
                  reason: draft.reason.trim()
                }
          })
          mutations.group.mutate(
            { id: approval.requestId, data: { lines, checklist: checklistPayload } },
            {
              onSettled: () => {
                submissionLocked.current = false
              },
              onError: checklist.handleError
            }
          )
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
                  {(lineDrafts[line.employee.employeeId]?.decision === SPEND_DECISION.REJECT ||
                    lineDrafts[line.employee.employeeId]?.decision === SPEND_DECISION.RETURN) && (
                    <ApprovalsField
                      label={translate(
                        lineDrafts[line.employee.employeeId]?.decision === SPEND_DECISION.RETURN
                          ? 'lineReturnReason'
                          : 'lineReason',
                        { name: line.employee.fullName }
                      )}
                      required
                    >
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
          ) : null}
          <DecisionChecklistPanel checklist={checklist} disabled={!canDecide} collapsible />
          <label className='flex min-h-11 items-start gap-3 text-sm'>
            <input
              className='mt-0.5 size-4 accent-primary'
              type='checkbox'
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
            />
            {translate('decisionConfirmation')}
          </label>
          <label className='flex min-h-11 items-start gap-3 text-sm font-medium'>
            <input
              className='mt-0.5 size-4 accent-primary'
              type='checkbox'
              checked={agreeAll}
              onChange={(event) => {
                setConfirmed(event.target.checked)
                checklist.setAll(event.target.checked ? CHECKLIST_ANSWER.YES : null)
              }}
            />
            {translate('agreeAll')}
          </label>
        </fieldset>
        <div className='flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4'>
          <span className='text-sm font-medium'>{translate('decide')}</span>
          {isGroup ? (
            <ApprovalsButton variant='primary' type='submit' disabled={!groupValid} pending={mutations.isPending}>
              {translate('decide')}
            </ApprovalsButton>
          ) : (
            <div className='flex flex-wrap justify-end gap-3'>
              <ApprovalsButton
                variant='danger'
                type='button'
                disabled={!canDecline || mutations.isPending}
                onClick={() => setDeclining('REJECT')}
              >
                {translate('reject')}
              </ApprovalsButton>
              <ApprovalsButton
                variant='secondary'
                type='button'
                disabled={!canDecline || mutations.isPending}
                onClick={() => setDeclining('RETURN')}
              >
                {translate('return')}
              </ApprovalsButton>
              <ApprovalsButton
                variant='primary'
                type='button'
                disabled={!canApprove || mutations.isPending}
                pending={pendingDecision === SPEND_DECISION.APPROVE}
                onClick={() => submitSingle(SPEND_DECISION.APPROVE)}
              >
                {translate('approve')}
              </ApprovalsButton>
            </div>
          )}
        </div>
      </form>
      {declining && (
        <SpendDeclineDialog
          kind={declining}
          pending={mutations.single.isPending}
          onSubmit={(reason) => submitSingle(declining, reason)}
          onClose={() => setDeclining(null)}
        />
      )}
    </ApprovalsSection>
  )
}
