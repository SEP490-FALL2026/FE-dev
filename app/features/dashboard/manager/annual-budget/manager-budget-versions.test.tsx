import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { pageResponse } from '../../../../../test/fixtures/employee-api'
import { ManagerBudgetVersions } from './components/manager-budget-versions'
import { ManagerVersionFiles } from './components/manager-version-files'

const versionId = '88888888-8888-4888-8888-888888888888'
const fileId = '77777777-7777-4777-8777-777777777777'

const sampleVersion = {
  id: versionId,
  year: 2026,
  number: 1,
  state: 'SENT',
  sentAt: '2026-11-01T10:00:00Z'
}

const sampleFile = {
  id: fileId,
  fileName: 'budget-summary-v1.pdf',
  contentType: 'application/pdf',
  sizeBytes: 1048576,
  status: 'ATTACHED',
  uploadedBy: { id: 'user-1', fullName: 'Lê Minh Cường' },
  attachedAt: '2026-11-01T10:00:00Z',
  removedAt: null
}

const server = setupServer(
  http.get('*/api/v1/budgets/mine/versions', () => HttpResponse.json(pageResponse([sampleVersion]))),
  http.get('*/api/v1/budget-versions/:id/attachments', () => HttpResponse.json(pageResponse([sampleFile]))),
  http.post('*/api/v1/budget-attachments/:id/links', () =>
    HttpResponse.json({
      success: true,
      data: { url: 'https://storage.example.test/download-v1.pdf', expiresAt: '2099-01-01T00:00:00Z' }
    })
  )
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
  await setAppLanguage('en', false)
})
afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
})

function mount(ui: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('Manager Budget Versions & Attachments', () => {
  it('renders sent versions with version number, state, and sent date', async () => {
    mount(<ManagerBudgetVersions year={2026} />)

    expect(await screen.findByText('Version #1')).toBeInTheDocument()
    expect(screen.getByText('2026')).toBeInTheDocument()
    expect(screen.getByText('Sent')).toBeInTheDocument()
  })

  it('renders empty state when no versions exist', async () => {
    server.use(
      http.get('*/api/v1/budgets/mine/versions', () => HttpResponse.json(pageResponse([])))
    )

    mount(<ManagerBudgetVersions year={2026} />)

    expect(await screen.findByText('No sent budget versions')).toBeInTheDocument()
  })

  it('calls onOpenVersion callback when clicking on a version row', async () => {
    const onOpen = vi.fn()
    mount(<ManagerBudgetVersions year={2026} onOpenVersion={onOpen} />)

    const rowButton = await screen.findByRole('button', { name: /Open/i })
    fireEvent.click(rowButton)

    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ id: versionId, number: 1 }))
  })

  it('renders version attachments and requests download link on click', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    mount(<ManagerVersionFiles versionId={versionId} />)

    expect(await screen.findByText('budget-summary-v1.pdf')).toBeInTheDocument()
    expect(screen.getByText('1 MB')).toBeInTheDocument()

    const downloadBtn = screen.getByRole('button', { name: 'Download: budget-summary-v1.pdf' })
    fireEvent.click(downloadBtn)

    await waitFor(() => expect(clickSpy).toHaveBeenCalledTimes(1))
  })
})
