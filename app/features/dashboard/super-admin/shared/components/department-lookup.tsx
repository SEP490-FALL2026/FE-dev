import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentGet, useDepartmentList } from '~/shared/api/generated/operations/departments'
import { adminInputClass, adminButtonClass } from './admin-form'
import { AdminEmpty, AdminQueryState } from './admin-query-state'
import { AdminPagination } from './admin-pagination'

/** Resolve one initial reference and browse server-paged departments by name. */
export function DepartmentLookup({
  name,
  required = true,
  initial = '',
  initialLabel = ''
}: {
  name: string
  required?: boolean
  initial?: string
  initialLabel?: string
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const [selected, setSelected] = useState(initial)
  const [selectedName, setSelectedName] = useState(initialLabel)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const query = useDepartmentList({ page, pageSize: 20, status: 'ACTIVE' }, { query: { enabled: open } })
  const initialDepartment = useDepartmentGet(initial, {
    query: { enabled: Boolean(initial && !initialLabel && selected === initial) }
  })
  const initialData = initialDepartment.data?.data
  const displayName =
    selectedName ||
    (initialData && selected === initial ? `${initialData.code} · ${initialData.name}` : translate('currentSelection'))
  return (
    <div className='grid gap-2'>
      <select
        aria-label={translate(name === 'toDepartmentId' ? 'fields.toDepartmentId' : 'fields.departmentId')}
        className={adminInputClass}
        name={name}
        required={required}
        value={selected}
        onChange={() => {
          setSelected('')
          setSelectedName('')
        }}
      >
        <option value=''>{translate(required ? 'choose' : 'noSelection')}</option>
        {selected && <option value={selected}>{displayName}</option>}
      </select>
      {initialDepartment.isError && selected === initial && (
        <AdminQueryState query={initialDepartment}>{null}</AdminQueryState>
      )}
      <button type='button' aria-expanded={open} className={adminButtonClass} onClick={() => setOpen(!open)}>
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
                    setSelectedName(`${department.code} · ${department.name}`)
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
