import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { useTranslation } from 'react-i18next'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, pageResponse, requestId } from '../../../../../test/fixtures/employee-api'
import { ManagerPlanAllocation, allocationFromForm } from './components/manager-plan-allocation'

const line = {
  position: 7,
  description: 'Design tools 2026',
  plan: { planId: employeeId, planName: 'Team' },
  amount: { amount: '12345678901234567890', currency: 'VND' },
  windowFrom: '2026-10-01',
  windowTo: '2026-12-31',
  overdue: false,
  suggested: true
}
const server = setupServer(
  http.get('*/api/v1/access-requests/:id/plan-line-suggestions', () => HttpResponse.json(pageResponse([line])))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount() {
  const submit = vi.fn()
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <AllocationForm submit={submit} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return { submit, client }
}
function AllocationForm({
  submit
}: {
  submit: (allocation: NonNullable<ReturnType<typeof allocationFromForm>>) => void
}) {
  const { t: translate } = useTranslation('manager')
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const allocation = allocationFromForm(new FormData(event.currentTarget))
        if (allocation) submit(allocation)
      }}
    >
      <ManagerPlanAllocation id={requestId} />
      <button type='submit'>{translate('submit')}</button>
    </form>
  )
}
it('requires choosing a returned line, sends its position and preserves the choice across pages', async () => {
  server.use(
    http.get('*/api/v1/access-requests/:id/plan-line-suggestions', ({ request }) => {
      const page = Number(new URL(request.url).searchParams.get('page'))
      return HttpResponse.json(
        pageResponse(page === 1 ? [line] : [{ ...line, position: 8, description: 'Other tools' }], page, 2)
      )
    })
  )
  const { submit } = mount()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(submit).not.toHaveBeenCalled()
  expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('combobox', { name: 'Budget plan line' }))
  fireEvent.click(await screen.findByRole('option', { name: /Design tools 2026/ }))
  fireEvent.click(screen.getByRole('combobox', { name: 'Budget plan line' }))
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await screen.findByRole('option', { name: /Other tools/ })
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(submit).toHaveBeenCalledWith({ planLine: { position: 7 } })
})
it('requires still-needed confirmation only for an overdue selected line and omits it outside the plan', async () => {
  server.use(
    http.get('*/api/v1/access-requests/:id/plan-line-suggestions', () =>
      HttpResponse.json(pageResponse([{ ...line, overdue: true }]))
    )
  )
  const { submit } = mount()
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('combobox', { name: 'Budget plan line' }))
  fireEvent.click(await screen.findByRole('option', { name: /Design tools 2026/ }))
  const needed = screen.getByRole('checkbox')
  expect(needed).toBeRequired()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(submit).not.toHaveBeenCalled()
  fireEvent.click(needed)
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(submit).toHaveBeenLastCalledWith({ planLine: { position: 7, stillNeeded: true } })
  fireEvent.click(screen.getByLabelText('Outside the annual plan'))
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(submit).toHaveBeenLastCalledWith({ offPlan: true })
})
it('handles empty and failed suggestions without accepting an invented position', async () => {
  let failed = true
  server.use(
    http.get('*/api/v1/access-requests/:id/plan-line-suggestions', () =>
      failed ? HttpResponse.json({}, { status: 503 }) : HttpResponse.json(pageResponse())
    )
  )
  const { submit } = mount()
  fireEvent.click(screen.getByRole('combobox', { name: 'Budget plan line' }))
  await screen.findByRole('alert')
  failed = false
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  expect(screen.queryByRole('option')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(submit).not.toHaveBeenCalled()
  fireEvent.click(screen.getByLabelText('Outside the annual plan'))
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(submit).toHaveBeenCalledWith({ offPlan: true })
})
