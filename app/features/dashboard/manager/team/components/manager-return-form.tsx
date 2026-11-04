import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DepartmentToolsResponseDtoDataItemsItem } from '~/shared/api/generated/model/departments/departmentToolsResponseDtoDataItemsItem'
import { returnRequestSubmit } from '~/shared/api/generated/operations/return-requests/return-request-submit'
import { getReturnRequestListQueryKey } from '~/shared/api/generated/operations/return-requests/return-request-list'
import { getDepartmentToolsInUseQueryKey } from '~/shared/api/generated/operations/departments/department-tools-in-use'
import { getManagerDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/manager-dashboard-get'
import { Dialog } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  managerInputClass
} from '../../shared/components/manager-api-ui'

export function ManagerReturnForm({
  assignment,
  departmentId,
  onClose,
  onCreated
}: {
  assignment: DepartmentToolsResponseDtoDataItemsItem
  departmentId: string
  onClose: () => void
  onCreated?: (id: string) => void
}) {
  const { t: translate } = useTranslation('manager')
  const [reason, setReason] = useState('')
  const action = useManagerAction({
    mutationFn: () => returnRequestSubmit({ assignmentId: assignment.assignmentId, reason: reason.trim() }),
    invalidate: [
      getReturnRequestListQueryKey(),
      getDepartmentToolsInUseQueryKey(departmentId),
      getManagerDashboardGetQueryKey()
    ],
    onSuccess: (result) => {
      onClose()
      if (result.data?.returnRequest.id) onCreated?.(result.data.returnRequest.id)
    }
  })
  return (
    <Dialog
      presentation='sheet'
      title={translate('integration.returnTitle')}
      hint={translate('integration.returnHint')}
      onClose={() => {
        if (!action.isPending) onClose()
      }}
    >
      <div className='space-y-4'>
        <dl className='space-y-3 text-sm'>
          <div>
            <dt className='text-muted-foreground'>{translate('application')}</dt>
            <dd className='break-words'>
              {assignment.application.name} · {assignment.plan.name}
            </dd>
          </div>
          <div>
            <dt className='text-muted-foreground'>{translate('employee')}</dt>
            <dd className='break-words'>
              {assignment.fullName} · {assignment.employeeCode}
            </dd>
          </div>
        </dl>
        {assignment.terminating && (
          <p role='status' className='text-sm text-warning-ink'>
            {translate('integration.alreadyRevoking')}
          </p>
        )}
        <ManagerFormErrors fields={action.fields}>
          <form
            className='space-y-4'
            onSubmit={(event) => {
              event.preventDefault()
              if (!action.blocked && !assignment.terminating && reason.trim()) action.mutate()
            }}
          >
            <ManagerField label={translate('reason')}>
              <textarea
                name='reason'
                className={managerInputClass}
                required
                maxLength={1000}
                disabled={action.isPending || assignment.terminating}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </ManagerField>
            <ManagerActionState action={action} />
            <div className='flex justify-end gap-3'>
              <ManagerButton disabled={action.isPending} onClick={onClose}>
                {translate('cancel')}
              </ManagerButton>
              <ManagerButton
                primary
                type='submit'
                busy={action.isPending}
                disabled={action.blocked || assignment.terminating || !reason.trim()}
              >
                {action.retrySeconds
                  ? translate('retryAfter', { seconds: action.retrySeconds })
                  : translate('integration.submitReturn')}
              </ManagerButton>
            </div>
          </form>
        </ManagerFormErrors>
      </div>
    </Dialog>
  )
}
