import React from 'react'
import { CheckCircle2, Send, X } from 'lucide-react'
import type { RenewalProposal } from '../../it-admin-data'

export interface RenewalsChecklistModalProps {
  isOpen: boolean
  onClose: () => void
  proposal: RenewalProposal | null
}

export const RenewalsChecklistModal: React.FC<RenewalsChecklistModalProps> = ({
  isOpen,
  onClose,
  proposal,
}) => {
  if (!isOpen || !proposal) return null

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
      <div className='relative w-full max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-2xl max-h-[90vh] overflow-y-auto'>
        <button
          className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
          onClick={onClose}
          type='button'
        >
          <X className='size-5' />
        </button>

        <div className='flex items-center gap-2'>
          <span className='rounded-full border border-primary/20 bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary'>
            Rà soát điều khoản
          </span>
          <span className='text-xs font-bold text-muted-foreground'>Bộ 6 điều khoản nhà cung cấp trước kỳ gia hạn</span>
        </div>

        <h2 className='mt-2 text-xl font-bold text-foreground'>{proposal.app}</h2>
        <p className='text-xs text-muted-foreground'>
          Rà soát các cam kết bảo mật, quyền sở hữu dữ liệu và điều khoản hủy/gia hạn hợp đồng
        </p>

        <div className='mt-5 space-y-3'>
          {[
            {
              id: 'accountSharing',
              item: proposal.termsChecklist.accountSharing,
              title: '1. Chính sách chia sẻ tài khoản (Account Sharing)',
            },
            {
              id: 'commercialUse',
              item: proposal.termsChecklist.commercialUse,
              title: '2. Quyền sử dụng thương mại (Commercial Use Rights)',
            },
            {
              id: 'dataAndIpRights',
              item: proposal.termsChecklist.dataAndIpRights,
              title: '3. Sở hữu trí tuệ & Bảo vệ dữ liệu (Data & IP Ownership)',
            },
            {
              id: 'dataResidency',
              item: proposal.termsChecklist.dataResidency,
              title: '4. Nơi lưu trữ dữ liệu & Bảo mật (Data Residency)',
            },
            {
              id: 'deviceLimits',
              item: proposal.termsChecklist.deviceLimits,
              title: '5. Giới hạn thiết bị / Phiên làm việc (Device / Session Limits)',
            },
            {
              id: 'cancellationNotice',
              item: proposal.termsChecklist.cancellationNotice,
              title: '6. Thời hạn báo hủy & Tự gia hạn (Cancellation Notice & Auto-Renew)',
            },
          ].map(({ id, item, title }) => (
            <div className='rounded-xl border border-border bg-surface-subtle p-3.5 text-xs' key={id}>
              <div className='flex items-center justify-between'>
                <span className='font-bold text-foreground'>{title}</span>
                <span className='inline-flex items-center gap-1 text-[0.7rem] font-bold text-success'>
                  <CheckCircle2 className='size-3.5 text-success' />
                  Đạt chuẩn
                </span>
              </div>
              <p className='mt-1 text-muted-foreground'>{item.note}</p>
            </div>
          ))}
        </div>

        <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
          <button
            className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
            onClick={onClose}
            type='button'
          >
            Đã rà soát xong
          </button>
        </div>
      </div>
    </div>
  )
}

export interface RenewalsProposalModalProps {
  isOpen: boolean
  onClose: () => void
  proposal: RenewalProposal | null
  proposalAction: 'renewAsIs' | 'reduceSeats' | 'cancel'
  setProposalAction: (action: 'renewAsIs' | 'reduceSeats' | 'cancel') => void
  newSeatCount: number
  setNewSeatCount: (count: number) => void
  proposalNotes: string
  setProposalNotes: (notes: string) => void
  onSubmit: () => void
  formatCurrency: (value: number) => string
}

