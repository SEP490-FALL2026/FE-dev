import { describe, expect, it } from 'vitest'
import type { NotificationListResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import { notificationTarget } from './notification-target'
import { notificationBodyTemplate } from './notification-copy'
import { notificationMessages as en } from '~/shared/i18n/locales/en/notification-messages'
import { notificationMessages as vi } from '~/shared/i18n/locales/vi/notification-messages'

const id = '11111111-1111-4111-8111-111111111111'
const other = '22222222-2222-4222-8222-222222222222'
function notice(
  type: string,
  params: Record<string, string | number | boolean | null> = {},
  code = 'REQUEST_GRANTED'
): NotificationListResponseDtoDataItemsItem {
  return { id, code, subject: { type, id }, params, createdAt: '2026-11-17T00:00:00Z', readAt: null }
}
describe('notification targets', () => {
  it('uses the subject request id and workspace instead of a conflicting param', () => {
    expect(notificationTarget(notice('ACCESS_REQUEST', { requestId: other }), 'employee')).toEqual({
      tab: 'request-detail',
      params: { id }
    })
    expect(notificationTarget(notice('ACCESS_REQUEST'), 'manager')?.tab).toBe('request-approval')
  })
  it('opens the correct published policy version without treating its subject id as a request', () => {
    expect(
      notificationTarget(
        notice('POLICY_VERSION', { policyCode: 'POL-MF1', versionNumber: 3 }, 'POLICY_PUBLISHED'),
        'manager'
      )
    ).toEqual({ tab: 'policies', params: { policyCode: 'POL-MF1', version: '3' } })
  })
  it('opens proposal and review details in the correct year', () => {
    expect(notificationTarget(notice('BUDGET_PROPOSAL', { year: 2027 }), 'manager')).toEqual({
      tab: 'annual-budget',
      params: { year: '2027', proposalId: id }
    })
    expect(notificationTarget(notice('BUDGET_REVIEW_PERIOD', { year: 2026 }), 'manager')).toEqual({
      tab: 'annual-budget',
      params: { year: '2026', budgetView: 'reviews', reviewId: id }
    })
    expect(notificationTarget(notice('BUDGET_PROPOSAL', { year: 2027 }), 'employee')).toBeUndefined()
  })
  it('opens a ghost recommendation only in the Manager workspace and rejects arbitrary links', () => {
    expect(notificationTarget(notice('GHOST_SEAT_RECOMMENDATION'), 'manager')).toEqual({
      tab: 'ghost-seat-detail',
      params: { id }
    })
    expect(notificationTarget(notice('GHOST_SEAT_RECOMMENDATION'), 'employee')).toBeUndefined()
    expect(notificationTarget(notice('UNKNOWN', { viewPath: 'https://other.example.test' }), 'manager')).toBeUndefined()
  })
  it('opens budget threshold warnings which have no subject', () => {
    expect(
      notificationTarget(
        { ...notice('UNKNOWN', { year: 2026, threshold: 80 }, 'BUDGET_THRESHOLD_REACHED'), subject: null },
        'manager'
      )
    ).toEqual({ tab: 'annual-budget', params: { year: '2026' } })
  })
})
describe.each([
  ['English', en],
  ['Vietnamese', vi]
])('%s notification copy', (_language, messages) => {
  it('selects the actual request stage and hides missing optional reasons', () => {
    const text = notificationBodyTemplate('REQUEST_SUBMITTED', messages.REQUEST_SUBMITTED.body, {
      requestId: id,
      stage: 'WAITING_CONTROLLED'
    })
    expect(text).not.toContain('WAITING_NEED_DECISION:')
    expect(text).not.toContain('CONFIRMED:')
    expect(text).toContain('{{requestId}}')
    expect(
      notificationBodyTemplate('REQUEST_REJECTED', messages.REQUEST_REJECTED.body, { requestId: id, by: 'NEED' })
    ).not.toMatch(/\[|\]|\{\{reason\}\}/)
  })
  it('does not expose conditional authoring notes or unresolved required fields', () => {
    expect(notificationBodyTemplate('REQUEST_GRANTED', messages.REQUEST_GRANTED.body, {})).toBe('')
    expect(
      notificationBodyTemplate('STEP_SLA_REMINDER', messages.STEP_SLA_REMINDER.body, {
        stepKind: 'NEED',
        requestId: id,
        reminderNumber: 1,
        overdueWorkingDays: 0
      })
    ).not.toMatch(/When |phần trong ngoặc|\[|\]|overdueWorkingDays/)
  })
})
