import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import i18n from 'i18next'
import '~/shared/i18n/i18n'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { SignatureDialog } from './components/signature-dialog'
import { DeviceResults } from './components/device-results'
import { DeviceDetail } from './components/device-detail'
import { MyDevices } from './components/my-devices'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
beforeEach(async () => {
  vi.mocked(customAxios).mockReset()
  await i18n.changeLanguage('en')
  await i18n.loadNamespaces(['itDevices', 'itAdmin', 'admin', 'devicePrivacy'])
})
afterEach(() => vi.unstubAllGlobals())
const pagination = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
const notice = {
  id: '11111111-1111-4111-8111-111111111111',
  versionNumber: 1,
  collected: 'Daily counts',
  notCollected: 'Chat contents',
  purpose: 'License management',
  retention: '90 days',
  stopRight: 'Contact IT',
  includesToolStatus: true
}
function mount(child: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(<QueryClientProvider client={client}>{child}</QueryClientProvider>)
  return client
}

it('uploads a signature without user bearer credentials and records only the completed document reference', async () => {
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.endsWith('/monitoring-notices/current')) return { data: notice }
    if (config.url?.endsWith('/documents') && config.method === 'POST')
      return {
        data: {
          document: { id: 'doc-1' },
          upload: {
            url: 'https://storage.example.invalid/file?signed=secret',
            method: 'PUT',
            headers: { 'Content-Type': 'application/pdf' },
            expiresAt: '2099-01-01T00:00:00Z'
          }
        }
      }
    if (config.method === 'GET' && config.url?.endsWith('/doc-1'))
      return { data: { document: { id: 'doc-1', status: 'AWAITING_UPLOAD' } } }
    return { data: { id: 'signature-1' } }
  })
  const storage = vi.fn(async () => new Response(null, { status: 200 }))
  vi.stubGlobal('fetch', storage)
  const onClose = vi.fn()
  const client = mount(<SignatureDialog deviceId='device-1' registrationId='registration-1' onClose={onClose} />)
  await waitFor(() => expect(screen.getByLabelText('Signed notice version ID')).toHaveValue(notice.id))
  fireEvent.change(screen.getByLabelText('Signed notice file'), {
    target: { files: [new File(['pdf'], 'signed.pdf', { type: 'application/pdf' })] }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Upload and record signature' }))
  await waitFor(() => expect(onClose).toHaveBeenCalled())
  const requests = vi.mocked(customAxios).mock.calls.map(([config]) => config)
  expect(
    requests.find((request) => request.method === 'POST' && request.url?.endsWith('/documents'))?.data
  ).toMatchObject({ purpose: 'SIGNATURE_RECORD' })
  expect(storage).toHaveBeenCalledWith(
    'https://storage.example.invalid/file?signed=secret',
    expect.objectContaining({
      method: 'PUT',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      headers: { 'Content-Type': 'application/pdf' }
    })
  )
  expect(requests.findIndex((request) => request.url?.endsWith('/complete'))).toBeLessThan(
    requests.findIndex((request) => request.url?.endsWith('/signature-records'))
  )
  expect(requests.find((request) => request.url?.endsWith('/signature-records'))?.data).toEqual({
    documentId: 'doc-1',
    noticeVersionId: notice.id
  })
  expect(
    JSON.stringify(
      client
        .getMutationCache()
        .getAll()
        .map((mutation) => mutation.state.data)
    )
  ).not.toContain('signed=secret')
})

it('shows unavailable observation as no data and preserves real zero observations', async () => {
  vi.mocked(customAxios).mockResolvedValue({
    data: {
      items: [
        {
          date: '2026-11-05',
          tool: 'CODEX',
          coverage: 'NOT_OBSERVABLE',
          responses: 0,
          totalTokens: 0,
          experimental: false
        },
        {
          date: '2026-11-04',
          tool: 'CLAUDE_CODE',
          coverage: 'COVERED',
          responses: 0,
          totalTokens: 0,
          experimental: false
        }
      ],
      pagination
    }
  })
  mount(<DeviceResults id='device-1' kind='usage' onClose={vi.fn()} />)
  expect(await screen.findByText('No observable data')).toBeVisible()
  const articles = document.querySelectorAll('article')
  expect(articles[0]).not.toHaveTextContent('Responses')
  expect(articles[1]).toHaveTextContent('Responses0')
  expect(articles[1]).toHaveTextContent('Tokens0')
})

it('opens lifecycle actions in a replacement dialog without writing until submitted', async () => {
  vi.mocked(customAxios).mockResolvedValue({
    data: {
      id: 'device-1',
      assetCode: 'IT-001',
      hostname: 'test-host',
      os: 'Windows',
      holder: null,
      registrationId: 'registration-1',
      state: 'ACTIVE',
      signatureRecorded: true,
      registeredFrom: '2026-11-01'
    }
  })
  mount(<DeviceDetail id='device-1' onClose={vi.fn()} />)
  fireEvent.click(await screen.findByRole('button', { name: 'Change holder' }))
  expect(screen.getAllByRole('dialog')).toHaveLength(1)
  expect(screen.queryByText('test-host')).not.toBeInTheDocument()
  expect(screen.getByLabelText('Holder employee ID')).toBeVisible()
  expect(vi.mocked(customAxios).mock.calls.every(([config]) => config.method === 'GET')).toBe(true)
})

it('requires explicit holder confirmation and sends the notice version the holder read', async () => {
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.endsWith('/me/devices'))
      return {
        data: {
          items: [
            {
              registrationId: 'registration-1',
              deviceId: 'device-1',
              assetCode: 'IT-001',
              hostname: 'test-host',
              validFrom: '2026-11-01',
              os: 'Windows',
              endedAt: null,
              acknowledgedVersionNumber: null,
              acknowledgementState: 'UNACKNOWLEDGED',
              canAcknowledge: true
            }
          ],
          pagination
        }
      }
    if (config.url?.endsWith('/monitoring-notices/current')) return { data: notice }
    if (config.url?.endsWith('/usage')) return { data: { items: [], pagination } }
    return { data: {} }
  })
  mount(<MyDevices />)
  fireEvent.click(await screen.findByRole('button', { name: 'View details' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Acknowledge monitoring notice' }))
  const submit = within(await screen.findByRole('dialog')).getByRole('button', {
    name: 'Acknowledge monitoring notice'
  })
  expect(submit).toBeDisabled()
  expect(await screen.findByText('Chat contents')).toBeVisible()
  fireEvent.click(screen.getByLabelText('I have read this notice and acknowledge collection for this device.'))
  fireEvent.click(submit)
  await waitFor(() =>
    expect(vi.mocked(customAxios).mock.calls.some(([config]) => config.url?.endsWith('/acknowledgements'))).toBe(true)
  )
  expect(
    vi.mocked(customAxios).mock.calls.find(([config]) => config.url?.endsWith('/acknowledgements'))?.[0].data
  ).toEqual({ noticeVersionId: notice.id })
})
