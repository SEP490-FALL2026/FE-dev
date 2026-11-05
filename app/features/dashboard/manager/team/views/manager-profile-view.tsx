import { Building2, KeyRound, ShieldCheck, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useEmployeeGet } from '~/shared/api/generated/operations/employees/employee-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerQueryState, ManagerSection, ManagerStatus } from '../../shared/components/manager-api-ui'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'

export function ManagerProfileView() {
  const { t: translate } = useTranslation('manager')
  const { t: tAuth } = useTranslation('auth')
  const { formatDate } = useDashboardFormat()

  const meQuery = useMeGet()
  const user = !meQuery.isError ? meQuery.data?.data : undefined
  const employeeId = user?.employee?.id ?? ''

  const employeeQuery = useEmployeeGet(employeeId, {
    query: {
      enabled: !!employeeId && (user?.roles?.some((r) => r === 'SUPER_ADMIN') ?? false),
      retry: false
    }
  })
  const employee = !employeeQuery.isError ? employeeQuery.data?.data : undefined

  return (
    <div className='space-y-6'>
      <ManagerPageHeader title={translate('profile.title')} icon={UserRound} />

      <ManagerQueryState query={meQuery} empty={!user} />

      {user && (
        <div className='grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]'>
          <div className='space-y-5'>
            {/* Summary Identity Card */}
            <ManagerSection>
              <div className='flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex min-w-0 items-center gap-4'>
                  <span
                    aria-hidden='true'
                    className='grid size-14 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft text-base font-bold text-primary ring-1 ring-black/10 dark:ring-white/10'
                  >
                    {user.employee.fullName
                      .split(' ')
                      .filter(Boolean)
                      .slice(-2)
                      .map((word) => word[0])
                      .join('')
                      .toUpperCase() || 'M'}
                  </span>
                  <div className='min-w-0'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <h2 className='truncate text-lg font-bold text-foreground' title={user.employee.fullName}>
                        {user.employee.fullName}
                      </h2>
                      <span className='inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary'>
                        {tAuth('roles.manager.label')}
                      </span>
                    </div>
                    <p className='mt-1 truncate text-xs text-muted-foreground font-mono'>
                      {user.employee.employeeCode} · {user.employee.jobTitle ?? translate('profile.notAssigned')}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <ManagerStatus value={employee?.workState ?? 'WORKING'} />
                </div>
              </div>
            </ManagerSection>

            {/* Official Personnel Details */}
            <ManagerSection>
              <h3 className='text-sm font-bold text-foreground border-b border-border/50 pb-3'>
                {translate('profile.officialInfo')}
              </h3>
              <dl className='mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2'>
                <div className='border-b border-border/40 pb-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('profile.email')}</dt>
                  <dd className='mt-1 truncate text-sm font-medium text-foreground' title={user.loginEmail}>
                    {user.loginEmail}
                  </dd>
                </div>

                <div className='border-b border-border/40 pb-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('profile.workEmail')}</dt>
                  <dd className='mt-1 truncate text-sm font-medium text-foreground'>
                    {employee?.workEmail ?? translate('profile.notAssigned')}
                  </dd>
                </div>

                <div className='border-b border-border/40 pb-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('profile.department')}</dt>
                  <dd className='mt-1 truncate text-sm font-medium text-foreground'>
                    {user.employee.department?.name
                      ? `${user.employee.department.code} · ${user.employee.department.name}`
                      : translate('profile.notAssigned')}
                  </dd>
                </div>

                <div className='border-b border-border/40 pb-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('profile.managerScope')}</dt>
                  <dd className='mt-1 truncate text-sm font-medium text-foreground'>
                    {user.managerScope
                      ? `${user.managerScope.departmentCode} · ${user.managerScope.departmentName}`
                      : translate('profile.notAssigned')}
                  </dd>
                </div>

                <div className='border-b border-border/40 pb-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('profile.jobTitle')}</dt>
                  <dd className='mt-1 truncate text-sm font-medium text-foreground'>
                    {user.employee.jobTitle ?? translate('profile.notAssigned')}
                  </dd>
                </div>

                <div className='border-b border-border/40 pb-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('profile.employmentType')}</dt>
                  <dd className='mt-1 text-sm font-medium text-foreground'>
                    {employee?.employmentType ? (
                      <ManagerStatus value={employee.employmentType} />
                    ) : (
                      translate('profile.notAssigned')
                    )}
                  </dd>
                </div>

                <div className='border-b border-border/40 pb-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('profile.hireDate')}</dt>
                  <dd className='mt-1 font-mono text-sm font-medium tabular-nums text-foreground'>
                    {employee?.hireDate ? formatDate(employee.hireDate) : translate('profile.notAssigned')}
                  </dd>
                </div>

                <div className='border-b border-border/40 pb-3'>
                  <dt className='text-xs text-muted-foreground'>{translate('profile.accountStatus')}</dt>
                  <dd className='mt-1 text-sm font-medium text-foreground'>
                    <ManagerStatus value={employee?.account?.status ?? 'ACTIVE'} />
                  </dd>
                </div>
              </dl>
            </ManagerSection>

            {/* Department Placement History */}
            <ManagerSection>
              <h3 className='text-sm font-bold text-foreground border-b border-border/50 pb-3'>
                {translate('profile.placementHistory')}
              </h3>
              {!employee?.placements?.length && !user.employee.department ? (
                <div className='py-6'>
                  <WorkspaceEmptyState
                    icon={Building2}
                    title={translate('profile.noPlacements')}
                    description=''
                  />
                </div>
              ) : employee?.placements?.length ? (
                <ul className='mt-4 divide-y divide-border/50 text-sm'>
                  {employee.placements.map((placement, idx) => (
                    <li
                      key={`${placement.department.id}-${placement.validFrom}-${idx}`}
                      className='flex items-center justify-between py-3'
                    >
                      <div className='flex items-center gap-3'>
                        <span
                          aria-hidden='true'
                          className='grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-surface-subtle text-muted-foreground'
                        >
                          <Building2 strokeWidth={1.5} className='size-4' />
                        </span>
                        <div>
                          <p className='font-medium text-foreground'>{placement.department.name}</p>
                          <p className='font-mono text-xs text-muted-foreground'>{placement.department.code}</p>
                        </div>
                      </div>
                      <div className='text-right font-mono text-xs tabular-nums text-muted-foreground'>
                        <span>{formatDate(placement.validFrom)}</span>
                        {' → '}
                        <span>
                          {placement.validTo ? formatDate(placement.validTo) : translate('profile.currentPlacement')}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
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
                        <p className='font-medium text-foreground'>{user.employee.department?.name}</p>
                        <p className='font-mono text-xs text-muted-foreground'>{user.employee.department?.code}</p>
                      </div>
                    </div>
                    <div className='text-right font-mono text-xs tabular-nums text-muted-foreground'>
                      <span>{translate('profile.currentPlacement')}</span>
                    </div>
                  </li>
                </ul>
              )}
            </ManagerSection>
          </div>

          {/* Right Column: Security & Role Information */}
          <div className='space-y-5'>
            <ManagerSection>
              <div className='space-y-4'>
                <div className='flex items-center gap-2.5'>
                  <span
                    aria-hidden='true'
                    className='grid size-9 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary-soft text-primary'
                  >
                    <KeyRound strokeWidth={1.5} className='size-5' />
                  </span>
                  <h3 className='font-bold text-foreground'>{translate('profile.security')}</h3>
                </div>
                <p className='text-xs leading-relaxed text-muted-foreground'>{translate('profile.securityHint')}</p>
                <Link
                  to='/change-password'
                  className='inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary'
                >
                  <KeyRound strokeWidth={1.5} className='size-4' />
                  {translate('profile.changePassword')}
                </Link>
              </div>
            </ManagerSection>

            <ManagerSection>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <ShieldCheck strokeWidth={1.5} className='size-5 text-success-ink' />
                  <h3 className='font-bold text-foreground text-xs uppercase tracking-wider'>
                    {translate('profile.roles')}
                  </h3>
                </div>
                <div className='flex flex-wrap gap-1.5'>
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className='inline-flex items-center rounded-md border border-border bg-surface-subtle px-2 py-1 font-mono text-xs font-semibold text-foreground'
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </ManagerSection>
          </div>
        </div>
      )}
    </div>
  )
}

