import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { NeedDecisionBodyDto } from '~/shared/api/generated/model/access-requests/needDecisionBodyDto'
import { accessRequestNeedDecide } from '~/shared/api/generated/operations/access-requests/access-request-need-decide'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { Dialog } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { NEED_DECISION } from '../enums/need-decision'
import { allocationFromForm, ManagerPlanAllocation } from './manager-plan-allocation'

export function ManagerNeedForm({ id, hasSpend }: { id: string; hasSpend: boolean }) {
  const { t: translate } = useTranslation('manager')
  const [decision, setDecision] = useState<NeedDecisionBodyDto['decision']>(NEED_DECISION.APPROVE)
  const [confirmation, setConfirmation] = useState<NeedDecisionBodyDto | null>(null)
  const action = useManagerAction({
    mutationFn: (body: NeedDecisionBodyDto) => accessRequestNeedDecide(id, body),
    invalidate: [getAccessRequestGetQueryKey(id), getSpendQueueListQueryKey()],
    onSuccess: () => setConfirmation(null)
  })
  return (
    <ManagerFormErrors fields={action.fields}>
      <form
        className='space-y-4'
        onSubmit={(event) => {
          event.preventDefault()
          if (action.blocked) return
          const form = new FormData(event.currentTarget)
          const reason = String(form.get('reason') ?? '').trim()
          const term = String(form.get('termConfirmation') ?? '').trim()
          setConfirmation({
            decision,
            ...(reason ? { reason } : {}),
            ...(decision === NEED_DECISION.APPROVE && term ? { termConfirmation: { reason: term } } : {}),
            ...(decision === NEED_DECISION.APPROVE && hasSpend ? { spend: allocationFromForm(form) } : {})
          })
        }}
      >
        <fieldset disabled={action.blocked} className='space-y-4'>
          <div className='flex flex-wrap gap-3'>
            {Object.values(NEED_DECISION).map((value) => (
              <label key={value} className='flex min-h-11 items-center gap-2 text-sm'>
                <input name='decision' type='radio' checked={decision === value} onChange={() => setDecision(value)} />
                {translate(value === NEED_DECISION.APPROVE ? 'approve' : 'reject')}
              </label>
            ))}
          </div>
          <ManagerField label={translate('reason')}>
            <textarea
              className={managerInputClass}
              name='reason'
              required={decision === NEED_DECISION.REJECT}
              maxLength={1000}
            />
          </ManagerField>
          {decision === NEED_DECISION.APPROVE && (
            <>
              <ManagerField label={translate('termConfirmation')}>
                <textarea className={managerInputClass} name='termConfirmation' maxLength={1000} />
              </ManagerField>
              {hasSpend && <ManagerPlanAllocation id={id} />}
            </>
          )}
        </fieldset>
        <ManagerActionState action={action} />
        <div className='flex justify-end'>
          <ManagerButton primary type='submit' busy={action.isPending} disabled={action.blocked}>
            {action.retrySeconds ? translate('retryAfter', { seconds: action.retrySeconds }) : translate('confirm')}
          </ManagerButton>
        </div>
      </form>
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
    </ManagerFormErrors>
  )
}
