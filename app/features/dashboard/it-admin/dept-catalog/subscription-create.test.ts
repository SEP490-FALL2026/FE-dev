import { expect, it } from 'vitest'
import { buildSubscriptionCreate } from './subscription-create'

it('sends activation fields even when other input is present', () => {
  const form = new FormData()
  form.set('kind', 'TERM')
  form.set('amount', '250000')
  form.set('quantity', '10')
  form.set('startDate', '2026-11-19')
  form.set('billingCycle', 'MONTHLY')
  form.set('commitmentTermMonths', '12')
  expect(buildSubscriptionCreate(form, 'plan')).toEqual({
    planId: 'plan',
    kind: 'TERM',
    purchasedQuantity: 10,
    unitPrice: { amount: '250000', currency: 'VND' },
    startDate: '2026-11-19',
    billingCycle: 'MONTHLY',
    commitmentTermMonths: 12
  })
})

it('requires a supported subscription kind', () => {
  expect(buildSubscriptionCreate(new FormData(), 'plan')).toBeUndefined()
})
