import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import type { MyDevicePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/my-devices/myDevicePageResponseDtoDataItemsItem'
import type { MonitoringNoticeResponseDtoData } from '~/shared/api/generated/model/monitoring-notices/monitoringNoticeResponseDtoData'
import type { MyDeviceUsagePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/ai-usage/myDeviceUsagePageResponseDtoDataItemsItem'
import { employeeProfile } from './employee-api'
import { EmployeeScreen } from '~/features/dashboard/employee/employee-screen'

export const deviceId = '22222222-2222-4222-8222-222222222222'
export const registrationId = '33333333-3333-4333-8333-333333333333'
export const device: MyDevicePageResponseDtoDataItemsItem = {
  deviceId,
  registrationId,
  assetCode: 'COMPANY-001',
  hostname: 'company-laptop',
  os: 'Windows',
  validFrom: '2026-11-01',
  endedAt: null,
  acknowledgementState: 'UNACKNOWLEDGED',
  acknowledgedVersionNumber: null,
  signatureRecorded: true,
  canAcknowledge: true,
  blockedReason: null
}
export const notice: NonNullable<MonitoringNoticeResponseDtoData> = {
  id: '44444444-4444-4444-8444-444444444444',
  versionNumber: 1,
  collected: 'Daily counts',
  notCollected: 'Chat contents',
  purpose: 'License management',
  retention: 'Six months',
  stopRight: 'Contact IT',
  includesToolStatus: true,
  requiresReacknowledgement: false,
  publishedAt: '2026-11-01T00:00:00Z'
}
export const usage: MyDeviceUsagePageResponseDtoDataItemsItem = {
  date: '2026-11-05',
  tool: 'CODEX',
  experimental: false,
  coverage: 'COVERED',
  responses: 0,
  totalTokens: 0,
  active: false,
  generatedAt: '2026-11-06T00:00:00Z'
}
export function pageData(items: unknown[], page = 1, totalPages = 1) {
  return {
    success: true,
    data: { items, pagination: { page, pageSize: 20, totalItems: totalPages > 1 ? 21 : items.length, totalPages } }
  }
}
export const server = setupServer(
  http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: employeeProfile })),
  http.get('*/api/v1/me/devices', () => HttpResponse.json(pageData([device]))),
  http.get('*/api/v1/monitoring-notices/current', () => HttpResponse.json({ success: true, data: notice })),
  http.get('*/api/v1/me/devices/:id/usage', () => HttpResponse.json(pageData([]))),
  http.get('*/api/v1/me/devices/:id/tool-status', () => HttpResponse.json(pageData([])))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
})
export function mount(tab: 'privacy' | 'data-export' | 'data-usage' = 'privacy') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <EmployeeScreen tab={tab} onSelectTab={vi.fn()} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return client
}
export async function openDevice() {
  fireEvent.click(await screen.findByRole('button', { name: 'View details' }))
}
export async function openAcknowledgement() {
  await openDevice()
  fireEvent.click(await screen.findByRole('button', { name: 'Acknowledge monitoring notice' }))
  const dialog = await screen.findByRole('dialog')
  await within(dialog).findByText('Chat contents')
  return dialog
}
export const confirmText = 'I have read this notice and acknowledge collection for this device.'

export { employeeProfile }
