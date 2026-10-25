import { useState } from 'react'
import {
  CheckCircle2,
  Info,
  RotateCcw,
  Save,
  ShieldCheck
} from 'lucide-react'
import {
  initialPendingRequests,
  initialReminderPolicy,
  type PendingManagerRequestSample,
  type ReminderPolicy
} from '../../super-admin-data'
import {
  ReminderSimulationPanel,
  type NotificationLog
} from '../components/reminder-simulation-panel'
import { ReminderConfirmModal } from '../components/reminder-confirm-modal'

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
    const days = parseInt(inputDays, 10)
    const now = new Date()
    const formattedDate = `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN')}`

    setActivePolicy({
      effectiveFrom: `Áp dụng ngay từ ${formattedDate}`,
      lastUpdated: `${formattedDate} bởi Minh Anh (Super Admin)`,
      noticeDays: days,
      recipientRole: 'MANAGER'
    })

    setShowConfirmModal(false)
    setToastMessage({
      text: `Đã cập nhật thời hạn nhắc Manager thành công: ${days} ngày (${days * 24} giờ)!`,
      type: 'success'
    })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleResetDefault = () => {
    setInputDays('2')
    setValidationError(null)
  }

  const handleRunSimulation = () => {
    const now = new Date()
    const timestampStr = `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN')}`
    setLastRunTime(timestampStr)

    const limitHours = activePolicy.noticeDays * 24
    let newNotificationsCount = 0

    const updatedRequests = requests.map((req) => {
      if (
        req.status === 'APPROVED' ||
        req.status === 'REJECTED' ||
        req.status === 'CLARIFICATION_REQUESTED'
      ) {
        return req
      }

      if (req.waitingHours >= limitHours) {
        const isAlreadyLogged = notificationLogs.some(
          (log) => log.requestId === req.id && !log.isDuplicateBlocked
        )

        if (!isAlreadyLogged) {
          newNotificationsCount++
          const newLog: NotificationLog = {
            departmentName: req.departmentName,
            employeeName: req.employeeName,
            id: `log-${Date.now()}-${req.id}`,
            message: `Yêu cầu cấp phần mềm [${req.softwareName}] từ nhân viên ${req.employeeName} đã chờ ${req.waitingHours} giờ vượt mốc ${limitHours} giờ SLA quy định. Vui lòng mở xét duyệt.`,
            recipientEmail: req.managerEmail,
            recipientName: req.managerName,
            recipientRole: 'Manager',
            requestId: req.id,
            sentAt: timestampStr,
            slaHours: limitHours,
            waitingHours: req.waitingHours
          }
          setNotificationLogs((prev) => [newLog, ...prev])
        }

        return {
          ...req,
          isOverdue: true,
          status: 'ALERT_SENT' as const
        }
      }

      return req
    })

    setRequests(updatedRequests)

    if (newNotificationsCount > 0) {
      setToastMessage({
        text: `Đã phát hiện và gửi thành công ${newNotificationsCount} thông báo nhắc quá hạn tới Quản lý phòng ban!`,
        type: 'success'
      })
    } else {
      setToastMessage({
        text: 'Kiểm tra hoàn tất: Không có yêu cầu mới nào vượt hạn cần gửi nhắc.',
        type: 'info'
      })
    }
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleManagerAction = (
    requestId: string,
    action: 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED'
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            isOverdue: false,
            status: action
          }
        }
        return r
      })
    )

    const actionText =
      action === 'APPROVED'
        ? 'phê duyệt'
        : action === 'REJECTED'
        ? 'từ chối'
        : 'yêu cầu bổ sung thông tin'

    setToastMessage({
      text: `Quản lý đã ${actionText} yêu cầu ${requestId}. Yêu cầu đã rời khỏi hàng chờ phê duyệt.`,
      type: 'info'
    })
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className='space-y-6'>
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-xl animate-[slideUp_0.3s_ease-out] ${
            toastMessage.type === 'success'
              ? 'border-emerald-500/40 bg-surface/95 text-emerald-600 dark:text-emerald-400'
              : toastMessage.type === 'error'
              ? 'border-rose-500/40 bg-surface/95 text-rose-600 dark:text-rose-400'
              : 'border-sky-500/40 bg-surface/95 text-sky-600 dark:text-sky-400'
          }`}
        >
          <CheckCircle2 className='size-5 shrink-0' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage.text}</span>
        </div>
      )}

      {/* Hero Explainer Header */}
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
                    max='30'
                    min='1'
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

      <ReminderSimulationPanel
        activePolicy={activePolicy}
        handleManagerAction={handleManagerAction}
        handleRunSimulation={handleRunSimulation}
        lastRunTime={lastRunTime}
        notificationLogs={notificationLogs}
        requests={requests}
      />

      <ReminderConfirmModal
        activePolicy={activePolicy}
        handleConfirmSave={handleConfirmSave}
        parsedDays={parsedDays}
        setShowConfirmModal={setShowConfirmModal}
        showConfirmModal={showConfirmModal}
        slaHours={slaHours}
      />
    </div>
  )
}
