import { useFinanceSearch } from '../../shared/hooks/use-finance-search'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type ApplicationPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/applications'
import { ApplicationListKind } from '../enums/application-kind'
import { ApplicationListStatus } from '../enums/application-status'

import { useApplicationList } from '~/shared/api/generated/operations/applications'
import {
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSearch,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { FinanceCatalogDetail } from '../components/finance-catalog-detail'

export function FinanceCatalogView() {
  const { t: translate } = useTranslation('financeSettings')
  const { search, setSearch, debouncedSearch } = useFinanceSearch()
  const [kind, setKind] = useState<ApplicationListKind | ''>('')
  const [status, setStatus] = useState<ApplicationListStatus | ''>('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<ApplicationPageResponseDtoDataItemsItem | null>(null)
  const applications = useApplicationList({
    search: debouncedSearch || undefined,
    kind: kind || undefined,
    status: status || undefined,
    page,
    pageSize: 20
  })
  return (
    <FinancePage title={translate('catalog')}>
      <div className='flex flex-wrap items-end gap-4'>
        <FinanceSearch
          label={translate('searchApplications')}
          placeholder={translate('searchApplicationsPlaceholder')}
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
        />
        <FinanceField label={translate('kind')}>
          <select
            className={financeInputClass}
            value={kind}
            onChange={(event) => {
              setKind(Object.values(ApplicationListKind).find((value) => value === event.target.value) ?? '')
              setPage(1)
            }}
          >
            <option value=''>{translate('all')}</option>
            {Object.values(ApplicationListKind).map((value) => (
              <option key={value} value={value}>
                {translate(`enum.${value}`)}
              </option>
            ))}
          </select>
        </FinanceField>
        <FinanceField label={translate('status')}>
          <select
            className={financeInputClass}
            value={status}
            onChange={(event) => {
              setStatus(Object.values(ApplicationListStatus).find((value) => value === event.target.value) ?? '')
              setPage(1)
            }}
          >
            <option value=''>{translate('all')}</option>
            {Object.values(ApplicationListStatus).map((value) => (
              <option key={value} value={value}>
                {translate(`enum.${value}`)}
              </option>
            ))}
          </select>
        </FinanceField>
      </div>
      <FinanceQueryState query={applications}>
        <FinanceTable
          items={applications.data?.data?.items ?? []}
          rowKey={(item) => item.id}
          onOpen={setSelected}
          columns={[
            { key: 'name', label: translate('application'), render: (item) => item.name },
            {
              key: 'kind',
              label: translate('kind'),
              render: (item) => translate(`enum.${item.kind}`, { defaultValue: translate('unavailable') })
            },
            { key: 'vendor', label: translate('vendor'), render: (item) => item.vendor?.name ?? '—' },
            { key: 'status', label: translate('status'), render: (item) => <FinanceStatus value={item.status} /> }
          ]}
        />
        <FinancePagination pagination={applications.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
      {selected && <FinanceCatalogDetail key={selected.id} application={selected} onClose={() => setSelected(null)} />}
    </FinancePage>
  )
}
