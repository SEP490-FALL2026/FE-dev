import { useId, useLayoutEffect, useRef, type ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { itButtonClass } from '../../shared/components/it-form'

export function DevicePage({
  title,
  backLabel,
  onBack,
  children
}: {
  title: string
  backLabel: string
  onBack: () => void
  children: ReactNode
}) {
  const titleId = useId()
  const heading = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => {
    heading.current?.focus()
  }, [])
  return (
    <section aria-labelledby={titleId} className='min-w-0 space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        <ArrowLeft aria-hidden className='size-4' />
        {backLabel}
      </button>
      <h2 id={titleId} ref={heading} tabIndex={-1} className='break-words text-xl font-semibold outline-none'>
        {title}
      </h2>
      {children}
    </section>
  )
}
