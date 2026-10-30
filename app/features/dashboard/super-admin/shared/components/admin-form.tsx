import { useEffect, useId, useRef, type ReactNode, type FormEvent } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAdminRetryDelay } from '../hooks/use-admin-retry-delay'

export const adminInputClass =
  'min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary md:min-h-10 md:text-sm'
const adminControlClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:min-h-10'
export const adminButtonClass = `${adminControlClass} border-border bg-surface hover:bg-surface-subtle`
export const adminPrimaryClass = `${adminControlClass} border-transparent bg-primary text-primary-foreground hover:bg-primary-hover`
const adminDangerClass = `${adminControlClass} border-danger bg-danger text-white hover:bg-danger/90`

export function AdminField({ label, children, error }: { label: string; children: ReactNode; error?: string }) {
  return (
    <label className='grid min-w-0 gap-1.5 text-sm font-medium'>
      {label}
      {children}
      {error && <span className='min-h-5 text-xs text-danger'>{error}</span>}
    </label>
  )
}

export function AdminFormDialog({
  title,
  children,
  onClose,
  onSubmit,
  pending,
  submitLabel,
  submitDisabled = false,
  page = false,
  wide = false,
  danger = false
}: {
  title: string
  children: ReactNode
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  pending: boolean
  submitLabel?: string
  submitDisabled?: boolean
  page?: boolean
  wide?: boolean
  danger?: boolean
}) {
  const { t: translate } = useTranslation('admin')
  const titleId = useId()
  const retrySeconds = useAdminRetryDelay()
  const panelRef = useRef<HTMLDivElement>(null)
  const submittingRef = useRef(false)
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    panelRef.current?.focus()
    return () => previousFocus?.focus()
  }, [])
  return (
    <div
      className={
        page
          ? 'mx-auto w-full max-w-5xl'
          : `fixed inset-0 z-50 flex bg-foreground/40 ${wide ? 'justify-end' : 'items-end justify-center md:items-center md:p-5'}`
      }
    >
      <div
        aria-labelledby={titleId}
        aria-modal={page ? undefined : true}
        aria-busy={pending}
        role={page ? 'region' : 'dialog'}
        ref={panelRef}
        tabIndex={-1}
        className={
          page
            ? 'flex w-full flex-col rounded-lg border border-border bg-surface outline-none'
            : `flex max-h-[95dvh] w-full flex-col border border-border bg-surface shadow-xl outline-none ${wide ? 'h-dvh md:max-w-[640px]' : 'rounded-t-lg md:max-w-lg md:rounded-lg'}`
        }
        onKeyDown={(event) => {
          if (page) return
          if (event.key === 'Escape' && !pending) onClose()
          if (event.key !== 'Tab') return
          const controls = panelRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex="0"]'
          )
          const first = controls?.[0]
          const last = controls?.[controls.length - 1]
          if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }}
      >
        <header className='flex items-center justify-between border-b border-border p-5'>
          <h2 id={titleId} className='text-lg font-semibold [text-wrap:balance]'>
            {title}
          </h2>
          <button
            aria-label={translate('close')}
            type='button'
            disabled={pending}
            className='grid size-11 place-items-center rounded-md hover:bg-surface-subtle'
            onClick={onClose}
          >
            <X aria-hidden strokeWidth={1.5} className='size-5' />
          </button>
        </header>
        <form
          className='flex min-h-0 flex-1 flex-col'
          onSubmit={(event) => {
            if (pending || submitDisabled || retrySeconds > 0 || submittingRef.current) {
              event.preventDefault()
              return
            }
            submittingRef.current = true
            queueMicrotask(() => {
              submittingRef.current = false
            })
            onSubmit(event)
          }}
        >
          <fieldset
            disabled={pending}
            className={page ? 'grid gap-4 p-5' : 'grid min-h-0 flex-1 gap-4 overflow-y-auto p-5'}
          >
            {children}
          </fieldset>
          <footer className='flex justify-end gap-3 border-t border-border p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]'>
            <button type='button' disabled={pending} onClick={onClose} className={adminButtonClass}>
              {translate('cancel')}
            </button>
            <button
              type='submit'
              disabled={pending || submitDisabled || retrySeconds > 0}
              aria-busy={pending}
              className={danger ? adminDangerClass : adminPrimaryClass}
            >
              {pending && <LoaderCircle aria-hidden className='size-4 animate-spin' strokeWidth={1.5} />}
              {pending
                ? translate('saving')
                : retrySeconds > 0
                  ? translate('retryIn', { count: retrySeconds })
                  : (submitLabel ?? translate('save'))}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}
