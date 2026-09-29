import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes, createRoutesStub } from 'react-router'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ManagerLayout } from './manager-layout'

describe('Manager layout', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('links Access Review from the sidebar and shows its breadcrumb', () => {
    render(
      <MemoryRouter initialEntries={['/manager/access-review']}>
        <Routes>
          <Route element={<ManagerLayout />}>
            <Route path='/manager/access-review' element={null} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    expect(
      within(screen.getByRole('navigation', { name: 'Manager navigation' })).getByRole('link', {
        name: /Access Review/
      })
    ).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('banner')).toHaveTextContent('Access Review')
  })

  it('keeps Access Review active on assignment detail and preserves its return filters', () => {
    render(
      <MemoryRouter initialEntries={['/manager/access-review/AR-2?software=GitHub']}>
        <Routes>
          <Route element={<ManagerLayout />}>
            <Route path='/manager/access-review/:id' element={null} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    expect(
      within(screen.getByRole('navigation', { name: 'Manager navigation' })).getByRole('link', {
        name: /Access Review/
      })
    ).toHaveAttribute('aria-current', 'page')
    expect(within(screen.getByRole('banner')).getByRole('link', { name: 'Access Review' })).toHaveAttribute(
      'href',
      '/manager/access-review?software=GitHub'
    )
    expect(screen.getByRole('banner')).toHaveTextContent('Assignment Details')
  })

  it('places the language switch in the header and marks My Team as active', async () => {
    render(
      <MemoryRouter initialEntries={['/manager/my-team']}>
        <Routes>
          <Route element={<ManagerLayout />}>
            <Route path='/manager/my-team' element={null} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    const header = screen.getByRole('banner')
    expect(within(header).getByRole('group', { name: 'Language' })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Manager navigation' })
    expect(within(nav).getByRole('link', { name: 'My Team' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
    expect(within(nav).queryByRole('group', { name: 'Language' })).not.toBeInTheDocument()
    fireEvent.click(within(header).getByRole('button', { name: 'Switch to Vietnamese' }))
    expect(await screen.findByRole('link', { name: 'Nhóm của tôi' })).toBeInTheDocument()
    expect(screen.getAllByRole('group', { name: 'Ngôn ngữ' })).toHaveLength(1)
  })

  it('keeps My Team active on employee detail and offers a team search in the header', () => {
    const Stub = createRoutesStub([
      { path: '/manager', Component: ManagerLayout, children: [{ path: 'my-team/:id', Component: () => null }] }
    ])
    render(<Stub initialEntries={['/manager/my-team/1']} />)
    const header = screen.getByRole('banner')
    expect(within(header).getByRole('searchbox', { name: 'Search team members' })).toBeInTheDocument()
    expect(within(header).getByRole('group', { name: 'Language' })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Manager navigation' })
    expect(within(nav).getByRole('link', { name: 'My Team' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
  })
})
