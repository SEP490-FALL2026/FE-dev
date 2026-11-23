import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AssessmentResponseDtoDataAssessment } from '~/shared/api/generated/model/access-requests/assessmentResponseDtoDataAssessment'
import type { ApplicationPageResponseDtoDataPagination } from '~/shared/api/generated/model/applications/applicationPageResponseDtoDataPagination'
import { CatalogLinkSection } from './catalog-link-section'

const mocks = vi.hoisted(() => ({
  link: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  applications: vi.fn(),
  plans: vi.fn(),
  detail: vi.fn(),
  refreshPlan: vi.fn()
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { plan?: string }) => (options?.plan ? `${key} ${options.plan}` : key)
  })
}))
const ready = { isPending: false, isFetching: false, isError: false, error: null, refetch: vi.fn() }
vi.mock('~/shared/api/generated/operations/access-requests/access-request-get', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useAccessRequestGet: () => ({
    ...ready,
    data: {
      data: {
        request: {
          branch: 'NEW_SOFTWARE',
          state: 'AWAITING_EXECUTION',
          plan: null
        }
      }
    }
  })
}))
vi.mock('~/shared/api/generated/operations/applications/application-list', () => ({
  useApplicationList: mocks.applications
}))
vi.mock('~/shared/api/generated/operations/plans/plan-list', () => ({ usePlanList: mocks.plans }))
vi.mock('~/shared/api/generated/operations/plans/plan-get', () => ({ usePlanGet: mocks.detail }))
vi.mock('~/shared/api/generated/operations/access-requests/access-request-catalog-link', () => ({
  useAccessRequestCatalogLink: () => ({ mutateAsync: mocks.link, isPending: false })
}))
vi.mock('../../shared/hooks/use-it-mutation-feedback', () => ({
  useItMutationFeedback: () => ({ onSuccess: mocks.success, onError: mocks.error })
}))
const assessment: AssessmentResponseDtoDataAssessment = {
  requestId: 'request-1',
  status: 'COMPLETED',
  classification: 'PAID_LICENSED',
  equivalentTool: null,
  proposal: {
    softwareName: 'Actual application',
    homepageUrl: 'https://example.com',
    purpose: 'Work',
    dataDescription: 'Work data',
    expectedUsers: 1
  },
  vendor: { vendorId: null, name: null },
  step: null,
  plannedPlanName: null,
  provisioningType: null,
  adminConsole: null,
  memberExport: null,
  sso: null,
  termsSummary: null,
  memberUsageMethod: null,
  grantRevokeMethod: null,
  dataSensitivity: null,
  opinion: null,
  controlLevel: null,
  controlRiskNote: null,
  quote: null,
  complete: true,
  costEstimate: null,
  completedBy: null,
  completedAt: null,
  rejection: null,
  pricing: {
    status: 'MISSING',
    missingReason: 'AWAITING_QUOTE',
    amount: null,
    unitPrice: null,
    billingCycle: null,
    kind: null,
    months: null,
    monthlyPrice: null,
    nextYearAmount: null
  }
}
const actualPlan = {
  id: 'actual-plan',
  applicationId: 'actual-app',
  applicationName: 'Actual application',
  name: 'Fresh actual plan'
}
function page(items: unknown[], totalItems = 21) {
  const pagination: ApplicationPageResponseDtoDataPagination = {
    totalItems,
    totalPages: Math.ceil(totalItems / 20),
    page: 1,
    pageSize: 20
  }
  return { ...ready, data: { data: { items, pagination } } }
}
function setup(item = assessment, authorized = true) {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <CatalogLinkSection item={item} authorized={authorized} />
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: 'catalogLink.action' }))
}
function choose(label: string, option: string) {
  fireEvent.click(screen.getByRole('combobox', { name: label }))
  fireEvent.click(screen.getByRole('option', { name: option }))
}
function chooseActualPlan() {
  choose('catalogLink.application', 'Actual application')
  choose('catalogLink.plan', 'Actual plan')
}
describe('catalog plan linking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.link.mockResolvedValue(undefined)
    mocks.applications.mockImplementation(() =>
      page([
        { id: 'actual-app', name: 'Actual application' },
        { id: 'other-app', name: 'Other application' }
      ])
    )
    mocks.plans.mockImplementation(() => page([{ id: 'actual-plan', name: 'Actual plan' }]))
    mocks.detail.mockImplementation((id: string) => ({
      ...ready,
      data: id ? { data: actualPlan } : undefined,
      refetch: mocks.refreshPlan
    }))
    mocks.refreshPlan.mockResolvedValue({ data: { data: actualPlan } })
  })
  it('lets an eligible request without an equivalent suggestion choose its registered fulfillment plan', () => {
    setup()
    expect(screen.getByRole('combobox', { name: 'catalogLink.application' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'confirm' })).toBeDisabled()
    chooseActualPlan()
    expect(screen.getByRole('button', { name: 'confirm' })).toBeEnabled()
  })
  it('submits the selected actual plan instead of the equivalent-tool suggestion, after reading it again', async () => {
    setup({
      ...assessment,
      equivalentTool: { planId: 'suggested-plan', planName: 'Suggested plan', applicationName: 'Suggested application' }
    })
    chooseActualPlan()
    fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    await waitFor(() => expect(mocks.link).toHaveBeenCalledWith({ id: 'request-1', data: { planId: 'actual-plan' } }))
    expect(mocks.refreshPlan).toHaveBeenCalledWith({ throwOnError: true })
    expect(mocks.refreshPlan.mock.invocationCallOrder[0]).toBeLessThan(mocks.link.mock.invocationCallOrder[0])
    await waitFor(() => expect(mocks.success).toHaveBeenCalled())
  })
  it('preserves selection when paging applications and plans and sends BE pagination parameters', () => {
    setup()
    chooseActualPlan()
    const pages = screen.getAllByRole('navigation', { name: 'pagination' })
    fireEvent.click(within(pages[0]).getByRole('button', { name: 'next' }))
    fireEvent.click(within(pages[1]).getByRole('button', { name: 'next' }))
    expect(mocks.applications).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2, pageSize: 20 }))
    expect(mocks.plans).toHaveBeenLastCalledWith(
      expect.objectContaining({ applicationId: 'actual-app', page: 2, pageSize: 20 }),
      expect.anything()
    )
    expect(screen.getByRole('button', { name: 'confirm' })).toBeEnabled()
    expect(screen.getByRole('combobox', { name: 'catalogLink.plan' })).toHaveTextContent('Actual plan')
  })
  it('clears the plan when its application changes', () => {
    setup()
    chooseActualPlan()
    choose('catalogLink.application', 'Other application')
    expect(screen.getByRole('button', { name: 'confirm' })).toBeDisabled()
    expect(screen.getByRole('combobox', { name: 'catalogLink.plan' })).not.toHaveTextContent('Actual plan')
  })
  it.each(['applications', 'plans'] as const)('keeps the selected %s visible while the next page loads', (source) => {
    const items =
      source === 'applications'
        ? [{ id: 'actual-app', name: 'Actual application' }]
        : [{ id: 'actual-plan', name: 'Actual plan' }]
    mocks[source].mockImplementation((params: { page: number }) =>
      params.page === 2 ? { ...ready, isPending: true, isFetching: true, data: undefined } : page(items)
    )
    setup()
    chooseActualPlan()
    const index = source === 'applications' ? 0 : 1
    fireEvent.click(
      within(screen.getAllByRole('navigation', { name: 'pagination' })[index]).getByRole('button', { name: 'next' })
    )
    expect(
      screen.getByRole('combobox', { name: source === 'applications' ? 'catalogLink.application' : 'catalogLink.plan' })
    ).toHaveTextContent(source === 'applications' ? 'Actual application' : 'Actual plan')
    expect(
      screen.getByRole('combobox', { name: source === 'applications' ? 'catalogLink.application' : 'catalogLink.plan' })
    ).toBeDisabled()
  })
  it('blocks confirmation while the selected plan is loading', () => {
    mocks.detail.mockReturnValue({ ...ready, isFetching: true, data: { data: actualPlan }, refetch: mocks.refreshPlan })
    setup()
    chooseActualPlan()
    expect(screen.getByRole('button', { name: 'confirm' })).toBeDisabled()
  })
  it('does not write when the fresh plan read fails', async () => {
    mocks.refreshPlan.mockRejectedValue(new Error('not found'))
    setup()
    chooseActualPlan()
    fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    await waitFor(() => expect(mocks.error).toHaveBeenCalled())
    expect(mocks.link).not.toHaveBeenCalled()
    expect(screen.getByRole('combobox', { name: 'catalogLink.plan' })).toHaveTextContent('Actual plan')
  })
  it.each([
    { isError: true, error: new Error('not found') },
    { data: { data: { ...actualPlan, applicationId: 'other-app' } } },
    { data: { data: { ...actualPlan, id: 'other-plan' } } }
  ])('blocks confirmation when selected plan details fail or mismatch: %o', (state) => {
    mocks.detail.mockImplementation(() => ({
      ...ready,
      data: { data: actualPlan },
      ...state,
      refetch: mocks.refreshPlan
    }))
    setup()
    chooseActualPlan()
    fireEvent.submit(screen.getByRole('button', { name: 'confirm' }).closest('form')!)
    expect(screen.getByRole('button', { name: 'confirm' })).toBeDisabled()
    expect(mocks.link).not.toHaveBeenCalled()
  })
  it('does not write if the fresh plan read no longer matches the selected application', async () => {
    mocks.refreshPlan.mockResolvedValue({ data: { data: { ...actualPlan, applicationId: 'other-app' } } })
    setup()
    chooseActualPlan()
    fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
    await waitFor(() => expect(mocks.refreshPlan).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByRole('button', { name: 'confirm' })).toBeEnabled())
    expect(mocks.link).not.toHaveBeenCalled()
  })
  it('prevents duplicate writes and keeps the chosen plan after a failed write', async () => {
    let reject!: (error: Error) => void
    mocks.link.mockImplementation(
      () =>
        new Promise((_, fail) => {
          reject = fail
        })
    )
    setup()
    chooseActualPlan()
    const form = screen.getByRole('button', { name: 'confirm' }).closest('form')!
    fireEvent.submit(form)
    fireEvent.submit(form)
    await waitFor(() => expect(mocks.link).toHaveBeenCalledTimes(1))
    reject(new Error('conflict'))
    await waitFor(() => expect(mocks.error).toHaveBeenCalled())
    expect(screen.getByRole('combobox', { name: 'catalogLink.plan' })).toHaveTextContent('Actual plan')
    expect(mocks.success).not.toHaveBeenCalled()
  })
  it('disables linking for a viewer without write authorization', () => {
    setup(assessment, false)
    expect(screen.getByRole('button', { name: 'catalogLink.action' })).toBeDisabled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mocks.link).not.toHaveBeenCalled()
  })
})
