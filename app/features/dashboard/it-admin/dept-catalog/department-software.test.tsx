import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { DepartmentSoftware } from './components/department-software'
import { ItDepartmentSoftwareView } from './views/it-department-software-view'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))

it('opens software suggestions for the chosen department', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.endsWith('/me')) return { data: { roles: ['IT_ADMIN'], employee: { id: 'it1' } } }
    if (config.url?.endsWith('/departments'))
      return {
        data: {
          items: [{ id: 'd1', name: 'Design', code: 'D', itAdmin: { employeeId: 'it1', usable: true } }],
          pagination: { totalPages: 1 }
        }
      }
    if (config.url?.endsWith('/departments/d1'))
      return { data: { id: 'd1', name: 'Design', itAdmin: { employeeId: 'it1', usable: true } } }
    return { data: { items: [], pagination: { totalItems: 0 } } }
  })
  render(
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <ItDepartmentSoftwareView />
      </QueryClientProvider>
    </MemoryRouter>
  )
  expect(await screen.findByText('Design')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Choose' }))
  expect(await screen.findByRole('button', { name: /back/i })).toBeInTheDocument()
})

it('removes only selected entry identifiers without replacing entries on other pages', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') return { data: { added: [], removed: ['entry-one'] } }
    return {
      data: {
        departmentId: 'department-one',
        items: [
          {
            entryId: 'entry-one',
            applicationId: 'app-one',
            applicationName: 'Figma',
            planId: 'plan-one',
            planName: 'Team',
            addedAt: '2026-11-16T00:00:00Z'
          }
        ],
        pagination: { page: 1, pageSize: 20, totalItems: 21, totalPages: 2 }
      }
    }
  })
  render(
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <DepartmentSoftware departmentId='department-one' departmentName='Design' onBack={vi.fn()} canManage />
      </QueryClientProvider>
    </MemoryRouter>
  )
  fireEvent.click(await screen.findByRole('checkbox', { name: 'Remove Figma · Team' }))
  fireEvent.click(screen.getByRole('button', { name: 'Review changes' }))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm changes' }))
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  const post = request.mock.calls.find(([config]) => config.method === 'POST')?.[0]
  expect(post?.url).toContain('/departments/department-one/software-list/changes')
  expect(post?.data).toEqual({ remove: ['entry-one'] })
})
