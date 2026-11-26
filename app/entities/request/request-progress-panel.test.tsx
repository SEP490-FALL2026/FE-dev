import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { RequestProgressPanel } from './components/request-progress-panel'

const { getTimings, refetch } = vi.hoisted(() => ({ getTimings: vi.fn(), refetch: vi.fn() }))
vi.mock('~/shared/api/generated/operations/access-requests/access-request-timings-get', () => ({
  useAccessRequestTimingsGet: getTimings
}))

beforeEach(async () => {
  await setAppLanguage('en', false)
  vi.clearAllMocks()
})

it('renders API timings for the requested request', () => {
  getTimings.mockReturnValue({
    isSuccess: true,
    data: {
      data: {
        timings: {
          submittedAt: '2026-11-19T00:02:00Z',
          segments: { NEED: null, IT_ASSESSMENT: null, QUEUE_WAIT: null, SPEND_DECISION: null, GRANT: null }
        }
      }
    }
  })
  render(<RequestProgressPanel id='request-1' state='COMPLETED' />)
  expect(getTimings).toHaveBeenCalledWith('request-1', { query: { retry: false } })
  expect(screen.getByRole('list', { name: 'Processing progress' })).toHaveTextContent('Submit request')
})

it('offers retry if timings fail without hiding the request around the panel', () => {
  getTimings.mockReturnValue({ isError: true, isPending: false, refetch })
  const details = 'Request details'
  render(
    <>
      <p>{details}</p>
      <RequestProgressPanel id='request-1' />
    </>
  )
  expect(screen.getByText('Request details')).toBeVisible()
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load this information.')
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(refetch).toHaveBeenCalledOnce()
})
