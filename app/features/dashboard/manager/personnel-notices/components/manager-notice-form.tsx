import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SendNoticeBodyDto } from '~/shared/api/generated/model/personnel-notices/sendNoticeBodyDto'
import { personnelNoticeSend } from '~/shared/api/generated/operations/personnel-notices/personnel-notice-send'
import { getPersonnelNoticeListQueryKey } from '~/shared/api/generated/operations/personnel-notices/personnel-notice-list'
import { Dialog } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { resourceIdPattern } from '../../shared/manager-identifiers'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { NOTICE_KIND } from '../enums/notice-status'

export function ManagerNoticeForm({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  const [kind, setKind] = useState<SendNoticeBodyDto['kind']>(NOTICE_KIND.DEPARTURE)
  const action = useManagerAction({
    mutationFn: (body: SendNoticeBodyDto) => personnelNoticeSend(body),
    invalidate: [getPersonnelNoticeListQueryKey()],
    onSuccess: (result) => {
      if (result.data) onCreated(result.data.id)
    }
  })
  return (
    <Dialog
      title={translate('notice')}
      hint={translate('noticeHint')}
      presentation='drawer'
      onClose={() => {
        if (!action.isPending) onClose()
      }}
    >
      <ManagerFormErrors fields={action.fields}>
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault()
            if (action.blocked) return
            const form = new FormData(event.currentTarget)
            const targetDepartmentId = String(form.get('targetDepartmentId') ?? '').trim()
            const note = String(form.get('note') ?? '').trim()
            action.mutate({
              employeeId: String(form.get('employeeId')).trim(),
              kind,
              proposedOn: String(form.get('proposedOn')),
              ...(targetDepartmentId ? { targetDepartmentId } : {}),
              ...(note ? { note } : {})
            })
          }}
        >
          <fieldset disabled={action.blocked} className='space-y-4'>
            <ManagerField label={translate('employeeId')}>
              <input name='employeeId' required pattern={resourceIdPattern} className={managerInputClass} />
            </ManagerField>
            <p className='text-xs text-muted-foreground'>{translate('employeeHint')}</p>
            <div className='grid gap-4 sm:grid-cols-2'>
              <ManagerField label={translate('kind')}>
                <select
                  name='kind'
                  className={managerInputClass}
                  value={kind}
                  onChange={(event) => {
                    const choice = Object.values(NOTICE_KIND).find((value) => value === event.target.value)
                    if (choice) setKind(choice)
                  }}
                >
                  {Object.values(NOTICE_KIND).map((choice) => (
                    <option key={choice} value={choice}>
                      {translate(`statuses.${choice}`)}
                    </option>
                  ))}
                </select>
              </ManagerField>
              <ManagerField label={translate('proposedOn')}>
                <input name='proposedOn' required type='date' className={managerInputClass} />
              </ManagerField>
            </div>
            {(kind === NOTICE_KIND.DEPARTMENT_TRANSFER_IN || kind === NOTICE_KIND.DEPARTMENT_TRANSFER_OUT) && (
              <ManagerField label={translate('targetDepartment')}>
                <input name='targetDepartmentId' required pattern={resourceIdPattern} className={managerInputClass} />
              </ManagerField>
            )}
            <ManagerField label={translate('note')}>
              <textarea name='note' maxLength={500} className={managerInputClass} />
            </ManagerField>
          </fieldset>
          <ManagerActionState action={action} />
          <div className='flex justify-end'>
            <ManagerButton primary type='submit' disabled={action.blocked} busy={action.isPending}>
              {action.retrySeconds ? translate('retryAfter', { seconds: action.retrySeconds }) : translate('submit')}
            </ManagerButton>
          </div>
        </form>
      </ManagerFormErrors>
    </Dialog>
  )
}
