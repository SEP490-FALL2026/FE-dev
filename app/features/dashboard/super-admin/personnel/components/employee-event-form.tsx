import { useTranslation } from 'react-i18next'
import { useDepartmentTransferRecord } from '~/shared/api/generated/operations/department-transfers/department-transfer-record'
import { useLongLeaveStart } from '~/shared/api/generated/operations/long-leaves/long-leave-start'
import { useOffboardingCaseRecord } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-record'
import { getEmployeeGetQueryKey } from '~/shared/api/generated/operations/employees/employee-get'
import { PersonnelForm, readSuccessor, successorFields, value } from '../../shared/components/personnel-form'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'

export type EmployeeEventKind = 'leave' | 'offboarding' | 'transfer'

export function EmployeeEventForm({
  employee,
  kind,
  onClose
}: {
  employee: { id: string; employeeCode: string; fullName: string }
  kind: EmployeeEventKind
  onClose: () => void
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const feedback = usePersonnelMutationFeedback([getEmployeeGetQueryKey(employee.id)], onClose)
  const leave = useLongLeaveStart({ mutation: { ...feedback, retry: false } })
  const offboarding = useOffboardingCaseRecord({ mutation: { ...feedback, retry: false } })
  const transfer = useDepartmentTransferRecord({ mutation: { ...feedback, retry: false } })
  const pending = leave.isPending || offboarding.isPending || transfer.isPending
  return (
    <PersonnelForm
      page
      title={translate(
        kind === 'leave' ? 'startLeave' : kind === 'offboarding' ? 'recordOffboarding' : 'recordTransfer'
      )}
      pending={pending}
      basis='note'
      onClose={onClose}
      fields={[
        { name: 'employeeId', fixed: true, initialLabel: `${employee.employeeCode} — ${employee.fullName}` },
        ...(kind === 'leave'
          ? [
              { name: 'startedOn', type: 'date' as const },
              { name: 'approvedReturnOn', type: 'date' as const }
            ]
          : kind === 'offboarding'
            ? [
                { name: 'lastWorkingDay', type: 'date' as const, optionalWhenChecked: 'blockAccessNow' },
                { name: 'blockAccessNow', type: 'checkbox' as const, optional: true },
                ...successorFields,
                { name: 'cancelPendingTransfer', type: 'checkbox' as const, optional: true }
              ]
            : [
                { name: 'toDepartmentId', type: 'uuid' as const },
                { name: 'effectiveOn', type: 'date' as const },
                ...successorFields
              ])
      ]}
      onSubmit={(values) => {
        if (pending) return
        const groundsNote = value(values, 'groundsNote')
        if (kind === 'leave')
          leave.mutate({
            data: {
              employeeId: employee.id,
              startedOn: value(values, 'startedOn'),
              approvedReturnOn: value(values, 'approvedReturnOn'),
              groundsNote
            }
          })
        else if (kind === 'offboarding')
          offboarding.mutate({
            data: {
              employeeId: employee.id,
              ...(value(values, 'lastWorkingDay') ? { lastWorkingDay: value(values, 'lastWorkingDay') } : {}),
              accessBlockMode: values.get('blockAccessNow') ? 'BLOCK_NOW' : 'WITH_LAST_DAY',
              groundsNote,
              successor: readSuccessor(values),
              ...(values.get('cancelPendingTransfer') ? { cancelPendingTransfer: true } : {})
            }
          })
        else
          transfer.mutate({
            data: {
              employeeId: employee.id,
              toDepartmentId: value(values, 'toDepartmentId'),
              effectiveOn: value(values, 'effectiveOn'),
              groundsNote,
              successor: readSuccessor(values)
            }
          })
      }}
    />
  )
}
