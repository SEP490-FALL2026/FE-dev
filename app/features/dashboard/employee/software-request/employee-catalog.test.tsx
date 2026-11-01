import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import {
  catalogApplication,
  catalogPlan,
  chooseCatalogPlan,
  employeeCatalogHandlers
} from '../../../../../test/fixtures/employee-catalog'
import { pageResponse, planId, requestId, requestPreview } from '../../../../../test/fixtures/employee-api'
import { EmployeeLiveCreateView } from './views/employee-live-create-view'

const server = setupServer(...employeeCatalogHandlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  server.resetHandlers()
  vi.clearAllMocks()
  await setAppLanguage('en', false)
})
function mount() {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter initialEntries={['/?tab=create-request']}>
        <EmployeeLiveCreateView onSelectTab={vi.fn()} />
      </MemoryRouter>
    </QueryClientProvider>
  )
}
function reason() {
  fireEvent.change(screen.getByLabelText('Business reason'), { target: { value: 'Development work' } })
}

describe('Employee requester catalog', () => {
  it('uses all three authorized routes, displays details and previews the selected plan ID', async () => {
    const calls: string[] = []
    const preview = vi.fn()
    server.use(
      http.get('*/api/v1/requestable-applications', ({ request }) => {
        calls.push(new URL(request.url).pathname)
        return HttpResponse.json(pageResponse([catalogApplication]))
      }),
      http.get('*/api/v1/requestable-applications/:id', ({ request }) => {
        calls.push(new URL(request.url).pathname)
        return HttpResponse.json({
          success: true,
          data: { ...catalogApplication, functionalGroup: { id: requestId, name: 'Development' } }
        })
      }),
      http.get('*/api/v1/requestable-plans', ({ request }) => {
        const url = new URL(request.url)
        calls.push(url.pathname)
        expect(url.searchParams.get('applicationId')).toBe(planId)
        return HttpResponse.json(pageResponse([catalogPlan]))
      }),
      http.post('*/api/v1/access-requests/preview', async ({ request }) => {
        preview(await request.json())
        return HttpResponse.json({ success: true, data: { preview: requestPreview } })
      })
    )
    mount()
    expect(calls).toHaveLength(0)
    expect(screen.queryByLabelText('Plan ID supplied by IT')).not.toBeInTheDocument()
    await chooseCatalogPlan()
    expect(screen.getAllByText('Test Vendor').length).toBeGreaterThan(0)
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    reason()
    fireEvent.click(screen.getByRole('button', { name: 'Preview request' }))
    await screen.findByRole('button', { name: 'Submit request' })
    expect(preview).toHaveBeenCalledWith({ planId, termMonths: 1 })
    expect(calls.map((pathname) => pathname.slice(pathname.indexOf('/api/v1/')))).toEqual([
      '/api/v1/requestable-applications',
      `/api/v1/requestable-applications/${planId}`,
      '/api/v1/requestable-plans'
    ])
  })

  it('searches and filters applications on the server, resetting page without using a functional-group ID input', async () => {
    const reads: URLSearchParams[] = []
    server.use(
      http.get('*/api/v1/requestable-applications', ({ request }) => {
        const params = new URL(request.url).searchParams
        reads.push(params)
        return HttpResponse.json(pageResponse([catalogApplication], Number(params.get('page')), 2))
      })
    )
    mount()
    fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
    await screen.findByRole('option', { name: /Test Software/ })
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    await waitFor(() => expect(reads.at(-1)?.get('page')).toBe('2'))
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '  design  ' } })
    await waitFor(() => expect(reads.at(-1)?.get('search')).toBe('design'))
    expect(reads.at(-1)?.get('page')).toBe('1')
    fireEvent.change(screen.getByLabelText('Software type'), { target: { value: 'INTERNAL' } })
    await waitFor(() => expect(reads.at(-1)?.get('kind')).toBe('INTERNAL'))
    expect(reads.at(-1)?.get('pageSize')).toBe('20')
  })

  it('pages and searches plans while retaining selection and a valid preview', async () => {
    const reads: URLSearchParams[] = []
    server.use(
      http.get('*/api/v1/requestable-plans', ({ request }) => {
        const params = new URL(request.url).searchParams
        reads.push(params)
        return HttpResponse.json(pageResponse([catalogPlan], Number(params.get('page')), 2))
      }),
      http.post('*/api/v1/access-requests/preview', () =>
        HttpResponse.json({ success: true, data: { preview: requestPreview } })
      )
    )
    mount()
    await chooseCatalogPlan()
    reason()
    fireEvent.click(screen.getByRole('button', { name: 'Preview request' }))
    await screen.findByRole('button', { name: 'Submit request' })
    fireEvent.click(screen.getByRole('combobox', { name: 'Software plan' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled())
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    await waitFor(() => expect(reads.at(-1)?.get('page')).toBe('2'))
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'standard' } })
    await waitFor(() => expect(reads.at(-1)?.get('search')).toBe('standard'))
    expect(reads.at(-1)?.get('page')).toBe('1')
    expect(await screen.findByRole('option', { name: /Standard/ })).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' })
    expect(screen.getByRole('button', { name: 'Submit request' })).toBeEnabled()
  })

  it('clears plan and preview when another application is selected', async () => {
    server.use(
      http.get('*/api/v1/requestable-applications', () =>
        HttpResponse.json(
          pageResponse([catalogApplication, { ...catalogApplication, id: requestId, name: 'Other Software' }])
        )
      ),
      http.post('*/api/v1/access-requests/preview', () =>
        HttpResponse.json({ success: true, data: { preview: requestPreview } })
      )
    )
    mount()
    await chooseCatalogPlan()
    reason()
    fireEvent.click(screen.getByRole('button', { name: 'Preview request' }))
    await screen.findByRole('button', { name: 'Submit request' })
    fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
    fireEvent.click(await screen.findByRole('option', { name: /Other Software/ }))
    expect(screen.queryByRole('button', { name: 'Submit request' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Preview request' })).toBeDisabled()
    expect(document.querySelector<HTMLInputElement>('input[name="planId"]')?.value).toBe('')
  })

  it('allows choosing an unpriced plan for preview and saving a finance-blocked plan as a draft', async () => {
    const saved = vi.fn()
    server.use(
      http.get('*/api/v1/requestable-plans', () =>
        HttpResponse.json(
          pageResponse([
            {
              ...catalogPlan,
              canSubmit: false,
              submitBlockedReason: 'FINANCE_SETUP_INCOMPLETE',
              price: { status: 'MISSING', missingReason: 'NO_PRICED_SUBSCRIPTION' }
            }
          ])
        )
      ),
      http.post('*/api/v1/access-requests/preview', () =>
        HttpResponse.json({ success: true, data: { preview: requestPreview } })
      ),
      http.post('*/api/v1/access-requests/drafts', async ({ request }) => {
        saved(await request.json())
        return HttpResponse.json({ success: true, data: null })
      }),
      http.get('*/api/v1/access-requests/drafts', () => HttpResponse.json(pageResponse()))
    )
    mount()
    await chooseCatalogPlan()
    reason()
    expect(screen.getByText('Pricing not available yet')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Preview request' }))
    expect(await screen.findByRole('button', { name: 'Submit request' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Save draft' }))
    await waitFor(() => expect(saved).toHaveBeenCalledWith(expect.objectContaining({ kind: 'INDIVIDUAL', planId })))
  })

  it('handles application detail failures with retry before enabling plan selection', async () => {
    let failed = true
    server.use(
      http.get('*/api/v1/requestable-applications/:id', () =>
        failed
          ? HttpResponse.json({ message: 'private backend detail' }, { status: 503 })
          : HttpResponse.json({ success: true, data: catalogApplication })
      )
    )
    mount()
    fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
    fireEvent.click(await screen.findByRole('option', { name: /Test Software/ }))
    expect(await screen.findByRole('alert')).not.toHaveTextContent('private backend detail')
    expect(screen.getByRole('combobox', { name: 'Software plan' })).toBeDisabled()
    failed = false
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Software plan' })).toBeEnabled())
  })

  it('shows department errors and empty catalogs without accepting IDs from a link', async () => {
    server.use(
      http.get('*/api/v1/requestable-applications', () =>
        HttpResponse.json({ error: { code: 'REQUESTABLE_SOFTWARE.NO_DEPARTMENT' } }, { status: 409 })
      )
    )
    mount()
    fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('You are not assigned to a department')
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeDisabled()
    server.use(http.get('*/api/v1/requestable-applications', () => HttpResponse.json(pageResponse([]))))
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('No software matches your search')).toBeInTheDocument()
  })
})
