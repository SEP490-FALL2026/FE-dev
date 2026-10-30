import { useTranslation } from 'react-i18next'
import type {
  NoticeDetailResponseDtoData,
  RecordNoticeBodyDto,
  LinkNoticeBodyDto
} from '~/shared/api/generated/model/personnel-notices'
import {
  PersonnelForm,
  readBasis,
  readSuccessor,
  successorFields,
  value,
  type PersonnelField
} from '../../shared/components/personnel-form'
import { verificationMethods } from '../enums/verification-method'

export type NoticeAction = 'record' | 'link' | 'reject'
export function NoticeActionForm({
  notice,
  action,
  pending,
  onClose,
  onRecord,
  onLink,
  onReject
}: {
  notice: NonNullable<NoticeDetailResponseDtoData>
  action: NoticeAction
  pending: boolean
  onClose: () => void
  onRecord: (data: RecordNoticeBodyDto) => void
  onLink: (data: LinkNoticeBodyDto) => void
  onReject: (data: { reason: string }) => void
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const transfer = notice.kind === 'DEPARTMENT_TRANSFER_IN' || notice.kind === 'DEPARTMENT_TRANSFER_OUT'
  const leave = notice.kind === 'LONG_LEAVE'
  const verificationFields: PersonnelField[] = [
    { name: 'method', options: verificationMethods },
    { name: 'verificationReference', maxLength: 2000 }
  ]
  const eventFields: PersonnelField[] = transfer
    ? [
        { name: 'toDepartmentId', type: 'uuid', initial: notice.targetDepartment?.id },
        { name: 'effectiveOn', type: 'date', initial: notice.proposedOn },
        ...successorFields
      ]
    : leave
      ? [
          { name: 'startedOn', type: 'date', initial: notice.proposedOn },
          { name: 'approvedReturnOn', type: 'date' }
        ]
      : [
          { name: 'lastWorkingDay', type: 'date', initial: notice.proposedOn },
          ...successorFields,
          { name: 'transferCancellationReason', optional: true, maxLength: 2000 }
        ]
  return (
    <PersonnelForm
      title={translate(action === 'record' ? 'recordNotice' : action === 'link' ? 'linkNotice' : 'rejectNotice')}
      fields={
        action === 'reject'
          ? [{ name: 'reason', maxLength: 2000 }]
          : action === 'link'
            ? [{ name: 'eventId', type: 'uuid' }, ...verificationFields]
            : [...verificationFields, ...eventFields]
      }
      basis={action === 'record'}
      pending={pending}
      onClose={onClose}
      onSubmit={(values) => {
        if (pending) return
        if (action === 'reject') {
          onReject({ reason: value(values, 'reason') })
          return
        }
        const verification = {
          method: value(values, 'method') as RecordNoticeBodyDto['verification']['method'],
          reference: value(values, 'verificationReference')
        }
        if (action === 'link') {
          onLink({ eventId: value(values, 'eventId'), verification })
          return
        }
        const event: RecordNoticeBodyDto['event'] = transfer
          ? {
              toDepartmentId: value(values, 'toDepartmentId'),
              effectiveOn: value(values, 'effectiveOn'),
              successor: readSuccessor(values)
            }
          : leave
            ? { startedOn: value(values, 'startedOn'), approvedReturnOn: value(values, 'approvedReturnOn') }
            : {
                lastWorkingDay: value(values, 'lastWorkingDay'),
                successor: readSuccessor(values),
                ...(value(values, 'transferCancellationReason')
                  ? { pendingTransferCancellation: { reason: value(values, 'transferCancellationReason') } }
                  : {})
              }
        onRecord({ verification, grounds: readBasis(values), event })
      }}
    />
  )
}
