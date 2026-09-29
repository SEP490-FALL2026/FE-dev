import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, useLocation } from 'react-router'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { GhostSeatReviewPage } from './ghost-seat-review-page'

function Location() {
  return <div data-testid='location'>{useLocation().search}</div>
}
function showPage(url = '/manager/ghost-seat-review') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <GhostSeatReviewPage />
      <Location />
    </MemoryRouter>
  )
}

describe('Manager ghost seat review', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('combines accent-insensitive search and recommendation filters with a recoverable empty state', () => {
    showPage()
    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('row')).toHaveLength(11)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Trần Thị Bích' } })
    expect(table).toHaveTextContent('Figma')
    expect(table).not.toHaveTextContent('GitHub')
    fireEvent.click(screen.getByRole('button', { name: 'Filter' }))
    fireEvent.change(screen.getByRole('combobox', { name: 'Recommendation' }), { target: { value: 'exempt' } })
    expect(screen.getByText('No ghost seats found')).toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent('recommendation=exempt')
    fireEvent.click(screen.getAllByRole('button', { name: 'Reset filters' })[0])
    expect(within(table).getAllByRole('row')).toHaveLength(11)
  })

  it('uses the supplied inactivity thresholds without conflating overview and table counts', () => {
    showPage()
    fireEvent.click(screen.getByRole('button', { name: 'Critical' }))
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(3)
    expect(screen.getByRole('table')).toHaveTextContent('GitHub')
    expect(screen.getByRole('table')).toHaveTextContent('Figma')
    expect(screen.getByRole('table')).not.toHaveTextContent('Jira')
    expect(screen.getByText('Showing 1–2 of 2 supplied results')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Ghost seat overview' })).toHaveTextContent('24')
    expect(screen.getByRole('button', { name: 'Needs Review' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    fireEvent.click(screen.getByRole('button', { name: 'Filter' }))
    fireEvent.change(screen.getByRole('combobox', { name: 'Tier' }), { target: { value: 'medium' } })
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4)
    expect(screen.getByRole('table')).toHaveTextContent('Notion')
    expect(screen.getByRole('table')).not.toHaveTextContent('Adobe Creative Cloud')
  })

  it('sorts and paginates, keeping selection across pages and resetting the page for filters', () => {
    showPage('/manager/ghost-seat-review?size=5&page=999')
    expect(screen.getByRole('table')).toHaveTextContent('Google Workspace')
    expect(screen.getByRole('table')).not.toHaveTextContent('GitHub')
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select seats on this page' }))
    expect(screen.getByRole('status')).toHaveTextContent('6 seats selected')
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }))
    expect(screen.getByRole('checkbox', { name: 'Select GitHub for Nguyen Minh Anh' })).toBeChecked()
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Confidence' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confidence' }))
    expect(within(screen.getByRole('table')).getAllByRole('row')[1]).toHaveTextContent('Google Workspace')
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'minh.anh@company.com' } })
    expect(screen.getByRole('table')).toHaveTextContent('GitHub')
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('links to the selected record without clearing list filters', () => {
    showPage('/manager/ghost-seat-review?search=figma')
    expect(screen.getByRole('link', { name: 'View Figma for Tran Thi Bich' })).toHaveAttribute(
      'href',
      '/manager/ghost-seat-review/figma?search=figma'
    )
  })

  it('localizes headings, sample dates, money and empty state in Vietnamese', async () => {
    await setAppLanguage('vi', false)
    showPage('/manager/ghost-seat-review?id=unknown&size=bad&page=bad')
    expect(screen.getByRole('heading', { level: 1, name: 'Rà soát bản quyền không hoạt động' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Tổng quan bản quyền không hoạt động' }).textContent).toContain(
      new Intl.NumberFormat('vi', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(4320)
    )
    expect(screen.getByRole('table')).toHaveTextContent(
      new Intl.DateTimeFormat('vi', { year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC' }).format(
        new Date('2025-01-12T00:00:00Z')
      )
    )
    expect(screen.queryByRole('region', { name: 'Chi tiết bản quyền' })).not.toBeInTheDocument()
    expect(document.title).toBe('Rà soát bản quyền không hoạt động | SaaS-Sentry')
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'missing' } })
    expect(screen.getByText('Không tìm thấy bản quyền không hoạt động')).toBeInTheDocument()
  })
})
