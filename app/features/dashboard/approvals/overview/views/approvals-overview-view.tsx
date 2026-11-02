import { useState } from 'react'
import { ClipboardCheck, Landmark } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSpendApprovalList } from '~/shared/api/generated/operations/spend-approvals/spend-approval-list'
import { useBudgetVersionList } from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import { useNotificationList } from '~/shared/api/generated/operations/notifications/notification-list'
import type { ApprovalTabKey } from '../../approvals-nav'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsPage, ApprovalsButton, ApprovalsPagination } from '../../shared/components/approvals-ui'

interface OverviewProps {
  displayName?: string
  formatCurrency?: (value: number) => string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

export function ApprovalsOverviewView({ onSelectTab }: OverviewProps) {
  const { t: translate } = useTranslation('approvalsNeed')
  const spend = useSpendApprovalList({ page: 1, pageSize: 1 })
  const budgets = useBudgetVersionList({ state: 'SENT', page: 1, pageSize: 1 })
  return (
    <ApprovalsPage title={translate('title')}>
      <div className='grid gap-4 md:grid-cols-2'>
        <section className='space-y-3 rounded-lg border border-border bg-surface p-5'>
          <ClipboardCheck aria-hidden className='size-5 text-muted-foreground' strokeWidth={1.5} />
          <h2 className='font-medium [text-wrap:balance]'>{translate('spendQueue')}</h2>
          <ApprovalsQueryState query={spend}>
            <p className='text-right font-mono text-3xl tabular-nums'>
              {spend.data?.data?.pagination.totalItems ?? translate('unknown')}
            </p>
            <ApprovalsButton onClick={() => onSelectTab('queue')}>{translate('spendQueue')}</ApprovalsButton>
          </ApprovalsQueryState>
        </section>
        <section className='space-y-3 rounded-lg border border-border bg-surface p-5'>
          <Landmark aria-hidden className='size-5 text-muted-foreground' strokeWidth={1.5} />
          <h2 className='font-medium [text-wrap:balance]'>{translate('annualBudget')}</h2>
          <ApprovalsQueryState query={budgets}>
            <p className='text-right font-mono text-3xl tabular-nums'>
              {budgets.data?.data?.pagination.totalItems ?? translate('unknown')}
            </p>
            <ApprovalsButton onClick={() => onSelectTab('annual-budget')}>{translate('annualBudget')}</ApprovalsButton>
          </ApprovalsQueryState>
        </section>
      </div>
      <AssignedNeeds onSelectTab={onSelectTab} />
    </ApprovalsPage>
  )
}

function AssignedNeeds({ onSelectTab }: Pick<OverviewProps, 'onSelectTab'>) {
  const { t: translate, i18n } = useTranslation('approvalsNeed')
  const [page, setPage] = useState(1)
  const notifications = useNotificationList({ page, pageSize: 20 })
  const seen = new Set<string>()
  const assignments = (notifications.data?.data?.items ?? []).flatMap((notification) => {
    const requestId = notification.params.requestId
    if (
      notification.code !== 'STEP_ASSIGNED' ||
      notification.params.stepKind !== 'NEED' ||
      typeof requestId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId) ||
      seen.has(requestId)
    )
      return []
    seen.add(requestId)
    return [{ requestId, createdAt: notification.createdAt }]
  })
  return (
    <section aria-labelledby='assigned-need-title' className='space-y-4'>
      <h2 id='assigned-need-title' className='text-lg font-semibold [text-wrap:balance]'>
        {translate('assignedNeeds')}
      </h2>
      <p className='max-w-3xl text-sm text-muted-foreground'>{translate('notificationScope')}</p>
      <ApprovalsQueryState query={notifications}>
        {!assignments.length && (
          <p role='status' className='rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground'>
            {translate('noAssignments')}
          </p>
        )}
        <ul className='divide-y divide-border/40'>
          {assignments.map((assignment) => (
            <li key={assignment.requestId} className='flex flex-wrap items-center justify-between gap-3 py-4'>
              <div className='min-w-0 space-y-1'>
                <p className='max-w-80 truncate text-right font-mono text-sm tabular-nums' title={assignment.requestId}>
                  {assignment.requestId}
                </p>
                <p className='text-right font-mono text-xs text-muted-foreground tabular-nums'>
                  {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
                    new Date(assignment.createdAt)
                  )}
                </p>
              </div>
              <ApprovalsButton onClick={() => onSelectTab('need', { id: assignment.requestId })}>
                {translate('openNeed')}
              </ApprovalsButton>
            </li>
          ))}
        </ul>
        <ApprovalsPagination pagination={notifications.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </section>
  )
}
