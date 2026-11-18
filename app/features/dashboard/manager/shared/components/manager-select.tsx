import { useState, type ComponentProps } from 'react'
import { SearchableSelect, type SearchableOption } from '~/shared/ui/searchable-select'

export type { SearchableOption as ManagerSelectOption } from '~/shared/ui/searchable-select'

type BaseProps = Omit<ComponentProps<typeof SearchableSelect>, 'value' | 'onChange' | 'invalid'> & {
  /** Set by ManagerField when the BE flags this field. */
  'aria-invalid'?: boolean
  invalid?: boolean
}

/** Controlled combobox for every manager pick list: typing in the field filters the options. */
export function ManagerSelect({
  value,
  onChange,
  'aria-invalid': ariaInvalid,
  invalid,
  ...props
}: BaseProps & { value: string; onChange: (value: string, option: SearchableOption | null) => void }) {
  return <SearchableSelect {...props} value={value} onChange={onChange} invalid={invalid ?? !!ariaInvalid} />
}

/**
 * Uncontrolled variant for forms read through FormData: keeps its own value and posts it under `name` through the
 * hidden input of SearchableSelect.
 */
export function ManagerFormSelect({
  defaultValue = '',
  name,
  onValueChange,
  ...props
}: BaseProps & { defaultValue?: string; name: string; onValueChange?: (value: string) => void }) {
  const [value, setValue] = useState(defaultValue)
  return (
    <ManagerSelect
      {...props}
      name={name}
      value={value}
      onChange={(next) => {
        setValue(next)
        onValueChange?.(next)
      }}
    />
  )
}

/** Options for enum codes whose labels come from i18n. */
export function enumOptions<Code extends string>(
  codes: readonly Code[],
  label: (code: Code) => string
): SearchableOption[] {
  return codes.map((code) => ({ value: code, label: label(code) }))
}
