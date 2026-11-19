import { useTranslation } from 'react-i18next'
import type { ApprovalListResponseDtoDataItemsItem } from '~/shared/api/generated/model/spend-approvals/approvalListResponseDtoDataItemsItem'
import { formatMoney } from '~/shared/lib/money'
import { useDashboardFormat } from '../../../dashboard-ui'

/** The requests closest to their deadline, oldest deadline first; a past date is marked as overdue. */
export function DueSoonList({
  items,
  today,
  onOpen
}: {
  items: readonly ApprovalListResponseDtoDataItemsItem[]
  today: string
  onOpen: (item: ApprovalListResponseDtoDataItemsItem) => void
}) {
  const { t: translate, i18n } = useTranslation('approvalsNeed')
  const { formatDate } = useDashboardFormat()
  return (
    <ul className='-mx-2 divide-y divide-border/40'>
      {items.map((item) => {
        const name = item.plan?.applicationName ?? item.softwareName ?? translate('unknown')
        const overdue = item.dueOn.slice(0, 10) < today
        return (
          <li key={item.stepId}>
            <button
              type='button'
              onClick={() => onOpen(item)}
              className='flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none'
            >
              <span className='min-w-0'>
                <span className='block truncate text-sm text-foreground' title={name}>
                  {name}
                </span>
                <span className='block truncate text-xs text-muted-foreground' title={item.requester.fullName}>
                  {item.requester.fullName} · {item.costCenter.code}
                </span>
              </span>
              <span className='shrink-0 text-right'>
                <span className='block font-mono text-sm tabular-nums'>
                  {item.amount ? formatMoney(item.amount, i18n.language) : translate('unknown')}
                </span>
                <span
                  className={`block font-mono text-xs tabular-nums ${overdue ? 'text-danger-ink' : 'text-muted-foreground'}`}
                >
                  {overdue ? translate('insights.overdueOn', { date: formatDate(item.dueOn) }) : formatDate(item.dueOn)}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
