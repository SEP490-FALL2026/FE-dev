import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAppUserGet } from '~/shared/api/generated/operations/app-users/app-user-get'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'
import { AccountDetailResponseDtoDataInvitationDeliveryStatus, type MeGet200 } from '~/shared/api/generated/model'
import { useDashboardFormat } from '../../../dashboard-ui'
import { AdminFormDialog, adminButtonClass } from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { accountStatuses, hasKnownAccountState } from '../enums/account-status'
import { activationStates } from '../enums/activation-state'
import { directRoles } from '../enums/direct-role'
import { AccountActionDialog, type AccountAction } from './account-action-dialog'

export function AccountDetailModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { t: translate } = useTranslation('adminAccounts')
  const { formatDate } = useDashboardFormat()
  const query = useAppUserGet(id, { query: { retry: false } })
  const client = useQueryClient()
  const selfId = client.getQueryData<MeGet200>(getMeGetQueryKey())?.data?.appUserId
  const account = query.data?.data
  const [action, setAction] = useState<AccountAction | null>(null)
  const canWrite =
    !!account &&
    !query.isFetching &&
    !query.isError &&
    account.id !== selfId &&
    hasKnownAccountState(account.status, account.activationState)
  const roleLabel = (role: string) => translate(`roles.${role}`, { defaultValue: translate('unknown') })
  if (action && account)
    return <AccountActionDialog account={account} action={action} blocked={!canWrite} onClose={() => setAction(null)} />
  return (
    <AdminFormDialog
      title={translate('details')}
      wide
      onClose={onClose}
      pending={false}
      submitLabel={translate('close')}
      onSubmit={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <AdminQueryState query={query}>
        {!account ? (
          <AdminEmpty />
        ) : (
          <>
            <dl className='grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-sm'>
              <dt className='text-muted-foreground'>{translate('employee')}</dt>
              <dd>
                {account.employee?.fullName ?? translate('none')} · {account.employee?.employeeCode}
              </dd>
              <dt className='text-muted-foreground'>{translate('loginEmail')}</dt>
              <dd className='break-all'>{account.loginEmail}</dd>
              <dt className='text-muted-foreground'>{translate('status')}</dt>
              <dd>
                {accountStatuses.includes(account.status)
                  ? translate(`statuses.${account.status}`)
                  : translate('unknown')}
              </dd>
              <dt className='text-muted-foreground'>{translate('activation')}</dt>
              <dd>
                {activationStates.includes(account.activationState)
                  ? translate(`activationStates.${account.activationState}`)
                  : translate('unknown')}
              </dd>
              <dt className='text-muted-foreground'>{translate('directRoles')}</dt>
              <dd>{account.roles.map(roleLabel).join(', ') || translate('none')}</dd>
              <dt className='text-muted-foreground'>{translate('createdAt')}</dt>
              <dd>{formatDate(account.createdAt)}</dd>
            </dl>
            {account.invitation && (
              <section className='space-y-2 rounded-md border border-border p-4'>
                <h3 className='font-medium'>{translate('invitation')}</h3>
                <p className='text-sm'>{translate(account.invitation.usable ? 'usable' : 'expired')}</p>
                <p className='text-sm'>{translate('expiresAt', { date: formatDate(account.invitation.expiresAt) })}</p>
                {account.invitation.delivery && (
                  <>
                    <p className='text-sm'>
                      {translate('delivery')}:{' '}
                      {Object.values(AccountDetailResponseDtoDataInvitationDeliveryStatus).includes(
                        account.invitation.delivery.status
                      )
                        ? translate(`deliveryStatuses.${account.invitation.delivery.status}`)
                        : translate('unknown')}
                    </p>
                    <p className='text-sm'>{translate('attempts', { count: account.invitation.delivery.attempts })}</p>
                    {account.invitation.delivery.sentAt && (
                      <p className='text-sm'>
                        {translate('sentAt', { date: formatDate(account.invitation.delivery.sentAt) })}
                      </p>
                    )}
                  </>
                )}
              </section>
            )}
            <div className='flex flex-wrap gap-2'>
              <button
                type='button'
                className={adminButtonClass}
                disabled={!canWrite || account.roles.includes('SUPER_ADMIN')}
                onClick={() => setAction(account.status === 'LOCKED' ? 'unlock' : 'lock')}
              >
                {translate(account.status === 'LOCKED' ? 'unlock' : 'lock')}
              </button>
              <button
                type='button'
                className={adminButtonClass}
                disabled={
                  !canWrite ||
                  !directRoles.some((role) => !account.roles.includes(role)) ||
                  account.roles.includes('SUPER_ADMIN')
                }
                onClick={() => setAction('grant')}
              >
                {translate('grant')}
              </button>
              <button
                type='button'
                className={adminButtonClass}
                disabled={!canWrite || !directRoles.some((role) => account.roles.includes(role))}
                onClick={() => setAction('revoke')}
              >
                {translate('revoke')}
              </button>
              <button
                type='button'
                className={adminButtonClass}
                disabled={!canWrite || account.activationState !== 'INVITED' || account.status !== 'ACTIVE'}
                onClick={() => setAction('resend')}
              >
                {translate('resend')}
              </button>
            </div>
            {account.id === selfId && <p className='text-xs text-muted-foreground'>{translate('selfHint')}</p>}
            <section className='space-y-2'>
              <h3 className='font-medium'>{translate('roleHistory')}</h3>
              {account.roleHistory.length ? (
                <ul className='divide-y divide-border'>
                  {account.roleHistory.map((entry, index) => (
                    <li className='py-2 text-sm' key={`${entry.role}-${entry.grantedAt}-${index}`}>
                      {roleLabel(entry.role)}
                      <span className='block text-xs text-muted-foreground'>
                        {formatDate(entry.grantedAt)} ·{' '}
                        {entry.revokedAt ? formatDate(entry.revokedAt) : translate('current')}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-muted-foreground'>{translate('none')}</p>
              )}
              {account.roleHistoryHasMore && (
                <p className='text-xs text-muted-foreground'>{translate('historyLimited')}</p>
              )}
            </section>
          </>
        )}
      </AdminQueryState>
    </AdminFormDialog>
  )
}
