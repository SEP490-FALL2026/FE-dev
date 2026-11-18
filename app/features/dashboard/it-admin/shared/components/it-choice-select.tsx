import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchableSelect, type SearchableOption } from '~/shared/ui/searchable-select'

/** Label + searchable combobox used by every IT Admin form and filter. */
export function ItChoiceSelect({
  label,
  value,
  options,
  onChange,
  hint,
  placeholder,
  required = false,
  disabled = false,
  loading = false,
  clearable = false,
  name,
  emptyText,
  selectedLabel,
  onSearchChange,
  hasMore,
  onLoadMore
}: {
  label: string
  value: string
  options: readonly SearchableOption[]
  onChange: (value: string) => void
  disabled?: boolean
  hint?: string
  /** Defaults to "Choose <label>, type to search". */
  placeholder?: string
  required?: boolean
  loading?: boolean
  clearable?: boolean
  name?: string
  emptyText?: string
  selectedLabel?: string
  onSearchChange?: (query: string) => void
  hasMore?: boolean
  onLoadMore?: () => void
}) {
  const { t: translate } = useTranslation('itAdmin')
  const id = useId()
  const descriptionId = `${id}-description`
  const [remembered, setRemembered] = useState<SearchableOption>()
  const fieldName = /^[A-Z]{2}/.test(label) ? label : label.charAt(0).toLocaleLowerCase() + label.slice(1)
  return (
    <div className='it-form-field grid min-w-0 content-start gap-1.5 text-sm font-medium'>
      <label htmlFor={id}>
        {label}
        {required && (
          <span aria-hidden='true' className='ml-1 text-danger'>
            *
          </span>
        )}
      </label>
      <SearchableSelect
        id={id}
        name={name}
        value={value}
        options={options}
        placeholder={placeholder ?? translate('choosePlaceholder', { field: fieldName })}
        selectedLabel={selectedLabel ?? (remembered?.value === value ? remembered.label : undefined)}
        required={required}
        disabled={disabled}
        loading={loading}
        clearable={clearable}
        emptyText={emptyText}
        onSearchChange={onSearchChange}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        descriptionId={hint ? descriptionId : undefined}
        onChange={(next, option) => {
          if (option) setRemembered(option)
          if (next || clearable || options.some((item) => item.value === '')) onChange(next)
        }}
      />
      {hint ? (
        <span id={descriptionId} className='min-h-5 text-xs font-normal text-muted-foreground'>
          {hint}
        </span>
      ) : (
        <span aria-hidden='true' />
      )}
    </div>
  )
}
