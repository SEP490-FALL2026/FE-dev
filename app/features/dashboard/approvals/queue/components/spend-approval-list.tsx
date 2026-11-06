import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSpendApprovalList } from '~/shared/api/generated/operations/spend-approvals/spend-approval-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import {
  ApprovalsPagination,
  ApprovalsSearch,
  ApprovalsStatus,
  ApprovalsToolbar
} from '../../shared/components/approvals-ui'
import { formatMoney } from '../../shared/approvals-money'
import { PrimaryWithDetail } from './primary-with-detail'

/** Requests waiting for the spend decision; the batch ID travels along so the detail can open the whole submission. */
export function SpendApprovalList({ onOpen }: { onOpen: (requestId: string, batchId: string | null) => void }) {
  const { t: translate, i18n } = useTranslation('approvalsSpend')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { formatDate } = useDashboardFormat()
  const query = useSpendApprovalList({ page, pageSize: 20 })
  const items = query.data?.data?.items ?? []
  const term = search.trim().toLocaleLowerCase(i18n.language)
  const filtered = term
    ? items.filter((item) =>
        [
          item.plan?.applicationName,
          item.plan?.planName,
          item.softwareName,
          item.requestId,
          item.requester.fullName,
          item.costCenter.code
        ].some((value) => value?.toLocaleLowerCase(i18n.language).includes(term))
      )
    : items
  return (
    <div className='space-y-3'>
      <ApprovalsToolbar>
        <ApprovalsSearch
          label={translate('pageSearch')}
          placeholder={translate('pagePlaceholder')}
          value={search}
          onChange={setSearch}
        />
      </ApprovalsToolbar>
      <p className='text-xs text-muted-foreground'>{translate('pageScope')}</p>
      <ApprovalsQueryState query={query}>
        <ApprovalsTable
          items={filtered}
          rowKey={(item) => item.stepId}
          onOpen={(item) => onOpen(item.requestId, item.batchId)}
          columns={[
            {
              key: 'software',
              label: translate('software'),
              render: (item) => (
                <PrimaryWithDetail
                  primary={item.plan?.applicationName ?? item.softwareName ?? item.requestId}
                  detail={item.plan?.planName}
                />
              )
            },
            {
              key: 'requester',
              label: translate('requester'),
              render: (item) => <PrimaryWithDetail primary={item.requester.fullName} detail={item.costCenter.code} />
            },
            {
              key: 'amount',
              label: translate('amount'),
              numeric: true,
              render: (item) => (item.amount ? formatMoney(item.amount, i18n.language) : translate('unavailable'))
            },
            { key: 'check', label: translate('check'), render: (item) => <ApprovalsStatus value={item.primaryCode} /> },
            { key: 'dueOn', label: translate('dueOn'), numeric: true, render: (item) => formatDate(item.dueOn) }
          ]}
        />
        <ApprovalsPagination
          pagination={query.data?.data?.pagination}
          onPageChange={(nextPage) => {
            setSearch('')
            setPage(nextPage)
          }}
        />
      </ApprovalsQueryState>
    </div>
  )
}
