import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppUserList } from '~/shared/api/generated/operations/app-users/app-user-list'
import { AppUserListActivationState, AppUserListStatus, AppUserListRole } from '~/shared/api/generated/model'
import { AdminField, adminInputClass } from '../../shared/components/admin-form'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AdminQueryState, AdminEmpty } from '../../shared/components/admin-query-state'

/** Login-backed candidates are paged; the API remains authoritative for membership on the effective date. */
export function EmployeePicker({
  name,
  itAdmin = false,
  initialId = '',
  optional = false
}: {
  name: string
  itAdmin?: boolean
  initialId?: string
  optional?: boolean
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(initialId)
  const query = useAppUserList({
    page,
    pageSize: 20,
    status: AppUserListStatus.ACTIVE,
    activationState: AppUserListActivationState.ACTIVATED,
    ...(itAdmin ? { role: AppUserListRole.IT_ADMIN } : {})
  })
  const candidates = (query.data?.data?.items ?? []).filter(
    (account) => account.employee && !account.roles.includes(AppUserListRole.SUPER_ADMIN)
  )
  return (
    <section className='grid gap-3'>
      <AdminField label={translate(itAdmin ? 'itAdminId' : 'employeeId')}>
        <input
          placeholder={translate('candidateIdPlaceholder')}
          className={adminInputClass}
          name={name}
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
          required={!optional}
          pattern='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
        />
      </AdminField>
      <p className='text-sm text-muted-foreground'>{translate(itAdmin ? 'itAdminHelp' : 'candidateHelp')}</p>
      <AdminQueryState query={query}>
        {!candidates.length && <AdminEmpty />}
        {candidates.map((account) => (
          <button
            key={account.id}
            type='button'
            aria-pressed={selected === account.employee?.id}
            className='rounded-md border border-border p-3 text-left text-sm hover:bg-surface-subtle aria-pressed:border-primary'
            onClick={() => setSelected(account.employee?.id ?? '')}
          >
            <span className='block font-medium'>{account.employee?.fullName}</span>
            <span className='text-muted-foreground'>
              {account.employee?.employeeCode} · {account.loginEmail}
            </span>
          </button>
        ))}
        <AdminPagination pagination={query.data?.data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
    </section>
  )
}
