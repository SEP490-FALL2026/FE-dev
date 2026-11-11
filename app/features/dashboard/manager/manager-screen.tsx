import { ManagerSubscriptionRenewals } from './subscription-renewals/views/manager-subscription-renewals'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useParams, useSearchParams } from 'react-router'
import { Boxes, Plus, UsersRound } from 'lucide-react'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import type { ManagerTabKey } from './enums'
import { isResourceId } from './shared/manager-identifiers'
import { ManagerButton, ManagerQueryState } from './shared/components/manager-api-ui'
import { ManagerPageHeader } from './shared/components/manager-page-header'
import { ManagerLiveOverview } from './overview/views/manager-live-overview'
import { ManagerLiveTeam } from './team/views/manager-live-team'
import { ManagerRequestLookup } from './team-requests/views/manager-live-request-lookup'
import { ManagerLiveRequest } from './team-requests/views/manager-live-request'
import { ManagerLiveCreate } from './team-requests/views/manager-live-create'
import { ManagerLiveBatch } from './team-requests/views/manager-live-batch'
import { ManagerLiveBudget } from './annual-budget/views/manager-live-budget'
import { ManagerBudgetForm } from './annual-budget/views/manager-budget-form'
import { ManagerNotices } from './personnel-notices/views/manager-notices'
import { ManagerReturns } from './team/views/manager-returns'
import { ManagerReturnDetail } from './team/views/manager-return-detail'
import { ManagerLiveEmployeeDetail } from './team/views/manager-live-employee-detail'
import { ManagerLiveToolDetail } from './team/views/manager-live-tool-detail'
import { ManagerProfileView } from './team/views/manager-profile-view'

