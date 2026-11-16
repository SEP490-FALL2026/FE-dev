import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { SuperAdminPoliciesView } from './views/super-admin-policies-view'
import { getPolicyGetQueryKey } from '~/shared/api/generated/operations/policies/policy-get'
import { getPolicyDraftGetQueryKey } from '~/shared/api/generated/operations/policies/policy-draft-get'
import { getPolicyVersionListQueryKey } from '~/shared/api/generated/operations/policies/policy-version-list'
import { getPolicyAcknowledgementReportQueryKey } from '~/shared/api/generated/operations/policies/policy-acknowledgement-report'

const server = setupServer()
const pagination = (page = 1) => ({ page, pageSize: 20, totalItems: 21, totalPages: 2 })
const content = {
  sections: [
    { heading: 'Scope', body: 'All staff' },
    { heading: 'Rules', body: 'Follow the rules' }
  ],
  steps: [
    {
      code: '1.2',
      title: 'Needs approval',
      checklist: [
        { code: 'READY', text: 'Record complete', check: 'SYSTEM' },
        { code: 'NEED', text: 'Need established', check: 'PERSON' }
      ]
    }
  ]
}
const draft = {
  policyCode: 'POL-MF1',
  title: 'Access policy',
  content,
  applicableRoles: ['EMPLOYEE'],
  updatedAt: '2026-11-01T00:00:00Z'
}
const detail = {
  code: 'POL-MF1',
  title: 'Access policy',
  content,
  applicableRoles: ['EMPLOYEE'],
  versionNumber: 2,
  publishedAt: '2026-11-01T00:00:00Z',
  changeNote: 'Issued',
  requiresReacknowledgement: true
}
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
  server.use(
    http.get('*/api/v1/policies', ({ request }) =>
      HttpResponse.json({
        success: true,
        data: {
          items: [{ ...detail, hasDraft: true }],
          pagination: pagination(Number(new URL(request.url).searchParams.get('page') ?? 1))
        }
      })
    ),
    http.get('*/api/v1/policies/POL-MF1/draft', () => HttpResponse.json({ success: true, data: draft }))
  )
})
function open(url = '/?tab=policies') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <MemoryRouter initialEntries={[url]}>
      <QueryClientProvider client={client}>
        <SuperAdminPoliciesView />
      </QueryClientProvider>
    </MemoryRouter>
  )
  return client
}

it('requests selected published versions and version-history pages with flat query parameters', async () => {
  const requests: URL[] = []
  server.use(
    http.get('*/api/v1/policies/POL-MF1', ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json({
        success: true,
        data: { ...detail, versionNumber: Number(new URL(request.url).searchParams.get('version') ?? 2) }
      })
    }),
    http.get('*/api/v1/policies/POL-MF1/versions', ({ request }) => {
      const url = new URL(request.url)
      requests.push(url)
      return HttpResponse.json({
        success: true,
        data: {
          items: [{ ...detail, versionNumber: 1 }],
          pagination: pagination(Number(url.searchParams.get('page') ?? 1))
        }
      })
    })
  )
  open()
  fireEvent.click(await screen.findByRole('button', { name: 'Read policy' }))
  expect(await screen.findByText('Scope')).toBeInTheDocument()
  expect(screen.getByText('Needs approval')).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Version 1' }))
  await waitFor(() => expect(requests.some((url) => url.searchParams.get('version') === '1')).toBe(true))
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() =>
    expect(requests.some((url) => url.pathname.endsWith('/versions') && url.searchParams.get('page') === '2')).toBe(
      true
    )
  )
  expect(requests.every((url) => !url.search.includes('params'))).toBe(true)
})

