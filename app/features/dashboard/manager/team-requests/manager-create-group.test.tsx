import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import type { GroupBodyDto } from '~/shared/api/generated/model/group-requests/groupBodyDto'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, groupCheck, pageResponse, planId } from '../../../../../test/fixtures/employee-api'
import { managerRequest } from '../../../../../test/fixtures/manager-api'
import { chooseCatalogPlan } from '../../../../../test/fixtures/employee-catalog'
import { managerCatalogHandlers, managerReadHandlers } from '../../../../../test/fixtures/manager-integration'
import { ManagerLiveCreate } from './views/manager-live-create'

const checked = vi.fn()
const submitted = vi.fn()
let requireRobinDate = false
const server = setupServer(
  ...managerCatalogHandlers,
  ...managerReadHandlers,
  http.get('*/api/v1/group-request-candidates', () =>
    HttpResponse.json(
      pageResponse([
        { employeeId, fullName: 'Alex', workEmail: 'alex@example.test' },
        { employeeId: planId, fullName: 'Robin', workEmail: 'robin@example.test' }
      ])
    )
  ),
  http.post('*/api/v1/group-requests/check', async ({ request }) => {
    const body = (await request.json()) as GroupBodyDto
    checked(body)
    return HttpResponse.json({
      success: true,
      data: {
        ...groupCheck,
        lines: body.lines.map((line) => ({
          employeeId: line.employeeId,
          ok: !(requireRobinDate && line.employeeId === planId && !line.expectedEndDate),
          reason: requireRobinDate && line.employeeId === planId && !line.expectedEndDate ? 'END_DATE_REQUIRED' : null
        }))
      }
    })
  }),
  http.post('*/api/v1/group-requests', async ({ request }) => {
    submitted(await request.json())
    return HttpResponse.json({ success: true, data: { request: managerRequest } })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  requireRobinDate = false
  checked.mockClear()
  submitted.mockClear()
  await setAppLanguage('en', false)
})
async function mount() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <ManagerLiveCreate onOpen={vi.fn()} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  await chooseCatalogPlan()
  await screen.findByText('Sharing not allowed')
  fireEvent.change(screen.getByLabelText('Term (months)'), { target: { value: '3' } })
  fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
  fireEvent.click(await screen.findByRole('option', { name: /alex@example.test/ }))
  fireEvent.click(screen.getByRole('option', { name: /robin@example.test/ }))
  fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' })
  fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Design work' } })
}
async function confirm() {
  const button = within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' })
  await waitFor(() => expect(button).toBeEnabled())
  fireEvent.click(button)
  await waitFor(() => expect(submitted).toHaveBeenCalledOnce())
}
it('applies a shared date then allows per-person overrides and sends the exact checked body', async () => {
  await mount()
  expect(screen.queryByLabelText('Reason for confirming a term over 12 months')).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Shared access end date'), { target: { value: '2027-01-31' } })
  fireEvent.click(screen.getByRole('button', { name: 'Apply to everyone' }))
  expect(screen.getByLabelText('Access end date for Alex')).toHaveValue('2027-01-31')
  fireEvent.change(screen.getByLabelText('Access end date for Robin'), { target: { value: '2027-02-28' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await confirm()
  const body = {
    planId,
    businessReason: 'Design work',
    termMonths: 3,
    lines: [
      { employeeId, expectedEndDate: '2027-01-31' },
      { employeeId: planId, expectedEndDate: '2027-02-28' }
    ]
  }
  expect(checked).toHaveBeenCalledWith(body)
  expect(submitted).toHaveBeenCalledWith(body)
})
it('marks only the person identified by the backend, preserves the form and checks corrected dates again', async () => {
  requireRobinDate = true
  await mount()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  const dialog = screen.getByRole('dialog')
  fireEvent.click(await within(dialog).findByRole('button', { name: 'Edit end dates' }))
  expect(screen.getByLabelText('Access end date for Robin')).toHaveAttribute('aria-invalid', 'true')
  expect(screen.getByLabelText('Access end date for Robin')).toBeRequired()
  expect(screen.getByLabelText('Access end date for Alex')).not.toHaveAttribute('aria-invalid')
  expect(screen.getByLabelText('Reason')).toHaveValue('Design work')
  expect(submitted).not.toHaveBeenCalled()
  fireEvent.change(screen.getByLabelText('Access end date for Robin'), { target: { value: '2027-02-28' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await confirm()
  expect(checked).toHaveBeenCalledTimes(2)
  expect(submitted).toHaveBeenCalledWith(
    expect.objectContaining({ lines: [{ employeeId }, { employeeId: planId, expectedEndDate: '2027-02-28' }] })
  )
})
it('requires confirmation over twelve months and drops it when the user shortens the term', async () => {
  await mount()
  fireEvent.change(screen.getByLabelText('Term (months)'), { target: { value: '13' } })
  expect(screen.getByLabelText('Reason for confirming a term over 12 months')).toBeRequired()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Reason for confirming a term over 12 months'), {
    target: { value: 'Long project' }
  })
  fireEvent.change(screen.getByLabelText('Term (months)'), { target: { value: '12' } })
  expect(screen.queryByLabelText('Reason for confirming a term over 12 months')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await confirm()
  expect(submitted).toHaveBeenCalledWith({
    planId,
    businessReason: 'Design work',
    termMonths: 12,
    lines: [{ employeeId }, { employeeId: planId }]
  })
})
it('sends the required long-term reason after an explicit backend check', async () => {
  await mount()
  fireEvent.change(screen.getByLabelText('Term (months)'), { target: { value: '13' } })
  fireEvent.change(screen.getByLabelText('Reason for confirming a term over 12 months'), {
    target: { value: '  Long project  ' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await confirm()
  expect(submitted.mock.calls[0]?.[0]).toMatchObject({ termMonths: 13, termConfirmation: { reason: 'Long project' } })
})
