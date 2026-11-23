import type { SubscriptionResponseDtoData, UpdateSubscriptionBodyDto } from '~/shared/api/generated/model/subscriptions'

export function buildSubscriptionUpdate(
  form: FormData,
  existing: NonNullable<SubscriptionResponseDtoData>
): UpdateSubscriptionBodyDto {
  const result: UpdateSubscriptionBodyDto = {}
  const read = (name: string) => String(form.get(name) ?? '').trim()
  const quantity = read('quantity')
  if (quantity && Number(quantity) !== existing.purchasedQuantity) result.purchasedQuantity = Number(quantity)
  const amount = read('amount')
  if (amount && (amount !== existing.unitPrice?.amount || existing.unitPrice.currency !== 'VND'))
    result.unitPrice = { amount, currency: 'VND' }
  const cycle = read('billingCycle')
  if (cycle && cycle !== existing.billingCycle && (cycle === 'MONTHLY' || cycle === 'ANNUAL'))
    result.billingCycle = cycle
  const commitment = read('commitmentTermMonths')
  if ((commitment === '1' || commitment === '12') && Number(commitment) !== existing.commitmentTermMonths)
    result.commitmentTermMonths = Number(commitment) as 1 | 12
  if (read('startDate') && read('startDate') !== existing.startDate) result.startDate = read('startDate')
  for (const key of ['endDate', 'renewalDate'] as const) {
    if (form.has(key) && (read(key) || null) !== existing[key]) result[key] = read(key) || null
  }
  const declaredDeadline = existing.noticeDeadline?.source === 'DECLARED' ? existing.noticeDeadline.value : null
  if (form.has('noticeDeadline') && (read('noticeDeadline') || null) !== declaredDeadline)
    result.noticeDeadline = read('noticeDeadline') || null
  const days = read('noticePeriodDays') ? Number(read('noticePeriodDays')) : null
  if (form.has('noticePeriodDays') && days !== existing.noticePeriodDays) result.noticePeriodDays = days
  for (const key of ['autoRenew', 'allowsMidTermReduction', 'isPrimaryForPlan'] as const) {
    if (form.has(`${key}Present`) && form.has(key) !== existing[key]) result[key] = form.has(key)
  }
  const originalAmount = read('originalAmount')
  const originalCurrency = read('originalCurrency').toUpperCase()
  if (
    form.has('originalAmount') &&
    (originalAmount !== (existing.originalPrice?.amount ?? '') ||
      originalCurrency !== (existing.originalPrice?.currency ?? ''))
  ) {
    result.originalPrice = originalAmount ? { amount: originalAmount, currency: originalCurrency } : null
  }
  const minimum = read('vendorMinimumSeats') ? Number(read('vendorMinimumSeats')) : null
  if (form.has('vendorMinimumSeats') && minimum !== existing.vendorMinimumSeats) result.vendorMinimumSeats = minimum
  const responsible = read('responsibleItAdminEmployeeId')
  if (responsible && responsible !== existing.responsibleItAdminEmployeeId)
    result.responsibleItAdminEmployeeId = responsible
  return Object.keys(result).length ? { ...result, expectedUpdatedAt: existing.updatedAt } : result
}
