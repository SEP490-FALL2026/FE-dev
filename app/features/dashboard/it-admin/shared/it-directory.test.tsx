import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItDirectoryLookup } from './components/it-directory-lookup'
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
it('lazily selects an active department then a working technical member by real IDs', async () => {
  await setAppLanguage('en', false)
  const calls: string[] = []
  server.use(
    http.get('*/api/v1/departments', () => {
      calls.push('departments')
      return HttpResponse.json({
        success: true,
        data: { items: [{ id: 'department-1', name: 'Engineering', code: 'ENG' }], pagination: { totalItems: 1 } }
      })
    }),
    http.get('*/api/v1/departments/department-1/technical-members', () => {
      calls.push('members')
      return HttpResponse.json({
        success: true,
        data: {
          items: [
            { id: 'employee-1', code: 'E-1', fullName: 'Working Person', employmentStatus: 'WORKING' },
            { id: 'left-1', code: 'L-1', fullName: 'Left Person', employmentStatus: 'LEFT' }
          ],
          pagination: { totalItems: 2 }
        }
      })
    })
  )
  const select = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ItDirectoryLookup mode='employee' onSelect={select} />
    </QueryClientProvider>
  )
  expect(calls).toEqual([])
  fireEvent.click(screen.getByRole('button', { name: 'Browse people' }))
  fireEvent.click(await screen.findByRole('button', { name: /Engineering/ }))
  expect(await screen.findByRole('button', { name: /Working Person/ })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /Left Person/ })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /Working Person/ }))
  expect(select).toHaveBeenCalledWith('employee-1')
})
