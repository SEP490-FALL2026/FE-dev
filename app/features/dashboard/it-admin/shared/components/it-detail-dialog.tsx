import { useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useModalLayer } from '~/shared/ui/use-modal-layer'

/** Read-only detail drawer. Forms use ItFormDialog so their submit lifecycle stays separate. */
export function ItDetailDialog({
  title,
  onClose,
  children
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const { t: translate } = useTranslation('admin')
  const titleId = useId()
  const layerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  useModalLayer(layerRef)
  return createPortal(
    <div
      ref={layerRef}
      className='fixed inset-0 z-50 flex items-end justify-end bg-foreground/40 md:items-stretch'
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        tabIndex={-1}
        className='flex max-h-[95dvh] w-full flex-col rounded-t-lg border border-border bg-surface text-foreground shadow-xl outline-none md:h-dvh md:max-h-dvh md:max-w-2xl md:rounded-none'
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            onClose()
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
        <header className='flex items-center justify-between gap-4 border-b border-border p-5'>
          <h2 id={titleId} className='text-lg font-semibold [text-wrap:balance]'>
            {title}
          </h2>
          <button
            type='button'
            aria-label={translate('close')}
            onClick={onClose}
            className='grid size-11 shrink-0 place-items-center rounded-md hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary'
          >
            <X aria-hidden className='size-5' strokeWidth={1.5} />
          </button>
        </header>
        <div className='min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain break-words p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]'>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
