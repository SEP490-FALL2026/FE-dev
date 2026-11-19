import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItShadowItView } from './views/it-shadow-it-view'
vi.mock('~/shared/api/generated/operations/access-requests/access-request-assessment-get', () => ({
  useAccessRequestAssessmentGet: () => ({
    isPending: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
    data: {
      data: {
        assessment: {
          requestId: 'request-self',
          status: 'DRAFT',
          step: { state: 'PENDING' },
          proposal: {
            softwareName: 'Own request',
            purpose: 'Work',
            dataDescription: 'Company data',
            homepageUrl: 'https://example.invalid',
            expectedUsers: 1
          },
          complete: false,
          classification: null
        }
      }
    }
  })
}))
vi.mock('~/shared/api/generated/operations/me/me-get', () => ({
  useMeGet: () => ({ data: { data: { roles: ['IT_ADMIN'], employee: { id: 'self' } } } })
}))
vi.mock('~/shared/api/generated/operations/access-requests/access-request-get', () => ({
  useAccessRequestGet: () => ({
    isPending: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
    data: {
      data: {
        request: {
          id: 'request-self',
          requester: { employeeId: 'self' },
          beneficiary: { employeeId: 'other' },
          plan: null
        }
      }
    }
  })
}))
it('keeps a self request read-only when opened by identifier instead of the assessment queue', async () => {
  await setAppLanguage('en', false)
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ItShadowItView initialRequestId='request-self' />
    </QueryClientProvider>
  )
  expect(screen.getByRole('button', { name: 'Save assessment' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Reject proposal' })).toBeDisabled()
})
