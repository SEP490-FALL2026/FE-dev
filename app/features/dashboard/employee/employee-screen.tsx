import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { EmployeeLiveOverview } from './overview/views/employee-live-overview'
import { EmployeeLiveCreateView } from './software-request/views/employee-live-create-view'
import { EmployeeLiveRequestsView } from './my-requests/views/employee-live-requests-view'
import { EmployeeLiveRequestDetail } from './my-requests/views/employee-live-request-detail'
import { EmployeeLiveAccessView } from './my-software/views/employee-live-access-view'
import { EmployeeLiveReturnDetail } from './my-software/views/employee-live-return-detail'
import { EmployeeLiveProfile } from './profile-privacy/views/employee-live-profile'
import { EmployeeHandoversView } from './handovers/views/employee-handovers-view'
import { EmployeeDepartureNotice } from './handovers/components/employee-departure-notice'
import { EmployeeIssuesView } from './saas-issues/views/employee-issues-view'
import { EmployeeReportIssue } from './saas-issues/views/employee-report-issue'
import { EmployeeIssueDetail } from './saas-issues/views/employee-issue-detail'
import { EmployeeButton, EmployeeQueryState } from './shared/components/employee-api-ui'
import { isEmployeeResourceId } from './shared/employee-identifiers'
import type { EmployeeTabKey } from './enums'

export function EmployeeScreen({
  tab,
  onSelectTab
}: {
  tab: EmployeeTabKey
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const [searchParams] = useSearchParams()
  const me = useMeGet()
  const user = me.data?.data
  if (!user || me.isError) return <EmployeeQueryState query={me} empty={!user} />
  const id = searchParams.get('id') ?? ''
  const selfServiceOnly = user.selfServiceOnly
  const restricted = selfServiceOnly && !['overview', 'handovers', 'profile', 'privacy'].includes(tab)
  if (!restricted && ['request-detail', 'issue-detail', 'return-detail'].includes(tab) && !isEmployeeResourceId(id))
    return (
      <div className='space-y-4'>
        <h1 className='text-2xl font-semibold'>{translate('errors.missing')}</h1>
        <EmployeeButton
          onClick={() =>
            onSelectTab(tab === 'issue-detail' ? 'issues' : tab === 'return-detail' ? 'my-software' : 'my-requests')
          }
        >
          {translate('back')}
        </EmployeeButton>
      </div>
    )
  let content
  if (restricted || tab === 'overview')
    content = (
      <EmployeeLiveOverview
        name={user.employee.fullName}
        departmentName={user.employee.department?.name}
        jobTitle={user.employee.jobTitle}
        selfServiceOnly={selfServiceOnly}
        onSelectTab={onSelectTab}
      />
    )
  else if (tab === 'handovers') content = <EmployeeHandoversView />
  else if (tab === 'profile') content = <EmployeeLiveProfile />
  else if (tab === 'privacy' || tab === 'data-export' || tab === 'data-usage') content = <EmployeeLiveProfile privacy />
  else if (tab === 'my-requests') content = <EmployeeLiveRequestsView onSelectTab={onSelectTab} />
  else if (tab === 'request-detail')
    content = (
      <EmployeeLiveRequestDetail
        key={id}
        id={id}
        employeeId={user.employee.id}
        onBack={() => onSelectTab('my-requests')}
      />
    )
  else if (tab === 'my-software' || tab === 'software-detail')
    content = <EmployeeLiveAccessView onSelectTab={onSelectTab} />
  else if (tab === 'return-detail')
    content = (
      <EmployeeLiveReturnDetail
        id={id}
        onBack={() => onSelectTab('my-software')}
        onHandover={() => onSelectTab('handovers')}
      />
    )
  else if (tab === 'issues') content = <EmployeeIssuesView onSelectTab={onSelectTab} />
  else if (tab === 'report-issue')
    content = (
      <EmployeeReportIssue
        onBack={() => onSelectTab('issues')}
        onCreated={(issueId) => onSelectTab('issue-detail', { id: issueId })}
      />
    )
  else if (tab === 'issue-detail')
    content = <EmployeeIssueDetail key={id} id={id} onBack={() => onSelectTab('issues')} />
  else content = <EmployeeLiveCreateView onSelectTab={onSelectTab} />
  return (
    <div className='space-y-6'>
      {selfServiceOnly && (
        <p role='status' className='rounded-md border border-warning/30 bg-warning/10 p-4 text-sm'>
          {translate('selfService')}
        </p>
      )}
      {selfServiceOnly && <EmployeeDepartureNotice />}
      {content}
    </div>
  )
}
