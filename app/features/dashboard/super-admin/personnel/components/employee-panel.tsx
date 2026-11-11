import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { CreateEmployeeBodyDto, UpdateEmployeeBodyDto } from '~/shared/api/generated/model/employees'
import { useEmployeeCreate } from '~/shared/api/generated/operations/employees/employee-create'
import { useEmployeeUpdateOfficialFields } from '~/shared/api/generated/operations/employees/employee-update-official-fields'
import { getEmployeeListQueryKey } from '~/shared/api/generated/operations/employees/employee-list'
import { getEmployeeGetQueryKey } from '~/shared/api/generated/operations/employees/employee-get'
import { getAccountCandidatesListQueryKey } from '~/shared/api/generated/operations/app-users/account-candidates-list'
import { adminButtonClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { PersonnelForm, value, type PersonnelField } from '../../shared/components/personnel-form'
import { employmentTypes } from '../enums/employment-type'
import { EmployeeDirectory } from './employee-directory'

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
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  const closeForm = () => {
    if (mounted.current) void navigate('/dashboard/super-admin?tab=personnel')
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
      : [{ name: 'employeeId', type: 'uuid' as const, initial: employeeId }]),
    { name: 'fullName', maxLength: 200, optional: action === 'update' },
    { name: 'workEmail', type: 'email', maxLength: 254, optional: true },
    { name: 'employmentType', options: employmentTypes, optional: action === 'update' },
    { name: 'hireDate', type: 'date', optional: action === 'update' },
    { name: 'jobTitle', maxLength: 1000, optional: true },
    ...(action === 'update'
      ? [
          { name: 'clearWorkEmail', type: 'checkbox' as const, optional: true },
          { name: 'clearJobTitle', type: 'checkbox' as const, optional: true }
        ]
      : [])
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
              <button
                className={adminButtonClass}
                onClick={() => void navigate('/dashboard/super-admin/personnel/correct')}
              >
                {translate('updateEmployee')}
              </button>
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
      {action && (
        <PersonnelForm
          title={translate(action === 'create' ? 'createEmployee' : 'updateEmployee')}
          pending={pending}
          fields={fields}
          onClose={closeForm}
          onSubmit={(values) => {
            if (pending) return
            const common: UpdateEmployeeBodyDto = {
              ...(value(values, 'fullName') ? { fullName: value(values, 'fullName') } : {}),
              ...(value(values, 'employmentType')
                ? { employmentType: value(values, 'employmentType') as CreateEmployeeBodyDto['employmentType'] }
                : {}),
              ...(value(values, 'hireDate') ? { hireDate: value(values, 'hireDate') } : {}),
              ...(values.get('clearWorkEmail')
                ? { workEmail: null }
                : value(values, 'workEmail')
                  ? { workEmail: value(values, 'workEmail') }
                  : {}),
              ...(values.get('clearJobTitle')
                ? { jobTitle: null }
                : value(values, 'jobTitle')
                  ? { jobTitle: value(values, 'jobTitle') }
                  : {})
            }
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
            else update.mutate({ id: value(values, 'employeeId'), data: common })
          }}
        />
      )}
    </section>
  )
}
