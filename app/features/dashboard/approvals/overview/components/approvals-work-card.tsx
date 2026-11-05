import { ArrowRight, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface WorkCount {
  isPending: boolean
  isError: boolean
  total?: number
}

/** A whole-card link to a work queue; the count is always the server total, never a page length. */
export function ApprovalsWorkCard({
  icon: Icon,
  title,
  hint,
  count,
  onOpen
}: {
  icon: LucideIcon
  title: string
  hint: string
  count: WorkCount
  onOpen: () => void
}) {
  const { t: translate } = useTranslation('approvalsNeed')
  const value = count.isPending ? (
    <span aria-hidden className='block h-8 w-14 animate-pulse rounded-md bg-surface-subtle' />
  ) : count.isError || count.total === undefined ? (
    <span className='text-sm font-normal text-muted-foreground'>{translate('overview.countUnavailable')}</span>
  ) : (
    count.total
  )
  return (
    <button
      type='button'
      aria-busy={count.isPending || undefined}
      onClick={onOpen}
      className='group flex min-h-40 w-full cursor-pointer flex-col justify-between gap-4 rounded-lg border border-border/70 bg-surface p-5 text-left shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-150 hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none active:border-primary/50'
    >
      <span className='flex items-start justify-between gap-3'>
        <span className='grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft text-primary-ink'>
          <Icon aria-hidden className='size-5' strokeWidth={1.5} />
        </span>
        <span className='font-mono text-3xl leading-none font-semibold text-foreground tabular-nums'>{value}</span>
      </span>
      <span className='space-y-1'>
        <span className='block text-sm font-medium text-foreground [text-wrap:balance]'>{title}</span>
        <span className='flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary'>
          {hint}
          <ArrowRight aria-hidden className='size-3.5' strokeWidth={1.5} />
        </span>
      </span>
    </button>
  )
}
