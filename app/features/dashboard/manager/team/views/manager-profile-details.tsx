import { useTranslation } from 'react-i18next'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useEmployeeGet } from '~/shared/api/generated/operations/employees/employee-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ManagerStatus } from '../../shared/components/manager-api-ui'

export function ManagerProfileDetails() {
  const { t } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()
  const me = useMeGet()
  const user = !me.isError ? me.data?.data : undefined
  const employeeId = user?.employee.id ?? ''
  const employeeQuery = useEmployeeGet(employeeId, {
    query: { enabled: !!employeeId && !!user?.roles.includes('SUPER_ADMIN'), retry: false }
  })
  const employee = !employeeQuery.isError ? employeeQuery.data?.data : undefined
  if (!user) return null
  const placements = employee?.placements ?? []
  return (
    <div className='space-y-5'>
      <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
        <h2 className='text-lg font-semibold'>{t('profile.officialInfo')}</h2>
        <dl className='grid gap-x-6 gap-y-4 sm:grid-cols-2'>
          <div>
            <dt className='text-xs text-muted-foreground'>{t('profile.managerScope')}</dt>
            <dd className='mt-1 text-sm font-medium'>
              {user.managerScope
                ? `${user.managerScope.departmentCode} · ${user.managerScope.departmentName}`
                : t('profile.notAssigned')}
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>{t('profile.workEmail')}</dt>
            <dd className='mt-1 text-sm font-medium'>{employee?.workEmail ?? t('profile.notAssigned')}</dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>{t('profile.employmentType')}</dt>
            <dd className='mt-1 text-sm'>
              {employee?.employmentType ? <ManagerStatus value={employee.employmentType} /> : t('profile.notAssigned')}
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>{t('profile.hireDate')}</dt>
            <dd className='mt-1 text-sm'>
              {employee?.hireDate ? formatDate(employee.hireDate) : t('profile.notAssigned')}
            </dd>
          </div>
          {employee?.account?.status && (
            <div>
              <dt className='text-xs text-muted-foreground'>{t('profile.accountStatus')}</dt>
              <dd className='mt-1 text-sm'>
                <ManagerStatus value={employee.account.status} />
              </dd>
            </div>
          )}
        </dl>
      </section>
      <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
        <h2 className='text-lg font-semibold'>{t('profile.placementHistory')}</h2>
        {placements.length ? (
          <ul className='divide-y divide-border'>
            {placements.map((placement) => (
              <li
                key={`${placement.department.id}-${placement.validFrom}`}
                className='flex flex-wrap justify-between gap-3 py-3 text-sm'
              >
                <span>
                  {placement.department.code} · {placement.department.name}
                </span>
                <span>
                  {formatDate(placement.validFrom)} {' → '}{' '}
                  {placement.validTo ? formatDate(placement.validTo) : t('profile.currentPlacement')}
                </span>
              </li>
            ))}
          </ul>
        ) : user.employee.department ? (
          <p className='text-sm'>
            {user.employee.department.code} · {user.employee.department.name} — {t('profile.currentPlacement')}
          </p>
        ) : (
          <p className='text-sm text-muted-foreground'>{t('profile.noPlacements')}</p>
        )}
      </section>
      <section className='space-y-3 rounded-lg border border-border bg-surface p-5'>
        <h2 className='text-lg font-semibold'>{t('profile.roles')}</h2>
        <div className='flex flex-wrap gap-2'>
          {user.roles.map((role) => (
            <span key={role} className='rounded-md border border-border px-2 py-1 text-xs font-medium'>
              {role}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
