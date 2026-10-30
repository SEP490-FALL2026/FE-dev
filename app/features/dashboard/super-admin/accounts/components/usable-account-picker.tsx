import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAppUserList } from '~/shared/api/generated/operations/app-users/app-user-list'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'
import type { AccountPageResponseDtoDataItemsItem, MeGet200 } from '~/shared/api/generated/model'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'

export function UsableAccountPicker({
  selectedId,
  onSelect,
  transfer = false
}: {
  selectedId: string
  onSelect: (account: AccountPageResponseDtoDataItemsItem) => void
  transfer?: boolean
}) {
  const { t: translate } = useTranslation('adminAccounts')
  const [page, setPage] = useState(1)
  const query = useAppUserList(
    { page, pageSize: 20, status: 'ACTIVE', activationState: 'ACTIVATED', employeeLeft: 'false' },
    { query: { retry: false } }
  )
  const selfId = useQueryClient().getQueryData<MeGet200>(getMeGetQueryKey())?.data?.appUserId
  const accounts = query.data?.data?.items ?? []
  return (
    <fieldset className='grid gap-3'>
      <legend className='mb-2 text-sm font-medium'>{translate(transfer ? 'successor' : 'employee')}</legend>
      <AdminQueryState query={query}>
        {!accounts.length && <AdminEmpty />}
        {accounts.map((account) => {
          const eligible =
            account.employee &&
            account.status === 'ACTIVE' &&
            account.activationState === 'ACTIVATED' &&
            !account.roles.includes('SUPER_ADMIN') &&
            (!transfer ||
              (account.id !== selfId && !account.roles.includes('IT_ADMIN') && !account.roles.includes('FINANCE')))
          return (
            <label
              className={`flex min-h-11 items-center gap-3 rounded-md border border-border p-3 ${!eligible ? 'opacity-50' : ''}`}
              key={account.id}
            >
              <input
                type='radio'
                required
                name='usable-account'
                disabled={!eligible || query.isFetching}
                checked={selectedId === account.id}
                onChange={() => onSelect(account)}
              />
              <span>
                {account.employee?.employeeCode} · {account.employee?.fullName ?? account.loginEmail}
                <span className='block text-xs text-muted-foreground'>{account.loginEmail}</span>
              </span>
            </label>
          )
        })}
      </AdminQueryState>
      <AdminPagination pagination={query.data?.data?.pagination} disabled={query.isFetching} onPageChange={setPage} />
      <p className='text-xs text-muted-foreground'>
        {translate(transfer ? 'transferEligibility' : 'approvalEligibility')}
      </p>
    </fieldset>
  )
}
