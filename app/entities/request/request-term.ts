export type RequestTerm =
  | { kind: 'MONTHS'; months: number }
  /** `K2`/`K5` plan with "Long-term use" chosen: no end date, 12 months of cost every year. */
  | { kind: 'OPEN_ENDED' }
  /** `K4` licence for good: no term at all, a one-time amount. */
  | { kind: 'ONE_TIME' }
  | { kind: 'UNKNOWN' }

/**
 * The "time of use" of a request. BE sends `termMonths = null` both for a long-term use of a `K2`/`K5` plan and for a
 * `K4` licence, and the BRD keeps them apart: only the first carries cost into the following years. So a null term is
 * told apart by whether a part of the cost falls in next year; without that fact (a list row) it stays unknown.
 */
export function requestTerm(termMonths: number | null | undefined, continuesNextYear?: boolean): RequestTerm {
  if (typeof termMonths === 'number') return { kind: 'MONTHS', months: termMonths }
  if (continuesNextYear === undefined) return { kind: 'UNKNOWN' }
  return { kind: continuesNextYear ? 'OPEN_ENDED' : 'ONE_TIME' }
}
