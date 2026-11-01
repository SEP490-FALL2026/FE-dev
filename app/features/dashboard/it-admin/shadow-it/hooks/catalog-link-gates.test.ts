import { describe, expect, it } from 'vitest'
import { canLinkCatalogPlan } from './catalog-link-gates'
describe('catalog link eligibility', () => {
  it('requires persisted paid assessment plan, authorized execution state and no existing link', () => {
    const assessment = { status: 'COMPLETED', classification: 'PAID_LICENSED', equivalentTool: { planId: 'plan-1' } }
    const request = { branch: 'NEW_SOFTWARE', state: 'AWAITING_EXECUTION', plan: null }
    expect(canLinkCatalogPlan(assessment, request, true)).toBe(true)
    expect(canLinkCatalogPlan({ ...assessment, equivalentTool: null }, request, true)).toBe(false)
    expect(canLinkCatalogPlan(assessment, { ...request, plan: { planId: 'linked' } }, true)).toBe(false)
    expect(canLinkCatalogPlan(assessment, { ...request, state: 'AWAITING_SPEND_DECISION' }, true)).toBe(false)
    expect(canLinkCatalogPlan({ ...assessment, classification: 'INTERNAL' }, request, true)).toBe(false)
    expect(canLinkCatalogPlan(assessment, request, false)).toBe(false)
  })
})
