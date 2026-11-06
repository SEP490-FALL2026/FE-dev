import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNeedDecisionList } from '~/shared/api/generated/operations/need-decisions/need-decision-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { ApprovalsPagination, ApprovalsSection } from '../../shared/components/approvals-ui'
import { formatMoney } from '../../shared/approvals-money'

/** Need steps assigned to the Spending Approver when a department head asks for themself. */
export function NeedDecisionQueue({ onOpen }: { onOpen: (requestId: string) => void }) {
  const { t: translate, i18n } = useTranslation('approvalsNeed')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useNeedDecisionList({ page, pageSize: 20 })
  return (
    <ApprovalsSection title={translate('assignedNeeds')}>
      <ApprovalsQueryState query={query}>
        <ApprovalsTable
          items={query.data?.data?.items ?? []}
          rowKey={(item) => item.stepId}
          onOpen={(item) => onOpen(item.requestId)}
          columns={[
            {
              key: 'software',
              label: translate('software'),
              render: (item) => item.plan?.applicationName ?? item.softwareName ?? translate('unknown')
            },
            { key: 'requester', label: translate('requester'), render: (item) => item.requester.fullName },
            { key: 'department', label: translate('department'), render: (item) => item.department.name },
            {
              key: 'type',
              label: translate('type'),
              render: (item) => translate(`requestType.${item.type}`, { defaultValue: translate('unknown') })
            },
            {
              key: 'cost',
              label: translate('cost'),
              numeric: true,
              render: (item) =>
                item.pricing.amount ? formatMoney(item.pricing.amount, i18n.language) : translate('unknown')
            },
            { key: 'dueOn', label: translate('dueOn'), numeric: true, render: (item) => formatDate(item.dueOn) }
          ]}
        />
        <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </ApprovalsSection>
  )
}
