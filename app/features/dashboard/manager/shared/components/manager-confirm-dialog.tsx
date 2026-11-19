import { useEffect, useId, useRef, type KeyboardEvent } from 'react'

type ManagerConfirmDialogProps = {
  cancelLabel: string
  confirmLabel: string
  description: string
  onCancel: () => void
  onConfirm: () => void
  title: string
  tone?: 'danger' | 'primary'
}

export function ManagerConfirmDialog({
  cancelLabel,
  confirmLabel,
  description,
  onCancel,
  onConfirm,
  title,
  tone = 'primary'
}: ManagerConfirmDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    cancelRef.current?.focus()
    return () => previousFocus?.focus()
  }, [])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onCancel()
      return
    }

    if (event.key !== 'Tab') return
    if (event.shiftKey && document.activeElement === cancelRef.current) {
      event.preventDefault()
      confirmRef.current?.focus()
    } else if (!event.shiftKey && document.activeElement === confirmRef.current) {
      event.preventDefault()
      cancelRef.current?.focus()
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-[2px]'>
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal='true'
        className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl'
        onKeyDown={handleKeyDown}
        role='dialog'
      >
        <h2 className='text-lg font-bold text-foreground' id={titleId}>
          {title}
        </h2>
        <p className='mt-2 text-sm leading-6 text-muted-foreground' id={descriptionId}>
          {description}
        </p>
        <div className='mt-6 flex flex-wrap justify-end gap-2'>
          <button
            className='rounded-xl border border-border bg-surface px-4 py-2 font-semibold text-foreground hover:bg-surface-subtle'
            onClick={onCancel}
            ref={cancelRef}
            type='button'
          >
            {cancelLabel}
          </button>
          <button
            className={`rounded-xl px-4 py-2 font-bold ${
              tone === 'danger'
                ? 'bg-danger text-white hover:bg-danger/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            onClick={onConfirm}
            ref={confirmRef}
            type='button'
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
