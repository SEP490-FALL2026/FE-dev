import React from 'react'
import { ExternalLink } from 'lucide-react'
import type { ItOptimizationAlertItem } from '../../it-admin-data'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'
import type { ItAdminTabKey } from '../../it-admin-nav'

export interface OptimizationInspectionCardProps {
  selectedAlert: ItOptimizationAlertItem | null
  onOpenKeepModal: () => void
  onOpenReclaimModal: () => void
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
  formatCurrency: (value: number) => string
  demoEvidence: (
    alert: ItOptimizationAlertItem,
    field: 'threshold' | 'observationPeriod' | 'lastUsed' | 'usageStats' | 'tokens' | 'dataSource'
  ) => string
  t: any
}

export const OptimizationInspectionCard: React.FC<OptimizationInspectionCardProps> = ({
  selectedAlert,
  onOpenKeepModal,
  onOpenReclaimModal,
  onSelectTab,
  formatCurrency,
  demoEvidence,
  t,
}) => {
  if (!selectedAlert) return null

  return (
    <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-5 flex flex-col justify-between'>
      <div className='space-y-4'>
        <div className='pb-3 border-b border-border/80'>
          <div className='flex items-center justify-between'>
            <span className='font-mono text-xs text-muted-foreground'>{selectedAlert.id}</span>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.68rem] font-bold ${
                selectedAlert.severity === 'high'
                  ? 'border-danger/30 bg-danger/10 text-danger'
                  : 'border-warning/30 bg-warning/10 text-warning'
              }`}
            >
              {selectedAlert.severity === 'high'
                ? t('itAdmin.licenseOptimization.extra.highImpact')
                : t('itAdmin.licenseOptimization.extra.mediumImpact')}
            </span>
          </div>
          <h3 className='text-lg font-bold text-foreground mt-1'>{selectedAlert.employeeName}</h3>
          <p className='text-xs text-muted-foreground'>
            {selectedAlert.employeeEmail} · {itAdminDepartmentLabel(selectedAlert.departmentName)}
          </p>
        </div>

        {/* Package & Cost */}
        <div className='rounded-xl border border-border bg-surface-subtle p-3.5 space-y-1 text-xs'>
          <span className='text-muted-foreground'>{t('itAdmin.licenseOptimization.extra.currentPlan')}</span>
          <p className='font-bold text-foreground text-sm'>
            {selectedAlert.softwareName} — {selectedAlert.planName}
          </p>
          <div className='flex items-center justify-between pt-2 border-t border-border/60 text-xs'>
            <span className='text-muted-foreground'>{t('itAdmin.licenseOptimization.extra.recurringCost')}</span>
            <span className='font-bold text-danger'>
              {formatCurrency(selectedAlert.evidence.costPerMonth)}{' '}
              {t('itAdmin.licenseOptimization.extra.perMonthSpaced')}
            </span>
          </div>
        </div>

        {/* Evidence details */}
        <div className='space-y-2 text-xs'>
          <span className='font-bold text-foreground uppercase tracking-wider text-[0.68rem] text-muted-foreground block'>
            {t('itAdmin.licenseOptimization.extra.alertBasis')}
          </span>
          <div className='rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2 leading-relaxed'>
            <div>
              <span className='text-muted-foreground block text-[0.68rem]'>
                {t('itAdmin.licenseOptimization.extra.threshold')}
              </span>
              <span className='font-semibold text-foreground'>{demoEvidence(selectedAlert, 'threshold')}</span>
            </div>
            <div>
              <span className='text-muted-foreground block text-[0.68rem]'>
                {t('itAdmin.licenseOptimization.extra.observationPeriod')}
              </span>
              <span className='text-foreground'>{demoEvidence(selectedAlert, 'observationPeriod')}</span>
            </div>
            <div>
              <span className='text-muted-foreground block text-[0.68rem]'>
                {t('itAdmin.licenseOptimization.extra.recordedUsage')}
              </span>
              <span className='font-bold text-foreground'>{demoEvidence(selectedAlert, 'usageStats')}</span>
            </div>
            <div>
              <span className='text-muted-foreground block text-[0.68rem]'>
                {t('itAdmin.licenseOptimization.extra.recordedTokens')}
              </span>
              <span className='text-foreground'>{demoEvidence(selectedAlert, 'tokens')}</span>
            </div>
            <div>
              <span className='text-muted-foreground block text-[0.68rem]'>
                {t('itAdmin.licenseOptimization.extra.dataSource')}
              </span>
              <span className='text-muted-foreground italic'>{demoEvidence(selectedAlert, 'dataSource')}</span>
            </div>
          </div>
        </div>

        {/* CTA button to verify at device collectors */}
        <button
          className='w-full flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition shadow-sm'
          onClick={() => {
            onSelectTab?.('device-collectors', {
              employeeId: selectedAlert.employeeId || 'emp-tuan',
              deptId: selectedAlert.departmentId,
              from: 'license-optimization',
              alertId: selectedAlert.id,
            })
          }}
          type='button'
        >
          <ExternalLink className='size-3.5' />
          <span>{t('itAdmin.licenseOptimization.extra.collectorDetails')}</span>
        </button>

        {/* Reclaim Impact Policy Note */}
        <div className='rounded-xl border border-primary/20 bg-primary/5 p-3 text-[0.7rem] text-muted-foreground space-y-1'>
          <span className='font-bold text-primary block'>
            {t('itAdmin.licenseOptimization.extra.returnPolicy')}
          </span>
          <p>
            {t(`itAdmin.licenseOptimization.extra.demoAlerts.${selectedAlert.id}.reclaimRefundText`, {
              defaultValue: selectedAlert.reclaimImpact.reclaimRefundText,
            })}
          </p>
        </div>

        {selectedAlert.keepReason && (
          <div className='rounded-xl border border-success/30 bg-success/10 p-3 text-xs'>
            <span className='font-bold text-success'>
              {t('itAdmin.licenseOptimization.extra.retentionReason')}
            </span>
            <p className='text-foreground mt-0.5'>{selectedAlert.keepReason}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {selectedAlert.status === 'pending' ? (
        <div className='pt-4 border-t border-border flex items-center gap-3'>
          <button
            className='flex-1 rounded-xl border border-border bg-surface py-2.5 text-xs font-bold text-foreground hover:bg-surface-subtle'
            onClick={onOpenKeepModal}
            type='button'
          >
            {t('itAdmin.licenseOptimization.extra.retainWithReason')}
          </button>
          <button
            className='flex-1 rounded-xl bg-danger py-2.5 text-xs font-bold text-white shadow hover:bg-danger/90'
            onClick={onOpenReclaimModal}
            type='button'
          >
            {t('itAdmin.licenseOptimization.extra.revoke')}
          </button>
        </div>
      ) : (
        <div className='pt-4 border-t border-border text-center text-xs font-semibold text-muted-foreground'>
          {t('itAdmin.licenseOptimization.extra.resolvedAlert')} (
          {selectedAlert.status === 'reclaimed'
            ? t('itAdmin.licenseOptimization.extra.reclaimed')
            : t('itAdmin.licenseOptimization.extra.retained')}
          ).
        </div>
      )}
    </div>
  )
}