export const RenewalsProposalModal: React.FC<RenewalsProposalModalProps> = ({
  isOpen,
  onClose,
  proposal,
  proposalAction,
  setProposalAction,
  newSeatCount,
  setNewSeatCount,
  proposalNotes,
  setProposalNotes,
  onSubmit,
  formatCurrency,
}) => {
  if (!isOpen || !proposal) return null

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
      <div className='relative w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
        <button
          className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
          onClick={onClose}
          type='button'
        >
          <X className='size-5' />
        </button>

        <div className='flex items-center gap-2'>
          <span className='rounded-full border border-primary/20 bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary'>
            Đề xuất gia hạn
          </span>
          <span className='text-xs font-bold text-muted-foreground'>Lập đề xuất gia hạn chuyển Người duyệt chi</span>
        </div>

        <h2 className='mt-2 text-xl font-bold text-foreground'>{proposal.app}</h2>

        <div className='mt-4 space-y-3'>
          <label className='block text-xs font-bold text-muted-foreground uppercase'>Phương án gia hạn:</label>

          <div className='space-y-2'>
            {[
              {
                desc: 'Duy trì nguyên số lượng hiện tại, tiếp tục gia hạn hợp đồng năm.',
                id: 'renewAsIs' as const,
                title: `Gia hạn nguyên số lượng (${proposal.currentSeats} seats)`,
              },
              {
                desc: 'Cắt giảm các seat không sử dụng (G1, G3) để tối ưu hóa chi phí ngân sách.',
                id: 'reduceSeats' as const,
                title: 'Giảm số lượng mua (Khuyến nghị IT)',
              },
              {
                desc: 'Báo hủy hoàn toàn hợp đồng với nhà cung cấp trước hạn chót.',
                id: 'cancel' as const,
                title: 'Hủy thuê bao (Không tái ký)',
              },
            ].map((opt) => (
              <label
                className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                  proposalAction === opt.id
                    ? 'border-primary bg-primary-soft/30'
                    : 'border-border bg-surface hover:bg-surface-subtle'
                }`}
                key={opt.id}
              >
                <input
                  checked={proposalAction === opt.id}
                  className='mt-1'
                  name='proposalAction'
                  onChange={() => setProposalAction(opt.id)}
                  type='radio'
                />
                <div>
                  <p className='text-xs font-bold text-foreground'>{opt.title}</p>
                  <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {proposalAction === 'reduceSeats' && (
            <div className='rounded-xl border border-border bg-surface-subtle p-3'>
              <label className='block text-xs font-bold text-foreground mb-1'>Số lượng seat mới sau khi giảm:</label>
              <input
                className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono font-bold focus:border-primary focus:outline-none'
                max={proposal.currentSeats}
                min={1}
                onChange={(e) => setNewSeatCount(Number(e.target.value))}
                type='number'
                value={newSeatCount}
              />
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                Giảm từ {proposal.currentSeats} xuống {newSeatCount} seat. Tiết kiệm dự kiến:{' '}
                <strong className='text-success font-mono'>
                  {formatCurrency(
                    ((proposal.currentSeats - newSeatCount) * proposal.currentAnnualCost) / proposal.currentSeats
                  )}
                  /năm
                </strong>
              </p>
            </div>
          )}

          <div>
            <label className='block text-xs font-bold text-foreground mb-1'>Căn cứ và giải trình đề xuất:</label>
            <textarea
              className='w-full rounded-xl border border-border bg-background p-3 text-xs focus:border-primary focus:outline-none'
              onChange={(e) => setProposalNotes(e.target.value)}
              rows={3}
              value={proposalNotes}
            />
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
          <button
            className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
            onClick={onClose}
            type='button'
          >
            Hủy bỏ
          </button>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
            onClick={onSubmit}
            type='button'
          >
            <Send className='size-3.5' />
            <span>Chuyển Người duyệt chi quyết định</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export interface RenewalsOutcomeModalProps {
  isOpen: boolean
  onClose: () => void
  proposal: RenewalProposal | null
  vendorOutcome: 'accepted' | 'different' | 'rejected'
  setVendorOutcome: (outcome: 'accepted' | 'different' | 'rejected') => void
  onConfirm: () => void
}

export const RenewalsOutcomeModal: React.FC<RenewalsOutcomeModalProps> = ({
  isOpen,
  onClose,
  proposal,
  vendorOutcome,
  setVendorOutcome,
  onConfirm,
}) => {
  if (!isOpen || !proposal) return null

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
      <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
        <button
          className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
          onClick={onClose}
          type='button'
        >
          <X className='size-5' />
        </button>

        <div className='flex items-center gap-2'>
          <span className='rounded-full border border-primary/20 bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary'>
            Kết quả đàm phán
          </span>
          <span className='text-xs font-bold text-muted-foreground'>Ghi nhận kết quả làm việc với Nhà cung cấp</span>
        </div>

        <h2 className='mt-2 text-xl font-bold text-foreground'>{proposal.app}</h2>
        <p className='text-xs text-muted-foreground'>
          IT Admin đã thực hiện thủ tục với nhà cung cấp ngoài hệ thống. Nhập kết quả phản hồi của Vendor:
        </p>

        <div className='mt-4 space-y-2'>
          {[
            {
              desc: 'Vendor chấp thuận gia hạn theo đúng số lượng đề xuất.',
              id: 'accepted' as const,
              title: 'Nhà cung cấp xác nhận đúng quyết định',
            },
            {
              desc: 'Vendor đưa ra giá hoặc số lượng khác, mở tác vụ theo dõi điều chỉnh.',
              id: 'different' as const,
              title: 'Kết quả đàm phán khác (Mở theo dõi)',
            },
            {
              desc: 'Vendor từ chối đơn đặt hàng hoặc chính sách giá thay đổi.',
              id: 'rejected' as const,
              title: 'Nhà cung cấp từ chối',
            },
          ].map((res) => (
            <label
              className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                vendorOutcome === res.id
                  ? 'border-primary bg-primary-soft/30'
                  : 'border-border bg-surface hover:bg-surface-subtle'
              }`}
              key={res.id}
            >
              <input
                checked={vendorOutcome === res.id}
                className='mt-1'
                name='vendorOutcome'
                onChange={() => setVendorOutcome(res.id)}
                type='radio'
              />
              <div>
                <p className='text-xs font-bold text-foreground'>{res.title}</p>
                <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>{res.desc}</p>
              </div>
            </label>
          ))}
        </div>

        <div className='mt-6 flex items-center justify-end gap-3 border-t border-border pt-4'>
          <button
            className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
            onClick={onClose}
            type='button'
          >
            Đóng
          </button>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl bg-success px-4 py-2 text-xs font-bold text-success-foreground shadow-sm hover:bg-success/90 transition'
            onClick={onConfirm}
            type='button'
          >
            <CheckCircle2 className='size-3.5' />
            <span>Xác nhận kết quả đàm phán</span>
          </button>
        </div>
      </div>
    </div>
  )
}
