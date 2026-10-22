import { useId } from 'react'

interface FilterSelectProps<T extends string> {
  label: string
  onChange: (value: T) => void
  options: readonly { count?: number; label: string; value: T }[]
  value: T
}

/**
 * A list filter as one compact dropdown instead of a long row of chips. Same props as `FilterChips`, so a screen
 * switches by changing the component name; put the "all" option first.
 */
export function FilterSelect<T extends string>({ label, onChange, options, value }: FilterSelectProps<T>) {
  const id = useId()

  return (
    <div className='inline-flex flex-wrap items-center gap-2'>
      <label className='text-xs font-semibold text-muted-foreground' htmlFor={id}>
        {label}
      </label>
      <select
        className='h-9 min-w-44 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-foreground transition outline-none focus:border-primary focus:ring-3 focus:ring-primary-soft'
        id={id}
        onChange={(event) => onChange(event.target.value as T)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.count === undefined ? option.label : `${option.label} (${option.count})`}
          </option>
        ))}
      </select>
    </div>
  )
}
