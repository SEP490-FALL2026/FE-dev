import { Check, ChevronDown, Search, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { managerInputClass } from './manager-api-ui'

export interface ManagerChoice {
  value: string
  label: string
  description?: string
}

/** The picker owns focus; selected labels survive search and page changes. */
export function ManagerChoiceSelect({
  label,
  placeholder,
  options,
  selected,
  onChange,
  multiple = false,
  limit = 1,
  disabled = false,
  invalid = false,
  onOpenChange,
  search,
  state,
  footer,
  hint
}: {
  label: string
  placeholder: string
  options: readonly ManagerChoice[]
  selected: readonly ManagerChoice[]
  onChange: (choices: ManagerChoice[]) => void
  multiple?: boolean
  limit?: number
  disabled?: boolean
  invalid?: boolean
  onOpenChange?: (open: boolean) => void
  search?: { label: string; placeholder: string; value: string; onChange: (value: string) => void }
  state?: ReactNode
  footer?: ReactNode
  hint?: string
}) {
  const { t: translate } = useTranslation('manager')
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const id = useId()
  const expanded = open && !disabled
  const changeOpen = (value: boolean) => {
    setOpen(value)
    onOpenChange?.(value)
  }
  useEffect(() => {
    if (!expanded) return
    searchInput.current?.focus()
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false)
        onOpenChange?.(false)
      }
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [expanded, onOpenChange])

  return (
    <div
      ref={root}
      className='relative min-w-0 space-y-2'
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) changeOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && expanded) {
          event.preventDefault()
          event.stopPropagation()
          changeOpen(false)
          trigger.current?.focus()
        }
        if (expanded && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          if (event.target === searchInput.current && ['Home', 'End'].includes(event.key)) return
          const choices = Array.from(
            list.current?.querySelectorAll<HTMLButtonElement>('[role="option"]:not(:disabled)') ?? []
          )
          if (!choices.length) return
          event.preventDefault()
          const current = choices.indexOf(document.activeElement as HTMLButtonElement)
          const next =
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? choices.length - 1
                : event.key === 'ArrowDown'
                  ? (current + 1) % choices.length
                  : current < 0
                    ? choices.length - 1
                    : (current - 1 + choices.length) % choices.length
          choices[next]?.focus()
        }
      }}
    >
      <p id={`${id}-label`} className='text-sm font-medium'>
        {label}
      </p>
      <button
        ref={trigger}
        type='button'
        role='combobox'
        aria-labelledby={`${id}-label`}
        aria-controls={`${id}-options`}
        aria-expanded={expanded}
        aria-haspopup='listbox'
        aria-required='true'
        aria-invalid={invalid || undefined}
        aria-describedby={hint ? `${id}-hint` : undefined}
        disabled={disabled}
        className={`${managerInputClass} flex items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-60`}
        onClick={() => changeOpen(!open)}
        onKeyDown={(event) => {
          if (['ArrowDown', 'ArrowUp'].includes(event.key) && !expanded) {
            event.preventDefault()
            event.stopPropagation()
            changeOpen(true)
          }
        }}
      >
        <span className={`min-w-0 ${!selected.length ? 'text-muted-foreground' : ''}`}>
          <span className='block truncate'>
            {selected.length
              ? multiple
                ? translate('selectedPeople', { count: selected.length })
                : selected[0]?.label
              : placeholder}
          </span>
          {!multiple && selected[0]?.description && (
            <span className='block truncate text-xs text-muted-foreground'>{selected[0].description}</span>
          )}
        </span>
        <ChevronDown
          aria-hidden
          strokeWidth={1.5}
          className={`size-4 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {hint && (
        <p id={`${id}-hint`} className='text-xs leading-relaxed text-muted-foreground'>
          {hint}
        </p>
      )}
      {expanded && (
        <div className='absolute inset-x-0 top-full z-20 mt-1 rounded-lg border border-border bg-surface p-3 shadow-lg'>
          {search && (
            <div className='relative mb-2'>
              <Search
                aria-hidden
                strokeWidth={1.5}
                className='pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground'
              />
              <input
                ref={searchInput}
                type='search'
                aria-label={search.label}
                value={search.value}
                placeholder={search.placeholder}
                maxLength={100}
                className={`${managerInputClass} pl-9`}
                onChange={(event) => search.onChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') event.preventDefault()
                }}
              />
            </div>
          )}
          {state}
          <div
            ref={list}
            role='listbox'
            id={`${id}-options`}
            aria-labelledby={`${id}-label`}
            aria-multiselectable={multiple}
            className='max-h-64 overflow-y-auto overscroll-contain'
          >
            {options.map((option) => {
              const chosen = selected.some((item) => item.value === option.value)
              return (
                <button
                  key={option.value}
                  type='button'
                  role='option'
                  aria-selected={chosen}
                  disabled={multiple && !chosen && selected.length >= limit}
                  tabIndex={-1}
                  className='flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-surface-subtle focus-visible:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50 aria-selected:bg-primary-soft'
                  onClick={() => {
                    onChange(
                      chosen
                        ? selected.filter((item) => item.value !== option.value)
                        : multiple
                          ? [...selected, option]
                          : [option]
                    )
                    if (!multiple) {
                      changeOpen(false)
                      trigger.current?.focus()
                    }
                  }}
                >
                  <span
                    aria-hidden
                    className={`grid size-4 shrink-0 place-items-center rounded border ${chosen ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}
                  >
                    {chosen && <Check strokeWidth={1.5} className='size-3' />}
                  </span>
                  <span className='min-w-0'>
                    <span className='block truncate text-sm font-medium' title={option.label}>
                      {option.label}
                    </span>
                    {option.description && (
                      <span className='block truncate text-xs text-muted-foreground' title={option.description}>
                        {option.description}
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
          {footer}
        </div>
      )}
      {multiple && selected.length > 0 && (
        <ul aria-label={translate('selectedParticipants')} className='flex flex-wrap gap-2 pt-1'>
          {selected.map((option) => (
            <li
              key={option.value}
              className='flex max-w-full items-center gap-1 rounded-md border border-border/70 bg-surface-subtle pl-3'
            >
              <span
                className='truncate text-sm'
                title={`${option.label}${option.description ? ` · ${option.description}` : ''}`}
              >
                {option.label}
              </span>
              <button
                type='button'
                disabled={disabled}
                aria-label={translate('removeParticipant', { name: option.label })}
                className='grid size-11 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-primary'
                onClick={() => onChange(selected.filter((item) => item.value !== option.value))}
              >
                <X aria-hidden strokeWidth={1.5} className='size-4' />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
