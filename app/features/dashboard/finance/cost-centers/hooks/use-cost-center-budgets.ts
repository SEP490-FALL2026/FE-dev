import { useQuery } from '@tanstack/react-query'
import { budgetTable, getBudgetTableQueryKey } from '~/shared/api/generated/operations/budgets/budget-table'
import {
  budgetVersionList,
  getBudgetVersionListQueryKey
} from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import { allPagesSize, readAllPages } from '../../shared/read-all-pages'

/** Current budget of every cost center for a year, keyed by cost center id (the budget table has no cost center filter). */
export function useCurrentBudgetsByCostCenter(year: number | undefined) {
  return useQuery({
    queryKey: [...getBudgetTableQueryKey({ year }), 'by-cost-center'],
    enabled: year !== undefined,
    queryFn: async ({ signal }) => {
      const result = await readAllPages((page) =>
        budgetTable({ year, page, pageSize: allPagesSize }, undefined, signal)
      )
      return { byCostCenter: new Map(result.items.map((row) => [row.costCenter.id, row])), truncated: result.truncated }
    }
  })
}

/** Every budget version of one cost center, newest year and number first (the version list has no cost center filter). */
export function useCostCenterVersions(costCenterId: string) {
  return useQuery({
    queryKey: [...getBudgetVersionListQueryKey(), 'cost-center', costCenterId],
    queryFn: async ({ signal }) => {
      const result = await readAllPages((page) =>
        budgetVersionList({ page, pageSize: allPagesSize }, undefined, signal)
      )
      const items = result.items
        .filter((version) => version.costCenter.id === costCenterId)
        .sort((left, right) => right.year - left.year || right.number - left.number)
      return { items, truncated: result.truncated }
    }
  })
}
