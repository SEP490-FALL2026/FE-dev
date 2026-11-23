import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { expect, it } from 'vitest'
import '~/shared/i18n/i18n'
import { getProvisioningTaskListQueryKey } from '~/shared/api/generated/operations/provisioning-tasks/provisioning-task-list'
import { getOffboardingCaseGetQueryKey } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-get'
import { getSubscriptionSeatUsageQueryKey } from '~/shared/api/generated/operations/subscriptions/subscription-seat-usage'
import { getSaasIssueListQueryKey } from '~/shared/api/generated/operations/saas-issues/saas-issue-list'
import { useItMutationFeedback } from './hooks/use-it-mutation-feedback'
import { getItAdminDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/it-admin-dashboard-get'
import { getAssessmentQueueListQueryKey } from '~/shared/api/generated/operations/access-requests/assessment-queue-list'
import { getAccessRequestAssessmentGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-assessment-get'
import { getSubscriptionGetQueryKey } from '~/shared/api/generated/operations/subscriptions/subscription-get'
import { getSubscriptionRenewalListQueryKey } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-list'
import { getPlanWarningListQueryKey } from '~/shared/api/generated/operations/plan-terms/plan-warning-list'
import { getSeatBaselineImportGetQueryKey } from '~/shared/api/generated/operations/seat-baseline-imports/seat-baseline-import-get'

it('refreshes departure blockers and seat usage after provisioning without touching issue conversations', async () => {
  const client = new QueryClient()
  const departure = getOffboardingCaseGetQueryKey('case-1')
  const seats = getSubscriptionSeatUsageQueryKey('subscription-1')
  const issues = getSaasIssueListQueryKey()
  const baselinePreview = getSeatBaselineImportGetQueryKey('import-1')
  for (const key of [departure, seats, issues, baselinePreview]) client.setQueryData(key, { data: {} })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const { result } = renderHook(() => useItMutationFeedback([getProvisioningTaskListQueryKey()]), { wrapper })
  await act(() => result.current.onSuccess())
  expect(client.getQueryState(departure)?.isInvalidated).toBe(true)
  expect(client.getQueryState(seats)?.isInvalidated).toBe(true)
  expect(client.getQueryState(issues)?.isInvalidated).toBe(false)
  expect(client.getQueryState(baselinePreview)?.isInvalidated).toBe(true)
})

it('refreshes scoped dashboard counts and the assessment queue after an assessment changes', async () => {
  const client = new QueryClient()
  const dashboard = getItAdminDashboardGetQueryKey()
  const queue = getAssessmentQueueListQueryKey({ page: 2, pageSize: 20 })
  for (const key of [dashboard, queue]) client.setQueryData(key, { data: {} })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const { result } = renderHook(() => useItMutationFeedback([getAccessRequestAssessmentGetQueryKey('request-1')]), {
    wrapper
  })
  await act(() => result.current.onSuccess())
  expect(client.getQueryState(dashboard)?.isInvalidated).toBe(true)
  expect(client.getQueryState(queue)?.isInvalidated).toBe(true)
})

it('refreshes renewals and term-review warnings after a subscription deadline changes', async () => {
  const client = new QueryClient()
  const renewals = getSubscriptionRenewalListQueryKey()
  const warnings = getPlanWarningListQueryKey()
  for (const key of [renewals, warnings]) client.setQueryData(key, { data: {} })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const { result } = renderHook(() => useItMutationFeedback([getSubscriptionGetQueryKey('sub-1')]), { wrapper })
  await act(() => result.current.onSuccess())
  expect(client.getQueryState(renewals)?.isInvalidated).toBe(true)
  expect(client.getQueryState(warnings)?.isInvalidated).toBe(true)
})
