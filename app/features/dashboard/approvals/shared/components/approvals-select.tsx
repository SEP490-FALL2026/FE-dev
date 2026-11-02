import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'

export function ApprovalsSelect({
  label,
  value,
  options,
  onChange,
  disabled = false
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const { t: translate } = useTranslation('approvals')
  const controlId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const selectedIndex = options.findIndex((option) => option.value === value)
  const safeActiveIndex = Math.min(activeIndex, options.length - 1)
  const expanded = open && !disabled && options.length > 0

  useEffect(() => {
    if (!expanded) return
    function onOutsidePointer(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onOutsidePointer)
    return () => document.removeEventListener('pointerdown', onOutsidePointer)
  }, [expanded])

  useEffect(() => {
    if (!expanded) return
    document.getElementById(`${controlId}-option-${safeActiveIndex}`)?.scrollIntoView?.({ block: 'nearest' })
  }, [expanded, controlId, safeActiveIndex])

  function showOptions() {
    setActiveIndex(Math.max(0, selectedIndex))
    setOpen(true)
  }

  function choose(index: number) {
    const option = options[index]
    if (!option) return
    onChange(option.value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled || !options.length) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!expanded) showOptions()
      else setActiveIndex((safeActiveIndex + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (expanded) choose(safeActiveIndex)
      else showOptions()
    } else if (event.key === 'Escape' && expanded) {
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
    } else if (event.key === 'Tab') setOpen(false)
    else if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      const nextIndex = options.findIndex(
        (option, index) =>
          index > safeActiveIndex && option.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase())
      )
      const matchIndex =
        nextIndex >= 0
          ? nextIndex
          : options.findIndex((option) => option.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()))
      if (matchIndex >= 0) {
        event.preventDefault()
        setOpen(true)
        setActiveIndex(matchIndex)
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className='relative min-w-0 space-y-1.5'
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <span id={`${controlId}-label`} className='block text-sm font-medium'>
        {label}
      </span>
      <button
        ref={triggerRef}
        type='button'
        role='combobox'
        aria-labelledby={`${controlId}-label`}
        aria-controls={`${controlId}-listbox`}
        aria-expanded={expanded}
        aria-haspopup='listbox'
        aria-activedescendant={expanded ? `${controlId}-option-${safeActiveIndex}` : undefined}
        disabled={disabled || !options.length}
        className='flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-left text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 md:min-h-9 md:text-sm'
        onClick={() => (expanded ? setOpen(false) : showOptions())}
        onKeyDown={onKeyDown}
      >
        <span className='truncate' title={options[selectedIndex]?.label}>
          {options[selectedIndex]?.label ?? translate('unknown')}
        </span>
        <ChevronDown aria-hidden className='size-4 shrink-0 text-muted-foreground' strokeWidth={1.5} />
      </button>
      {expanded && (
        <ul
          id={`${controlId}-listbox`}
          role='listbox'
          aria-labelledby={`${controlId}-label`}
          className='absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-border bg-surface p-1 shadow-sm'
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${controlId}-option-${index}`}
              role='option'
              aria-selected={option.value === value}
              className={`flex min-h-11 cursor-pointer items-center rounded-sm px-3 py-2 text-base md:min-h-9 md:text-sm ${index === safeActiveIndex ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-surface-subtle'}`}
              onPointerMove={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              <span className='truncate' title={option.label}>
                {option.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
