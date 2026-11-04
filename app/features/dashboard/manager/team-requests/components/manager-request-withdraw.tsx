import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { accessRequestWithdraw } from '~/shared/api/generated/operations/access-requests/access-request-withdraw'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getAccessRequestTimingsGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { getNeedDecisionListQueryKey } from '~/shared/api/generated/operations/need-decisions/need-decision-list'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { getManagerDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/manager-dashboard-get'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { ManagerButton } from '../../shared/components/manager-api-ui'
import { ManagerWithdrawDialog } from './manager-withdraw-dialog'

export function ManagerRequestWithdraw({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const [open, setOpen] = useState(false)
  const action = useManagerAction({
    mutationFn: (reason: string) => accessRequestWithdraw(id, { reason }),
    invalidate: [
      getAccessRequestGetQueryKey(id),
      getAccessRequestTimingsGetQueryKey(id),
      getNeedDecisionListQueryKey(),
      getSpendQueueListQueryKey(),
      getManagerDashboardGetQueryKey()
    ],
    onSuccess: () => setOpen(false)
  })
  return (
    <>
      <ManagerButton onClick={() => setOpen(true)}>{translate('integration.withdraw')}</ManagerButton>
      {open && (
        <ManagerWithdrawDialog
          title={translate('integration.withdraw')}
          action={action}
          onClose={() => setOpen(false)}
          onConfirm={action.mutate}
        />
      )}
    </>
  )
}
