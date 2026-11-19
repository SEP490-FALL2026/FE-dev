import { useQuery } from '@tanstack/react-query'
import { appUserList, getAppUserListQueryKey } from '~/shared/api/generated/operations/app-users/app-user-list'
import {
  employeeList,
  getEmployeeListQueryKey,
  useEmployeeList
} from '~/shared/api/generated/operations/employees/employee-list'
import type { AppUserListRole, EmployeeListParams } from '~/shared/api/generated/model'

export function useEmployeeDirectory(params: EmployeeListParams, role: AppUserListRole | '') {
  const employees = useEmployeeList(params, { query: { enabled: !role } })
  const accounts = useQuery({
    queryKey: [...getAppUserListQueryKey(), 'directory-roles'],
    queryFn: async ({ signal }) => {
      const items = []
      let page = 1
      let totalPages: number
      do {
        const response = await appUserList({ page, pageSize: 100 }, undefined, signal)
        if (!response.data) throw new Error('Account list is unavailable')
        items.push(...response.data.items)
        totalPages = response.data.pagination.totalPages
        page += 1
      } while (page <= totalPages)
      return items
    }
  })
  const { page = 1, pageSize = 20, ...filters } = params
  const filteredEmployees = useQuery({
    queryKey: [...getEmployeeListQueryKey(), 'directory-role-filter', filters],
    enabled: !!role,
    queryFn: async ({ signal }) => {
      const items = []
      let current = 1
      let totalPages: number
      do {
        const response = await employeeList({ ...filters, page: current, pageSize: 100 }, undefined, signal)
        if (!response.data) throw new Error('Employee list is unavailable')
        items.push(...response.data.items)
        totalPages = response.data.pagination.totalPages
        current += 1
      } while (current <= totalPages)
      return items
    }
  })
  const active = role ? filteredEmployees : employees
  const byEmployee = new Map(
    (accounts.data ?? []).filter((account) => account.employee).map((account) => [account.employee!.id, account])
  )
  const matching = role
    ? (filteredEmployees.data ?? []).filter((employee) => byEmployee.get(employee.id)?.roles.includes(role))
    : []
  const items = role ? matching.slice((page - 1) * pageSize, page * pageSize) : (employees.data?.data?.items ?? [])
  const pagination = role
    ? { page, pageSize, totalItems: matching.length, totalPages: Math.ceil(matching.length / pageSize) }
    : employees.data?.data?.pagination
  return {
    items,
    pagination,
    byEmployee,
    isPending: active.isPending || accounts.isPending,
    isError: active.isError || accounts.isError,
    error: active.error ?? accounts.error,
    isFetching: active.isFetching || accounts.isFetching,
    refetch: () => {
      void active.refetch()
      void accounts.refetch()
    }
  }
}
