import { useQuery } from '@tanstack/react-query'
import {
  departmentList,
  getDepartmentListQueryKey
} from '~/shared/api/generated/operations/departments/department-list'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'

export function useItManagedDepartments() {
  const me = useMeGet({ query: { staleTime: 60000 } })
  const employeeId = me.data?.data?.employee?.id
  const authorized = me.data?.data?.roles.includes('IT_ADMIN') === true
  const departments = useQuery({
    queryKey: [...getDepartmentListQueryKey(), 'it-managed', employeeId],
    queryFn: async () => {
      const items = []
      let page = 1
      let totalPages = 1
      while (page <= totalPages) {
        const result = await departmentList({ status: 'ACTIVE', page, pageSize: 100 })
        if (!result.data) throw new Error('Missing department page')
        items.push(...result.data.items)
        totalPages = result.data.pagination.totalPages
        page++
      }
      return items.filter((item) => !item.itAdmin?.usable || item.itAdmin.employeeId === employeeId)
    },
    enabled: authorized && !!employeeId
  })
  return { me, departments }
}
