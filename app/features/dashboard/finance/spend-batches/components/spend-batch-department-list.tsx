import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCostCenterList } from '~/shared/api/generated/operations/cost-centers'
import {
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSearch,
  FinanceToolbar
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceSearch } from '../../shared/hooks/use-finance-search'

export interface SpendBatchDepartment {
  id: string
  code: string
  name: string
}

interface DepartmentRow extends SpendBatchDepartment {
  costCenterCode: string
}

// Finance không có quyền đọc /departments; phòng ban lấy từ trung tâm chi phí loại UNIT đã gắn phòng.
export function SpendBatchDepartmentList({ onOpen }: { onOpen: (department: SpendBatchDepartment) => void }) {
  const { t: translate } = useTranslation('financeSettings')
  const { t: translateFinance } = useTranslation('finance')
  const { search, setSearch, debouncedSearch } = useFinanceSearch()
  const [page, setPage] = useState(1)

  const query = useCostCenterList({ kind: 'UNIT', search: debouncedSearch || undefined, page, pageSize: 20 })
  const departments: DepartmentRow[] = (query.data?.data?.items ?? []).flatMap((costCenter) =>
    costCenter.department ? [{ ...costCenter.department, costCenterCode: costCenter.code }] : []
  )

  return (
    <FinancePage
      title={translateFinance('spendBatches')}
      description={translateFinance('spendBatchDepartmentsDescription')}
    >
      <FinanceToolbar>
        <FinanceSearch
          label={translateFinance('spendBatchSearchDepartments')}
          placeholder={translateFinance('spendBatchSearchDepartmentsPlaceholder')}
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
        />
      </FinanceToolbar>

      <FinanceQueryState query={query}>
        <FinanceTable<DepartmentRow>
          items={departments}
          rowKey={(department) => department.id}
          onOpen={({ id, code, name }) => onOpen({ id, code, name })}
          columns={[
            {
              key: 'name',
              label: translate('department'),
              render: (department) => (
                <span className='block truncate font-semibold text-foreground' title={department.name}>
                  {department.name}
                </span>
              )
            },
            {
              key: 'code',
              label: translate('code'),
              render: (department) => <span className='font-mono text-xs text-muted-foreground'>{department.code}</span>
            },
            {
              key: 'costCenter',
              label: translateFinance('spendBatchCostCenter'),
              render: (department) => (
                <span className='font-mono text-xs text-muted-foreground'>{department.costCenterCode}</span>
              )
            }
          ]}
        />
        <FinancePagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinancePage>
  )
}
