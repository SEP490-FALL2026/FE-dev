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

it('refreshes departure blockers and seat usage after provisioning without touching issue conversations', async () => {
  const client = new QueryClient()
  const departure = getOffboardingCaseGetQueryKey('case-1')
  const seats = getSubscriptionSeatUsageQueryKey('subscription-1')
  const issues = getSaasIssueListQueryKey()
  for (const key of [departure, seats, issues]) client.setQueryData(key, { data: {} })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const { result } = renderHook(() => useItMutationFeedback([getProvisioningTaskListQueryKey()]), { wrapper })
  await act(() => result.current.onSuccess())
  expect(client.getQueryState(departure)?.isInvalidated).toBe(true)
  expect(client.getQueryState(seats)?.isInvalidated).toBe(true)
  expect(client.getQueryState(issues)?.isInvalidated).toBe(false)
})
