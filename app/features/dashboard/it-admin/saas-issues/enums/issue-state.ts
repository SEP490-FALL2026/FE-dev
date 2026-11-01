import { SaasIssueResponseDtoDataState } from '~/shared/api/generated/model/saas-issues/saasIssueResponseDtoDataState'
export const ISSUE_STATE = SaasIssueResponseDtoDataState
export type IssueState = (typeof ISSUE_STATE)[keyof typeof ISSUE_STATE]
export function knownIssueState(value: string): value is IssueState {
  return Object.hasOwn(ISSUE_STATE, value)
}
// BRD transitions: terminal states are never reopened through the transition endpoint.
export function nextIssueStates(state: string): IssueState[] {
  switch (state) {
    case ISSUE_STATE.NEW:
      return [ISSUE_STATE.IN_PROGRESS]
    case ISSUE_STATE.IN_PROGRESS:
      return [ISSUE_STATE.WAITING_REPORTER, ISSUE_STATE.WAITING_PROVIDER, ISSUE_STATE.RESOLVED]
    case ISSUE_STATE.WAITING_REPORTER:
    case ISSUE_STATE.WAITING_PROVIDER:
      return [ISSUE_STATE.IN_PROGRESS, ISSUE_STATE.RESOLVED]
    default:
      return []
  }
}
