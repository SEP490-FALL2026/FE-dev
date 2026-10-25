import React from 'react'
import { AlertCircle, RefreshCw, UserCheck } from 'lucide-react'
import type { ItOptimizationAlertItem } from '../../it-admin-data'

export interface OptimizationModalsProps {
  selectedAlert: ItOptimizationAlertItem | null
  isReclaimModalOpen: boolean
  onCloseReclaimModal: () => void
  isReclaimProcessing: boolean
  onConfirmReclaim: () => void
  isKeepModalOpen: boolean
  onCloseKeepModal: () => void
  keepReasonInput: string
  setKeepReasonInput: (v: string) => void
  onConfirmKeep: () => void
  formatCurrency: (value: number) => string
  t: any
}

export const OptimizationModals: React.FC<OptimizationModalsProps> = ({
  selectedAlert,
  isReclaimModalOpen,
  onCloseReclaimModal,
  isReclaimProcessing,
  onConfirmReclaim,
  isKeepModalOpen,
  onCloseKeepModal,
  keepReasonInput,
  setKeepReasonInput,
  onConfirmKeep,
  formatCurrency,
  t,
}) => {
  if (!selectedAlert) return null

  return (
    <>
      {/* MODAL: XÁC NHẬN THU HỒI BẢN QUYỀN (IT-AC-11 & 11A) */}
      {isReclaimModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center gap-2 text-danger font-bold'>
              <AlertCircle className='size-5' />
              <h3 className='text-base font-bold text-foreground'>
                {t('itAdmin.licenseOptimization.extra.revokeTitle')}
              </h3>
            </div>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              {t('itAdmin.licenseOptimization.extra.revokeQuestion')}{' '}
              <strong>
                {selectedAlert.softwareName} — {selectedAlert.planName}
              </strong>{' '}
              {t('itAdmin.licenseOptimization.extra.forEmployee')} <strong>{selectedAlert.employeeName}</strong>?
            </p>

            <div className='rounded-xl border border-border bg-surface-subtle p-3.5 space-y-1.5 text-xs'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>{t('itAdmin.licenseOptimization.extra.employee')}</span>
                <span className='font-bold text-foreground'>{selectedAlert.employeeName}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>{t('itAdmin.licenseOptimization.extra.poolImpact')}</span>
                <span className='font-bold text-primary'>
                  {selectedAlert.reclaimImpact.canReuse
                    ? t('itAdmin.licenseOptimization.extra.poolIncrease')
                    : t('itAdmin.licenseOptimization.extra.noPoolIncrease')}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>{t('itAdmin.licenseOptimization.extra.savings')}</span>
                <span className='font-bold text-danger'>
                  {formatCurrency(selectedAlert.evidence.costPerMonth)}
                  {t('itAdmin.licenseOptimization.extra.perMonth')}
                </span>
              </div>
            </div>

            <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
              <button
                className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                disabled={isReclaimProcessing}
                onClick={onCloseReclaimModal}
                type='button'
              >
                {t('itAdmin.licenseOptimization.extra.cancel')}
              </button>
              <button
                className='flex items-center gap-2 rounded-xl bg-danger px-5 py-2 text-xs font-bold text-white shadow hover:bg-danger/90'
                disabled={isReclaimProcessing}
                onClick={onConfirmReclaim}
                type='button'
              >
                {isReclaimProcessing ? (
                  <>
                    <RefreshCw className='size-3.5 animate-spin' />
                    <span>{t('itAdmin.licenseOptimization.extra.revoking')}</span>
                  </>
                ) : (
                  <span>{t('itAdmin.licenseOptimization.extra.confirmRevoke')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GIỮ LẠI BẢN QUYỀN (BẮT BUỘC NHẬP LÝ DO) */}
      {isKeepModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center gap-2 text-primary font-bold'>
              <UserCheck className='size-5' />
              <h3 className='text-base font-bold text-foreground'>
                {t('itAdmin.licenseOptimization.extra.retainTitle')}
              </h3>
            </div>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              {t('itAdmin.licenseOptimization.extra.retainHelp')}
            </p>

            <textarea
              className='w-full rounded-xl border border-border bg-surface-subtle p-3 text-xs outline-none focus:border-primary'
              onChange={(e) => setKeepReasonInput(e.target.value)}
              placeholder={t('itAdmin.licenseOptimization.extra.retainPlaceholder')}
              rows={3}
              value={keepReasonInput}
            />

            <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
              <button
                className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                onClick={onCloseKeepModal}
                type='button'
              >
                {t('itAdmin.licenseOptimization.extra.cancel')}
              </button>
              <button
                className='rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                onClick={onConfirmKeep}
                type='button'
              >
                {t('itAdmin.licenseOptimization.extra.confirmRetain')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
