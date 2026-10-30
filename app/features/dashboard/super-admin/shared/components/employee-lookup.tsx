import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppUserList } from '~/shared/api/generated/operations/app-users/app-user-list'
import { useAccountCandidatesList } from '~/shared/api/generated/operations/app-users/account-candidates-list'
import { AdminQueryState } from './admin-query-state'
import { AdminPagination } from './admin-pagination'
import { adminInputClass, adminButtonClass } from './admin-form'
import { useAdminSearch } from '../hooks/use-admin-search'

const pattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
export function EmployeeLookup({ name, required }: { name: string; required: boolean }) {
  const { t: translate } = useTranslation('adminPersonnel')
  const [selected, setSelected] = useState('')
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState<'accounts' | 'candidates'>('accounts')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useAdminSearch(search)
  const accounts = useAppUserList({ page, pageSize: 20 }, { query: { enabled: open && source === 'accounts' } })
  const candidates = useAccountCandidatesList(debouncedSearch ? { search: debouncedSearch } : undefined, {
    query: { enabled: open && source === 'candidates' }
  })
  const items =
    source === 'accounts'
      ? accounts.data?.data?.items.flatMap((account) => (account.employee ? [account.employee] : []))
      : candidates.data?.data?.items
  return (
    <div className='grid gap-2'>
      <input
        placeholder={translate('employeeIdPlaceholder')}
        name={name}
        required={required}
        pattern={pattern}
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        className={adminInputClass}
      />
      <button type='button' className={adminButtonClass} onClick={() => setOpen(!open)}>
        {translate('lookupEmployee')}
      </button>
      {open && (
        <div className='space-y-2 rounded-md border border-border p-2'>
          <div className='flex flex-wrap gap-2'>
            <button
              type='button'
              className={adminButtonClass}
              aria-pressed={source === 'accounts'}
              onClick={() => setSource('accounts')}
            >
              {translate('withAccounts')}
            </button>
            <button
              type='button'
              className={adminButtonClass}
              aria-pressed={source === 'candidates'}
              onClick={() => setSource('candidates')}
            >
              {translate('withoutAccounts')}
            </button>
          </div>
          {source === 'candidates' && (
            <input
              type='search'
              placeholder={translate('searchEmployeePlaceholder')}
              aria-label={translate('searchEmployee')}
              className={adminInputClass}
              maxLength={100}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          )}
          <AdminQueryState query={source === 'accounts' ? accounts : candidates}>
            <ul className='grid gap-1'>
              {items?.map((item) => (
                <li key={item.id}>
                  <button
                    type='button'
                    className={`${adminButtonClass} w-full justify-start text-left`}
                    onClick={() => {
                      setSelected(item.id)
                      setOpen(false)
                    }}
                  >
                    {translate('employeeOption', { code: item.employeeCode, name: item.fullName })}
                  </button>
                </li>
              ))}
            </ul>
            {source === 'accounts' && (
              <AdminPagination
                pagination={accounts.data?.data?.pagination}
                onPageChange={setPage}
                disabled={accounts.isFetching}
              />
            )}
          </AdminQueryState>
        </div>
      )}
    </div>
  )
}
