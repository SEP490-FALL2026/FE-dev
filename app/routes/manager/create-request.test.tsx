import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, it } from 'vitest'
import { createRoutesStub, useParams } from 'react-router'
import { ManagerLayout } from '~/features/manager/layout/manager-layout'
import { EmployeeDetailPage } from '~/features/manager/employee-detail/employee-detail-page'
import { setAppLanguage } from '~/shared/i18n/i18n'
import CreateEmployeeRequestRoute from './create-request'
import MyTeamRoute from './my-team'

function Detail() {
  return <EmployeeDetailPage employeeId={useParams().id ?? ''} />
}
beforeEach(async () => {
  await setAppLanguage('en', false)
})
const routes = [
  {
    path: '/manager',
    Component: ManagerLayout,
    children: [
      { path: 'create-request', Component: CreateEmployeeRequestRoute },
      { path: 'my-team', Component: MyTeamRoute },
      { path: 'my-team/:id', Component: Detail }
    ]
  }
]

it('opens request creation from My Team with an empty selection and active Manager navigation', async () => {
  const Stub = createRoutesStub(routes)
  render(<Stub initialEntries={['/manager/my-team']} />)
  fireEvent.click(screen.getAllByRole('link', { name: 'Create Request for Employee' })[0])
  expect(await screen.findByRole('heading', { level: 1, name: 'Create Request for Employee' })).toBeInTheDocument()
  expect(screen.getByText('Select a team member to begin.')).toBeInTheDocument()
  const navigation = screen.getByRole('navigation', { name: 'Manager navigation' })
  expect(within(navigation).getByRole('link', { name: 'Create Request' })).toHaveAttribute('aria-current', 'page')
  expect(within(screen.getByRole('banner')).getByRole('group', { name: 'Language' })).toBeInTheDocument()
})

it('preselects the employee from their profile quick action and returns to that profile on Cancel', async () => {
  const Stub = createRoutesStub(routes)
  render(<Stub initialEntries={['/manager/my-team/2']} />)
  fireEvent.click(screen.getAllByRole('link', { name: 'Create Request for Employee' })[0])
  expect(await screen.findByRole('heading', { level: 1, name: 'Create Request for Employee' })).toBeInTheDocument()
  expect(screen.getByRole('region', { name: 'Selected employee' })).toHaveTextContent('Trần Bảo')
  fireEvent.click(screen.getByRole('link', { name: 'Cancel' }))
  expect(await screen.findByRole('heading', { level: 1, name: 'Employee Detail' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Trần Bảo' })).toBeInTheDocument()
})
