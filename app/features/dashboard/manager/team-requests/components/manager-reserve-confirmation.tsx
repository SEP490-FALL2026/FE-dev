import { useTranslation } from 'react-i18next'
import { spendReserveConfirm } from '~/shared/api/generated/operations/spend-submission/spend-reserve-confirm'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getDepartmentAccessRequestListQueryKey } from '~/shared/api/generated/operations/access-requests/department-access-request-list'
import { getAccessRequestEventListQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-event-list'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import type { ReserveConfirmationBodyDto } from '~/shared/api/generated/model/spend-submission/reserveConfirmationBodyDto'
import { POLICY_STEP } from '~/entities/policy/policy-steps'
import { usePolicyChecklist } from '~/entities/policy/hooks/use-policy-checklist'
import { PolicyChecklist } from '~/entities/policy/components/policy-checklist'
import { isPolicyVersionChanged } from '~/entities/policy/policy-errors'
import { Dialog } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import {
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  managerInputClass
} from '../../shared/components/manager-api-ui'

export function ManagerReserveConfirmation({ id, onClose }: { id: string; onClose: () => void }) {
  const { t: flow } = useTranslation('requestFlow')
  const me = useMeGet()
  const checklist = usePolicyChecklist(POLICY_STEP.RESERVE_CONFIRMATION)
  const action = useManagerAction({
    mutationFn: (body: ReserveConfirmationBodyDto) => spendReserveConfirm(id, body),
    invalidate: [
      getSpendQueueListQueryKey(),
      getAccessRequestGetQueryKey(id),
      getDepartmentAccessRequestListQueryKey(me.data?.data?.managerScope?.departmentId ?? ''),
      getAccessRequestEventListQueryKey(id)
    ],
    onSuccess: onClose,
    onError: (error) => {
      if (isPolicyVersionChanged(error)) checklist.reload()
    }
  })
  /** Step 1.6 has no other decision: a No answer means the reserve cannot be used. */
  const canConfirm = !!checklist.body && !checklist.hasNo
  return (
    <Dialog
      presentation='sheet'
      title={flow('confirmReserve')}
      onClose={() => {
        if (!action.isPending) onClose()
      }}
    >
      <ManagerFormErrors fields={action.fields}>
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault()
            const reason = String(new FormData(event.currentTarget).get('reason')).trim()
            if (!action.blocked && canConfirm && checklist.body && reason)
              action.mutate({ reason, checklist: checklist.body })
          }}
        >
          <PolicyChecklist checklist={checklist} disabled={action.blocked} blockingNo />
          <ManagerField label={flow('reserveReason')}>
            <textarea
              className={managerInputClass}
              name='reason'
              required
              maxLength={500}
              rows={3}
              disabled={action.blocked}
            />
          </ManagerField>
          <div className='flex justify-end gap-3'>
            <ManagerButton disabled={action.isPending} onClick={onClose}>
              {flow('cancel')}
            </ManagerButton>
            <ManagerButton primary type='submit' busy={action.isPending} disabled={action.blocked || !canConfirm}>
              {flow('confirmReserve')}
            </ManagerButton>
          </div>
        </form>
      </ManagerFormErrors>
    </Dialog>
  )
}
