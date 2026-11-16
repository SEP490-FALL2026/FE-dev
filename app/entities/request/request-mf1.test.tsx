import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { RequestRevision } from './components/request-revision'
import { RequestFlowSummary } from './components/request-flow-summary'
import { accessRequest, employeeId, requestId } from '../../../test/fixtures/employee-api'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

it('revises a returned request using only the changed date and reason, then allows resubmission', async () => {
  const supplement = vi.fn()
  const resubmit = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/:id/supplements', async ({ request }) => {
      supplement(await request.json())
      return HttpResponse.json({ success: true, data: null })
    }),
    http.post('*/api/v1/access-requests/:id/resubmission', async ({ request }) => {
      resubmit(await request.text())
      return HttpResponse.json({ success: true, data: null })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RequestRevision id={requestId} departmentId={employeeId} group={false} termMonths={6} />
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: 'Revise returned request' }))
  expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
  fireEvent.change(screen.getByLabelText(/^Term of use/), { target: { value: '3' } })
  fireEvent.change(screen.getByLabelText('Reason for the change'), { target: { value: 'Shorter project' } })
  const save = screen.getByRole('button', { name: 'Save changes' })
  fireEvent.click(save)
  fireEvent.click(save)
  await waitFor(() => expect(supplement).toHaveBeenCalledExactlyOnceWith({ termMonths: 3, reason: 'Shorter project' }))
  await screen.findByRole('button', { name: 'Revise returned request' })
  fireEvent.click(screen.getByRole('button', { name: 'Resubmit request' }))
  await waitFor(() => expect(resubmit).toHaveBeenCalledExactlyOnceWith(''))
})

it('blocks further writes after an ambiguous resubmission instead of automatically retrying', async () => {
  const submitted = vi.fn()
  server.use(
    http.post('*/api/v1/access-requests/:id/resubmission', () => {
      submitted()
      return HttpResponse.json({ success: false }, { status: 503 })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RequestRevision id={requestId} departmentId={employeeId} group={false} />
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: 'Resubmit request' }))
  expect(await screen.findByRole('status')).toHaveTextContent('The result is unknown')
  expect(screen.getByRole('button', { name: 'Resubmit request' })).toBeDisabled()
  expect(submitted).toHaveBeenCalledOnce()
})

it('shows blocking reasons without the routing or term rows and without exposing budget amounts', () => {
  render(
    <RequestFlowSummary
      request={{
        ...accessRequest,
        routing: { mode: 'ONE_STEP', oneStepReason: 'NO_DEPARTMENT_HEAD' },
        spend: {
          stage: 'RETURNED_TO_REQUESTER',
          blockedReasons: ['OVER_RESERVE'],
          overBy: { amount: '123456789', currency: 'USD' },
          refusalReason: null
        }
      }}
    />
  )
  expect(screen.queryByText('One step')).not.toBeInTheDocument()
  expect(screen.queryByText('Term of use (months)')).not.toBeInTheDocument()
  expect(screen.getByText('Exceeds the available reserve')).toBeInTheDocument()
  expect(screen.queryByText(/123456789/)).not.toBeInTheDocument()
})

it('explains a system cancellation with a null actor and the department-head wait', () => {
  render(
    <RequestFlowSummary
      request={{
        ...accessRequest,
        needStep: { ...accessRequest.needStep, assignee: null, waitingReason: 'NO_DEPARTMENT_HEAD' },
        limitExemption: 'TRANSFER_GRACE',
        cancellation: {
          cause: 'SYSTEM_BENEFICIARY_TRANSFERRED',
          cancelledBy: null,
          cancelledAt: '2026-11-14T10:00:00Z',
          note: null
        }
      }}
    />
  )
  expect(screen.getByText('System')).toBeInTheDocument()
  expect(
    screen.getByText('Cancelled automatically because the beneficiary transferred to another department.')
  ).toBeInTheDocument()
  expect(screen.getByText(/Waiting for a department head/)).toBeInTheDocument()
  expect(screen.getByText('Requesting again during your transfer grace period')).toBeInTheDocument()
})
