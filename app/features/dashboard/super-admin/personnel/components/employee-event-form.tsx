import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { RecordOffboardingBodyDto, RecordTransferBodyDto } from '~/shared/api/generated/model'
import { useDepartmentTransferRecord } from '~/shared/api/generated/operations/department-transfers/department-transfer-record'
import { useDepartmentTransferPreview } from '~/shared/api/generated/operations/department-transfers/department-transfer-preview'
import { useLongLeaveStart } from '~/shared/api/generated/operations/long-leaves/long-leave-start'
import { useOffboardingCaseRecord } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-record'
import { useOffboardingCasePreview } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-preview'
import { getEmployeeGetQueryKey } from '~/shared/api/generated/operations/employees/employee-get'
import { PersonnelForm, readSuccessor, successorFields, value } from '../../shared/components/personnel-form'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'
import { EventImpactPreview, type EventImpact } from './event-impact-preview'

export type EmployeeEventKind = 'leave' | 'offboarding' | 'transfer'

type Previewed = { body: string; impact: EventImpact }

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
  // Departures and transfers are previewed with the exact body first (RD); the record is sent only when the
  // body confirmed is the one previewed, so any edit after the preview shows the new impact again.
  const [previewed, setPreviewed] = useState<Previewed | null>(null)
  const feedback = usePersonnelMutationFeedback([getEmployeeGetQueryKey(employee.id)], onClose)
  const previewFeedback = { onError: feedback.onError, retry: false }
  const leave = useLongLeaveStart({ mutation: { ...feedback, retry: false } })
  const offboarding = useOffboardingCaseRecord({ mutation: { ...feedback, retry: false } })
  const transfer = useDepartmentTransferRecord({ mutation: { ...feedback, retry: false } })
  const offboardingPreview = useOffboardingCasePreview({ mutation: previewFeedback })
  const transferPreview = useDepartmentTransferPreview({ mutation: previewFeedback })
  const pending =
    leave.isPending ||
    offboarding.isPending ||
    transfer.isPending ||
    offboardingPreview.isPending ||
    transferPreview.isPending
  const showPreview = (body: string, impact: EventImpact | null | undefined) => {
    if (impact) setPreviewed({ body, impact })
  }
  return (
    <PersonnelForm
      page
      title={translate(
        kind === 'leave' ? 'startLeave' : kind === 'offboarding' ? 'recordOffboarding' : 'recordTransfer'
      )}
      pending={pending}
      basis='note'
      onClose={onClose}
      submitLabel={kind === 'leave' ? undefined : translate(previewed ? 'impact.confirm' : 'impact.preview')}
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
        if (kind === 'leave') {
          leave.mutate({
            data: {
              employeeId: employee.id,
              startedOn: value(values, 'startedOn'),
              approvedReturnOn: value(values, 'approvedReturnOn'),
              groundsNote
            }
          })
          return
        }
        if (kind === 'offboarding') {
          const data: RecordOffboardingBodyDto = {
            employeeId: employee.id,
            ...(value(values, 'lastWorkingDay') ? { lastWorkingDay: value(values, 'lastWorkingDay') } : {}),
            accessBlockMode: values.get('blockAccessNow') ? 'BLOCK_NOW' : 'WITH_LAST_DAY',
            groundsNote,
            successor: readSuccessor(values),
            ...(values.get('cancelPendingTransfer') ? { cancelPendingTransfer: true } : {})
          }
          const body = JSON.stringify(data)
          if (previewed?.body === body) offboarding.mutate({ data })
          else offboardingPreview.mutate({ data }, { onSuccess: (response) => showPreview(body, response.data) })
          return
        }
        const data: RecordTransferBodyDto = {
          employeeId: employee.id,
          toDepartmentId: value(values, 'toDepartmentId'),
          effectiveOn: value(values, 'effectiveOn'),
          groundsNote,
          successor: readSuccessor(values)
        }
        const body = JSON.stringify(data)
        if (previewed?.body === body) transfer.mutate({ data })
        else transferPreview.mutate({ data }, { onSuccess: (response) => showPreview(body, response.data) })
      }}
    >
      {previewed && <EventImpactPreview impact={previewed.impact} />}
    </PersonnelForm>
  )
}
