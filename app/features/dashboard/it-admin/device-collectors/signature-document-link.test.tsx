import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { DeviceDetail } from './components/device-detail'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
afterEach(() => vi.restoreAllMocks())

it('does not show the signed notice link in device details', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockImplementation(async (config) =>
    config.url?.endsWith('/links')
      ? { data: { url: 'https://storage.example.test/signed' } }
      : {
          data: {
            id: 'device-1',
            assetCode: 'IT-001',
            hostname: 'laptop',
            os: 'Windows',
            holder: null,
            registrationId: 'registration-1',
            state: 'ACTIVE',
            signatureRecorded: true,
            latestSignatureRecord: { documentId: 'doc-1', noticeVersionNumber: 1, recordedAt: '2026-11-01' }
          }
        }
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <DeviceDetail id='device-1' onClose={vi.fn()} />
    </QueryClientProvider>
  )
  await screen.findByText('laptop')
  expect(screen.queryByRole('button', { name: 'Open signed notice' })).not.toBeInTheDocument()
  expect(vi.mocked(customAxios).mock.calls.some(([config]) => config.url?.endsWith('/doc-1/links'))).toBe(false)
})
