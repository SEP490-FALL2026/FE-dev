import { Check, ChevronDown, LoaderCircle, Search, X } from 'lucide-react'
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent
} from 'react'
import { useTranslation } from 'react-i18next'

export interface SearchableOption {
  value: string
  label: string
  /** Secondary line, e.g. email, department or plan. Also searched. */
  description?: string
  disabled?: boolean
}

export interface SearchableSelectProps {
  value: string | null | undefined
  /** Receives '' when the selection is cleared. */
  onChange: (value: string, option: SearchableOption | null) => void
  options: readonly SearchableOption[]
  /** Describes what to pick, e.g. "Chọn phòng ban (gõ tên để tìm)". Shown while nothing is selected. */
  placeholder: string
  /**
   * Server-side search: called (already trimmed) whenever the typed text changes. When provided the list is not
   * filtered locally, the caller passes the matching `options` (debounce in the caller or with `useDebouncedValue`).
   */
  onSearchChange?: (query: string) => void
  /** Label for `value` when the selected option is not in the current `options` page (server paging/search). */
  selectedLabel?: string
  loading?: boolean
  emptyText?: string
  /** Shows a clear button when a value is selected. */
  clearable?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  id?: string
  /** Native form field name; a hidden input carries the value for FormData readers. */
  name?: string
  className?: string
  'aria-label'?: string
  'aria-describedby'?: string
  /** Passed by field wrappers (AdminField and similar) that describe the control. */
  descriptionId?: string
}

const inputClass =
  'min-h-11 w-full rounded-md border bg-background py-2 pr-16 pl-9 text-base text-foreground outline-none transition-colors duration-150 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:min-h-10 md:text-sm'

/** Lower-cases and strips Vietnamese diacritics so "phong ky thuat" finds "Phòng Kỹ thuật". */
export function normalizeSearchText(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().trim()
}

/**
 * Combobox: the field itself is the search box. Click or focus opens the list, typing filters it (locally, or through
 * `onSearchChange` for server search), arrows/Enter pick, Escape restores the previous value. The list is rendered in
 * place with fixed positioning, so it escapes scroll containers without leaving a modal layer (portals to body would
 * be made inert by `useModalLayer`).
 */
