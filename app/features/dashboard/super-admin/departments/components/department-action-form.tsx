import { useTranslation } from 'react-i18next'
import type { DepartmentResponseDtoData } from '~/shared/api/generated/model'
import {
  getDepartmentListQueryKey,
  getDepartmentGetQueryKey,
  useDepartmentDeactivate,
  useDepartmentHeadAssign,
  useDepartmentHeadVacate,
  useDepartmentSuccessorDesignate,
  useDepartmentSuccessorClear
} from '~/shared/api/generated/operations/departments'
import { AdminField, AdminFormDialog, adminInputClass } from '../../shared/components/admin-form'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { HrBasisFields, readHrBasis } from './hr-basis-fields'
import { EmployeePicker } from './employee-picker'
import { organizationSummaryQueryKeys } from '../hooks/organization-query-keys'

export type DepartmentAction = 'deactivate' | 'assignHead' | 'vacateHead' | 'designateSuccessor' | 'clearSuccessor'
export function DepartmentActionForm({
  department,
  action,
  onClose
}: {
  department: NonNullable<DepartmentResponseDtoData>
  action: DepartmentAction
  onClose: () => void
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const feedback = useAdminMutationFeedback(
    [...organizationSummaryQueryKeys, getDepartmentListQueryKey(), getDepartmentGetQueryKey(department.id)],
    onClose
  )
  const options = { mutation: { ...feedback, retry: false } }
  const deactivate = useDepartmentDeactivate(options)
  const assign = useDepartmentHeadAssign(options)
  const vacate = useDepartmentHeadVacate(options)
  const designate = useDepartmentSuccessorDesignate(options)
  const clear = useDepartmentSuccessorClear(options)
  const pending = [deactivate, assign, vacate, designate, clear].some((mutation) => mutation.isPending)
  const person = action === 'assignHead' || action === 'designateSuccessor'
  const dated = person || action === 'vacateHead'
  const minimum = new Date()
  if (action === 'designateSuccessor') minimum.setDate(minimum.getDate() + 1)
  const minimumDate = [
    minimum.getFullYear(),
    String(minimum.getMonth() + 1).padStart(2, '0'),
    String(minimum.getDate()).padStart(2, '0')
  ].join('-')
  return (
    <AdminFormDialog
      wide={person}
      danger={action === 'deactivate'}
      title={translate(`actions.${action}`)}
      onClose={onClose}
      pending={pending}
      onSubmit={(event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        const common = { id: department.id, data: { hrBasis: readHrBasis(form) } }
        const datedData = { ...common.data, effectiveFrom: String(form.get('effectiveFrom')) }
        const employeeData = { ...datedData, employeeId: String(form.get('employeeId')).trim() }
        if (action === 'deactivate') deactivate.mutate(common)
        else if (action === 'clearSuccessor') clear.mutate(common)
        else if (action === 'vacateHead') vacate.mutate({ id: department.id, data: datedData })
        else if (action === 'assignHead') assign.mutate({ id: department.id, data: employeeData })
        else designate.mutate({ id: department.id, data: employeeData })
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate(`actionHelp.${action}`)}</p>
      {person && <EmployeePicker name='employeeId' />}
      {dated && (
        <AdminField label={translate('effectiveFrom')}>
          <input className={adminInputClass} required name='effectiveFrom' type='date' min={minimumDate} />
        </AdminField>
      )}
      <HrBasisFields />
    </AdminFormDialog>
  )
}
