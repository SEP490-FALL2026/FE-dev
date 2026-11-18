import { useState } from 'react'
import { SearchableSelect, type SearchableOption, type SearchableSelectProps } from '~/shared/ui/searchable-select'

export type { SearchableOption }

export type AdminSelectProps = Omit<SearchableSelectProps, 'value' | 'onChange'> & {
  /** Controlled value. Leave undefined and use `defaultValue` for forms read through FormData. */
  value?: string
  defaultValue?: string
  onChange?: (value: string, option: SearchableOption | null) => void
}

/**
 * Role-wide picker built on the shared searchable combobox. Supports uncontrolled use (`name` + `defaultValue`) so
 * existing FormData readers keep working, and keeps native `required` validation through a visually hidden guard.
 */
export function AdminSelect({ value, defaultValue = '', onChange, required, ...props }: AdminSelectProps) {
  const [inner, setInner] = useState(defaultValue)
  const current = value ?? inner
  return (
    <div className='relative min-w-0'>
      <SearchableSelect
        {...props}
        required={required}
        value={current}
        onChange={(next, option) => {
          if (value === undefined) setInner(next)
          onChange?.(next, option)
        }}
      />
      {required && !props.disabled && (
        <input
          tabIndex={-1}
          aria-hidden='true'
          required
          value={current}
          onChange={() => undefined}
          className='pointer-events-none absolute bottom-0 left-6 h-px w-px opacity-0'
        />
      )}
    </div>
  )
}
