import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useNeedDecisionList } from '~/shared/api/generated/operations/need-decisions/need-decision-list'
import { useSpendApprovalList } from '~/shared/api/generated/operations/spend-approvals/spend-approval-list'
import type { ApprovalTabKey } from '../../enums'
import { ApprovalsButton, ApprovalsPage } from '../../shared/components/approvals-ui'
import { NeedDecisionList } from '../components/need-decision-list'
import { SpendApprovalList } from '../components/spend-approval-list'
import { QUEUE_LIST, type QueueList } from '../enums/queue-list'

/** pageSize=1 keeps the count request cheap; pagination.totalItems is the server total. */
const countParams = { page: 1, pageSize: 1 } as const

export function ApprovalQueueView({
  onSelectTab
}: {
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const [searchParams] = useSearchParams()
  const activeList: QueueList = searchParams.get('list') === QUEUE_LIST.NEED ? QUEUE_LIST.NEED : QUEUE_LIST.SPEND
  const spendTotal = useSpendApprovalList(countParams).data?.data?.pagination.totalItems
  const needTotal = useNeedDecisionList(countParams).data?.data?.pagination.totalItems
  const lists = [
    { key: QUEUE_LIST.SPEND, label: translate('listSpend'), total: spendTotal },
    { key: QUEUE_LIST.NEED, label: translate('listNeed'), total: needTotal }
  ]
  return (
    <ApprovalsPage title={translate('queue')}>
      <div
        role='group'
        aria-label={translate('queue')}
        className='inline-flex flex-wrap gap-1 rounded-lg border border-border/70 bg-surface-subtle p-1'
      >
        {lists.map((list) => (
          <ApprovalsButton
            key={list.key}
            variant='ghost'
            aria-pressed={activeList === list.key}
            onClick={() => onSelectTab('queue', list.key === QUEUE_LIST.NEED ? { list: QUEUE_LIST.NEED } : undefined)}
          >
            {list.label}
            {list.total !== undefined && <span className='font-mono text-xs tabular-nums'>{list.total}</span>}
          </ApprovalsButton>
        ))}
      </div>
      {activeList === QUEUE_LIST.NEED ? (
        <NeedDecisionList onOpen={(requestId) => onSelectTab('need', { id: requestId })} />
      ) : (
        <SpendApprovalList
          onOpen={(requestId, batchId) =>
            onSelectTab('request', batchId ? { id: requestId, batch: batchId } : { id: requestId })
          }
        />
      )}
    </ApprovalsPage>
  )
}
