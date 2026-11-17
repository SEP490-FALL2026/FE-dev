import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ApprovalTabKey } from '../../enums'
import { ApprovalsPage } from '../../shared/components/approvals-ui'
import { SpendApprovalList } from '../components/spend-approval-list'
import { SpendBatchList } from '../components/spend-batch-list'
import { SpendQueueAiSummary } from '../components/spend-queue-ai-summary'

const VIEWS = ['requests', 'batches'] as const
type QueueView = (typeof VIEWS)[number]

export function ApprovalQueueView({
  onSelectTab
}: {
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const [view, setView] = useState<QueueView>('requests')
  return (
    <ApprovalsPage title={translate('queue')}>
      <div role='tablist' aria-label={translate('queue')} className='inline-flex rounded-lg bg-surface-subtle p-1'>
        {VIEWS.map((key) => (
          <button
            key={key}
            type='button'
            role='tab'
            aria-selected={view === key}
            onClick={() => setView(key)}
            className={`min-h-9 rounded-md px-4 text-sm font-medium transition-colors ${
              view === key ? 'bg-surface text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {translate(`views.${key}`)}
          </button>
        ))}
      </div>
      {view === 'requests' ? (
        <>
          <SpendQueueAiSummary onOpen={(requestId) => onSelectTab('request', { id: requestId })} />
          <SpendApprovalList
            onOpen={(requestId, batchId) =>
              onSelectTab('request', batchId ? { id: requestId, batch: batchId } : { id: requestId })
            }
          />
        </>
      ) : (
        <SpendBatchList onOpen={(batchId) => onSelectTab('batch', { id: batchId })} />
      )}
    </ApprovalsPage>
  )
}
