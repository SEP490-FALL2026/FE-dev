import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { DeviceDetail } from './components/device-detail'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))

it('groups device details and hides the signed notice and enrollment actions', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockResolvedValue({
    data: {
      id: 'device-1',
      assetCode: 'SV-001',
      hostname: 'Laptop',
      os: 'Windows',
      holder: { fullName: 'Alice', employeeCode: 'E01' },
      state: 'ACTIVE',
      registrationId: 'registration-1',
      signatureRecorded: true,
      latestSignatureRecord: { documentId: 'document-1', noticeVersionNumber: 1, recordedAt: '2026-11-01' }
    }
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <DeviceDetail id='device-1' onClose={vi.fn()} />
    </QueryClientProvider>
  )
  const info = await screen.findByRole('region', { name: 'Device information' })
  expect(within(info).getByText('Windows')).toBeInTheDocument()
  expect(
    within(screen.getByRole('region', { name: 'Holder and handover' })).getByText('Alice (E01)')
  ).toBeInTheDocument()
  expect(screen.getByRole('region', { name: 'Collection activity' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Change holder' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Daily usage' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Open signed notice' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Record signed notice' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Enrollment code' })).not.toBeInTheDocument()
})
