import { useFinanceSearch } from '../../shared/hooks/use-finance-search'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type CostCenterPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/cost-centers'
import { CostCenterListStatus } from '../enums/cost-center-status'

import { useCostCenterList } from '~/shared/api/generated/operations/cost-centers'
import {
  FinanceButton,
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSearch,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { CostCenterForm } from '../components/cost-center-form'
import { CostCenterDetail } from '../components/cost-center-detail'

export function FinanceCostCentersView() {
  const { t: translate } = useTranslation('financeSettings')
  const { search, setSearch, debouncedSearch } = useFinanceSearch()
  const [status, setStatus] = useState<CostCenterListStatus | ''>('')
  const [page, setPage] = useState(1)
  const [create, setCreate] = useState(false)
  const [selected, setSelected] = useState<CostCenterPageResponseDtoDataItemsItem | null>(null)
  const centers = useCostCenterList({
    search: debouncedSearch || undefined,
    status: status || undefined,
    page,
    pageSize: 20
  })
  return (
    <FinancePage
      title={translate('costCenters')}
      actions={
        <FinanceButton variant='primary' onClick={() => setCreate(true)}>
          {translate('create')}
        </FinanceButton>
      }
    >
      <div className='flex flex-wrap items-end gap-4'>
        <FinanceSearch
          label={translate('searchCenters')}
          placeholder={translate('searchCentersPlaceholder')}
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
        />
        <FinanceField label={translate('status')}>
          <select
            className={financeInputClass}
            value={status}
            onChange={(event) => {
              setStatus(Object.values(CostCenterListStatus).find((value) => value === event.target.value) ?? '')
              setPage(1)
            }}
          >
            <option value=''>{translate('all')}</option>
            {Object.values(CostCenterListStatus).map((value) => (
              <option key={value} value={value}>
                {translate(`enum.${value}`)}
              </option>
            ))}
          </select>
        </FinanceField>
      </div>
      <FinanceQueryState query={centers}>
        <FinanceTable
          items={centers.data?.data?.items ?? []}
          rowKey={(item) => item.id}
          onOpen={setSelected}
          columns={[
            { key: 'code', label: translate('code'), render: (item) => item.code },
            { key: 'name', label: translate('name'), render: (item) => item.name },
            { key: 'department', label: translate('department'), render: (item) => item.department?.name ?? '—' },
            { key: 'status', label: translate('status'), render: (item) => <FinanceStatus value={item.status} /> }
          ]}
        />
        <FinancePagination pagination={centers.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
      {create && <CostCenterForm onClose={() => setCreate(false)} />}
      {selected && (
        <CostCenterDetail
          item={centers.data?.data?.items.find((item) => item.id === selected.id) ?? selected}
          onClose={() => setSelected(null)}
        />
      )}
    </FinancePage>
  )
}
