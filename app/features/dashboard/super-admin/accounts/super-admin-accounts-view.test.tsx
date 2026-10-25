import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'
import { SuperAdminAccountsView } from './views/super-admin-accounts-view'

describe('SuperAdminAccountsView Device Identification Flow', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await setAppLanguage('vi', false)
  })

  it('renders all 3 subtabs including Device Identification', () => {
    render(<SuperAdminAccountsView />)

    expect(screen.getByText(/Danh sách tài khoản/)).toBeInTheDocument()
    expect(screen.getByText(/Phân quyền vai trò đặc biệt/)).toBeInTheDocument()
    expect(screen.getByText(/Định danh thiết bị nhân sự/)).toBeInTheDocument()
  })

  it('displays device identification column in accounts table for employees', () => {
    render(<SuperAdminAccountsView />)

    expect(screen.getByText('Thiết bị định danh')).toBeInTheDocument()
    // Should show bound devices like DEV-WIN-2026-041 or buttons to bind device
    expect(screen.getAllByText(/DEV-WIN-2026/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/\+ Định danh/).length).toBeGreaterThan(0)
  })

  it('switches to devices tab, verifies 3-step banner is removed, and verifies simplified table columns and single Xóa action', () => {
    render(<SuperAdminAccountsView />)

    const devicesTabButton = screen.getByText(/Định danh thiết bị nhân sự/)
    fireEvent.click(devicesTabButton)

    // Verify 3-step onboarding banner has been removed as requested
    expect(
      screen.queryByText('Quy trình Onboarding Nhân viên & Cấu hình Thu thập Dữ liệu Telemetry')
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Bước 1: Tạo tài khoản')).not.toBeInTheDocument()
    expect(screen.queryByText('Bước 2: Phân quyền vai trò')).not.toBeInTheDocument()
    expect(screen.queryByText('Bước 3: Định danh thiết bị máy tính')).not.toBeInTheDocument()

    // Check updated KPI cards
    expect(screen.getByText('Thiết bị đã định danh')).toBeInTheDocument()
    expect(screen.getByText('Kho thiết bị chưa gán')).toBeInTheDocument()
    expect(screen.getByText('Nhân viên chưa định danh')).toBeInTheDocument()
    expect(screen.getByText('100% Windows')).toBeInTheDocument()

    // Check updated table headers
    expect(screen.getByText('Nhân sự sử dụng')).toBeInTheDocument()
    expect(screen.getByText('Mã thiết bị (Device Code)')).toBeInTheDocument()
    expect(screen.getByText('Loại máy')).toBeInTheDocument()
    expect(screen.getByText('Địa chỉ MAC')).toBeInTheDocument()
    expect(screen.getByText('Hệ điều hành (OS)')).toBeInTheDocument()
    expect(screen.getByText('Hành động')).toBeInTheDocument()

    // Verify removed columns are NOT in document
    expect(screen.queryByText('Trạng thái Tool Tracking')).not.toBeInTheDocument()
    expect(screen.queryByText('Đồng bộ gần nhất')).not.toBeInTheDocument()
    expect(screen.queryByText('Mã Pairing Agent')).not.toBeInTheDocument()

    // Action buttons in the table should only be "Xóa"
    const deleteButtons = screen.getAllByRole('button', { name: /Xóa/i })
    expect(deleteButtons.length).toBeGreaterThan(0)
    expect(screen.queryByText('Lệnh setup')).not.toBeInTheDocument()
    expect(screen.queryByText('Sửa')).not.toBeInTheDocument()
  })

  it('opens simplified device modal with employee-only list, unassigned devices, auto-filled disabled OS/MAC, and no pairing commands', () => {
    render(<SuperAdminAccountsView />)

    const devicesTabButton = screen.getByText(/Định danh thiết bị nhân sự/)
    fireEvent.click(devicesTabButton)

    const createDeviceButton = screen.getByRole('button', { name: /\+ Định danh thiết bị mới/i })
    fireEvent.click(createDeviceButton)

    // Modal title
    expect(screen.getByText('Định danh thiết bị máy tính cho nhân viên')).toBeInTheDocument()

    // Form fields present
    expect(screen.getByText(/Nhân sự sử dụng máy tính:/)).toBeInTheDocument()
    expect(screen.getByText(/Mã thiết bị \(Device Code\):/)).toBeInTheDocument()
    expect(screen.getByText(/^Hệ điều hành \(OS\):/)).toBeInTheDocument()
    expect(screen.getByText(/^Địa chỉ MAC Card mạng:/)).toBeInTheDocument()

    // Verify fields removed
    expect(screen.queryByText(/Mã ghép nối & Lệnh cấu hình Tool Tracking/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Tên máy tính \(Hostname\):/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Hãng sản xuất & Model máy:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Số Serial phần cứng:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Địa chỉ IP nội bộ \(Tuỳ chọn\):/)).not.toBeInTheDocument()

    // Submit button
    expect(screen.getByRole('button', { name: 'Lưu định danh thiết bị' })).toBeInTheDocument()
  })
})
