import { X } from 'lucide-react'
import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

const focusableSelector =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]'

export function FinanceDrawer({
  title,
  children,
  onClose,
  pending = false
}: {
  title: string
  children: ReactNode
  onClose: () => void
  pending?: boolean
}) {
  const { t: translate } = useTranslation('finance')
  const titleId = useId()
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const first = panel.current?.querySelector<HTMLElement>(focusableSelector)
    ;(first ?? panel.current)?.focus()
    return () => previous?.focus()
  }, [])
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && !pending) {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== 'Tab') return
    const elements = Array.from(panel.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])
    const first = elements[0]
    const last = elements[elements.length - 1]
    if (!first) {
      event.preventDefault()
      return
    }
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
  return (
    <div
      className='fixed inset-0 z-50 flex items-end justify-end bg-foreground/40 md:items-stretch'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !pending) onClose()
      }}
    >
      <div
        ref={panel}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className='max-h-[92dvh] w-full overflow-y-auto rounded-t-lg border border-border bg-surface p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-xl outline-none md:max-h-screen md:w-[640px] md:rounded-none'
      >
        <header className='mb-5 flex items-start justify-between gap-4'>
          <h2 id={titleId} className='text-lg font-semibold tracking-tight [text-wrap:balance]'>
            {title}
          </h2>
          <button
            aria-label={translate('close')}
            type='button'
            disabled={pending}
            className='grid size-11 shrink-0 place-items-center rounded-md hover:bg-surface-subtle disabled:opacity-50 md:size-8'
            onClick={onClose}
          >
            <X aria-hidden className='size-4' strokeWidth={1.5} />
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}
