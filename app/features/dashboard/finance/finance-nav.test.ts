import { describe, expect, it } from 'vitest'
import { financeAreas, isValidFinanceTab } from './finance-nav'

describe('finance navigation', () => {
  it('rejects removed screens in navigation and direct links', () => {
    const removed = [
      'out-of-process',
      'subscription-renewals',
      'vendor-tax',
      'seat-charges',
      'budget-adjustments',
      'budget-parameters'
    ]
    const tabs = financeAreas.flatMap((area) => area.tabs.map((tab) => tab.key))
    for (const tab of removed) {
      expect(tabs).not.toContain(tab)
      expect(isValidFinanceTab(tab)).toBe(false)
    }
  })
})
