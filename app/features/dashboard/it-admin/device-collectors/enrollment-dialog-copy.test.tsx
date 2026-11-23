import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { deviceEnrollmentCodeCreate } from '~/shared/api/generated/operations/device-credentials/device-enrollment-code-create'
import { EnrollmentDialog } from './components/enrollment-dialog'

vi.mock('~/shared/api/generated/operations/device-credentials/device-enrollment-code-create', () => ({
  deviceEnrollmentCodeCreate: vi.fn()
}))

it('copies the displayed one-time enrollment code on request', async () => {
  await setAppLanguage('en', false)
  vi.mocked(deviceEnrollmentCodeCreate).mockResolvedValue({
    success: true,
    message: '',
    data: {
      code: 'ABCD-EFGH-IJKL',
      expiresAt: '2099-01-01T00:00:00Z',
      collectorKind: 'AI_COLLECTOR',
      maxUses: 1
    }
  })
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
  render(
    <QueryClientProvider client={new QueryClient()}>
      <EnrollmentDialog registrationId='reg-1' onClose={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: 'Generate one-time code' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Copy code' }))
  await waitFor(() => expect(writeText).toHaveBeenCalledWith('ABCD-EFGH-IJKL'))
  vi.unstubAllGlobals()
})
