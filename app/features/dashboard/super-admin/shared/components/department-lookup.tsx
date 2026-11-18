import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  departmentList,
  getDepartmentListQueryKey
} from '~/shared/api/generated/operations/departments/department-list'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import { AdminSelect } from './admin-select'
import { AdminQueryState } from './admin-query-state'

export function DepartmentLookup({
  name,
  required = true,
  initial = '',
  initialLabel = '',
  descriptionId
}: {
  name: string
  required?: boolean
  initial?: string
  initialLabel?: string
  descriptionId?: string
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
  const options = items.map((department) => ({
    value: department.id,
    label: department.name,
    description: department.code
  }))
  return (
    <div className='grid gap-2'>
      <AdminSelect
        aria-label={translate(name === 'toDepartmentId' ? 'fields.toDepartmentId' : 'fields.departmentId')}
        name={name}
        required={required}
        value={selected}
        onChange={setSelected}
        options={options}
        loading={query.isFetching}
        clearable={!required}
        descriptionId={descriptionId}
        selectedLabel={
          selected && selected === initial
            ? initialLabel ||
              (initialData ? `${initialData.name} · ${initialData.code}` : translate('currentSelection'))
            : undefined
        }
        placeholder={translate('ui.pickDepartment')}
        emptyText={translate('ui.noDepartmentMatch')}
      />
      {(query.isPending || query.isError) && <AdminQueryState query={query}>{null}</AdminQueryState>}
      {initialDepartment.isError && selected === initial && !initialLabel && (
        <AdminQueryState query={initialDepartment}>{null}</AdminQueryState>
      )}
    </div>
  )
}
