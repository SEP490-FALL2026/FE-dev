import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { EmployeeQueryState, EmployeeSection } from '../../shared/components/employee-api-ui'

export function EmployeeLiveProfile({ privacy = false }: { privacy?: boolean }) {
  const { t: translate } = useTranslation('employee')
  const query = useMeGet()
  const user = !query.isError ? query.data?.data : undefined
  if (privacy)
    return (
      <div className='space-y-6'>
        <h1 className='text-2xl font-semibold'>{translate('privacy')}</h1>
        <EmployeeSection title={translate('privacy')}>
          <p className='max-w-3xl text-sm text-muted-foreground'>{translate('privacyHint')}</p>
        </EmployeeSection>
      </div>
    )
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold'>{translate('profile')}</h1>
      <EmployeeSection title={translate('profile')}>
        <EmployeeQueryState query={query} empty={!user} />
        {user && (
          <>
            <dl className='grid gap-5 sm:grid-cols-2'>
              {[
                [translate('name'), user.employee.fullName],
                [translate('email'), user.loginEmail],
                [translate('employeeCode'), user.employee.employeeCode],
                [translate('department'), user.employee.department?.name],
                [translate('jobTitle'), user.employee.jobTitle]
              ].map(([label, value]) => (
                <div key={label} className='min-w-0'>
                  <dt className='text-xs text-muted-foreground'>{label}</dt>
                  <dd className='mt-1 truncate text-sm' title={value ?? undefined}>
                    {value ?? translate('noValue')}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              to='/change-password'
              className='inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm hover:bg-surface-subtle'
            >
              {translate('changePassword')}
            </Link>
          </>
        )}
      </EmployeeSection>
    </div>
  )
}
