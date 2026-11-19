import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSelect,
  FinanceToolbar,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import type { SpendBatchListItem } from '../../shared/finance-api-extensions'
import { useFinanceDepartments } from '../../shared/hooks/use-finance-departments'
import { useSpendBatchList } from '../hooks/use-spend-batches'

export function SpendBatchList({ onOpen }: { onOpen: (batchId: string, departmentName: string) => void }) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const { t: translateFinance } = useTranslation('finance')

  const [page, setPage] = useState(1)
  const [departmentId, setDepartmentId] = useState('')
  const { departments } = useFinanceDepartments()
  const [submittedFrom, setSubmittedFrom] = useState('')
  const [submittedTo, setSubmittedTo] = useState('')

  const rangeInvalid = Boolean(submittedFrom && submittedTo && submittedFrom > submittedTo)
  const query = useSpendBatchList(
    {
      page,
      pageSize: 20,
      departmentId: departmentId || undefined,
      submittedFrom: submittedFrom ? `${submittedFrom}T00:00:00+07:00` : undefined,
      submittedTo: submittedTo ? `${submittedTo}T23:59:59+07:00` : undefined
    },
    { enabled: !rangeInvalid }
  )

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
    <FinancePage title={translateFinance('spendBatches')} description={translateFinance('spendBatchesDescription')}>
      <FinanceToolbar>
        <div className='sm:w-56'>
          <FinanceField label={translate('department')}>
            <FinanceSelect
              value={departmentId}
              onChange={(event) => {
                setDepartmentId(event.target.value)
                setPage(1)
              }}
            >
              <option value=''>{translateFinance('spendBatchAllDepartments')}</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
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
          <FinanceField
            label={translate('to')}
            floatingError
            error={rangeInvalid ? translate('dateRangeInvalid') : null}
          >
            <input
              type='date'
              aria-invalid={rangeInvalid}
              min={submittedFrom || undefined}
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

      {!rangeInvalid && (
        <FinanceQueryState query={query}>
          <FinanceTable<SpendBatchListItem>
            items={query.data?.items ?? []}
            rowKey={(batch) => batch.id}
            onOpen={(batch) => onOpen(batch.id, batch.department.name)}
            columns={[
              {
                key: 'department',
                label: translate('department'),
                render: (batch) => <span className='font-medium text-foreground'>{batch.department.name}</span>
              },
              {
                key: 'submittedBy',
                label: translateFinance('submittedBy'),
                render: (batch) => <span className='font-medium text-foreground'>{batch.submittedBy.fullName}</span>
              },
              {
                key: 'submittedAt',
                label: translateFinance('submittedAt'),
                numeric: true,
                align: 'center',
                render: (batch) => (
                  <span className='text-xs text-muted-foreground'>
                    {new Date(batch.submittedAt).toLocaleDateString(i18n.language)}
                  </span>
                )
              },
              {
                key: 'approvedCount',
                label: translateFinance('approvedCount'),
                numeric: true,
                align: 'center',
                render: (batch) => (
                  <span className='font-mono'>
                    <span className='font-semibold text-success-ink'>{batch.approvedCount}</span>
                    <span className='text-muted-foreground'> / {batch.itemCount}</span>
                  </span>
                )
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
      )}
    </FinancePage>
  )
}
