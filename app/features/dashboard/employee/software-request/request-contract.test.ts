import { describe, expect, it } from 'vitest'
import { readRequestFields, requestPayload } from './hooks/use-live-request-form'

describe('current request contract', () => {
  it('never sends removed spending-date or term-confirmation fields', () => {
    const form = document.createElement('form')
    for (const [name, value] of Object.entries({
      planId: 'plan',
      businessReason: 'Work',
      termMonths: '3',
      expectedSpendOn: '2026-12-01',
      termReason: 'Legacy'
    })) {
      const input = document.createElement('input')
      input.name = name
      input.value = value
      form.append(input)
    }
    expect(requestPayload(readRequestFields(form))).toEqual({ planId: 'plan', businessReason: 'Work', termMonths: 3 })
  })
})
