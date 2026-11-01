import { useTranslation } from 'react-i18next'
import { useRequestablePlanList } from '~/shared/api/generated/operations/requestable-software/requestable-plan-list'
import type { RequestablePlanPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/requestable-software/requestablePlanPageResponseDtoDataItemsItem'
import { EmployeeChoiceSelect } from '../../shared/components/employee-choice-select'
import { EmployeePagination, EmployeeQueryState } from '../../shared/components/employee-api-ui'
import { useCatalogSearch } from '../hooks/use-catalog-search'
import { CATALOG_PRICE_STATUS } from '../enums/catalog-price-status'

export type CatalogPlan = RequestablePlanPageResponseDtoDataItemsItem

export function EmployeeCatalogPlans({
  applicationId,
  value,
  onChange,
  disabled,
  invalid
}: {
  applicationId: string
  value: CatalogPlan | null
  onChange: (plan: CatalogPlan | null) => void
  disabled: boolean
  invalid?: boolean
}) {
  const { t: translate } = useTranslation('employee')
  const search = useCatalogSearch()
  const query = useRequestablePlanList(
    { applicationId, page: search.page, pageSize: 20, ...(search.search ? { search: search.search } : {}) },
    { query: { enabled: search.open && !disabled && !!applicationId } }
  )
  const items = search.current && !query.isError ? (query.data?.data?.items ?? []) : []
  const label = (plan: CatalogPlan) =>
    Object.values(CATALOG_PRICE_STATUS).includes(plan.price.status)
      ? translate(`catalog.prices.${plan.price.status}`)
      : translate('unknownStatus')
  return (
    <div className='space-y-2'>
      <EmployeeChoiceSelect
        label={translate('plan')}
        placeholder={translate('groupPicker.choosePlan')}
        selected={value ? [{ value: value.id, label: value.name, description: label(value) }] : []}
        onChange={(choices) => onChange(items.find((plan) => plan.id === choices[0]?.value) ?? null)}
        options={items.map((plan) => ({ value: plan.id, label: plan.name, description: label(plan) }))}
        onOpenChange={search.setOpen}
        disabled={disabled || !applicationId}
        invalid={invalid}
        hint={translate('catalog.planHint')}
        search={{
          label: translate('groupPicker.searchPlans'),
          placeholder: translate('groupPicker.searchPlansPlaceholder'),
          value: search.draft,
          onChange: search.setDraft
        }}
        state={
          search.current ? (
            <EmployeeQueryState query={query} empty={!items.length} emptyTitle={translate('catalog.noPlans')} />
          ) : (
            <p role='status' className='py-4 text-sm text-muted-foreground'>
              {translate('loading')}
            </p>
          )
        }
        footer={
          search.current &&
          !query.isError && (
            <EmployeePagination
              pagination={query.data?.data?.pagination}
              onPage={search.setPage}
              busy={query.isFetching}
            />
          )
        }
      />
      {value && !value.canSubmit && (
        <p className='text-sm leading-relaxed text-warning-ink'>{translate('catalog.draftOnly')}</p>
      )}
      <input type='hidden' name='planId' value={value?.id ?? ''} />
    </div>
  )
}
