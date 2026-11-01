import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { History, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { DepartmentResponseDtoData } from '~/shared/api/generated/model'
import { useDashboardFormat } from '../../../dashboard-ui'
import { adminButtonClass } from '../../shared/components/admin-form'

export function DepartmentHeadHistory({
  department,
  onClose,
  onReady
}: {
  department: NonNullable<DepartmentResponseDtoData>
  onClose: () => void
  onReady?: () => void
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const { t: translateAdmin } = useTranslation('admin')
  const { formatDate } = useDashboardFormat()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const headingId = useId()
  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    const readyFrame = requestAnimationFrame(() => onReady?.())
    return () => {
      cancelAnimationFrame(readyFrame)
      dialog?.close()
    }
  }, [onReady])
  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      onClose={(event) => {
        // Strict Mode reopens this node before its queued cleanup close event fires.
        if (!event.currentTarget.open) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button')
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
      className='fixed inset-x-0 top-auto bottom-0 m-0 max-h-[85dvh] w-full max-w-none flex-col rounded-t-lg border border-border bg-surface p-0 text-foreground shadow-xl backdrop:bg-foreground/40 open:flex md:inset-0 md:m-auto md:max-w-2xl md:rounded-lg'
    >
      <header className='flex shrink-0 items-center justify-between gap-4 border-b border-border p-5'>
        <div className='flex min-w-0 items-center gap-3'>
          <History aria-hidden className='size-5 shrink-0 text-primary-ink' strokeWidth={1.5} />
          <h2 id={headingId} className='text-lg font-semibold [text-wrap:balance]'>
            {translate('headHistory')}
          </h2>
        </div>
        <button
          type='button'
          aria-label={translateAdmin('close')}
          className='grid size-11 shrink-0 place-items-center rounded-md transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary'
          onClick={() => dialogRef.current?.close()}
        >
          <X aria-hidden className='size-5' strokeWidth={1.5} />
        </button>
      </header>
      <div className='min-h-0 overflow-y-auto p-5'>
        <p className='mb-5 truncate text-sm font-medium' title={department.name}>
          {department.name}
        </p>
        {!department.headHistory.length && (
          <p className='rounded-md bg-surface-subtle px-4 py-5 text-sm text-muted-foreground'>
            {translate('noHistory')}
          </p>
        )}
        <div className='divide-y divide-border/70'>
          {department.headHistory.map((head) => (
            <div
              key={`${head.employeeId}-${head.validFrom}`}
              className='flex min-w-0 flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0'
            >
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-semibold' title={head.fullName}>
                  {head.fullName}
                </p>
                <p className='mt-1 truncate font-mono text-xs text-muted-foreground' title={head.employeeCode}>
                  {head.employeeCode}
                </p>
              </div>
              <p className='text-right font-mono text-xs text-muted-foreground tabular-nums'>
                {formatDate(head.validFrom)} <span aria-hidden>—</span>{' '}
                {head.validTo ? formatDate(head.validTo) : translate('ongoing')}
              </p>
            </div>
          ))}
        </div>
        {department.headHistoryHasMore && (
          <p className='mt-4 text-xs text-muted-foreground'>{translate('historyLimited')}</p>
        )}
      </div>
      <footer className='flex shrink-0 justify-end border-t border-border p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]'>
        <button type='button' className={adminButtonClass} onClick={() => dialogRef.current?.close()}>
          {translateAdmin('close')}
        </button>
      </footer>
    </dialog>,
    document.body
  )
}
