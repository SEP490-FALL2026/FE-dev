import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog } from '../../../dashboard-ui'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  managerInputClass
} from '../../shared/components/manager-api-ui'

export function ManagerWithdrawDialog({
  title,
  action,
  onClose,
  onConfirm
}: {
  title: string
  action: { isPending: boolean; blocked: boolean; uncertain: boolean; fields: string[]; retrySeconds: number }
  onClose: () => void
  onConfirm: (reason: string) => void
}) {
  const { t: translate } = useTranslation('manager')
  const [reason, setReason] = useState('')
  return (
    <Dialog
      presentation='sheet'
      title={title}
      hint={translate('integration.withdrawHint')}
      onClose={() => {
        if (!action.isPending) onClose()
      }}
    >
      <ManagerFormErrors fields={action.fields}>
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault()
            if (!action.blocked && reason.trim()) onConfirm(reason.trim())
          }}
        >
          <ManagerField label={translate('reason')}>
            <textarea
              name='reason'
              className={managerInputClass}
              required
              maxLength={1000}
              value={reason}
              disabled={action.isPending}
              onChange={(event) => setReason(event.target.value)}
            />
          </ManagerField>
          <ManagerActionState action={action} />
          <div className='flex justify-end gap-3'>
            <ManagerButton disabled={action.isPending} onClick={onClose}>
              {translate('cancel')}
            </ManagerButton>
            <ManagerButton primary type='submit' busy={action.isPending} disabled={action.blocked || !reason.trim()}>
              {action.retrySeconds
                ? translate('retryAfter', { seconds: action.retrySeconds })
                : translate('integration.withdraw')}
            </ManagerButton>
          </div>
        </form>
      </ManagerFormErrors>
    </Dialog>
  )
}
