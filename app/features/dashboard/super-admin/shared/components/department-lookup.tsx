import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  departmentList,
  getDepartmentListQueryKey
} from '~/shared/api/generated/operations/departments/department-list'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import { adminInputClass } from './admin-form'
import { AdminQueryState } from './admin-query-state'

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
  const query = useQuery({
    queryKey: [...getDepartmentListQueryKey(), 'active-department-select'],
    queryFn: async ({ signal }) => {
      const items = []
      let page = 1
      let totalPages: number
      do {
        const response = await departmentList({ page, pageSize: 100, status: 'ACTIVE' }, undefined, signal)
        if (!response.data) throw new Error('Department list unavailable')
        items.push(...response.data.items)
        totalPages = response.data.pagination.totalPages
        page += 1
      } while (page <= totalPages)
      return items
    }
  })
  const initialDepartment = useDepartmentGet(initial, {
    query: { enabled: Boolean(initial && !initialLabel && selected === initial) }
  })
  const initialData = initialDepartment.data?.data
  const items = query.data ?? []
  return (
    <div className='grid gap-2'>
      <select
        aria-label={translate(name === 'toDepartmentId' ? 'fields.toDepartmentId' : 'fields.departmentId')}
        className={adminInputClass}
        name={name}
        required={required}
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        aria-busy={query.isFetching}
      >
        <option value=''>{translate(required ? 'choose' : 'noSelection')}</option>
        {initial && selected === initial && !items.some((item) => item.id === initial) && (
          <option value={initial}>
            {initialLabel ||
              (initialData ? `${initialData.code} · ${initialData.name}` : translate('currentSelection'))}
          </option>
        )}
        {items.map((department) => (
          <option key={department.id} value={department.id}>
            {department.code} · {department.name}
          </option>
        ))}
      </select>
      {(query.isPending || query.isError) && <AdminQueryState query={query}>{null}</AdminQueryState>}
      {initialDepartment.isError && selected === initial && !initialLabel && (
        <AdminQueryState query={initialDepartment}>{null}</AdminQueryState>
      )}
    </div>
  )
}
