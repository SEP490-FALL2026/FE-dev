import { useState } from 'react'
import { useCostCenterList } from '~/shared/api/generated/operations/cost-centers'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
import type { SearchableOption } from '~/shared/ui/searchable-select'
import { FinanceSelect } from '../../shared/components/finance-ui'

/**
 * Cost Center combobox with server search (`costCenterList?search=`). Inactive Cost Centers stay listed: a transfer
 * for a department that changed Cost Center mid-year starts from the old, deactivated one.
 */
export function CostCenterPicker({
  value,
  onChange,
  placeholder,
  allLabel,
  required,
  invalid
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  /** Adds a first "all" choice with the empty value (filters). */
  allLabel?: string
  required?: boolean
  invalid?: boolean
}) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)
  // Keeps the name of the picked Cost Center while a later search no longer returns it.
  const [pickedLabel, setPickedLabel] = useState<string>()
  const query = useCostCenterList({ pageSize: 50, ...(debouncedSearch ? { search: debouncedSearch } : {}) })
  const options: SearchableOption[] = [
    ...(allLabel ? [{ value: '', label: allLabel }] : []),
    ...(query.data?.data?.items ?? []).map((costCenter) => ({
      value: costCenter.id,
      label: costCenter.name,
      description: costCenter.code
    }))
  ]
  return (
    <FinanceSelect
      value={value}
      options={options}
      placeholder={placeholder}
      required={required}
      invalid={invalid}
      loading={query.isFetching}
      selectedLabel={pickedLabel}
      onSearchChange={setSearch}
      onValueChange={(next, option) => {
        setPickedLabel(option?.label)
        onChange(next)
      }}
    />
  )
}
