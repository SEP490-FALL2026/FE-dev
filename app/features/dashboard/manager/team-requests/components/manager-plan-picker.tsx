import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { ManagerChoiceSelect, type ManagerChoice } from '../../shared/components/manager-choice-select'
import { isResourceId } from '../../shared/manager-identifiers'

/** Catalog browsing needs API-GAP-02; a shared IT plan link preserves the existing request flow. */
export function ManagerPlanPicker({
  value,
  onChange,
  disabled,
  invalid
}: {
  value: ManagerChoice | null
  onChange: (plan: ManagerChoice | null) => void
  disabled: boolean
  invalid?: boolean
}) {
  const { t: translate } = useTranslation('manager')
  const [params] = useSearchParams()
  const [search, setSearch] = useState('')
  const planId = params.get('planId') ?? ''
  const linked: ManagerChoice | null = isResourceId(planId)
    ? {
        value: planId,
        label: params.get('planName')?.trim() || translate('linkedPlan'),
        description: params.get('applicationName')?.trim() || undefined
      }
    : null
  const options = linked ? [linked] : []
  const filtered = options.filter((option) =>
    `${option.label} ${option.description ?? ''}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
  )
  return (
    <ManagerChoiceSelect
      label={translate('plan')}
      placeholder={translate('choosePlan')}
      selected={value ? [value] : []}
      onChange={(choices) => onChange(choices[0] ?? null)}
      options={filtered}
      disabled={disabled}
      invalid={invalid}
      search={{
        label: translate('searchPlans'),
        placeholder: translate('searchPlansPlaceholder'),
        value: search,
        onChange: setSearch
      }}
      hint={translate('planCatalogPending')}
      state={
        !filtered.length && (
          <p className='py-4 text-sm text-muted-foreground'>
            {translate(options.length ? 'noSearchResults' : 'planCatalogUnavailable')}
          </p>
        )
      }
    />
  )
}
