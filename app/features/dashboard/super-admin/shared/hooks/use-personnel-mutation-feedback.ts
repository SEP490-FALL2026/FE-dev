import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { getAppUserListQueryKey, getAccountCandidatesListQueryKey } from '~/shared/api/generated/operations/app-users'
import { getDepartmentListQueryKey } from '~/shared/api/generated/operations/departments'
import { getOnboardingChecklistGetQueryKey } from '~/shared/api/generated/operations/onboarding'
import { getSuperAdminWatchGetQueryKey } from '~/shared/api/generated/operations/super-admin-watch'
import { getDepartmentTransferListQueryKey } from '~/shared/api/generated/operations/department-transfers'
import { getLongLeaveListQueryKey } from '~/shared/api/generated/operations/long-leaves'
import { getOffboardingCaseListQueryKey } from '~/shared/api/generated/operations/offboarding-cases'
import { useAdminMutationFeedback } from './use-admin-mutation-feedback'

/** HR events change employee state, account eligibility, department duties and overview warnings together. */
export function usePersonnelMutationFeedback(queryKeys: readonly QueryKey[], onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const cachedEmployeeViews = queryClient
    .getQueryCache()
    .findAll({
      predicate: (query) =>
        typeof query.queryKey[0] === 'string' &&
        /\/api\/v1\/(departments|app-users|department-transfers|long-leaves|offboarding-cases)\//.test(
          query.queryKey[0]
        )
    })
    .map((query) => query.queryKey)
  return useAdminMutationFeedback(
    [
      ...queryKeys,
      ...cachedEmployeeViews,
      getAppUserListQueryKey(),
      getAccountCandidatesListQueryKey(),
      getDepartmentListQueryKey(),
      getOnboardingChecklistGetQueryKey(),
      getSuperAdminWatchGetQueryKey(),
      getDepartmentTransferListQueryKey(),
      getLongLeaveListQueryKey(),
      getOffboardingCaseListQueryKey()
    ],
    onSuccess
  )
}
