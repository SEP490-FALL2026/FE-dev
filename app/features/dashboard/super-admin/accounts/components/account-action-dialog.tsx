import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppUserLock } from '~/shared/api/generated/operations/app-users/app-user-lock'
import { useAppUserUnlock } from '~/shared/api/generated/operations/app-users/app-user-unlock'
import { useAppUserGrantRole } from '~/shared/api/generated/operations/app-users/app-user-grant-role'
import { useAppUserRevokeRole } from '~/shared/api/generated/operations/app-users/app-user-revoke-role'
import { useAppUserResendInvitation } from '~/shared/api/generated/operations/app-users/app-user-resend-invitation'
import type { AccountDetailResponseDtoData } from '~/shared/api/generated/model'
import { AdminField, AdminFormDialog, adminInputClass } from '../../shared/components/admin-form'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { hasKnownAccountState } from '../enums/account-status'
import { directRoles, type DirectRole } from '../enums/direct-role'
import { accountWriteKeys } from '../hooks/use-super-admin-accounts'
import { useAccountWriteGuard } from '../hooks/use-account-write-guard'

export type AccountAction = 'lock' | 'unlock' | 'grant' | 'revoke' | 'resend'
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
  const allowedRoles = directRoles.filter((role) =>
    action === 'revoke' ? account.roles.includes(role) : !account.roles.includes(role)
  )
  const [role, setRole] = useState<DirectRole | ''>(allowedRoles[0] ?? '')
  const feedback = useAdminMutationFeedback(accountWriteKeys(account.id), onClose)
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
  const grant = useAppUserGrantRole(options)
  const revoke = useAppUserRevokeRole(options)
  const resend = useAppUserResendInvitation(options)
  const pending = lock.isPending || unlock.isPending || grant.isPending || revoke.isPending || resend.isPending
  const canAct =
    !blocked &&
    hasKnownAccountState(account.status, account.activationState) &&
    (action !== 'lock' || (account.status === 'ACTIVE' && !account.roles.includes('SUPER_ADMIN'))) &&
    (action !== 'unlock' || account.status === 'LOCKED') &&
    (action !== 'resend' || (account.status === 'ACTIVE' && account.activationState === 'INVITED')) &&
    (action !== 'grant' || !account.roles.includes('SUPER_ADMIN'))
  return (
    <AdminFormDialog
      title={translate(action)}
      onClose={onClose}
      pending={pending}
      submitLabel={guard.remaining ? translate('retryIn', { count: guard.remaining }) : translate('confirm')}
      submitDisabled={!canAct || guard.remaining > 0 || ((action === 'grant' || action === 'revoke') && !role)}
      danger={action === 'lock' || action === 'revoke'}
      onSubmit={(event) => {
        event.preventDefault()
        if (pending || !canAct) return
        if ((action === 'lock' || action === 'unlock') && !reason.trim()) return
        if ((action === 'grant' || action === 'revoke') && (!role || !allowedRoles.includes(role))) return
        if (!guard.acquire()) return
        if (action === 'lock' && reason.trim()) lock.mutate({ id: account.id, data: { reason: reason.trim() } })
        if (action === 'unlock' && reason.trim()) unlock.mutate({ id: account.id, data: { reason: reason.trim() } })
        if (action === 'grant' && role) grant.mutate({ id: account.id, data: { role } })
        if (action === 'revoke' && role) revoke.mutate({ id: account.id, role })
        if (action === 'resend') resend.mutate({ id: account.id })
      }}
    >
      <p className='text-sm text-muted-foreground'>{account.loginEmail}</p>
      {(action === 'lock' || action === 'unlock') && (
        <AdminField label={translate('reason')}>
          <textarea
            required
            maxLength={1000}
            className={adminInputClass}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </AdminField>
      )}
      {(action === 'grant' || action === 'revoke') && (
        <>
          <AdminField label={translate('role')}>
            <select
              required
              className={adminInputClass}
              value={role}
              onChange={(event) => {
                const next = directRoles.find((value) => value === event.target.value)
                if (next) setRole(next)
              }}
            >
              {!allowedRoles.length && <option value=''>{translate('none')}</option>}
              {allowedRoles.map((value) => (
                <option value={value} key={value}>
                  {translate(`roles.${value}`)}
                </option>
              ))}
            </select>
          </AdminField>
          <p className='text-xs text-muted-foreground'>{translate('derivedHint')}</p>
        </>
      )}
      {action === 'resend' && <p className='text-sm'>{translate('resendHint')}</p>}
    </AdminFormDialog>
  )
}
