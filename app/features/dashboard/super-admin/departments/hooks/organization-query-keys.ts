import { getOnboardingChecklistGetQueryKey } from '~/shared/api/generated/operations/onboarding/onboarding-checklist-get'
import { getSuperAdminWatchGetQueryKey } from '~/shared/api/generated/operations/super-admin-watch/super-admin-watch-get'

export const organizationSummaryQueryKeys = [getOnboardingChecklistGetQueryKey(), getSuperAdminWatchGetQueryKey()]
