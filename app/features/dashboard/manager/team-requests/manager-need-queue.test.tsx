import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { needItem } from '../../../../../test/fixtures/manager-integration'
import { ManagerNeedQueue } from './components/manager-need-queue'

const server = setupServer(
  http.get('*/api/v1/need-decisions', () =>
    HttpResponse.json({
      success: true,
      data: {
        items: [
          { ...needItem, dueOn: '2000-01-01', softwareName: 'Overdue tool', plan: null },
          {
            ...needItem,
            requestId: 'future-request',
            stepId: 'future-step',
            dueOn: '2999-01-01',
            softwareName: 'Future tool',
            plan: null
          }
        ],
        pagination: { page: 1, pageSize: 20, totalItems: 2, totalPages: 1 }
      }
    })
  )
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())

it('marks overdue waiting steps without marking a future due date', async () => {
  await setAppLanguage('en', false)
  const onOpen = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <ManagerNeedQueue onOpen={onOpen} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  await screen.findByText('Overdue tool')
  expect(within(screen.getByRole('row', { name: /Overdue tool/ })).getByText('Overdue')).toBeInTheDocument()
  expect(within(screen.getByRole('row', { name: /Future tool/ })).queryByText('Overdue')).not.toBeInTheDocument()
  expect(onOpen).not.toHaveBeenCalled()
})
