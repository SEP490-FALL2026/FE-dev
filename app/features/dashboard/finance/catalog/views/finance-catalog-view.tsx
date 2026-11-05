import { useFinanceSearch } from '../../shared/hooks/use-finance-search'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type ApplicationPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/applications'
import { ApplicationListKind } from '../enums/application-kind'
import { ApplicationListStatus } from '../enums/application-status'

import { useApplicationList } from '~/shared/api/generated/operations/applications'
import {
  FinanceDetailPage,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSearch,
  FinanceStatus,
  FinanceToolbar
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { FinanceCatalogDetail } from '../components/finance-catalog-detail'
import { CatalogEnumFilter } from '../components/catalog-enum-filter'

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
  if (selected)
    return (
      <FinanceDetailPage>
        <FinanceCatalogDetail key={selected.id} application={selected} onClose={() => setSelected(null)} />
      </FinanceDetailPage>
    )
  return (
    <FinancePage title={translate('catalog')} description={translate('catalogDescription')}>
      <FinanceToolbar>
        <FinanceSearch
          label={translate('searchApplications')}
          placeholder={translate('searchApplicationsPlaceholder')}
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
        />
        <CatalogEnumFilter
          label={translate('kind')}
          options={ApplicationListKind}
          value={kind}
          onChange={(value) => {
            setKind(value)
            setPage(1)
          }}
        />
        <CatalogEnumFilter
          label={translate('status')}
          options={ApplicationListStatus}
          value={status}
          onChange={(value) => {
            setStatus(value)
            setPage(1)
          }}
        />
      </FinanceToolbar>
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
    </FinancePage>
  )
}
