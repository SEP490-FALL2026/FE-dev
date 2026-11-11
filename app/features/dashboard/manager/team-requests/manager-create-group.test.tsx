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
let maxEndDate = '2027-10-31'
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
        maxEndDate,
        endDateOutOfRange: !!body.expectedEndDate && body.expectedEndDate > maxEndDate,
        tooFewLines: body.lines.length < 2 ? { min: 2 } : null,
        lines: body.lines.map((line) => ({
          employeeId: line.employeeId,
          ok: true,
          reason: null
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
  maxEndDate = '2027-10-31'
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
  fireEvent.change(screen.getByLabelText('Expected end date'), { target: { value: '2027-01-31' } })
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
it('checks and submits the same strict group body without removed fields', async () => {
  await mount()
  expect(screen.queryByLabelText('Expected spend date')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Access end date (if applicable)')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await confirm()
  const body = {
    planId,
    businessReason: 'Design work',
    expectedEndDate: '2027-01-31',
    lines: [{ employeeId }, { employeeId: planId }]
  }
  expect(checked).toHaveBeenCalledWith(body)
  expect(submitted).toHaveBeenCalledWith(body)
})
it('requires at least two people', async () => {
  await mount()
  fireEvent.change(screen.getByLabelText('Expected end date'), { target: { value: '2027-01-31' } })
  fireEvent.click(screen.getByRole('button', { name: 'Remove Robin' }))
  expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
})
it('blocks confirmation when the date exceeds the backend limit', async () => {
  maxEndDate = '2027-01-01'
  await mount()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  const dialog = await screen.findByRole('dialog')
  await within(dialog).findAllByText('Latest allowed date: 01/01/2027')
  expect(within(dialog).getByRole('button', { name: 'Confirm' })).toBeDisabled()
  expect(submitted).not.toHaveBeenCalled()
})

it('only asks affected people for a justification and preserves the rest of the form', async () => {
  server.use(
    http.post('*/api/v1/group-requests/check', async ({ request }) => {
      const body = (await request.json()) as GroupBodyDto
      return HttpResponse.json({
        success: true,
        data: {
          ...groupCheck,
          lines: body.lines.map((line) => ({
            employeeId: line.employeeId,
            ok: line.employeeId !== employeeId || !!line.manyPaidSoftwareReason,
            reason:
              line.employeeId === employeeId && !line.manyPaidSoftwareReason
                ? 'MANY_PAID_SOFTWARE_REASON_REQUIRED'
                : null
          }))
        }
      })
    })
  )
  await mount()
  expect(screen.queryByLabelText(/^Alex:/)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/^Robin:/)).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  const dialog = screen.getByRole('dialog')
  await within(dialog).findByText('Explain why this person needs multiple paid applications')
  expect(within(dialog).getByRole('button', { name: 'Confirm' })).toBeDisabled()
  fireEvent.click(within(dialog).getByRole('button', { name: 'Edit request' }))
  fireEvent.change(screen.getByLabelText(/^Alex:/), { target: { value: 'Separate customer workspace' } })
  expect(screen.queryByLabelText(/^Robin:/)).not.toBeInTheDocument()
  expect(screen.getByLabelText('Reason')).toHaveValue('Design work')
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await confirm()
  expect(submitted.mock.calls[0][0].lines).toEqual([
    { employeeId, manyPaidSoftwareReason: 'Separate customer workspace' },
    { employeeId: planId }
  ])
})

it('returns a submission refusal to the named people without losing the selection', async () => {
  server.use(
    http.post('*/api/v1/group-requests', () =>
      HttpResponse.json(
        {
          success: false,
          error: {
            code: 'GROUP_REQUEST.LINES_REFUSED',
            message: 'Private backend details',
            details: { lines: [{ employeeId: planId, reason: 'EMAIL_REQUIRED' }] }
          }
        },
        { status: 422 }
      )
    )
  )
  await mount()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  const dialog = screen.getByRole('dialog')
  await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Confirm' })).toBeEnabled())
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
  const problems = await screen.findByRole('list', { name: 'People who need attention' })
  expect(within(problems).getByText('Robin')).toBeInTheDocument()
  expect(within(problems).getByText('robin@example.test')).toBeInTheDocument()
  expect(within(problems).getByText('A work email is required')).toBeInTheDocument()
  expect(screen.queryByText('Private backend details')).not.toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByLabelText('Reason')).toHaveValue('Design work')
})
