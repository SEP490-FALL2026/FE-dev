import { ArrowLeft, Boxes, Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import { useDepartmentMemberGet } from '~/shared/api/generated/operations/departments/department-member-get'
import { useDepartmentMemberSoftwareRightList } from '~/shared/api/generated/operations/departments/department-member-software-right-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ManagerButton, ManagerSection, ManagerStatus } from '../../shared/components/manager-api-ui'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { ManagerMemberRequests } from '../components/manager-member-requests'
import { ManagerPagination, ManagerQueryState } from '../../shared/components/manager-api-ui'
import type { ManagerTabKey } from '../../manager-nav'

interface Props {
  departmentId?: string
  id: string
  onBack: () => void
  onSelectTab?: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerLiveEmployeeDetail({ departmentId, id, onBack, onSelectTab }: Props) {
  const { t: translate } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()

  // Department queries to provide official member info for Manager
  const departmentQuery = useDepartmentGet(departmentId ?? '', {
    query: { enabled: !!departmentId }
  })
  const departmentData = departmentQuery.data?.data

  const memberQuery = useDepartmentMemberGet(departmentId ?? '', id, { query: { enabled: !!departmentId } })
  const deptMember = !memberQuery.isError ? memberQuery.data?.data : null
  const paging = useManagerPage('softwarePage')
  const toolsQuery = useDepartmentMemberSoftwareRightList(
    departmentId ?? '',
    id,
    { page: paging.page, pageSize: paging.pageSize },
    { query: { enabled: !!deptMember } }
  )
  const tools = !toolsQuery.isError
    ? (toolsQuery.data?.data?.items ?? []).map((right) => ({
        assignmentId: right.assignmentId,
        application: { name: right.applicationName },
        plan: { name: right.planName },
        effectiveFrom: right.grantedOn
      }))
    : []
  const hasData = !!deptMember
  const isPending = memberQuery.isPending

  const fullName = deptMember?.fullName ?? ''
  const employeeCode = deptMember?.employeeCode ?? ''
  const initials =
    fullName
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'E'

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={onBack}
          aria-label={translate('employeeDetail.backToTeam')}
          className='grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition hover:border-primary hover:bg-surface-subtle hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary'
        >
          <ArrowLeft strokeWidth={1.5} className='size-5' />
        </button>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            {hasData ? fullName : translate('employeeDetail.title')}
          </h1>
          <p className='text-xs text-muted-foreground'>{translate('employeeDetail.subtitle')}</p>
        </div>
      </div>

      {isPending && (
        <ManagerSection>
          <p role='status' className='py-8 text-center text-sm text-muted-foreground'>
            {translate('loading')}
          </p>
        </ManagerSection>
      )}

      <ManagerQueryState query={memberQuery} />
      {!isPending && !memberQuery.isError && !hasData && (
        <ManagerSection>
          <WorkspaceEmptyState
            title={translate('employeeDetail.notFound')}
            description={translate('employeeDetail.notFoundHint')}
          />
          <div className='mt-6 flex justify-center'>
            <ManagerButton onClick={onBack}>{translate('employeeDetail.backToTeam')}</ManagerButton>
          </div>
        </ManagerSection>
      )}

      {hasData && (
        <div className='space-y-5'>
          {/* Employee Identity Summary Card */}
          <ManagerSection>
            <div className='flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex min-w-0 items-center gap-4'>
                <span
                  aria-hidden='true'
                  className='grid size-14 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft text-base font-bold text-primary ring-1 ring-black/10 dark:ring-white/10'
                >
                  {initials}
                </span>
                <div className='min-w-0'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <h2 className='truncate text-lg font-bold text-foreground' title={fullName}>
                      {fullName}
                    </h2>
                  </div>
                  <p className='mt-1 truncate font-mono text-xs text-muted-foreground'>{employeeCode}</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                {deptMember?.status ? <ManagerStatus value={deptMember.status} /> : null}
              </div>
            </div>
          </ManagerSection>

          {/* Official Personnel Details */}
          <ManagerSection>
            <h3 className='border-b border-border/50 pb-3 text-sm font-bold text-foreground'>
              {translate('employeeDetail.official')}
            </h3>
            <dl className='mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2'>
              <div className='border-b border-border/40 pb-3'>
                <dt className='text-xs text-muted-foreground'>{translate('employeeDetail.workEmail')}</dt>
                <dd className='mt-1 truncate text-sm font-medium text-foreground'>
                  {deptMember?.hasWorkEmail
                    ? translate('employeeDetail.hasWorkEmail')
                    : translate('employeeDetail.noWorkEmail')}
                </dd>
              </div>

              <div className='border-b border-border/40 pb-3'>
                <dt className='text-xs text-muted-foreground'>{translate('employeeDetail.jobTitle')}</dt>
                <dd className='mt-1 truncate text-sm font-medium text-foreground'>
                  {translate('profile.notAssigned')}
                </dd>
              </div>

              <div className='border-b border-border/40 pb-3'>
                <dt className='text-xs text-muted-foreground'>{translate('employeeDetail.department')}</dt>
                <dd className='mt-1 truncate text-sm font-medium text-foreground'>
                  {departmentData
                    ? `${departmentData.code} · ${departmentData.name}`
                    : translate('profile.notAssigned')}
                </dd>
              </div>

              <div className='border-b border-border/40 pb-3'>
                <dt className='text-xs text-muted-foreground'>{translate('employeeDetail.employmentType')}</dt>
                <dd className='mt-1 text-sm font-medium text-foreground'>
                  {deptMember?.status ? <ManagerStatus value={deptMember.status} /> : translate('profile.notAssigned')}
                </dd>
              </div>

              <div className='border-b border-border/40 pb-3'>
                <dt className='text-xs text-muted-foreground'>{translate('employeeDetail.hireDate')}</dt>
                <dd className='mt-1 font-mono text-sm font-medium tabular-nums text-foreground'>
                  {formatDate(deptMember?.memberSince ?? '')}
                </dd>
              </div>

              <div className='border-b border-border/40 pb-3'>
                <dt className='text-xs text-muted-foreground'>{translate('employeeDetail.account')}</dt>
                <dd className='mt-1 text-sm font-medium text-foreground'>
                  {deptMember?.status ? (
                    <ManagerStatus value={deptMember.status} />
                  ) : (
                    translate('employeeDetail.noAccount')
                  )}
                </dd>
              </div>
            </dl>
          </ManagerSection>

          {/* Department Placement History */}
          <ManagerSection>
            <h3 className='border-b border-border/50 pb-3 text-sm font-bold text-foreground'>
              {translate('employeeDetail.history')}
            </h3>
            <ul className='mt-4 divide-y divide-border/50 text-sm'>
              <li className='flex items-center justify-between py-3'>
                <div className='flex items-center gap-3'>
                  <span
                    aria-hidden='true'
                    className='grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-surface-subtle text-muted-foreground'
                  >
                    <Building2 strokeWidth={1.5} className='size-4' />
                  </span>
                  <div>
                    <p className='font-medium text-foreground'>
                      {departmentData?.name ?? translate('employeeDetail.department')}
                    </p>
                    <p className='font-mono text-xs text-muted-foreground'>{departmentData?.code ?? ''}</p>
                  </div>
                </div>
                <div className='text-right font-mono text-xs tabular-nums text-muted-foreground'>
                  <span>{deptMember?.memberSince ? formatDate(deptMember.memberSince) : '—'}</span>
                  {' → '}
                  <span>{translate('employeeDetail.current')}</span>
                </div>
              </li>
            </ul>
          </ManagerSection>

          {/* Assigned Tools / Software */}
          <ManagerSection>
            <div className='flex items-center justify-between border-b border-border/50 pb-3'>
              <h3 className='text-sm font-bold text-foreground'>{translate('employeeDetail.toolsTitle')}</h3>
              <span className='font-mono text-xs text-muted-foreground tabular-nums'>
                {deptMember?.heldSoftwareCount ?? 0}
              </span>
            </div>

            <ManagerQueryState query={toolsQuery} />
            {!toolsQuery.isPending && !toolsQuery.isError && tools.length === 0 && (
              <div className='py-6'>
                <WorkspaceEmptyState icon={Boxes} title={translate('employeeDetail.toolsEmpty')} description='' />
              </div>
            )}

            {!toolsQuery.isPending && tools.length > 0 && (
              <div className='mt-4 space-y-3'>
                {/* Mobile View: Card Stack */}
                <div className='space-y-3 md:hidden'>
                  {tools.map((tool) => (
                    <div
                      key={tool.assignmentId}
                      className='space-y-2 rounded-xl border border-border/70 bg-surface p-3.5 text-xs'
                    >
                      <div className='flex items-center gap-2.5'>
                        <span
                          aria-hidden='true'
                          className='grid size-7 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary-soft text-primary-ink'
                        >
                          <Boxes strokeWidth={1.5} className='size-3.5' />
                        </span>
                        {onSelectTab ? (
                          <button
                            type='button'
                            onClick={() =>
                              onSelectTab('tool-detail', {
                                id: tool.assignmentId,
                                ...(departmentId ? { departmentId } : {})
                              })
                            }
                            className='font-semibold text-foreground hover:text-primary transition-colors text-left focus-visible:outline-2 focus-visible:outline-primary truncate'
                          >
                            {tool.application.name}
                          </button>
                        ) : (
                          <span className='font-semibold text-foreground truncate'>{tool.application.name}</span>
                        )}
                      </div>
                      <p className='text-muted-foreground pl-9.5'>{tool.plan.name}</p>
                      <div className='flex justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground'>
                        <span>{translate('employeeDetail.effectiveFrom')}</span>
                        <span className='font-mono tabular-nums'>{formatDate(tool.effectiveFrom)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Table */}
                <div className='hidden overflow-hidden rounded-xl border border-border/70 md:block'>
                  <table className='w-full text-left text-sm' aria-label={translate('employeeDetail.toolsTitle')}>
                    <thead>
                      <tr className='border-b border-border/60 bg-surface-subtle text-xs text-muted-foreground'>
                        <th scope='col' className='py-2.5 px-4 font-semibold'>
                          {translate('employeeDetail.softwareName')}
                        </th>
                        <th scope='col' className='py-2.5 px-4 text-right font-semibold'>
                          {translate('employeeDetail.effectiveFrom')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-border/40 bg-surface'>
                      {tools.map((tool) => (
                        <tr key={tool.assignmentId} className='transition hover:bg-surface-subtle/50'>
                          <td className='py-3 px-4'>
                            <div className='flex items-center gap-3'>
                              <span
                                aria-hidden='true'
                                className='grid size-8 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary-soft text-primary-ink'
                              >
                                <Boxes strokeWidth={1.5} className='size-4' />
                              </span>
                              <div className='min-w-0'>
                                {onSelectTab ? (
                                  <button
                                    type='button'
                                    onClick={() =>
                                      onSelectTab('tool-detail', {
                                        id: tool.assignmentId,
                                        ...(departmentId ? { departmentId } : {})
                                      })
                                    }
                                    className='font-medium text-foreground hover:text-primary transition-colors text-left focus-visible:outline-2 focus-visible:outline-primary'
                                    title={tool.application.name}
                                  >
                                    {tool.application.name}
                                  </button>
                                ) : (
                                  <p className='font-medium text-foreground'>{tool.application.name}</p>
                                )}
                                <p className='mt-0.5 text-xs text-muted-foreground'>{tool.plan.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className='py-3 px-4 text-right font-mono text-xs tabular-nums text-muted-foreground'>
                            {formatDate(tool.effectiveFrom)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <ManagerPagination
              pagination={toolsQuery.data?.data?.pagination}
              onPage={paging.onPage}
              busy={toolsQuery.isFetching}
            />
          </ManagerSection>
          <ManagerMemberRequests departmentId={departmentId ?? ''} employeeId={id} onSelectTab={onSelectTab} />
        </div>
      )}
    </div>
  )
}
