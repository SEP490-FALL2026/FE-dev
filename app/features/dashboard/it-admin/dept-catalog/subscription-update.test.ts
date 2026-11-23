import { expect, it } from 'vitest'
import { buildSubscriptionUpdate } from './subscription-update'
import type { SubscriptionResponseDtoData } from '~/shared/api/generated/model/subscriptions'

it('includes the version read when sending an update', () => {
  const existing = {
    updatedAt: '2026-11-18T10:00:00.000Z',
    purchasedQuantity: 3
  } as NonNullable<SubscriptionResponseDtoData>
  const form = new FormData()
  form.set('quantity', '4')
  expect(buildSubscriptionUpdate(form, existing)).toEqual({
    purchasedQuantity: 4,
    expectedUpdatedAt: existing.updatedAt
  })
})

it('preserves unchanged nullable fields and legacy billing values', () => {
  const existing = {
    purchasedQuantity: 3,
    billingCycle: 'QUARTERLY',
    originalPrice: null,
    vendorMinimumSeats: null,
    isPrimaryForPlan: false,
    autoRenew: false,
    allowsMidTermReduction: false,
    noticeDeadline: { source: 'INFERRED_UNCONFIRMED', value: '2026-12-01' }
  } as NonNullable<SubscriptionResponseDtoData>
  const form = new FormData()
  form.set('quantity', '4')
  form.set('billingCycle', 'QUARTERLY')
  expect(buildSubscriptionUpdate(form, existing)).toEqual({ purchasedQuantity: 4 })
})

it('does not relabel an unchanged legacy foreign price as VND', () => {
  const existing = { unitPrice: { amount: '50', currency: 'USD' } } as NonNullable<SubscriptionResponseDtoData>
  const form = new FormData()
  form.set('amount', '')
  expect(buildSubscriptionUpdate(form, existing)).toEqual({})
})

it('sends changed vendor data and can clear optional values', () => {
  const existing = {
    originalPrice: { amount: '10.50', currency: 'USD' },
    vendorMinimumSeats: 5,
    isPrimaryForPlan: false,
    responsibleItAdminEmployeeId: 'old'
  } as NonNullable<SubscriptionResponseDtoData>
  const form = new FormData()
  form.set('originalAmount', '')
  form.set('originalCurrency', 'USD')
  form.set('vendorMinimumSeats', '')
  form.set('isPrimaryForPlanPresent', '1')
  form.set('isPrimaryForPlan', 'on')
  form.set('responsibleItAdminEmployeeId', 'new')
  expect(buildSubscriptionUpdate(form, existing)).toEqual({
    originalPrice: null,
    vendorMinimumSeats: null,
    isPrimaryForPlan: true,
    responsibleItAdminEmployeeId: 'new'
  })
})
