import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, useLocation } from 'react-router'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { GhostSeatDetailPage } from './ghost-seat-detail-page'

function Location() {
  return <div data-testid='location'>{useLocation().search}</div>
}
function showPage(id = 'figma', query = '') {
  render(
    <MemoryRouter initialEntries={[`/manager/ghost-seat-review/${id}${query}`]}>
      <GhostSeatDetailPage seatId={id} />
      <Location />
    </MemoryRouter>
  )
}

describe('Ghost seat detail', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })
  it('preserves the selected Figma identity and displays the supplied detail fields', () => {
    showPage()
    const summary = screen.getByRole('region', { name: 'Application and employee summary' })
    expect(summary).toHaveTextContent('Tran Thi Bich')
    expect(summary).toHaveTextContent('bich.tran@company.com')
    expect(summary).not.toHaveTextContent('Nguyen Minh Anh')
    expect(summary.textContent).toContain(
      new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(720)
    )
    const facts = screen.getByRole('region', { name: 'Details' })
    expect(facts).toHaveTextContent('88%')
    expect(facts).toHaveTextContent('90 days inactive')
    expect(facts).toHaveTextContent('Jan 20, 2025')
    expect(screen.getByRole('button', { name: 'Reclaim License' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    fireEvent.change(screen.getByRole('textbox', { name: 'Add a note...' }), {
      target: { value: 'Review with design team' }
    })
    expect(screen.getByRole('textbox')).toHaveValue('Review with design team')
  })
  it('keeps list state separate from tabs and navigates only within the filtered record order', () => {
    showPage('figma', '?tab=critical&size=5&page=1&sort=confidence')
    expect(screen.getByRole('link', { name: 'Previous seat' })).toHaveAttribute(
      'href',
      '/manager/ghost-seat-review/github?tab=critical&size=5&page=1&sort=confidence'
    )
    expect(screen.getByRole('button', { name: 'Next seat' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'View full evidence' }))
    expect(screen.getByTestId('location')).toHaveTextContent('tab=critical')
    expect(screen.getByTestId('location')).toHaveTextContent('panel=evidence')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(
      'Raw events, usage charts and integration logs have not been provided.'
    )
    expect(screen.getByRole('link', { name: 'Back to Ghost Seat Review' })).toHaveAttribute(
      'href',
      '/manager/ghost-seat-review?tab=critical&size=5&page=1&sort=confidence'
    )
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Usage & Evidence' }), { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Related Requests' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('This relationship is unverified')
    expect(screen.queryByRole('link', { name: /REQ-1024/ })).not.toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Related Requests' }), { key: 'End' })
    expect(screen.getByRole('tabpanel')).toHaveTextContent('No audit records have been supplied')
  })
  it('does not apply Figma evidence or cost to another employee', () => {
    showPage('slack', '?panel=invalid')
    expect(screen.getByRole('region', { name: 'Application and employee summary' })).toHaveTextContent('Pham Thi Hoa')
    expect(screen.getByRole('region', { name: 'Application and employee summary' })).not.toHaveTextContent('720')
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('No timeline has been supplied for this seat.')).toBeInTheDocument()
    expect(screen.queryByText('Nguyen Van Tuan')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'Usage & Evidence' }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Usage evidence has not been supplied')
  })
  it('handles unknown records and direct records outside the current filter', () => {
    showPage('missing', '?search=figma&panel=evidence')
    expect(screen.getByRole('heading', { name: 'Ghost seat not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Ghost Seat Review' })).toHaveAttribute(
      'href',
      '/manager/ghost-seat-review?search=figma'
    )
    expect(screen.queryByRole('button', { name: 'Reclaim License' })).not.toBeInTheDocument()
  })
  it('localizes detail and missing-data states in Vietnamese', async () => {
    await setAppLanguage('vi', false)
    showPage('slack', '?search=figma')
    expect(screen.getByRole('heading', { level: 1, name: 'Chi tiết bản quyền không hoạt động' })).toBeInTheDocument()
    expect(document.title).toBe('Chi tiết bản quyền không hoạt động | SaaS-Sentry')
    expect(screen.getByText('Ngoài bộ lọc hiện tại')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bản quyền trước' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Bản quyền sau' })).toBeDisabled()
    expect(within(screen.getByRole('region', { name: 'Chi tiết' })).getAllByText('Chưa được cung cấp')).toHaveLength(5)
  })
})
