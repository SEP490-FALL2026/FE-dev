import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import '~/shared/i18n/i18n'
import i18n from 'i18next'
import { deviceCreate } from '~/shared/api/generated/operations/devices/device-create'
import { deviceHolderChange } from '~/shared/api/generated/operations/devices/device-holder-change'
import { deviceRetire } from '~/shared/api/generated/operations/devices/device-retire'
import { DeviceCreateDialog, DeviceActionDialog } from './components/device-forms'

vi.mock('~/shared/api/generated/operations/devices/device-create', () => ({ deviceCreate: vi.fn() }))
vi.mock('~/shared/api/generated/operations/devices/device-holder-change', () => ({ deviceHolderChange: vi.fn() }))
vi.mock('~/shared/api/generated/operations/devices/device-retire', () => ({ deviceRetire: vi.fn() }))
const device = { id: 'device-1', registrationId: 'registration-1' }
function wrapper(children: React.ReactNode) {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      {children}
    </QueryClientProvider>
  )
}

it('creates a machine with descriptive fields and a strict body', async () => {
  await i18n.changeLanguage('en')
  vi.mocked(deviceCreate).mockResolvedValue({ success: true, message: '', data: null })
  const close = vi.fn()
  wrapper(<DeviceCreateDialog onClose={close} />)
  fireEvent.change(screen.getByLabelText('Asset code'), { target: { value: 'IT-001' } })
  fireEvent.change(screen.getByLabelText('Hostname'), { target: { value: 'workstation' } })
  fireEvent.change(screen.getByLabelText('Operating system'), { target: { value: 'Windows' } })
  fireEvent.change(screen.getByLabelText('Holder employee ID'), {
    target: { value: '11111111-1111-4111-8111-111111111111' }
  })
  expect(screen.getByLabelText('Holder employee ID')).toHaveAccessibleDescription()
  fireEvent.click(screen.getByRole('button', { name: 'Create device' }))
  await waitFor(() => expect(close).toHaveBeenCalled())
  expect(deviceCreate).toHaveBeenCalledWith({
    assetCode: 'IT-001',
    hostname: 'workstation',
    os: 'Windows',
    holderEmployeeId: '11111111-1111-4111-8111-111111111111'
  })
})

it('changes the holder and retires only through explicit action submission', async () => {
  await i18n.changeLanguage('en')
  vi.mocked(deviceHolderChange).mockResolvedValue({ success: true, message: '', data: null })
  vi.mocked(deviceRetire).mockResolvedValue({ success: true, message: '', data: null })
  const view = wrapper(<DeviceActionDialog device={device} action='holder' onClose={vi.fn()} />)
  expect(deviceHolderChange).not.toHaveBeenCalled()
  fireEvent.change(screen.getByLabelText('Holder employee ID'), {
    target: { value: '22222222-2222-4222-8222-222222222222' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Change holder' }))
  await waitFor(() =>
    expect(deviceHolderChange).toHaveBeenCalledWith('device-1', {
      holderEmployeeId: '22222222-2222-4222-8222-222222222222'
    })
  )
  view.unmount()
  wrapper(<DeviceActionDialog device={device} action='retire' onClose={vi.fn()} />)
  expect(deviceRetire).not.toHaveBeenCalled()
  fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Hardware replacement' } })
  fireEvent.click(screen.getByRole('button', { name: 'Retire device' }))
  await waitFor(() => expect(deviceRetire).toHaveBeenCalledWith('device-1', { reason: 'Hardware replacement' }))
})
