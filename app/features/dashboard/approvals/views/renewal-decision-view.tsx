import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, CheckCircle2, RefreshCw, TrendingDown, X, XCircle, Zap } from 'lucide-react'

import { MOCK_APPROVAL_TASKS } from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'

interface RenewalDecisionViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
  taskId?: string
}

export function RenewalDecisionView({ formatCurrency, onSelectTab, taskId }: RenewalDecisionViewProps) {
  const { t } = useTranslation('dashboard')

  const task =
    MOCK_APPROVAL_TASKS.find((item) => item.id === taskId && item.taskType === 'RENEWAL') || MOCK_APPROVAL_TASKS[1]

  const [downsizeModalOpen, setDownsizeModalOpen] = useState(false)
  const [newSeatCount, setNewSeatCount] = useState<number>(35)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)

  const currentSeats = task.seatCount || 50
  const costPerSeat = task.amount / currentSeats
  const wasteStats = {
    inactiveUsers: 5,
    openWasteCount: 15,
    unassignedSeats: 10
  }

  const handleRenewAsIs = () => {
    setActionSuccessMsg(t('approvals.panel.renewAsIsSuccessMsg'))
    setTimeout(() => {
      onSelectTab('queue')
    }, 2000)
  }

  const handleDownsizeConfirm = () => {
    const savedAmount = (currentSeats - newSeatCount) * costPerSeat
    setDownsizeModalOpen(false)
    setActionSuccessMsg(
      t('approvals.panel.downsizeSuccessMsg', {
        amount: formatCurrency(savedAmount),
        seats: newSeatCount
      })
    )
    setTimeout(() => {
      onSelectTab('queue')
    }, 2000)
  }

  const handleCancelConfirm = () => {
    setCancelModalOpen(false)
    setActionSuccessMsg(t('approvals.panel.cancelSuccessMsg'))
    setTimeout(() => {
      onSelectTab('queue')
    }, 2000)
  }

  const calculatedSavings = Math.max(0, (currentSeats - newSeatCount) * costPerSeat)

  return (
    <div className='mx-auto max-w-5xl space-y-6'>
      {/* Top Header */}
      <div className='flex items-center justify-between border-b border-border pb-4'>
        <div className='flex items-center gap-3'>
          <button
            className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
            onClick={() => onSelectTab('queue')}
            type='button'
          >
            <ArrowLeft className='size-4' />
            <span>{t('approvals.panel.backToQueue')}</span>
          </button>
          <span className='text-border'>|</span>
          <span className='font-mono text-xs font-bold text-primary'>{task.code}</span>
        </div>
        <span className='rounded-full bg-warning/10 px-3 py-1 text-xs font-bold text-warning border border-warning/20'>
          {t('approvals.queue.types.RENEWAL')}
        </span>
      </div>

      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {t('approvals.panel.renewalTitle')}
        </h1>
        <p className='mt-1 text-xs text-muted-foreground'>
          {t('approvals.panel.cancellationLandmark', {
            date: task.cancellationDeadline || '2026-10-05',
            renewalDate: '2026-11-05'
          })}
        </p>
      </div>

      {actionSuccessMsg && (
        <div className='rounded-2xl border border-success/30 bg-success/10 p-4 text-xs font-bold text-success flex items-center gap-3 shadow-xs'>
          <CheckCircle2 className='size-5 shrink-0' />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Waste Insights Banner */}
      <div className='rounded-2xl border border-warning/30 bg-warning/10 p-5 shadow-xs'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5 font-bold text-warning'>
            <Zap className='size-5' />
            <span>{t('approvals.panel.wasteBannerTitle')}</span>
          </div>
          <span className='rounded-full bg-warning/20 px-2.5 py-0.5 text-xs font-bold text-warning'>
            {t('approvals.panel.wasteRecommendationsCount', { count: wasteStats.openWasteCount })}
          </span>
        </div>
        <p className='mt-2 text-xs text-foreground/90 leading-relaxed'>
          {t('approvals.panel.wasteBannerDesc', {
            inactive: wasteStats.inactiveUsers,
            unassigned: wasteStats.unassignedSeats
          })}
        </p>
      </div>

      {/* Details & Decision Panel Grid */}
      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left Column: Contract & Telemetry Info */}
        <div className='space-y-6 lg:col-span-6'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
            <div className='flex items-center gap-4 border-b border-border pb-4'>
              <div className='flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-2xl shadow-xs'>
                {task.saasLogo}
              </div>
              <div>
                <h2 className='text-sm font-bold text-foreground'>{task.saasName}</h2>
                <p className='text-xs text-muted-foreground'>{task.title}</p>
              </div>
            </div>

            <div className='divide-y divide-border text-xs'>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('approvals.panel.currentSeatsLabel')}</span>
                <span className='font-bold text-foreground'>
                  {t('approvals.panel.currentSeatsValue', { count: currentSeats })}
                </span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('approvals.panel.renewalValueLabel')}</span>
                <span className='text-base font-extrabold text-foreground'>{formatCurrency(task.amount)}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('approvals.panel.deadlineLabel')}</span>
                <span className='font-bold text-danger'>{task.cancellationDeadline}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('approvals.panel.costCenterLabel')}</span>
                <span className='font-mono font-bold text-foreground'>{task.costCenter}</span>
              </div>
            </div>

            <div className='pt-2'>
              <h3 className='text-xs font-bold text-foreground mb-3'>{t('approvals.panel.usageEvidenceHeader')}</h3>
              <div className='grid grid-cols-3 gap-3 text-center'>
                <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                  <span className='text-[11px] text-muted-foreground'>{t('approvals.panel.assignedLabel')}</span>
                  <p className='mt-1 text-base font-bold text-foreground'>
                    {currentSeats - wasteStats.unassignedSeats}
                  </p>
                </div>
                <div className='rounded-xl border border-warning/30 bg-warning/5 p-3'>
                  <span className='text-[11px] text-muted-foreground'>{t('approvals.panel.unassignedLabel')}</span>
                  <p className='mt-1 text-base font-bold text-warning'>{wasteStats.unassignedSeats}</p>
                </div>
                <div className='rounded-xl border border-danger/30 bg-danger/5 p-3'>
                  <span className='text-[11px] text-muted-foreground'>{t('approvals.panel.inactiveLabel')}</span>
                  <p className='mt-1 text-base font-bold text-danger'>{wasteStats.inactiveUsers}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Decision Pathways */}
        <div className='space-y-4 lg:col-span-6'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
            <h2 className='text-sm font-bold text-foreground'>{t('approvals.panel.actionsHeader')}</h2>

            {/* Option 1: Renew As-Is */}
            <button
              className='flex w-full items-start gap-4 rounded-2xl border border-border bg-surface p-4 text-left transition hover:border-primary/50 hover:bg-surface-subtle/50'
              onClick={handleRenewAsIs}
              type='button'
            >
              <div className='rounded-xl bg-primary-soft p-2.5 text-primary'>
                <RefreshCw className='size-5' />
              </div>
              <div className='flex-1'>
                <p className='font-bold text-xs text-foreground'>{t('approvals.panel.actions.renewAsIs')}</p>
                <p className='text-[11px] text-muted-foreground mt-0.5'>
                  {t('approvals.panel.renewAsIsDesc', { seats: currentSeats })}
                </p>
              </div>
            </button>

            {/* Option 2: Downsize Seats */}
            <button
              className='flex w-full items-start gap-4 rounded-2xl border border-warning/40 bg-warning/5 p-4 text-left transition hover:border-warning hover:bg-warning/10'
              onClick={() => setDownsizeModalOpen(true)}
              type='button'
            >
              <div className='rounded-xl bg-warning/15 p-2.5 text-warning'>
                <TrendingDown className='size-5' />
              </div>
              <div className='flex-1'>
                <p className='font-bold text-xs text-warning'>{t('approvals.panel.actions.downsize')}</p>
                <p className='text-[11px] text-muted-foreground mt-0.5'>{t('approvals.panel.downsizeDesc')}</p>
              </div>
            </button>

            {/* Option 3: Terminate */}
            <button
              className='flex w-full items-start gap-4 rounded-2xl border border-danger/40 bg-danger/5 p-4 text-left transition hover:border-danger hover:bg-danger/10'
              onClick={() => setCancelModalOpen(true)}
              type='button'
            >
              <div className='rounded-xl bg-danger/15 p-2.5 text-danger'>
                <XCircle className='size-5' />
              </div>
              <div className='flex-1'>
                <p className='font-bold text-xs text-danger'>{t('approvals.panel.actions.cancel')}</p>
                <p className='text-[11px] text-muted-foreground mt-0.5'>{t('approvals.panel.cancelDesc')}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Downsize Modal */}
      {downsizeModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs'>
          <div className='w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-bold text-foreground'>{t('approvals.panel.renewalModal.downsizeTitle')}</h3>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setDownsizeModalOpen(false)}
                type='button'
              >
                <X className='size-4' />
              </button>
            </div>

            <div>
              <label className='block text-xs font-semibold text-muted-foreground mb-2'>
                {t('approvals.panel.renewalModal.downsizeSeatsLabel', { count: currentSeats })}
              </label>
              <input
                className='h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                max={currentSeats - 1}
                min={1}
                onChange={(e) => setNewSeatCount(Number(e.target.value))}
                type='number'
                value={newSeatCount}
              />
            </div>

            <div className='rounded-2xl border border-success/30 bg-success/10 p-4 text-xs'>
              <span className='font-semibold text-muted-foreground'>
                {t('approvals.panel.renewalModal.savingsCalculated')}
              </span>
              <p className='mt-1 text-xl font-extrabold text-success'>{formatCurrency(calculatedSavings)}</p>
              <p className='mt-1 text-[11px] text-muted-foreground'>
                {t('approvals.panel.renewalModal.reducedSeatsNote', { count: currentSeats - newSeatCount })}
              </p>
            </div>

            <div className='flex justify-end gap-2'>
              <button
                className='rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
                onClick={() => setDownsizeModalOpen(false)}
                type='button'
              >
                {t('approvals.panel.renewalModal.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
                onClick={handleDownsizeConfirm}
                type='button'
              >
                {t('approvals.panel.renewalModal.confirmDecision')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Contract Modal */}
      {cancelModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs'>
          <div className='w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-bold text-danger'>{t('approvals.panel.renewalModal.cancelTitle')}</h3>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setCancelModalOpen(false)}
                type='button'
              >
                <X className='size-4' />
              </button>
            </div>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              {t('approvals.panel.renewalModal.cancelWarning')}
            </p>
            <div className='flex justify-end gap-2'>
              <button
                className='rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
                onClick={() => setCancelModalOpen(false)}
                type='button'
              >
                {t('approvals.panel.renewalModal.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-danger px-4 py-1.5 text-xs font-bold text-white transition hover:bg-danger/90'
                onClick={handleCancelConfirm}
                type='button'
              >
                {t('approvals.panel.confirmCancelBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
