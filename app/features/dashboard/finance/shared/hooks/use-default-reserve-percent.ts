import { useOperatingParameterList } from '~/shared/api/generated/operations/operating-parameters'
import { DEFAULT_RESERVE_PERCENT } from '../finance-validation'

/**
 * Default reserve share of a budget version, read from `BUDGET_RESERVE_DEFAULT_PERCENT` (BE reads the same
 * parameter when a version is sent). While it loads, or when it cannot be read, the documented 10 % stands in.
 */
export function useDefaultReservePercent(): number {
  const query = useOperatingParameterList({ query: { retry: false, staleTime: 60_000 } })
  const raw = query.data?.data?.items?.find((item) => item.key === 'BUDGET_RESERVE_DEFAULT_PERCENT')?.value
  const percent = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN
  return Number.isFinite(percent) && percent >= 0 && percent <= 100 ? percent : DEFAULT_RESERVE_PERCENT
}
