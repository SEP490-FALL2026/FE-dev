import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'
import { ProvisioningDirectory } from './components/provisioning-directory'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
it('opens requests only after choosing a managed department and its employee', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.endsWith('/technical-members'))
      return { data: { items: [{ id: 'e1', code: 'E1', fullName: 'Alice' }], pagination: { totalPages: 1 } } }
    if (config.url?.endsWith('/departments'))
      return {
        data: {
          items: [
            {
              id: 'd1',
              name: 'Engineering',
              code: 'ENG',
              status: 'ACTIVE',
              head: { fullName: 'Department Lead' },
              memberCount: 12,
              itAdmin: { employeeId: 'it1', usable: true }
            },
            { id: 'd2', name: 'Other', code: 'OTH', itAdmin: { employeeId: 'other', usable: true } }
          ],
          pagination: { totalPages: 1 }
        }
      }
    return { data: { items: [], pagination: { totalItems: 0, totalPages: 0 } } }
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  client.setQueryData(getMeGetQueryKey(), { data: { roles: ['IT_ADMIN'], employee: { id: 'it1' } } })
  render(
    <QueryClientProvider client={client}>
      <ProvisioningDirectory onCreated={vi.fn()} />
    </QueryClientProvider>
  )
  const open = await screen.findByRole('button', { name: /Engineering/ })
  expect(screen.getByText('Department Lead')).toBeInTheDocument()
  expect(screen.getByText('12')).toBeInTheDocument()
  fireEvent.click(open)
  expect(screen.queryByText('Other')).not.toBeInTheDocument()
  expect(vi.mocked(customAxios).mock.calls.some(([config]) => config.url?.endsWith('/grant-queue'))).toBe(false)
  fireEvent.click(await screen.findByRole('button', { name: /Alice/ }))
  expect(await screen.findByText('Alice')).toBeInTheDocument()
  expect(
    vi
      .mocked(customAxios)
      .mock.calls.some(
        ([config]) => config.url?.endsWith('/grant-queue') && config.params?.beneficiaryEmployeeId === 'e1'
      )
  ).toBe(true)
})
