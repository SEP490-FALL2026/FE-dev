import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'

export function AnchoredPopover({
  anchor,
  id,
  labelId,
  onClose,
  children
}: {
  anchor: RefObject<HTMLButtonElement | null>
  id: string
  labelId: string
  onClose: () => void
  children: ReactNode
}) {
  const panel = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const position = () => {
      if (!anchor.current || !panel.current) return
      const bounds = anchor.current.getBoundingClientRect()
      const margin = 16
      const top = bounds.bottom + 12
      panel.current.style.left = `${Math.max(margin, Math.min(bounds.right - panel.current.offsetWidth, window.innerWidth - panel.current.offsetWidth - margin))}px`
      panel.current.style.top = `${top}px`
      panel.current.style.maxHeight = `${Math.max(0, window.innerHeight - top - margin)}px`
    }
    position()
    window.addEventListener('resize', position)
    window.addEventListener('scroll', position, true)
    return () => {
      window.removeEventListener('resize', position)
      window.removeEventListener('scroll', position, true)
    }
  }, [anchor])

  useEffect(() => {
    panel.current?.focus()
  }, [])

  useEffect(() => {
    const outside = (event: Event) => {
      if (
        event.target instanceof Node &&
        !panel.current?.contains(event.target) &&
        !anchor.current?.contains(event.target)
      ) {
        onClose()
      }
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onClose()
      anchor.current?.focus()
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('focusin', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('focusin', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [anchor, onClose])

  return createPortal(
    <div
      ref={panel}
      id={id}
      role='dialog'
      aria-labelledby={labelId}
      tabIndex={-1}
      className='fixed z-40 flex w-[min(36rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-xl outline-none'
    >
      {children}
    </div>,
    document.body
  )
}
