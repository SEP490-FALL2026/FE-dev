import { useQuery } from '@tanstack/react-query'
import type { MySoftwarePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/me/mySoftwarePageResponseDtoDataItemsItem'
import {
  getMeSoftwareRightListQueryKey,
  meSoftwareRightList
} from '~/shared/api/generated/operations/me/me-software-right-list'
import type { RequestMode } from './use-live-request-form'
import { REQUEST_ASSIGNMENT_STATUS, REQUEST_ASSIGNMENT_VIEW } from '../enums/request-assignment'

export function canSelectRequestAssignment(item: MySoftwarePageResponseDtoDataItemsItem, mode: RequestMode) {
  // This list exposes no pending-request flags. Final eligibility remains a server check.
  const held = item.status === REQUEST_ASSIGNMENT_STATUS.ACTIVE || item.status === REQUEST_ASSIGNMENT_STATUS.EXPIRED
  return held && (mode === 'return' || (mode === 'renewal' && !!item.expectedEndDate && !item.successorAssignmentId))
}
export function useRequestAssignments(mode: RequestMode) {
  const query = useQuery({
    queryKey: [...getMeSoftwareRightListQueryKey({ view: REQUEST_ASSIGNMENT_VIEW.current }), 'request-picker'],
    enabled: mode === 'renewal' || mode === 'return',
    queryFn: async ({ signal }) => {
      const first = await meSoftwareRightList(
        { view: REQUEST_ASSIGNMENT_VIEW.current, page: 1, pageSize: 100 },
        undefined,
        signal
      )
      if (!first.data) throw new Error('SOFTWARE_RIGHTS_UNAVAILABLE')
      const items = new Map(first.data.items.map((item) => [item.assignmentId, item]))
      for (let page = 2; page <= first.data.pagination.totalPages; page++) {
        const next = await meSoftwareRightList(
          { view: REQUEST_ASSIGNMENT_VIEW.current, page, pageSize: 100 },
          undefined,
          signal
        )
        if (!next.data) throw new Error('SOFTWARE_RIGHTS_UNAVAILABLE')
        for (const item of next.data.items) items.set(item.assignmentId, item)
      }
      return { items: [...items.values()], asOf: first.data.asOf }
    }
  })
  const items = !query.isError ? (query.data?.items ?? []).filter((item) => canSelectRequestAssignment(item, mode)) : []
  return { query, items, asOf: query.data?.asOf, mode }
}
