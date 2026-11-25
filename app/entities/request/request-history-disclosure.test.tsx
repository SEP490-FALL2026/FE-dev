import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { RequestHistoryDisclosure } from './components/request-history-disclosure'

const { list, refetch } = vi.hoisted(() => ({ list: vi.fn(), refetch: vi.fn() }))
vi.mock('~/shared/api/generated/operations/access-requests/access-request-event-list', () => ({
  useAccessRequestEventList: list
}))

beforeEach(async () => {
  await setAppLanguage('en', false)
  vi.clearAllMocks()
  list.mockReturnValue({
    isPending: false,
    isError: false,
    isFetching: false,
    refetch,
    data: {
      data: {
        items: [
          {
            id: 'event-1',
            kind: 'SUBMITTED',
            occurredAt: '2026-11-19T00:02:00Z',
            actor: { fullName: 'Pham Thu Dung' },
            line: null,
            reason: null
          }
        ],
        pagination: { totalPages: 2 }
      }
    }
  })
})

it('starts collapsed and requests history only after the user opens it', () => {
  render(<RequestHistoryDisclosure id='request-1' />)
  const toggle = screen.getByRole('button', { name: 'Request history' })
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(list).not.toHaveBeenCalled()
  fireEvent.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(list).toHaveBeenCalledWith('request-1', { page: 1, pageSize: 20 })
  expect(screen.getByText('Pham Thu Dung')).toBeVisible()
  expect(document.querySelector('time')).toHaveAttribute('dateTime', '2026-11-19T00:02:00Z')
})

it('keeps the selected page when history is closed and reopened', () => {
  render(<RequestHistoryDisclosure id='request-1' />)
  const toggle = screen.getByRole('button', { name: 'Request history' })
  fireEvent.click(toggle)
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  expect(list).toHaveBeenLastCalledWith('request-1', { page: 2, pageSize: 20 })
  fireEvent.click(toggle)
  expect(screen.getByText('Pham Thu Dung')).not.toBeVisible()
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(toggle)
  expect(screen.getByText('Pham Thu Dung')).toBeVisible()
  expect(within(screen.getByRole('navigation')).getByText('2 / 2')).toBeVisible()
})

it('retains retry when the history API fails', () => {
  list.mockReturnValue({ isPending: false, isError: true, isFetching: false, refetch })
  render(<RequestHistoryDisclosure id='request-1' />)
  fireEvent.click(screen.getByRole('button', { name: 'Request history' }))
  expect(screen.getByRole('alert')).toBeVisible()
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(refetch).toHaveBeenCalledOnce()
})

it('uses the Vietnamese history label and exposes empty results when expanded', async () => {
  await setAppLanguage('vi', false)
  list.mockReturnValue({
    isPending: false,
    isError: false,
    data: { data: { items: [], pagination: { totalPages: 0 } } }
  })
  render(<RequestHistoryDisclosure id='request-1' />)
  fireEvent.click(screen.getByRole('button', { name: 'Lịch sử yêu cầu' }))
  expect(screen.getByText('Chưa có sự kiện')).toBeVisible()
})
