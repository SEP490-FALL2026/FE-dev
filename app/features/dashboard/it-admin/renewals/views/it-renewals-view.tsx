import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileCheck,
  FileSignature,
  FileText,
  Info,
  Layers,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
  WalletCards,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { itRenewalProposals, type RenewalProposal } from '../../it-admin-data'
import type { ItAdminTabKey } from '../../it-admin-nav'
import {
  RenewalsChecklistModal,
  RenewalsProposalModal,
  RenewalsOutcomeModal,
} from '../components/renewals-modals'

type ItRenewalsViewProps = {
  formatCurrency?: (value: number) => string
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItRenewalsView({
  formatCurrency = (val) => `${val.toLocaleString('vi-VN')} ₫`,
  onSelectTab
}: ItRenewalsViewProps) {
  const { t } = useTranslation('dashboard')
  const [proposals, setProposals] = useState<RenewalProposal[]>(itRenewalProposals)
  const [selectedProposal, setSelectedProposal] = useState<RenewalProposal | null>(null)
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false)
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false)
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false)

  // Proposal modal form state
  const [proposalAction, setProposalAction] = useState<'renewAsIs' | 'reduceSeats' | 'cancel'>('reduceSeats')
  const [newSeatCount, setNewSeatCount] = useState<number>(45)
  const [proposalNotes, setProposalNotes] = useState('')
  const [vendorOutcome, setVendorOutcome] = useState<'accepted' | 'different' | 'rejected'>('accepted')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleOpenChecklist = (item: RenewalProposal) => {
    setSelectedProposal(item)
    setIsChecklistModalOpen(true)
  }

  const handleOpenProposalModal = (item: RenewalProposal) => {
    setSelectedProposal(item)
    setNewSeatCount(item.recommendedSeats)
    setProposalNotes(
      `Đề xuất giảm ${item.currentSeats - item.recommendedSeats} seat lãng phí (seat chưa gán G1 và không sử dụng G3), duy trì ${item.recommendedSeats} seat cho đội ngũ chủ lực.`
    )
    setIsProposalModalOpen(true)
  }

  const handleOpenOutcomeModal = (item: RenewalProposal) => {
    setSelectedProposal(item)
    setIsOutcomeModalOpen(true)
  }

  const handleSubmitProposal = () => {
    if (!selectedProposal) return

    setProposals((prev) =>
      prev.map((p) =>
        p.id === selectedProposal.id
          ? {
              ...p,
              recommendedSeats: proposalAction === 'renewAsIs' ? p.currentSeats : proposalAction === 'cancel' ? 0 : newSeatCount,
              status: 'submitted'
            }
          : p
      )
    )

    setToastMessage(`Đã lập đề xuất gia hạn ${selectedProposal.app} và chuyển Người duyệt chi quyết định!`)
    setIsProposalModalOpen(false)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleConfirmVendorOutcome = () => {
    if (!selectedProposal) return

    setProposals((prev) =>
      prev.map((p) =>
        p.id === selectedProposal.id
          ? {
              ...p,
              status: 'executed'
            }
          : p
      )
    )

    setToastMessage(`Đã ghi nhận kết quả đàm phán hợp đồng ${selectedProposal.app} với vendor thành công!`)
    setIsOutcomeModalOpen(false)
    setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <div className='space-y-6'>
      {/* Toast */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-success/30 bg-success/15 px-5 py-3.5 shadow-xl backdrop-blur-md animate-[slideUp_0.3s_ease-out]'>
          <CheckCircle2 className='size-5 text-success' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
          <span className='size-2 rounded-full bg-primary' />
          Chu kỳ gia hạn & Điều khoản hợp đồng
        </div>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>
          {t('itAdmin.renewals.title')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          {t('itAdmin.renewals.subtitle')}
        </p>
      </div>

      {/* Notice Deadline Urgency Alerts Banner */}
      <div className='rounded-2xl border border-warning/30 bg-warning/10 p-5 shadow-sm'>
        <div className='flex items-start gap-3'>
          <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-warning/20 text-warning'>
            <CalendarClock className='size-5' />
          </span>
          <div className='flex-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-sm font-bold text-foreground'>
                Cảnh báo hạn chót báo hủy (Notice Deadline Window)
              </h2>
              <span className='rounded-md border border-warning/40 bg-warning/20 px-2 py-0.5 text-[0.65rem] font-bold text-warning'>
                T-15 & T-7 Cảnh báo sớm
              </span>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              Hệ thống quét mốc cảnh báo tính từ hạn chót báo hủy (Notice Deadline), không tính từ ngày kết thúc hợp đồng.
              Nếu bỏ lỡ hạn chót báo hủy, hợp đồng thuê bao sẽ tự động gia hạn thêm một chu kỳ theo điều khoản nhà cung cấp.
            </p>
          </div>
        </div>
      </div>

      {/* Renewal Proposals Cards */}
      <div className='space-y-4'>
        <h2 className='text-lg font-bold text-foreground'>Danh sách hợp đồng thuê bao trong chu kỳ rà soát gia hạn</h2>

        <div className='grid gap-6 lg:grid-cols-2'>
          {proposals.map((item) => {
            const isT7 = item.status === 'warningT7'
            const isExecuted = item.status === 'executed'
            const isSubmitted = item.status === 'submitted'

            return (
              <div
                className='flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:shadow-md'
                key={item.id}
              >
                <div>
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='font-mono text-xs font-bold text-primary'>{item.id}</span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold ${
                            isT7
                              ? 'border-danger/30 bg-danger/15 text-danger animate-pulse'
                              : isExecuted
                                ? 'border-success/30 bg-success/15 text-success'
                                : isSubmitted
                                  ? 'border-info/30 bg-info/15 text-info'
                                  : 'border-warning/30 bg-warning/15 text-warning'
                          }`}
                        >
                          {isExecuted
                            ? 'Đã thực hiện xong'
                            : isSubmitted
                              ? 'Đã gửi duyệt chi'
                              : isT7
                                ? `Khẩn cấp: Còn ${item.daysToDeadline} ngày (T-7)`
                                : `Cảnh báo: Còn ${item.daysToDeadline} ngày (T-15)`}
                        </span>
                      </div>
                      <h3 className='mt-1 text-base font-bold text-foreground'>{item.app}</h3>
                      <p className='text-xs text-muted-foreground font-mono'>Nhà cung cấp: {item.vendor}</p>
                    </div>

                    <span className='rounded-xl border border-border bg-surface-subtle p-2 text-right'>
                      <span className='block text-[0.65rem] text-muted-foreground'>Hạn chót báo hủy:</span>
                      <span className='font-mono text-xs font-bold text-danger'>{item.noticeDeadline}</span>
                    </span>
                  </div>

                  {/* Seat Counts & Cost Grid */}
                  <div className='mt-4 grid grid-cols-2 gap-3 rounded-xl border border-border bg-background/50 p-3 text-xs'>
                    <div>
                      <span className='text-muted-foreground'>Số lượng hiện tại:</span>
                      <p className='text-sm font-bold text-foreground font-mono'>{item.currentSeats} seats</p>
                      <span className='text-[0.7rem] text-muted-foreground'>{formatCurrency(item.currentAnnualCost)}/năm</span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Đề xuất tối ưu mới:</span>
                      <p className='text-sm font-bold text-primary font-mono'>{item.recommendedSeats} seats</p>
                      <span className='text-[0.7rem] text-primary font-bold'>{formatCurrency(item.newAnnualCost)}/năm</span>
                    </div>
                  </div>

                  {/* Dual Savings Counter (FR-4.15) */}
                  <div className='mt-3 flex items-center justify-between rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-xs'>
                    <div>
                      <span className='text-[0.7rem] font-bold text-success'>Tiết kiệm tại kỳ gia hạn:</span>
                      <p className='font-mono font-bold text-success text-sm'>{formatCurrency(item.renewalSavings)}/năm</p>
                    </div>
                    <div className='text-right'>
                      <span className='text-[0.7rem] text-muted-foreground'>Tiết kiệm ngay:</span>
                      <p className='font-mono font-bold text-foreground'>{formatCurrency(item.immediateSavings)}</p>
                    </div>
                  </div>

                  {/* Waste Findings & Owner opinion */}
                  <div className='mt-3 space-y-1.5 text-xs text-muted-foreground'>
                    <p className='flex items-center gap-1.5'>
                      <Sparkles className='size-3.5 text-warning' />
                      <span>
                        Lãng phí phát hiện: <strong className='text-foreground'>{item.wasteBreakdown.unassignedG1}</strong> seat mua chưa gán (G1) +{' '}
                        <strong className='text-foreground'>{item.wasteBreakdown.unusedG3}</strong> seat không dùng &gt;60 ngày (G3).
                      </span>
                    </p>
                    <p className='flex items-start gap-1.5'>
                      <UserCheck className='size-3.5 text-info mt-0.5' />
                      <span>
                        <strong className='text-foreground'>{item.businessOwner}:</strong> "{item.businessOwnerOpinion}"
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className='mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4'>
                  <button
                    className='inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
                    onClick={() => handleOpenChecklist(item)}
                    type='button'
                  >
                    <ShieldCheck className='size-3.5 text-primary' />
                    <span>Rà soát 6 điều khoản</span>
                  </button>

                  {!isExecuted && !isSubmitted && (
                    <button
                      className='inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
                      onClick={() => handleOpenProposalModal(item)}
                      type='button'
                    >
                      <FileSignature className='size-3.5' />
                      <span>Lập đề xuất</span>
                    </button>
                  )}

                  {isSubmitted && !isExecuted && (
                    <button
                      className='inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-success px-3 py-2 text-xs font-bold text-success-foreground shadow-sm hover:bg-success/90 transition'
                      onClick={() => handleOpenOutcomeModal(item)}
                      type='button'
                    >
                      <CheckCircle2 className='size-3.5' />
                      <span>Nhập kết quả với Vendor</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal 1: 6-Point Vendor Terms Checklist Review */}
      <RenewalsChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
        proposal={selectedProposal}
      />

      {/* Modal 2: Prepare Proposal (ITA-56) */}
      <RenewalsProposalModal
        formatCurrency={formatCurrency}
        isOpen={isProposalModalOpen}
        newSeatCount={newSeatCount}
        onClose={() => setIsProposalModalOpen(false)}
        onSubmit={handleSubmitProposal}
        proposal={selectedProposal}
        proposalAction={proposalAction}
        proposalNotes={proposalNotes}
        setNewSeatCount={setNewSeatCount}
        setProposalAction={setProposalAction}
        setProposalNotes={setProposalNotes}
      />

      {/* Modal 3: Enter Vendor Outcome */}
      <RenewalsOutcomeModal
        isOpen={isOutcomeModalOpen}
        onClose={() => setIsOutcomeModalOpen(false)}
        onConfirm={handleConfirmVendorOutcome}
        proposal={selectedProposal}
        setVendorOutcome={setVendorOutcome}
        vendorOutcome={vendorOutcome}
      />
    </div>
  )
}
