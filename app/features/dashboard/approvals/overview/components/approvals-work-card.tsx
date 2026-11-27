import { ArrowRight, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

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
  const { formatNumber } = useWorkspaceFormat()
  const value = count.isPending ? (
    <span aria-hidden className='block h-8 w-14 animate-pulse rounded-md bg-surface-subtle' />
  ) : count.isError || count.total === undefined ? (
    <span className='text-sm font-normal text-muted-foreground'>{translate('overview.countUnavailable')}</span>
  ) : (
    formatNumber(count.total)
  )
  return (
    <button
      type='button'
      aria-busy={count.isPending || undefined}
      onClick={onOpen}
      className='group flex min-w-0 w-full cursor-pointer items-start gap-3 rounded-lg border border-border/70 bg-surface p-4 text-left shadow-sm transition-colors duration-150 hover:border-primary/40 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none active:border-primary/50'
    >
      <Icon aria-hidden className='mt-0.5 size-5 shrink-0 text-primary-ink' strokeWidth={1.5} />
      <span className='min-w-0 flex-1 space-y-2'>
        <span className='block text-sm font-medium text-foreground [text-wrap:balance]'>{title}</span>
        <span className='block font-mono text-2xl leading-none font-semibold text-foreground tabular-nums'>
          {value}
        </span>
        <span className='flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary'>
          {hint}
          <ArrowRight aria-hidden className='size-3.5' strokeWidth={1.5} />
        </span>
      </span>
    </button>
  )
}
