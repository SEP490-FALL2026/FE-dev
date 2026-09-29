import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { RequestApprovalPage } from './request-approval-page'

function showRequest(id = 'REQ-1024', search = '') {
  render(
    <MemoryRouter initialEntries={[`/manager/team-requests/${id}${search}`]}>
      <RequestApprovalPage requestId={id} />
    </MemoryRouter>
  )
}

describe('Request Approval Detail', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('renders the supplied detail with consistent submitted date and disabled mutations', () => {
    showRequest()
    expect(screen.getByRole('heading', { level: 1, name: 'Request Approval Detail' })).toBeInTheDocument()
    expect(screen.getByText('Need Figma Professional for UI/UX design tasks in Project Alpha.')).toBeInTheDocument()
    expect(screen.getByText('EMP-0245')).toBeInTheDocument()
    expect(screen.getByText('Pending Your Approval')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Approve Request' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Reject Request' })).toBeDisabled()
    expect(screen.getByText('Requested Date').nextElementSibling).toHaveTextContent(
      new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(
        new Date('2026-08-23T09:15:00+07:00')
      )
    )
    expect(screen.getByText('Due by').nextElementSibling).toHaveTextContent('Not provided')
  })

  it('does not reuse REQ-1024 details or approval flow for another requester', () => {
    showRequest('REQ-1034', '?status=overdue')
    expect(screen.getByRole('region', { name: 'Request details REQ-1034' })).toHaveTextContent('Tableau')
    expect(screen.getAllByText('Nguyễn Thủy F')).toHaveLength(2)
    expect(screen.queryByText('EMP-0245')).not.toBeInTheDocument()
    expect(screen.queryByText('Project Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Approval history has not been supplied for this request.')).toBeInTheDocument()
    expect(screen.getByText(/The supplied design marks this request overdue/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Requests' })).toHaveAttribute(
      'href',
      '/manager/team-requests?status=overdue'
    )
  })

  it('handles unknown IDs and localizes known details', async () => {
    await setAppLanguage('vi', false)
    showRequest('unknown', '?size=3&page=2')
    expect(screen.getByRole('heading', { name: 'Không tìm thấy yêu cầu' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Phê duyệt yêu cầu' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Quay lại danh sách yêu cầu' })).toHaveAttribute(
      'href',
      '/manager/team-requests?size=3&page=2'
    )
  })

  it('downloads the selected sample report as text', () => {
    const createUrl = vi.fn(() => 'blob:request-report')
    const revokeUrl = vi.fn()
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = createUrl
        static revokeObjectURL = revokeUrl
      }
    )
    vi.useFakeTimers()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    try {
      showRequest()
      fireEvent.click(screen.getByRole('button', { name: 'Download' }))
      expect(createUrl).toHaveBeenCalledWith(expect.any(Blob))
      const anchor = click.mock.instances[0] as HTMLAnchorElement
      expect(anchor.download).toBe('REQ-1024.txt')
      expect(anchor.href).toBe('blob:request-report')
      vi.runAllTimers()
      expect(revokeUrl).toHaveBeenCalledWith('blob:request-report')
    } finally {
      click.mockRestore()
      vi.useRealTimers()
      vi.unstubAllGlobals()
    }
  })

  it('renders Vietnamese detail copy and formats the estimated cost in the active locale', async () => {
    await setAppLanguage('vi', false)
    showRequest()
    expect(screen.getByRole('heading', { level: 1, name: 'Chi tiết phê duyệt yêu cầu' })).toBeInTheDocument()
    expect(screen.getByText('Cần Figma Professional phục vụ thiết kế UI/UX trong Project Alpha.')).toBeInTheDocument()
    expect(screen.getByText('Chi phí dự kiến').nextElementSibling).toHaveTextContent(
      new Intl.NumberFormat('vi', { style: 'currency', currency: 'USD' }).format(12).replace(/\s/g, ' ')
    )
    expect(document.title).toBe('Yêu cầu REQ-1024 | SaaS-Sentry')
  })
})
