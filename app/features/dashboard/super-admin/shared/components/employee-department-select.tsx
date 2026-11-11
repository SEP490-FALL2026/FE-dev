import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import {
  departmentList,
  getDepartmentListQueryKey
} from '~/shared/api/generated/operations/departments/department-list'
import { AdminQueryState } from './admin-query-state'
import { adminInputClass } from './admin-form'

export function EmployeeDepartmentSelect({
  onReadyChange,
  mode = 'create'
}: {
  onReadyChange?: (ready: boolean) => void
  mode?: 'create' | 'filter'
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const query = useQuery({
    queryKey: [...getDepartmentListQueryKey(), 'employee-departments', mode],
    queryFn: async ({ signal }) => {
      const items = []
      let page = 1
      let totalPages: number
      do {
        const response = await departmentList(
          { ...(mode === 'create' ? { status: 'ACTIVE' as const } : {}), page, pageSize: 100 },
          undefined,
          signal
        )
        if (!response.data) throw new Error('Department list is unavailable')
        items.push(...response.data.items)
        totalPages = response.data.pagination.totalPages
        page += 1
      } while (page <= totalPages)
      return items
    }
  })
  useEffect(() => {
    onReadyChange?.(query.isSuccess && !query.isFetching)
  }, [onReadyChange, query.isSuccess, query.isFetching])
  return (
    <div className='grid min-w-0 gap-1.5 text-sm font-medium'>
      <label htmlFor='employee-department-code'>
        {translate(mode === 'create' ? 'fields.departmentCode' : 'fields.departmentId')}
      </label>
      <AdminQueryState query={query}>
        <select
          id='employee-department-code'
          name={mode === 'create' ? 'departmentCode' : 'departmentId'}
          defaultValue=''
          className={adminInputClass}
        >
          <option value=''>{translate(mode === 'create' ? 'noSelection' : 'directory.all')}</option>
          {query.data?.map((department) => (
            <option key={department.id} value={mode === 'create' ? department.code : department.id}>
              {department.code} · {department.name}
            </option>
          ))}
        </select>
      </AdminQueryState>
    </div>
  )
}
