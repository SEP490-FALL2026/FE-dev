import { useSearchParams } from 'react-router'
import { RENEWAL_LATE_FILTER, type RenewalLateFilter } from '../enums/renewal-late-filter'
import { RENEWAL_STATE, type RenewalState } from '../enums/renewal-state'

/** UI-only choice for "no state filter"; never sent to the API. */
export const ALL_STATES = 'ALL'
export type RenewalStateFilter = RenewalState | typeof ALL_STATES

export interface RenewalFilters {
  state: RenewalStateFilter
  late?: RenewalLateFilter
  page: number
}

const states = Object.values(RENEWAL_STATE) as string[]
const lateValues = Object.values(RENEWAL_LATE_FILTER) as string[]

/** List filters live in the URL so "back to list" from a detail screen restores them. */
export function useRenewalFilters() {
  const [searchParams] = useSearchParams()
  const stateParam = searchParams.get('state')
  const lateParam = searchParams.get('late')
  const pageParam = Number(searchParams.get('page'))
  const filters: RenewalFilters = {
    // The approver's queue is the default view: cases waiting for a decision.
    state:
      stateParam === ALL_STATES
        ? ALL_STATES
        : stateParam && states.includes(stateParam)
          ? (stateParam as RenewalState)
          : RENEWAL_STATE.PROPOSED,
    late: lateParam && lateValues.includes(lateParam) ? (lateParam as RenewalLateFilter) : undefined,
    page: Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1
  }
  return filters
}

/** URL params for the list; the default queue state and first page are left implicit. */
export function renewalFilterParams(filters: RenewalFilters): Record<string, string> {
  const params: Record<string, string> = {}
  if (filters.state !== RENEWAL_STATE.PROPOSED) params.state = filters.state
  if (filters.late) params.late = filters.late
  if (filters.page > 1) params.page = String(filters.page)
  return params
}
