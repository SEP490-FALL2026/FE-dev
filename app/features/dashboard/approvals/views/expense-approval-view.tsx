import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, CheckCircle2, Clock, HelpCircle, PieChart, ShieldAlert, X, XCircle } from 'lucide-react'

import { approverBudgetSnapshot, MOCK_APPROVAL_TASKS } from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'

interface ExpenseApprovalViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
  taskId?: string
}

export function ExpenseApprovalView({ formatCurrency, onSelectTab, taskId }: ExpenseApprovalViewProps) {
  const { t } = useTranslation('dashboard')

  const task = MOCK_APPROVAL_TASKS.find((item) => item.id === taskId) || MOCK_APPROVAL_TASKS[0]

  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [askFinanceModalOpen, setAskFinanceModalOpen] = useState(false)
  const [askFinanceNote, setAskFinanceNote] = useState('')
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)

  const handleApprove = () => {
    setActionSuccessMsg(t('approvals.panel.approveSuccessMsg'))
    setTimeout(() => {
      onSelectTab('queue')
    }, 2000)
  }

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) return
    setRejectModalOpen(false)
    setActionSuccessMsg(t('approvals.panel.rejectSuccessMsg'))
    setTimeout(() => {
      onSelectTab('queue')
    }, 2000)
  }

  const handleAskFinanceConfirm = () => {
    setAskFinanceModalOpen(false)
    setActionSuccessMsg(t('approvals.panel.askFinanceSuccessMsg'))
  }

  return (
    <div className='mx-auto max-w-5xl space-y-6'>
      {/* Top Back Navigation & Header */}
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

        <div className='flex items-center gap-2'>
          <span className='rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary'>
            {t(`approvals.queue.types.${task.taskType}`)}
          </span>
        </div>
      </div>

      {/* Main Title & SLA Status */}
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('approvals.panel.expenseTitle')}
          </h1>
          <p className='mt-1 text-xs font-medium text-muted-foreground'>{task.title}</p>
        </div>
        <div className='flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold'>
          <Clock className='size-4 text-warning' />
          <span>
            {t('approvals.panel.slaFormat', {
              status:
                task.slaHoursRemaining > 0
                  ? t('approvals.panel.slaRemaining', { hours: task.slaHoursRemaining })
                  : t('approvals.panel.slaOverdue')
            })}
          </span>
        </div>
      </div>

      {/* Action Success Alert */}
      {actionSuccessMsg && (
        <div className='rounded-2xl border border-success/30 bg-success/10 p-4 text-xs font-bold text-success flex items-center gap-3 shadow-xs'>
          <CheckCircle2 className='size-5 shrink-0' />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* SoD Conflict Warning Banner */}
      {task.isSodConflict && (
        <div className='rounded-2xl border border-warning/30 bg-warning/10 p-4 text-xs shadow-xs'>
          <div className='flex items-center gap-2 font-bold text-warning'>
            <ShieldAlert className='size-4' />
            <span>{t('approvals.panel.sodWarningTitle')}</span>
          </div>
          <p className='mt-1 text-foreground/90 leading-relaxed'>{t('approvals.panel.sodWarningDesc')}</p>
          <p className='mt-1 text-muted-foreground'>{t('approvals.panel.delegateInfo')}</p>
        </div>
      )}

      {/* Details & Budget Grid */}
      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left: Request Specification */}
        <div className='space-y-6 lg:col-span-7'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
            <div className='flex items-center gap-4 border-b border-border pb-4'>
              <div className='flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-2xl shadow-xs'>
                {task.saasLogo}
              </div>
              <div>
                <h2 className='text-sm font-bold text-foreground'>
                  {t('approvals.panel.softwareLabel', { name: task.saasName })}
                </h2>
                <p className='text-xs text-muted-foreground'>{task.title}</p>
              </div>
            </div>

            <div className='divide-y divide-border text-xs'>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('approvals.panel.requesterLabel')}</span>
                <span className='font-bold text-foreground'>
                  {task.requesterName} ({task.requesterRole})
                </span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('approvals.panel.costCenterLabel')}</span>
                <span className='font-mono font-bold text-foreground'>{task.costCenter}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('approvals.panel.requestedAmountLabel')}</span>
                <div className='text-right'>
                  <span className='text-base font-extrabold text-foreground'>{formatCurrency(task.amount)}</span>
                  {task.seatCount && (
                    <span className='ml-1 text-muted-foreground'>
                      ({t('approvals.queue.paidSeatsFormat', { count: task.seatCount })})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Approval Action Buttons */}
            <div className='pt-4 border-t border-border flex flex-wrap items-center justify-end gap-3'>
              <button
                className='inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setAskFinanceModalOpen(true)}
                type='button'
              >
                <HelpCircle className='size-3.5' />
                <span>{t('approvals.panel.actAskFinance')}</span>
              </button>
              <button
                className='inline-flex items-center gap-1.5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-bold text-danger transition hover:bg-danger/20'
                onClick={() => setRejectModalOpen(true)}
                type='button'
              >
                <XCircle className='size-3.5' />
                <span>{t('approvals.panel.actReject')}</span>
              </button>
              <button
                className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
                onClick={handleApprove}
                type='button'
              >
                <CheckCircle2 className='size-3.5' />
                <span>{t('approvals.panel.actApprove')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Budget Impact Card */}
        <div className='space-y-6 lg:col-span-5'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
            <div className='flex items-center gap-2'>
              <PieChart className='size-4 text-primary' />
              <h2 className='text-sm font-bold text-foreground'>{t('approvals.panel.budgetImpactTitle')}</h2>
            </div>

            <div className='divide-y divide-border text-xs'>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('approvals.panel.budgetTotal')}</span>
                <span className='font-bold text-foreground'>{formatCurrency(approverBudgetSnapshot.totalBudget)}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('approvals.panel.budgetActual')}</span>
                <span className='font-bold text-foreground'>{formatCurrency(approverBudgetSnapshot.actualSpend)}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('approvals.panel.budgetHeld')}</span>
                <span className='font-bold text-warning'>{formatCurrency(approverBudgetSnapshot.heldCommitments)}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('approvals.panel.budgetRemaining')}</span>
                <span className='font-bold text-success'>{formatCurrency(approverBudgetSnapshot.remainingBudget)}</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className='space-y-1.5 pt-2'>
              <div className='flex justify-between text-[11px] font-bold'>
                <span className='text-muted-foreground'>{t('approvals.dashboard.costCenters.colUtilization')}</span>
                <span className='text-primary'>
                  {Math.round(
                    ((approverBudgetSnapshot.actualSpend + approverBudgetSnapshot.heldCommitments) /
                      approverBudgetSnapshot.totalBudget) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className='h-2 w-full overflow-hidden rounded-full bg-surface-subtle border border-border'>
                <div
                  className='h-full bg-primary rounded-full'
                  style={{
                    width: `${Math.min(
                      100,
                      ((approverBudgetSnapshot.actualSpend + approverBudgetSnapshot.heldCommitments) /
                        approverBudgetSnapshot.totalBudget) *
                        100
                    )}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Reason Modal */}
      {rejectModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs'>
          <div className='w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-bold text-foreground'>{t('approvals.panel.rejectModalTitle')}</h3>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setRejectModalOpen(false)}
                type='button'
              >
                <X className='size-4' />
              </button>
            </div>
            <textarea
              className='w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('approvals.panel.rejectReasonPlaceholder')}
              rows={3}
              value={rejectReason}
            />
            <div className='flex justify-end gap-2'>
              <button
                className='rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
                onClick={() => setRejectModalOpen(false)}
                type='button'
              >
                {t('approvals.panel.renewalModal.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-danger px-4 py-1.5 text-xs font-bold text-white transition hover:bg-danger/90'
                onClick={handleRejectConfirm}
                type='button'
              >
                {t('approvals.panel.confirmRejectBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ask Finance Modal */}
      {askFinanceModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs'>
          <div className='w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-bold text-foreground'>{t('approvals.panel.askFinanceModalTitle')}</h3>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setAskFinanceModalOpen(false)}
                type='button'
              >
                <X className='size-4' />
              </button>
            </div>
            <textarea
              className='w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setAskFinanceNote(e.target.value)}
              placeholder={t('approvals.panel.askFinancePlaceholder')}
              rows={3}
              value={askFinanceNote}
            />
            <div className='flex justify-end gap-2'>
              <button
                className='rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
                onClick={() => setAskFinanceModalOpen(false)}
                type='button'
              >
                {t('approvals.panel.renewalModal.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
                onClick={handleAskFinanceConfirm}
                type='button'
              >
                {t('approvals.panel.confirmAskFinanceBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
