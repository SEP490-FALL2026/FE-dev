import { BellRing } from 'lucide-react'
import type { ReminderPolicy } from '../../super-admin-data'

export interface ReminderConfirmModalProps {
  showConfirmModal: boolean
  setShowConfirmModal: (show: boolean) => void
  activePolicy: ReminderPolicy
  parsedDays: number
  slaHours: number
  handleConfirmSave: () => void
}

export function ReminderConfirmModal({
  showConfirmModal,
  setShowConfirmModal,
  activePolicy,
  parsedDays,
  slaHours,
  handleConfirmSave
}: ReminderConfirmModalProps) {
  if (!showConfirmModal) return null

  return (
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
  )
}
