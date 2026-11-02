import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type CostCenterPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/cost-centers'
import { CostCenterListStatus } from '../enums/cost-center-status'

import {
  useCostCenterEmployeeList,
  useCostCenterDeactivate,
  getCostCenterListQueryKey,
  getCostCenterEmployeeListQueryKey
} from '~/shared/api/generated/operations/cost-centers'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import {
  FinanceButton,
  FinanceDrawer,
  FinancePagination,
  FinanceQueryState,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { useFinanceRetry } from '../../shared/hooks/use-finance-retry'
import { CostCenterForm } from './cost-center-form'

export function CostCenterDetail({
  item,
  onClose
}: {
  item: CostCenterPageResponseDtoDataItemsItem
  onClose: () => void
}) {
  const { t: translate } = useTranslation('financeSettings')
  const [page, setPage] = useState(1)
  const [action, setAction] = useState<'rename' | 'deactivate' | null>(null)
  const employees = useCostCenterEmployeeList(item.id, { page, pageSize: 10 })
  const feedback = useFinanceFeedback(
    [getCostCenterListQueryKey(), getCostCenterEmployeeListQueryKey(item.id)],
    onClose
  )
  const deactivate = useCostCenterDeactivate({ mutation: feedback })
  const retrySeconds = useFinanceRetry()
  const active = item.status === CostCenterListStatus.ACTIVE
  return (
    <>
      {!action && (
        <FinanceDrawer title={`${item.code} · ${item.name}`} onClose={onClose} pending={deactivate.isPending}>
          <div className='flex flex-wrap items-center gap-3'>
            <FinanceStatus value={item.status} />
            <FinanceButton disabled={!active} onClick={() => setAction('rename')}>
              {translate('rename')}
            </FinanceButton>
            <FinanceButton disabled={!active} onClick={() => setAction('deactivate')}>
              {translate('deactivate')}
            </FinanceButton>
          </div>
          <p className='text-sm'>{item.department?.name}</p>
          <h3 className='font-semibold'>{translate('employees')}</h3>
          <FinanceQueryState query={employees}>
            <FinanceTable
              items={employees.data?.data?.items ?? []}
              rowKey={(employee) => employee.employeeCode}
              columns={[
                { key: 'code', label: translate('code'), render: (employee) => employee.employeeCode },
                { key: 'name', label: translate('name'), render: (employee) => employee.fullName },
                {
                  key: 'status',
                  label: translate('status'),
                  render: (employee) => <FinanceStatus value={employee.status} />
                }
              ]}
            />
            <FinancePagination pagination={employees.data?.data?.pagination} onPageChange={setPage} />
          </FinanceQueryState>
        </FinanceDrawer>
      )}
      {action === 'rename' && (
        <CostCenterForm
          item={item}
          onClose={() => {
            setAction(null)
            onClose()
          }}
        />
      )}
      {action === 'deactivate' && (
        <FinanceFormDialog
          title={translate('deactivate')}
          pending={deactivate.isPending}
          submitDisabled={!active || retrySeconds > 0}
          onClose={() => setAction(null)}
          submitLabel={translate('deactivate')}
          danger
          onSubmit={(event) => {
            event.preventDefault()
            if (active && !deactivate.isPending && retrySeconds === 0) deactivate.mutate({ id: item.id })
          }}
        >
          <p>{translate('confirmDeactivate')}</p>
        </FinanceFormDialog>
      )}
    </>
  )
}
