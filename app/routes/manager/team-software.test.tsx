import { render, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { createRoutesStub } from 'react-router'

import { setAppLanguage } from '~/shared/i18n/i18n'
import ManagerLayoutRoute from './layout'
import TeamSoftwareRoute from './team-software'

it('activates Team Software navigation with the shared language switch and breadcrumb', async () => {
  await setAppLanguage('en', false)
  const Stub = createRoutesStub([
    {
      path: '/manager',
      Component: ManagerLayoutRoute,
      children: [{ path: 'team-software', Component: TeamSoftwareRoute }]
    }
  ])
  render(<Stub initialEntries={['/manager/team-software']} />)
  const nav = screen.getByRole('navigation', { name: 'Manager navigation' })
  expect(within(nav).getByRole('link', { name: 'Team Software' })).toHaveAttribute('aria-current', 'page')
  expect(within(nav).getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
  const header = screen.getByRole('banner')
  expect(within(header).getByRole('group', { name: 'Language' })).toBeInTheDocument()
  expect(within(header).getByText('Team Software / Usage')).toHaveAttribute('aria-current', 'page')
  expect(within(header).getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/manager/dashboard')
})
