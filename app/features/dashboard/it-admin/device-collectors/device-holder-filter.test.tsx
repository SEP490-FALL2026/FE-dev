import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { ItDevicesView } from './views/it-devices-view'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))

it('enables the holder picker after selecting a department and resets the filter when changing departments', async () => {
  await setAppLanguage('en', false)
  const employee = '11111111-1111-4111-8111-111111111111'
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) => {
    if (config.url?.endsWith('/departments'))
      return {
        data: {
          items: [
            { id: 'd1', name: 'Design', code: 'D' },
            { id: 'd2', name: 'Sales', code: 'S' }
          ],
          pagination: { totalPages: 1 }
        }
      }
    if (config.url?.includes('/technical-members'))
      return {
        data: {
          items: config.url.includes('/d1/')
            ? [{ id: employee, fullName: 'Alice', code: 'E1', employmentStatus: 'WORKING' }]
            : [
                { id: '22222222-2222-4222-8222-222222222222', fullName: 'Bob', code: 'E2', employmentStatus: 'WORKING' }
              ],
          pagination: { totalPages: 1 }
        }
      }
    return { data: { items: [], pagination: { totalItems: 0 } } }
  })
  render(
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <ItDevicesView />
      </QueryClientProvider>
    </MemoryRouter>
  )
  const holder = screen.getByRole('combobox', { name: 'Device holder' })
  expect(holder).toBeDisabled()
  const department = await screen.findByRole('combobox', { name: 'Department' })
  await waitFor(() => expect(department).toBeEnabled())
  fireEvent.click(department)
  fireEvent.click(screen.getByRole('option', { name: /Design/ }))
  await waitFor(() => expect(holder).toBeEnabled())
  fireEvent.click(holder)
  fireEvent.click(screen.getByRole('option', { name: /Alice/ }))
  await waitFor(() =>
    expect(
      request.mock.calls.some(
        ([config]) => config.url?.endsWith('/devices') && config.params?.holderEmployeeId === employee
      )
    ).toBe(true)
  )
  fireEvent.click(department)
  fireEvent.click(screen.getByRole('option', { name: /Sales/ }))
  await waitFor(() => expect(holder).toBeEnabled())
  fireEvent.click(holder)
  expect(screen.getByRole('option', { name: /Bob/ })).toBeInTheDocument()
  expect(screen.queryByRole('option', { name: /Alice/ })).not.toBeInTheDocument()
  await waitFor(() =>
    expect(
      request.mock.calls.filter(([config]) => config.url?.endsWith('/devices')).at(-1)?.[0].params?.holderEmployeeId
    ).toBeUndefined()
  )
})
