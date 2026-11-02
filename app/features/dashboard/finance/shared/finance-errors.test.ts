import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { getFinanceError } from './finance-errors'

function failure(code: string, status: number) {
  return new AxiosError('Private backend details', undefined, undefined, undefined, {
    status,
    statusText: '',
    config: { headers: new AxiosHeaders() },
    headers: {},
    data: { success: false, error: { code, message: 'Private backend details', requestId: 'req-test' } }
  })
}

describe('Finance error handling', () => {
  it('maps contract errors by code without exposing backend messages', () => {
    expect(getFinanceError(failure('BUDGET.CURRENCY_NOT_REPORTING', 422)).key).toBe('reportingCurrency')
    expect(getFinanceError(failure('SPEND.REVIEWER_IS_APPROVER', 403)).key).toBe('independentReview')
    expect(getFinanceError(failure('VALIDATION_ERROR', 422)).key).toBe('validation')
    expect(getFinanceError(failure('UNKNOWN_CODE', 409)).key).toBe('conflict')
  })

  it('distinguishes an ambiguous write result from a known refusal', () => {
    expect(getFinanceError(failure('SERVICE_UNAVAILABLE', 503)).ambiguous).toBe(true)
    expect(getFinanceError(failure('SPEND.WRONG_STATE', 409)).ambiguous).toBe(false)
    expect(getFinanceError(new AxiosError('Network Error')).key).toBe('network')
  })
})