export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  onSearchChange,
  selectedLabel,
  loading = false,
  emptyText,
  clearable = false,
  hasMore = false,
  onLoadMore,
  disabled = false,
  required,
  invalid = false,
  id,
  name,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  descriptionId
}: SearchableSelectProps) {
  const { t: translate } = useTranslation('common')
  const generatedId = useId()
  const inputId = id ?? `${generatedId}-input`
  const listId = `${generatedId}-list`
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const selectedOption = options.find((option) => option.value === value) ?? null
  const currentLabel = selectedOption?.label ?? (value ? selectedLabel : undefined) ?? ''
  const visibleOptions = useMemo(() => {
    if (onSearchChange) return options
    const needle = normalizeSearchText(query)
    if (!needle) return options
    return options.filter((option) =>
      normalizeSearchText(`${option.label} ${option.description ?? ''}`).includes(needle)
    )
  }, [options, query, onSearchChange])
  const safeActive = Math.min(activeIndex, Math.max(visibleOptions.length - 1, 0))

  const updateQuery = (next: string) => {
    setQuery(next)
    setActiveIndex(0)
    onSearchChange?.(next.trim())
  }
  const openList = () => {
    if (disabled || open) return
    setOpen(true)
    const selectedIndex = options.findIndex((option) => option.value === value)
    setActiveIndex(selectedIndex >= 0 && !onSearchChange ? selectedIndex : 0)
  }
  const closeList = () => {
    setOpen(false)
    if (query) updateQuery('')
  }
  const choose = (option: SearchableOption) => {
    if (option.disabled) return
    onChange(option.value, option)
    setOpen(false)
    if (query) updateQuery('')
    input.current?.focus()
  }

  // Keep the list glued under (or above, when there is no room below) the field while anything scrolls.
  useLayoutEffect(() => {
    if (!open) return
    const position = () => {
      if (!input.current || !list.current) return
      const bounds = input.current.getBoundingClientRect()
      const margin = 12
      const below = window.innerHeight - bounds.bottom - margin
      const above = bounds.top - margin
      const placeAbove = below < 180 && above > below
      const maxHeight = Math.min(320, Math.max(140, placeAbove ? above : below))
      // A transformed/filtered ancestor turns `fixed` into "relative to that ancestor". Measure where (0, 0) actually
      // lands and subtract it, so the list sits under the field in every container (animated sections, dialogs).
      Object.assign(list.current.style, { left: '0px', top: '0px', bottom: '', width: `${bounds.width}px` })
      list.current.style.maxHeight = `${maxHeight}px`
      const origin = list.current.getBoundingClientRect()
      const left = Math.max(margin, Math.min(bounds.left, window.innerWidth - bounds.width - margin))
      const top = placeAbove ? bounds.top - 6 - origin.height : bounds.bottom + 6
      Object.assign(list.current.style, { left: `${left - origin.left}px`, top: `${top - origin.top}px` })
    }
    position()
    window.addEventListener('resize', position)
    window.addEventListener('scroll', position, true)
    return () => {
      window.removeEventListener('resize', position)
      window.removeEventListener('scroll', position, true)
    }
  }, [open, visibleOptions.length])

  useEffect(() => {
    if (!open) return
    const outside = (event: Event) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) closeList()
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('focusin', outside)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('focusin', outside)
    }
  })

  useEffect(() => {
    if (!open) return
    list.current?.querySelector(`[data-index="${safeActive}"]`)?.scrollIntoView?.({ block: 'nearest' })
  }, [open, safeActive])

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) return openList()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex(Math.min(Math.max(safeActive + step, 0), Math.max(visibleOptions.length - 1, 0)))
    } else if (event.key === 'Enter' && open) {
      event.preventDefault()
      const option = visibleOptions[safeActive]
      if (option) choose(option)
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      event.stopPropagation()
      closeList()
    } else if (event.key === 'Tab' && open) {
      closeList()
    }
  }

  const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined
  const activeOption = open ? visibleOptions[safeActive] : undefined

  return (
    <div ref={root} className={`relative min-w-0 ${className}`}>
      {name && <input type='hidden' name={name} value={value ?? ''} />}
      <Search
        aria-hidden='true'
        strokeWidth={1.5}
        className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
      />
      <input
        ref={input}
        id={inputId}
        type='text'
        role='combobox'
        autoComplete='off'
        spellCheck={false}
        aria-autocomplete='list'
        aria-controls={listId}
        aria-expanded={open}
        aria-activedescendant={activeOption ? `${listId}-${safeActive}` : undefined}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        disabled={disabled}
        className={`${inputClass} ${
          invalid
            ? 'border-danger focus-visible:ring-2 focus-visible:ring-danger/25'
            : 'border-border hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25'
        }`}
        placeholder={open && currentLabel ? currentLabel : placeholder}
        title={currentLabel || placeholder}
        value={open ? query : currentLabel}
        onChange={(event) => {
          if (!open) openList()
          updateQuery(event.target.value)
        }}
        onClick={openList}
        onFocus={openList}
        onKeyDown={onKeyDown}
      />
      <span className='absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5'>
        {loading && (
          <LoaderCircle aria-hidden='true' strokeWidth={1.5} className='size-4 animate-spin text-muted-foreground' />
        )}
        {clearable && value && !disabled && (
          <button
            type='button'
            aria-label={translate('searchSelect.clear')}
            className='grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-foreground'
            onClick={() => {
              onChange('', null)
              input.current?.focus()
            }}
          >
            <X aria-hidden='true' strokeWidth={1.5} className='size-3.5' />
          </button>
        )}
        <button
          type='button'
          tabIndex={-1}
          aria-label={translate('searchSelect.toggle')}
          disabled={disabled}
          className='grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground'
          onClick={() => {
            if (open) closeList()
            else {
              openList()
              input.current?.focus()
            }
          }}
        >
          <ChevronDown
            aria-hidden='true'
            strokeWidth={1.5}
            className={`size-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </span>
      {open && (
        <div
          ref={list}
          id={listId}
          role='listbox'
          aria-label={ariaLabel}
          className='searchable-select-list fixed z-[70] overflow-y-auto rounded-lg border border-border bg-surface p-1 shadow-[0_16px_40px_-16px_rgb(35_39_65/35%)]'
        >
          {visibleOptions.map((option, index) => {
            const selected = option.value === value
            return (
              <div
                key={option.value}
                id={`${listId}-${index}`}
                data-index={index}
                role='option'
                aria-selected={selected}
                aria-disabled={option.disabled || undefined}
                className={`flex cursor-pointer items-start gap-2 rounded-md px-2.5 py-2 text-sm transition-colors duration-100 ${
                  index === safeActive ? 'bg-primary-soft/70 text-foreground' : 'text-foreground'
                } ${option.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                onPointerDown={(event) => event.preventDefault()}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => choose(option)}
              >
                <Check
                  aria-hidden='true'
                  strokeWidth={1.75}
                  className={`mt-0.5 size-4 shrink-0 text-primary ${selected ? 'opacity-100' : 'opacity-0'}`}
                />
                <span className='min-w-0 flex-1'>
                  <span className='block truncate font-medium' title={option.label}>
                    {option.label}
                  </span>
                  {option.description && (
                    <span className='mt-0.5 block truncate text-xs text-muted-foreground' title={option.description}>
                      {option.description}
                    </span>
                  )}
                </span>
              </div>
            )
          })}
          {!visibleOptions.length && (
            <p role='status' className='px-3 py-4 text-center text-sm text-muted-foreground'>
              {loading ? translate('searchSelect.loading') : (emptyText ?? translate('searchSelect.empty'))}
            </p>
          )}
          {hasMore && onLoadMore && (
            <button
              type='button'
              disabled={loading}
              className='mt-1 flex min-h-9 w-full items-center justify-center gap-2 rounded-md border-t border-border/60 text-sm font-medium text-primary-ink transition-colors hover:bg-surface-subtle disabled:opacity-60'
              onPointerDown={(event) => event.preventDefault()}
              onClick={onLoadMore}
            >
              {loading && <LoaderCircle aria-hidden='true' strokeWidth={1.5} className='size-4 animate-spin' />}
              {translate('searchSelect.loadMore')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
