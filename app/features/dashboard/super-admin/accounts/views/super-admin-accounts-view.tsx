import { useTranslation } from 'react-i18next'
import {
  AppUserListActivationState,
  AppUserListEmployeeLeft,
  AppUserListRole,
  AppUserListStatus
} from '~/shared/api/generated/model'
import { AdminField, adminButtonClass, adminInputClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { AdminQueryState, AdminEmpty } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { useSuperAdminAccounts } from '../hooks/use-super-admin-accounts'
import { AccountInviteDialog } from '../components/account-invite-dialog'
import { AccountDetailModal } from '../components/account-detail-modal'
import { RolesSubtabView } from '../components/roles-subtab-view'
import { accountStatuses } from '../enums/account-status'
import { activationStates } from '../enums/activation-state'

export function SuperAdminAccountsView() {
  const { t: translate } = useTranslation('adminAccounts')
  const state = useSuperAdminAccounts()
  const { query, filters } = state
  const data = query.data?.data
  return (
    <section className='space-y-5'>
      <header className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-2xl font-semibold [text-wrap:balance]'>{translate('title')}</h1>
        {state.tab === 'accounts' && (
          <button className={adminPrimaryClass} onClick={() => state.setInviteOpen(true)}>
            {translate('invite')}
          </button>
        )}
      </header>
      <div role='tablist' aria-label={translate('title')} className='flex gap-2 border-b border-border pb-3'>
        {(['accounts', 'responsibilities'] as const).map((tab) => (
          <button
            key={tab}
            role='tab'
            aria-selected={state.tab === tab}
            className={`${adminButtonClass} ${state.tab === tab ? 'border-primary text-primary' : ''}`}
            onClick={() => state.setTab(tab)}
          >
            {translate(tab === 'accounts' ? 'list' : 'responsibilities')}
          </button>
        ))}
      </div>
      {state.tab === 'accounts' ? (
        <>
          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
            <AdminField label={translate('status')}>
              <select
                className={adminInputClass}
                value={filters.status ?? ''}
                onChange={(event) =>
                  state.changeFilter({
                    status: AppUserListStatus[event.target.value as keyof typeof AppUserListStatus]
                  })
                }
              >
                <option value=''>{translate('all')}</option>
                {accountStatuses.map((status) => (
                  <option key={status} value={status}>
                    {translate(`statuses.${status}`)}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label={translate('activation')}>
              <select
                className={adminInputClass}
                value={filters.activationState ?? ''}
                onChange={(event) =>
                  state.changeFilter({
                    activationState:
                      AppUserListActivationState[event.target.value as keyof typeof AppUserListActivationState]
                  })
                }
              >
                <option value=''>{translate('all')}</option>
                {activationStates.map((status) => (
                  <option key={status} value={status}>
                    {translate(`activationStates.${status}`)}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label={translate('role')}>
              <select
                className={adminInputClass}
                value={filters.role ?? ''}
                onChange={(event) =>
                  state.changeFilter({ role: AppUserListRole[event.target.value as keyof typeof AppUserListRole] })
                }
              >
                <option value=''>{translate('all')}</option>
                {Object.values(AppUserListRole).map((role) => (
                  <option key={role} value={role}>
                    {translate(`roles.${role}`)}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label={translate('employment')}>
              <select
                className={adminInputClass}
                value={filters.employeeLeft ?? ''}
                onChange={(event) =>
                  state.changeFilter({
                    employeeLeft: AppUserListEmployeeLeft[event.target.value as keyof typeof AppUserListEmployeeLeft]
                  })
                }
              >
                <option value=''>{translate('all')}</option>
                <option value='false'>{translate('working')}</option>
                <option value='true'>{translate('left')}</option>
              </select>
            </AdminField>
          </div>
          <AdminQueryState query={query}>
            {!data?.items.length ? (
              <AdminEmpty />
            ) : (
              <div className='md:overflow-x-auto md:rounded-lg md:border md:border-border'>
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
                        className='grid rounded-lg border border-border bg-surface p-4 md:table-row md:rounded-none md:border-0 md:p-0'
                      >
                        <td className='block min-w-0 py-2 md:table-cell md:px-4 md:py-3'>
                          <span className='block max-w-64 truncate font-medium' title={account.employee?.fullName}>
                            {account.employee?.fullName ?? translate('none')}
                          </span>
                          <span className='block text-right font-mono text-xs tabular-nums text-muted-foreground'>
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
                          {accountStatuses.includes(account.status)
                            ? translate(`statuses.${account.status}`)
                            : translate('unknown')}
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
                          {account.roles
                            .map((role) =>
                              Object.values(AppUserListRole).includes(role)
                                ? translate(`roles.${role}`)
                                : translate('unknown')
                            )
                            .join(', ')}
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
      {state.inviteOpen && <AccountInviteDialog onClose={() => state.setInviteOpen(false)} />}
      {state.selectedId && <AccountDetailModal id={state.selectedId} onClose={() => state.setSelectedId(null)} />}
    </section>
  )
}
