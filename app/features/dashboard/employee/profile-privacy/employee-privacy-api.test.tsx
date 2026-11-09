import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { expect, it, vi } from 'vitest'
import {
  device,
  deviceId,
  usage,
  pageData,
  server,
  mount,
  openDevice
} from '../../../../../test/fixtures/device-privacy'
it.each(['privacy', 'data-export', 'data-usage'] as const)(
  'opens %s with actual empty API states and no password/export action',
  async (tab) => {
    server.use(
      http.get('*/api/v1/me/devices', () => HttpResponse.json(pageData([]))),
      http.get('*/api/v1/monitoring-notices/current', () => HttpResponse.json({ success: true, data: null }))
    )
    mount(tab)
    expect(await screen.findByText('No company devices registered to you')).toBeVisible()
    expect(await screen.findByText('No monitoring notice has been published')).toBeVisible()
    expect(screen.getByText('Requesting a personal data export is not available yet.')).toBeVisible()
    expect(screen.queryByRole('link', { name: 'Change password' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /export/i })).not.toBeInTheDocument()
  }
)

it('loads monitoring policy and paginates devices through holder endpoints', async () => {
  const pages: string[] = []
  server.use(
    http.get('*/api/v1/me/devices', ({ request }) => {
      const page = new URL(request.url).searchParams.get('page') ?? '1'
      pages.push(page)
      return HttpResponse.json(
        pageData([{ ...device, assetCode: page === '1' ? 'COMPANY-001' : 'COMPANY-002' }], Number(page), 2)
      )
    })
  )
  mount()
  expect(await screen.findByText('COMPANY-001')).toBeVisible()
  fireEvent.click(screen.getByText('Read monitoring policy'))
  expect(screen.getByText('Chat contents')).toBeVisible()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  expect(await screen.findByText('COMPANY-002')).toBeVisible()
  expect(pages).toEqual(['1', '2'])
})

it('does not mistake failed device loading for no devices and recovers through retry', async () => {
  let fail = true
  server.use(
    http.get('*/api/v1/me/devices', () =>
      fail
        ? HttpResponse.json({ error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
        : HttpResponse.json(pageData([device]))
    )
  )
  mount()
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not load the data')
  expect(screen.queryByText('No company devices registered to you')).not.toBeInTheDocument()
  fail = false
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(await screen.findByText('COMPANY-001')).toBeVisible()
})

it('loads only selected usage, keeps true zero distinct from unobservable/unknown coverage and resets paging on filter changes', async () => {
  const requests: URL[] = []
  server.use(
    http.get('*/api/v1/me/devices/:id/usage', ({ request, params }) => {
      expect(params.id).toBe(deviceId)
      const url = new URL(request.url)
      requests.push(url)
      return HttpResponse.json(
        pageData(
          [
            usage,
            { ...usage, date: '2026-11-04', coverage: 'NOT_OBSERVABLE', responses: 999 },
            { ...usage, date: '2026-11-03', coverage: 'NEW_COVERAGE', responses: 888 }
          ],
          Number(url.searchParams.get('page')),
          2
        )
      )
    })
  )
  mount()
  await openDevice()
  const table = await screen.findByRole('table', { name: 'Daily usage' })
  const rows = within(table).getAllByRole('row')
  expect(within(rows[1]).getAllByText('0')).toHaveLength(2)
  expect(rows[2]).toHaveTextContent('No observable data')
  expect(rows[2]).not.toHaveTextContent('999')
  expect(rows[3]).toHaveTextContent('Unknown status')
  expect(rows[3]).not.toHaveTextContent('888')
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(requests.at(-1)?.searchParams.get('page')).toBe('2'))
  fireEvent.change(screen.getByLabelText('From date'), { target: { value: '2026-11-01' } })
  await waitFor(() => expect(requests.at(-1)?.searchParams.get('from')).toBe('2026-11-01'))
  expect(requests.at(-1)?.searchParams.get('page')).toBe('1')
  fireEvent.change(screen.getByLabelText('To date'), { target: { value: '2026-10-01' } })
  expect(screen.getByText('The end date must be on or after the start date.')).toBeVisible()
  expect(screen.queryByRole('table', { name: 'Daily usage' })).not.toBeInTheDocument()
})

it('loads tool status lazily with distinct quota windows and keeps zero distinct from null', async () => {
  const statuses = vi.fn()
  server.use(
    http.get('*/api/v1/me/devices/:id/tool-status', ({ params }) => {
      expect(params.id).toBe(deviceId)
      statuses()
      return HttpResponse.json(
        pageData([
          {
            tool: 'CODEX',
            observedAt: '2026-11-06T00:00:00Z',
            authStatus: 'LOGGED_IN',
            quotaStatus: 'OK',
            windowCode: 'PRIMARY',
            usedPercent: 0,
            resetsAt: null
          },
          {
            tool: 'CODEX',
            observedAt: '2026-11-06T00:00:00Z',
            authStatus: 'NEW_AUTH',
            quotaStatus: 'FAILED',
            windowCode: 'SECONDARY',
            usedPercent: null,
            resetsAt: null
          }
        ])
      )
    })
  )
  mount()
  await openDevice()
  expect(statuses).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Tool status' }))
  const table = await screen.findByRole('table', { name: 'Tool status' })
  expect(within(table).getByText('0%')).toBeVisible()
  expect(within(table).getByText('Primary')).toBeVisible()
  expect(within(table).getByText('Secondary')).toBeVisible()
  expect(within(table).getByText('Unknown status')).toBeVisible()
  expect(statuses).toHaveBeenCalledTimes(1)
})

it('honors Retry-After for device-list reads instead of immediately offering another request', async () => {
  server.use(
    http.get('*/api/v1/me/devices', () =>
      HttpResponse.json(
        { error: { code: 'HTTP_TOO_MANY_REQUESTS' } },
        {
          status: 429,
          headers: { 'Retry-After': '3' }
        }
      )
    )
  )
  mount()
  const alert = await screen.findByRole('alert')
  expect(await within(alert).findByRole('button', { name: /Try again in/ })).toBeDisabled()
  expect(screen.queryByText('No company devices registered to you')).not.toBeInTheDocument()
})
