import { Clock, Layers, ListChecks } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ApprovalTabKey } from '../../enums'
import { ApprovalsPage, ApprovalsSection } from '../../shared/components/approvals-ui'
import { ApprovalsSegmented } from '../../shared/components/approvals-segmented'
import { SpendApprovalList } from '../components/spend-approval-list'
import { SpendBatchList } from '../components/spend-batch-list'
import { SpendQueueAiSummary } from '../components/spend-queue-ai-summary'

type QueueView = 'requests' | 'batches'

export function ApprovalQueueView({
  onSelectTab
}: {
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const [view, setView] = useState<QueueView>('requests')
  return (
    <ApprovalsPage icon={Clock} title={translate('queue')} description={translate('layout.queueDescription')}>
      <ApprovalsSegmented
        label={translate('queue')}
        value={view}
        onChange={setView}
        items={[
          { key: 'requests', label: translate('views.requests'), icon: ListChecks },
          { key: 'batches', label: translate('views.batches'), icon: Layers }
        ]}
      />
      {view === 'requests' ? (
        <>
          <ApprovalsSection title={translate('layout.requestsTitle')} description={translate('pageScope')}>
            <SpendApprovalList
              onOpen={(requestId, batchId) =>
                onSelectTab('request', batchId ? { id: requestId, batch: batchId } : { id: requestId })
              }
            />
          </ApprovalsSection>
          <SpendQueueAiSummary onOpen={(requestId) => onSelectTab('request', { id: requestId })} />
        </>
      ) : (
        <ApprovalsSection title={translate('layout.batchesTitle')} description={translate('layout.batchesDescription')}>
          <SpendBatchList onOpen={(batchId) => onSelectTab('batch', { id: batchId })} />
        </ApprovalsSection>
      )}
    </ApprovalsPage>
  )
}
