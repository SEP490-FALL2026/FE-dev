import { useState } from 'react'
import { useAppUserList, getAppUserListQueryKey } from '~/shared/api/generated/operations/app-users/app-user-list'
import { getAccountCandidatesListQueryKey } from '~/shared/api/generated/operations/app-users/account-candidates-list'
import { getApprovalRoleListQueryKey } from '~/shared/api/generated/operations/approval-roles/approval-role-list'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'
import { getSuperAdminWatchGetQueryKey } from '~/shared/api/generated/operations/super-admin-watch/super-admin-watch-get'
import { getAppUserGetQueryKey } from '~/shared/api/generated/operations/app-users/app-user-get'
import { getOnboardingChecklistGetQueryKey } from '~/shared/api/generated/operations/onboarding/onboarding-checklist-get'
import { getDepartmentListQueryKey } from '~/shared/api/generated/operations/departments/department-list'
import type { AppUserListParams } from '~/shared/api/generated/model'

export function accountWriteKeys(id?: string) {
  return [
    getAppUserListQueryKey(),
    getAccountCandidatesListQueryKey(),
    getApprovalRoleListQueryKey(),
    getMeGetQueryKey(),
    getSuperAdminWatchGetQueryKey(),
    getOnboardingChecklistGetQueryKey(),
    getDepartmentListQueryKey(),
    ...(id ? [getAppUserGetQueryKey(id)] : [])
  ]
}

export function useSuperAdminAccounts() {
  const [filters, setFilters] = useState<AppUserListParams>({ page: 1, pageSize: 20 })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [tab, setTab] = useState<'accounts' | 'responsibilities'>('accounts')
  const query = useAppUserList(filters, { query: { retry: false } })
  const changeFilter = (next: Partial<AppUserListParams>) =>
    setFilters((previous) => ({ ...previous, ...next, page: 1 }))
  return { filters, setFilters, changeFilter, selectedId, setSelectedId, inviteOpen, setInviteOpen, tab, setTab, query }
}
