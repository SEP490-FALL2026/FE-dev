import { useTranslation } from 'react-i18next'
import { useAssignmentExpiryReminderList } from '~/shared/api/generated/operations/assignment-expiry/assignment-expiry-reminder-list'
import { useReturnRequestList } from '~/shared/api/generated/operations/return-requests/return-request-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  EmployeeButton,
  EmployeePagination,
  EmployeeQueryState,
  EmployeeSection,
  EmployeeStatus
} from '../../shared/components/employee-api-ui'
import { useEmployeePage } from '../../shared/hooks/use-employee-page'
import type { EmployeeTabKey } from '../../enums'

export function EmployeeLiveAccessView({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatDate } = useDashboardFormat()
  const remindersPage = useEmployeePage()
  const returnsPage = useEmployeePage('returnsPage')
  const reminders = useAssignmentExpiryReminderList({
    scope: 'mine',
    page: remindersPage.page,
    pageSize: remindersPage.pageSize
  })
  const returns = useReturnRequestList({ page: returnsPage.page, pageSize: returnsPage.pageSize })
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold'>{translate('mySoftware')}</h1>
      <p className='max-w-3xl text-sm text-muted-foreground'>{translate('assignmentGap')}</p>
      <EmployeeSection title={translate('expiry')}>
        <EmployeeQueryState query={reminders} empty={!reminders.data?.data?.items.length} />
        {!reminders.isError &&
          reminders.data?.data?.items.map((reminder) => (
            <article
              key={reminder.id}
              className='flex flex-wrap items-center justify-between gap-4 border-b border-border/40 py-4'
            >
              <div className='min-w-0'>
                <h3 className='truncate text-sm font-semibold' title={reminder.plan.applicationName}>
                  {reminder.plan.applicationName} · {reminder.plan.planName}
                </h3>
                <p className='mt-1 text-right font-mono text-xs tabular-nums'>
                  {translate('expiresOn')}: {formatDate(reminder.expectedEndDate)}
                </p>
              </div>
              <EmployeeButton
                onClick={() => onSelectTab('create-request', { mode: 'renewal', assignmentId: reminder.assignmentId })}
              >
                {translate('renewal')}
              </EmployeeButton>
            </article>
          ))}
        <EmployeePagination
          pagination={reminders.data?.data?.pagination}
          onPage={remindersPage.onPage}
          busy={reminders.isFetching}
        />
      </EmployeeSection>
      <EmployeeSection title={translate('returns')}>
        <EmployeeQueryState query={returns} empty={!returns.data?.data?.items.length} />
        {!returns.isError &&
          returns.data?.data?.items.map((request) => (
            <article
              key={request.id}
              className='flex flex-wrap items-center justify-between gap-4 border-b border-border/40 py-4'
            >
              <div className='min-w-0'>
                <h3 className='truncate text-sm font-semibold' title={request.plan.applicationName}>
                  {request.plan.applicationName} · {request.plan.planName}
                </h3>
                <p className='mt-1 truncate font-mono text-xs' title={request.id}>
                  {request.id}
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <EmployeeStatus value={request.state} />
                <EmployeeButton onClick={() => onSelectTab('return-detail', { id: request.id })}>
                  {translate('open')}
                </EmployeeButton>
              </div>
            </article>
          ))}
        <EmployeePagination
          pagination={returns.data?.data?.pagination}
          onPage={returnsPage.onPage}
          busy={returns.isFetching}
        />
      </EmployeeSection>
    </div>
  )
}
