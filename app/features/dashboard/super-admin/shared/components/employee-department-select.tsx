import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import {
  departmentList,
  getDepartmentListQueryKey
} from '~/shared/api/generated/operations/departments/department-list'
import { AdminQueryState } from './admin-query-state'
import { AdminSelect } from './admin-select'

export function EmployeeDepartmentSelect({
  onReadyChange,
  mode = 'create',
  error
}: {
  onReadyChange?: (ready: boolean) => void
  mode?: 'create' | 'filter'
  error?: string
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
  const create = mode === 'create'
  return (
    <div className='grid min-w-0 content-start gap-1.5 text-sm font-medium'>
      <label htmlFor={`employee-department-${mode}`}>
        {translate(create ? 'fields.departmentCode' : 'fields.departmentId')}
      </label>
      <AdminQueryState query={query}>
        <AdminSelect
          id={`employee-department-${mode}`}
          aria-describedby={`employee-department-help-${mode}${error ? ` employee-department-error-${mode}` : ''}`}
          invalid={!!error}
          name={create ? 'departmentCode' : 'departmentId'}
          clearable
          options={(query.data ?? []).map((department) => ({
            value: create ? department.code : department.id,
            label: department.name,
            description: department.code
          }))}
          placeholder={translate(create ? 'ui.pickDepartmentOptional' : 'ui.allDepartments')}
          emptyText={translate('ui.noDepartmentMatch')}
        />
      </AdminQueryState>
      <p id={`employee-department-help-${mode}`} className='text-xs leading-relaxed font-normal text-muted-foreground'>
        {translate(create ? 'fieldHelp.departmentCode' : 'fieldHelp.departmentId')}
      </p>
      {error && (
        <p id={`employee-department-error-${mode}`} className='text-xs text-danger'>
          {error}
        </p>
      )}
    </div>
  )
}
