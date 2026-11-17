import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { DepartmentSoftwareEditor } from './components/department-software-editor'
vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
it('preserves selections across pages and sends only additions and removals', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') return { data: {} }
    if (config.url?.endsWith('/software-list'))
      return {
        data: {
          items: [
            { entryId: 'entry-a', applicationId: 'app-a', planId: 'plan-a', applicationName: 'Alpha', planName: 'A' }
          ],
          pagination: { totalPages: 1 }
        }
      }
    if (config.url?.endsWith('/plans'))
      return {
        data: {
          items:
            config.params?.page === 1
              ? [
                  { id: 'plan-a', applicationId: 'app-a', applicationName: 'Alpha', name: 'A' },
                  { id: 'plan-b', applicationId: 'app-b', applicationName: 'Beta', name: 'B' }
                ]
              : [{ id: 'plan-c', applicationId: 'app-c', applicationName: 'Gamma', name: 'C' }],
          pagination: { totalItems: 21 }
        }
      }
    throw new Error('Unexpected request')
  })
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <DepartmentSoftwareEditor departmentId='d1' onClose={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('checkbox', { name: 'Alpha · A' }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'Beta · B' }))
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  fireEvent.click(await screen.findByRole('checkbox', { name: 'Gamma · C' }))
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        data: {
          add: [
            { applicationId: 'app-b', planId: 'plan-b' },
            { applicationId: 'app-c', planId: 'plan-c' }
          ],
          remove: ['entry-a']
        }
      }),
      undefined
    )
  )
})
