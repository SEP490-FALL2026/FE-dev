import { useTranslation } from 'react-i18next'
import {
  EmployeePagination,
  EmployeeQueryState,
  EmployeeSection,
  EmployeeStatus
} from '../../shared/components/employee-api-ui'
import { EmployeeDataTable } from '../../shared/components/employee-data-table'
import { useEmployeePage } from '../../shared/hooks/use-employee-page'
import type { EmployeeTabKey } from '../../enums'
import { useReturnRequestList } from '~/shared/api/generated/operations/return-requests/return-request-list'
export function EmployeeAccessReturns({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const returnsPage = useEmployeePage('returnsPage')
  const returns = useReturnRequestList({ page: returnsPage.page, pageSize: returnsPage.pageSize })
  return (
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
  )
}
