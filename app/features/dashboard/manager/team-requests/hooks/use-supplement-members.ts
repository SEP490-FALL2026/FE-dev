import { useQuery } from '@tanstack/react-query'
import {
  accessRequestLineList,
  getAccessRequestLineListQueryKey
} from '~/shared/api/generated/operations/group-requests/access-request-line-list'
import { LinesResponseDtoDataItemsItemState } from '~/shared/api/generated/model/group-requests/linesResponseDtoDataItemsItemState'

export function useSupplementMembers(id: string, enabled: boolean) {
  const query = useQuery({
    queryKey: [...getAccessRequestLineListQueryKey(id), 'supplement-members'],
    enabled,
    queryFn: async ({ signal }) => {
      const first = await accessRequestLineList(id, { page: 1, pageSize: 100 }, undefined, signal)
      if (!first.data) throw new Error('REQUEST_MEMBERS_UNAVAILABLE')
      const items = [...first.data.items]
      for (let page = 2; page <= first.data.pagination.totalPages; page++) {
        const next = await accessRequestLineList(id, { page, pageSize: 100 }, undefined, signal)
        if (!next.data) throw new Error('REQUEST_MEMBERS_UNAVAILABLE')
        items.push(...next.data.items)
      }
      return items.filter((line) => line.state === LinesResponseDtoDataItemsItemState.NEED_CONFIRMED)
    }
  })
  return { query, members: !query.isError ? (query.data ?? []) : [] }
}
