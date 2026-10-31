import { Laptop, Undo2 } from 'lucide-react'
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
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { EmployeeDataTable } from '../../shared/components/employee-data-table'
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
      <EmployeePageHeader
        title={translate('mySoftware')}
        description={translate('redesign.accessHint')}
        icon={Laptop}
        actions={
          <EmployeeButton primary onClick={() => onSelectTab('create-request', { mode: 'return' })}>
            <Undo2 aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('redesign.returnAction')}
          </EmployeeButton>
        }
      />
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
      <EmployeeSection title={translate('returns')}>
        <EmployeeQueryState
          query={returns}
          empty={!returns.data?.data?.items.length}
          emptyTitle={translate('redesign.noReturns')}
          emptyDescription={translate('redesign.noReturnsHint')}
        />
        {!returns.isError && (
          <EmployeeDataTable
            label={translate('returns')}
            items={returns.data?.data?.items ?? []}
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
                key: 'id',
                label: translate('requestCode'),
                render: (item) => (
                  <p className='truncate font-mono text-xs' title={item.id}>
                    {item.id}
                  </p>
                )
              },
              { key: 'status', label: translate('state'), render: (item) => <EmployeeStatus value={item.state} /> }
            ]}
            onOpen={(item) => onSelectTab('return-detail', { id: item.id })}
          />
        )}
        <EmployeePagination
          pagination={returns.data?.data?.pagination}
          onPage={returnsPage.onPage}
          busy={returns.isFetching}
        />
      </EmployeeSection>
      <p className='max-w-3xl text-sm leading-relaxed text-muted-foreground'>{translate('assignmentGap')}</p>
    </div>
  )
}
