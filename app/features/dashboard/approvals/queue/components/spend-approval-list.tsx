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
import { BUDGET_CHECK_OUTCOME } from '../enums/budget-check-outcome'
import { SPEND_ROUTING_MODE } from '../enums/spend-routing-mode'
import { PrimaryWithDetail } from './primary-with-detail'

const flagTones = {
  neutral: 'bg-surface-subtle text-muted-foreground ring-border/70',
  warning: 'bg-warning/10 text-warning-ink ring-warning/30',
  danger: 'bg-danger/10 text-danger ring-danger/30'
}

function Flag({ tone, children }: { tone: keyof typeof flagTones; children: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${flagTones[tone]}`}
    >
      {children}
    </span>
  )
}

/** Requests waiting for the spend decision; the batch ID travels along so the detail can open the whole submission. */
export function SpendApprovalList({ onOpen }: { onOpen: (requestId: string, batchId: string | null) => void }) {
  const { t: translate, i18n } = useTranslation('approvalsSpend')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { formatDate } = useDashboardFormat()
  const query = useSpendApprovalList({ page, pageSize: 20 })
  const today = new Date().toISOString().slice(0, 10)
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
                <div className='space-y-1'>
                  <PrimaryWithDetail
                    primary={item.plan?.applicationName ?? item.softwareName ?? item.requestId}
                    detail={item.plan?.planName}
                  />
                  <div className='flex flex-wrap gap-1'>
                    {item.routing.mode === SPEND_ROUTING_MODE.ONE_STEP && (
                      <Flag tone='neutral'>{translate('routingOneStep')}</Flag>
                    )}
                    {item.lineCount > 1 && (
                      <Flag tone='neutral'>{translate('peopleCount', { count: item.lineCount })}</Flag>
                    )}
                  </div>
                </div>
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
            {
              key: 'check',
              label: translate('check'),
              render: (item) => (
                <div className='flex flex-wrap items-center gap-1'>
                  <ApprovalsStatus value={item.primaryCode} />
                  {item.outcome === BUDGET_CHECK_OUTCOME.USES_RESERVE && (
                    <Flag tone='warning'>{translate('reserveFlag')}</Flag>
                  )}
                  {item.nextYearBudget?.warning && <Flag tone='warning'>{translate('nextYearFlag')}</Flag>}
                </div>
              )
            },
            {
              key: 'dueOn',
              label: translate('dueOn'),
              numeric: true,
              align: 'center',
              render: (item) => (
                <div className='space-y-1'>
                  <div>{formatDate(item.dueOn)}</div>
                  {item.dueOn < today && <Flag tone='danger'>{translate('overdue')}</Flag>}
                </div>
              )
            }
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
