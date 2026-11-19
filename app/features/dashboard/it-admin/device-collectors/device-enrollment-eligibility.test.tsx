import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { DeviceDetail } from './components/device-detail'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
})

function mount(state: string, signatureRecorded: boolean, registrationId: string | null = 'registration-1') {
  vi.mocked(customAxios).mockResolvedValue({
    data: {
      id: 'device-1',
      assetCode: 'IT-001',
      hostname: 'laptop',
      os: 'Windows',
      holder: null,
      registrationId,
      state,
      signatureRecorded
    }
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <DeviceDetail id='device-1' onClose={vi.fn()} />
    </QueryClientProvider>
  )
}

it('hides enrollment for a signed registration awaiting acknowledgement', async () => {
  mount('AWAITING_ACKNOWLEDGEMENT', true)
  await screen.findByText('IT-001', { selector: 'h2' })
  expect(screen.queryByRole('button', { name: 'Enrollment code' })).not.toBeInTheDocument()
})

it('does not offer a collector code before the signed record exists', async () => {
  mount('AWAITING_ACKNOWLEDGEMENT', false)
  await screen.findByText('IT-001', { selector: 'h2' })
  expect(screen.queryByRole('button', { name: 'Enrollment code' })).not.toBeInTheDocument()
})

it('does not offer a collector code when there is no open registration', async () => {
  mount('UNREGISTERED', false, null)
  await screen.findByText('IT-001', { selector: 'h2' })
  expect(screen.queryByRole('button', { name: 'Enrollment code' })).not.toBeInTheDocument()
})

it.each(['ACTIVE', 'COLLECTION_STOPPED'])(
  'hides enrollment on a signed open registration in %s state',
  async (state) => {
    mount(state, true)
    await screen.findByText('IT-001', { selector: 'h2' })
    expect(screen.queryByRole('button', { name: 'Enrollment code' })).not.toBeInTheDocument()
  }
)
