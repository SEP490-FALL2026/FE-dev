import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCostCenterEmployeeList } from '~/shared/api/generated/operations/cost-centers'
import { FinanceEmpty, FinancePagination, FinanceQueryState, FinanceSection } from '../../shared/components/finance-ui'

/** The people whose software cost is charged to this Cost Center: the working staff of its department. */
export function CostCenterEmployees({ costCenterId }: { costCenterId: string }) {
  const { t: translate } = useTranslation('financeSettings')
  const [page, setPage] = useState(1)
  const query = useCostCenterEmployeeList(costCenterId, { page, pageSize: 20 })
  const items = query.data?.data?.items ?? []
  return (
    <FinanceSection title={translate('costCenterEmployees.title')}>
      <p className='text-sm text-muted-foreground'>{translate('costCenterEmployees.hint')}</p>
      <FinanceQueryState query={query}>
        {items.length === 0 ? (
          <FinanceEmpty message={translate('costCenterEmployees.empty')} />
        ) : (
          <ul className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
            {items.map((employee) => (
              <li
                key={employee.employeeCode}
                className='rounded-md border border-border/70 bg-surface px-3 py-2 text-sm wrap-break-word'
              >
                {employee.fullName}
              </li>
            ))}
          </ul>
        )}
        <FinancePagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinanceSection>
  )
}
