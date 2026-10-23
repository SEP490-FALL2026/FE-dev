import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Lock,
  RotateCw,
  Save,
  Settings,
  ShieldCheck,
  UserCheck,
  Users
} from 'lucide-react'
import { useState } from 'react'
import { Notice, PageHeader, Panel, PanelTitle, Pill } from '../../dashboard-ui'
import { type SystemSettings, initialSystemSettings } from '../super-admin-data'

export function SuperAdminSettingsView() {
  const [settings, setSettings] = useState<SystemSettings>(initialSystemSettings)
  const [isSaved, setIsSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reroutedStepsCount, setReroutedStepsCount] = useState<number | null>(null)

  // Handlers
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Validation 1: Alternate cannot be the same as Primary
    if (settings.primaryApproverId === settings.alternateApproverId) {
      setErrorMessage(
        'Người duyệt chi thay thế khi xung đột không được trùng với Người duyệt chi chính.'
      )
      return
    }

    // Check if approver changed -> Re-determine pending steps (FR-3.16, QĐ-28d)
    const approverChanged =
      settings.primaryApproverId !== initialSystemSettings.primaryApproverId ||
      settings.alternateApproverId !== initialSystemSettings.alternateApproverId

    if (approverChanged) {
      setReroutedStepsCount(3) // 3 pending requests re-routed
    } else {
      setReroutedStepsCount(null)
    }

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 5000)
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        code='Cấu hình hệ thống'
        subtitle='Cấu hình các tham số vận hành cốt lõi, hạn mức phát hiện lãng phí và chỉ định người duyệt chi cấp cao.'
        title='Cấu hình Người duyệt & Chính sách Hệ thống'
      />

      {isSaved && (
        <div className='flex items-center justify-between rounded-xl border border-success/30 bg-success/15 p-4 text-xs font-semibold text-success animate-in fade-in'>
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='size-5' />
            <div>
              <p className='font-bold'>Đã áp dụng cấu hình và cập nhật vào lịch sử hệ thống.</p>
              {reroutedStepsCount !== null && (
                <p className='mt-0.5 text-[0.7rem]'>
                  Đã tự động tính toán lại và chuyển tiếp {reroutedStepsCount} yêu cầu đang chờ sang người duyệt mới.
                </p>
              )}
            </div>
          </div>
          <Pill tone='success'>Đã lưu</Pill>
        </div>
      )}

      {errorMessage && (
        <div className='flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs font-semibold text-danger animate-in fade-in'>
          <AlertTriangle className='size-5 shrink-0' />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className='space-y-6'>
        {/* Section 1: Approver Hierarchy (UF-13, FR-3.15, SoD-1) */}
        <Panel>
          <PanelTitle
            hint='Thiết lập chuỗi người có thẩm quyền ký duyệt ngân sách và chi tiêu phần mềm vượt ngưỡng'
            title='1. Chỉ định Người duyệt chi & Người thay thế'
          />

          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <div>
              <label className='block text-xs font-bold text-foreground'>
                Người duyệt chi chính (Primary Spending Approver)
              </label>
              <select
                className='mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                onChange={(e) => {
                  const name = e.target.options[e.target.selectedIndex].text
                  setSettings({
                    ...settings,
                    primaryApproverId: e.target.value,
                    primaryApproverName: name
                  })
                }}
                value={settings.primaryApproverId}
              >
                <option value='EMP-005'>Hoàng Nam (Phó Tổng Giám Đốc)</option>
                <option value='EMP-007'>Lê Hồng Minh (Phó GĐ Vận hành)</option>
                <option value='EMP-009'>Trần Đình Trọng (Giám đốc Khối Kỹ thuật)</option>
              </select>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                Người có thẩm quyền quyết định các yêu cầu mua sắm phần mềm vượt ngân sách.
              </p>
            </div>

            <div>
              <label className='block text-xs font-bold text-foreground'>
                Người thay thế khi xung đột (Conflict Alternate)
              </label>
              <select
                className='mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                onChange={(e) => {
                  const name = e.target.options[e.target.selectedIndex].text
                  setSettings({
                    ...settings,
                    alternateApproverId: e.target.value,
                    alternateApproverName: name
                  })
                }}
                value={settings.alternateApproverId}
              >
                <option value='EMP-007'>Lê Hồng Minh (Phó GĐ Vận hành)</option>
                <option value='EMP-005'>Hoàng Nam (Phó Tổng Giám Đốc)</option>
                <option value='EMP-009'>Trần Đình Trọng (Giám đốc Khối Kỹ thuật)</option>
              </select>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                Tiếp nhận phê duyệt khi Người duyệt chi chính là người tạo yêu cầu hoặc xung đột lợi ích.
              </p>
            </div>

            <div>
              <label className='block text-xs font-bold text-foreground'>
                Approver dự phòng ở gốc (Fallback Root Approver)
              </label>
              <select
                className='mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                onChange={(e) => {
                  const name = e.target.options[e.target.selectedIndex].text
                  setSettings({
                    ...settings,
                    fallbackApproverId: e.target.value,
                    fallbackApproverName: name
                  })
                }}
                value={settings.fallbackApproverId}
              >
                <option value='EMP-003'>Nguyễn Thị Mai (Trưởng Ban Kiểm Soát)</option>
                <option value='EMP-002'>Đỗ Quang Vinh (Chủ tịch HĐQT)</option>
              </select>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                Người phê duyệt cấp cao nhất khi không tìm thấy cấp quản lý trong cây tổ chức.
              </p>
            </div>
          </div>
        </Panel>

        {/* Section 2: SLA & Thresholds (FR-3.6, FR-3.13) */}
        <Panel>
          <PanelTitle
            hint='Thiết lập thời gian phản hồi quy chuẩn và các mốc kích hoạt cảnh báo lãng phí'
            title='2. Thời hạn SLA & Ngưỡng Cảnh báo Phát hiện'
          />

          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <div>
              <label className='block text-xs font-bold text-foreground'>
                Thời hạn cam kết xử lý SLA (Giờ)
              </label>
              <select
                className='mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                onChange={(e) => setSettings({ ...settings, slaHours: Number(e.target.value) })}
                value={settings.slaHours}
              >
                <option value={24}>24 giờ (1 ngày làm việc)</option>
                <option value={48}>48 giờ (2 ngày làm việc - Tiêu chuẩn)</option>
                <option value={72}>72 giờ (3 ngày làm việc)</option>
              </select>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                Quá thời hạn này, hệ thống sẽ tự động gửi email nhắc nhở cấp trên.
              </p>
            </div>

            <div>
              <label className='block text-xs font-bold text-foreground'>
                Ngưỡng cảnh báo hạn mức Seat (%)
              </label>
              <div className='mt-1 flex items-center gap-2'>
                <input
                  className='w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                  max={99}
                  min={50}
                  onChange={(e) =>
                    setSettings({ ...settings, seatWarningThresholdPercent: Number(e.target.value) })
                  }
                  type='number'
                  value={settings.seatWarningThresholdPercent}
                />
                <span className='font-bold text-muted-foreground'>%</span>
              </div>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                Cảnh báo khi phần mềm đã cấp phát đạt đến mức % này của tổng số seat đã mua.
              </p>
            </div>

            <div>
              <label className='block text-xs font-bold text-foreground'>
                Ngưỡng phát hiện Ghost Seat (Ngày không dùng)
              </label>
              <div className='mt-1 flex items-center gap-2'>
                <input
                  className='w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                  max={180}
                  min={15}
                  onChange={(e) =>
                    setSettings({ ...settings, ghostSeatThresholdDays: Number(e.target.value) })
                  }
                  type='number'
                  value={settings.ghostSeatThresholdDays}
                />
                <span className='font-bold text-muted-foreground'>ngày</span>
              </div>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                Tài khoản không phát sinh hoạt động sau số ngày này sẽ được đưa vào bảng rà soát thu hồi.
              </p>
            </div>
          </div>
        </Panel>

        {/* Section 3: Budget Period & Retention Policy (FR-5.1, OI-11b, FR-8.3) */}
        <Panel>
          <PanelTitle
            hint='Các tham số cấu trúc tổ chức và chính sách lưu trữ dữ liệu tuân thủ'
            title='3. Kỳ Ngân sách & Chính sách Lưu giữ Nhật ký'
          />

          <div className='mt-4 grid gap-4 sm:grid-cols-2'>
            <div className='rounded-xl border border-border bg-surface-subtle/50 p-4'>
              <div className='flex items-center justify-between'>
                <label className='block text-xs font-bold text-foreground'>
                  Loại kỳ ngân sách tổ chức
                </label>
                <Pill tone='primary'>
                  <Lock className='size-3' /> Đã khóa cố định
                </Pill>
              </div>
              <p className='mt-2 text-sm font-bold text-foreground'>Theo Quý (QUARTERLY - 3 tháng/kỳ)</p>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                Loại kỳ ngân sách được thiết lập một lần duy nhất lúc khởi tạo hệ thống để bảo toàn tính toàn vẹn của số liệu kế toán.
              </p>
            </div>

            <div className='rounded-xl border border-border bg-surface-subtle/50 p-4'>
              <label className='block text-xs font-bold text-foreground'>
                Thời gian lưu trữ Audit Trail (Ngày)
              </label>
              <div className='mt-2 flex items-center gap-2'>
                <input
                  className='w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none'
                  max={3650}
                  min={90}
                  onChange={(e) =>
                    setSettings({ ...settings, auditRetentionDays: Number(e.target.value) })
                  }
                  type='number'
                  value={settings.auditRetentionDays}
                />
                <span className='font-bold text-muted-foreground'>ngày</span>
              </div>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                Nhật ký chỉ-ghi-thêm được bảo toàn toàn vẹn tối thiểu 365 ngày phục vụ kiểm toán độc lập.
              </p>
            </div>
          </div>
        </Panel>

        {/* Save button and Audit Trail note */}
        <div className='flex items-center justify-between pt-2'>
          <p className='text-xs text-muted-foreground'>
            * Thay đổi có hiệu lực ngay lập tức. Mọi giá trị trước và sau khi lưu đều được ghi nhận vào Audit Trail.
          </p>
          <button
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
            type='submit'
          >
            <Save className='size-4' />
            Lưu Cấu hình & Áp dụng
          </button>
        </div>
      </form>
    </div>
  )
}