it('paginates acknowledgement reports using only supported query parameters', async () => {
  const requests: URL[] = []
  server.use(
    http.get('*/api/v1/policies/POL-MF1/acknowledgements', ({ request }) => {
      const url = new URL(request.url)
      requests.push(url)
      return HttpResponse.json({
        success: true,
        data: {
          policyCode: 'POL-MF1',
          currentVersionNumber: 2,
          items: [
            {
              employeeId: 'employee',
              employeeCode: 'EMP-1',
              fullName: 'Alex',
              state: 'PENDING',
              versionNumber: null,
              acknowledgedAt: null
            }
          ],
          pagination: pagination(Number(url.searchParams.get('page') ?? 1))
        }
      })
    })
  )
  open()
  fireEvent.click(await screen.findByRole('button', { name: 'Acknowledgement report' }))
  expect(await screen.findByText('Alex')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(requests.some((url) => url.searchParams.get('page') === '2')).toBe(true))
  expect(requests.every((url) => [...url.searchParams.keys()].every((key) => ['page', 'pageSize'].includes(key)))).toBe(
    true
  )
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('blocks publishing dirty drafts and saves all edited sections and checklist fields', async () => {
  let body: unknown
  server.use(
    http.put('*/api/v1/policies/POL-MF1/draft', async ({ request }) => {
      body = await request.json()
      return HttpResponse.json({ success: true, data: { ...draft, ...(body as object) } })
    })
  )
  open()
  fireEvent.click(await screen.findByRole('button', { name: 'Edit draft' }))
  fireEvent.change(await screen.findByLabelText('Section 2 content'), { target: { value: 'Updated rules' } })
  fireEvent.change(screen.getByLabelText('Checklist item 2 text'), { target: { value: 'Updated review' } })
  expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Save draft' }))
  await waitFor(() =>
    expect(body).toMatchObject({
      content: {
        sections: [
          { heading: 'Scope', body: 'All staff' },
          { heading: 'Rules', body: 'Updated rules' }
        ],
        steps: [
          {
            code: '1.2',
            title: 'Needs approval',
            checklist: [
              { code: 'READY', text: 'Record complete', check: 'SYSTEM' },
              { code: 'NEED', text: 'Updated review', check: 'PERSON' }
            ]
          }
        ]
      }
    })
  )
  await waitFor(() => expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled())
})

it('uses list pagination and keeps context when returning from a policy page', async () => {
  open()
  fireEvent.click(await screen.findByRole('button', { name: 'Next' }))
  expect(await screen.findByText('Page 2 / 2 · 21 records')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Edit draft' }))
  await screen.findByLabelText('Policy title')
  fireEvent.click(screen.getByRole('button', { name: 'Back to policy library' }))
  expect(await screen.findByText('Page 2 / 2 · 21 records')).toBeInTheDocument()
})

it('presents translated fixed policy names and hides opaque identifiers in Vietnamese', async () => {
  await setAppLanguage('vi', false)
  open()
  expect(await screen.findByText('Yêu cầu và cấp quyền phần mềm')).toBeInTheDocument()
  expect(screen.queryByText('Access policy')).not.toBeInTheDocument()
  expect(screen.queryByText('POL-MF1')).not.toBeInTheDocument()
  expect(screen.queryByText('EMPLOYEE')).not.toBeInTheDocument()
})

it('publishes the saved draft with selected roles and invalidates published history and reports', async () => {
  let published: unknown
  server.use(
    http.post('*/api/v1/policies/POL-MF1/draft/publish', async ({ request }) => {
      published = await request.json()
      return HttpResponse.json({ success: true, data: { ...detail, versionNumber: 3 } }, { status: 201 })
    })
  )
  const client = open()
  fireEvent.click(await screen.findByRole('button', { name: 'Edit draft' }))
  await screen.findByLabelText('Policy title')
  const keys = [
    getPolicyGetQueryKey('POL-MF1', { version: 1 }),
    getPolicyVersionListQueryKey('POL-MF1', { page: 2, pageSize: 20 }),
    getPolicyAcknowledgementReportQueryKey('POL-MF1', { page: 2, pageSize: 20 })
  ]
  for (const key of keys) client.setQueryData(key, { success: true, data: null })
  fireEvent.click(screen.getByRole('button', { name: 'Publish' }))
  const dialog = await screen.findByRole('dialog')
  expect(within(dialog).getByRole('checkbox', { name: 'Employee' })).toBeChecked()
  expect(within(dialog).getByRole('checkbox', { name: 'Manager' })).not.toBeChecked()
  fireEvent.change(within(dialog).getByLabelText('Issuing grounds'), {
    target: { value: 'Directive 12, 17 November, board decision' }
  })
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm publish' }))
  await waitFor(() =>
    expect(published).toEqual({
      changeNote: 'Directive 12, 17 November, board decision',
      applicableRoles: ['EMPLOYEE'],
      requiresReacknowledgement: true
    })
  )
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  for (const key of keys) expect(client.getQueryState(key)?.isInvalidated).toBe(true)
})

it('adds personal review conditions without allowing new automatic identities or workflow steps', async () => {
  open()
  fireEvent.click(await screen.findByRole('button', { name: 'Edit draft' }))
  await screen.findByLabelText('Policy title')
  fireEvent.click(screen.getByRole('button', { name: 'Add review condition' }))
  const methods = screen.getAllByRole('combobox', { name: 'Verification method' })
  expect(within(methods[0]).getByRole('option', { name: 'Verified automatically' })).toBeInTheDocument()
  expect(within(methods[2]).queryByRole('option', { name: 'Verified automatically' })).not.toBeInTheDocument()
  expect(screen.getByLabelText('Checklist item 3 text')).toBeRequired()
  expect(screen.getByLabelText('Checklist item 3 text')).toHaveAccessibleDescription(
    'Write a clear condition the reviewer or system must verify.'
  )
  expect(screen.queryByText('READY')).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /add.*step/i })).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled()
})

