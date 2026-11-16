import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { beforeEach, expect, it, vi } from 'vitest'
import i18n from 'i18next'
import '~/shared/i18n/i18n'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { ItDevicesView } from './views/it-devices-view'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const pagination = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
const device = {
  id: 'device-1',
  assetCode: 'COMPANY-001',
  hostname: 'workstation',
  os: 'Windows',
  holder: null,
  registrationId: 'registration-1',
  state: 'ACTIVE',
  signatureRecorded: true,
  registeredFrom: '2026-11-01',
  collection: { state: 'ACTIVE', lastAcceptedAt: null }
}
function Location() {
  return <output data-testid='location'>{useLocation().search}</output>
}
function mount(entry = '/?tab=device-collectors') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <ItDevicesView />
        <Location />
      </QueryClientProvider>
    </MemoryRouter>
  )
}
beforeEach(async () => {
  await i18n.changeLanguage('en')
  await i18n.loadNamespaces(['itDevices', 'itAdmin', 'admin'])
  vi.mocked(customAxios).mockReset()
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.endsWith('/registrations'))
      return {
        data: {
          items: [
            {
              id: 'registration-old',
              holder: { id: 'holder-1', employeeCode: 'EMP-001', fullName: 'Previous Holder' },
              validFrom: '2026-10-01',
              validUntil: '2026-10-31',
              endedAt: '2026-10-31T00:00:00Z',
              endCause: 'HOLDER_CHANGED',
              signatureRecorded: true,
              acknowledgedFrom: null,
              collectionStoppedAt: null,
              lastAcceptedAt: null
            }
          ],
          pagination
        }
      }
    if (config.url?.endsWith('/credentials') || config.url?.endsWith('/usage'))
      return { data: { items: [], pagination } }
    if (config.url?.endsWith('/device-1')) return { data: device }
    return { data: { items: [device], pagination } }
  })
})

it('replaces the registry with bookmarkable pages and restores list filters on return', async () => {
  mount()
  fireEvent.change(screen.getByLabelText('Collection state'), { target: { value: 'ACTIVE' } })
  fireEvent.click(await screen.findByRole('button', { name: 'COMPANY-001' }))
  expect(await screen.findByRole('heading', { name: 'COMPANY-001' })).toBeVisible()
  expect(screen.queryByRole('table')).not.toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('location')).toHaveTextContent('deviceId=device-1')
  fireEvent.click(screen.getByRole('button', { name: 'Daily usage' }))
  expect(await screen.findByRole('heading', { name: 'Daily usage' })).toBeVisible()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('location')).toHaveTextContent('deviceSection=usage')
  fireEvent.click(screen.getByRole('button', { name: 'Back to device' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Back to devices' }))
  expect(await screen.findByRole('table')).toBeVisible()
  expect(screen.getByLabelText('Collection state')).toHaveValue('ACTIVE')
})

it('opens holder history from a direct link and reads credentials for the historical registration', async () => {
  mount('/?tab=device-collectors&deviceId=device-1&deviceSection=history')
  expect(await screen.findByRole('heading', { name: 'Holder history' })).toBeVisible()
  expect(await screen.findByText('Previous Holder')).toBeVisible()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Collector credentials' }))
  expect(await screen.findByRole('heading', { name: 'Collector credentials' })).toBeVisible()
  await waitFor(() =>
    expect(
      vi
        .mocked(customAxios)
        .mock.calls.some(([config]) => config.url?.endsWith('/device-registrations/registration-old/credentials'))
    ).toBe(true)
  )
})

it('does not interpret acknowledgement as an active collector', async () => {
  mount('/?tab=device-collectors&deviceId=device-1')
  expect(await screen.findByText('No collection received yet')).toBeVisible()
  expect(
    screen.getByText('Acknowledgement permits collection; it does not confirm the collector is sending data.')
  ).toBeVisible()
})
