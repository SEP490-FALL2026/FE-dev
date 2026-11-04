import { useState } from 'react'
import { useAppUserList, getAppUserListQueryKey } from '~/shared/api/generated/operations/app-users/app-user-list'
import { getAccountCandidatesListQueryKey } from '~/shared/api/generated/operations/app-users/account-candidates-list'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'
import { getSuperAdminWatchGetQueryKey } from '~/shared/api/generated/operations/super-admin-watch/super-admin-watch-get'
import { getAppUserGetQueryKey } from '~/shared/api/generated/operations/app-users/app-user-get'
import { getOnboardingChecklistGetQueryKey } from '~/shared/api/generated/operations/onboarding/onboarding-checklist-get'
import { getDepartmentListQueryKey } from '~/shared/api/generated/operations/departments/department-list'
import type { AppUserListParams } from '~/shared/api/generated/model'
import { getEmployeeListQueryKey } from '~/shared/api/generated/operations/employees/employee-list'
import { getEmployeeGetQueryKey } from '~/shared/api/generated/operations/employees/employee-get'
import { getSuperAdminDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/super-admin-dashboard-get'

export function accountWriteKeys(id?: string, employeeId?: string) {
  return [
    getAppUserListQueryKey(),
    getAccountCandidatesListQueryKey(),
    getMeGetQueryKey(),
    getSuperAdminWatchGetQueryKey(),
    getOnboardingChecklistGetQueryKey(),
    getDepartmentListQueryKey(),
    getEmployeeListQueryKey(),
    getSuperAdminDashboardGetQueryKey(),
    ...(employeeId ? [getEmployeeGetQueryKey(employeeId)] : []),
    ...(id ? [getAppUserGetQueryKey(id)] : [])
  ]
}

export function useSuperAdminAccounts(
  initialSelectedId?: string,
  initialTab: 'accounts' | 'responsibilities' = 'accounts',
  initiallyInviteOpen = false
) {
  const [filters, setFilters] = useState<AppUserListParams>({ page: 1, pageSize: 20 })
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null)
  const [inviteOpen, setInviteOpen] = useState(initiallyInviteOpen)
  const [tab, setTab] = useState<'accounts' | 'responsibilities'>(initialTab)
  const query = useAppUserList(filters, { query: { retry: false, enabled: tab === 'accounts' } })
  const changeFilter = (next: Partial<AppUserListParams>) =>
    setFilters((previous) => ({ ...previous, ...next, page: 1 }))
  return { filters, setFilters, changeFilter, selectedId, setSelectedId, inviteOpen, setInviteOpen, tab, setTab, query }
}
