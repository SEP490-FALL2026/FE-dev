import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { getPolicyStepGetQueryKey } from '~/shared/api/generated/operations/policies/policy-step-get'
import { ManagerNeedForm } from './components/manager-need-form'
import { ManagerReserveConfirmation } from './components/manager-reserve-confirmation'
import { ManagerLiveBatch } from './views/manager-live-batch'
import { managerReadHandlers } from '../../../../../test/fixtures/manager-integration'
import { answerChecklist, checklistBody } from '../../../../../test/fixtures/policy'
import { pageResponse, requestId } from '../../../../../test/fixtures/employee-api'
import { queueItem } from '../../../../../test/fixtures/manager-api'

const server = setupServer(...managerReadHandlers)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(() => setAppLanguage('en', false))
function mount(content: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{content}</MemoryRouter>
    </QueryClientProvider>
  )
  return client
}

it('locks need approval after No and derives the rejection reason from the failed question', async () => {
  const sent = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/:id/need-decision', async ({ request }) => {
      sent(await request.json())
      return HttpResponse.json({ success: true, data: null })
    })
  )
  mount(<ManagerNeedForm id={requestId} />)
  await answerChecklist('No')
  expect(screen.getByRole('radio', { name: 'Approve need' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  fireEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Confirm' }))
  await waitFor(() =>
    expect(sent).toHaveBeenCalledWith(
      expect.objectContaining({
        decision: 'REJECT',
        reason: expect.stringContaining('The need is justified'),
        checklist: expect.objectContaining({
          answers: [
            { itemCode: '1.2-01', answer: 'YES' },
            { itemCode: '1.2-02', answer: 'NO' }
          ]
        })
      })
    )
  )
})

it('blocks an open need confirmation when the policy version changes in cache', async () => {
  const sent = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/:id/need-decision', () => {
      sent()
      return HttpResponse.json({ success: true, data: null })
    })
  )
  const client = mount(<ManagerNeedForm id={requestId} />)
  await answerChecklist()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  const confirm = within(await screen.findByRole('dialog')).getByRole('button', { name: 'Confirm' })
  act(() =>
    client.setQueryData(
      getPolicyStepGetQueryKey('POL-MF1', '1.2'),
      (previous: { data: { policyVersionId: string } }) => ({
        ...previous,
        data: { ...previous.data, policyVersionId: 'new-version' }
      })
    )
  )
  await waitFor(() => expect(confirm).toBeDisabled())
  fireEvent.click(confirm)
  expect(sent).not.toHaveBeenCalled()
})

it('clears answers and confirmation after POLICY.VERSION_CHANGED even if reload returns the same id', async () => {
  const sent = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/:id/need-decision', () => {
      sent()
      return HttpResponse.json({ success: false, error: { code: 'POLICY.VERSION_CHANGED' } }, { status: 409 })
    })
  )
  mount(<ManagerNeedForm id={requestId} />)
  await answerChecklist()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  fireEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  await waitFor(() => expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled())
  expect(
    within(screen.getByRole('radiogroup', { name: 'The need is justified' })).getByRole('radio', { name: 'Yes' })
  ).not.toBeChecked()
  expect(sent).toHaveBeenCalledOnce()
})

it('blocks reserve use after No and sends the current 1.6 checklist after Yes', async () => {
  const sent = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/:id/reserve-confirmation', async ({ request }) => {
      sent(await request.json())
      return HttpResponse.json({ success: true, data: null })
    })
  )
  mount(<ManagerReserveConfirmation id={requestId} onClose={vi.fn()} />)
  await answerChecklist('No')
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Critical delivery' } })
  const confirm = screen.getByRole('button', { name: 'Confirm reserve use' })
  expect(confirm).toBeDisabled()
  await answerChecklist()
  fireEvent.click(confirm)
  await waitFor(() =>
    expect(sent).toHaveBeenCalledWith({ reason: 'Critical delivery', checklist: checklistBody('1.6') })
  )
})

it('does not submit a reserve batch with No and includes a single checklist for its confirmations', async () => {
  const sent = vi.fn()
  server.use(
    http.get('*/api/v1/spend-queue', () =>
      HttpResponse.json(pageResponse([{ ...queueItem, budgetOutcome: 'USES_RESERVE' }]))
    ),
    http.post('*/api/v1/spend-batches', async ({ request }) => {
      sent(await request.json())
      return HttpResponse.json({ success: true, data: null })
    })
  )
  mount(<ManagerLiveBatch onOpen={vi.fn()} />)
  fireEvent.click(await screen.findByRole('checkbox', { name: 'Test Software' }))
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await answerChecklist('No')
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Critical delivery' } })
  const confirm = within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' })
  expect(confirm).toBeDisabled()
  await answerChecklist()
  fireEvent.click(confirm)
  await waitFor(() =>
    expect(sent).toHaveBeenCalledWith({
      requestIds: [requestId],
      reserveConfirmations: [{ requestId, reason: 'Critical delivery' }],
      checklist: checklistBody('1.6')
    })
  )
})
