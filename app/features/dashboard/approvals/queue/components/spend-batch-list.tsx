import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSpendBatchList } from '~/shared/api/generated/operations/spend-submission/spend-batch-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { dayEnd, dayStart, useDepartmentOptions } from '../../monitor/views/approval-monitor-filters'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsSelect } from '../../shared/components/approvals-select'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { ApprovalsField, ApprovalsPagination, approvalsInputClass } from '../../shared/components/approvals-ui'

const PAGE_SIZE = 20

const toneClass = {
  waiting: 'bg-warning/15 text-warning-ink ring-warning/30',
  done: 'bg-success/10 text-success-ink ring-success/25'
}

/**
 * Every batch the heads sent on, newest first. A batch still holding requests without a spend decision reads as
 * waiting; opening one shows the whole batch, where the decision on it is made.
 */
export function SpendBatchList({ onOpen }: { onOpen: (batchId: string) => void }) {
  const { t: translate } = useTranslation('approvalsSpend')
  const { formatDate } = useDashboardFormat()
  const departments = useDepartmentOptions()
  const [page, setPage] = useState(1)
  const [departmentId, setDepartmentId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const query = useSpendBatchList({
    page,
    pageSize: PAGE_SIZE,
    departmentId: departmentId || undefined,
    submittedFrom: dayStart(from),
    submittedTo: dayEnd(to)
  })
  const items = query.data?.data?.items ?? []
  const filter = (apply: () => void) => {
    apply()
    setPage(1)
  }

  return (
    <div className='space-y-4'>
      <div className='soft-panel grid items-start gap-4 p-3 sm:grid-cols-3 sm:p-4'>
        <ApprovalsSelect
          label={translate('monitor.department')}
          value={departmentId}
          options={[{ value: '', label: translate('monitor.allDepartments') }, ...departments]}
          onChange={(value) => filter(() => setDepartmentId(value))}
        />
        <ApprovalsField label={translate('batches.from')}>
          <input
            type='date'
            className={approvalsInputClass}
            value={from}
            max={to || undefined}
            onChange={(event) => filter(() => setFrom(event.target.value))}
          />
        </ApprovalsField>
        <ApprovalsField label={translate('batches.to')}>
          <input
            type='date'
            className={approvalsInputClass}
            value={to}
            min={from || undefined}
            onChange={(event) => filter(() => setTo(event.target.value))}
          />
        </ApprovalsField>
      </div>
      <ApprovalsQueryState query={query}>
        <ApprovalsTable
          items={items}
          rowKey={(item) => item.id}
          onOpen={(item) => onOpen(item.id)}
          columns={[
            { key: 'department', label: translate('batchDepartment'), render: (item) => item.department.name },
            { key: 'sender', label: translate('batchSender'), render: (item) => item.submittedBy.fullName },
            {
              key: 'submittedAt',
              label: translate('batchSubmittedAt'),
              numeric: true,
              align: 'center',
              render: (item) => formatDate(item.submittedAt)
            },
            {
              key: 'count',
              label: translate('batches.count'),
              numeric: true,
              align: 'center',
              render: (item) => item.itemCount
            },
            {
              key: 'state',
              label: translate('batches.state'),
              render: (item) => {
                const waiting = item.pendingCount > 0
                return (
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${toneClass[waiting ? 'waiting' : 'done']}`}
                  >
                    {waiting
                      ? translate('batches.waiting', { count: item.pendingCount })
                      : translate('batches.done', { count: item.approvedCount })}
                  </span>
                )
              }
            }
          ]}
        />
        <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </div>
  )
}
