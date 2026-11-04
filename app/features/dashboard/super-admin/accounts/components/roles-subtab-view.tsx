import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppUserList } from '~/shared/api/generated/operations/app-users/app-user-list'
import { adminButtonClass } from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AccountDetailModal } from './account-detail-modal'

export function RolesSubtabView() {
  const { t: translate } = useTranslation('adminAccounts')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const query = useAppUserList({ role: 'SPENDING_APPROVER', page, pageSize: 20 }, { query: { retry: false } })
  const data = query.data?.data
  return (
    <div className='space-y-5'>
      <p className='max-w-3xl text-sm text-muted-foreground'>{translate('derivedHint')}</p>
      <AdminQueryState query={query}>
        {!data?.items.length && <AdminEmpty />}
        {data?.items.map((account) => (
          <article
            className='flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-surface p-5'
            key={account.id}
          >
            <div className='min-w-0'>
              <h2 className='truncate font-semibold' title={account.employee?.fullName}>
                {account.employee?.fullName ?? translate('none')}
              </h2>
              <p className='truncate text-sm text-muted-foreground' title={account.loginEmail}>
                {account.loginEmail}
              </p>
            </div>
            <button className={adminButtonClass} disabled={query.isFetching} onClick={() => setSelectedId(account.id)}>
              {translate('details')}
            </button>
          </article>
        ))}
        <AdminPagination pagination={data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
      {selectedId && <AccountDetailModal id={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  )
}