export function ManagerScreen({
  tab,
  onSelectTab
}: {
  tab: ManagerTabKey
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('manager')
  const [params] = useSearchParams()
  const location = useLocation()
  const { proposalId } = useParams()
  const me = useMeGet()
  const user = !me.isError ? me.data?.data : null
  const departmentId =
    params.get('departmentId') ?? user?.managerScope?.departmentId ?? user?.upcomingUnits[0]?.departmentId ?? ''
  const upcoming = user?.upcomingUnits.find((unit) => unit.departmentId === departmentId)
  const validDepartment = isResourceId(departmentId)
  const form = location.pathname.startsWith('/dashboard/manager/annual-budget/')
  const budgetSection = form || tab === 'annual-budget'
  const needsDepartment =
    form || ['overview', 'my-team', 'team-software', 'employee-detail', 'tool-detail'].includes(tab)
  const department = useDepartmentGet(departmentId, {
    query: {
      enabled:
        !!user &&
        user.roles.includes('MANAGER') &&
        !!user.managerScope &&
        !upcoming &&
        validDepartment &&
        needsDepartment
    }
  })
  if (!user) return <ManagerQueryState query={me} empty={!user} syncPermissions={false} />
  if (!user.roles.includes('MANAGER')) return <p role='alert'>{translate('errors.forbidden')}</p>
  if (tab === 'transfer-reviews' || tab === 'handovers') {
    const next = new URLSearchParams()
    const selectedDepartmentId = params.get('departmentId')
    if (selectedDepartmentId) next.set('departmentId', selectedDepartmentId)
    return <Navigate replace to={{ pathname: '/dashboard/manager', search: next.toString() }} />
  }
  if (!user.managerScope && !budgetSection && user.upcomingUnits.length)
    return (
      <Navigate
        replace
        to={{
          pathname: '/dashboard/manager',
          search: new URLSearchParams({
            tab: 'annual-budget',
            departmentId,
            ...(upcoming?.costCenterId ? { costCenterId: upcoming.costCenterId } : {})
          }).toString()
        }}
      />
    )
  if (!user.managerScope && (!budgetSection || !upcoming)) return <p role='alert'>{translate('errors.forbidden')}</p>
  if (tab === 'notifications' || tab === 'personnel-notices') {
    const next = new URLSearchParams(params)
    next.set('tab', tab === 'notifications' ? 'overview' : 'my-team')
    next.set(tab === 'notifications' ? 'notifications' : 'section', tab === 'notifications' ? 'open' : 'changes')
    return <Navigate replace to={{ pathname: '/dashboard/manager', search: next.toString() }} />
  }
  const openRequest = (id: string) => onSelectTab('request-approval', { id })
  if (tab === 'create-employee-request' && params.get('scope') !== 'team') {
    const next = new URLSearchParams(params)
    next.set('scope', 'team')
    return <Navigate replace to={{ pathname: location.pathname, search: next.toString() }} />
  }
  const id = params.get('id') ?? ''
  const returnContext: Record<string, string> = { toolsView: 'returns' }
  for (const key of ['returnState', 'returnPage', 'departmentId']) {
    const value = params.get(key)
    if (value) returnContext[key] = value
  }
  const openReturn = (returnId: string) => onSelectTab('return-detail', { ...returnContext, id: returnId })
  let content
  if (form)
    content =
      proposalId && !isResourceId(proposalId) ? (
        <p>{translate('errors.missing')}</p>
      ) : !upcoming && (department.isPending || department.isError) ? (
        <ManagerQueryState query={department} />
      ) : (
        <ManagerBudgetForm
          key={proposalId ?? 'new'}
          id={proposalId}
          costCenterId={
            upcoming?.costCenterId ?? (!department.isError ? department.data?.data?.costCenter?.id : undefined)
          }
          costCenterName={
            upcoming?.departmentName ?? (!department.isError ? department.data?.data?.costCenter?.name : undefined)
          }
        />
      )
  else if (tab === 'overview')
    content = (
      <ManagerLiveOverview
        name={user.employee.fullName}
        departmentId={validDepartment ? departmentId : undefined}
        onSelectTab={onSelectTab}
      />
    )
  else if (tab === 'my-team') {
    const changes = params.get('section') === 'changes'
    content = (
      <div className='space-y-5'>
        <ManagerPageHeader
          title={translate('personnel')}
          icon={UsersRound}
          actions={
            !changes && (
              <ManagerButton primary onClick={() => onSelectTab('my-team', { section: 'changes', compose: 'notice' })}>
                <Plus aria-hidden strokeWidth={1.5} className='size-4' />
                {translate('reportChange')}
              </ManagerButton>
            )
          }
        />
        <nav aria-label={translate('personnel')} className='flex flex-wrap gap-1 border-b border-border/60 pb-3'>
          {(['members', 'changes'] as const).map((section) => (
            <button
              key={section}
              type='button'
              aria-pressed={changes === (section === 'changes')}
              className={`min-h-11 rounded-md px-4 text-sm font-medium transition-colors ${changes === (section === 'changes') ? 'bg-primary-soft text-primary-ink' : 'text-muted-foreground hover:bg-surface-subtle'}`}
              onClick={() => onSelectTab('my-team', { section })}
            >
              {translate(section === 'members' ? 'team' : 'notices')}
            </button>
          ))}
        </nav>
        {changes ? (
          <ManagerNotices />
        ) : (
          <>
            <ManagerLiveTeam
              departmentId={validDepartment ? departmentId : undefined}
              embedded
              onOpenMember={(member) =>
                onSelectTab('employee-detail', {
                  id: member.employeeId,
                  ...(validDepartment ? { departmentId } : {})
                })
              }
            />
          </>
        )}
      </div>
    )
  } else if (tab === 'employee-detail')
    content = isResourceId(id) ? (
      <ManagerLiveEmployeeDetail
        id={id}
        departmentId={validDepartment ? departmentId : undefined}
        onBack={() => onSelectTab('my-team', validDepartment ? { departmentId } : {})}
        onSelectTab={onSelectTab}
      />
    ) : (
      <div className='space-y-4'>
        <p>{translate('errors.missing')}</p>
        <ManagerButton onClick={() => onSelectTab('my-team', validDepartment ? { departmentId } : {})}>
          {translate('employeeDetail.backToTeam')}
        </ManagerButton>
      </div>
    )
  else if (tab === 'profile') content = <ManagerProfileView />
  else if (tab === 'team-software')
    content = (
      <div className='space-y-5'>
        <ManagerPageHeader title={translate('tools')} icon={Boxes} />
        <nav aria-label={translate('tools')} className='flex gap-2 border-b border-border/60 pb-3'>
          {(['assigned', 'returns'] as const).map((view) => (
            <button
              key={view}
              type='button'
              className='min-h-11 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary aria-pressed:bg-primary-soft aria-pressed:text-primary-ink'
              aria-pressed={(params.get('toolsView') === 'returns') === (view === 'returns')}
              onClick={() =>
                onSelectTab('team-software', { toolsView: view, ...(validDepartment ? { departmentId } : {}) })
              }
            >
              {translate(view === 'returns' ? 'integration.returns' : 'integration.assigned')}
            </button>
          ))}
        </nav>
        {params.get('toolsView') === 'returns' ? (
          <ManagerReturns onOpen={openReturn} />
        ) : (
          <>
            <ManagerLiveTeam
              departmentId={validDepartment ? departmentId : undefined}
              tools
              embedded
              onReturnCreated={openReturn}
              onOpenTool={(tool) =>
                onSelectTab('tool-detail', {
                  id: tool.assignmentId,
                  ...(validDepartment ? { departmentId } : {})
                })
              }
            />
          </>
        )}
      </div>
    )
  else if (tab === 'tool-detail')
    content = isResourceId(id) ? (
      <ManagerLiveToolDetail
        id={id}
        departmentId={validDepartment ? departmentId : undefined}
        onBack={() => onSelectTab('team-software', validDepartment ? { departmentId } : {})}
        onReturnCreated={openReturn}
        onSelectTab={onSelectTab}
      />
    ) : (
      <div className='space-y-4'>
        <p>{translate('errors.missing')}</p>
        <ManagerButton onClick={() => onSelectTab('team-software', validDepartment ? { departmentId } : {})}>
          {translate('toolDetail.backToTools')}
        </ManagerButton>
      </div>
    )
  else if (tab === 'return-detail')
    content = isResourceId(id) ? (
      <ManagerReturnDetail
        id={id}
        employeeId={user.employee.id}
        onBack={() => onSelectTab('team-software', returnContext)}
      />
    ) : (
      <p>{translate('errors.missing')}</p>
    )
  else if (tab === 'team-requests' || tab === 'my-requests')
    content = <ManagerRequestLookup history={tab === 'my-requests'} onOpen={openRequest} />
  else if (tab === 'request-approval')
    content = isResourceId(id) ? (
      <ManagerLiveRequest
        key={id}
        id={id}
        employeeId={user.employee.id}
        departmentCode={user.employee.department?.code}
        onBack={() => onSelectTab('team-requests')}
      />
    ) : (
      <ManagerRequestLookup onOpen={openRequest} />
    )
  else if (tab === 'create-employee-request') content = <ManagerLiveCreate onOpen={openRequest} />
  else if (tab === 'weekly-batch')
    content = (
      <ManagerLiveBatch
        onOpen={openRequest}
        onCreateGroup={() => onSelectTab('create-employee-request', { scope: 'team' })}
      />
    )
  else if (tab === 'subscription-renewals') content = <ManagerSubscriptionRenewals />
  else if (tab === 'annual-budget') content = <ManagerLiveBudget />
  else
    content = (
      <div className='space-y-3'>
        <h1 className='text-2xl font-semibold'>{translate('unavailable')}</h1>
        <p className='text-sm text-muted-foreground'>{translate('usageGap')}</p>
      </div>
    )
  return <div className='space-y-6'>{content}</div>
}
