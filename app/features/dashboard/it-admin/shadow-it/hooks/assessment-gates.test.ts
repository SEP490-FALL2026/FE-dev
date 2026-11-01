import { describe, expect, it } from 'vitest'
import { canCompleteAssessment } from './assessment-gates'
describe('assessment completion eligibility', () => {
  it('requires backend completeness, paid classification, draft and IT authorization', () => {
    const ready = { complete: true, status: 'DRAFT', classification: 'PAID_LICENSED' }
    expect(canCompleteAssessment(ready, true)).toBe(true)
    expect(canCompleteAssessment({ ...ready, complete: false }, true)).toBe(false)
    expect(canCompleteAssessment({ ...ready, classification: 'INTERNAL' }, true)).toBe(false)
    expect(canCompleteAssessment({ ...ready, status: 'REJECTED' }, true)).toBe(false)
    expect(canCompleteAssessment(ready, false)).toBe(false)
  })
})
