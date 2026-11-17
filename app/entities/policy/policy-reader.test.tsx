import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { PolicyReader } from './components/policy-reader'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { PolicyAcknowledgementGate } from './components/policy-acknowledgement-gate'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
const acknowledge = vi.fn()
let version = 2
let done = false
const server = setupServer(
  http.get('*/api/v1/policies/POL-MF1', ({ request }) => {
    const viewed = Number(new URL(request.url).searchParams.get('version')) || version
    return HttpResponse.json({
      success: true,
      data: {
        id: 'policy',
        code: 'POL-MF1',
        title: 'Access policy',
        versionNumber: viewed,
        isCurrent: viewed === version,
        publishedAt: '2026-11-17T00:00:00Z',
        changeNote: 'Updated rules',
        applicableRoles: ['EMPLOYEE'],
        requiresReacknowledgement: true,
        publishedByAppUserId: null,
        myAcknowledgement: done ? 'DONE' : 'PENDING',
        content: {
          sections: [{ heading: 'Scope', body: 'Read these access rules.' }],
          steps: [
            {
              code: '1.2',
              title: 'Need review',
              checklist: [{ code: '1.2-01', text: 'Check the need.', check: 'PERSON' }]
            }
          ]
        }
      }
    })
  }),
  http.post('*/api/v1/policies/POL-MF1/acknowledgements', () => {
    acknowledge()
    done = true
    return HttpResponse.json({ success: true, data: { versionNumber: version } })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  server.resetHandlers()
  vi.clearAllMocks()
  version = 2
  done = false
  await setAppLanguage('en', false)
})
function mount(historical?: number) {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <PolicyReader code='POL-MF1' version={historical} />
    </QueryClientProvider>
  )
}
describe('policy reader', () => {
  it('shows sections and steps, requires explicit consent and records the current version', async () => {
    mount()
    expect(await screen.findByText('Read these access rules.')).toBeInTheDocument()
    expect(screen.getByText('Check the need.')).toBeInTheDocument()
    const button = screen.getByRole('button', { name: 'I have read and understood' })
    expect(button).toBeDisabled()
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(button)
    await waitFor(() => expect(acknowledge).toHaveBeenCalledOnce())
    expect(await screen.findByText('Acknowledged')).toBeInTheDocument()
  })
  it('keeps historical versions read only', async () => {
    mount(1)
    expect(await screen.findByText('Historical version · read only')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(acknowledge).not.toHaveBeenCalled()
  })
  it('reloads and clears consent when a newer version appeared before submission', async () => {
    mount()
    fireEvent.click(await screen.findByRole('checkbox'))
    version = 3
    fireEvent.click(screen.getByRole('button', { name: 'I have read and understood' }))
    await waitFor(() => expect(screen.getByText(/Version 3/)).toBeInTheDocument())
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(acknowledge).not.toHaveBeenCalled()
  })
  it('refreshes stale pending acknowledgements instead of trapping someone who already acknowledged', async () => {
    const workspaceLabel = 'Workspace content'
    done = true
    let reads = 0
    server.use(
      http.get('*/api/v1/me', () => {
        reads++
        return HttpResponse.json({
          success: true,
          data: { pendingPolicyAcknowledgements: reads === 1 ? [{ code: 'POL-MF1', versionNumber: 2 }] : [] }
        })
      })
    )
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <PolicyAcknowledgementGate>
          <p>{workspaceLabel}</p>
        </PolicyAcknowledgementGate>
      </QueryClientProvider>
    )
    await waitFor(() => expect(reads).toBeGreaterThanOrEqual(2))
    expect(screen.getByText(workspaceLabel)).toBeInTheDocument()
    expect(acknowledge).not.toHaveBeenCalled()
  })
})
