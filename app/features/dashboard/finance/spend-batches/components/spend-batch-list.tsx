import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FinanceButton,
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceToolbar,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import type { SpendBatchListItem } from '../../shared/finance-api-extensions'
import { useSpendBatchList } from '../hooks/use-spend-batches'
import type { SpendBatchDepartment } from './spend-batch-department-list'

export function SpendBatchList({
  department,
  onBack,
  onOpen
}: {
  department: SpendBatchDepartment
  onBack: () => void
  onOpen: (batchId: string) => void
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const { t: translateFinance } = useTranslation('finance')

  const [page, setPage] = useState(1)
  const [submittedFrom, setSubmittedFrom] = useState('')
  const [submittedTo, setSubmittedTo] = useState('')

  const query = useSpendBatchList({
    page,
    pageSize: 20,
    departmentId: department.id,
    submittedFrom: submittedFrom ? `${submittedFrom}T00:00:00+07:00` : undefined,
    submittedTo: submittedTo ? `${submittedTo}T23:59:59+07:00` : undefined
  })

  const renderApprovedAmounts = (amounts: Record<string, string>) => {
    const entries = Object.entries(amounts)
    if (entries.length === 0) return <span className='text-muted-foreground'>—</span>
    return (
      <div className='flex flex-col items-end gap-0.5'>
        {entries.map(([currency, amount]) => (
          <span key={currency} className='font-mono font-semibold text-foreground'>
            {formatMoney({ amount, currency }, i18n.language)}
          </span>
        ))}
      </div>
    )
  }

  return (
    <FinancePage
      title={`${translateFinance('spendBatches')} · ${department.name}`}
      description={translateFinance('spendBatchesDescription')}
      actions={
        <FinanceButton variant='ghost' onClick={onBack}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translateFinance('spendBatchBackToDepartments')}
        </FinanceButton>
      }
    >
      <FinanceToolbar>
        <div className='sm:w-44'>
          <FinanceField label={translate('from')}>
            <input
              type='date'
              className={financeInputClass}
              value={submittedFrom}
              onChange={(event) => {
                setSubmittedFrom(event.target.value)
                setPage(1)
              }}
            />
          </FinanceField>
        </div>
        <div className='sm:w-44'>
          <FinanceField label={translate('to')}>
            <input
              type='date'
              className={financeInputClass}
              value={submittedTo}
              onChange={(event) => {
                setSubmittedTo(event.target.value)
                setPage(1)
              }}
            />
          </FinanceField>
        </div>
      </FinanceToolbar>

      <FinanceQueryState query={query}>
        <FinanceTable<SpendBatchListItem>
          items={query.data?.items ?? []}
          rowKey={(batch) => batch.id}
          onOpen={(batch) => onOpen(batch.id)}
          columns={[
            {
              key: 'submittedBy',
              label: translateFinance('submittedBy'),
              render: (batch) => (
                <div className='text-xs'>
                  <div className='font-medium text-foreground'>{batch.submittedBy.fullName}</div>
                  <div className='font-mono text-muted-foreground'>{batch.submittedBy.employeeCode}</div>
                </div>
              )
            },
            {
              key: 'submittedAt',
              label: translateFinance('submittedAt'),
              numeric: true,
              render: (batch) => (
                <span className='text-xs text-muted-foreground'>
                  {new Date(batch.submittedAt).toLocaleString(i18n.language)}
                </span>
              )
            },
            {
              key: 'itemCount',
              label: translateFinance('itemCount'),
              numeric: true,
              render: (batch) => <span className='font-mono font-medium'>{batch.itemCount}</span>
            },
            {
              key: 'approvedCount',
              label: translateFinance('approvedCount'),
              numeric: true,
              render: (batch) => <span className='font-mono font-semibold text-success-ink'>{batch.approvedCount}</span>
            },
            {
              key: 'pendingCount',
              label: translateFinance('pendingCount'),
              numeric: true,
              render: (batch) => <span className='font-mono text-warning-ink'>{batch.pendingCount}</span>
            },
            {
              key: 'approvedAmounts',
              label: translateFinance('approvedAmounts'),
              numeric: true,
              render: (batch) => renderApprovedAmounts(batch.approvedAmounts)
            }
          ]}
        />
        <FinancePagination pagination={query.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinancePage>
  )
}
