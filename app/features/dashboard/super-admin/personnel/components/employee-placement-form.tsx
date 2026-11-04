import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { EmployeeDetailResponseDtoData } from '~/shared/api/generated/model/employees'
import { useEmployeeFirstPlacement } from '~/shared/api/generated/operations/employees/employee-first-placement'
import { getEmployeeListQueryKey } from '~/shared/api/generated/operations/employees/employee-list'
import { getEmployeeGetQueryKey } from '~/shared/api/generated/operations/employees/employee-get'
import { AdminField, AdminFormDialog, adminInputClass } from '../../shared/components/admin-form'
import { DepartmentLookup } from '../../shared/components/department-lookup'
import { value } from '../../shared/components/personnel-form'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { getAdminError } from '../../shared/hooks/admin-errors'

export function EmployeePlacementForm({
  employee,
  blocked,
  onClose
}: {
  employee: NonNullable<EmployeeDetailResponseDtoData>
  blocked: boolean
  onClose: () => void
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const [dateError, setDateError] = useState(false)
  const today = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())
  const minimumDate = employee.hireDate > today ? employee.hireDate : today
  const dateErrorId = useId()
  const feedback = usePersonnelMutationFeedback(
    [getEmployeeListQueryKey(), getEmployeeGetQueryKey(employee.id)],
    onClose
  )
  const mutation = useEmployeeFirstPlacement({
    mutation: {
      ...feedback,
      retry: false,
      onError: async (error) => {
        await feedback.onError(error)
        const failure = getAdminError(error)
        if (failure.code === 'EMPLOYEE.DATE_INVALID') setDateError(true)
      }
    }
  })
  return (
    <AdminFormDialog
      title={translate('directory.place')}
      pending={mutation.isPending}
      onClose={onClose}
      submitDisabled={blocked}
      submitLabel={translate('directory.place')}
      onSubmit={(event) => {
        event.preventDefault()
        if (mutation.isPending || blocked) return
        const values = new FormData(event.currentTarget)
        const effectiveFrom = value(values, 'effectiveFrom')
        if (effectiveFrom < minimumDate) {
          setDateError(true)
          return
        }
        setDateError(false)
        mutation.mutate({ id: employee.id, data: { departmentId: value(values, 'departmentId'), effectiveFrom } })
      }}
    >
      <p title={employee.fullName} className='truncate font-medium'>
        {employee.fullName}
      </p>
      <p className='text-sm text-muted-foreground'>{translate('directory.placementHelp')}</p>
      <AdminField label={translate('fields.departmentId')}>
        <DepartmentLookup name='departmentId' />
      </AdminField>
      <AdminField label={translate('directory.effectiveFrom')}>
        <input
          aria-label={translate('directory.effectiveFrom')}
          name='effectiveFrom'
          type='date'
          min={minimumDate}
          required
          className={adminInputClass}
          aria-invalid={dateError}
          aria-describedby={dateErrorId}
          onChange={() => setDateError(false)}
        />
      </AdminField>
      <p id={dateErrorId} aria-live='polite' className='min-h-5 text-xs text-danger'>
        {dateError ? translate('directory.placementDateInvalid') : null}
      </p>
    </AdminFormDialog>
  )
}
