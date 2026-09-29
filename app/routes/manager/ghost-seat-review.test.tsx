import { render, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { createRoutesStub } from 'react-router'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ManagerLayout } from '~/features/manager/layout/manager-layout'
import GhostSeatReviewRoute from './ghost-seat-review'

it('renders the manager ghost seat route with active navigation and the shared header', async () => {
  await setAppLanguage('en', false)
  const Stub = createRoutesStub([
    {
      path: '/manager',
      Component: ManagerLayout,
      children: [{ path: 'ghost-seat-review', Component: GhostSeatReviewRoute }]
    }
  ])
  render(<Stub initialEntries={['/manager/ghost-seat-review?tab=critical']} />)
  expect(screen.getByRole('heading', { level: 1, name: 'Ghost Seat Review' })).toBeInTheDocument()
  const nav = screen.getByRole('navigation', { name: 'Manager navigation' })
  expect(within(nav).getByRole('link', { name: 'Ghost Seat Review' })).toHaveAttribute('aria-current', 'page')
  expect(within(screen.getByRole('banner')).getByText('Ghost Seat Review')).toHaveAttribute('aria-current', 'page')
  expect(within(screen.getByRole('banner')).getByRole('group', { name: 'Language' })).toBeInTheDocument()
  expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(3)
})
