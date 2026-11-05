import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { NeedQueueResponseDtoDataItemsItem } from '~/shared/api/generated/model/need-decisions/needQueueResponseDtoDataItemsItem'
import {
  getNeedDecisionListQueryKey,
  needDecisionList
} from '~/shared/api/generated/operations/need-decisions/need-decision-list'

/** Direct links must resolve the same authoritative flags as opening a queue row. */
export function useManagerNeedRequirements(id: string, stepId: string | undefined, enabled: boolean) {
  const client = useQueryClient()
  const cached = client
    .getQueriesData<{ data?: { items?: NeedQueueResponseDtoDataItemsItem[] } | null }>({
      queryKey: getNeedDecisionListQueryKey()
    })
    .flatMap(([, response]) => response?.data?.items ?? [])
    .find((row) => row.requestId === id && row.stepId === stepId)
  const query = useQuery({
    queryKey: [...getNeedDecisionListQueryKey(), 'requirements', id, stepId],
    enabled: enabled && !!stepId && !cached,
    queryFn: async ({ signal }) => {
      let page = 1
      while (true) {
        const response = await needDecisionList({ page, pageSize: 100 }, undefined, signal)
        const match = response.data?.items.find((row) => row.requestId === id && row.stepId === stepId)
        if (match) return match
        if (!response.data || page >= response.data.pagination.totalPages) return null
        page += 1
      }
    }
  })
  return { requirements: cached ?? (!query.isError ? query.data : undefined), query }
}
