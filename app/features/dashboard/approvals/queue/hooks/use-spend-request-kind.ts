import { useAccessRequestLineList } from '~/shared/api/generated/operations/group-requests/access-request-line-list'
import { getApprovalsError } from '../../shared/approvals-errors'

export type SpendRequestKind = 'single' | 'group'

/**
 * Tells a group request from a one-decision request with data the Spending Approver may read.
 * accessRequestGet is not used: the server refuses it to the holder of the spend step.
 * A named beneficiary means one person. Without one (group or service account), the line list decides:
 * it answers for a group and 404 ACCESS_REQUEST.NOT_FOUND for anything else, since the caller holds the step.
 * The server still checks the decision route (GROUP_NEEDS_LINES), so a wrong guess cannot be saved.
 */
export function useSpendRequestKind(requestId: string, hasBeneficiary: boolean | undefined) {
  const probeEnabled = hasBeneficiary === false
  // Same key as the first page read by useSpendBeneficiaries, so the probe is shared with it, not repeated.
  const probe = useAccessRequestLineList(
    requestId,
    { page: 1, pageSize: 100 },
    { query: { enabled: probeEnabled, retry: false } }
  )
  const notGroup = probe.isError && getApprovalsError(probe.error).key === 'notFound'
  const kind: SpendRequestKind | undefined =
    hasBeneficiary === undefined
      ? undefined
      : hasBeneficiary
        ? 'single'
        : probe.isSuccess
          ? 'group'
          : notGroup
            ? 'single'
            : undefined
  return {
    kind,
    /** The probe failed for another reason (network, server, rights): show it and keep the decision closed. */
    failure: probeEnabled && probe.isError && !notGroup ? probe : undefined,
    isFetching: probeEnabled && probe.isFetching
  }
}
