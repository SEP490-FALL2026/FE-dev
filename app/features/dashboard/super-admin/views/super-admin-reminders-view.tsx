import { useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  HelpCircle,
  Info,
  Play,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle
} from 'lucide-react'
import {
  initialPendingRequests,
  initialReminderPolicy,
  type PendingManagerRequestSample,
  type ReminderPolicy
} from '../super-admin-data'

interface NotificationLog {
  id: string
  recipientName: string
  recipientRole: string
  recipientEmail: string
  departmentName: string
  requestId: string
  employeeName: string
  waitingHours: number
  slaHours: number
  message: string
  sentAt: string
  isDuplicateBlocked?: boolean
}

export function SuperAdminRemindersView() {
  // Policy State
  const [activePolicy, setActivePolicy] = useState<ReminderPolicy>(initialReminderPolicy)
  const [inputDays, setInputDays] = useState<string>(String(initialReminderPolicy.noticeDays))
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  // Simulation State
  const [requests, setRequests] = useState<PendingManagerRequestSample[]>(initialPendingRequests)
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([
    {
      id: 'log-01',
      recipientName: 'Thu Hà',
      recipientRole: 'Manager',
      recipientEmail: 'thu.ha@company.com',
      departmentName: 'Phòng Thiết kế & Trải nghiệm',
      requestId: 'REQ-2026-101',
      employeeName: 'Trần Tuấn',
      waitingHours: 54,
      slaHours: 48,
      message:
        'Yêu cầu cấp phần mềm [Figma Organization] từ nhân viên Trần Tuấn đã chờ 54 giờ vượt mốc 48 giờ SLA quy định. Vui lòng mở xét duyệt.',
      sentAt: '22/10/2026 15:00:00'
    }
  ])
  const [lastRunTime, setLastRunTime] = useState<string | null>('22/10/2026 15:00:00')

  const parsedDays = parseInt(inputDays, 10)
  const slaHours = (!isNaN(parsedDays) && parsedDays > 0) ? parsedDays * 24 : 48

  // Helper calculation for real-time preview
  const formatPreviewDate = (addedHours: number) => {
    const baseDate = new Date()
    const targetDate = new Date(baseDate.getTime() + addedHours * 60 * 60 * 1000)
    return `${targetDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ngày ${targetDate.toLocaleDateString('vi-VN')}`
  }

  const handleInputChange = (val: string) => {
    setInputDays(val)
    const num = parseInt(val, 10)
    if (!val.trim()) {
      setValidationError('Vui lòng nhập số ngày quy định.')
    } else if (isNaN(num) || num <= 0) {
      setValidationError('Thời hạn phải là số nguyên dương lớn hơn 0 (ví dụ: 1, 2, 3...).')
    } else if (num > 30) {
      setValidationError('Thời hạn nhắc không nên vượt quá 30 ngày để đảm bảo SLA công việc.')
    } else {
      setValidationError(null)
    }
  }

  const handleOpenConfirm = () => {
    const num = parseInt(inputDays, 10)
    if (isNaN(num) || num <= 0) {
      setValidationError('Vui lòng nhập số ngày hợp lệ trước khi lưu.')
      return
    }
    setShowConfirmModal(true)
  }

  const handleConfirmSave = () => {
    const num = parseInt(inputDays, 10)
    const now = new Date()
    const timestampStr = `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN')}`

    setActivePolicy({
      noticeDays: num,
      recipientRole: 'MANAGER',
      lastUpdated: timestampStr,
      effectiveFrom: `${timestampStr} (áp dụng cho các yêu cầu mới chuyển đến Manager)`
    })

    setShowConfirmModal(false)
    setToastMessage({
      type: 'success',
      text: `Đã lưu cấu hình thời hạn nhắc Manager: ${num} ngày (${num * 24} giờ liên tục).`
    })

    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleResetDefault = () => {
    setInputDays('2')
    setValidationError(null)
  }

  // Simulation: Run Overdue Scanner (Cron Mock)
  const handleRunSimulation = () => {
    const currentSlaHours = activePolicy.noticeDays * 24
    const now = new Date()
    const nowStr = `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN')}`
    setLastRunTime(nowStr)

    const newLogs: NotificationLog[] = []
    let newlyAlertedCount = 0
    let blockedDuplicateCount = 0
    let missingManagerCount = 0

    const updatedRequests = requests.map((req) => {
      // If request has been resolved, early exit
      if (req.status === 'APPROVED' || req.status === 'REJECTED' || req.status === 'CLARIFICATION_REQUESTED') {
        return req
      }

      const isOverdue = req.waitingHours >= currentSlaHours

      if (isOverdue) {
        // Check if department lacks a manager
        if (!req.managerEmail || req.managerEmail.includes('Chưa có Manager')) {
          missingManagerCount++
          return { ...req, isOverdue: true }
        }

        // Check if an alert was already logged for this request to prevent duplicate spam
        const alreadyLogged = notificationLogs.some((l) => l.requestId === req.id && !l.isDuplicateBlocked)

        if (alreadyLogged) {
          blockedDuplicateCount++
          return { ...req, isOverdue: true, status: 'ALERT_SENT' as const }
        }

        // New alert generated!
        newlyAlertedCount++
        newLogs.push({
          id: `log-${Date.now()}-${req.id}`,
          recipientName: req.managerName,
          recipientRole: 'Manager',
          recipientEmail: req.managerEmail,
          departmentName: req.departmentName,
          requestId: req.id,
          employeeName: req.employeeName,
          waitingHours: req.waitingHours,
          slaHours: currentSlaHours,
          message: `Yêu cầu [${req.id}] từ nhân viên ${req.employeeName} (${req.softwareName}) đã chờ ${req.waitingHours} giờ (vượt hạn ${currentSlaHours}h). Đề nghị Quản lý phản hồi.`,
          sentAt: nowStr
        })

        return { ...req, isOverdue: true, status: 'ALERT_SENT' as const }
      }

      return { ...req, isOverdue: false }
    })

    setRequests(updatedRequests)
    if (newLogs.length > 0) {
      setNotificationLogs((prev) => [...newLogs, ...prev])
    }

    if (newlyAlertedCount > 0) {
      setToastMessage({
        type: 'success',
        text: `Đã gửi ${newlyAlertedCount} thông báo nhắc nhở đến Manager phòng ban tương ứng.`
      })
    } else if (missingManagerCount > 0 && blockedDuplicateCount === 0) {
      setToastMessage({
        type: 'error',
        text: `Có ${missingManagerCount} yêu cầu quá hạn nhưng phòng ban chưa có Manager để nhận thông báo! Cần cấu hình nhân sự.`
      })
    } else if (blockedDuplicateCount > 0) {
      setToastMessage({
        type: 'info',
        text: `Hệ thống kiểm tra hoàn tất: Đã chặn trùng lặp thông báo (${blockedDuplicateCount} yêu cầu đã gửi nhắc trước đó).`
      })
    } else {
      setToastMessage({
        type: 'info',
        text: 'Tất cả yêu cầu đang trong hạn xử lý an toàn. Không phát sinh thông báo nhắc.'
      })
    }

    setTimeout(() => setToastMessage(null), 4500)
  }

  // Simulation: Manager takes action (Early resolution scenario)
  const handleManagerAction = (
    requestId: string,
    action: 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED'
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: action
          }
        }
        return r
      })
    )

    const actionText =
      action === 'APPROVED'
        ? 'Phê duyệt'
        : action === 'REJECTED'
        ? 'Từ chối'
        : 'Yêu cầu nhân viên bổ sung thông tin'

    setToastMessage({
      type: 'success',
      text: `Quản lý đã ${actionText} yêu cầu ${requestId}. Yêu cầu đã rời khỏi hàng chờ — sẽ không kích hoạt nhắc nhở nữa.`
    })
    setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <div className='space-y-6'>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`flex items-center justify-between rounded-xl border p-4 text-sm font-medium shadow-lg transition-all ${
            toastMessage.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
              : toastMessage.type === 'error'
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300'
              : 'border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300'
          }`}
        >
          <div className='flex items-center gap-3'>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className='size-5 shrink-0 text-emerald-600' />
            ) : toastMessage.type === 'error' ? (
              <AlertCircle className='size-5 shrink-0 text-rose-600' />
            ) : (
              <Info className='size-5 shrink-0 text-sky-600' />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            className='text-xs underline hover:no-underline'
            onClick={() => setToastMessage(null)}
            type='button'
          >
            Đóng
          </button>
        </div>
      )}

      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2.5'>
            <span className='rounded-lg bg-primary/10 p-2 text-primary'>
              <BellRing className='size-6' />
            </span>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>Cấu hình Nhắc xử lý Yêu cầu</h1>
              <p className='text-sm text-muted-foreground'>
                Thiết lập thời hạn tự động gửi thông báo nhắc nhở Quản lý phòng ban khi yêu cầu của nhân viên chưa được xử lý.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Business Rule Card */}
      <div className='relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-surface to-background p-6 shadow-sm'>
        <div className='flex items-start gap-4'>
          <div className='rounded-xl bg-primary/15 p-3 text-primary'>
            <ShieldCheck className='size-6' />
          </div>
          <div className='space-y-2 text-sm'>
            <h2 className='text-base font-semibold text-foreground'>
              Chính sách nhắc nhở phê duyệt tự động
            </h2>
            <p className='text-muted-foreground leading-relaxed'>
              <strong className='text-foreground'>Cơ chế hoạt động:</strong> Nếu yêu cầu của nhân viên đã gửi đến Quản lý phòng ban mà sau{' '}
              <span className='rounded bg-amber-500/10 px-1.5 py-0.5 font-bold text-amber-700 dark:text-amber-400'>
                {activePolicy.noticeDays} ngày ({activePolicy.noticeDays * 24} giờ liên tục)
              </span>{' '}
              vẫn chưa có quyết định phê duyệt, hệ thống sẽ tự động phát sinh thông báo nhắc nhở gửi trực tiếp đến Quản lý phòng ban.
            </p>
            <div className='grid gap-3 pt-2 sm:grid-cols-3'>
              <div className='rounded-xl border border-border/60 bg-surface/80 p-3'>
                <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Đơn vị tính</p>
                <p className='mt-1 text-sm font-medium text-foreground'>
                  <strong>1 ngày = 24 giờ liên tục</strong> tính từ thời điểm yêu cầu vào hàng chờ Manager.
                </p>
              </div>
              <div className='rounded-xl border border-border/60 bg-surface/80 p-3'>
                <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Đối tượng nhận duy nhất</p>
                <p className='mt-1 text-sm font-medium text-foreground'>
                  <strong>Chỉ Manager nhận nhắc</strong>. Nhân viên gửi yêu cầu không nhận thông báo quá hạn từ cấu hình này.
                </p>
              </div>
              <div className='rounded-xl border border-border/60 bg-surface/80 p-3'>
                <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Hiệu lực áp dụng</p>
                <p className='mt-1 text-sm font-medium text-foreground'>
                  Áp dụng cho các yêu cầu mới vào hàng chờ sau thời điểm lưu. Yêu cầu cũ giữ mốc đã định.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <div className='flex items-center justify-between border-b border-border pb-4'>
          <div>
            <h2 className='text-lg font-bold text-foreground'>Chính sách thời hạn nhắc nhở Manager</h2>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Cấu hình số ngày chờ trước khi thông báo cảnh báo SLA đầu tiên được phát đi
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400'>
              <CheckCircle2 className='size-3.5' />
              Đang áp dụng: {activePolicy.noticeDays} ngày ({activePolicy.noticeDays * 24}h)
            </span>
          </div>
        </div>

        <div className='mt-6 grid gap-6 lg:grid-cols-12'>
          {/* Form Controls */}
          <div className='space-y-5 lg:col-span-7'>
            <div>
              <label className='block text-sm font-semibold text-foreground' htmlFor='sla-notice-days'>
                Số ngày chờ tối đa trước khi gửi nhắc <span className='text-rose-500'>*</span>
              </label>
              <div className='mt-2 flex items-center gap-3'>
                <div className='relative max-w-xs flex-1'>
                  <input
                    aria-describedby={validationError ? 'sla-notice-error' : undefined}
                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-base font-bold shadow-sm transition focus:outline-none focus:ring-2 ${
                      validationError
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-border focus:border-primary focus:ring-primary/20'
                    }`}
                    id='sla-notice-days'
                    min='1'
                    max='30'
                    onChange={(e) => handleInputChange(e.target.value)}
                    type='number'
                    value={inputDays}
                  />
                  <span className='absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground'>
                    ngày
                  </span>
                </div>
                <button
                  className='rounded-xl border border-border bg-surface-subtle px-3.5 py-2.5 text-xs font-semibold text-muted-foreground transition hover:bg-surface hover:text-foreground'
                  onClick={handleResetDefault}
                  type='button'
                >
                  <RotateCcw className='mr-1.5 inline size-3.5' />
                  Mặc định (2 ngày)
                </button>
              </div>
              {validationError && (
                <p className='mt-2 text-xs font-medium text-rose-600 dark:text-rose-400' id='sla-notice-error'>
                  {validationError}
                </p>
              )}
            </div>

            {/* Real-time Dynamic Conversion Preview */}
            <div className='rounded-xl border border-border/80 bg-surface-subtle p-4'>
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Quy đổi thời gian thực tế theo múi giờ hệ thống
              </p>
              <div className='mt-2 space-y-1.5 text-sm'>
                <p className='text-foreground'>
                  • Thời hạn tương đương: <strong className='text-primary'>{slaHours} giờ liên tục</strong> (tính từ thời điểm nhân viên gửi yêu cầu).
                </p>
                <p className='text-muted-foreground'>
                  • Ví dụ mô phỏng: Nếu yêu cầu được gửi vào lúc <strong className='text-foreground'>10:00 hôm nay</strong>, thông báo sẽ phát đi vào đúng <strong className='text-foreground'>{formatPreviewDate(slaHours)}</strong> nếu Quản lý chưa xử lý.
                </p>
              </div>
            </div>

            {/* Policy Metadata */}
            <div className='grid grid-cols-2 gap-4 text-xs text-muted-foreground border-t border-border pt-4'>
              <div>
                <span className='block font-medium text-foreground'>Lần cập nhật gần nhất:</span>
                <span className='font-mono'>{activePolicy.lastUpdated}</span>
              </div>
              <div>
                <span className='block font-medium text-foreground'>Mốc hiệu lực:</span>
                <span>{activePolicy.effectiveFrom}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className='pt-2'>
              <button
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90'
                onClick={handleOpenConfirm}
                type='button'
              >
                <Save className='size-4' />
                Lưu cấu hình thời hạn
              </button>
            </div>
          </div>

          {/* Quick Context / Visual Info Card */}
          <div className='rounded-xl border border-primary/20 bg-primary/5 p-5 lg:col-span-5'>
            <h3 className='text-sm font-bold text-foreground flex items-center gap-2'>
              <Info className='size-4 text-primary' />
              Hành vi xử lý của hệ thống
            </h3>
            <ul className='mt-3 space-y-2.5 text-xs text-muted-foreground'>
              <li className='flex items-start gap-2'>
                <span className='mt-1 size-1.5 rounded-full bg-primary shrink-0' />
                <span>
                  <strong>Khi đến hạn quá SLA:</strong> Hệ thống tạo thông báo đẩy duy nhất tới tài khoản Manager quản lý phòng ban đó.
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 size-1.5 rounded-full bg-primary shrink-0' />
                <span>
                  <strong>Khi xử lý trước hạn:</strong> Manager phê duyệt, từ chối hoặc yêu cầu bổ sung sẽ đưa yêu cầu ra khỏi trạng thái chờ; không phát sinh thông báo nhắc.
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 size-1.5 rounded-full bg-primary shrink-0' />
                <span>
                  <strong>Chống gửi trùng lặp:</strong> Quá trình quét nền chạy định kỳ sẽ kiểm tra lịch sử và không gửi thông báo trùng lặp cho cùng một mốc quá hạn.
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 size-1.5 rounded-full bg-rose-500 shrink-0' />
                <span>
                  <strong>Phòng ban chưa có Manager:</strong> Yêu cầu không thể gửi thông báo tới người quản lý; hệ thống sẽ gắn cờ cảnh báo trên màn hình Tổng quan để Super Admin bổ nhiệm Manager.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive SLA Simulation Workbench */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4'>
          <div>
            <div className='flex items-center gap-2'>
              <span className='rounded-md bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400'>
                <Play className='size-4' />
              </span>
              <h2 className='text-lg font-bold text-foreground'>Kiểm tra xử lý gửi nhắc nhở</h2>
            </div>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Quét các yêu cầu đang chờ phê duyệt và gửi thông báo nhắc nhở đến Quản lý tương ứng
            </p>
          </div>
          <div className='flex items-center gap-3'>
            {lastRunTime && (
              <span className='text-xs text-muted-foreground'>
                Lần quét gần nhất: <strong className='font-mono text-foreground'>{lastRunTime}</strong>
              </span>
            )}
            <button
              className='inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700'
              onClick={handleRunSimulation}
              type='button'
            >
              <Play className='size-3.5 fill-current' />
              Quét & Gửi nhắc nhở ngay
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className='mt-6 overflow-hidden rounded-xl border border-border'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
                <tr>
                  <th className='px-4 py-3 font-semibold'>Mã yêu cầu</th>
                  <th className='px-4 py-3 font-semibold'>Nhân viên gửi</th>
                  <th className='px-4 py-3 font-semibold'>Phần mềm / Tài khoản</th>
                  <th className='px-4 py-3 font-semibold'>Phòng ban & Manager phụ trách</th>
                  <th className='px-4 py-3 font-semibold text-center'>Thời gian đã chờ</th>
                  <th className='px-4 py-3 font-semibold text-center'>Trạng thái SLA</th>
                  <th className='px-4 py-3 font-semibold text-right'>Thao tác mô phỏng</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {requests.map((req) => {
                  const isResolved =
                    req.status === 'APPROVED' ||
                    req.status === 'REJECTED' ||
                    req.status === 'CLARIFICATION_REQUESTED'
                  const isOverdueNow = req.waitingHours >= activePolicy.noticeDays * 24

                  return (
                    <tr className='hover:bg-surface-subtle/50 transition' key={req.id}>
                      <td className='px-4 py-3 font-mono font-bold text-foreground'>{req.id}</td>
                      <td className='px-4 py-3'>
                        <div className='font-semibold text-foreground'>{req.employeeName}</div>
                        <div className='text-[0.7rem] text-muted-foreground'>{req.employeeEmail}</div>
                      </td>
                      <td className='px-4 py-3'>
                        <span className='font-medium text-foreground'>{req.softwareName}</span>
                        <div className='text-[0.7rem] text-muted-foreground'>Gửi lúc: {req.requestedAt}</div>
                      </td>
                      <td className='px-4 py-3'>
                        <div className='font-medium text-foreground'>{req.departmentName}</div>
                        <div className='text-[0.7rem]'>
                          {req.managerEmail.includes('Chưa có Manager') ? (
                            <span className='inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400'>
                              <AlertCircle className='size-3' /> Chưa có Manager
                            </span>
                          ) : (
                            <span className='text-muted-foreground'>
                              Manager: <strong className='text-foreground'>{req.managerName}</strong> ({req.managerEmail})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-4 py-3 text-center'>
                        <span
                          className={`font-mono text-sm font-bold ${
                            isOverdueNow && !isResolved ? 'text-rose-600 dark:text-rose-400' : 'text-foreground'
                          }`}
                        >
                          {req.waitingHours} giờ
                        </span>
                        <div className='text-[0.65rem] text-muted-foreground'>
                          (Hạn: {activePolicy.noticeDays * 24}h)
                        </div>
                      </td>
                      <td className='px-4 py-3 text-center'>
                        {isResolved ? (
                          <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] font-semibold text-emerald-700 dark:text-emerald-400'>
                            <CheckCircle2 className='size-3' />
                            {req.status === 'APPROVED'
                              ? 'Đã duyệt (Rời hàng chờ)'
                              : req.status === 'REJECTED'
                              ? 'Đã từ chối (Rời hàng chờ)'
                              : 'Đã yêu cầu bổ sung'}
                          </span>
                        ) : isOverdueNow ? (
                          <span className='inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[0.7rem] font-bold text-rose-700 dark:text-rose-400'>
                            <AlertTriangle className='size-3' />
                            {req.status === 'ALERT_SENT' ? 'Đã gửi nhắc Manager' : 'Quá hạn — Chưa nhắc'}
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-[0.7rem] font-semibold text-sky-700 dark:text-sky-400'>
                            <Clock className='size-3' />
                            Trong hạn SLA
                          </span>
                        )}
                      </td>
                      <td className='px-4 py-3 text-right'>
                        {isResolved ? (
                          <span className='text-[0.7rem] italic text-muted-foreground'>Đã giải quyết</span>
                        ) : (
                          <div className='inline-flex items-center gap-1.5'>
                            <button
                              className='rounded-lg bg-emerald-600 px-2 py-1 text-[0.65rem] font-semibold text-white transition hover:bg-emerald-700'
                              onClick={() => handleManagerAction(req.id, 'APPROVED')}
                              title='Mô phỏng Quản lý duyệt trước hạn'
                              type='button'
                            >
                              Duyệt
                            </button>
                            <button
                              className='rounded-lg bg-rose-600 px-2 py-1 text-[0.65rem] font-semibold text-white transition hover:bg-rose-700'
                              onClick={() => handleManagerAction(req.id, 'REJECTED')}
                              title='Mô phỏng Quản lý từ chối'
                              type='button'
                            >
                              Từ chối
                            </button>
                            <button
                              className='rounded-lg border border-border bg-surface px-2 py-1 text-[0.65rem] font-medium text-foreground transition hover:bg-surface-subtle'
                              onClick={() => handleManagerAction(req.id, 'CLARIFICATION_REQUESTED')}
                              title='Mô phỏng Quản lý yêu cầu bổ sung thông tin'
                              type='button'
                            >
                              Bổ sung
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manager Notification Log / Feed */}
        <div className='mt-6 rounded-xl border border-border bg-surface-subtle p-5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Bell className='size-4 text-primary' />
              <h3 className='text-sm font-bold text-foreground'>
                Thông báo gửi đến Quản lý phòng ban
              </h3>
            </div>
            <span className='text-xs text-muted-foreground'>
              Tổng số thông báo đã gửi: <strong className='text-foreground'>{notificationLogs.length}</strong>
            </span>
          </div>
          <p className='mt-1 text-xs text-muted-foreground'>
            Thông báo nhắc nhở được tự động chuyển đến tài khoản Quản lý phụ trách phòng ban tương ứng khi quá hạn quy định.
          </p>

          <div className='mt-4 space-y-3'>
            {notificationLogs.length === 0 ? (
              <p className='py-6 text-center text-xs text-muted-foreground italic'>
                Chưa có thông báo nhắc nào được gửi đi. Bấm "Chạy quét kiểm thử nhắc hạn" để kiểm tra.
              </p>
            ) : (
              notificationLogs.map((log) => (
                <div
                  className='rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs transition'
                  key={log.id}
                >
                  <div className='flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-2'>
                    <div className='flex items-center gap-2'>
                      <span className='rounded bg-amber-500/20 px-1.5 py-0.5 font-bold text-amber-800 dark:text-amber-300'>
                        GỬI TỚI QUẢN LÝ
                      </span>
                      <strong className='text-foreground'>{log.recipientName}</strong>
                      <span className='text-muted-foreground'>({log.recipientEmail})</span>
                      <span className='text-muted-foreground'>• {log.departmentName}</span>
                    </div>
                    <span className='font-mono text-muted-foreground'>{log.sentAt}</span>
                  </div>
                  <p className='mt-2.5 text-foreground leading-relaxed'>
                    {log.message}
                  </p>
                  <div className='mt-2 flex items-center justify-between text-[0.7rem] text-muted-foreground pt-1 border-t border-amber-500/10'>
                    <span>Mã yêu cầu: <strong className='text-foreground'>{log.requestId}</strong> | Nhân viên gửi: {log.employeeName}</span>
                    <span className='font-semibold text-emerald-600 dark:text-emerald-400'>
                      ✓ Đã gửi qua Email & Chuông thông báo Manager
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          aria-labelledby='confirm-save-title'
          aria-modal='true'
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
          role='dialog'
        >
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <div className='flex items-center gap-3 text-primary'>
              <div className='rounded-xl bg-primary/10 p-2.5'>
                <BellRing className='size-6' />
              </div>
              <h3 className='text-lg font-bold text-foreground' id='confirm-save-title'>
                Xác nhận thay đổi thời hạn nhắc Manager
              </h3>
            </div>

            <p className='mt-3 text-sm text-muted-foreground leading-relaxed'>
              Bạn đang cập nhật thời hạn gửi thông báo tự động cho Quản lý các phòng ban khi yêu cầu của nhân viên chưa được xử lý.
            </p>

            <div className='mt-4 rounded-xl border border-border bg-surface-subtle p-3.5 text-xs space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Giá trị hiện tại:</span>
                <span className='font-bold text-foreground'>
                  {activePolicy.noticeDays} ngày ({activePolicy.noticeDays * 24} giờ)
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Giá trị mới sau khi lưu:</span>
                <span className='font-bold text-primary text-sm'>
                  {parsedDays} ngày ({slaHours} giờ liên tục)
                </span>
              </div>
              <div className='flex items-center justify-between border-t border-border/60 pt-2'>
                <span className='text-muted-foreground'>Đối tượng nhận thông báo:</span>
                <span className='font-semibold text-foreground'>Chỉ Manager phòng ban</span>
              </div>
            </div>

            <p className='mt-3 text-xs text-muted-foreground italic'>
              * Lưu ý: Yêu cầu vào hàng chờ Manager sau thời điểm này sẽ áp dụng mốc mới; các yêu cầu đang chờ giữ mốc hạn đã tính trước đó.
            </p>

            <div className='mt-6 flex justify-end gap-3'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setShowConfirmModal(false)}
                type='button'
              >
                Hủy
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90'
                onClick={handleConfirmSave}
                type='button'
              >
                Xác nhận áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
