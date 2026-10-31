import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useParams, useSearchParams } from 'react-router'
import { Boxes, Plus, UsersRound } from 'lucide-react'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import type { ManagerTabKey } from './enums'
import { isResourceId } from './shared/manager-identifiers'
import { ManagerDepartmentContext } from './shared/components/manager-department-context'
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
import { ManagerTransferReviews } from './access-review/views/manager-transfer-reviews'
import { ManagerNotices } from './personnel-notices/views/manager-notices'
import { ManagerHandovers } from './handovers/views/manager-handovers'

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
  const departmentId = params.get('departmentId') ?? ''
  const validDepartment = isResourceId(departmentId)
  const form = location.pathname.startsWith('/dashboard/manager/annual-budget/')
  const needsDepartment = form || ['overview', 'my-team', 'team-software', 'employee-detail'].includes(tab)
  // /me has no department ID. Never call the Super Admin department directory to fill that gap.
  const department = useDepartmentGet(departmentId, {
    query: { enabled: !!user && !user.selfServiceOnly && validDepartment && needsDepartment }
  })
  if (!user) return <ManagerQueryState query={me} empty={!user} syncPermissions={false} />
  if (user.selfServiceOnly || !user.roles.effective.includes('MANAGER'))
    return <p role='alert'>{translate('errors.forbidden')}</p>
  if (tab === 'notifications' || tab === 'personnel-notices') {
    const next = new URLSearchParams(params)
    next.set('tab', tab === 'notifications' ? 'overview' : 'my-team')
    next.set(tab === 'notifications' ? 'notifications' : 'section', tab === 'notifications' ? 'open' : 'changes')
    return <Navigate replace to={{ pathname: '/dashboard/manager', search: next.toString() }} />
  }
  const openRequest = (id: string) => onSelectTab('request-approval', { id })
  const id = params.get('id') ?? ''
  let content
  if (form)
    content =
      proposalId && !isResourceId(proposalId) ? (
        <p>{translate('errors.missing')}</p>
      ) : (
        <ManagerBudgetForm
          key={proposalId ?? 'new'}
          id={proposalId}
          costCenterId={!department.isError ? department.data?.data?.costCenter?.id : undefined}
        />
      )
  else if (tab === 'overview')
    content = (
      <ManagerLiveOverview
        name={user.employee.fullName}
        departmentName={user.employee.department?.name}
        departmentId={validDepartment ? departmentId : undefined}
        onSelectTab={onSelectTab}
      />
    )
  else if (tab === 'my-team' || tab === 'employee-detail') {
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
            <ManagerDepartmentContext name={user.employee.department?.name} />
            <ManagerLiveTeam departmentId={validDepartment ? departmentId : undefined} embedded />
          </>
        )}
      </div>
    )
  } else if (tab === 'team-software')
    content = (
      <div className='space-y-5'>
        <ManagerPageHeader title={translate('tools')} icon={Boxes} />
        <ManagerDepartmentContext name={user.employee.department?.name} />
        <ManagerLiveTeam departmentId={validDepartment ? departmentId : undefined} tools embedded />
      </div>
    )
  else if (tab === 'team-requests' || tab === 'my-requests')
    content = <ManagerRequestLookup history={tab === 'my-requests'} onOpen={openRequest} />
  else if (tab === 'request-approval')
    content = isResourceId(id) ? (
      <ManagerLiveRequest key={id} id={id} employeeId={user.employee.id} onBack={() => onSelectTab('team-requests')} />
    ) : (
      <ManagerRequestLookup onOpen={openRequest} />
    )
  else if (tab === 'create-employee-request')
    content = (
      <ManagerLiveCreate key={params.get('scope')} group={params.get('scope') === 'team'} onOpen={openRequest} />
    )
  else if (tab === 'weekly-batch') content = <ManagerLiveBatch onOpen={openRequest} />
  else if (tab === 'annual-budget') content = <ManagerLiveBudget />
  else if (tab === 'transfer-reviews') content = <ManagerTransferReviews />
  else if (tab === 'handovers') content = <ManagerHandovers />
  else
    content = (
      <div className='space-y-3'>
        <h1 className='text-2xl font-semibold'>{translate('unavailable')}</h1>
        <p className='text-sm text-muted-foreground'>{translate('usageGap')}</p>
      </div>
    )
  return <div className='space-y-6'>{content}</div>
}
