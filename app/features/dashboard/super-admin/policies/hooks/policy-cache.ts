import { getPolicyListQueryKey } from '~/shared/api/generated/operations/policies/policy-list'
import { getPolicyDraftGetQueryKey } from '~/shared/api/generated/operations/policies/policy-draft-get'
import { getPolicyGetQueryKey } from '~/shared/api/generated/operations/policies/policy-get'
import { getPolicyVersionListQueryKey } from '~/shared/api/generated/operations/policies/policy-version-list'
import { getPolicyAcknowledgementReportQueryKey } from '~/shared/api/generated/operations/policies/policy-acknowledgement-report'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'

export const policyWriteKeys = (code: string) => [
  getPolicyListQueryKey(),
  getPolicyDraftGetQueryKey(code),
  getPolicyGetQueryKey(code),
  getPolicyVersionListQueryKey(code),
  getPolicyAcknowledgementReportQueryKey(code),
  getMeGetQueryKey()
]
