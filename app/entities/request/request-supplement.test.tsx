import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { RequestSupplementForm } from './components/request-supplement-form'
import { RequestRevision } from './components/request-revision'
import { catalogPlanDetails } from '../../../test/fixtures/employee-catalog'
import { accessRequest, employeeId, pageResponse, person, planId, requestId } from '../../../test/fixtures/employee-api'

const server = setupServer(
  http.get('*/api/v1/requestable-plans/:id', () => HttpResponse.json({ success: true, data: catalogPlanDetails }))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(() => setAppLanguage('en', false))
function mount(termMonths: number | null, group = false) {
  const sent = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <RequestSupplementForm
        id={requestId}
        planId={planId}
        termMonths={termMonths}
        group={group}
        disabled={false}
        onSubmit={sent}
      />
    </QueryClientProvider>
  )
  return sent
}

it('limits a K1 supplement to nine months even when changing from long-term', async () => {
  const sent = mount(null)
  const input = await screen.findByLabelText(/^Term of use/)
  expect(input).toHaveAttribute('max', '9')
  fireEvent.change(input, { target: { value: '10' } })
  fireEvent.change(screen.getByLabelText('Reason for the change'), { target: { value: 'Reduce spend' } })
  fireEvent.submit(input.closest('form')!)
  expect(sent).not.toHaveBeenCalled()
  fireEvent.change(input, { target: { value: '9' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
  expect(sent).toHaveBeenCalledWith({ termMonths: 9, reason: 'Reduce spend' })
})

it('only offers a shorter term and refuses an unchanged term', async () => {
  const sent = mount(6)
  const input = await screen.findByLabelText(/^Term of use/)
  expect(input).toHaveAttribute('max', '5')
  fireEvent.change(input, { target: { value: '6' } })
  fireEvent.submit(input.closest('form')!)
  expect(sent).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
})

it('does not offer term changes for K4', async () => {
  server.use(
    http.get('*/api/v1/requestable-plans/:id', () =>
      HttpResponse.json({ success: true, data: { ...catalogPlanDetails, provisioningType: 'K4' } })
    )
  )
  const sent = mount(null)
  await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
  expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
  expect(sent).not.toHaveBeenCalled()
})

it('only removes need-confirmed members and retains at least one', async () => {
  server.use(
    http.get('*/api/v1/access-requests/:id/lines', () =>
      HttpResponse.json(
        pageResponse([
          { employee: { ...person, employeeId, fullName: 'Alex' }, state: 'NEED_CONFIRMED' },
          { employee: { ...person, employeeId: planId, fullName: 'Robin' }, state: 'NEED_CONFIRMED' },
          { employee: { ...person, employeeId: requestId, fullName: 'Rejected member' }, state: 'NEED_REJECTED' }
        ])
      )
    )
  )
  const sent = mount(6, true)
  fireEvent.click(await screen.findByRole('checkbox', { name: 'Alex' }))
  expect(screen.getByRole('checkbox', { name: 'Robin' })).toBeDisabled()
  expect(screen.queryByRole('checkbox', { name: 'Rejected member' })).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Reason for the change'), { target: { value: 'Member left project' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
  expect(sent).toHaveBeenCalledWith({ dropEmployeeIds: [employeeId], reason: 'Member left project' })
})

it.each(['need', 'IT'] as const)('resubmits a %s return without sending a spend supplement', async (origin) => {
  const sent = vi.fn()
  const supplement = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/:id/resubmission', async ({ request }) => {
      sent(await request.text())
      return HttpResponse.json({ success: true, data: null })
    }),
    http.post('*/api/v1/access-requests/:id/supplements', () => {
      supplement()
      return HttpResponse.json({ success: true, data: null })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RequestRevision
        id={requestId}
        departmentId={employeeId}
        group={false}
        request={{
          ...accessRequest,
          routing:
            origin === 'need'
              ? { mode: 'VIA_HEAD', oneStepReason: null }
              : { mode: 'ONE_STEP', oneStepReason: 'REQUESTER_IS_HEAD' },
          spend: null
        }}
      />
    </QueryClientProvider>
  )
  expect(screen.queryByRole('button', { name: 'Revise returned request' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Resubmit request' }))
  await waitFor(() => expect(sent).toHaveBeenCalledExactlyOnceWith(''))
  expect(supplement).not.toHaveBeenCalled()
})
