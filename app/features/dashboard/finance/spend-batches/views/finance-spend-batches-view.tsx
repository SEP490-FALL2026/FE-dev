import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentList } from '~/shared/api/generated/operations/departments'
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
import { useSpendBatchList } from '../hooks/use-spend-batches'
import { SpendBatchDetail } from '../components/spend-batch-detail'
import type { SpendBatchListItem } from '../../shared/finance-api-extensions'

export function FinanceSpendBatchesView() {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const { t: translateFinance } = useTranslation('finance')

  const [page, setPage] = useState(1)
  const [departmentId, setDepartmentId] = useState<string>('')
  const [submittedFrom, setSubmittedFrom] = useState<string>('')
  const [submittedTo, setSubmittedTo] = useState<string>('')
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)

  const departments = useDepartmentList({ pageSize: 100 })

  const fromIso = submittedFrom ? `${submittedFrom}T00:00:00+07:00` : undefined
  const toIso = submittedTo ? `${submittedTo}T23:59:59+07:00` : undefined

  const query = useSpendBatchList({
    page,
    pageSize: 20,
    departmentId: departmentId || undefined,
    submittedFrom: fromIso,
    submittedTo: toIso
  })

  const batches = query.data?.items ?? []
  const pagination = query.data?.pagination

  const renderApprovedAmounts = (amounts: Record<string, string>) => {
    const entries = Object.entries(amounts)
    if (entries.length === 0) return <span className='text-muted-foreground'>—</span>
    return (
      <div className='flex flex-col items-end gap-0.5'>
        {entries.map(([curr, amt]) => (
          <span key={curr} className='font-mono font-semibold text-foreground'>
            {formatMoney({ amount: amt, currency: curr }, i18n.language)}
          </span>
        ))}
      </div>
    )
  }

  if (selectedBatchId) {
    return (
      <SpendBatchDetail
        batchId={selectedBatchId}
        onClose={() => setSelectedBatchId(null)}
      />
    )
  }

  return (
    <FinancePage
      title={translateFinance('spendBatches')}
      description={translateFinance('spendBatchesDescription', {
        defaultValue: 'Báo cáo số tiền cần thanh toán theo từng đợt yêu cầu cấp phát tài khoản từ các phòng ban.'
      })}
    >
      <FinanceToolbar>
        <div className='sm:w-64'>
          <FinanceField label={translate('department')}>
            <FinanceSelect
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value)
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {departments.data?.data?.items.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
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
              onChange={(e) => {
                setSubmittedFrom(e.target.value)
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
              onChange={(e) => {
                setSubmittedTo(e.target.value)
                setPage(1)
              }}
            />
          </FinanceField>
        </div>
      </FinanceToolbar>

      <FinanceQueryState query={query}>
        <FinanceTable<SpendBatchListItem>
          items={batches}
          rowKey={(item) => item.id}
          onOpen={(item) => setSelectedBatchId(item.id)}
          columns={[
            {
              key: 'department',
              label: translate('department'),
              render: (item) => (
                <div className='min-w-0'>
                  <span className='font-semibold text-foreground' title={item.department.name}>
                    {item.department.name}
                  </span>
                </div>
              )
            },
            {
              key: 'submittedBy',
              label: translateFinance('submittedBy'),
              render: (item) => (
                <div className='text-xs'>
                  <div className='font-medium text-foreground'>{item.submittedBy.fullName}</div>
                  <div className='font-mono text-muted-foreground'>{item.submittedBy.employeeCode}</div>
                </div>
              )
            },
            {
              key: 'submittedAt',
              label: translateFinance('submittedAt'),
              render: (item) => (
                <span className='text-xs text-muted-foreground'>
                  {new Date(item.submittedAt).toLocaleString(i18n.language)}
                </span>
              )
            },
            {
              key: 'itemCount',
              label: translateFinance('itemCount'),
              numeric: true,
              render: (item) => <span className='font-mono font-medium'>{item.itemCount}</span>
            },
            {
              key: 'approvedCount',
              label: translateFinance('approvedCount'),
              numeric: true,
              render: (item) => (
                <span className='font-mono font-semibold text-success-ink'>{item.approvedCount}</span>
              )
            },
            {
              key: 'pendingCount',
              label: translateFinance('pendingCount'),
              numeric: true,
              render: (item) => (
                <span className='font-mono text-warning-ink'>{item.pendingCount}</span>
              )
            },
            {
              key: 'approvedAmounts',
              label: translateFinance('approvedAmounts'),
              numeric: true,
              render: (item) => renderApprovedAmounts(item.approvedAmounts)
            }
          ]}
        />
        <FinancePagination pagination={pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinancePage>
  )
}

