import { useTranslation } from 'react-i18next'
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
      <header className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-2xl font-semibold'>{translate('issues')}</h1>
        <EmployeeButton primary onClick={() => onSelectTab('report-issue')}>
          {translate('reportIssue')}
        </EmployeeButton>
      </header>
      <EmployeeSection title={translate('issues')}>
        <EmployeeQueryState query={query} empty={!query.data?.data?.items.length} />
        {!query.isError &&
          query.data?.data?.items.map((issue) => (
            <article
              key={issue.id}
              className='flex flex-wrap items-center justify-between gap-4 border-b border-border/40 py-4'
            >
              <div className='min-w-0'>
                <p className='truncate font-mono text-xs' title={issue.code}>
                  {issue.code}
                </p>
                <h2 className='mt-1 truncate text-sm font-semibold' title={issue.plan.applicationName}>
                  {issue.plan.applicationName} · {issue.plan.planName}
                </h2>
                <p className='mt-1 text-right font-mono text-xs tabular-nums'>
                  {translate('dueOn')}: {formatDate(issue.responseDueOn)}
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <EmployeeStatus value={issue.state} />
                <EmployeeButton onClick={() => onSelectTab('issue-detail', { id: issue.id })}>
                  {translate('open')}
                </EmployeeButton>
              </div>
            </article>
          ))}
        <EmployeePagination pagination={query.data?.data?.pagination} onPage={onPage} busy={query.isFetching} />
      </EmployeeSection>
    </div>
  )
}
