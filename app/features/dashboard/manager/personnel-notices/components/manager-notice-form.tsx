import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SendNoticeBodyDto } from '~/shared/api/generated/model/personnel-notices/sendNoticeBodyDto'
import { personnelNoticeSend } from '~/shared/api/generated/operations/personnel-notices/personnel-notice-send'
import { getPersonnelNoticeListQueryKey } from '~/shared/api/generated/operations/personnel-notices/personnel-notice-list'
import { Dialog } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useDepartmentMemberSearch } from '../../team/hooks/use-department-search'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { ManagerFormSelect, ManagerSelect, enumOptions } from '../../shared/components/manager-select'
import { NOTICE_KIND } from '../enums/notice-status'

export function ManagerNoticeForm({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  const [kind, setKind] = useState<SendNoticeBodyDto['kind']>(NOTICE_KIND.DEPARTURE)
  const me = useMeGet()
  const departmentId = (!me.isError ? me.data?.data?.managerScope?.departmentId : undefined) ?? ''
  const members = useDepartmentMemberSearch(departmentId, !!departmentId)
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
            const note = String(form.get('note') ?? '').trim()
            action.mutate({
              employeeId: String(form.get('employeeId')).trim(),
              kind,
              proposedOn: String(form.get('proposedOn')),
              ...(note ? { note } : {})
            })
          }}
        >
          <fieldset disabled={action.blocked} className='space-y-4'>
            <ManagerField label={translate('employee')}>
              <ManagerFormSelect
                name='employeeId'
                required
                placeholder={translate('ui.placeholders.noticeEmployee')}
                loading={members.isPending && !!departmentId}
                emptyText={members.isError ? translate('ui.loadFailed') : translate('noSearchResults')}
                options={(!members.isError ? (members.data ?? []) : []).map((member) => ({
                  value: member.employeeId,
                  label: member.fullName,
                  description: member.employeeCode
                }))}
              />
            </ManagerField>
            <div className='grid gap-4 sm:grid-cols-2'>
              <ManagerField label={translate('kind')}>
                <ManagerSelect
                  name='kind'
                  required
                  value={kind}
                  placeholder={translate('ui.placeholders.noticeKind')}
                  options={enumOptions(Object.values(NOTICE_KIND), (choice) => translate(`statuses.${choice}`))}
                  onChange={(next) => {
                    const choice = Object.values(NOTICE_KIND).find((value) => value === next)
                    if (choice) setKind(choice)
                  }}
                />
              </ManagerField>
              <ManagerField label={translate('proposedOn')}>
                <input
                  name='proposedOn'
                  required
                  type='date'
                  placeholder={translate('ui.placeholders.date')}
                  className={managerInputClass}
                />
              </ManagerField>
            </div>
            <ManagerField label={translate('note')}>
              <textarea
                name='note'
                maxLength={500}
                rows={3}
                placeholder={translate('ui.placeholders.noticeNote')}
                className={managerInputClass}
              />
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
