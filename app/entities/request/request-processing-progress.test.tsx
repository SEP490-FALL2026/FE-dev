import { render, screen, within } from '@testing-library/react'
import { beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import type { RequestTimingsResponseDtoDataTimings } from '~/shared/api/generated/model/access-requests/requestTimingsResponseDtoDataTimings'
import { RequestProcessingProgress } from './components/request-processing-progress'
import { requestProcessingSteps } from './request-processing-progress'
import { ACCESS_REQUEST_STATE } from './enums/access-request-state'

const timings: RequestTimingsResponseDtoDataTimings = {
  requestId: '33333333-3333-4333-8333-333333333333',
  submittedAt: '2026-11-19T00:02:00Z',
  approvedAt: null,
  grantCompletedAt: null,
  approvalSeconds: null,
  grantSeconds: null,
  totalSeconds: null,
  countedInKpi: false,
  segments: {
    NEED: { startedAt: '2026-11-19T00:02:00Z', endedAt: '2026-11-19T00:03:00Z', seconds: 60 },
    IT_ASSESSMENT: { startedAt: '2026-11-19T00:03:00Z', endedAt: null, seconds: null },
    QUEUE_WAIT: null,
    SPEND_DECISION: null,
    GRANT: null
  }
}
beforeEach(async () => {
  await setAppLanguage('en', false)
})

it('shows the end time of processed steps and the start time of the current step', () => {
  render(<RequestProcessingProgress timings={timings} state='AWAITING_IT_ASSESSMENT' />)
  const steps = within(screen.getByRole('list', { name: 'Processing progress' })).getAllByRole('listitem')
  expect(steps).toHaveLength(3)
  expect(steps[0]).toHaveTextContent('Submit request')
  expect(steps[1]).toHaveTextContent('Need approval')
  expect(steps[1].querySelectorAll('time')).toHaveLength(2)
  expect(steps[1].querySelector('time[title]')).toHaveAttribute('dateTime', timings.segments.NEED!.endedAt)
  expect(steps[1].querySelector('time[title]')).toHaveAccessibleDescription()
  expect(steps[2]).toHaveTextContent('IT assessment')
  expect(steps[2]).toHaveAttribute('aria-current', 'step')
  expect(steps[2].querySelectorAll('time')).toHaveLength(1)
  expect(steps[2].querySelector('time')).toHaveAttribute('dateTime', timings.segments.IT_ASSESSMENT!.startedAt)
  expect(screen.queryByText('Spending approval')).not.toBeInTheDocument()
  expect(screen.queryByText('Grant access')).not.toBeInTheDocument()
  expect(screen.queryByText('Unknown status')).not.toBeInTheDocument()
})

it('does not repeat identical start and end timestamps', () => {
  render(
    <RequestProcessingProgress
      timings={{
        ...timings,
        segments: {
          ...timings.segments,
          NEED: { startedAt: timings.submittedAt, endedAt: timings.submittedAt, seconds: 0 }
        }
      }}
    />
  )
  const need = screen.getByText('Need approval').closest('li')!
  expect(need.querySelectorAll('time')).toHaveLength(1)
  expect(need.querySelector('time')).toHaveAttribute('dateTime', timings.submittedAt)
})

it.each([
  ['REJECTED', 'Rejected'],
  ['IT_REJECTED', 'Rejected'],
  ['FAILED', 'Processing failed'],
  ['WITHDRAWN', 'Stopped'],
  ['CANCELLED', 'Stopped']
] as const)('does not portray an ended %s request as still processing', (state, label) => {
  render(<RequestProcessingProgress timings={timings} state={state} />)
  expect(screen.getByText(label)).toBeInTheDocument()
  expect(screen.queryByText('In progress')).not.toBeInTheDocument()
  expect(screen.getAllByRole('listitem').every((step) => !step.hasAttribute('aria-current'))).toBe(true)
})

it('treats a closed rejected segment as rejected rather than approved', () => {
  const steps = requestProcessingSteps(
    { ...timings, segments: { ...timings.segments, IT_ASSESSMENT: null } },
    ACCESS_REQUEST_STATE.REJECTED
  )
  expect(steps.at(-1)?.phase).toBe('rejected')
})

it('orders reopened stages by recorded time and keeps only the latest open stage current', () => {
  const reopened = {
    ...timings,
    segments: {
      ...timings.segments,
      NEED: { startedAt: '2026-11-20T00:00:00Z', endedAt: null, seconds: null }
    }
  }
  const steps = requestProcessingSteps(reopened)
  expect(steps.map((step) => step.kind)).toEqual(['SUBMITTED', 'IT_ASSESSMENT', 'NEED'])
  expect(steps.filter((step) => step.phase === 'active').map((step) => step.kind)).toEqual(['NEED'])
})

it('shows submission alone when the API has no recorded segments', () => {
  render(
    <RequestProcessingProgress
      timings={{
        ...timings,
        segments: { NEED: null, IT_ASSESSMENT: null, QUEUE_WAIT: null, SPEND_DECISION: null, GRANT: null }
      }}
    />
  )
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  expect(screen.queryByText('In progress')).not.toBeInTheDocument()
})

it('labels requester revision explicitly and translates the shared progress for both workspaces', async () => {
  await setAppLanguage('vi', false)
  render(<RequestProcessingProgress timings={timings} state='AWAITING_REQUESTER_REVISION' />)
  expect(screen.getByRole('list', { name: 'Tiến trình xử lý' })).toBeInTheDocument()
  expect(screen.getByText('Chờ người gửi chỉnh sửa')).toBeInTheDocument()
  expect(screen.getByText('IT thẩm định')).toBeInTheDocument()
  expect(screen.getByText('Chờ người gửi chỉnh sửa').closest('li')).toHaveAttribute('aria-current', 'step')
})

it('does not leave historical stages active when a later stage returns the request for revision', () => {
  const steps = requestProcessingSteps(
    {
      ...timings,
      segments: {
        ...timings.segments,
        SPEND_DECISION: { startedAt: '2026-11-20T00:00:00Z', endedAt: '2026-11-20T01:00:00Z', seconds: 3600 }
      }
    },
    ACCESS_REQUEST_STATE.AWAITING_REQUESTER_REVISION
  )
  expect(steps.filter((step) => step.phase === 'active')).toHaveLength(0)
  expect(steps.at(-1)?.phase).toBe('revision')
})
