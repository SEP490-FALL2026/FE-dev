import { useTranslation } from 'react-i18next'
import { Boxes } from 'lucide-react'
import {
  EmployeePagination,
  EmployeeQueryState,
  EmployeeSection,
  EmployeeStatus
} from '../../shared/components/employee-api-ui'
import { EmployeeDataTable } from '../../shared/components/employee-data-table'
import { useEmployeePage } from '../../shared/hooks/use-employee-page'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { EmployeeTabKey } from '../../enums'
import { useReturnRequestList } from '~/shared/api/generated/operations/return-requests/return-request-list'

export function EmployeeAccessReturns({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatDate } = useDashboardFormat()
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
                <div className='flex min-w-0 items-center gap-3'>
                  <span
                    aria-hidden='true'
                    className='grid size-9 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary-soft text-primary-ink'
                  >
                    <Boxes strokeWidth={1.5} className='size-4' />
                  </span>
                  <div className='min-w-0'>
                    <p className='max-w-64 truncate font-medium text-foreground' title={item.plan.applicationName}>
                      {item.plan.applicationName}
                    </p>
                    <p className='mt-0.5 max-w-64 truncate text-xs text-muted-foreground' title={item.plan.planName}>
                      {item.plan.planName}
                    </p>
                  </div>
                </div>
              )
            },
            { key: 'status', label: translate('state'), render: (item) => <EmployeeStatus value={item.state} /> },
            {
              key: 'requestedOn',
              label: translate('submittedAt'),
              align: 'right',
              render: (item) => (
                <span className='font-mono text-xs tabular-nums text-foreground'>
                  {formatDate(item.requestedOn)}
                </span>
              )
            }
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
