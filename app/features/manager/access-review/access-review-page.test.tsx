import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, useLocation } from 'react-router'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { AccessReviewPage } from './access-review-page'

function Location() {
  return <div data-testid='location'>{useLocation().search}</div>
}
function show(url = '/manager/access-review') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <AccessReviewPage />
      <Location />
    </MemoryRouter>
  )
}
describe('Manager access review', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('combines URL search, software, team and risk filters and recovers from an empty result', () => {
    show()
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'tran bao' } })
    expect(screen.getByRole('table')).toHaveTextContent('GitHub')
    expect(screen.getByRole('table')).not.toHaveTextContent('Figma')
    fireEvent.change(screen.getByRole('combobox', { name: 'Risk Level' }), { target: { value: 'low' } })
    expect(screen.getByText('No supplied assignments found')).toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent('risk=low')
    fireEvent.click(screen.getAllByRole('button', { name: 'Clear all filters' })[0])
    fireEvent.change(screen.getByRole('combobox', { name: 'Team' }), { target: { value: 'Platform' } })
    expect(screen.getByRole('table')).toHaveTextContent('Jira')
    expect(screen.getByRole('table')).not.toHaveTextContent('GitHub')
    fireEvent.change(screen.getByRole('combobox', { name: 'Software' }), { target: { value: 'Figma' } })
    expect(screen.getByText('No supplied assignments found')).toBeInTheDocument()
  })

  it('keeps selection across pages and opens a read-only bulk preview without changing statuses', () => {
    show('/manager/access-review?size=2')
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select assignments on this page' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByRole('status')).toHaveTextContent('Showing 3–3 of 3 supplied assignments')
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select assignments on this page' }))
    fireEvent.click(screen.getByRole('button', { name: 'Review Selected (3)' }))
    const preview = screen.getByRole('region', { name: 'Assignment review preview' })
    expect(preview).toHaveTextContent('read-only')
    expect(within(preview).getAllByText('Pending')).toHaveLength(3)
    fireEvent.click(screen.getByRole('button', { name: 'Close review preview' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }))
    expect(screen.getByRole('checkbox', { name: 'Select Figma for Nguyễn Văn A' })).toBeChecked()
    fireEvent.change(screen.getByRole('combobox', { name: 'Risk Level' }), { target: { value: 'medium' } })
    fireEvent.click(screen.getByRole('button', { name: 'Review Selected (1)' }))
    expect(screen.getByRole('region', { name: 'Assignment review preview' })).toHaveTextContent('GitHub')
    expect(screen.getByRole('region', { name: 'Assignment review preview' })).not.toHaveTextContent('Figma')
  })

  it('supports keyboard tabs and reports missing reviewed and exempt sample records', () => {
    show()
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Pending Review (25)' }), { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Reviewed (12)' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('No supplied assignments found')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled()
    expect(screen.getByTestId('location')).toHaveTextContent('status=reviewed')
    fireEvent.click(screen.getByRole('tab', { name: 'Exempt (2)' }))
    expect(screen.getByRole('table')).not.toHaveTextContent('Figma')
  })

  it('opens the chosen row and links to its employee profile', () => {
    show('/manager/access-review?employee=2')
    expect(screen.getByRole('link', { name: 'View GitHub for Trần Bảo' })).toHaveAttribute(
      'href',
      '/manager/access-review/AR-2?employee=2'
    )
    expect(within(screen.getByRole('table')).getByRole('link', { name: 'Trần Bảo' })).toHaveAttribute(
      'href',
      '/manager/my-team/2'
    )
    fireEvent.click(screen.getByRole('button', { name: 'Remove employee filter' }))
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4)
  })

  it('renders Vietnamese copy and locale-aware dates', async () => {
    await setAppLanguage('vi', false)
    show()
    expect(screen.getByRole('heading', { name: 'Rà soát quyền truy cập' })).toBeInTheDocument()
    expect(screen.getByRole('table')).toHaveTextContent('Nhà thiết kế sản phẩm')
    expect(screen.getByRole('table')).toHaveTextContent(
      new Intl.DateTimeFormat('vi', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(
        new Date('2026-01-12T00:00:00Z')
      )
    )
  })
})
