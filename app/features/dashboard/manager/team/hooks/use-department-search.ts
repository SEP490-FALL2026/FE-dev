import { useQuery } from '@tanstack/react-query'
import {
  departmentMemberList,
  getDepartmentMemberListQueryKey
} from '~/shared/api/generated/operations/departments/department-member-list'
import {
  departmentToolsInUse,
  getDepartmentToolsInUseQueryKey
} from '~/shared/api/generated/operations/departments/department-tools-in-use'

async function loadPages<T>(
  load: (page: number) => Promise<{ data?: { items: T[]; pagination: { totalPages: number } } | null }>
) {
  const first = await load(1)
  if (!first.data) throw new Error('Missing department list data')
  const items = [...first.data.items]
  for (let page = 2; page <= first.data.pagination.totalPages; page++) {
    const next = await load(page)
    if (!next.data) throw new Error('Missing department list data')
    items.push(...next.data.items)
  }
  return items
}

export function useDepartmentMemberSearch(departmentId: string, enabled: boolean) {
  return useQuery({
    queryKey: [...getDepartmentMemberListQueryKey(departmentId), 'search-index'],
    enabled,
    staleTime: 30000,
    queryFn: ({ signal }) =>
      loadPages((page) => departmentMemberList(departmentId, { page, pageSize: 100 }, undefined, signal))
  })
}
export function useDepartmentToolSearch(departmentId: string, enabled: boolean) {
  return useQuery({
    queryKey: [...getDepartmentToolsInUseQueryKey(departmentId), 'search-index'],
    enabled,
    staleTime: 30000,
    queryFn: ({ signal }) =>
      loadPages((page) => departmentToolsInUse(departmentId, { page, pageSize: 100 }, undefined, signal))
  })
}
function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
}
export function filterDepartmentPage<T>(
  items: readonly T[],
  search: string,
  page: number,
  pageSize: number,
  fields: (item: T) => readonly string[]
) {
  const needle = normalizeSearch(search.trim())
  const matches = items.filter((item) => fields(item).some((value) => normalizeSearch(value).includes(needle)))
  const totalPages = Math.ceil(matches.length / pageSize)
  const currentPage = Math.min(page, Math.max(1, totalPages))
  return {
    items: matches.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    pagination: { page: currentPage, pageSize, totalItems: matches.length, totalPages }
  }
}
