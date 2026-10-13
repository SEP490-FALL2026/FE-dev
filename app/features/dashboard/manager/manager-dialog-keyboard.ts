import type { KeyboardEvent } from 'react'

export function handleManagerDialogKeyDown(event: KeyboardEvent<HTMLDivElement>, onClose: () => void) {
  if (event.key === 'Escape') {
    event.preventDefault()
    onClose()
    return
  }

  if (event.key !== 'Tab') return

  const controls = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not(:disabled), textarea:not(:disabled), input:not(:disabled)'
    )
  )
  const first = controls[0]
  const last = controls.at(-1)
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
