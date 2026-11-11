import { useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useModalLayer } from './use-modal-layer'

/** Read-only details; keeps the underlying list and its filters in place. */
export function DetailDrawer({
  title,
  closeLabel,
  closeDisabled = false,
  footer,
  onClose,
  children
}: {
  title: string
  closeLabel: string
  closeDisabled?: boolean
  footer?: ReactNode
  onClose: () => void
  children: ReactNode
}) {
  const titleId = useId()
  const layerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  useModalLayer(layerRef)
  return createPortal(
    <div
      ref={layerRef}
      className='fixed inset-0 z-50 flex items-end justify-end bg-foreground/40 md:items-stretch'
      onClick={(event) => {
        if (event.target === event.currentTarget && !closeDisabled) onClose()
      }}
    >
      <div
        ref={panelRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        tabIndex={-1}
        className='flex max-h-[95dvh] w-full flex-col rounded-t-lg border border-border bg-surface text-foreground shadow-xl outline-none md:h-dvh md:max-h-dvh md:max-w-[640px] md:rounded-none'
        onKeyDown={(event) => {
          if (event.target instanceof Element && event.target.closest('[role="dialog"]') !== panelRef.current) return
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            if (!closeDisabled) onClose()
            return
          }
          if (event.key !== 'Tab') return
          const controls = Array.from(
            panelRef.current?.querySelectorAll<HTMLElement>(
              'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex="0"]'
            ) ?? []
          ).filter((element) => !element.closest('[hidden], [inert]'))
          const first = controls[0]
          const last = controls[controls.length - 1]
          if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
            event.preventDefault()
            last?.focus()
          } else if (
            !event.shiftKey &&
            (document.activeElement === last || document.activeElement === panelRef.current)
          ) {
            event.preventDefault()
            first?.focus()
          }
        }}
      >
        <header className='flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4 sm:px-6'>
          <h2 id={titleId} className='min-w-0 text-lg font-semibold break-words [text-wrap:balance]'>
            {title}
          </h2>
          <button
            type='button'
            aria-label={closeLabel}
            disabled={closeDisabled}
            onClick={onClose}
            className='grid size-11 shrink-0 place-items-center rounded-md transition-colors duration-150 hover:bg-surface-subtle active:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50'
          >
            <X aria-hidden className='size-5' strokeWidth={1.5} />
          </button>
        </header>
        <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6'>
          {children}
        </div>
        {footer && (
          <footer className='shrink-0 border-t border-border/60 bg-surface px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6'>
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  )
}
