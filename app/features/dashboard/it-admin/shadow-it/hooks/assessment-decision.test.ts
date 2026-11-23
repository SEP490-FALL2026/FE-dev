import { describe, expect, it } from 'vitest'
import { canSubmitAssessmentDecision } from './assessment-decision'

describe('assessment decisions', () => {
  it('allows a return without typed reason when a checklist answer is no', () => {
    expect(canSubmitAssessmentDecision('return', '', ['YES', 'NO'])).toBe(true)
  })
  it('requires a reason or a no answer for rejection and return', () => {
    expect(canSubmitAssessmentDecision('reject', '  ', ['YES'])).toBe(false)
    expect(canSubmitAssessmentDecision('return', 'Please clarify', ['YES'])).toBe(true)
  })
  it('prevents completion when a checklist answer is no', () => {
    expect(canSubmitAssessmentDecision('complete', '', ['NO'])).toBe(false)
    expect(canSubmitAssessmentDecision('complete', '', ['YES'])).toBe(true)
  })
})
