import { getAccessRequestTimingsGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { getNeedDecisionListQueryKey } from '~/shared/api/generated/operations/need-decisions/need-decision-list'
import { getManagerDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/manager-dashboard-get'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { LineNeedDecisionBodyDto } from '~/shared/api/generated/model/group-requests/lineNeedDecisionBodyDto'
import {
  useAccessRequestLineList,
  getAccessRequestLineListQueryKey
} from '~/shared/api/generated/operations/group-requests/access-request-line-list'
import { accessRequestLineNeedDecide } from '~/shared/api/generated/operations/group-requests/access-request-line-need-decide'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { Dialog } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { NEED_STEP_STATE, NEED_DECISION, GROUP_LINE_STATE } from '../enums/need-decision'
import { allocationFromForm, ManagerPlanAllocation } from './manager-plan-allocation'
import { ManagerDecisionFields, type ManagerDecisionChoice } from './manager-decision-fields'

export function ManagerGroupDecisions({
  id,
  employeeId,
  hasSpend,
  requestPending,
  termRequired = false
}: {
  id: string
  employeeId: string
  hasSpend: boolean
  requestPending: boolean
  termRequired?: boolean
}) {
  const { t: translate } = useTranslation('manager')
  // Group creation is capped at ten; still refuse a partial response if that contract changes.
  const query = useAccessRequestLineList(id, { page: 1, pageSize: 100 })
  const lines = !query.isError ? (query.data?.data?.items ?? []) : []
  const pending = lines.filter(
    (line) =>
      line.state === GROUP_LINE_STATE.AWAITING_NEED &&
      line.needStep?.state === NEED_STEP_STATE.PENDING &&
      line.needStep.assignee?.employeeId === employeeId
  )
  const complete = query.isSuccess && query.data?.data?.pagination.totalPages === 1
  const [confirmation, setConfirmation] = useState<LineNeedDecisionBodyDto | null>(null)
  const [individual, setIndividual] = useState(false)
  const [common, setCommon] = useState<ManagerDecisionChoice>({ decision: '', reason: '' })
  const [choices, setChoices] = useState<Record<string, ManagerDecisionChoice>>({})
  const choiceFor = (personId: string) => (individual ? (choices[personId] ?? { decision: '', reason: '' }) : common)
  const hasApproval = pending.some((line) => choiceFor(line.employee.employeeId).decision === NEED_DECISION.APPROVE)
  const confirmationCurrent =
    !!confirmation &&
    requestPending &&
    complete &&
    !query.isFetching &&
    pending.length === confirmation.lines.length &&
    pending.every((line) => confirmation.lines.some((decision) => decision.employeeId === line.employee.employeeId))
  const action = useManagerAction({
    mutationFn: (body: LineNeedDecisionBodyDto) => accessRequestLineNeedDecide(id, body),
    invalidate: [
      getAccessRequestLineListQueryKey(id),
      getAccessRequestGetQueryKey(id),
      getAccessRequestTimingsGetQueryKey(id),
      getSpendQueueListQueryKey(),
      getNeedDecisionListQueryKey(),
      getManagerDashboardGetQueryKey()
    ],
    onSuccess: () => setConfirmation(null)
  })
  return (
    <ManagerSection title={translate('participants')}>
      <ManagerQueryState query={query} empty={!lines.length} />
      <ManagerFormErrors fields={action.fields}>
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault()
            if (action.blocked || !complete || query.isFetching || !requestPending || !pending.length) return
            const form = new FormData(event.currentTarget)
            const decisions: LineNeedDecisionBodyDto['lines'] = []
            for (const line of pending) {
              const choice = choiceFor(line.employee.employeeId)
              if (!choice.decision || (choice.decision === NEED_DECISION.REJECT && !choice.reason.trim())) return
              decisions.push({
                employeeId: line.employee.employeeId,
                decision: choice.decision,
                ...(choice.decision === NEED_DECISION.REJECT ? { reason: choice.reason.trim() } : {})
              })
            }
            const spend = hasSpend && hasApproval ? allocationFromForm(form) : undefined
            if (hasSpend && hasApproval && !spend) {
              toast.error(translate('validation'), { id: 'manager-group-allocation' })
              return
            }
            const term = String(form.get('termConfirmation') ?? '').trim()
            if (termRequired && hasApproval && !term) return
            setConfirmation({
              lines: decisions,
              ...(termRequired && hasApproval ? { termConfirmation: { reason: term } } : {}),
              ...(spend ? { spend } : {})
            })
          }}
        >
          <fieldset disabled={action.blocked || !requestPending} className='space-y-4'>
            {!!pending.length && requestPending && (
              <>
                <label className='flex min-h-11 items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={individual}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setChoices(Object.fromEntries(pending.map((line) => [line.employee.employeeId, { ...common }])))
                      }
                      setIndividual(event.target.checked)
                    }}
                  />
                  {translate('requestForm.individualDecisions')}
                </label>
                {!individual && (
                  <ManagerDecisionFields
                    label={translate('requestForm.commonDecision')}
                    name='common'
                    value={common}
                    onChange={setCommon}
                  />
                )}
              </>
            )}
            {lines.map((line) => (
              <article key={line.employee.employeeId} className='space-y-3 border-b border-border/40 pb-4'>
                <div className='flex flex-wrap justify-between gap-2'>
                  <p className='truncate text-sm font-medium' title={line.employee.fullName}>
                    {line.employee.fullName}
                  </p>
                  <ManagerStatus value={line.state} />
                </div>
                {individual && pending.includes(line) && (
                  <ManagerDecisionFields
                    label={translate('requestForm.personDecision', { name: line.employee.fullName })}
                    name={`lines.${pending.indexOf(line)}`}
                    value={choiceFor(line.employee.employeeId)}
                    onChange={(value) => setChoices((previous) => ({ ...previous, [line.employee.employeeId]: value }))}
                  />
                )}
              </article>
            ))}
            {!!pending.length && requestPending && (
              <>
                {termRequired && hasApproval && (
                  <ManagerField label={translate('requestForm.termConfirmation')}>
                    <textarea name='termConfirmation' required maxLength={1000} className={managerInputClass} />
                  </ManagerField>
                )}
                {hasSpend && hasApproval && <ManagerPlanAllocation id={id} />}
              </>
            )}
          </fieldset>
          <ManagerActionState action={action} />
          {!complete && query.isSuccess && (
            <p role='status' className='text-sm text-warning'>
              {translate('groupIncomplete')}
            </p>
          )}
          {!!pending.length && requestPending && (
            <div className='flex justify-end'>
              <ManagerButton
                primary
                type='submit'
                disabled={action.blocked || !complete || query.isFetching}
                busy={action.isPending}
              >
                {action.retrySeconds ? translate('retryAfter', { seconds: action.retrySeconds }) : translate('confirm')}
              </ManagerButton>
            </div>
          )}
        </form>
      </ManagerFormErrors>
      {confirmation && (
        <Dialog
          presentation='sheet'
          title={translate('decision')}
          hint={translate('confirmAction')}
          onClose={() => {
            if (!action.isPending) setConfirmation(null)
          }}
        >
          <p className='mb-4 text-sm'>
            {translate('requestForm.decisionsSummary', {
              approved: confirmation.lines.filter((line) => line.decision === NEED_DECISION.APPROVE).length,
              rejected: confirmation.lines.filter((line) => line.decision === NEED_DECISION.REJECT).length
            })}
          </p>
          <div className='flex justify-end gap-3'>
            <ManagerButton disabled={action.isPending} onClick={() => setConfirmation(null)}>
              {translate('cancel')}
            </ManagerButton>
            <ManagerButton
              primary
              busy={action.isPending}
              disabled={action.blocked || !confirmationCurrent}
              onClick={() => {
                if (!action.blocked && confirmationCurrent) action.mutate(confirmation)
              }}
            >
              {translate('confirm')}
            </ManagerButton>
          </div>
        </Dialog>
      )}
    </ManagerSection>
  )
}
