import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchableSelect, type SearchableOption } from '~/shared/ui/searchable-select'

interface ApprovalsSelectControlProps {
  value: string
  options: readonly SearchableOption[]
  onChange: (value: string) => void
  /** Says what to pick; the role default reads "Chọn <label>, gõ để tìm". */
  placeholder?: string
  disabled?: boolean
  id?: string
  'aria-label'?: string
  /** The figure the caller is filtering by, used in the default placeholder. */
  subject?: string
}

/**
 * The role's bare select control: a searchable combobox (click opens the list, typing filters it). Every select of the
 * Spending Approver goes through here or through `ApprovalsSelect`, so all of them search the same way.
 */
export function ApprovalsNativeSelect({
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
  id,
  subject,
  'aria-label': ariaLabel
}: ApprovalsSelectControlProps) {
  const { t: translate, i18n } = useTranslation('approvals')
  const fallbackSubject = (subject ?? ariaLabel ?? '').toLocaleLowerCase(i18n.language)
  return (
    <SearchableSelect
      id={id}
      value={value}
      options={options}
      disabled={disabled}
      aria-label={ariaLabel}
      placeholder={placeholder ?? translate('select.placeholder', { subject: fallbackSubject })}
      emptyText={translate('select.empty')}
      onChange={(next) => onChange(next)}
    />
  )
}

/** Labelled searchable select used by the filter bars and decision forms of the role. */
export function ApprovalsSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
  disabled = false
}: {
  label: string
  value: string
  options: readonly SearchableOption[]
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  const id = useId()
  return (
    <div className='min-w-0 space-y-1.5'>
      <label htmlFor={id} className='block text-sm font-medium'>
        {label}
      </label>
      <ApprovalsNativeSelect
        id={id}
        value={value}
        options={options}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        subject={label}
      />
    </div>
  )
}
