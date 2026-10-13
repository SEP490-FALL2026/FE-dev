import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { createRoutesStub } from 'react-router'

import { setAppLanguage } from '~/shared/i18n/i18n'
import ManagerLayoutRoute from './layout'
import TeamRequestsRoute from './team-requests'
import RequestApprovalDetailRoute from './request-approval-detail'
import { teamRequests } from '~/entities/request/manager-requests-demo'

describe('Manager Team Requests route', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('marks Team Requests active and synchronizes header and table searches', () => {
    const Stub = createRoutesStub([
      {
        path: '/manager',
        Component: ManagerLayoutRoute,
        children: [{ path: 'team-requests', Component: TeamRequestsRoute }]
      }
    ])
    render(<Stub initialEntries={['/manager/team-requests?status=pending']} />)
    const nav = screen.getByRole('navigation', { name: 'Manager navigation' })
    expect(within(nav).getByRole('link', { name: 'Team Requests' })).toHaveAttribute('aria-current', 'page')
    const header = screen.getByRole('banner')
    expect(within(header).getByRole('group', { name: 'Language' })).toBeInTheDocument()
    const search = within(header).getByRole('searchbox')
    fireEvent.change(search, { target: { value: 'Figma' } })
    expect(screen.getByRole('searchbox', { name: 'Search team requests' })).toHaveValue('Figma')
    expect(screen.getByRole('table')).toHaveTextContent('REQ-1024')
    expect(screen.getByRole('table')).not.toHaveTextContent('REQ-1027')
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveValue('pending')
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search team requests' }), { target: { value: 'GitHub' } })
    expect(search).toHaveValue('GitHub')
  })

  it('opens the chosen request from Review and returns with the list filters preserved', async () => {
    const Stub = createRoutesStub([
      {
        path: '/manager',
        Component: ManagerLayoutRoute,
        children: [
          { path: 'team-requests', Component: TeamRequestsRoute },
          { path: 'team-requests/:id', Component: RequestApprovalDetailRoute }
        ]
      }
    ])
    render(<Stub initialEntries={['/manager/team-requests?size=3&page=2&status=open']} />)
    screen.getByRole('main').scrollTop = 300
    fireEvent.click(screen.getByRole('link', { name: 'Review REQ-1034' }))
    expect(await screen.findByRole('heading', { name: 'Request Approval Detail', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('main').scrollTop).toBe(0)
    expect(screen.getByRole('region', { name: 'Request details REQ-1034' })).toHaveTextContent('Tableau')
    const header = screen.getByRole('banner')
    expect(within(header).getByText('REQ-1034')).toHaveAttribute('aria-current', 'page')
    expect(within(header).getByRole('group', { name: 'Language' })).toBeInTheDocument()
    expect(
      within(screen.getByRole('navigation', { name: 'Manager navigation' })).getByRole('link', {
        name: 'Team Requests'
      })
    ).toHaveAttribute('aria-current', 'page')
    fireEvent.click(screen.getByRole('link', { name: 'Back to Requests' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Team Requests' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveValue('open')
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')
  })

  it.each(teamRequests)('opens $id with its own employee, software and status', async (request) => {
    const Stub = createRoutesStub([
      {
        path: '/manager',
        Component: ManagerLayoutRoute,
        children: [
          { path: 'team-requests', Component: TeamRequestsRoute },
          { path: 'team-requests/:id', Component: RequestApprovalDetailRoute }
        ]
      }
    ])
    render(<Stub initialEntries={['/manager/team-requests']} />)
    fireEvent.click(screen.getByRole('link', { name: `Review ${request.id}` }))
    expect(await screen.findByRole('region', { name: `Request details ${request.id}` })).toHaveTextContent(
      request.software
    )
    expect(screen.getAllByText(request.name).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Approve Request' })).toBeDisabled()
    fireEvent.click(screen.getByRole('link', { name: 'Back to Requests' }))
    await screen.findByRole('table')
  })
})
