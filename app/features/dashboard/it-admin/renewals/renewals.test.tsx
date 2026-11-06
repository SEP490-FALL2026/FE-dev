import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { RenewalProposalDialog } from './components/renewal-proposal-dialog'
import { RenewalOutcomeDialog } from './components/renewal-outcome-dialog'
import type { SubscriptionRenewalResponseDtoDataRenewal } from '~/shared/api/generated/model/subscription-renewals'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
function mount(child: React.ReactNode) {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      {child}
    </QueryClientProvider>
  )
}

it('submits only a REDUCE quantity and preserves the draft when the server rejects it', async () => {
  await setAppLanguage('en', false)
  let body: unknown
  const close = vi.fn()
  server.use(
    http.get('*/api/v1/subscriptions/sub-1/seat-usage', () => HttpResponse.json({ data: { occupied: 2 } })),
    http.post('*/api/v1/subscription-renewals', async ({ request }) => {
      body = await request.json()
      return HttpResponse.json({ error: { code: 'SUBSCRIPTION_RENEWAL.ALREADY_PROPOSED' } }, { status: 409 })
    })
  )
  mount(
    <RenewalProposalDialog
      subscription={{ id: 'sub-1', applicationName: 'Workspace', planName: 'Team', purchasedQuantity: 10 }}
      onClose={close}
    />
  )
  fireEvent.click(screen.getByRole('radio', { name: 'Reduce seats' }))
  fireEvent.change(screen.getByLabelText('Seats after reduction'), { target: { value: '6' } })
  fireEvent.change(screen.getByLabelText('Proposal note'), { target: { value: 'Keep six confirmed seats' } })
  await waitFor(() => expect(screen.getByRole('button', { name: 'Submit proposal' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Submit proposal' }))
  await waitFor(() =>
    expect(body).toEqual({
      subscriptionId: 'sub-1',
      choice: 'REDUCE',
      proposedQuantity: 6,
      note: 'Keep six confirmed seats'
    })
  )
  await waitFor(() => expect(screen.getByRole('button', { name: 'Submit proposal' })).toBeEnabled())
  expect(screen.getByLabelText('Proposal note')).toHaveValue('Keep six confirmed seats')
  expect(close).not.toHaveBeenCalled()
  expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument()
})

it('blocks repeated outcome writes and records cancellation without a fabricated next period', async () => {
  await setAppLanguage('en', false)
  let writes = 0
  let body: unknown
  let release: () => void = () => undefined
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  server.use(
    http.post('*/api/v1/subscription-renewals/renewal-1/outcome', async ({ request }) => {
      writes++
      body = await request.json()
      await gate
      return HttpResponse.json({ success: true, data: null })
    })
  )
  const renewal = {
    id: 'renewal-1',
    state: 'DECIDED',
    decidedChoice: 'CANCEL',
    period: { seatsInUse: 0 }
  } as SubscriptionRenewalResponseDtoDataRenewal
  const close = vi.fn()
  mount(<RenewalOutcomeDialog renewal={renewal} onClose={close} />)
  const submit = screen.getByRole('button', { name: 'Record outcome' })
  fireEvent.click(submit)
  fireEvent.click(submit)
  await waitFor(() => expect(writes).toBe(1))
  expect(body).toEqual({ outcome: 'AS_DECIDED' })
  expect(submit).toBeDisabled()
  release()
  await waitFor(() => expect(close).toHaveBeenCalledTimes(1))
})

it.each(['Vendor refused', 'Different result'])('requires an outcome note for %s', async (outcome) => {
  await setAppLanguage('en', false)
  const renewal = {
    id: 'renewal-1',
    state: 'DECIDED',
    decidedChoice: 'CANCEL',
    period: { seatsInUse: 0 }
  } as SubscriptionRenewalResponseDtoDataRenewal
  mount(<RenewalOutcomeDialog renewal={renewal} onClose={vi.fn()} />)
  fireEvent.click(screen.getByRole('combobox', { name: 'Vendor outcome' }))
  fireEvent.click(screen.getByRole('option', { name: outcome }))
  expect(screen.getByRole('button', { name: 'Record outcome' })).toBeDisabled()
  fireEvent.change(screen.getByLabelText('Outcome evidence'), {
    target: { value: 'Vendor confirmed a different result' }
  })
  expect(screen.getByRole('button', { name: 'Record outcome' })).toBeEnabled()
})

it('requires exactly the excess held assignments when reducing below occupied seats', async () => {
  await setAppLanguage('en', false)
  let body: unknown
  server.use(
    http.get('*/api/v1/subscriptions/sub-1/seat-usage', () => HttpResponse.json({ data: { occupied: 2 } })),
    http.get('*/api/v1/license-assignments', ({ request }) => {
      expect(new URL(request.url).searchParams.get('subscriptionId')).toBe('sub-1')
      return HttpResponse.json({
        data: {
          items: [
            {
              id: 'seat-1',
              accountIdentifier: 'one@example.org',
              employee: { fullName: 'Employee One' },
              validUntil: null,
              failedAt: null,
              cancelledAt: null
            },
            {
              id: 'seat-2',
              accountIdentifier: 'two@example.org',
              employee: { fullName: 'Employee Two' },
              validUntil: null,
              failedAt: null,
              cancelledAt: null
            }
          ],
          pagination: { totalItems: 2 }
        }
      })
    }),
    http.post('*/api/v1/subscription-renewals', async ({ request }) => {
      body = await request.json()
      return HttpResponse.json({ data: null })
    })
  )
  mount(
    <RenewalProposalDialog
      subscription={{ id: 'sub-1', applicationName: 'Workspace', planName: 'Team', purchasedQuantity: 10 }}
      onClose={vi.fn()}
    />
  )
  fireEvent.click(screen.getByRole('radio', { name: 'Reduce seats' }))
  fireEvent.change(screen.getByLabelText('Seats after reduction'), { target: { value: '1' } })
  expect(await screen.findByLabelText(/Employee One/)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Submit proposal' })).toBeDisabled()
  fireEvent.click(screen.getByLabelText(/Employee One/))
  fireEvent.click(screen.getByRole('button', { name: 'Submit proposal' }))
  await waitFor(() =>
    expect(body).toEqual({
      subscriptionId: 'sub-1',
      choice: 'REDUCE',
      proposedQuantity: 1,
      releasedAssignmentIds: ['seat-1']
    })
  )
})
