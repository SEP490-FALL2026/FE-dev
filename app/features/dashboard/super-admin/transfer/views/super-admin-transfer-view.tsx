import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Lock,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  XCircle
} from 'lucide-react'
import { useState } from 'react'
import { Dialog, Notice, PageHeader, Panel, PanelTitle, Pill } from '../../../dashboard-ui'
import { type SuccessorCandidate, successorCandidates } from '../../super-admin-data'

export function SuperAdminTransferView() {
  const [candidates] = useState<SuccessorCandidate[]>(successorCandidates)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    successorCandidates.find((c) => c.isEligible)?.id || ''
  )
  const [password, setPassword] = useState('')
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [transferCompleted, setTransferCompleted] = useState(false)
  const [transferError, setTransferError] = useState<string | null>(null)

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId)

  const handleStartTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    setTransferError(null)

    if (!selectedCandidate) {
      setTransferError('Vui lòng chọn nhân sự kế nhiệm.')
      return
    }

    if (!selectedCandidate.isEligible) {
      setTransferError(`Nhân sự ${selectedCandidate.name} không đủ điều kiện kế nhiệm do đang nắm giữ vai trò quản trị khác.`)
      return
    }

    if (!password) {
      setTransferError('Vui lòng nhập mật khẩu xác nhận của bạn.')
      return
    }

    setConfirmModalOpen(true)
  }

  const handleConfirmTransfer = () => {
    setConfirmModalOpen(false)
    setTransferCompleted(true)
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        code='Bàn giao vai trò'
        subtitle='Chuyển giao quyền hạn quản trị hệ thống cho nhân sự kế nhiệm đủ điều kiện.'
        title='Chuyển giao Vai trò Quản trị Hệ thống'
      />

      {/* Irreversible Action Warning */}
      <div className='flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-warning'>
        <AlertTriangle className='mt-0.5 size-5 shrink-0' />
        <div className='text-xs'>
          <h2 className='font-bold text-foreground'>Lưu ý quan trọng trước khi chuyển giao vai trò</h2>
          <p className='mt-1 text-muted-foreground'>
            Hệ thống duy trì <strong>đúng 01 Quản trị hệ thống (Super Admin)</strong>. Khi hoàn tất chuyển giao, tài khoản hiện tại sẽ được thu hồi quyền quản trị và chuyển sang cho người kế nhiệm. Thao tác này <strong>không thể tự hoàn tác</strong>.
          </p>
        </div>
      </div>

      {transferCompleted ? (
        <Panel className='border-success/40 bg-success/5 text-center py-10'>
          <span className='mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success'>
            <CheckCircle2 className='size-8' />
          </span>
          <h2 className='mt-4 text-xl font-bold text-foreground'>Chuyển giao Vai trò Thành công!</h2>
          <p className='mt-2 max-w-md mx-auto text-xs text-muted-foreground'>
            Đã chuyển giao vai trò Quản trị hệ thống cho <strong>{selectedCandidate?.name}</strong> thành công. Toàn bộ thông tin đã được ghi nhận vào nhật ký kiểm toán hệ thống.
          </p>
          <div className='mt-6'>
            <a
              className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90'
              href='/login'
            >
              Đăng xuất & Đăng nhập lại
            </a>
          </div>
        </Panel>
      ) : (
        <form onSubmit={handleStartTransfer} className='space-y-6'>
          {transferError && (
            <div className='flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs font-semibold text-danger'>
              <XCircle className='size-4 shrink-0' />
              <span>{transferError}</span>
            </div>
          )}

          {/* Candidate Selection List */}
          <Panel>
            <PanelTitle
              hint='Người kế nhiệm phải có tài khoản đang hoạt động và không đồng thời nắm giữ các vai trò quản trị khác'
              title='1. Chọn Nhân sự Kế nhiệm đủ điều kiện'
            />

            <div className='mt-4 space-y-3'>
              {candidates.map((candidate) => {
                const isSelected = candidate.id === selectedCandidateId
                return (
                  <label
                    className={`flex cursor-pointer items-start justify-between rounded-xl border p-4 transition ${
                      isSelected
                        ? 'border-primary bg-primary-soft/30 shadow-sm'
                        : 'border-border bg-surface hover:border-border/80'
                    } ${!candidate.isEligible ? 'opacity-70' : ''}`}
                    key={candidate.id}
                  >
                    <div className='flex items-start gap-3'>
                      <input
                        checked={isSelected}
                        className='mt-1 text-primary focus:ring-primary'
                        disabled={!candidate.isEligible}
                        name='candidate'
                        onChange={() => setSelectedCandidateId(candidate.id)}
                        type='radio'
                      />
                      <div>
                        <div className='flex items-center gap-2'>
                          <span className='font-bold text-foreground'>{candidate.name}</span>
                          <span className='font-mono text-xs text-muted-foreground'>
                            ({candidate.employeeCode})
                          </span>
                          {candidate.isEligible ? (
                            <Pill tone='success'>Đủ điều kiện SoD</Pill>
                          ) : (
                            <Pill tone='danger'>Không đủ điều kiện</Pill>
                          )}
                        </div>
                        <p className='mt-0.5 text-xs text-muted-foreground'>
                          {candidate.position} · {candidate.department} · {candidate.email}
                        </p>
                        {candidate.ineligibleReason && (
                          <p className='mt-1 text-xs font-semibold text-danger'>
                            {candidate.ineligibleReason}
                          </p>
                        )}
                      </div>
                    </div>

                    {candidate.isEligible && isSelected && (
                      <span className='grid size-6 place-items-center rounded-full bg-primary text-primary-foreground'>
                        <CheckCircle2 className='size-4' />
                      </span>
                    )}
                  </label>
                )
              })}
            </div>
          </Panel>

          {/* Password confirmation */}
          <Panel>
            <PanelTitle
              hint='Nhập lại mật khẩu đăng nhập hiện tại để ký xác nhận ủy quyền bàn giao'
              title='2. Xác thực Mật khẩu Quản trị hiện tại'
            />

            <div className='mt-4 max-w-md'>
              <label className='block text-xs font-bold text-foreground'>
                Mật khẩu của bạn (Minh Anh)
              </label>
              <div className='relative mt-1'>
                <Lock className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                <input
                  className='w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Nhập mật khẩu hiện tại để xác thực...'
                  type='password'
                  value={password}
                />
              </div>
            </div>
          </Panel>

          {/* Action button */}
          <div className='flex justify-end pt-2'>
            <button
              className='inline-flex items-center gap-2 rounded-xl bg-warning px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-warning/90 disabled:opacity-50'
              disabled={!selectedCandidate?.isEligible}
              type='submit'
            >
              <RotateCcw className='size-4' />
              Tiến hành Chuyển giao Vai trò
            </button>
          </div>
        </form>
      )}

      {/* Confirmation Dialog */}
      {confirmModalOpen && selectedCandidate && (
        <Dialog
          hint='Giao dịch chuyển giao sẽ thực hiện thu hồi quyền của bạn và cấp quyền cho người mới ngay lập tức.'
          onClose={() => setConfirmModalOpen(false)}
          title='Xác nhận Bàn giao Quyền Quản trị Hệ thống'
        >
          <div className='space-y-4 text-xs'>
            <div className='rounded-xl border border-warning/30 bg-warning/10 p-4 text-warning'>
              <p className='font-bold text-foreground'>Bạn chắc chắn muốn chuyển giao?</p>
              <p className='mt-1 text-muted-foreground'>
                Vai trò Super Admin sẽ được chuyển giao sang cho <strong>{selectedCandidate.name} ({selectedCandidate.employeeCode})</strong>. Tài khoản của bạn sẽ không còn quyền quản trị hệ thống.
              </p>
            </div>

            <div className='flex justify-end gap-2 pt-2'>
              <button
                className='rounded-xl border border-border px-4 py-2 font-bold text-foreground hover:bg-surface-subtle'
                onClick={() => setConfirmModalOpen(false)}
                type='button'
              >
                Hủy bỏ
              </button>
              <button
                className='rounded-xl bg-danger px-4 py-2 font-bold text-white hover:bg-danger/90'
                onClick={handleConfirmTransfer}
                type='button'
              >
                Xác nhận & Hoàn tất Chuyển giao
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  )
}
