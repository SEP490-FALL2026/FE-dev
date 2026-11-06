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
let rejectRobin = false
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
          ok: !(rejectRobin && line.employeeId === planId),
          reason: rejectRobin && line.employeeId === planId ? 'NOT_ACTIVE' : null
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
  rejectRobin = false
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
it('submits the exact checked two-person body without retired fields', async () => {
  await mount()
  expect(screen.queryByLabelText('Shared access end date')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Expected spend date')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await confirm()
  const body = { planId, businessReason: 'Design work', termMonths: 3, lines: [{ employeeId }, { employeeId: planId }] }
  expect(checked).toHaveBeenCalledWith(body)
  expect(submitted).toHaveBeenCalledWith(body)
})
it('keeps an ineligible person blocked after the backend check', async () => {
  rejectRobin = true
  await mount()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  const dialog = screen.getByRole('dialog')
  await within(dialog).findByText('Robin')
  expect(within(dialog).getByRole('button', { name: 'Confirm' })).toBeDisabled()
  expect(submitted).not.toHaveBeenCalled()
})
it('rejects a term over twelve months and permits a valid shorter term', async () => {
  await mount()
  fireEvent.change(screen.getByLabelText('Term (months)'), { target: { value: '13' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Reason for confirming a term over 12 months')).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Term (months)'), { target: { value: '12' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await confirm()
  expect(submitted).toHaveBeenCalledWith({
    planId,
    businessReason: 'Design work',
    termMonths: 12,
    lines: [{ employeeId }, { employeeId: planId }]
  })
})
