import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, useLocation } from 'react-router'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CreateEmployeeRequestPage } from './create-employee-request-page'

function Location() {
  return <div data-testid='location'>{useLocation().search}</div>
}
function showPage(query = '') {
  render(
    <MemoryRouter initialEntries={[`/manager/create-request${query}`]}>
      <CreateEmployeeRequestPage />
      <Location />
    </MemoryRouter>
  )
}

describe('Create request for employee', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })
  it('shows the same employee and assignments as employee detail and keeps subsequent steps unavailable', () => {
    showPage()
    expect(screen.getByRole('region', { name: 'Selected employee' })).toHaveTextContent('Nguyễn Văn A')
    expect(screen.getByRole('region', { name: 'Selected employee' })).toHaveTextContent('EMP-0245')
    const assignments = screen.getByRole('region', { name: 'Current Assignments' })
    expect(within(assignments).getAllByRole('listitem')).toHaveLength(4)
    expect(assignments).toHaveTextContent('Adobe Creative Cloud')
    expect(assignments).not.toHaveTextContent('Jira Software')
    expect(screen.getByRole('complementary', { name: 'Request Summary' })).toHaveTextContent('Nguyễn Văn A')
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute('href', '/manager/my-team/1')
  })
  it('searches without accents and switches the selected employee and summary without inventing assignments', () => {
    showPage()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'tran bao' } })
    expect(screen.getAllByRole('radio')).toHaveLength(1)
    fireEvent.click(screen.getByRole('radio', { name: 'Select Trần Bảo (bao.tran@company.com)' }))
    expect(screen.getByTestId('location')).toHaveTextContent('employee=2')
    expect(screen.getByRole('region', { name: 'Selected employee' })).toHaveTextContent('Trần Bảo')
    expect(screen.getByRole('complementary', { name: 'Request Summary' })).toHaveTextContent('Trần Bảo')
    expect(screen.getByRole('region', { name: 'Current Assignments' })).toHaveTextContent(
      'Assignment details were not supplied'
    )
    expect(screen.queryByText('Adobe Creative Cloud')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Remove selected employee' }))
    expect(screen.queryByRole('region', { name: 'Selected employee' })).not.toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent('employee=')
    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute('href', '/manager/my-team')
  })
  it('handles an unknown ID and empty search, then recovers by searching the known employee code', () => {
    showPage('?employee=unknown')
    expect(screen.getByRole('alert')).toHaveTextContent('This employee is not in the available sample team')
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'not-found' } })
    expect(screen.getByRole('status')).toHaveTextContent('No matching employees')
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'EMP-0245' } })
    fireEvent.click(screen.getByRole('radio', { name: 'Select Nguyễn Văn A (van.a@company.com)' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Selected employee' })).toHaveTextContent('Nguyễn Văn A')
  })
  it('supports explicit empty selection and localizes the screen in Vietnamese', async () => {
    await setAppLanguage('vi', false)
    showPage('?employee=')
    expect(screen.getByRole('heading', { level: 1, name: 'Tạo yêu cầu cho nhân viên' })).toBeInTheDocument()
    expect(document.title).toBe('Tạo yêu cầu cho nhân viên | SaaS-Sentry')
    expect(screen.getByText('Chọn thành viên trong nhóm để bắt đầu.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tiếp theo' })).toBeDisabled()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'cuong.le@company.com' } })
    fireEvent.click(screen.getByRole('radio', { name: 'Chọn Lê Cường (cuong.le@company.com)' }))
    expect(screen.getByRole('complementary', { name: 'Tóm tắt yêu cầu' })).toHaveTextContent('Lê Cường')
  })
})
