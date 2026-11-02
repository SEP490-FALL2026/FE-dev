import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppUserList } from '~/shared/api/generated/operations/app-users/app-user-list'
import { useAccountCandidatesList } from '~/shared/api/generated/operations/app-users/account-candidates-list'
import { AdminEmpty, AdminQueryState } from './admin-query-state'
import { AdminPagination } from './admin-pagination'
import { adminInputClass, adminButtonClass } from './admin-form'
import { useAdminSearch } from '../hooks/use-admin-search'

export function EmployeeLookup({ name, required, initial = '', initialLabel = '', purpose = 'personnel', initiallyOpen = false }: {
  name: string
  required: boolean
  initial?: string
  initialLabel?: string
  purpose?: 'personnel' | 'leadership' | 'itAdmin'
  initiallyOpen?: boolean
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const [selected, setSelected] = useState(initial)
  const [selectedLabel, setSelectedLabel] = useState(initialLabel)
  const [open, setOpen] = useState(initiallyOpen)
  const [source, setSource] = useState<'accounts' | 'candidates'>('accounts')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useAdminSearch(search)
  const accounts = useAppUserList({
    page, pageSize: 20,
    ...(purpose !== 'personnel' ? { status: 'ACTIVE' as const, activationState: 'ACTIVATED' as const } : {}),
    ...(purpose === 'itAdmin' ? { role: 'IT_ADMIN' as const } : {})
  }, { query: { enabled: open && source === 'accounts' } })
  const candidates = useAccountCandidatesList(debouncedSearch ? { search: debouncedSearch } : undefined, {
    query: { enabled: open && source === 'candidates' }
  })
  const items =
    source === 'accounts'
      ? accounts.data?.data?.items.flatMap((account) => (
        account.employee && (purpose === 'personnel' || !account.roles.includes('SUPER_ADMIN')) ? [account.employee] : []
      ))
      : candidates.data?.data?.items
  return (
    <div className='grid gap-2'>
      <select
        aria-label={translate(name === 'successorEmployeeId' ? 'fields.successorEmployeeId' : 'fields.employeeId')}
        name={name}
        required={required}
        value={selected}
        onChange={() => { setSelected(''); setSelectedLabel('') }}
        className={adminInputClass}
      >
        <option value=''>{translate(required ? 'choose' : 'noSelection')}</option>
        {selected && <option value={selected}>{selectedLabel || translate('currentSelection')}</option>}
      </select>
      <button type='button' aria-expanded={open} className={adminButtonClass} onClick={() => setOpen(!open)}>
        {translate('lookupEmployee')}
      </button>
      {open && (
        <div className='space-y-2 rounded-md border border-border p-2'>
          {purpose !== 'itAdmin' && <div className='flex flex-wrap gap-2'>
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
          </div>}
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
            {!items?.length && <AdminEmpty />}
            <ul className='grid gap-1'>
              {items?.map((item) => (
                <li key={item.id}>
                  <button
                    type='button'
                    className={`${adminButtonClass} w-full justify-start text-left`}
                    onClick={() => {
                      setSelected(item.id)
                      setSelectedLabel(translate('employeeOption', { code: item.employeeCode, name: item.fullName }))
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
