import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  X,
  XCircle
} from 'lucide-react'
import { MOCK_APPROVAL_TASKS } from './approval-queue-page'

export function ExpenseApprovalPanelPage() {
  const { t } = useTranslation(['approvals', 'finance', 'common'])
  const { id } = useParams()
  const navigate = useNavigate()

  const task = MOCK_APPROVAL_TASKS.find((t) => t.id === id) || MOCK_APPROVAL_TASKS[0]

  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [askFinanceModalOpen, setAskFinanceModalOpen] = useState(false)
  const [askFinanceNote, setAskFinanceNote] = useState('')
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)

  const budgetSnapshot = {
    period: 'Q3-2026',
    totalBudget: 500000000,
    actualSpend: 312000000,
    heldCommitments: 45000000,
    remainingBudget: 143000000,
    pendingApprovals: 68000000
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  const handleApprove = () => {
    setActionSuccessMsg(t('approvals:panel.approveSuccessMsg'))
    setTimeout(() => {
      navigate('/approvals/queue')
    }, 2500)
  }

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) return
    setRejectModalOpen(false)
    setActionSuccessMsg(t('approvals:panel.rejectSuccessMsg'))
    setTimeout(() => {
      navigate('/approvals/queue')
    }, 2500)
  }

  const handleAskFinanceConfirm = () => {
    setAskFinanceModalOpen(false)
    setActionSuccessMsg(t('approvals:panel.askFinanceSuccessMsg'))
  }

  return (
    <div className='mx-auto max-w-5xl space-y-6'>
      {/* Top Back Navigation & Header */}
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
              <span className='rounded-md bg-surface-subtle px-2 py-0.5 text-xs font-semibold text-muted-foreground border border-border'>
                {t(`approvals:queue.types.${task.taskType}`)}
              </span>
            </div>
            <h1 className='text-xl font-bold tracking-tight text-foreground sm:text-2xl'>
              {t('approvals:panel.expenseTitle')}
            </h1>
          </div>
        </div>

        {/* SLA Status Pill */}
        <div className='flex items-center gap-2 rounded-lg bg-surface border border-border px-3 py-1.5 text-xs'>
          <Clock className='h-4 w-4 text-warning' />
          <span className='font-semibold text-foreground'>
            {t('approvals:panel.slaFormat', {
              status:
                task.slaHoursRemaining > 0
                  ? t('approvals:panel.slaRemaining', { hours: task.slaHoursRemaining })
                  : t('approvals:panel.slaOverdue')
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

      {/* Segregation of Duties (SoD-7) Warning Banner */}
      {task.isSodConflict && (
        <div className='rounded-xl border border-info/50 bg-info/10 p-5 shadow-xs space-y-2'>
          <div className='flex items-center gap-2.5 font-bold text-info text-base'>
            <ShieldAlert className='h-5 w-5 shrink-0' />
            <span>{t('approvals:panel.sodWarningTitle')}</span>
          </div>
          <p className='text-sm text-foreground/90 leading-relaxed'>{t('approvals:panel.sodWarningDesc')}</p>
          <div className='rounded-lg bg-background/80 p-3 text-xs text-muted-foreground border border-info/20'>
            {t('approvals:panel.delegateInfo')}
          </div>
        </div>
      )}

      {/* Main Request Information & Budget Snapshot Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Left 2 columns: Detailed Request Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Request Header Card */}
          <div className='rounded-xl border border-border bg-surface p-6 shadow-xs space-y-6'>
            <div className='flex items-start gap-4'>
              <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-3xl shadow-xs'>
                {task.saasLogo}
              </div>
              <div className='min-w-0 flex-1'>
                <h2 className='text-lg font-bold text-foreground'>{task.title}</h2>
                <p className='text-sm text-muted-foreground mt-0.5'>
                  {t('approvals:panel.softwareLabel', { name: task.saasName })}
                </p>
              </div>
            </div>

            {/* Key Request Metadata */}
            <div className='grid grid-cols-2 gap-4 rounded-xl bg-surface-subtle p-4 border border-border text-sm'>
              <div>
                <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  {t('approvals:panel.requesterLabel')}
                </span>
                <p className='font-semibold text-foreground mt-0.5'>{task.requesterName}</p>
                <p className='text-xs text-muted-foreground'>{task.requesterRole}</p>
              </div>
              <div>
                <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  {t('approvals:panel.costCenterLabel')}
                </span>
                <p className='font-semibold text-foreground mt-0.5'>{task.costCenter}</p>
              </div>
              <div>
                <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  {t('approvals:panel.requestedAmountLabel')}
                </span>
                <p className='text-lg font-bold text-primary mt-0.5'>{formatCurrency(task.amount)}</p>
                {task.seatCount && (
                  <p className='text-xs text-muted-foreground'>
                    ({t('approvals:queue.paidSeatsFormat', { count: task.seatCount })})
                  </p>
                )}
              </div>
              <div>
                <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  {t('approvals:panel.requestDateLabel')}
                </span>
                <p className='font-medium text-foreground mt-0.5'>
                  {new Date(task.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Verification Status Badges */}
            <div className='space-y-3 pt-2'>
              <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('approvals:panel.verificationHeader')}
              </h3>
              <div className='flex flex-wrap items-center gap-3'>
                {/* Manager Verification */}
                <div className='flex items-center gap-2 rounded-lg bg-success/10 border border-success/30 px-3 py-2 text-xs font-semibold text-success'>
                  <CheckCircle2 className='h-4 w-4' />
                  <span>
                    {t('approvals:panel.managerStatus')} ({t('approvals:panel.managerVerifiedNote')})
                  </span>
                </div>

                {/* IT Risk Assessment */}
                {task.itRiskLevel && (
                  <div
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${
                      task.itRiskLevel === 'LOW'
                        ? 'bg-success/10 border-success/30 text-success'
                        : task.itRiskLevel === 'MEDIUM'
                          ? 'bg-warning/10 border-warning/30 text-warning'
                          : 'bg-danger/10 border-danger/30 text-danger'
                    }`}
                  >
                    <ShieldCheck className='h-4 w-4' />
                    <span>
                      {task.itRiskLevel === 'LOW'
                        ? t('approvals:panel.itRiskLow')
                        : task.itRiskLevel === 'MEDIUM'
                          ? t('approvals:panel.itRiskMedium')
                          : t('approvals:panel.itRiskHigh')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Budget Snapshot Card (FIN-05) */}
        <div className='space-y-6'>
          <div className='rounded-xl border border-border bg-surface p-6 shadow-xs space-y-5'>
            <div className='flex items-center justify-between border-b border-border pb-3'>
              <div className='flex items-center gap-2 font-bold text-foreground text-sm'>
                <PieChart className='h-4 w-4 text-primary' />
                <span>{t('approvals:panel.snapshotTitle')}</span>
              </div>
              <span className='rounded bg-primary-soft px-2 py-0.5 font-mono text-xs font-bold text-primary'>
                {budgetSnapshot.period}
              </span>
            </div>

            <div className='space-y-3.5 text-xs'>
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>{t('approvals:panel.periodBudgetLabel')}</span>
                <span className='font-semibold text-foreground'>{formatCurrency(budgetSnapshot.totalBudget)}</span>
              </div>

              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>{t('approvals:panel.actualSpendLabel')}</span>
                <span className='font-semibold text-foreground'>{formatCurrency(budgetSnapshot.actualSpend)}</span>
              </div>

              <div className='flex justify-between items-center text-warning'>
                <span className='font-medium'>{t('approvals:panel.heldCommitmentLabel')}</span>
                <span className='font-bold'>{formatCurrency(budgetSnapshot.heldCommitments)}</span>
              </div>

              <div className='h-px bg-border my-2' />

              <div className='flex justify-between items-center text-sm font-bold text-success'>
                <span>{t('approvals:panel.remainingBudgetLabel')}</span>
                <span>{formatCurrency(budgetSnapshot.remainingBudget)}</span>
              </div>

              <div className='flex justify-between items-center text-muted-foreground pt-1'>
                <span>{t('approvals:panel.pendingApprovalLabel')}</span>
                <span className='font-medium text-foreground'>{formatCurrency(budgetSnapshot.pendingApprovals)}</span>
              </div>
            </div>

            {/* Budget Indicator Bar */}
            <div className='space-y-1.5 pt-2'>
              <div className='flex justify-between text-[11px] font-medium text-muted-foreground'>
                <span>{t('approvals:panel.budgetUsageLabel')}</span>
                <span>
                  {Math.round(
                    ((budgetSnapshot.actualSpend + budgetSnapshot.heldCommitments) / budgetSnapshot.totalBudget) * 100
                  )}
                  %
                </span>
              </div>
              <div className='h-2.5 w-full rounded-full bg-surface-subtle overflow-hidden flex'>
                <div
                  className='bg-primary h-full'
                  style={{
                    width: `${(budgetSnapshot.actualSpend / budgetSnapshot.totalBudget) * 100}%`
                  }}
                />
                <div
                  className='bg-warning h-full'
                  style={{
                    width: `${(budgetSnapshot.heldCommitments / budgetSnapshot.totalBudget) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Decision Panel Card */}
          <div className='rounded-xl border border-border bg-surface p-6 shadow-xs space-y-4'>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('approvals:panel.actionsHeader')}
            </h3>

            {task.isSodConflict ? (
              <div className='rounded-lg bg-surface-subtle p-4 text-center space-y-2 border border-border'>
                <ShieldAlert className='mx-auto h-6 w-6 text-info' />
                <p className='text-xs font-semibold text-foreground'>{t('approvals:panel.sodLockedTitle')}</p>
                <p className='text-[11px] text-muted-foreground'>{t('approvals:panel.sodLockedDesc')}</p>
              </div>
            ) : (
              <div className='space-y-2.5'>
                {/* Approve Button */}
                <button
                  onClick={handleApprove}
                  className='w-full inline-flex items-center justify-center gap-2 rounded-lg bg-success px-4 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-success/90'
                >
                  <CheckCircle2 className='h-4 w-4' />
                  <span>{t('approvals:panel.actions.approve')}</span>
                </button>

                {/* Reject Button */}
                <button
                  onClick={() => setRejectModalOpen(true)}
                  className='w-full inline-flex items-center justify-center gap-2 rounded-lg border border-danger/40 bg-surface px-4 py-2.5 text-sm font-semibold text-danger shadow-xs transition-all hover:bg-danger/10'
                >
                  <XCircle className='h-4 w-4' />
                  <span>{t('approvals:panel.actions.reject')}</span>
                </button>

                {/* Ask Finance Button */}
                <button
                  onClick={() => setAskFinanceModalOpen(true)}
                  className='w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-medium text-foreground shadow-xs transition-all hover:bg-surface-subtle'
                >
                  <HelpCircle className='h-4 w-4 text-primary' />
                  <span>{t('approvals:panel.actions.askFinance')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold text-foreground'>{t('approvals:panel.rejectModal.title')}</h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-semibold text-foreground'>
                {t('approvals:panel.rejectModal.reasonLabel')}
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={t('approvals:panel.rejectModal.reasonPlaceholder')}
                rows={4}
                className='w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:border-danger focus:outline-hidden'
              />
            </div>

            <div className='flex items-center justify-end gap-3 pt-2'>
              <button
                onClick={() => setRejectModalOpen(false)}
                className='rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-subtle'
              >
                {t('approvals:panel.rejectModal.cancelBtn')}
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim()}
                className='rounded-lg bg-danger px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 hover:bg-danger/90'
              >
                {t('approvals:panel.rejectModal.confirmBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ask Finance Modal */}
      {askFinanceModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold text-foreground'>{t('approvals:panel.askFinanceModal.title')}</h3>
              <button
                onClick={() => setAskFinanceModalOpen(false)}
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <p className='text-xs text-muted-foreground leading-relaxed'>{t('approvals:panel.askFinanceModal.desc')}</p>

            <div className='space-y-2'>
              <textarea
                value={askFinanceNote}
                onChange={(e) => setAskFinanceNote(e.target.value)}
                placeholder={t('approvals:panel.askFinanceModal.notePlaceholder')}
                rows={3}
                className='w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-hidden'
              />
            </div>

            <div className='flex items-center justify-end gap-3 pt-2'>
              <button
                onClick={() => setAskFinanceModalOpen(false)}
                className='rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-subtle'
              >
                {t('approvals:panel.rejectModal.cancelBtn')}
              </button>
              <button
                onClick={handleAskFinanceConfirm}
                className='rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover'
              >
                {t('approvals:panel.askFinanceModal.sendBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
