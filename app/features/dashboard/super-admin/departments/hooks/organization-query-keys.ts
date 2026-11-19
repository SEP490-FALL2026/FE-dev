import { getOnboardingChecklistGetQueryKey } from '~/shared/api/generated/operations/onboarding/onboarding-checklist-get'
import { getSuperAdminWatchGetQueryKey } from '~/shared/api/generated/operations/super-admin-watch/super-admin-watch-get'
import { getSuperAdminDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/super-admin-dashboard-get'
import { getEmployeeListQueryKey } from '~/shared/api/generated/operations/employees/employee-list'

export const organizationSummaryQueryKeys = [
  getOnboardingChecklistGetQueryKey(),
  getSuperAdminWatchGetQueryKey(),
  getSuperAdminDashboardGetQueryKey(),
  getEmployeeListQueryKey()
]