it('preserves edited content when saving fails and the draft refresh is unavailable', async () => {
  let attempted = false
  server.use(
    http.put('*/api/v1/policies/POL-MF1/draft', () => {
      attempted = true
      return HttpResponse.json({ success: false, error: { code: 'VALIDATION_ERROR' } }, { status: 422 })
    }),
    http.get('*/api/v1/policies/POL-MF1/draft', () =>
      attempted
        ? HttpResponse.json({ success: false, error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
        : HttpResponse.json({ success: true, data: draft })
    )
  )
  open()
  fireEvent.click(await screen.findByRole('button', { name: 'Edit draft' }))
  fireEvent.change(await screen.findByLabelText('Section 2 content'), { target: { value: 'Keep these unsaved rules' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save draft' }))
  await waitFor(() => expect(attempted).toBe(true))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Save draft' })).toBeEnabled())
  expect(screen.getByLabelText('Section 2 content')).toHaveValue('Keep these unsaved rules')
  expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled()
})

it('loads the current saved draft when returning to edit after another administrator changes it', async () => {
  let revised = false
  server.use(
    http.get('*/api/v1/policies/POL-MF1/draft', () =>
      HttpResponse.json({
        success: true,
        data: {
          ...draft,
          title: revised ? 'Revised policy' : draft.title
        }
      })
    )
  )
  open()
  fireEvent.click(await screen.findByRole('button', { name: 'Edit draft' }))
  expect(await screen.findByLabelText('Policy title')).toHaveValue('Access policy')
  fireEvent.click(screen.getByRole('button', { name: 'Back to policy library' }))
  revised = true
  fireEvent.click(await screen.findByRole('button', { name: 'Edit draft' }))
  await waitFor(() => expect(screen.getByLabelText('Policy title')).toHaveValue('Revised policy'))
})

it('creates a fresh draft copy without reusing discarded cached content', async () => {
  let requestBody: unknown
  let hasDraft = false
  let title = 'Fresh copied policy'
  server.use(
    http.get('*/api/v1/policies', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [{ ...detail, hasDraft }],
          pagination: pagination()
        }
      })
    ),
    http.put('*/api/v1/policies/POL-MF1/draft', async ({ request }) => {
      requestBody = await request.json()
      hasDraft = true
      return HttpResponse.json({ success: true, data: { ...draft, title } })
    }),
    http.get('*/api/v1/policies/POL-MF1/draft', () => HttpResponse.json({ success: true, data: { ...draft, title } }))
  )
  const client = open()
  client.setQueryData(getPolicyDraftGetQueryKey('POL-MF1'), {
    success: true,
    data: { ...draft, title: 'Discarded draft' }
  })
  fireEvent.click(await screen.findByRole('button', { name: 'Draft new version' }))
  expect(await screen.findByLabelText('Policy title')).toHaveValue('Fresh copied policy')
  expect(requestBody).toEqual({})
  fireEvent.click(screen.getByRole('button', { name: 'Back to policy library' }))
  title = 'Changed after creation'
  fireEvent.click(await screen.findByRole('button', { name: 'Edit draft' }))
  await waitFor(() => expect(screen.getByLabelText('Policy title')).toHaveValue('Changed after creation'))
})
