import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { AssignmentDetailPage } from './assignment-detail-page'

function show(url = '/manager/access-review/AR-1') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path='/manager/access-review/:id' element={<AssignmentDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Manager assignment detail', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('shows the selected assignment with canonical identity, cycle and supplied extended fields', () => {
    show('/manager/access-review/AR-1?software=Figma&risk=low&page=2')
    expect(screen.getByRole('heading', { name: 'Assignment Details' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Nguyễn Văn A' })).toHaveAttribute('href', '/manager/my-team/1')
    expect(screen.getByText('UI/UX design for Project Alpha')).toBeInTheDocument()
    expect(screen.getByText('CC-001 · Product Development')).toBeInTheDocument()
    expect(screen.getByText('14 days ago')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Q2 2026 Audit' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Access Review' })).toHaveAttribute(
      'href',
      '/manager/access-review?software=Figma&risk=low&page=2'
    )
  })

  it('allows local decision and reason drafts with a bounded counter while submission stays unavailable', () => {
    show()
    expect(screen.getByRole('radio', { name: 'Keep' })).toBeChecked()
    fireEvent.click(screen.getByRole('radio', { name: 'Reclaim' }))
    expect(screen.getByRole('radio', { name: 'Reclaim' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Keep' })).not.toBeChecked()
    fireEvent.click(screen.getByRole('radio', { name: 'Exempt' }))
    expect(screen.getByRole('radio', { name: 'Exempt' })).toBeChecked()
    const reason = screen.getByRole('textbox', { name: 'Reason' })
    expect(reason).toBeRequired()
    expect(reason).toHaveAttribute('maxlength', '250')
    fireEvent.change(reason, { target: { value: 'Project extension' } })
    expect(screen.getByText('17/250')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit Decision' })).toBeDisabled()
    expect(screen.getByText(/unsaved drafts/)).toBeInTheDocument()
    const info = screen.getByRole('button', { name: 'About access review decisions' })
    fireEvent.click(info)
    expect(info).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/Reclaim requests removal/)).toBeInTheDocument()
  })

  it('shows the chosen employee and software without borrowing another assignment’s extended fields', () => {
    show('/manager/access-review/AR-2')
    const employee = screen.getByRole('region', { name: 'Assigned employee' })
    expect(within(employee).getByRole('link', { name: 'Trần Bảo' })).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('62 days ago')).toBeInTheDocument()
    expect(screen.getAllByText('Not supplied')).toHaveLength(2)
    expect(screen.queryByText('UI/UX design for Project Alpha')).not.toBeInTheDocument()
  })

  it('renders a recoverable missing-assignment state for unknown IDs', () => {
    show('/manager/access-review/missing?team=Product')
    expect(screen.getByRole('heading', { name: 'Assignment not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Access Review' })).toHaveAttribute(
      'href',
      '/manager/access-review?team=Product'
    )
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })

  it('localizes the detail and decision controls in Vietnamese', async () => {
    await setAppLanguage('vi', false)
    show()
    expect(screen.getByRole('heading', { name: 'Chi tiết phân quyền' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Giữ quyền' })).toBeChecked()
    expect(screen.getByRole('textbox', { name: 'Lý do' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gửi quyết định' })).toBeDisabled()
  })
})
