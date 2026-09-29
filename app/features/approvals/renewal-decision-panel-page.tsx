import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router'
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  RefreshCw,
  TrendingDown,
  X,
  XCircle,
  Zap
} from 'lucide-react'
import { MOCK_APPROVAL_TASKS } from './approval-queue-page'

export function RenewalDecisionPanelPage() {
  const { t } = useTranslation(['approvals', 'finance', 'common'])
  const { id } = useParams()
  const navigate = useNavigate()

  const task = MOCK_APPROVAL_TASKS.find((t) => t.id === id && t.taskType === 'RENEWAL') || MOCK_APPROVAL_TASKS[1]

  const [downsizeModalOpen, setDownsizeModalOpen] = useState(false)
  const [newSeatCount, setNewSeatCount] = useState<number>(35)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)

  const currentSeats = task.seatCount || 50
  const costPerSeat = task.amount / currentSeats
  const wasteStats = {
    unassignedSeats: 10,
    inactiveUsers: 5,
    openWasteCount: 15
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  const handleRenewAsIs = () => {
    setActionSuccessMsg(t('approvals:panel.renewAsIsSuccessMsg'))
    setTimeout(() => {
      navigate('/approvals/queue')
    }, 2500)
  }

  const handleDownsizeConfirm = () => {
    const savedAmount = (currentSeats - newSeatCount) * costPerSeat
    setDownsizeModalOpen(false)
    setActionSuccessMsg(
      t('approvals:panel.downsizeSuccessMsg', {
        seats: newSeatCount,
        amount: formatCurrency(savedAmount)
      })
    )
    setTimeout(() => {
      navigate('/approvals/queue')
    }, 2500)
  }

  const handleCancelConfirm = () => {
    setCancelModalOpen(false)
    setActionSuccessMsg(t('approvals:panel.cancelSuccessMsg'))
    setTimeout(() => {
      navigate('/approvals/queue')
    }, 2500)
  }

  const calculatedSavings = Math.max(0, (currentSeats - newSeatCount) * costPerSeat)

  return (
    <div className='mx-auto max-w-5xl space-y-6'>
      {/* Top Header Navigation */}
      <div className='flex items-center justify-between border-b border-border pb-4'>
        <div className='flex items-center gap-3'>
          <Link
            to='/approvals/queue'
            className='flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-foreground'
          >
            <ArrowLeft className='h-4 w-4' />
          </Link>
          <div>
            <div className='flex items-center gap-2'>
              <span className='font-mono text-xs font-bold text-primary'>{task.code}</span>
              <span className='rounded-md bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning border border-warning/20'>
                {t('approvals:queue.types.RENEWAL')}
              </span>
            </div>
            <h1 className='text-xl font-bold tracking-tight text-foreground sm:text-2xl'>
              {t('approvals:panel.renewalTitle')}
            </h1>
          </div>
        </div>

        {/* Cancellation Deadline Highlight Card */}
        <div className='flex items-center gap-2 rounded-xl bg-danger/10 border border-danger/40 px-4 py-2 text-xs font-bold text-danger'>
          <Calendar className='h-4 w-4' />
          <span>
            {t('approvals:panel.cancellationLandmark', {
              date: task.cancellationDeadline || '2026-10-05'
            })}
          </span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className='rounded-xl border border-success/40 bg-success/10 p-4 text-sm font-medium text-success flex items-center gap-3 shadow-xs'>
          <CheckCircle2 className='h-5 w-5 shrink-0' />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Waste Recommendation Alert Banner (BR-26.2) */}
      <div className='rounded-xl border border-warning/50 bg-warning/10 p-5 shadow-xs space-y-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5 font-bold text-warning text-base'>
            <Zap className='h-5 w-5 shrink-0' />
            <span>{t('approvals:panel.wasteBannerTitle')}</span>
          </div>
          <span className='rounded-full bg-warning px-2.5 py-0.5 text-xs font-extrabold text-warning-foreground'>
            {t('approvals:panel.wasteRecommendationsCount', { count: wasteStats.openWasteCount })}
          </span>
        </div>
        <p className='text-sm text-foreground/90 leading-relaxed'>
          {t('approvals:panel.wasteBannerDesc', {
            unassigned: wasteStats.unassignedSeats,
            inactive: wasteStats.inactiveUsers
          })}
        </p>
      </div>

      {/* Detailed Info Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Left 2 Columns: Subscription Details & Usage Stats */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='rounded-xl border border-border bg-surface p-6 shadow-xs space-y-6'>
            <div className='flex items-start gap-4'>
              <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-3xl shadow-xs'>
                {task.saasLogo}
              </div>
              <div className='min-w-0 flex-1'>
                <h2 className='text-lg font-bold text-foreground'>{task.saasName}</h2>
                <p className='text-sm text-muted-foreground'>{task.title}</p>
              </div>
            </div>

            {/* Current Contract Details */}
            <div className='grid grid-cols-2 gap-4 rounded-xl bg-surface-subtle p-4 border border-border text-sm'>
              <div>
                <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  {t('approvals:panel.currentSeatsLabel')}
                </span>
                <p className='text-lg font-bold text-foreground mt-0.5'>
                  {t('approvals:panel.currentSeatsValue', { count: currentSeats })}
                </p>
              </div>
              <div>
                <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  {t('approvals:panel.renewalValueLabel')}
                </span>
                <p className='text-lg font-bold text-primary mt-0.5'>{formatCurrency(task.amount)}</p>
              </div>
              <div>
                <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  {t('approvals:panel.deadlineLabel')}
                </span>
                <p className='font-bold text-danger mt-0.5'>{task.cancellationDeadline || '2026-10-05'}</p>
              </div>
              <div>
                <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  {t('approvals:panel.costCenterLabel')}
                </span>
                <p className='font-semibold text-foreground mt-0.5'>{task.costCenter}</p>
              </div>
            </div>

            {/* Real Usage Evidence Breakdown */}
            <div className='space-y-3'>
              <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('approvals:panel.usageEvidenceHeader')}
              </h3>
              <div className='grid grid-cols-3 gap-3'>
                <div className='rounded-lg border border-border bg-background p-3 text-center'>
                  <span className='text-xs text-muted-foreground'>{t('approvals:panel.assignedLabel')}</span>
                  <p className='text-base font-extrabold text-foreground mt-1'>
                    {currentSeats - wasteStats.unassignedSeats} / {currentSeats}
                  </p>
                </div>
                <div className='rounded-lg border border-border bg-background p-3 text-center'>
                  <span className='text-xs text-muted-foreground'>{t('approvals:panel.unassignedLabel')}</span>
                  <p className='text-base font-extrabold text-warning mt-1'>
                    {t('approvals:panel.currentSeatsValue', { count: wasteStats.unassignedSeats })}
                  </p>
                </div>
                <div className='rounded-lg border border-border bg-background p-3 text-center'>
                  <span className='text-xs text-muted-foreground'>{t('approvals:panel.inactiveLabel')}</span>
                  <p className='text-base font-extrabold text-danger mt-1'>
                    {wasteStats.inactiveUsers} {t('approvals:panel.usersCount', { defaultValue: 'Users' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Renewal Decision Options */}
        <div className='space-y-6'>
          <div className='rounded-xl border border-border bg-surface p-6 shadow-xs space-y-4'>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('approvals:panel.actionsHeader')}
            </h3>

            <div className='space-y-3'>
              {/* Option 1: Renew As-Is */}
              <button
                onClick={handleRenewAsIs}
                className='w-full flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-left shadow-xs transition-all hover:border-primary hover:bg-surface-subtle group'
              >
                <div className='rounded-lg bg-primary-soft p-2 text-primary group-hover:scale-105 transition-transform'>
                  <RefreshCw className='h-5 w-5' />
                </div>
                <div>
                  <p className='font-bold text-sm text-foreground'>{t('approvals:panel.actions.renewAsIs')}</p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    {t('approvals:panel.renewAsIsDesc', { seats: currentSeats })}
                  </p>
                </div>
              </button>

              {/* Option 2: Downsize Seats */}
              <button
                onClick={() => setDownsizeModalOpen(true)}
                className='w-full flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/5 p-4 text-left shadow-xs transition-all hover:border-warning hover:bg-warning/10 group'
              >
                <div className='rounded-lg bg-warning/20 p-2 text-warning group-hover:scale-105 transition-transform'>
                  <TrendingDown className='h-5 w-5' />
                </div>
                <div>
                  <p className='font-bold text-sm text-warning'>{t('approvals:panel.actions.downsize')}</p>
                  <p className='text-xs text-muted-foreground mt-0.5'>{t('approvals:panel.downsizeDesc')}</p>
                </div>
              </button>

              {/* Option 3: Cancel Subscription */}
              <button
                onClick={() => setCancelModalOpen(true)}
                className='w-full flex items-start gap-3 rounded-xl border border-danger/40 bg-danger/5 p-4 text-left shadow-xs transition-all hover:border-danger hover:bg-danger/10 group'
              >
                <div className='rounded-lg bg-danger/20 p-2 text-danger group-hover:scale-105 transition-transform'>
                  <XCircle className='h-5 w-5' />
                </div>
                <div>
                  <p className='font-bold text-sm text-danger'>{t('approvals:panel.actions.cancel')}</p>
                  <p className='text-xs text-muted-foreground mt-0.5'>{t('approvals:panel.cancelDesc')}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Downsize Modal */}
      {downsizeModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-5'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold text-foreground'>{t('approvals:panel.renewalModal.downsizeTitle')}</h3>
              <button
                onClick={() => setDownsizeModalOpen(false)}
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='text-xs font-semibold text-foreground'>
                  {t('approvals:panel.downsizeSeatsLabel', { count: currentSeats })}
                </label>
                <input
                  type='number'
                  min={1}
                  max={currentSeats - 1}
                  value={newSeatCount}
                  onChange={(e) => setNewSeatCount(Number(e.target.value))}
                  className='mt-1 w-full rounded-lg border border-border bg-background p-3 text-base font-bold text-foreground focus:border-primary focus:outline-hidden'
                />
              </div>

              {/* Calculated Real Savings Display */}
              <div className='rounded-xl border border-success/40 bg-success/10 p-4 text-center space-y-1'>
                <span className='text-xs font-semibold uppercase tracking-wider text-success'>
                  {t('approvals:panel.renewalModal.savingsCalculated')}
                </span>
                <p className='text-2xl font-extrabold text-success'>{formatCurrency(calculatedSavings)}</p>
                <p className='text-[11px] text-muted-foreground'>
                  {t('approvals:panel.reducedSeatsNote', { count: currentSeats - newSeatCount })}
                </p>
              </div>
            </div>

            <div className='flex items-center justify-end gap-3 pt-2'>
              <button
                onClick={() => setDownsizeModalOpen(false)}
                className='rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-subtle'
              >
                {t('common:cancel')}
              </button>
              <button
                onClick={handleDownsizeConfirm}
                className='rounded-lg bg-warning px-4 py-2 text-xs font-bold text-warning-foreground hover:bg-warning/90'
              >
                {t('approvals:panel.renewalModal.confirmDecision')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold text-danger'>{t('approvals:panel.renewalModal.cancelTitle')}</h3>
              <button
                onClick={() => setCancelModalOpen(false)}
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='rounded-xl border border-danger/40 bg-danger/10 p-4 text-xs font-medium text-danger space-y-1'>
              <AlertTriangle className='h-5 w-5 mb-1' />
              <p>{t('approvals:panel.renewalModal.cancelWarning')}</p>
            </div>

            <div className='flex items-center justify-end gap-3 pt-2'>
              <button
                onClick={() => setCancelModalOpen(false)}
                className='rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-subtle'
              >
                {t('common:cancel')}
              </button>
              <button
                onClick={handleCancelConfirm}
                className='rounded-lg bg-danger px-4 py-2 text-xs font-bold text-white hover:bg-danger/90'
              >
                {t('approvals:panel.confirmCancelBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
