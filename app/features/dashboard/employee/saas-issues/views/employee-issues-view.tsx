import { useTranslation } from 'react-i18next'
import { MessageSquare, Plus } from 'lucide-react'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { EmployeeDataTable } from '../../shared/components/employee-data-table'
import { useSaasIssueList } from '~/shared/api/generated/operations/saas-issues/saas-issue-list'
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

export function EmployeeIssuesView({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatDate } = useDashboardFormat()
  const { page, pageSize, onPage } = useEmployeePage()
  const query = useSaasIssueList({ scope: 'mine', page, pageSize })
  return (
    <div className='space-y-6'>
      <EmployeePageHeader
        title={translate('issues')}
        icon={MessageSquare}
        actions={
          <EmployeeButton primary onClick={() => onSelectTab('report-issue')}>
            <Plus aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('reportIssue')}
          </EmployeeButton>
        }
      />
      <EmployeeSection>
        <EmployeeQueryState
          query={query}
          empty={!query.data?.data?.items.length}
          emptyTitle={translate('redesign.noIssues')}
          emptyDescription={translate('redesign.noIssuesHint')}
        />
        {!query.isError && (
          <EmployeeDataTable
            label={translate('issues')}
            items={query.data?.data?.items ?? []}
            rowKey={(issue) => issue.id}
            columns={[
              {
                key: 'software',
                label: translate('redesign.application'),
                render: (issue) => (
                  <div>
                    <p className='max-w-56 truncate font-medium' title={issue.plan.applicationName}>
                      {issue.plan.applicationName}
                    </p>
                    <p className='mt-1 max-w-56 truncate text-xs text-muted-foreground' title={issue.plan.planName}>
                      {issue.plan.planName}
                    </p>
                  </div>
                )
              },
              {
                key: 'code',
                label: translate('redesign.issueCode'),
                render: (issue) => (
                  <p className='truncate font-mono text-xs' title={issue.code}>
                    {issue.code}
                  </p>
                )
              },
              {
                key: 'due',
                label: translate('dueOn'),
                align: 'right',
                render: (issue) => formatDate(issue.responseDueOn)
              },
              { key: 'status', label: translate('state'), render: (issue) => <EmployeeStatus value={issue.state} /> }
            ]}
            onOpen={(issue) => onSelectTab('issue-detail', { id: issue.id })}
          />
        )}
        <EmployeePagination pagination={query.data?.data?.pagination} onPage={onPage} busy={query.isFetching} />
      </EmployeeSection>
    </div>
  )
}
