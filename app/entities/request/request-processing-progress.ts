import type { RequestTimingsResponseDtoDataTimings } from '~/shared/api/generated/model/access-requests/requestTimingsResponseDtoDataTimings'
import { ACCESS_REQUEST_STATE, type AccessRequestState } from './enums/access-request-state'

const segmentOrder = ['NEED', 'IT_ASSESSMENT', 'QUEUE_WAIT', 'SPEND_DECISION', 'GRANT'] as const
export type RequestProgressKind = 'SUBMITTED' | (typeof segmentOrder)[number]
export type RequestProgressPhase =
  'closed' | 'active' | 'recorded' | 'rejected' | 'failed' | 'stopped' | 'revision' | 'closing'
export interface RequestProgressStep {
  kind: RequestProgressKind
  startedAt: string
  endedAt: string | null
  phase: RequestProgressPhase
}

/** Segments are the latest recorded occurrence of each kind, not a list of future stages. */
export function requestProcessingSteps(
  timings: RequestTimingsResponseDtoDataTimings,
  state?: AccessRequestState
): RequestProgressStep[] {
  const segments = segmentOrder
    .flatMap((kind) => {
      const segment = timings.segments[kind]
      return segment ? [{ kind, ...segment }] : []
    })
    .sort((left, right) => Date.parse(left.startedAt) - Date.parse(right.startedAt))
  let activeIndex = -1
  segments.forEach((segment, index) => {
    if (!segment.endedAt) activeIndex = index
  })
  const steps: RequestProgressStep[] = [
    { kind: 'SUBMITTED', startedAt: timings.submittedAt, endedAt: null, phase: 'closed' },
    ...segments.map((segment, index): RequestProgressStep => ({
      kind: segment.kind,
      startedAt: segment.startedAt,
      endedAt: segment.endedAt,
      phase: segment.endedAt ? 'closed' : index === activeIndex ? 'active' : 'recorded'
    }))
  ]
  const last = steps[steps.length - 1]
  if (state === ACCESS_REQUEST_STATE.REJECTED || state === ACCESS_REQUEST_STATE.IT_REJECTED) last.phase = 'rejected'
  else if (state === ACCESS_REQUEST_STATE.FAILED) last.phase = 'failed'
  else if (state === ACCESS_REQUEST_STATE.WITHDRAWN || state === ACCESS_REQUEST_STATE.CANCELLED) last.phase = 'stopped'
  else if (state === ACCESS_REQUEST_STATE.AWAITING_REQUESTER_REVISION) last.phase = 'revision'
  else if (state === ACCESS_REQUEST_STATE.AWAITING_IT_CLOSE) last.phase = 'closing'
  else if (state === ACCESS_REQUEST_STATE.COMPLETED) last.phase = 'closed'
  // Historical open segments must not compete with the request's final or paused state.
  if (
    state &&
    [
      ACCESS_REQUEST_STATE.COMPLETED,
      ACCESS_REQUEST_STATE.REJECTED,
      ACCESS_REQUEST_STATE.IT_REJECTED,
      ACCESS_REQUEST_STATE.FAILED,
      ACCESS_REQUEST_STATE.WITHDRAWN,
      ACCESS_REQUEST_STATE.CANCELLED,
      ACCESS_REQUEST_STATE.AWAITING_REQUESTER_REVISION,
      ACCESS_REQUEST_STATE.AWAITING_IT_CLOSE
    ].some((value) => value === state)
  ) {
    for (const step of steps) if (step.phase === 'active') step.phase = 'recorded'
  }
  return steps
}
