import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { CreateEmployeeBodyDto, UpdateEmployeeBodyDto } from '~/shared/api/generated/model/employees'
import { useEmployeeCreate } from '~/shared/api/generated/operations/employees/employee-create'
import { useEmployeeUpdateOfficialFields } from '~/shared/api/generated/operations/employees/employee-update-official-fields'
import { getEmployeeListQueryKey } from '~/shared/api/generated/operations/employees/employee-list'
import { getEmployeeGetQueryKey, useEmployeeGet } from '~/shared/api/generated/operations/employees/employee-get'
import { getAccountCandidatesListQueryKey } from '~/shared/api/generated/operations/app-users/account-candidates-list'
import { adminButtonClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { PersonnelForm, value, type PersonnelField } from '../../shared/components/personnel-form'
import { employmentTypes } from '../enums/employment-type'
import { EmployeeDirectory } from './employee-directory'
import { AdminQueryState } from '../../shared/components/admin-query-state'

export function EmployeePanel({
  onInviteAccount,
  renderAccountDetail
}: { onInviteAccount?: () => void; renderAccountDetail?: (id: string, onClose: () => void) => ReactNode } = {}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const { t: translateAccounts } = useTranslation('adminAccounts')
  const [searchParams] = useSearchParams()
  const employeeId = searchParams.get('employeeId') ?? ''
  const location = useLocation()
  const navigate = useNavigate()
  const action = location.pathname.endsWith('/personnel/new')
    ? 'create'
    : location.pathname.endsWith('/personnel/correct')
      ? 'update'
      : null
  const mounted = useRef(true)
  const [noChanges, setNoChanges] = useState(false)
  const employeeQuery = useEmployeeGet(employeeId, {
    query: { enabled: action === 'update' && !!employeeId, retry: false }
  })
  const employee = employeeQuery.data?.data
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  const closeForm = () => {
    if (mounted.current)
      void navigate(
        employeeId && action === 'update'
          ? `/dashboard/super-admin?tab=personnel&employeeId=${encodeURIComponent(employeeId)}`
          : '/dashboard/super-admin?tab=personnel'
      )
  }
  const feedback = usePersonnelMutationFeedback(
    [
      getEmployeeListQueryKey(),
      getAccountCandidatesListQueryKey(),
      ...(employeeId ? [getEmployeeGetQueryKey(employeeId)] : [])
    ],
    closeForm
  )
  const create = useEmployeeCreate({ mutation: { ...feedback, retry: false } })
  const update = useEmployeeUpdateOfficialFields({ mutation: { ...feedback, retry: false } })
  const pending = create.isPending || update.isPending
  const fields: PersonnelField[] = [
    ...(action === 'create'
      ? [
          { name: 'employeeCode', minLength: 3, maxLength: 20, pattern: '[A-Za-z0-9]+(-[A-Za-z0-9]+)*' },
          {
            name: 'departmentCode',
            optional: true
          }
        ]
      : [
          {
            name: 'employeeId',
            fixed: true,
            initialLabel: employee ? `${employee.employeeCode} — ${employee.fullName}` : ''
          }
        ]),
    { name: 'fullName', maxLength: 200, initial: employee?.fullName },
    { name: 'workEmail', type: 'email', maxLength: 254, optional: true, initial: employee?.workEmail ?? '' },
    { name: 'employmentType', options: employmentTypes, initial: employee?.employmentType },
    { name: 'hireDate', type: 'date', initial: employee?.hireDate },
    { name: 'jobTitle', maxLength: 1000, optional: true, initial: employee?.jobTitle ?? '' }
  ]
  return (
    <section className='space-y-5'>
      {!action && (
        <>
          {!employeeId && (
            <div className='flex flex-wrap gap-3'>
              <button
                className={adminPrimaryClass}
                onClick={() => void navigate('/dashboard/super-admin/personnel/new')}
              >
                {translate('createEmployee')}
              </button>
              {onInviteAccount && (
                <button type='button' className={adminButtonClass} onClick={onInviteAccount}>
                  {translateAccounts('invite')}
                </button>
              )}
            </div>
          )}
          <EmployeeDirectory
            renderAccountDetail={renderAccountDetail}
            onCorrect={(id) =>
              void navigate(`/dashboard/super-admin/personnel/correct?employeeId=${encodeURIComponent(id)}`)
            }
          />
        </>
      )}
      {action === 'update' && !employeeId && <p role='alert'>{translate('selectEmployeeFromProfile')}</p>}
      {action === 'update' && employeeId && (employeeQuery.isPending || employeeQuery.isError) && (
        <AdminQueryState query={employeeQuery}>{null}</AdminQueryState>
      )}
      {action === 'update' && employeeId && employeeQuery.isSuccess && !employee && (
        <div role='alert' className='space-y-3'>
          <p>{translate('directory.notFound')}</p>
          <button
            type='button'
            className={adminButtonClass}
            onClick={() => void navigate('/dashboard/super-admin?tab=personnel')}
          >
            {translate('backToEmployees')}
          </button>
        </div>
      )}
      {action && (action === 'create' || employee) && (
        <PersonnelForm
          page
          title={translate(action === 'create' ? 'createEmployee' : 'updateEmployee')}
          pending={pending}
          fields={fields}
          onClose={closeForm}
          onSubmit={(values) => {
            if (pending) return
            const fullName = value(values, 'fullName')
            const employmentType = value(values, 'employmentType') as CreateEmployeeBodyDto['employmentType']
            const hireDate = value(values, 'hireDate')
            const workEmail = value(values, 'workEmail')
            const jobTitle = value(values, 'jobTitle')
            const common: UpdateEmployeeBodyDto =
              action === 'update' && employee
                ? {
                    ...(fullName !== employee.fullName ? { fullName } : {}),
                    ...(employmentType !== employee.employmentType ? { employmentType } : {}),
                    ...(hireDate !== employee.hireDate ? { hireDate } : {}),
                    ...(workEmail !== (employee.workEmail ?? '') ? { workEmail: workEmail || null } : {}),
                    ...(jobTitle !== (employee.jobTitle ?? '') ? { jobTitle: jobTitle || null } : {})
                  }
                : { ...(workEmail ? { workEmail } : {}), ...(jobTitle ? { jobTitle } : {}) }
            if (action === 'create')
              create.mutate({
                data: {
                  ...common,
                  employeeCode: value(values, 'employeeCode'),
                  ...(value(values, 'departmentCode') ? { departmentCode: value(values, 'departmentCode') } : {}),
                  fullName: value(values, 'fullName'),
                  employmentType: value(values, 'employmentType') as CreateEmployeeBodyDto['employmentType'],
                  hireDate: value(values, 'hireDate')
                }
              })
            else if (employeeId && employee) {
              if (!Object.keys(common).length) {
                setNoChanges(true)
                return
              }
              setNoChanges(false)
              update.mutate({ id: employeeId, data: common })
            }
          }}
        >
          {noChanges && (
            <p role='alert' className='text-sm text-danger'>
              {translate('noEmployeeChanges')}
            </p>
          )}
        </PersonnelForm>
      )}
    </section>
  )
}
