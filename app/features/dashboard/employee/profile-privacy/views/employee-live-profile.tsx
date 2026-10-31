import { KeyRound, ShieldCheck, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'
import { EmployeeQueryState, EmployeeSection } from '../../shared/components/employee-api-ui'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'

export function EmployeeLiveProfile({ privacy = false }: { privacy?: boolean }) {
  const { t: translate } = useTranslation('employee')
  const query = useMeGet()
  const user = !query.isError ? query.data?.data : undefined
  return (
    <div className='space-y-6'>
      <EmployeePageHeader title={translate(privacy ? 'privacy' : 'profile')} icon={privacy ? ShieldCheck : UserRound} />
      <div className='grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]'>
        {privacy ? (
          <EmployeeSection title={translate('redesign.dataAvailability')}>
            <WorkspaceEmptyState
              icon={ShieldCheck}
              title={translate('redesign.privacyUnavailable')}
              description={translate('redesign.privacyUnavailableHint')}
            />
          </EmployeeSection>
        ) : (
          <EmployeeSection title={translate('redesign.profileDetails')}>
            <EmployeeQueryState query={query} empty={!user} />
            {user && (
              <>
                <div className='flex min-w-0 items-center gap-4 border-b border-border/50 pb-5'>
                  <span
                    aria-hidden
                    className='grid size-14 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary-soft text-primary-ink'
                  >
                    <UserRound strokeWidth={1.5} className='size-7' />
                  </span>
                  <div className='min-w-0'>
                    <h2 className='truncate text-lg font-semibold' title={user.employee.fullName}>
                      {user.employee.fullName}
                    </h2>
                    <p
                      className='mt-1 truncate text-sm text-muted-foreground'
                      title={user.employee.jobTitle ?? undefined}
                    >
                      {user.employee.jobTitle ?? translate('noValue')}
                    </p>
                  </div>
                </div>
                <dl className='grid gap-x-6 gap-y-5 sm:grid-cols-2'>
                  {[
                    [translate('name'), user.employee.fullName],
                    [translate('email'), user.loginEmail],
                    [translate('employeeCode'), user.employee.employeeCode],
                    [translate('department'), user.employee.department?.name],
                    [translate('jobTitle'), user.employee.jobTitle]
                  ].map(([label, value]) => (
                    <div key={label} className='min-w-0 border-b border-border/40 pb-4'>
                      <dt className='text-xs text-muted-foreground'>{label}</dt>
                      <dd className='mt-2 truncate text-sm font-medium' title={value ?? undefined}>
                        {value ?? translate('noValue')}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </EmployeeSection>
        )}
        <EmployeeSection title={translate('redesign.security')}>
          <KeyRound aria-hidden strokeWidth={1.5} className='size-6 text-primary-ink' />
          <p className='text-sm leading-relaxed text-muted-foreground'>{translate('redesign.securityHint')}</p>
          <Link
            to='/change-password'
            className='inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
          >
            {translate('changePassword')}
          </Link>
        </EmployeeSection>
      </div>
    </div>
  )
}
