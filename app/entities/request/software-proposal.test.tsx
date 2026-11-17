import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { SoftwareProposalForm } from './components/software-proposal-form'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { existingSoftwareFromError } from './software-proposal'
import { AxiosError } from 'axios'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
const appId = '11111111-1111-4111-8111-111111111111'
const planId = '22222222-2222-4222-8222-222222222222'
const post = vi.fn()
const server = setupServer(
  http.get('*/api/v1/requestable-applications', () =>
    HttpResponse.json({
      success: true,
      data: { items: [{ id: appId, name: 'Design Tool' }], pagination: { page: 1, totalPages: 1 } }
    })
  ),
  http.post('*/api/v1/access-requests/proposals', async ({ request }) => {
    post(await request.json())
    return HttpResponse.json({ success: true, data: { request: { id: appId } } })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  server.resetHandlers()
  vi.clearAllMocks()
  await setAppLanguage('en', false)
})
function mount() {
  const onCreated = vi.fn(),
    onUsePlan = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <SoftwareProposalForm onCreated={onCreated} onUsePlan={onUsePlan} />
    </QueryClientProvider>
  )
  return { onCreated, onUsePlan }
}
function completeForm() {
  fireEvent.change(screen.getByLabelText('Homepage'), { target: { value: 'https://design.example.test' } })
  fireEvent.change(screen.getByLabelText('Purpose'), { target: { value: 'Team design work' } })
  fireEvent.change(screen.getByLabelText('Data to be processed'), { target: { value: 'Project mockups' } })
  const months = document.querySelector('[name="termMonths"]')!
  fireEvent.change(months, { target: { value: '3' } })
}
describe('short software proposal', () => {
  it('sends the selected existing application and plan name with the documented proposal fields', async () => {
    const { onCreated } = mount()
    fireEvent.click(screen.getByLabelText('The application already exists; I need another plan'))
    await screen.findByRole('option', { name: 'Design Tool' })
    fireEvent.change(screen.getByLabelText('Existing application'), { target: { value: appId } })
    fireEvent.change(screen.getByLabelText('Name of the plan to add'), { target: { value: ' Enterprise ' } })
    completeForm()
    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))
    await waitFor(() =>
      expect(post).toHaveBeenCalledWith({
        softwareName: 'Design Tool',
        homepageUrl: 'https://design.example.test',
        purpose: 'Team design work',
        dataDescription: 'Project mockups',
        expectedUsers: 1,
        termMonths: 3,
        existingApplicationId: appId,
        plannedPlanName: 'Enterprise'
      })
    )
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(appId))
  })
  it('offers the actual existing plan after a catalog conflict without losing entered text', async () => {
    server.use(
      http.post('*/api/v1/access-requests/proposals', () =>
        HttpResponse.json(
          {
            error: {
              code: 'ACCESS_REQUEST.SOFTWARE_IN_CATALOG',
              details: {
                matchedBy: 'NAME',
                existing: {
                  applicationId: appId,
                  name: 'Design Tool',
                  plans: [{ planId, name: 'Enterprise', provisioningType: 'K2' }],
                  planTotal: 1
                }
              }
            }
          },
          { status: 409 }
        )
      )
    )
    const { onUsePlan } = mount()
    fireEvent.change(screen.getByLabelText('Software name'), { target: { value: 'Design Tool' } })
    completeForm()
    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Enterprise' }))
    expect(onUsePlan).toHaveBeenCalledWith(planId)
    expect(screen.getByLabelText('Purpose')).toHaveValue('Team design work')
  })
  it('ignores unrelated errors', () => {
    expect(existingSoftwareFromError(new AxiosError('unavailable'))).toBeUndefined()
  })
})
