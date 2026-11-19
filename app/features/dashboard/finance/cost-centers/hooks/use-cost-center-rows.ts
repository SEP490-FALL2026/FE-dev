import { useQuery } from '@tanstack/react-query'
import type { CostCenterPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/cost-centers'
import {
  costCenterList,
  getCostCenterListQueryKey,
  useCostCenterList
} from '~/shared/api/generated/operations/cost-centers'
import { allPagesSize, readAllPages } from '../../shared/read-all-pages'
import { normalizeSearchText } from '../../shared/hooks/use-cost-center-label'
import type { CostCenterListStatus } from '../enums/cost-center-status'

type Item = CostCenterPageResponseDtoDataItemsItem
const pageSize = 20

/**
 * Cost centers for the list. Without a search the server pages the list. With a search every cost center is read and
 * matched here by code and name, in either language and ignoring case and accents, which the server search does not.
 */
export function useCostCenterRows({
  status,
  search,
  page,
  label
}: {
  status: CostCenterListStatus | ''
  search: string
  page: number
  label: (item: Item) => string
}) {
  const searching = normalizeSearchText(search) !== ''
  const paged = useCostCenterList({ status: status || undefined, page, pageSize }, { query: { enabled: !searching } })
  const all = useQuery({
    queryKey: [...getCostCenterListQueryKey({ status: status || undefined, pageSize: allPagesSize }), 'all'],
    enabled: searching,
    queryFn: ({ signal }) =>
      readAllPages((current) =>
        costCenterList({ status: status || undefined, page: current, pageSize: allPagesSize }, undefined, signal)
      )
  })
  if (!searching) {
    return {
      query: paged,
      items: paged.data?.data?.items ?? [],
      pagination: paged.data?.data?.pagination,
      truncated: false
    }
  }
  const wanted = normalizeSearchText(search)
  const matches = (all.data?.items ?? []).filter((item) =>
    normalizeSearchText([item.code, item.name, label(item), item.department?.name ?? ''].join(' ')).includes(wanted)
  )
  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize))
  const current = Math.min(page, totalPages)
  return {
    query: all,
    items: matches.slice((current - 1) * pageSize, current * pageSize),
    pagination: { page: current, pageSize, totalItems: matches.length, totalPages },
    truncated: all.data?.truncated ?? false
  }
}
