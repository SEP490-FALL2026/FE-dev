import type { ApprovalListResponseDtoDataItemsItem } from '~/shared/api/generated/model/spend-approvals/approvalListResponseDtoDataItemsItem'
import type { VersionPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-versions/versionPageResponseDtoDataItemsItem'
import { ApprovalListResponseDtoDataItemsItemOutcome as CHECK_OUTCOME } from '~/shared/api/generated/model/spend-approvals/approvalListResponseDtoDataItemsItemOutcome'
import { VersionPageResponseDtoDataItemsItemState as VERSION_STATE } from '~/shared/api/generated/model/budget-versions/versionPageResponseDtoDataItemsItemState'
import { isDecimal, type Money } from '~/shared/lib/money'

type SpendItem = ApprovalListResponseDtoDataItemsItem
type VersionItem = VersionPageResponseDtoDataItemsItem

/** Days ahead of today that still count as "due soon". */
export const DUE_SOON_DAYS = 2
/** Bars beyond this are folded into one "other" bar so the chart stays readable. */
export const CHART_ROW_LIMIT = 8
export const OTHER_ROW_KEY = '__other__'

/** Adds decimal strings exactly; money never goes through floating point before the final display. */
export function sumDecimal(values: readonly string[]): string {
  const valid = values.filter(isDecimal)
  const scale = Math.max(0, ...valid.map((value) => value.split('.')[1]?.length ?? 0))
  const total = valid.reduce((sum, value) => {
    const [integer, fraction = ''] = value.split('.')
    return sum + BigInt(integer + fraction.padEnd(scale, '0'))
  }, 0n)
  if (!scale) return total.toString()
  const digits = total.toString().padStart(scale + 1, '0')
  return `${digits.slice(0, -scale)}.${digits.slice(-scale)}`
}

export interface CurrencyTotal {
  currency: string
  amount: string
  count: number
}

/** One total per currency: amounts in different currencies are never added together. */
export function totalsByCurrency(moneys: readonly (Money | null)[]): CurrencyTotal[] {
  const groups = new Map<string, string[]>()
  for (const money of moneys) {
    if (!money || !isDecimal(money.amount)) continue
    groups.set(money.currency, [...(groups.get(money.currency) ?? []), money.amount])
  }
  return [...groups.entries()]
    .map(([currency, amounts]) => ({ currency, amount: sumDecimal(amounts), count: amounts.length }))
    .sort((first, second) => second.count - first.count || first.currency.localeCompare(second.currency))
}

/** Calendar arithmetic on YYYY-MM-DD strings, in UTC so the result never shifts with the time zone. */
export function addDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

export function localToday(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function dueBuckets(items: readonly SpendItem[], today: string) {
  const soonLimit = addDays(today, DUE_SOON_DAYS)
  const dueDays = items.map((item) => item.dueOn.slice(0, 10))
  return {
    overdue: dueDays.filter((day) => day < today).length,
    dueSoon: dueDays.filter((day) => day >= today && day <= soonLimit).length
  }
}

export function soonestDue(items: readonly SpendItem[], limit = 5): SpendItem[] {
  return [...items].sort((first, second) => first.dueOn.localeCompare(second.dueOn)).slice(0, limit)
}

export interface AmountRow {
  key: string
  label: string
  /** Exact decimal string for labels and tables. */
  exact: string
  /** Numeric value only for the bar length. */
  value: number
  count: number
}

/** Sums one currency per group, largest first, folding the tail into a single "other" row. */
export function amountRows(
  entries: readonly { key: string; label: string; money: Money | null }[],
  currency: string,
  otherLabel: string,
  limit = CHART_ROW_LIMIT
): AmountRow[] {
  const groups = new Map<string, { label: string; amounts: string[] }>()
  for (const entry of entries) {
    if (!entry.money || entry.money.currency !== currency || !isDecimal(entry.money.amount)) continue
    const group = groups.get(entry.key) ?? { label: entry.label, amounts: [] }
    group.amounts.push(entry.money.amount)
    groups.set(entry.key, group)
  }
  const rows = [...groups.entries()]
    .map(([key, group]) => {
      const exact = sumDecimal(group.amounts)
      return { key, label: group.label, exact, value: Number(exact), count: group.amounts.length }
    })
    .sort((first, second) => second.value - first.value || first.label.localeCompare(second.label))
  if (rows.length <= limit) return rows
  const tail = rows.slice(limit - 1)
  const exact = sumDecimal(tail.map((row) => row.exact))
  return [
    ...rows.slice(0, limit - 1),
    {
      key: OTHER_ROW_KEY,
      label: otherLabel,
      exact,
      value: Number(exact),
      count: tail.reduce((sum, row) => sum + row.count, 0)
    }
  ]
}

/** Fixed order from clear to blocked, so an outcome keeps its place whatever the counts are. */
export const OUTCOME_ORDER = [CHECK_OUTCOME.WITHIN_BASE, CHECK_OUTCOME.USES_RESERVE, CHECK_OUTCOME.BLOCKED] as const

/**
 * Counts the three outcomes of the newest budget check (within the base, uses the reserve, blocked).
 * A step with no outcome yet, or one the client does not know, is kept apart instead of being guessed.
 */
export function outcomeCounts(items: readonly SpendItem[]) {
  const known: readonly string[] = OUTCOME_ORDER
  const counts = OUTCOME_ORDER.map((outcome) => ({
    outcome,
    count: items.filter((item) => item.outcome === outcome).length
  })).filter((entry) => entry.count > 0)
  const unknown = items.filter((item) => item.outcome === null || !known.includes(item.outcome)).length
  return { counts, unknown }
}

export const VERSION_STATE_ORDER = [
  VERSION_STATE.SENT,
  VERSION_STATE.CHANGES_REQUESTED,
  VERSION_STATE.APPROVED,
  VERSION_STATE.REJECTED
] as const

export function versionStateCounts(versions: readonly VersionItem[]) {
  return VERSION_STATE_ORDER.map((state) => ({
    state,
    count: versions.filter((version) => version.state === state).length
  }))
}

export function approvedVersions(versions: readonly VersionItem[]) {
  return versions.filter((version) => version.state === VERSION_STATE.APPROVED)
}
