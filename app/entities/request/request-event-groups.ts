import type { RequestEventPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/access-requests/requestEventPageResponseDtoDataItemsItem'
import { RequestEventPageResponseDtoDataItemsItemKind as EventKind } from '~/shared/api/generated/model/access-requests/requestEventPageResponseDtoDataItemsItemKind'

export type RequestEvent = RequestEventPageResponseDtoDataItemsItem

/** Presentation groups within one server page; the original event order and records are preserved. */
export function groupRequestEvents(events: readonly RequestEvent[]): RequestEvent[][] {
  const groups: RequestEvent[][] = []
  for (const event of events) {
    const previous = groups.at(-1)
    const first = previous?.[0]
    const isMemberDecision = event.kind === EventKind.LINE_NEED_DECIDED || event.kind === EventKind.LINE_SPEND_DECIDED
    const minute = Math.floor(Date.parse(event.occurredAt) / 60_000)
    if (
      previous &&
      isMemberDecision &&
      event.line &&
      event.actor &&
      first?.line &&
      first.actor &&
      event.kind === first.kind &&
      event.actor.employeeId === first.actor.employeeId &&
      event.actorKind === first.actorKind &&
      event.actorRole === first.actorRole &&
      Number.isFinite(minute) &&
      minute === Math.floor(Date.parse(first.occurredAt) / 60_000) &&
      !previous.some((item) => item.line?.employeeId === event.line?.employeeId)
    ) {
      previous.push(event)
    } else {
      groups.push([event])
    }
  }
  return groups
}
