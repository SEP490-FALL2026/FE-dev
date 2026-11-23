import { describe, expect, it } from 'vitest'
import type { NotificationListResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import { notificationTarget } from './notification-target'

const id = '3f6c2a1e-7b4d-4c8e-9a21-000000000101'
const notification = (target: unknown) =>
  ({
    id,
    code: 'STEP_ASSIGNED',
    subject: { type: 'ACCESS_REQUEST', id },
    params: {},
    createdAt: '',
    readAt: null,
    target
  }) as NotificationListResponseDtoDataItemsItem

describe('notification target', () => {
  it('opens an IT provisioning task using the authorized target', () => {
    expect(
      notificationTarget(notification({ operationId: 'provisioningTaskGet', pathParams: { id } }), 'it-admin')
    ).toEqual({ tab: 'provisioning', params: { id, queue: 'tasks' } })
  })
  it('opens a finance budget proposal and an approver version', () => {
    expect(
      notificationTarget(notification({ operationId: 'budgetProposalGet', pathParams: { id } }), 'finance')
    ).toEqual({ tab: 'annual-proposals', params: { id } })
    expect(
      notificationTarget(notification({ operationId: 'budgetVersionGet', pathParams: { id } }), 'spending-approver')
    ).toEqual({ tab: 'annual-budget', params: { id } })
  })
  it('opens a super admin employee profile', () => {
    expect(notificationTarget(notification({ operationId: 'employeeGet', pathParams: { id } }), 'super-admin')).toEqual(
      { tab: 'personnel', params: { employeeId: id } }
    )
  })
  it('uses the authorized request identifier instead of the unrelated subject', () => {
    const requestId = '3f6c2a1e-7b4d-4c8e-9a21-000000000202'
    expect(
      notificationTarget(notification({ operationId: 'accessRequestGet', pathParams: { id: requestId } }), 'manager')
    ).toEqual({ tab: 'request-approval', params: { id: requestId } })
  })
  it('retains the year for a manager budget list target', () => {
    const item = { ...notification({ operationId: 'budgetMine', pathParams: {} }), params: { year: 2027 } }
    expect(notificationTarget(item, 'manager')).toEqual({ tab: 'annual-budget', params: { year: '2027' } })
  })
  it('does not infer a target when the server explicitly returns null', () => {
    expect(notificationTarget(notification(null), 'manager')).toBeUndefined()
  })
  it('opens a policy where an existing policy screen is available', () => {
    const item = notification({ operationId: 'policyGet', pathParams: { code: 'POL-123' } })
    expect(notificationTarget(item, 'employee')).toEqual({ tab: 'policies', params: { policyCode: 'POL-123' } })
    expect(notificationTarget(item, 'finance')).toBeUndefined()
    expect(notificationTarget(item, 'super-admin')).toEqual({
      tab: 'policies',
      params: { policy: 'POL-123', policyView: 'detail' }
    })
  })
  it('opens the IT ghost seat detail and manager proposal queue', () => {
    expect(
      notificationTarget(notification({ operationId: 'ghostSeatRecommendationGet', pathParams: { id } }), 'it-admin')
    ).toEqual({ tab: 'license-optimization', params: { recommendation: id } })
    expect(
      notificationTarget(notification({ operationId: 'departmentSoftwareProposalList', pathParams: {} }), 'manager')
    ).toEqual({ tab: 'team-software', params: { toolsView: 'proposals' } })
  })
  it('rejects unknown operations and invalid identifiers', () => {
    expect(
      notificationTarget(
        notification({ operationId: 'provisioningTaskGet', pathParams: { id: '../unsafe' } }),
        'it-admin'
      )
    ).toBeUndefined()
    expect(notificationTarget(notification({ operationId: 'unknown', pathParams: { id } }), 'it-admin')).toBeUndefined()
  })
})
