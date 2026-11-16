import { useTranslation } from 'react-i18next'
import type { ApprovalTabKey } from '../../enums'
import { ApprovalsPage } from '../../shared/components/approvals-ui'
import { SpendApprovalList } from '../components/spend-approval-list'

export function ApprovalQueueView({
  onSelectTab
}: {
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  return (
    <ApprovalsPage title={translate('queue')}>
      <SpendApprovalList
        onOpen={(requestId, batchId) =>
          onSelectTab('request', batchId ? { id: requestId, batch: batchId } : { id: requestId })
        }
      />
    </ApprovalsPage>
  )
}
