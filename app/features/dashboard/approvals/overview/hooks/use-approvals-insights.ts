import { useQuery } from '@tanstack/react-query'
import {
  getSpendApprovalListQueryKey,
  spendApprovalList
} from '~/shared/api/generated/operations/spend-approvals/spend-approval-list'
import {
  budgetVersionList,
  getBudgetVersionListQueryKey
} from '~/shared/api/generated/operations/budget-versions/budget-version-list'

/** The largest page the list contracts accept. */
const PAGE_SIZE = 100
/** Reading stops here; the result then says it is incomplete instead of passing as the full total. */
export const INSIGHT_PAGE_LIMIT = 10

interface Page<Item> {
  items: Item[]
  pagination: { totalItems: number; totalPages: number }
}

export interface AllPages<Item> {
  items: Item[]
  totalItems: number
  complete: boolean
}

async function readAllPages<Item>(fetchPage: (page: number) => Promise<Page<Item> | null | undefined>) {
  const first = await fetchPage(1)
  if (!first) throw new Error('EMPTY_LIST_RESPONSE')
  const pageCount = Math.min(first.pagination.totalPages, INSIGHT_PAGE_LIMIT)
  const rest = await Promise.all(Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => fetchPage(index + 2)))
  if (rest.some((page) => !page)) throw new Error('EMPTY_LIST_RESPONSE')
  const items = [first, ...rest].flatMap((page) => page?.items ?? [])
  return {
    items,
    totalItems: first.pagination.totalItems,
    complete: items.length >= first.pagination.totalItems
  } satisfies AllPages<Item>
}

/** Every spend step waiting for me; the key starts with the list URL so decisions invalidate it. */
export function useAllSpendApprovals() {
  return useQuery({
    queryKey: [...getSpendApprovalListQueryKey(), 'all-pages'],
    queryFn: ({ signal }) =>
      readAllPages(async (page) => (await spendApprovalList({ page, pageSize: PAGE_SIZE }, undefined, signal)).data)
  })
}

/** Every budget version of one year, whatever its state. */
export function useYearBudgetVersions(year: number) {
  return useQuery({
    queryKey: [...getBudgetVersionListQueryKey({ year }), 'all-pages'],
    queryFn: ({ signal }) =>
      readAllPages(
        async (page) => (await budgetVersionList({ year, page, pageSize: PAGE_SIZE }, undefined, signal)).data
      )
  })
}
