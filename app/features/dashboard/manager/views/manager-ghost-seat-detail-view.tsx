import { ArrowLeft, CheckCircle2, RotateCcw, ShieldAlert, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type GhostSeatItem, MOCK_GHOST_SEATS } from '../manager-data'
import { handleManagerDialogKeyDown } from '../manager-dialog-keyboard'
import { ManagerIdentityMark } from '../manager-identity-mark'
import type { ManagerTabKey } from '../manager-nav'

interface ManagerGhostSeatDetailViewProps {
  formatCurrency: (value: number) => string
  ghostId?: string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerGhostSeatDetailView({
  formatCurrency,
  ghostId = 'ghost-01',
  onSelectTab
}: ManagerGhostSeatDetailViewProps) {
  const { t } = useTranslation('dashboard')

  const seat = MOCK_GHOST_SEATS.find((g) => g.id === ghostId) || MOCK_GHOST_SEATS[0]

  const [currentStatus, setCurrentStatus] = useState<GhostSeatItem['status']>(seat.status)
  const [keepModalOpen, setKeepModalOpen] = useState(false)
  const [keepReason, setKeepReason] = useState('')
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  const handleRevoke = () => {
    setCurrentStatus('REVOKED')
    setActionNotice(t('manager.ghostDetail.revokeSuccessMsg', { software: seat.softwareName }))
  }

  const handleConfirmKeep = () => {
    setCurrentStatus('KEPT')
    setKeepModalOpen(false)
    setActionNotice(t('manager.ghostDetail.keepSuccessMsg', { software: seat.softwareName }))
  }

  return (
    <div className='max-w-4xl space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <button
          aria-label={t('manager.ghostDetail.backToList')}
          className='inline-flex items-center justify-center rounded-xl border border-border bg-surface p-2 text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground'
          onClick={() => onSelectTab('ghost-seat-review')}
          type='button'
        >
          <ArrowLeft className='size-5' />
        </button>
        <div>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              {t('manager.ghostDetail.title')}
            </h1>
            <span
              className={`rounded px-2 py-0.5 text-xs font-mono font-bold ${
                seat.flagRule === 'G3' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
              }`}
            >
              {seat.flagRule}
            </span>
          </div>
          <p className='mt-0.5 text-xs text-muted-foreground'>
            {t('manager.ghostDetail.subtitle', { name: seat.employeeName, software: seat.softwareName })}
          </p>
        </div>
      </div>

      {actionNotice && (
        <div
          role='status'
          className='flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-4 text-xs font-medium text-success shadow-xs'
        >
          <CheckCircle2 className='size-5 shrink-0' />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Grid: Evidence Details & Decision */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Left Column: Evidence Facts */}
        <div className='lg:col-span-2 space-y-5'>
          {/* Main Info Box */}
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
            <div className='flex items-center gap-3 border-b border-border pb-4'>
              <ManagerIdentityMark className='size-12 rounded-2xl text-base' name={seat.softwareName} />
              <div>
                <h2 className='text-base font-bold text-foreground'>{seat.softwareName}</h2>
                <p className='text-xs text-muted-foreground'>{seat.plan}</p>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs'>
              <div className='rounded-xl border border-border bg-surface-subtle/50 p-3.5 space-y-1'>
                <span className='text-muted-foreground'>{t('manager.ghostDetail.labelEmployee')}</span>
                <p className='font-bold text-foreground'>{seat.employeeName}</p>
                <p className='text-[11px] text-muted-foreground'>{seat.employeeJob}</p>
              </div>

              <div className='rounded-xl border border-border bg-surface-subtle/50 p-3.5 space-y-1'>
                <span className='text-muted-foreground'>{t('manager.ghostDetail.labelCostCenter')}</span>
                <p className='font-mono font-bold text-foreground'>{seat.costCenter}</p>
                <p className='text-[11px] text-muted-foreground'>{seat.employeeEmail}</p>
              </div>

              <div className='rounded-xl border border-border bg-surface-subtle/50 p-3.5 space-y-1'>
                <span className='text-muted-foreground'>{t('manager.ghostDetail.labelInactiveTime')}</span>
                <p className='font-mono font-bold text-danger text-sm'>
                  {t('manager.ghostDetail.inactiveDaysCount', { count: seat.inactiveDays })}
                </p>
                <p className='text-[11px] text-muted-foreground'>{t('manager.ghostDetail.zeroActiveMinutes')}</p>
              </div>

              <div className='rounded-xl border border-border bg-surface-subtle/50 p-3.5 space-y-1'>
                <span className='text-muted-foreground'>{t('manager.ghostDetail.labelMonthlyWaste')}</span>
                <p className='font-extrabold text-danger text-sm'>{formatCurrency(seat.monthlyCost)}</p>
                <p className='text-[11px] text-muted-foreground'>
                  {t('manager.ghostDetail.annualWasteEstimate', { amount: formatCurrency(seat.monthlyCost * 12) })}
                </p>
              </div>
            </div>

            {/* Evidence Note */}
            <div className='rounded-xl border border-border bg-surface-subtle/40 p-4 text-xs space-y-1.5'>
              <div className='flex items-center gap-1.5 font-bold text-foreground'>
                <ShieldAlert className='size-4 text-warning' />
                <span>{t('manager.ghostDetail.evidenceHeader')}</span>
              </div>
              <p className='text-muted-foreground leading-relaxed'>{seat.evidenceNote}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Decision Actions */}
        <div className='space-y-5'>
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
            <div>
              <h2 className='text-sm font-bold text-foreground'>{t('manager.ghostDetail.decisionCardTitle')}</h2>
              <p className='text-xs text-muted-foreground mt-0.5'>{t('manager.ghostDetail.decisionCardSub')}</p>
            </div>

            <div className='space-y-3 pt-2 border-t border-border'>
              {currentStatus === 'REVOKED' ? (
                <div className='rounded-xl border border-danger/30 bg-danger/10 p-4 text-center space-y-1.5'>
                  <RotateCcw className='size-8 text-danger mx-auto' />
                  <p className='font-bold text-xs text-danger'>{t('manager.ghostDetail.statusRevokedBadge')}</p>
                  <p className='text-[11px] text-muted-foreground'>{t('manager.ghostDetail.revokedNotice')}</p>
                </div>
              ) : currentStatus === 'KEPT' ? (
                <div className='rounded-xl border border-success/30 bg-success/10 p-4 text-center space-y-1.5'>
                  <CheckCircle2 className='size-8 text-success mx-auto' />
                  <p className='font-bold text-xs text-success'>{t('manager.ghostDetail.statusKeptBadge')}</p>
                  <p className='text-[11px] text-muted-foreground'>{t('manager.ghostDetail.keptNotice')}</p>
                </div>
              ) : (
                <>
                  <button
                    className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-danger py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-danger/90'
                    onClick={handleRevoke}
                    type='button'
                  >
                    <RotateCcw className='size-4' />
                    <span>{t('manager.ghostDetail.actRevokeSeat')}</span>
                  </button>

                  <button
                    className='inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-xs font-semibold text-foreground transition hover:bg-surface-subtle'
                    onClick={() => setKeepModalOpen(true)}
                    type='button'
                  >
                    <Sparkles className='size-4 text-primary' />
                    <span>{t('manager.ghostDetail.actKeepSeat')}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Keep Seat Justification Modal */}
      {keepModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4'>
          <div
            aria-labelledby='manager-keep-title'
            aria-modal='true'
            className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl space-y-4'
            onKeyDown={(event) => handleManagerDialogKeyDown(event, () => setKeepModalOpen(false))}
            role='dialog'
          >
            <div className='flex items-center justify-between'>
              <h3 className='font-bold text-sm text-foreground' id='manager-keep-title'>
                {t('manager.ghostDetail.keepModalTitle')}
              </h3>
              <button
                aria-label={t('manager.ghostDetail.cancelBtn')}
                className='text-muted-foreground hover:text-foreground'
                onClick={() => setKeepModalOpen(false)}
                type='button'
              >
                <X className='size-5' />
              </button>
            </div>
            <p className='text-xs text-muted-foreground'>{t('manager.ghostDetail.keepModalDesc')}</p>
            <textarea
              aria-label={t('manager.ghostDetail.keepReasonPlaceholder')}
              autoFocus
              className='w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setKeepReason(e.target.value)}
              placeholder={t('manager.ghostDetail.keepReasonPlaceholder')}
              rows={3}
              value={keepReason}
            />
            <div className='flex justify-end gap-2'>
              <button
                className='rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground'
                onClick={() => setKeepModalOpen(false)}
                type='button'
              >
                {t('manager.ghostDetail.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50'
                disabled={!keepReason.trim()}
                onClick={handleConfirmKeep}
                type='button'
              >
                {t('manager.ghostDetail.confirmKeepBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
