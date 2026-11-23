import type { DeclareSubscriptionBodyDto } from '~/shared/api/generated/model/subscriptions'
export function buildSubscriptionCreate(form: FormData, planId: string): DeclareSubscriptionBodyDto | undefined {
  const kind = form.get('kind')
  if (kind !== 'TERM' && kind !== 'PERPETUAL') return
  const read = (key: string) => String(form.get(key) ?? '').trim()
  const quantity = read('quantity')
  const amount = read('amount')
  const cycle = read('billingCycle')
  const commitment = read('commitmentTermMonths')
  const responsible = read('responsibleItAdminEmployeeId')
  return {
    planId,
    kind,
    ...(quantity && { purchasedQuantity: Number(quantity) }),
    ...(amount && { unitPrice: { amount, currency: 'VND' } }),
    ...(read('startDate') && { startDate: read('startDate') }),
    ...((cycle === 'MONTHLY' || cycle === 'ANNUAL') && { billingCycle: cycle }),
    ...((commitment === '1' || commitment === '12') && { commitmentTermMonths: Number(commitment) as 1 | 12 }),
    ...(responsible && { responsibleItAdminEmployeeId: responsible })
  }
}
