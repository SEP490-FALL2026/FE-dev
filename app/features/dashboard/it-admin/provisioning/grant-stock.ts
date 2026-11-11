import type { GrantQueueResponseDtoDataItemsItemStock } from '~/shared/api/generated/model'

export function grantStockDecision(stock: GrantQueueResponseDtoDataItemsItemStock, reason: string) {
  if (stock.kind === 'NONE' || stock.free > 0) return { allowed: true as const }
  const trimmed = reason.trim()
  if (stock.inRevocation > 0 && !trimmed) return { allowed: false as const }
  return { allowed: true as const, purchase: trimmed ? { reason: trimmed } : {} }
}
