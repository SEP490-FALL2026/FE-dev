import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { File as NativeFile } from 'node:buffer'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, pageResponse, requestId } from '../../../../../test/fixtures/employee-api'
import { proposal } from '../../../../../test/fixtures/manager-api'
import { ManagerBudgetForm } from './views/manager-budget-form'
import { ManagerBudgetFiles } from './components/manager-budget-files'
import { managerReadHandlers } from '../../../../../test/fixtures/manager-integration'

const fileId = '99999999-9999-4999-8999-999999999999'
const uploaded = {
  id: fileId,
  target: 'PROPOSAL',
  status: 'UPLOADED',
  fileName: 'quote.pdf',
  contentType: 'application/pdf',
  sizeBytes: 5,
  versionId: null,
  createdAt: new Date().toISOString(),
  expiresAt: '2099-01-01T00:00:00Z'
}
const line = {
  lineType: 'RENEW',
  priorityRank: 1,
  zbb: null,
  overCeiling: null,
  position: 1,
  description: 'Software',
  amount: { amount: '1250.50' },
  planId: null,
  seats: null,
  repeatCycle: 'ANNUAL',
  quoteValidUntil: null,
  note: null
}
let files: (typeof uploaded)[] = []
const server = setupServer(
  http.get('*/api/v1/budget-attachments/mine', () => HttpResponse.json(pageResponse(files))),
  http.get('*/api/v1/budget-proposals/:id/attachments', () => HttpResponse.json(pageResponse([]))),
  ...managerReadHandlers
)
beforeAll(() => {
  configure({ asyncUtilTimeout: 5000 })
  server.listen({ onUnhandledRequest: 'error' })
})
afterAll(() => {
  configure({ asyncUtilTimeout: 1000 })
  server.close()
})
beforeEach(async () => {
  files = []
  await setAppLanguage('en', false)
})
afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
})
function mount(children = <ManagerBudgetForm costCenterId={employeeId} costCenterName='Engineering' />) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}
function fill() {
  for (const [label, value] of Object.entries({
    'Fiscal year': '2027',
    Description: 'Software',
    Amount: '1250.50'
  }))
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
}
function uploadHandlers(status = 200) {
  const declare = vi.fn()
  const complete = vi.fn()
  const storage = vi.fn()
  server.use(
    http.post('*/api/v1/budget-proposals/attachments', async ({ request }) => {
      declare(await request.json())
      files = [{ ...uploaded, status: 'AWAITING_UPLOAD' }]
      return HttpResponse.json(
        {
          success: true,
          data: {
            attachment: files[0],
            upload: {
              url: 'https://storage.example.test/quote',
              method: 'PUT',
              headers: { 'Content-Type': 'application/pdf', 'Content-Length': '5' },
              expiresAt: '2099-01-01T00:00:00Z'
            }
          }
        },
        { status: 201 }
      )
    }),
    http.put('https://storage.example.test/quote', async ({ request }) => {
      storage({
        auth: request.headers.get('authorization'),
        type: request.headers.get('content-type'),
        bytes: await request.text()
      })
      return new HttpResponse(null, { status })
    }),
    http.post('*/api/v1/budget-attachments/:id/complete', () => {
      complete()
      files = [uploaded]
      return HttpResponse.json({ success: true, data: { attachment: uploaded } })
    })
  )
  return { declare, complete, storage }
}
it('uploads raw bytes, completes the upload, and submits only its ID with decimal money intact', async () => {
  const handlers = uploadHandlers()
  const submitted = vi.fn()
  server.use(
    http.post('*/api/v1/budget-proposals', async ({ request }) => {
      submitted(await request.json())
      return HttpResponse.json({ success: true, data: { proposal } }, { status: 201 })
    })
  )
  const fetchSpy = vi.spyOn(globalThis, 'fetch')
  mount()
  expect(screen.getByLabelText('Department cost center')).toHaveValue('Engineering')
  expect(screen.getByLabelText('Department cost center')).toHaveAttribute('readonly')
  expect(screen.queryByLabelText('Plan ID')).not.toBeInTheDocument()
  fill()
  await screen.findByText('No supporting documents yet')
  fireEvent.change(screen.getByLabelText('Choose a supporting document'), {
    target: { files: [new NativeFile(['quote'], 'quote.pdf', { type: 'application/pdf' })] }
  })
  await waitFor(() => expect(screen.getByRole('checkbox', { name: /quote.pdf/ })).toBeChecked())
  expect(handlers.declare).toHaveBeenCalledWith({ fileName: 'quote.pdf', contentType: 'application/pdf', sizeBytes: 5 })
  expect(handlers.storage).toHaveBeenCalledWith({ auth: null, type: 'application/pdf', bytes: 'quote' })
  expect(fetchSpy).toHaveBeenCalledWith(
    'https://storage.example.test/quote',
    expect.objectContaining({ method: 'PUT', credentials: 'omit', headers: { 'Content-Type': 'application/pdf' } })
  )
  expect(handlers.complete).toHaveBeenCalledOnce()
  await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await waitFor(() =>
    expect(submitted).toHaveBeenCalledWith({
      year: 2027,
      costCenterId: employeeId,
      lines: [
        {
          description: 'Software',
          lineType: 'RENEW',
          priorityRank: 1,
          amount: { amount: '1250.50' }
        }
      ],
      attachmentIds: [fileId]
    })
  )
})
it('requires explicit selection of recovered uploads and omits unselected attachments', async () => {
  files = [uploaded]
  const submitted = vi.fn()
  server.use(
    http.post('*/api/v1/budget-proposals', async ({ request }) => {
      submitted(await request.json())
      return HttpResponse.json({ success: true, data: { proposal } })
    })
  )
  mount()
  fill()
  expect(await screen.findByRole('checkbox', { name: /quote.pdf/ })).not.toBeChecked()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await waitFor(() => expect(submitted).toHaveBeenCalledOnce())
  expect(submitted.mock.calls[0][0]).not.toHaveProperty('attachmentIds')
})
it('does not complete or select a file when storage rejects the PUT', async () => {
  const handlers = uploadHandlers(403)
  mount()
  await screen.findByText('No supporting documents yet')
  fireEvent.change(screen.getByLabelText('Choose a supporting document'), {
    target: { files: [new File(['quote'], 'quote.pdf')] }
  })
  const checkbox = await screen.findByRole('checkbox', { name: /quote.pdf/ })
  expect(checkbox).toBeDisabled()
  expect(checkbox).not.toBeChecked()
  expect(handlers.complete).not.toHaveBeenCalled()
})
it('removes a selected unattached file only after discard succeeds', async () => {
  files = [uploaded]
  const discarded = vi.fn()
  server.use(
    http.post('*/api/v1/budget-attachments/:id/discard', ({ params }) => {
      discarded(params.id)
      files = []
      return HttpResponse.json({ success: true, data: { attachment: { ...uploaded, status: 'DISCARDED' } } })
    })
  )
  mount()
  fireEvent.click(await screen.findByRole('checkbox', { name: /quote.pdf/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Delete unattached file: quote.pdf' }))
  await waitFor(() => expect(discarded).toHaveBeenCalledWith(fileId))
  await waitFor(() => expect(screen.queryByRole('checkbox', { name: /quote.pdf/ })).not.toBeInTheDocument())
})
it('includes new uploads in resubmission without reusing attachments of the previous proposal', async () => {
  files = [uploaded]
  const submitted = vi.fn()
  server.use(
    http.get('*/api/v1/budget-proposals/:id', () =>
      HttpResponse.json({ success: true, data: { proposal: { ...proposal, state: 'RETURNED' } } })
    ),
    http.get('*/api/v1/budget-proposals/:id/lines', () => HttpResponse.json(pageResponse([line]))),
    http.post('*/api/v1/budget-proposals/:id/resubmission', async ({ request }) => {
      submitted(await request.json())
      return HttpResponse.json({ success: true, data: { proposal } })
    })
  )
  mount(<ManagerBudgetForm id={requestId} />)
  fireEvent.click(await screen.findByRole('checkbox', { name: /quote.pdf/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Submit revised proposal' }))
  await waitFor(() => expect(submitted).toHaveBeenCalledOnce())
  expect(submitted.mock.calls[0][0]).toMatchObject({ attachmentIds: [fileId] })
  expect(submitted.mock.calls[0][0]).not.toHaveProperty('costCenterId')
})
it('obtains a fresh download link for each click', async () => {
  const linked = vi.fn()
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
  server.use(
    http.get('*/api/v1/budget-proposals/:id/attachments', () => HttpResponse.json(pageResponse([uploaded]))),
    http.post('*/api/v1/budget-attachments/:id/links', () => {
      linked()
      return HttpResponse.json({
        success: true,
        data: { url: 'https://storage.example.test/download', expiresAt: '2099-01-01T00:00:00Z' }
      })
    })
  )
  mount(<ManagerBudgetFiles id={requestId} />)
  fireEvent.click(await screen.findByRole('button', { name: 'Download: quote.pdf' }))
  await waitFor(() => expect(click).toHaveBeenCalledTimes(1))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Download: quote.pdf' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Download: quote.pdf' }))
  await waitFor(() => expect(linked).toHaveBeenCalledTimes(2))
})
it('blocks proposals without a department cost center', async () => {
  mount(<ManagerBudgetForm />)
  expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
})
