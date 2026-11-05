import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionRenewalSeatRanking } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-seat-ranking'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsEmpty, ApprovalsPagination, ApprovalsSection } from '../../shared/components/approvals-ui'
import { USAGE_STATUS } from '../enums/usage-status'

const PAGE_SIZE = 20

export interface SeatSelection {
  selected: readonly string[]
  /** Exactly this many seats must be chosen; more cannot be ticked. */
  required: number
  disabled: boolean
  onToggle: (assignmentId: string) => void
}

/** Ranked seats in use. With a selection the approver picks the seats to take back; the order is a suggestion only. */
export function RenewalSeatRanking({ renewalId, selection }: { renewalId: string; selection?: SeatSelection }) {
  const { t: translate } = useTranslation('approvalsRenewal')
  const { formatDate, formatNumber } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const query = useSubscriptionRenewalSeatRanking(renewalId, { page, pageSize: PAGE_SIZE })
  const data = query.data?.data
  const items = data?.items ?? []
  const limitReached = selection ? selection.selected.length >= selection.required : false

  return (
    <ApprovalsSection title={translate('ranking.title')}>
      <p className='text-sm text-muted-foreground [text-wrap:pretty]'>{translate('ranking.hint')}</p>
      <ApprovalsQueryState query={query}>
        {data?.usage.status === USAGE_STATUS.NOT_AVAILABLE && (
          <p className='text-sm text-warning-ink'>{translate('ranking.orderOnly')}</p>
        )}
        {items.length === 0 ? (
          <ApprovalsEmpty message={translate('ranking.empty')} />
        ) : (
          <ol className='divide-y divide-border/50 overflow-hidden rounded-lg border border-border/70 bg-surface'>
            {items.map((seat) => {
              const checked = selection?.selected.includes(seat.assignmentId) ?? false
              return (
                <li
                  key={seat.assignmentId}
                  className='flex flex-wrap items-center gap-4 p-4 hover:bg-surface-subtle/50'
                >
                  {selection && (
                    <input
                      type='checkbox'
                      className='size-5 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed'
                      aria-label={translate('ranking.select', { name: seat.employee.fullName })}
                      checked={checked}
                      disabled={selection.disabled || (!checked && limitReached)}
                      onChange={() => selection.onToggle(seat.assignmentId)}
                    />
                  )}
                  <span className='w-8 shrink-0 text-right font-mono text-sm tabular-nums text-muted-foreground'>
                    {formatNumber(seat.position)}
                  </span>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium' title={seat.employee.fullName}>
                      {seat.employee.fullName}
                      <span className='ml-2 font-mono text-xs text-muted-foreground'>{seat.employee.employeeCode}</span>
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {translate(`values.group.${seat.group}`, { defaultValue: translate('unknown') })}
                    </p>
                  </div>
                  <dl className='grid grid-cols-[auto_auto] gap-x-4 text-xs'>
                    <dt className='text-muted-foreground'>{translate('ranking.validFrom')}</dt>
                    <dd className='text-right font-mono tabular-nums'>{formatDate(seat.validFrom)}</dd>
                    <dt className='text-muted-foreground'>{translate('ranking.lastActivity')}</dt>
                    <dd className='text-right font-mono tabular-nums'>
                      {seat.lastActivityOn ? formatDate(seat.lastActivityOn) : translate('ranking.noActivity')}
                    </dd>
                  </dl>
                </li>
              )
            })}
          </ol>
        )}
        <ApprovalsPagination pagination={data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </ApprovalsSection>
  )
}
