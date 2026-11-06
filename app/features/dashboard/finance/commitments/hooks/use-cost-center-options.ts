import { useQuery } from '@tanstack/react-query'
import type { CostCenterPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/cost-centers'
import {
  costCenterList,
  getCostCenterListQueryKey
} from '~/shared/api/generated/operations/cost-centers/cost-center-list'

const pickerPageSize = 100
/** The catalogue holds one cost center per department; past this many pages the picker says it is incomplete. */
const pickerMaxPages = 10

async function readCostCenters(signal: AbortSignal) {
  const items: CostCenterPageResponseDtoDataItemsItem[] = []
  for (let page = 1; page <= pickerMaxPages; page += 1) {
    const response = await costCenterList({ page, pageSize: pickerPageSize }, undefined, signal)
    items.push(...(response.data?.items ?? []))
    if (page >= (response.data?.pagination.totalPages ?? 1)) return { items, truncated: false }
  }
  return { items, truncated: true }
}

/** Every cost center for the commitment filter, sorted by code. */
export function useCostCenterOptions() {
  return useQuery({
    queryKey: [...getCostCenterListQueryKey({ pageSize: pickerPageSize }), 'all-pages'],
    queryFn: ({ signal }) => readCostCenters(signal),
    select: (result) => ({
      costCenters: [...result.items].sort((left, right) => left.code.localeCompare(right.code)),
      truncated: result.truncated
    })
  })
}
