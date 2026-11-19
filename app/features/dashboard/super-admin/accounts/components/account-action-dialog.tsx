import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppUserLock } from '~/shared/api/generated/operations/app-users/app-user-lock'
import { useAppUserUnlock } from '~/shared/api/generated/operations/app-users/app-user-unlock'
import { useAppUserChangeRole } from '~/shared/api/generated/operations/app-users/app-user-change-role'
import { useAppUserResendInvitation } from '~/shared/api/generated/operations/app-users/app-user-resend-invitation'
import { useAppUserAvatarDelete } from '~/shared/api/generated/operations/profile/app-user-avatar-delete'
import type { AccountDetailResponseDtoData } from '~/shared/api/generated/model'
import { AdminField, AdminFormDialog, adminInputClass } from '../../shared/components/admin-form'
import { AdminSelect } from '../../shared/components/admin-select'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { hasKnownAccountState } from '../enums/account-status'
import { directRoles, type DirectRole } from '../enums/direct-role'
import { accountWriteKeys } from '../hooks/use-super-admin-accounts'
import { useAccountWriteGuard } from '../hooks/use-account-write-guard'

export type AccountAction = 'lock' | 'unlock' | 'grant' | 'resend' | 'removeAvatar'
export function AccountActionDialog({
  account,
  action,
  blocked,
  onClose
}: {
  account: NonNullable<AccountDetailResponseDtoData>
  action: AccountAction
  blocked: boolean
  onClose: () => void
}) {
  const { t: translate } = useTranslation('adminAccounts')
  const [reason, setReason] = useState('')
  const allowedRoles = directRoles.filter((role) => !account.roles.includes(role))
  const [role, setRole] = useState<DirectRole | ''>(allowedRoles[0] ?? '')
  const feedback = useAdminMutationFeedback(accountWriteKeys(account.id, account.employee?.id), onClose)
  const guard = useAccountWriteGuard()
  const options = {
    mutation: {
      ...feedback,
      retry: false as const,
      onError: async (error: unknown) => {
        guard.onError(error)
        await feedback.onError(error)
      },
      onSettled: guard.release
    }
  }
  const lock = useAppUserLock(options)
  const unlock = useAppUserUnlock(options)
  const changeRole = useAppUserChangeRole(options)
  const resend = useAppUserResendInvitation(options)
  const removeAvatar = useAppUserAvatarDelete(options)
  const pending =
    lock.isPending || unlock.isPending || changeRole.isPending || resend.isPending || removeAvatar.isPending
  const canAct =
    !blocked &&
    hasKnownAccountState(account.status, account.activationState) &&
    (action !== 'lock' || (account.status === 'ACTIVE' && !account.roles.includes('SUPER_ADMIN'))) &&
    (action !== 'unlock' || !account.roles.includes('SUPER_ADMIN')) &&
    (action !== 'resend' || (account.status === 'ACTIVE' && account.activationState === 'INVITED')) &&
    (action !== 'grant' || !account.roles.includes('SUPER_ADMIN')) &&
    (action !== 'removeAvatar' || !account.roles.includes('SUPER_ADMIN'))
  return (
    <AdminFormDialog
      title={translate(action === 'grant' ? 'changeRole' : action)}
      onClose={onClose}
      pending={pending}
      submitLabel={guard.remaining ? translate('retryIn', { count: guard.remaining }) : translate('confirm')}
      submitDisabled={!canAct || guard.remaining > 0 || (action === 'grant' && !role)}
      danger={action === 'lock' || action === 'removeAvatar'}
      onSubmit={(event) => {
        event.preventDefault()
        if (pending || !canAct) return
        if ((action === 'lock' || action === 'unlock' || action === 'removeAvatar') && !reason.trim()) return
        if (action === 'grant' && (!role || !allowedRoles.includes(role))) return
        if (!guard.acquire()) return
        if (action === 'lock' && reason.trim()) lock.mutate({ id: account.id, data: { reason: reason.trim() } })
        if (action === 'unlock' && reason.trim()) unlock.mutate({ id: account.id, data: { reason: reason.trim() } })
        if (action === 'removeAvatar' && reason.trim())
          removeAvatar.mutate({ id: account.id, data: { reason: reason.trim() } })
        if (action === 'grant' && role) changeRole.mutate({ id: account.id, data: { role } })
        if (action === 'resend') resend.mutate({ id: account.id })
      }}
    >
      <p className='text-sm text-muted-foreground'>{account.loginEmail}</p>
      {action === 'removeAvatar' && <p className='text-xs text-muted-foreground'>{translate('removeAvatarHint')}</p>}
      {(action === 'lock' || action === 'unlock' || action === 'removeAvatar') && (
        <AdminField
          label={translate('reason')}
          description={translate(action === 'removeAvatar' ? 'removeAvatarReasonPlaceholder' : 'reasonPlaceholder')}
        >
          <textarea
            required
            maxLength={action === 'removeAvatar' ? 500 : 1000}
            placeholder={translate(action === 'removeAvatar' ? 'removeAvatarReasonPlaceholder' : 'reasonPlaceholder')}
            className={adminInputClass}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </AdminField>
      )}
      {action === 'grant' && (
        <>
          <AdminField label={translate('role')} required description={translate('roleHelp')}>
            <AdminSelect
              required
              value={role}
              onChange={(next) => {
                const role = directRoles.find((value) => value === next)
                if (role) setRole(role)
              }}
              options={allowedRoles.map((value) => ({ value, label: translate(`roles.${value}`) }))}
              placeholder={translate('ui.pickRole')}
              emptyText={translate('none')}
            />
          </AdminField>
          <p className='text-xs text-muted-foreground'>{translate('singleRoleHint')}</p>
        </>
      )}
      {action === 'resend' && <p className='text-sm'>{translate('resendHint')}</p>}
    </AdminFormDialog>
  )
}
