import { useTranslation } from 'react-i18next'
import { useDepartmentMemberOpenRequestList } from '~/shared/api/generated/operations/departments/department-member-open-request-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { ManagerTabKey } from '../../enums'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import {
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'

export function ManagerMemberRequests({
  departmentId,
  employeeId,
  onSelectTab
}: {
  departmentId: string
  employeeId: string
  onSelectTab?: (tab: ManagerTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('manager')
  const { formatDateTime } = useDashboardFormat()
  const paging = useManagerPage('memberRequestPage')
  const query = useDepartmentMemberOpenRequestList(departmentId, employeeId, {
    page: paging.page,
    pageSize: paging.pageSize
  })
  return (
    <ManagerSection title={translate('requests')}>
      <ManagerQueryState query={query} empty={!query.data?.data?.items.length} />
      {!query.isError && (
        <ManagerDataTable
          label={translate('requests')}
          items={query.data?.data?.items ?? []}
          rowKey={(item) => item.requestId}
          onOpen={onSelectTab ? (item) => onSelectTab('request-approval', { id: item.requestId }) : undefined}
          columns={[
            {
              key: 'application',
              label: translate('application'),
              render: (item) => item.applicationName ?? translate('unavailable')
            },
            { key: 'state', label: translate('status'), render: (item) => <ManagerStatus value={item.state} /> },
            {
              key: 'submitted',
              label: translate('submittedAt'),
              align: 'right',
              render: (item) => formatDateTime(item.submittedAt)
            }
          ]}
        />
      )}
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </ManagerSection>
  )
}
