import { useQuery } from '@tanstack/react-query'
import { departmentList, getDepartmentListQueryKey } from '~/shared/api/generated/operations/departments'

// Checklist warnings expose a code, while department detail requires an ID.
export function useDepartmentByCode(code: string | null) {
  return useQuery({
    queryKey: [...getDepartmentListQueryKey(), { resolveCode: code }],
    enabled: Boolean(code),
    queryFn: async ({ signal }) => {
      if (!code) return null
      let page = 1
      let totalPages: number
      do {
        const response = await departmentList({ search: code, page, pageSize: 100 }, undefined, signal)
        if (!response.data) return null
        const department = response.data.items.find((item) => item.code === code)
        if (department) return department
        totalPages = response.data.pagination.totalPages
        page += 1
      } while (page <= totalPages)
      return null
    }
  })
}
