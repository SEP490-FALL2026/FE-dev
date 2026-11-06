import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { getApprovalsError } from './approvals-errors'

function failure(code: string, status: number) {
  return new AxiosError('Private server detail', undefined, undefined, undefined, {
    status,
    statusText: '',
    config: { headers: new AxiosHeaders() },
    headers: {},
    data: { error: { code, message: 'Private server detail', requestId: 'req-test' } }
  })
}

describe('Spending Approver error handling', () => {
  it('explains required overrides and changed review routes without exposing server messages', () => {
    expect(getApprovalsError(failure('SPEND.OVERRIDE_REQUIRED', 422)).key).toBe('overrideRequired')
    expect(getApprovalsError(failure('SPEND.OVERRIDE_MISMATCH', 422)).key).toBe('overrideMismatch')
    expect(getApprovalsError(failure('SPEND.RECHECKED_NEEDS_FINANCE_REVIEW', 409)).key).toBe('recheckedFinance')
    expect(getApprovalsError(failure('SPEND.RECHECKED_RETURNED_TO_HEAD', 409)).key).toBe('recheckedHead')
    expect(getApprovalsError(failure('UNKNOWN', 409))).toEqual({
      key: 'conflict',
      ambiguous: false,
      requestId: 'req-test'
    })
  })

  it('distinguishes ownership and separation of duties from missing permission', () => {
    expect(getApprovalsError(failure('BUDGET.OWN_VERSION', 403)).key).toBe('ownVersion')
    expect(getApprovalsError(failure('SPEND.OWN_REQUEST', 403)).key).toBe('ownRequest')
    expect(getApprovalsError(failure('SPEND.REVIEWER_IS_APPROVER', 409)).key).toBe('independentReview')
    expect(getApprovalsError(failure('SPEND.NOT_THE_ASSIGNEE', 403)).key).toBe('forbidden')
  })

  it('marks transport and server failures as uncertain writes and preserves lookup identifiers', () => {
    expect(getApprovalsError(new AxiosError('Network Error'))).toEqual({
      key: 'network',
      ambiguous: true,
      requestId: undefined
    })
    expect(getApprovalsError(failure('SERVICE_UNAVAILABLE', 503))).toEqual({
      key: 'unavailable',
      ambiguous: true,
      requestId: 'req-test'
    })
    expect(getApprovalsError(failure('HTTP_TOO_MANY_REQUESTS', 429)).ambiguous).toBe(false)
  })
})
