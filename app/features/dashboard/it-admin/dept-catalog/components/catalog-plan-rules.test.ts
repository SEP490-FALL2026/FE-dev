import { expect, it } from 'vitest'
import { readPlanRules } from './catalog-plan-rules'

it('includes a reference price for a paid plan and omits it for an internal plan', () => {
  const form = new FormData()
  form.set('controlLevel', 'FULL')
  form.set('referencePrice', '250000')
  expect(readPlanRules(form, 'K2')).toMatchObject({ referencePrice: { amount: '250000', currency: 'VND' } })
  expect(readPlanRules(form, 'K5')).not.toHaveProperty('referencePrice')
})
