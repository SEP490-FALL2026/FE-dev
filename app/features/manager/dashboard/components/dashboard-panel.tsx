import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export function DashboardPanel({
  title,
  icon: Icon,
  children,
  details,
  action = 'viewDetails'
}: {
  title: string
  icon: LucideIcon
  children: ReactNode
  details: ReactNode
  action?: 'viewDetails' | 'viewAll'
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const id = useId()
  return (
    <section
      className='min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs'
      aria-labelledby={`${id}-title`}
    >
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3'>
        <div className='flex min-w-0 items-center gap-2.5'>
          <span className='rounded-lg bg-brand-100 p-1.5 text-brand-500'>
            <Icon size={16} aria-hidden='true' />
          </span>
          <h2 id={`${id}-title`} className='text-sm font-semibold'>
            {title}
          </h2>
        </div>
        <button
          type='button'
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded(!expanded)}
          className='flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline focus-visible:outline-2 focus-visible:outline-brand-500'
        >
          {t(`manager.${expanded ? 'hideDetails' : action}`)}
          <ArrowRight size={13} aria-hidden='true' />
        </button>
      </div>
      {children}
      <div
        id={id}
        hidden={!expanded}
        className='mt-4 overflow-x-auto border-t border-neutral-200 pt-4 text-xs text-neutral-500'
      >
        {details}
      </div>
    </section>
  )
}
