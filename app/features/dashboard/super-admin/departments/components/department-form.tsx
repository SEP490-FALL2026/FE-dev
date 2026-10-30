import { useTranslation } from 'react-i18next'
import type { DepartmentResponseDtoData } from '~/shared/api/generated/model'
import {
  getDepartmentListQueryKey,
  getDepartmentGetQueryKey,
  useDepartmentCreate,
  useDepartmentUpdate
} from '~/shared/api/generated/operations/departments'
import { AdminField, AdminFormDialog, adminInputClass } from '../../shared/components/admin-form'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { HrBasisFields, readHrBasis } from './hr-basis-fields'
import { EmployeePicker } from './employee-picker'
import { organizationSummaryQueryKeys } from '../hooks/organization-query-keys'

export function DepartmentForm({
  department,
  onClose
}: {
  department?: NonNullable<DepartmentResponseDtoData>
  onClose: () => void
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const feedback = useAdminMutationFeedback(
    [
      ...organizationSummaryQueryKeys,
      getDepartmentListQueryKey(),
      ...(department ? [getDepartmentGetQueryKey(department.id)] : [])
    ],
    onClose
  )
  const create = useDepartmentCreate({ mutation: { ...feedback, retry: false } })
  const update = useDepartmentUpdate({ mutation: { ...feedback, retry: false } })
  return (
    <AdminFormDialog
      wide
      title={translate(department ? 'editDepartment' : 'createDepartment')}
      onClose={onClose}
      pending={create.isPending || update.isPending}
      onSubmit={(event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        const data = {
          name: String(form.get('name')).trim(),
          function: String(form.get('function') ?? '').trim() || null,
          itAdminEmployeeId: String(form.get('itAdminEmployeeId') ?? '').trim() || null,
          hrBasis: readHrBasis(form)
        }
        if (department) update.mutate({ id: department.id, data })
        else create.mutate({ data: { ...data, code: String(form.get('code')).trim() } })
      }}
    >
      <section className='grid gap-4'>
        <h3 className='font-semibold'>{translate('departmentDetails')}</h3>
        {!department && (
          <AdminField label={translate('code')}>
            <input
              required
              name='code'
              className={adminInputClass}
              maxLength={50}
              pattern='[A-Za-z0-9][A-Za-z0-9._-]*'
            />
          </AdminField>
        )}
        <AdminField label={translate('name')}>
          <input
            required
            name='name'
            className={adminInputClass}
            maxLength={1000}
            pattern='.*\S.*'
            defaultValue={department?.name}
          />
        </AdminField>
        <AdminField label={translate('function')}>
          <textarea
            name='function'
            className={adminInputClass}
            maxLength={5000}
            defaultValue={department?.function ?? ''}
          />
        </AdminField>
        <EmployeePicker name='itAdminEmployeeId' itAdmin optional initialId={department?.itAdmin?.employeeId} />
      </section>
      <HrBasisFields />
    </AdminFormDialog>
  )
}
