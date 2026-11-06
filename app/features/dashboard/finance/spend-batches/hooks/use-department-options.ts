import { useQuery } from '@tanstack/react-query'
import type { CostCenterPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/cost-centers'
import {
  costCenterList,
  getCostCenterListQueryKey
} from '~/shared/api/generated/operations/cost-centers/cost-center-list'

export interface DepartmentOption {
  id: string
  name: string
}

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

/**
 * Finance cannot read the department catalogue, but each department with a budget has a cost center that names it,
 * so the cost center catalogue doubles as the department picker.
 */
export function useDepartmentOptions() {
  return useQuery({
    queryKey: [...getCostCenterListQueryKey({ pageSize: pickerPageSize }), 'all-pages'],
    queryFn: ({ signal }) => readCostCenters(signal),
    select: (result) => {
      const departments = new Map<string, DepartmentOption>()
      for (const center of result.items) {
        if (center.department) departments.set(center.department.id, center.department)
      }
      return {
        departments: [...departments.values()].sort((left, right) => left.name.localeCompare(right.name)),
        truncated: result.truncated
      }
    }
  })
}
