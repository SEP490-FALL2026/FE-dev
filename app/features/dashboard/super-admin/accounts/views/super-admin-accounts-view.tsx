import { useTranslation } from 'react-i18next'
import {
  AppUserListActivationState,
  AppUserListEmployeeLeft,
  AppUserListRole,
  AppUserListStatus
} from '~/shared/api/generated/model'
import { KeyRound, MailPlus } from 'lucide-react'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'
import { AdminField, adminButtonClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminSelect } from '../../shared/components/admin-select'
import { AdminPageHeader, AdminSectionTitle, AdminSegmented } from '../../shared/components/admin-page-header'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { useSuperAdminAccounts } from '../hooks/use-super-admin-accounts'
import { AccountInviteDialog } from '../components/account-invite-dialog'
import { AccountDetailModal } from '../components/account-detail-modal'
import { RolesSubtabView } from '../components/roles-subtab-view'
import { accountStatuses } from '../enums/account-status'
import { activationStates } from '../enums/activation-state'

export function SuperAdminAccountsView({
  accountId,
  onCloseAccount,
  section = 'accounts',
  invite = false,
  onCloseInvite
}: {
  accountId?: string
  onCloseAccount?: () => void
  section?: 'accounts' | 'responsibilities'
  invite?: boolean
  onCloseInvite?: () => void
}) {
  const { t: translate } = useTranslation('adminAccounts')
  const state = useSuperAdminAccounts(accountId, section, invite)
  const { query, filters } = state
  const data = query.data?.data
  if (state.selectedId)
    return (
      <AccountDetailModal
        page
        id={state.selectedId}
        onClose={() => {
          state.setSelectedId(null)
          onCloseAccount?.()
        }}
      />
    )
  return (
    <section className='space-y-6'>
      <AdminPageHeader
        icon={KeyRound}
        eyebrow={translate('ui.eyebrow')}
        title={translate('title')}
        actions={
          state.tab === 'accounts' && (
            <button type='button' className={adminPrimaryClass} onClick={() => state.setInviteOpen(true)}>
              <MailPlus aria-hidden strokeWidth={1.5} className='size-4' />
              {translate('invite')}
            </button>
          )
        }
      >
        <AdminSegmented
          label={translate('title')}
          value={state.tab}
          onChange={state.setTab}
          items={(['accounts', 'responsibilities'] as const).map((tab) => ({
            key: tab,
            label: translate(tab === 'accounts' ? 'list' : 'responsibilities')
          }))}
        />
      </AdminPageHeader>
      {state.tab === 'accounts' ? (
        <>
          <div className='soft-panel grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4'>
            <AdminField label={translate('status')} description=''>
              <AdminSelect
                value={filters.status ?? ''}
                clearable
                onChange={(next) =>
                  state.changeFilter({ status: AppUserListStatus[next as keyof typeof AppUserListStatus] })
                }
                options={accountStatuses.map((status) => ({ value: status, label: translate(`statuses.${status}`) }))}
                placeholder={translate('ui.allStatuses')}
              />
            </AdminField>
            <AdminField label={translate('activation')} description=''>
              <AdminSelect
                value={filters.activationState ?? ''}
                clearable
                onChange={(next) =>
                  state.changeFilter({
                    activationState: AppUserListActivationState[next as keyof typeof AppUserListActivationState]
                  })
                }
                options={activationStates.map((status) => ({
                  value: status,
                  label: translate(`activationStates.${status}`)
                }))}
                placeholder={translate('ui.allActivation')}
              />
            </AdminField>
            <AdminField label={translate('role')} description=''>
              <AdminSelect
                value={filters.role ?? ''}
                clearable
                onChange={(next) => state.changeFilter({ role: AppUserListRole[next as keyof typeof AppUserListRole] })}
                options={Object.values(AppUserListRole).map((role) => ({
                  value: role,
                  label: translate(`roles.${role}`)
                }))}
                placeholder={translate('ui.allRoles')}
              />
            </AdminField>
            <AdminField label={translate('employment')} description=''>
              <AdminSelect
                value={filters.employeeLeft ?? ''}
                clearable
                onChange={(next) =>
                  state.changeFilter({
                    employeeLeft: AppUserListEmployeeLeft[next as keyof typeof AppUserListEmployeeLeft]
                  })
                }
                options={[
                  { value: 'false', label: translate('working') },
                  { value: 'true', label: translate('left') }
                ]}
                placeholder={translate('ui.allEmployment')}
              />
            </AdminField>
          </div>
          <AdminSectionTitle
            title={translate('list')}
            hint={data ? translate('ui.accountCount', { count: data.pagination.totalItems }) : undefined}
          />
          <AdminQueryState query={query}>
            {!data?.items.length ? (
              <WorkspaceEmptyState
                icon={KeyRound}
                title={translate('ui.noAccountsTitle')}
                description={translate('ui.noAccountsHint')}
              />
            ) : (
              <div className='md:overflow-x-auto md:rounded-xl md:border md:border-border/80 md:bg-surface md:shadow-[0_1px_2px_rgb(0_0_0/4%),0_12px_28px_-24px_rgb(35_39_65/40%)]'>
                <table className='block w-full text-left text-sm md:table'>
                  <thead className='hidden bg-surface-subtle text-xs text-muted-foreground md:table-header-group'>
                    <tr>
                      {(['employee', 'loginEmail', 'status', 'activation', 'directRoles', 'actions'] as const).map(
                        (key) => (
                          <th key={key} className='px-4 py-3 font-medium'>
                            {translate(key)}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className='grid gap-3 md:table-row-group md:divide-y md:divide-border'>
                    {data.items.map((account) => (
                      <tr
                        key={account.id}
                        className='grid rounded-xl border border-border/80 bg-surface p-4 md:table-row md:rounded-none md:border-0 md:p-0'
                      >
                        <td className='block min-w-0 py-2 md:table-cell md:px-4 md:py-3'>
                          <span className='block max-w-64 truncate font-medium' title={account.employee?.fullName}>
                            {account.employee?.fullName ?? translate('none')}
                          </span>
                          <span className='block text-left font-mono text-xs tabular-nums text-muted-foreground'>
                            {account.employee?.employeeCode}
                          </span>
                        </td>
                        <td className='block min-w-0 py-2 md:table-cell md:px-4 md:py-3'>
                          <span className='block max-w-64 truncate' title={account.loginEmail}>
                            {account.loginEmail}
                          </span>
                        </td>
                        <td className='block py-2 md:table-cell md:px-4 md:py-3'>
                          <span className='mr-2 text-xs text-muted-foreground md:hidden'>{translate('status')}</span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${account.status === 'ACTIVE' ? 'bg-success/10 text-success-ink' : account.status === 'LOCKED' ? 'bg-danger/10 text-danger-ink' : 'bg-surface-subtle text-muted-foreground'}`}
                          >
                            <span aria-hidden className='size-1.5 rounded-full bg-current' />
                            {accountStatuses.includes(account.status)
                              ? translate(`statuses.${account.status}`)
                              : translate('unknown')}
                          </span>
                        </td>
                        <td className='block py-2 md:table-cell md:px-4 md:py-3'>
                          <span className='mr-2 text-xs text-muted-foreground md:hidden'>
                            {translate('activation')}
                          </span>
                          {activationStates.includes(account.activationState)
                            ? translate(`activationStates.${account.activationState}`)
                            : translate('unknown')}
                        </td>
                        <td className='block py-2 md:table-cell md:px-4 md:py-3'>
                          <span className='mr-2 text-xs text-muted-foreground md:hidden'>
                            {translate('directRoles')}
                          </span>
                          <span
                            className='block max-w-64 truncate'
                            title={account.roles
                              .map((role) => translate(`roles.${role}`, { defaultValue: translate('unknown') }))
                              .join(', ')}
                          >
                            {account.roles
                              .map((role) =>
                                Object.values(AppUserListRole).includes(role)
                                  ? translate(`roles.${role}`)
                                  : translate('unknown')
                              )
                              .join(', ')}
                          </span>
                        </td>
                        <td className='block bg-surface py-2 text-right md:sticky md:right-0 md:table-cell md:px-4 md:py-3'>
                          <button className={adminButtonClass} onClick={() => state.setSelectedId(account.id)}>
                            {translate('details')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AdminQueryState>
          <AdminPagination
            pagination={data?.pagination}
            disabled={query.isFetching}
            onPageChange={(page) => state.setFilters((previous) => ({ ...previous, page }))}
          />
        </>
      ) : (
        <RolesSubtabView />
      )}
      {state.inviteOpen && (
        <AccountInviteDialog
          onClose={() => {
            state.setInviteOpen(false)
            onCloseInvite?.()
          }}
        />
      )}
    </section>
  )
}
