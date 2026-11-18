import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getRequestablePlanListQueryOptions } from '~/shared/api/generated/operations/requestable-software/requestable-plan-list'
import type { RequestablePlanPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/requestable-software/requestablePlanPageResponseDtoDataItemsItem'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
import { EmployeeField, EmployeeQueryState } from '../../shared/components/employee-api-ui'
import { EmployeeSelect } from '../../shared/components/employee-select'
import { CATALOG_PRICE_STATUS } from '../enums/catalog-price-status'
import { usePagedOptions } from '../hooks/use-paged-options'

export type CatalogPlan = RequestablePlanPageResponseDtoDataItemsItem

export function EmployeeCatalogPlans({
  applicationId,
  value,
  onChange,
  disabled,
  invalid,
  allowDraft = true
}: {
  applicationId: string
  value: CatalogPlan | null
  onChange: (plan: CatalogPlan | null) => void
  disabled: boolean
  invalid?: boolean
  allowDraft?: boolean
}) {
  const { t: translate } = useTranslation('employee')
  const [draft, setDraft] = useState('')
  const search = useDebouncedValue(draft, 300)
  const plans = usePagedOptions(`${applicationId}:${search}`, (page) =>
    getRequestablePlanListQueryOptions(
      { applicationId, page, pageSize: 20, ...(search ? { search } : {}) },
      { query: { enabled: !disabled && !!applicationId } }
    )
  )
  const priceLabel = (plan: CatalogPlan) =>
    Object.values(CATALOG_PRICE_STATUS).includes(plan.price.status)
      ? translate(`catalog.prices.${plan.price.status}`)
      : translate('unknownStatus')
  return (
    <div className='min-w-0 space-y-2'>
      <EmployeeField label={translate('plan')}>
        <EmployeeSelect
          required
          value={value?.id ?? ''}
          selectedLabel={value?.name}
          placeholder={translate(applicationId ? 'ui.placeholders.plan' : 'ui.placeholders.planFirst')}
          disabled={disabled || !applicationId}
          invalid={invalid}
          loading={plans.loading}
          onSearchChange={setDraft}
          hasMore={plans.hasMore}
          onLoadMore={plans.loadMore}
          emptyText={translate('catalog.noPlans')}
          options={plans.items.map((plan) => ({ value: plan.id, label: plan.name, description: priceLabel(plan) }))}
          onChange={(planId) => onChange(plans.items.find((plan) => plan.id === planId) ?? null)}
        />
      </EmployeeField>
      <p className='text-xs leading-relaxed text-muted-foreground'>{translate('catalog.planHint')}</p>
      {plans.query?.isError && <EmployeeQueryState query={plans.query} />}
      {value && !value.canSubmit && (
        <p className='text-sm leading-relaxed text-warning-ink'>
          {translate(allowDraft ? 'catalog.draftOnly' : 'requestExtras.serviceAccount.blocked')}
        </p>
      )}
      <input type='hidden' name='planId' value={value?.id ?? ''} />
    </div>
  )
}
