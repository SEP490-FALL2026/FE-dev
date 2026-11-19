import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequestablePlanList } from '~/shared/api/generated/operations/requestable-software/requestable-plan-list'
import type { RequestablePlanPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/requestable-software/requestablePlanPageResponseDtoDataItemsItem'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
import { ManagerField } from './manager-api-ui'
import { ManagerSelect } from './manager-select'
import { CATALOG_PRICE_STATUS } from '../enums/catalog-price-status'

export type CatalogPlan = RequestablePlanPageResponseDtoDataItemsItem

const PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

/** Plans of the chosen requestable application: server search by plan name, "load more" grows the page. */
export function ManagerCatalogPlans({
  applicationId,
  value,
  onChange,
  disabled,
  invalid,
  guidanceOnly = false
}: {
  applicationId: string
  value: CatalogPlan | null
  onChange: (plan: CatalogPlan | null) => void
  disabled: boolean
  invalid?: boolean
  guidanceOnly?: boolean
}) {
  const { t: translate } = useTranslation('employee')
  const { t: manager } = useTranslation('manager')
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const debounced = useDebouncedValue(search, 300)
  const query = useRequestablePlanList(
    { applicationId, page: 1, pageSize, ...(debounced ? { search: debounced } : {}) },
    { query: { enabled: !disabled && !!applicationId } }
  )
  const items = !query.isError ? (query.data?.data?.items ?? []) : []
  const pagination = !query.isError ? query.data?.data?.pagination : undefined
  const priceLabel = (plan: CatalogPlan) =>
    Object.values(CATALOG_PRICE_STATUS).includes(plan.price.status)
      ? translate(`catalog.prices.${plan.price.status}`)
      : translate('unknownStatus')
  return (
    <div className='min-w-0 space-y-2'>
      <ManagerField label={translate('plan')}>
        <ManagerSelect
          value={value?.id ?? ''}
          selectedLabel={value?.name}
          disabled={disabled || !applicationId}
          invalid={invalid}
          clearable={guidanceOnly}
          placeholder={manager(applicationId ? 'ui.placeholders.plan' : 'ui.placeholders.planFirst')}
          loading={query.isFetching}
          emptyText={query.isError ? manager('ui.loadFailed') : translate('catalog.noPlans')}
          onSearchChange={(next) => {
            setSearch(next)
            setPageSize(PAGE_SIZE)
          }}
          hasMore={!!pagination && pagination.totalPages > 1 && pageSize < MAX_PAGE_SIZE}
          onLoadMore={() => setPageSize((size) => Math.min(size + PAGE_SIZE, MAX_PAGE_SIZE))}
          options={items.map((plan) => ({ value: plan.id, label: plan.name, description: priceLabel(plan) }))}
          onChange={(next) => onChange(items.find((plan) => plan.id === next) ?? null)}
        />
      </ManagerField>
      <p className='-mt-3 text-xs leading-relaxed text-muted-foreground'>{translate('catalog.planHint')}</p>
      {!guidanceOnly && value && !value.canSubmit && (
        <p className='text-sm leading-relaxed text-warning-ink'>{translate('catalog.draftOnly')}</p>
      )}
      <input type='hidden' name='planId' value={value?.id ?? ''} />
    </div>
  )
}
