import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentList } from '~/shared/api/generated/operations/departments'
import { adminInputClass, adminButtonClass } from './admin-form'
import { AdminEmpty, AdminQueryState } from './admin-query-state'
import { AdminPagination } from './admin-pagination'

/** A paged API selection with an optional known ID; no client-side directory fixture. */
export function DepartmentLookup({
  name,
  required = true,
  initial = ''
}: {
  name: string
  required?: boolean
  initial?: string
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const [selected, setSelected] = useState(initial)
  const [selectedName, setSelectedName] = useState('')
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const query = useDepartmentList({ page, pageSize: 20, status: 'ACTIVE' }, { query: { enabled: open } })
  return (
    <div className='grid gap-2'>
      <input
        placeholder={translate('departmentIdPlaceholder')}
        aria-label={translate(name === 'toDepartmentId' ? 'fields.toDepartmentId' : 'fields.departmentId')}
        className={adminInputClass}
        name={name}
        required={required}
        pattern='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
        value={selected}
        onChange={(event) => {
          setSelected(event.target.value)
          setSelectedName('')
        }}
      />
      {selectedName && (
        <p className='truncate text-xs text-muted-foreground' title={selectedName}>
          {selectedName}
        </p>
      )}
      <button type='button' className={adminButtonClass} onClick={() => setOpen(!open)}>
        {translate('chooseDepartment')}
      </button>
      {open && (
        <AdminQueryState query={query}>
          {!query.data?.data?.items.length && <AdminEmpty />}
          <ul className='grid gap-2'>
            {query.data?.data?.items.map((department) => (
              <li key={department.id}>
                <button
                  type='button'
                  className={`${adminButtonClass} w-full justify-start text-left`}
                  onClick={() => {
                    setSelected(department.id)
                    setSelectedName(department.name)
                    setOpen(false)
                  }}
                >
                  {department.code}
                  {' · '}
                  {department.name}
                </button>
              </li>
            ))}
          </ul>
          <AdminPagination
            pagination={query.data?.data?.pagination}
            onPageChange={setPage}
            disabled={query.isFetching}
          />
        </AdminQueryState>
      )}
    </div>
  )
}
