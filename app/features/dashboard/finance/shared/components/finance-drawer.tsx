import { ArrowLeft, X } from 'lucide-react'
import { createContext, useContext, useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

const focusableSelector =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]'

const DetailPageContext = createContext(false)

/**
 * Renders the first FinanceDrawer below it as a full screen instead of a slide-over.
 * Record details use it so they read as their own page; drawers opened from inside that page stay drawers.
 */
export function FinanceDetailPage({ children }: { children: ReactNode }) {
  return <DetailPageContext.Provider value>{children}</DetailPageContext.Provider>
}

interface DrawerProps {
  title: string
  children: ReactNode
  onClose: () => void
  pending?: boolean
}

export function FinanceDrawer(props: DrawerProps) {
  return useContext(DetailPageContext) ? <DetailPagePanel {...props} /> : <DrawerPanel {...props} />
}

function DetailPagePanel({ title, children, onClose, pending = false }: DrawerProps) {
  const { t: translate } = useTranslation('finance')
  const titleId = useId()
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    heading.current?.focus()
  }, [])
  return (
    <section aria-labelledby={titleId} className='space-y-6'>
      <header className='space-y-3 border-b border-border/60 pb-5'>
        <button
          type='button'
          disabled={pending}
          onClick={onClose}
          className='-ml-2 inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none active:bg-primary-soft active:text-primary-ink disabled:cursor-not-allowed disabled:opacity-50 md:min-h-9'
        >
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('backToList')}
        </button>
        <h1
          ref={heading}
          id={titleId}
          tabIndex={-1}
          className='text-2xl leading-tight font-semibold tracking-tight break-words outline-none [text-wrap:balance]'
        >
          {title}
        </h1>
      </header>
      <DetailPageContext.Provider value={false}>
        <div className='space-y-6 rounded-lg border border-border/70 bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] sm:p-6'>
          {children}
        </div>
      </DetailPageContext.Provider>
    </section>
  )
}

function DrawerPanel({ title, children, onClose, pending = false }: DrawerProps) {
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
        className='max-h-[92dvh] w-full overflow-y-auto rounded-t-lg border border-border bg-surface pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-xl outline-none md:max-h-screen md:w-[640px] md:rounded-none'
      >
        <header className='sticky top-0 z-10 mb-5 flex items-start justify-between gap-4 border-b border-border/60 bg-surface/95 px-5 py-4 backdrop-blur-md'>
          <h2 id={titleId} className='text-lg font-semibold tracking-tight [text-wrap:balance]'>
            {title}
          </h2>
          <button
            aria-label={translate('close')}
            type='button'
            disabled={pending}
            className='grid size-11 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground active:bg-primary-soft active:text-primary-ink disabled:opacity-50 md:size-8'
            onClick={onClose}
          >
            <X aria-hidden className='size-4' strokeWidth={1.5} />
          </button>
        </header>
        <div className='space-y-4 px-5'>{children}</div>
      </div>
    </div>
  )
}
