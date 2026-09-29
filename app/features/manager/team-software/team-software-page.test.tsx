import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, useLocation } from 'react-router'

import { setAppLanguage } from '~/shared/i18n/i18n'
import { TeamSoftwarePage } from './team-software-page'

function Location() {
  return <output data-testid='location'>{useLocation().search}</output>
}
function showSoftware(url = '/manager/team-software') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <TeamSoftwarePage />
      <Location />
    </MemoryRouter>
  )
}

describe('Manager Team Software', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('combines search and usage filters and resets empty results', () => {
    showSoftware()
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(9)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Notion' } })
    expect(screen.getByRole('table')).toHaveTextContent('Notion')
    expect(screen.getByRole('table')).not.toHaveTextContent('Figma')
    fireEvent.click(screen.getByRole('button', { name: 'More filters' }))
    fireEvent.change(screen.getByRole('combobox', { name: 'Usage Rate' }), { target: { value: 'high' } })
    expect(screen.getByText('No software found')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled()
    fireEvent.click(screen.getAllByRole('button', { name: 'Reset filters' })[0])
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(9)
    expect(screen.getByRole('combobox', { name: 'Department' })).toBeDisabled()
  })

  it('reviews ghost software and combines an expiring flag without changing overview totals', () => {
    showSoftware()
    fireEvent.click(screen.getByRole('button', { name: 'Review Ghost Seats' }))
    expect(screen.getByTestId('location')).toHaveTextContent('ghost=1')
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4)
    expect(screen.getByRole('table')).toHaveTextContent('Jira')
    expect(screen.getByRole('table')).not.toHaveTextContent('Slack')
    expect(screen.getByRole('region', { name: 'Software' })).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'More filters' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Expiring within 30 days' }))
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(3)
    expect(screen.getByRole('table')).not.toHaveTextContent('Jira')
    expect(screen.getByRole('heading', { name: 'License Status Overview' })).toBeInTheDocument()
  })

  it('paginates supplied rows and resets pagination on status changes', () => {
    showSoftware('/manager/team-software?size=4&page=2')
    expect(screen.getByRole('table')).toHaveTextContent('Zoom')
    expect(screen.getByRole('table')).not.toHaveTextContent('Figma')
    fireEvent.change(screen.getByRole('combobox', { name: 'Status' }), { target: { value: 'expired' } })
    expect(screen.getByText('Showing 0 to 0 of 0 software')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
    fireEvent.change(screen.getByRole('combobox', { name: 'Status' }), { target: { value: 'active' } })
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('table')).toHaveTextContent('Figma')
  })

  it('does not reuse a usage snapshot for other dates and validates reversed dates', () => {
    showSoftware('/manager/team-software?from=2026-02-31&to=bad')
    expect(screen.getByRole('table')).toHaveTextContent('Figma')
    fireEvent.click(screen.getByRole('button', { name: 'Reporting period' }))
    fireEvent.change(screen.getByLabelText('From date'), { target: { value: '2026-06-01' } })
    expect(screen.getByRole('alert')).toHaveTextContent('The end date must be on or after the start date.')
    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText('To date'), { target: { value: '2026-06-07' } })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No usage snapshot for this period' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Usage Health' })).not.toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Reset filters' })[0])
    expect(screen.getByRole('table')).toHaveTextContent('Figma')
  })

  it('opens a read-only disclosure and localizes currency and UI copy', async () => {
    await setAppLanguage('vi', false)
    showSoftware()
    expect(screen.getByRole('heading', { level: 1, name: 'Phần mềm / Mức sử dụng của nhóm' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết Figma' }))
    expect(screen.getByRole('button', { name: 'Xem chi tiết Figma' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('table')).toHaveTextContent('Phân bổ từng nhân viên, lịch sử hoạt động')
    expect(screen.getByRole('table').textContent).toContain(
      new Intl.NumberFormat('vi', { style: 'currency', currency: 'USD' }).format(150)
    )
    expect(document.title).toBe('Phần mềm / Mức sử dụng của nhóm | SaaS-Sentry')
  })
})
