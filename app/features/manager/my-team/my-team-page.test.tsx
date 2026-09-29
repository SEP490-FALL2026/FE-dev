import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, useLocation } from 'react-router'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { MyTeamPage } from './my-team-page'

function CurrentLocation() {
  const location = useLocation()
  return <output data-testid='current-location'>{location.pathname + location.search}</output>
}

function showTeam(url = '/manager/my-team') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <MyTeamPage />
      <CurrentLocation />
    </MemoryRouter>
  )
}

describe('My Team', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('combines accent-insensitive search and department filters, and clears an empty result', () => {
    showTeam()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'cuong' } })
    expect(screen.getByRole('table')).toHaveTextContent('Lê Cường')
    expect(screen.getByRole('table')).not.toHaveTextContent('Trần Bảo')
    fireEvent.change(screen.getByRole('combobox', { name: 'Department' }), { target: { value: 'Marketing' } })
    expect(screen.getByText('No members found')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(9)
  })

  it('changes pages and resets pagination after filtering', () => {
    showTeam('/manager/my-team?size=5&page=2')
    expect(screen.getByRole('table')).toHaveTextContent('Vũ Hải')
    expect(screen.getByRole('table')).not.toHaveTextContent('Nguyễn Văn A')
    fireEvent.change(screen.getByRole('combobox', { name: 'Status' }), { target: { value: 'active' } })
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('table')).toHaveTextContent('Nguyễn Văn A')
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('navigates to the chosen employee and preserves the list filters', () => {
    showTeam('/manager/my-team?department=Product+Design')
    fireEvent.click(screen.getByRole('button', { name: 'View Trần Bảo' }))
    expect(screen.getByTestId('current-location')).toHaveTextContent('/manager/my-team/2?department=Product+Design')
  })

  it('localizes the heading and renders Vietnamese relative times', async () => {
    await setAppLanguage('vi', false)
    showTeam()
    expect(screen.getByRole('heading', { level: 1, name: 'Nhóm của tôi' })).toBeInTheDocument()
    expect(screen.getByRole('table')).toHaveTextContent(
      new Intl.RelativeTimeFormat('vi', { style: 'short' }).format(-2, 'hour')
    )
    expect(document.title).toBe('Nhóm của tôi | SaaS-Sentry')
  })
})
