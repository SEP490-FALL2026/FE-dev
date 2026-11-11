import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  departmentTechnicalMemberList,
  getDepartmentTechnicalMemberListQueryKey
} from '~/shared/api/generated/operations/departments/department-technical-member-list'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import {
  departmentList,
  getDepartmentListQueryKey
} from '~/shared/api/generated/operations/departments/department-list'

// These endpoints do not all support department filtering. Collect every page
// before applying the UI scope so later pages and totals remain correct.
export async function allProvisioningPages<T>(
  load: (page: number) => Promise<{ data: { items: T[]; pagination: { totalPages: number } } | null }>
): Promise<T[]> {
  const first = await load(1)
  if (!first.data) throw new Error('Missing provisioning page')
  const items = [...first.data.items]
  for (let page = 2; page <= first.data.pagination.totalPages; page++) {
    const next = await load(page)
    if (!next.data) throw new Error('Missing provisioning page')
    items.push(...next.data.items)
  }
  return items
}

export function useProvisioningDepartments() {
  const me = useMeGet({ query: { staleTime: 60000 } })
  const employeeId = me.data?.data?.employee?.id
  const authorized = me.data?.data?.roles.includes('IT_ADMIN') === true
  const departments = useQuery({
    queryKey: [...getDepartmentListQueryKey(), 'provisioning-responsibility', employeeId],
    queryFn: async () => {
      const items = await allProvisioningPages((page) => departmentList({ page, pageSize: 100 }))
      return items.filter((item) => item.itAdmin?.employeeId === employeeId && item.itAdmin?.usable)
    },
    enabled: authorized && !!employeeId
  })
  return { me, departments, authorized }
}

export function provisioningMembersQueryOptions(departmentId: string) {
  return queryOptions({
    queryKey: [...getDepartmentTechnicalMemberListQueryKey(departmentId), 'all-pages'],
    queryFn: () => allProvisioningPages((page) => departmentTechnicalMemberList(departmentId, { page, pageSize: 100 }))
  })
}
