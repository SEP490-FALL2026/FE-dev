import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeCatalogHandlers } from '../../../../../test/fixtures/employee-catalog'
import { employeeId, pageResponse, planId } from '../../../../../test/fixtures/employee-api'
import { departmentSoftwareEntry, softwareProposal } from '../../../../../test/fixtures/personnel-flows'
import { ManagerDepartmentSoftware } from './views/manager-department-software'
import { ManagerSoftwareProposalForm } from './components/manager-software-proposal-form'

const server = setupServer(
  ...employeeCatalogHandlers,
  http.get('*/api/v1/departments/:id/software-list', () => HttpResponse.json(pageResponse([departmentSoftwareEntry]))),
  http.get('*/api/v1/department-software-proposals', () => HttpResponse.json(pageResponse([softwareProposal])))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(children: React.ReactNode, search = '/') {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter initialEntries={[search]}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

it('reads the current department list without requesting proposals in the background', async () => {
  const list = vi.fn(),
    proposals = vi.fn()
  server.use(
    http.get('*/api/v1/departments/:id/software-list', ({ params }) => {
      list(params.id)
      return HttpResponse.json(pageResponse([departmentSoftwareEntry]))
    }),
    http.get('*/api/v1/department-software-proposals', () => {
      proposals()
      return HttpResponse.json(pageResponse())
    })
  )
  mount(<ManagerDepartmentSoftware departmentId={employeeId} />)
  expect(await screen.findByText('Team collaboration')).toBeInTheDocument()
  expect(list).toHaveBeenCalledWith(employeeId)
  expect(proposals).not.toHaveBeenCalled()
})
it('scopes and filters proposals on the server, resets pagination and shows IT rejection reasons', async () => {
  const reads: URLSearchParams[] = []
  server.use(
    http.get('*/api/v1/department-software-proposals', ({ request }) => {
      reads.push(new URL(request.url).searchParams)
      return HttpResponse.json(pageResponse([softwareProposal]))
    })
  )
  mount(<ManagerDepartmentSoftware departmentId={employeeId} proposals />, '/?toolsView=proposals&proposalPage=3')
  expect(await screen.findByText('Use the existing team plan')).toBeInTheDocument()
  expect(reads[0].get('departmentId')).toBe(employeeId)
  expect(reads[0].get('page')).toBe('3')
  fireEvent.change(screen.getByRole('combobox', { name: 'Proposal state' }), { target: { value: 'REJECTED' } })
  await waitFor(() => expect(reads.at(-1)?.get('state')).toBe('REJECTED'))
  expect(reads.at(-1)?.get('page')).toBe('1')
})
it.each([201, 409])(
  'sends an application-only proposal with the exact contract and retains errors (%s)',
  async (status) => {
    const submitted = vi.fn(),
      close = vi.fn()
    server.use(
      http.post('*/api/v1/department-software-proposals', async ({ request }) => {
        submitted(await request.json())
        return status === 201
          ? HttpResponse.json(
              { success: true, data: { proposal: { ...softwareProposal, state: 'PENDING' } } },
              { status }
            )
          : HttpResponse.json({ error: { code: 'DEPARTMENT_SOFTWARE.PROPOSAL_ALREADY_OPEN' } }, { status })
      })
    )
    mount(<ManagerSoftwareProposalForm departmentId={employeeId} onClose={close} />)
    expect(screen.getByRole('button', { name: 'Send proposal' })).toBeDisabled()
    fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
    fireEvent.click(await screen.findByRole('option', { name: /Test Software/ }))
    fireEvent.change(screen.getByLabelText('Why should the department list this software?'), {
      target: { value: '  Shared design workflow  ' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send proposal' }))
    await waitFor(() =>
      expect(submitted).toHaveBeenCalledWith({ applicationId: planId, reason: 'Shared design workflow' })
    )
    if (status === 201) await waitFor(() => expect(close).toHaveBeenCalledOnce())
    else {
      await waitFor(() => expect(screen.getByRole('button', { name: 'Send proposal' })).toBeEnabled())
      expect(close).not.toHaveBeenCalled()
      expect(screen.getByLabelText('Why should the department list this software?')).toHaveValue(
        '  Shared design workflow  '
      )
    }
  }
)
