import { ArrowLeft, CheckCircle2, MessageSquare, X, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MOCK_TEAM_REQUESTS, type TeamRequestItem } from '../manager-data'
import { handleManagerDialogKeyDown } from '../manager-dialog-keyboard'
import { ManagerIdentityMark } from '../manager-identity-mark'
import type { ManagerTabKey } from '../manager-nav'

interface ManagerRequestApprovalViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
  requestId?: string
}

export function ManagerRequestApprovalView({
  formatCurrency,
  onSelectTab,
  requestId = 'req-01'
}: ManagerRequestApprovalViewProps) {
  const { t } = useTranslation('dashboard')

  const request = MOCK_TEAM_REQUESTS.find((r) => r.id === requestId) || MOCK_TEAM_REQUESTS[0]

  const [status, setStatus] = useState<TeamRequestItem['status']>(request.status)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [clarifyModalOpen, setClarifyModalOpen] = useState(false)
  const [clarifyMsg, setClarifyMsg] = useState('')

  const handleApprove = () => {
    setStatus('APPROVED')
    setSuccessMsg(t('manager.approval.approveSuccessMsg'))
  }

  const handleConfirmReject = () => {
    setStatus('REJECTED')
    setRejectModalOpen(false)
    setSuccessMsg(t('manager.approval.rejectSuccessMsg'))
  }

  const handleConfirmClarify = () => {
    setClarifyModalOpen(false)
    setSuccessMsg(t('manager.approval.clarifySuccessMsg'))
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <button
            aria-label={t('manager.approval.backToRequests')}
            className='inline-flex items-center justify-center rounded-xl border border-border bg-surface p-2 text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground'
            onClick={() => onSelectTab('team-requests')}
            type='button'
          >
            <ArrowLeft className='size-5' />
          </button>
          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
                {t('manager.approval.title')}
              </h1>
              <span className='rounded px-2 py-0.5 font-mono text-xs font-bold bg-primary-soft text-primary'>
                {request.code}
              </span>
            </div>
            <p className='mt-0.5 text-xs text-muted-foreground'>{t('manager.approval.subtitle')}</p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div
          role='status'
          className='flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-4 text-xs font-medium text-success shadow-xs'
        >
          <CheckCircle2 className='size-5 shrink-0' />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Request info & Action panel */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Left Column: Details */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Main Info Card */}
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-5'>
            <div className='flex items-center gap-3 border-b border-border pb-4'>
              <ManagerIdentityMark className='size-12 rounded-2xl text-base' name={request.saasName} />
              <div>
                <h2 className='text-base font-bold text-foreground'>{request.saasName}</h2>
                <p className='text-xs text-muted-foreground'>{request.plan}</p>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs'>
              <div className='rounded-xl border border-border bg-surface-subtle/50 p-3.5 space-y-1'>
                <span className='text-muted-foreground'>{t('manager.approval.labelRequester')}</span>
                <p className='font-bold text-foreground'>{request.requesterName}</p>
                <p className='text-[11px] text-muted-foreground'>{request.requesterJob}</p>
              </div>

              <div className='rounded-xl border border-border bg-surface-subtle/50 p-3.5 space-y-1'>
                <span className='text-muted-foreground'>{t('manager.approval.labelEstimatedCost')}</span>
                <p className='font-extrabold text-foreground text-sm'>{formatCurrency(request.estimatedMonthlyCost)}</p>
                <p className='text-[11px] text-muted-foreground'>{t('manager.approval.perMonth')}</p>
              </div>

              <div className='rounded-xl border border-border bg-surface-subtle/50 p-3.5 space-y-1'>
                <span className='text-muted-foreground'>{t('manager.approval.labelType')}</span>
                <p className='font-bold text-foreground'>
                  {request.type === 'NEW_ACCESS'
                    ? t('manager.requests.typeNewAccess')
                    : request.type === 'CHANGE_PLAN'
                      ? t('manager.requests.typeChangePlan')
                      : t('manager.requests.typeRenewal')}
                </p>
                <p className='text-[11px] text-muted-foreground'>{request.submittedDate}</p>
              </div>

              <div className='rounded-xl border border-border bg-surface-subtle/50 p-3.5 space-y-1'>
                <span className='text-muted-foreground'>{t('manager.approval.labelUrgency')}</span>
                <p className='font-bold text-foreground'>
                  {request.urgency === 'HIGH'
                    ? t('manager.requests.urgencyHigh')
                    : request.urgency === 'MEDIUM'
                      ? t('manager.requests.urgencyMedium')
                      : t('manager.requests.urgencyLow')}
                </p>
                <p className='text-[11px] text-muted-foreground'>
                  {t('manager.approval.slaRemaining', { hours: request.slaHours })}
                </p>
              </div>
            </div>

            <div className='space-y-2 pt-2 border-t border-border'>
              <h3 className='text-xs font-bold text-foreground'>{t('manager.approval.justificationTitle')}</h3>
              <p className='rounded-xl border border-border bg-surface-subtle/40 p-4 text-xs text-foreground/90 leading-relaxed'>
                "{request.justification}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Manager Decision Box */}
        <div className='space-y-6'>
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-5'>
            <div>
              <h2 className='text-sm font-bold text-foreground'>{t('manager.approval.decisionCardTitle')}</h2>
              <p className='text-xs text-muted-foreground mt-0.5'>{t('manager.approval.decisionCardSub')}</p>
            </div>

            <div className='space-y-2.5 pt-2 border-t border-border'>
              {status === 'APPROVED' ? (
                <div className='rounded-xl border border-success/30 bg-success/10 p-4 text-center space-y-2'>
                  <CheckCircle2 className='size-8 text-success mx-auto' />
                  <p className='font-bold text-xs text-success'>{t('manager.approval.badgeApproved')}</p>
                  <p className='text-[11px] text-muted-foreground'>{t('manager.approval.forwardedNotice')}</p>
                </div>
              ) : status === 'REJECTED' ? (
                <div className='rounded-xl border border-danger/30 bg-danger/10 p-4 text-center space-y-2'>
                  <XCircle className='size-8 text-danger mx-auto' />
                  <p className='font-bold text-xs text-danger'>{t('manager.approval.badgeRejected')}</p>
                  <p className='text-[11px] text-muted-foreground'>{t('manager.approval.rejectedNotice')}</p>
                </div>
              ) : (
                <div className='space-y-2.5'>
                  <button
                    className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
                    onClick={handleApprove}
                    type='button'
                  >
                    <CheckCircle2 className='size-4' />
                    <span>{t('manager.approval.actApprove')}</span>
                  </button>

                  <button
                    className='inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-xs font-semibold text-foreground transition hover:bg-surface-subtle'
                    onClick={() => setClarifyModalOpen(true)}
                    type='button'
                  >
                    <MessageSquare className='size-4 text-muted-foreground' />
                    <span>{t('manager.approval.actClarify')}</span>
                  </button>

                  <button
                    className='inline-flex w-full items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/10 py-2.5 text-xs font-bold text-danger transition hover:bg-danger hover:text-white'
                    onClick={() => setRejectModalOpen(true)}
                    type='button'
                  >
                    <XCircle className='size-4' />
                    <span>{t('manager.approval.actReject')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4'>
          <div
            aria-labelledby='manager-reject-title'
            aria-modal='true'
            className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-4'
            onKeyDown={(event) => handleManagerDialogKeyDown(event, () => setRejectModalOpen(false))}
            role='dialog'
          >
            <div className='flex items-center justify-between'>
              <h3 className='font-bold text-sm text-foreground' id='manager-reject-title'>
                {t('manager.approval.rejectModalTitle')}
              </h3>
              <button
                aria-label={t('manager.approval.cancelBtn')}
                className='text-muted-foreground hover:text-foreground'
                onClick={() => setRejectModalOpen(false)}
                type='button'
              >
                <X className='size-5' />
              </button>
            </div>
            <textarea
              aria-label={t('manager.approval.rejectPlaceholder')}
              autoFocus
              className='w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('manager.approval.rejectPlaceholder')}
              rows={3}
              value={rejectReason}
            />
            <div className='flex justify-end gap-2'>
              <button
                className='rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground'
                onClick={() => setRejectModalOpen(false)}
                type='button'
              >
                {t('manager.approval.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-danger px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-danger/90 disabled:opacity-50'
                disabled={!rejectReason.trim()}
                onClick={handleConfirmReject}
                type='button'
              >
                {t('manager.approval.confirmRejectBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clarify Modal */}
      {clarifyModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4'>
          <div
            aria-labelledby='manager-clarify-title'
            aria-modal='true'
            className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-4'
            onKeyDown={(event) => handleManagerDialogKeyDown(event, () => setClarifyModalOpen(false))}
            role='dialog'
          >
            <div className='flex items-center justify-between'>
              <h3 className='font-bold text-sm text-foreground' id='manager-clarify-title'>
                {t('manager.approval.clarifyModalTitle')}
              </h3>
              <button
                aria-label={t('manager.approval.cancelBtn')}
                className='text-muted-foreground hover:text-foreground'
                onClick={() => setClarifyModalOpen(false)}
                type='button'
              >
                <X className='size-5' />
              </button>
            </div>
            <textarea
              aria-label={t('manager.approval.clarifyPlaceholder')}
              autoFocus
              className='w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setClarifyMsg(e.target.value)}
              placeholder={t('manager.approval.clarifyPlaceholder')}
              rows={3}
              value={clarifyMsg}
            />
            <div className='flex justify-end gap-2'>
              <button
                className='rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground'
                onClick={() => setClarifyModalOpen(false)}
                type='button'
              >
                {t('manager.approval.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50'
                disabled={!clarifyMsg.trim()}
                onClick={handleConfirmClarify}
                type='button'
              >
                {t('manager.approval.confirmClarifyBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
