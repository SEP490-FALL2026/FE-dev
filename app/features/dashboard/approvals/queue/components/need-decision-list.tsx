import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNeedDecisionList } from '~/shared/api/generated/operations/need-decisions/need-decision-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { ApprovalsPagination } from '../../shared/components/approvals-ui'
import { formatMoney } from '../../shared/approvals-money'
import { PrimaryWithDetail } from './primary-with-detail'

/** Department heads' own lines in the group requests they sent: a head never confirms their own need. */
export function NeedDecisionList({ onOpen }: { onOpen: (requestId: string) => void }) {
  const { t: translate, i18n } = useTranslation('approvalsNeed')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useNeedDecisionList({ page, pageSize: 20 })
  return (
    <div className='space-y-3'>
      <p className='text-xs text-muted-foreground'>{translate('queueHint')}</p>
      <ApprovalsQueryState query={query}>
        <ApprovalsTable
          items={query.data?.data?.items ?? []}
          rowKey={(item) => item.stepId}
          onOpen={(item) => onOpen(item.requestId)}
          columns={[
            {
              key: 'software',
              label: translate('software'),
              render: (item) => (
                <PrimaryWithDetail
                  primary={item.plan?.applicationName ?? item.softwareName ?? translate('unknown')}
                  detail={item.plan?.planName}
                />
              )
            },
            {
              key: 'head',
              label: translate('head'),
              render: (item) => <PrimaryWithDetail primary={item.requester.fullName} detail={item.department.name} />
            },
            {
              key: 'cost',
              label: translate('cost'),
              numeric: true,
              render: (item) =>
                item.pricing.amount ? formatMoney(item.pricing.amount, i18n.language) : translate('unknown')
            },
            {
              key: 'dueOn',
              label: translate('dueOn'),
              numeric: true,
              align: 'center',
              render: (item) => formatDate(item.dueOn)
            }
          ]}
        />
        <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </div>
  )
}
