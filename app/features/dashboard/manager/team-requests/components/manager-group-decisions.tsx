import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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

export function ManagerGroupDecisions({
  id,
  employeeId,
  hasSpend,
  requestPending
}: {
  id: string
  employeeId: string
  hasSpend: boolean
  requestPending: boolean
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
  const [rejected, setRejected] = useState<string[]>([])
  const action = useManagerAction({
    mutationFn: (body: LineNeedDecisionBodyDto) => accessRequestLineNeedDecide(id, body),
    invalidate: [getAccessRequestLineListQueryKey(id), getAccessRequestGetQueryKey(id), getSpendQueueListQueryKey()],
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
            if (action.blocked || !complete || !requestPending) return
            const form = new FormData(event.currentTarget)
            const decisions = pending.map((line, index) => {
              const decision =
                form.get(`lines.${index}.decision`) === NEED_DECISION.REJECT
                  ? NEED_DECISION.REJECT
                  : NEED_DECISION.APPROVE
              const reason = String(form.get(`lines.${index}.reason`) ?? '').trim()
              return { employeeId: line.employee.employeeId, decision, ...(reason ? { reason } : {}) }
            })
            const term = String(form.get('termConfirmation') ?? '').trim()
            setConfirmation({
              lines: decisions,
              ...(term ? { termConfirmation: { reason: term } } : {}),
              ...(hasSpend && decisions.some((line) => line.decision === NEED_DECISION.APPROVE)
                ? { spend: allocationFromForm(form) }
                : {})
            })
          }}
        >
          <fieldset disabled={action.blocked || !requestPending} className='space-y-4'>
            {lines.map((line) => (
              <article key={line.employee.employeeId} className='space-y-3 border-b border-border/40 pb-4'>
                <div className='flex flex-wrap justify-between gap-2'>
                  <p className='truncate text-sm font-medium' title={line.employee.fullName}>
                    {line.employee.fullName}
                  </p>
                  <ManagerStatus value={line.state} />
                </div>
                {pending.includes(line) && (
                  <>
                    <ManagerField label={translate('decision')}>
                      <select
                        name={`lines.${pending.indexOf(line)}.decision`}
                        className={managerInputClass}
                        defaultValue=''
                        required
                        onChange={(event) =>
                          setRejected((previous) =>
                            event.target.value === NEED_DECISION.REJECT
                              ? [...previous, line.employee.employeeId]
                              : previous.filter((id) => id !== line.employee.employeeId)
                          )
                        }
                      >
                        <option value='' disabled>
                          {translate('decision')}
                        </option>
                        <option value={NEED_DECISION.APPROVE}>{translate('approve')}</option>
                        <option value={NEED_DECISION.REJECT}>{translate('reject')}</option>
                      </select>
                    </ManagerField>
                    <ManagerField label={translate('reason')}>
                      <textarea
                        className={managerInputClass}
                        name={`lines.${pending.indexOf(line)}.reason`}
                        required={rejected.includes(line.employee.employeeId)}
                        maxLength={1000}
                      />
                    </ManagerField>
                  </>
                )}
              </article>
            ))}
            {!!pending.length && requestPending && (
              <>
                <ManagerField label={translate('termConfirmation')}>
                  <textarea name='termConfirmation' maxLength={1000} className={managerInputClass} />
                </ManagerField>
                {hasSpend && pending.some((line) => !rejected.includes(line.employee.employeeId)) && (
                  <ManagerPlanAllocation id={id} />
                )}
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
              <ManagerButton primary type='submit' disabled={action.blocked || !complete} busy={action.isPending}>
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
          <div className='flex justify-end gap-3'>
            <ManagerButton disabled={action.isPending} onClick={() => setConfirmation(null)}>
              {translate('cancel')}
            </ManagerButton>
            <ManagerButton
              primary
              busy={action.isPending}
              disabled={action.blocked}
              onClick={() => {
                if (!action.blocked) action.mutate(confirmation)
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
