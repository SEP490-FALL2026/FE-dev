import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Play
} from 'lucide-react'
import type { PendingManagerRequestSample, ReminderPolicy } from '../../super-admin-data'

export interface NotificationLog {
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

export interface ReminderSimulationPanelProps {
  requests: PendingManagerRequestSample[]
  activePolicy: ReminderPolicy
  lastRunTime: string | null
  notificationLogs: NotificationLog[]
  handleRunSimulation: () => void
  handleManagerAction: (
    requestId: string,
    action: 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED'
  ) => void
}

export function ReminderSimulationPanel({
  requests,
  activePolicy,
  lastRunTime,
  notificationLogs,
  handleRunSimulation,
  handleManagerAction
}: ReminderSimulationPanelProps) {
  return (
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
                <p className='mt-2.5 text-foreground leading-relaxed'>{log.message}</p>
                <div className='mt-2 flex items-center justify-between text-[0.7rem] text-muted-foreground pt-1 border-t border-amber-500/10'>
                  <span>
                    Mã yêu cầu: <strong className='text-foreground'>{log.requestId}</strong> | Nhân viên gửi: {log.employeeName}
                  </span>
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
  )
}
