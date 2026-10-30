import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { CreateEmployeeBodyDto, UpdateEmployeeBodyDto } from '~/shared/api/generated/model/employees'
import { useEmployeeCreate } from '~/shared/api/generated/operations/employees/employee-create'
import { useEmployeeUpdateOfficialFields } from '~/shared/api/generated/operations/employees/employee-update-official-fields'
import {
  useDepartmentMemberList,
  getDepartmentMemberListQueryKey
} from '~/shared/api/generated/operations/departments/department-member-list'
import { getAccountCandidatesListQueryKey } from '~/shared/api/generated/operations/app-users/account-candidates-list'
import { AdminField, adminButtonClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { PersonnelForm, readBasis, value, type PersonnelField } from '../../shared/components/personnel-form'
import { DepartmentLookup } from '../../shared/components/department-lookup'
import { PersonnelCard, PersonnelCode, PersonnelList } from '../../shared/components/personnel-list'
import { employeeStatuses } from '../enums/employee-status'
import { employmentTypes } from '../enums/employment-type'
import { employeeWorkStates } from '../enums/employee-work-state'

export function EmployeePanel() {
  const { t: translate } = useTranslation('adminPersonnel')
  const [departmentId, setDepartmentId] = useState('')
  const [page, setPage] = useState(1)
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
  const query = useDepartmentMemberList(
    departmentId,
    { page, pageSize: 20 },
    { query: { enabled: Boolean(departmentId) } }
  )
  const feedback = usePersonnelMutationFeedback(
    [getDepartmentMemberListQueryKey(departmentId), getAccountCandidatesListQueryKey()],
    closeForm
  )
  const create = useEmployeeCreate({ mutation: { ...feedback, retry: false } })
  const update = useEmployeeUpdateOfficialFields({ mutation: { ...feedback, retry: false } })
  const pending = create.isPending || update.isPending
  const fields: PersonnelField[] = [
    ...(action === 'create'
      ? [
          { name: 'employeeCode', maxLength: 50 },
          { name: 'departmentCode', maxLength: 50, optional: true }
        ]
      : [{ name: 'employeeId', type: 'uuid' as const }]),
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
  const data = query.data?.data
  return (
    <section className='space-y-5'>
      {!action && (
        <>
          <div className='flex flex-wrap gap-3'>
            <button className={adminPrimaryClass} onClick={() => void navigate('/dashboard/super-admin/personnel/new')}>
              {translate('createEmployee')}
            </button>
            <button
              className={adminButtonClass}
              onClick={() => void navigate('/dashboard/super-admin/personnel/correct')}
            >
              {translate('updateEmployee')}
            </button>
          </div>
          <p className='text-sm text-muted-foreground'>{translate('memberHelp')}</p>
          <form
            className='flex flex-wrap items-end gap-3'
            onSubmit={(event) => {
              event.preventDefault()
              setDepartmentId(value(new FormData(event.currentTarget), 'departmentId'))
              setPage(1)
            }}
          >
            <AdminField label={translate('fields.departmentId')}>
              <DepartmentLookup name='departmentId' />
            </AdminField>
            <button className={adminButtonClass}>{translate('searchMembers')}</button>
          </form>
          {departmentId && (
            <AdminQueryState query={query}>
              <PersonnelList empty={!data?.items.length}>
                {data?.items.map((member) => (
                  <PersonnelCard key={member.employeeCode} title={member.fullName}>
                    <p className='font-mono'>{member.employeeCode}</p>
                    <PersonnelCode code={member.status} values={employeeStatuses} />
                    <PersonnelCode code={member.workState} values={employeeWorkStates} plain />
                  </PersonnelCard>
                ))}
              </PersonnelList>
              <AdminPagination pagination={data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
            </AdminQueryState>
          )}
        </>
      )}
      {action && (
        <PersonnelForm
          title={translate(action === 'create' ? 'createEmployee' : 'updateEmployee')}
          pending={pending}
          fields={fields}
          basis
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
                  : {}),
              hrBasis: readBasis(values)
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
