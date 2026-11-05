import { useFinanceSearch } from '../../shared/hooks/use-finance-search'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type VendorPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/vendors'
import { VendorListTaxProfile } from '../enums/tax-profile-status'

import { useVendorList } from '~/shared/api/generated/operations/vendors'
import {
  FinanceField,
  FinanceDetailPage,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSearch,
  FinanceSelect,
  FinanceStatus,
  FinanceToolbar
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { VendorTaxDetail } from '../components/vendor-tax-detail'

export function FinanceVendorTaxView({ itemId }: { itemId?: string } = {}) {
  const { t: translate } = useTranslation('financeSettings')
  const { search, setSearch, debouncedSearch } = useFinanceSearch()
  const [taxProfile, setTaxProfile] = useState<VendorListTaxProfile | ''>('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Pick<VendorPageResponseDtoDataItemsItem, 'id' | 'name'> | null>(
    itemId ? { id: itemId, name: translate('vendorTax') } : null
  )
  const vendors = useVendorList({
    search: debouncedSearch || undefined,
    taxProfile: taxProfile || undefined,
    page,
    pageSize: 20
  })
  if (selected)
    return (
      <FinanceDetailPage>
        <VendorTaxDetail key={selected.id} id={selected.id} name={selected.name} onClose={() => setSelected(null)} />
      </FinanceDetailPage>
    )
  return (
    <FinancePage title={translate('vendorTax')} description={translate('vendorTaxDescription')}>
      <FinanceToolbar>
        <FinanceSearch
          label={translate('searchVendors')}
          placeholder={translate('searchVendorsPlaceholder')}
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
        />
        <div className='sm:w-52'>
          <FinanceField label={translate('taxProfile')}>
            <FinanceSelect
              value={taxProfile}
              onChange={(event) => {
                setTaxProfile(Object.values(VendorListTaxProfile).find((value) => value === event.target.value) ?? '')
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {Object.values(VendorListTaxProfile).map((value) => (
                <option key={value} value={value}>
                  {translate(`enum.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
      </FinanceToolbar>
      <FinanceQueryState query={vendors}>
        <FinanceTable
          items={vendors.data?.data?.items ?? []}
          rowKey={(item) => item.id}
          onOpen={setSelected}
          columns={[
            { key: 'name', label: translate('vendor'), render: (item) => item.name },
            {
              key: 'status',
              label: translate('taxProfile'),
              render: (item) => <FinanceStatus value={item.taxProfileStatus} />
            },
            {
              key: 'group',
              label: translate('taxGroup'),
              render: (item) => (item.taxGroup ? translate(`enum.${item.taxGroup}`) : '—')
            }
          ]}
        />
        <FinancePagination pagination={vendors.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinancePage>
  )
}
