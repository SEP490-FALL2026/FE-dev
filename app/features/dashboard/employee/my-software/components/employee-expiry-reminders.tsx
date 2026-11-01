import { useTranslation } from 'react-i18next'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeePagination, EmployeeQueryState, EmployeeSection } from '../../shared/components/employee-api-ui'
import { EmployeeDataTable } from '../../shared/components/employee-data-table'
import { useEmployeePage } from '../../shared/hooks/use-employee-page'
import type { EmployeeTabKey } from '../../enums'
import { useAssignmentExpiryReminderList } from '~/shared/api/generated/operations/assignment-expiry/assignment-expiry-reminder-list'
export function EmployeeExpiryReminders({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatDate } = useDashboardFormat()
  const remindersPage = useEmployeePage()
  const reminders = useAssignmentExpiryReminderList({
    scope: 'mine',
    page: remindersPage.page,
    pageSize: remindersPage.pageSize
  })
  return (
    <EmployeeSection title={translate('expiry')}>
      <EmployeeQueryState
        query={reminders}
        empty={!reminders.data?.data?.items.length}
        emptyTitle={translate('redesign.noExpiry')}
        emptyDescription={translate('redesign.noExpiryHint')}
      />
      {!reminders.isError && (
        <EmployeeDataTable
          label={translate('expiry')}
          items={reminders.data?.data?.items ?? []}
          rowKey={(item) => item.id}
          columns={[
            {
              key: 'software',
              label: translate('redesign.application'),
              render: (item) => (
                <div>
                  <p className='max-w-64 truncate font-medium' title={item.plan.applicationName}>
                    {item.plan.applicationName}
                  </p>
                  <p className='mt-1 max-w-64 truncate text-xs text-muted-foreground' title={item.plan.planName}>
                    {item.plan.planName}
                  </p>
                </div>
              )
            },
            {
              key: 'endDate',
              label: translate('expiresOn'),
              align: 'right',
              render: (item) => formatDate(item.expectedEndDate)
            }
          ]}
          actionLabel={translate('renewal')}
          onOpen={(item) => onSelectTab('create-request', { mode: 'renewal', assignmentId: item.assignmentId })}
        />
      )}
      <EmployeePagination
        pagination={reminders.data?.data?.pagination}
        onPage={remindersPage.onPage}
        busy={reminders.isFetching}
      />
    </EmployeeSection>
  )
}
