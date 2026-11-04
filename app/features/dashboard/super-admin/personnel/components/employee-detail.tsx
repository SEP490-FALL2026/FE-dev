import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { EmployeeDetailResponseDtoDataAccountRolesItem } from '~/shared/api/generated/model/employees'
import { useEmployeeGet } from '~/shared/api/generated/operations/employees/employee-get'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { AdminFormDialog, adminButtonClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { PersonnelCode } from '../../shared/components/personnel-list'
import { employeeWorkStates } from '../enums/employee-work-state'
import { employmentTypes } from '../enums/employment-type'
import { EmployeePlacementForm } from './employee-placement-form'

export function EmployeeDetail({
  employeeId,
  onClose,
  onCorrect
}: {
  employeeId: string
  onClose: () => void
  onCorrect: (employeeId: string) => void
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const { t: translateAccounts } = useTranslation('adminAccounts')
  const { formatDate } = useWorkspaceFormat()
  const navigate = useNavigate()
  const query = useEmployeeGet(employeeId, { query: { retry: false } })
  const employee = query.data?.data
  const accountId = employee?.account?.id
  const [placing, setPlacing] = useState(false)
  const canPlace =
    !!employee?.unplaced &&
    employee.status === 'ACTIVE' &&
    (employee.workState === 'WORKING' || employee.workState === 'ON_LONG_LEAVE') &&
    !query.isFetching &&
    !query.isError
  if (placing && employee)
    return <EmployeePlacementForm employee={employee} blocked={!canPlace} onClose={() => setPlacing(false)} />
  return (
    <AdminFormDialog
      title={translate('directory.details')}
      wide
      pending={false}
      onClose={onClose}
      submitLabel={translate('directory.correct')}
      submitDisabled={!employee || query.isFetching || query.isError}
      onSubmit={(event) => {
        event.preventDefault()
        if (employee) onCorrect(employee.id)
      }}
    >
      <AdminQueryState query={query}>
        {!employee ? (
          <p className='text-sm text-muted-foreground'>{translate('directory.notFound')}</p>
        ) : (
          <>
            <header className='space-y-1'>
              <h3 title={employee.fullName} className='truncate text-lg font-semibold'>
                {employee.fullName}
              </h3>
              <p className='font-mono text-sm tabular-nums text-muted-foreground'>{employee.employeeCode}</p>
              <PersonnelCode code={employee.workState} values={employeeWorkStates} />
            </header>
            <section className='space-y-3'>
              <h3 className='font-medium'>{translate('directory.official')}</h3>
              <dl className='grid gap-3 text-sm sm:grid-cols-2'>
                <div>
                  <dt className='text-muted-foreground'>{translate('fields.workEmail')}</dt>
                  <dd title={employee.workEmail ?? undefined} className='mt-1 truncate'>
                    {employee.workEmail ?? translate('directory.none')}
                  </dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('fields.jobTitle')}</dt>
                  <dd title={employee.jobTitle ?? undefined} className='mt-1 truncate'>
                    {employee.jobTitle ?? translate('directory.none')}
                  </dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{translate('fields.employmentType')}</dt>
                  <dd className='mt-1'>
                    <PersonnelCode code={employee.employmentType} values={employmentTypes} plain />
                  </dd>
                </div>
                <div>
                  <dt className='text-right text-muted-foreground'>{translate('fields.hireDate')}</dt>
                  <dd className='mt-1 text-right font-mono tabular-nums'>{formatDate(employee.hireDate)}</dd>
                </div>
                <div className='sm:col-span-2'>
                  <dt className='text-muted-foreground'>{translate('directory.department')}</dt>
                  <dd title={employee.department?.name} className='mt-1 truncate'>
                    {employee.department
                      ? `${employee.department.code} · ${employee.department.name}`
                      : translate('directory.unplaced')}
                  </dd>
                </div>
              </dl>
              {canPlace && (
                <button type='button' className={adminButtonClass} onClick={() => setPlacing(true)}>
                  {translate('directory.place')}
                </button>
              )}
            </section>
            <section className='space-y-3 border-t border-border pt-4'>
              <h3 className='font-medium'>{translate('directory.account')}</h3>
              {employee.account ? (
                <>
                  <p className='text-sm'>
                    {translate(
                      employee.account.status === 'ACTIVE'
                        ? 'directory.activeAccount'
                        : employee.account.status === 'LOCKED'
                          ? 'directory.lockedAccount'
                          : 'unknown'
                    )}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {translate(
                      employee.account.activationState === 'ACTIVATED'
                        ? 'directory.activated'
                        : employee.account.activationState === 'INVITED'
                          ? 'directory.invited'
                          : 'unknown'
                    )}
                  </p>
                  <dl className='text-sm'>
                    <dt className='text-muted-foreground'>{translate('directory.roles')}</dt>
                    <dd className='mt-1'>
                      {employee.account.roles
                        .map((role) =>
                          Object.values(EmployeeDetailResponseDtoDataAccountRolesItem).includes(role)
                            ? translateAccounts(`roles.${role}`)
                            : translate('directory.unknownRole')
                        )
                        .join(', ') || translate('directory.none')}
                    </dd>
                  </dl>
                  {accountId && (
                    <button
                      type='button'
                      className={adminButtonClass}
                      onClick={() =>
                        void navigate(`/dashboard/super-admin?tab=accounts&id=${encodeURIComponent(accountId)}`)
                      }
                    >
                      {translate('directory.openAccount')}
                    </button>
                  )}
                </>
              ) : (
                <p className='text-sm text-muted-foreground'>{translate('directory.noAccount')}</p>
              )}
            </section>
            <section className='space-y-3 border-t border-border pt-4'>
              <h3 className='font-medium'>{translate('directory.history')}</h3>
              {!employee.placements.length ? (
                <p className='text-sm text-muted-foreground'>{translate('directory.historyEmpty')}</p>
              ) : (
                <ul className='divide-y divide-border/60'>
                  {employee.placements.map((placement) => (
                    <li key={`${placement.department.id}-${placement.validFrom}`} className='grid gap-1 py-3 text-sm'>
                      <p title={placement.department.name} className='truncate font-medium'>
                        {placement.department.name}
                      </p>
                      <p className='text-right font-mono text-xs tabular-nums text-muted-foreground'>
                        {formatDate(placement.validFrom)}
                        {' → '}
                        {placement.validTo ? formatDate(placement.validTo) : translate('directory.current')}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              {employee.placementsHasMore && (
                <p className='text-xs text-muted-foreground'>{translate('directory.historyMore')}</p>
              )}
            </section>
          </>
        )}
      </AdminQueryState>
    </AdminFormDialog>
  )
}
