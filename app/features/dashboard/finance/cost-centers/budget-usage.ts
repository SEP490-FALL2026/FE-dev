/** Decimal money strings are display figures here; the backend stays the source of the exact amounts. */
export const amountOf = (value: { amount: string } | null | undefined) => {
  const parsed = Number(value?.amount ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

/** Share of a budget already used: what is held by commitments plus what invoices turned into spend. */
export function usedShare(row: {
  total: { amount: string }
  committed: { amount: string }
  spent: { amount: string }
}) {
  const total = amountOf(row.total)
  return total > 0 ? (amountOf(row.committed) + amountOf(row.spent)) / total : 0
}
