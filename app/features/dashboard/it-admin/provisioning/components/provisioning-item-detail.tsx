import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Lock,
  PackageCheck,
  RefreshCw,
  Scale,
  UserCheck
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'
import type { ItBatch, ItProvisioningItem, ItProvisioningStatus } from '../../it-admin-data'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { ProvisioningCredentialsCard } from './provisioning-credentials-card'


export type ProvisioningItemDetailProps = {
  currentItem: ItProvisioningItem
  currentBatch: ItBatch | null
  onBack: () => void
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
  onOpenConfirmGrant: () => void
  onCheckStatus: (item: ItProvisioningItem) => void
  onRecoverHandover: (item: ItProvisioningItem) => void
  onOpenBeneficiaryPreview: () => void
  onOpenRevealModal: () => void
  isRevealed: boolean
  setIsRevealed: (revealed: boolean) => void
  showToast: (msg: string) => void
}

export function ProvisioningItemDetail({
  currentItem,
  currentBatch,
  onBack,
  onSelectTab,
  onOpenConfirmGrant,
  onCheckStatus,
  onRecoverHandover,
  onOpenBeneficiaryPreview,
  onOpenRevealModal,
  isRevealed,
  setIsRevealed,
  showToast
}: ProvisioningItemDetailProps) {
  const { t, i18n } = useTranslation('dashboard')

  const unitLabel = (unit: string) => {
    if (unit === 'Tài khoản') return t('itAdmin.provisioning.extra.unitAccount')
    if (unit === 'API Key') return t('itAdmin.provisioning.extra.unitApiKey')
    if (unit === 'Seat') return t('itAdmin.provisioning.extra.unitSeat')
    if (unit === 'Quyền truy cập SSO') return t('itAdmin.provisioning.extra.unitSso')
    return unit
  }

  const batchLabel = (batch?: ItBatch | null) => {
    if (!batch) return t('itAdmin.provisioning.extra.batchShort')
    const number = batch.name.match(/^(?:Đợt|Batch) (\d+) - (?:tháng 10\/2026|October 2026)$/)?.[1]
    return number ? t('itAdmin.provisioning.extra.batchDefaultName', { number }) : batch.name
  }

  const itemText = (item: ItProvisioningItem, field: 'beneficiaryRole' | 'purpose') =>
    i18n.t(`dashboard:itAdmin.provisioning.extra.demoItems.${item.id}.${field}`, { defaultValue: item[field] })

  const demoValue = (item: ItProvisioningItem, field: string, value: string) =>
    i18n.t(`dashboard:itAdmin.provisioning.extra.demoDetails.${item.id}.${field}`, { defaultValue: value })

  const actorLabel = (actor: string) => {
    if (actor === 'Hệ thống IT') return t('itAdmin.provisioning.extra.itSystem')
    if (actor === 'Hệ thống API Cấp phát') return t('itAdmin.provisioning.extra.provisioningApiSystem')
    return actor
  }

  const getStatusBadge = (status: ItProvisioningStatus) => {
    switch (status) {
      case 'ready':
        return {
          label: t('itAdmin.provisioning.extra.readyToProvision'),
          tone: 'border-success/30 bg-success/10 text-success'
        }
      case 'inProgress':
        return {
          label: t('itAdmin.provisioning.extra.statusInProgress'),
          tone: 'border-primary/30 bg-primary/10 text-primary animate-pulse'
        }
      case 'needsCheck':
        return {
          label: t('itAdmin.provisioning.extra.statusNeedsCheck'),
          tone: 'border-warning/30 bg-warning/10 text-warning'
        }
      case 'needsHandover':
        return {
          label: t('itAdmin.provisioning.extra.statusNeedsHandover'),
          tone: 'border-warning/30 bg-warning/15 text-warning font-bold'
        }
      case 'failed':
        return {
          label: t('itAdmin.provisioning.extra.failed'),
          tone: 'border-danger/30 bg-danger/10 text-danger'
        }
      case 'completed':
        return {
          label: t('itAdmin.provisioning.extra.completed'),
          tone: 'border-border bg-surface-subtle text-muted-foreground'
        }
      case 'pendingConfig':
        return {
          label: t('itAdmin.provisioning.extra.statusPendingConfig'),
          tone: 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
        }
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <button
          className='inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground transition hover:bg-surface-subtle shadow-sm'
          onClick={onBack}
          type='button'
        >
          <ArrowLeft className='size-4 text-primary' />
          <span>{t('itAdmin.provisioning.extra.backRequests')}</span>
        </button>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-mono font-bold text-muted-foreground'>{currentItem.id}</span>
            {currentItem.originalRequestId !== currentItem.id && (
              <span className='rounded-md bg-surface-subtle px-2 py-0.5 text-[0.65rem] font-bold text-muted-foreground'>
                {t('itAdmin.provisioning.extra.originalRequest')} {currentItem.originalRequestId}
              </span>
            )}
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold ${getStatusBadge(currentItem.status).tone}`}
            >
              {getStatusBadge(currentItem.status).label}
            </span>
          </div>
          <h1 className='text-xl font-bold tracking-tight text-foreground sm:text-2xl mt-1'>
            {currentItem.softwareName} — {currentItem.planName}
          </h1>
        </div>

        <div className='flex items-center gap-3'>
          {currentItem.status === 'completed' && (
            <button
              className='flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary transition hover:bg-primary/20'
              onClick={onOpenBeneficiaryPreview}
              type='button'
            >
              <UserCheck className='size-4' />
              <span>{t('itAdmin.provisioning.extra.recipientPreview')}</span>
            </button>
          )}

          {currentItem.status === 'ready' && (
            <button
              className='flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition hover:bg-primary/90'
              onClick={onOpenConfirmGrant}
              type='button'
            >
              <PackageCheck className='size-4' />
              <span>{t('itAdmin.provisioning.extra.provisionNow')}</span>
            </button>
          )}

          {currentItem.status === 'failed' && (
            <button
              className='flex items-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-danger/90'
              onClick={onOpenConfirmGrant}
              type='button'
            >
              <RefreshCw className='size-4' />
              <span>{t('itAdmin.provisioning.extra.retryProvision')}</span>
            </button>
          )}

          {currentItem.status === 'needsCheck' && (
            <button
              className='flex items-center gap-2 rounded-xl bg-warning px-4 py-2.5 text-xs font-bold text-warning-foreground shadow-md transition hover:bg-warning/90'
              onClick={() => onCheckStatus(currentItem)}
              type='button'
            >
              <RefreshCw className='size-4' />
              <span>{t('itAdmin.provisioning.extra.recheckStatus')}</span>
            </button>
          )}

          {currentItem.status === 'needsHandover' && (
            <button
              className='flex items-center gap-2 rounded-xl bg-warning px-4 py-2.5 text-xs font-bold text-warning-foreground shadow-md transition hover:bg-warning/90'
              onClick={() => onRecoverHandover(currentItem)}
              type='button'
            >
              <Lock className='size-4' />
              <span>{t('itAdmin.provisioning.extra.restoreHandover')}</span>
            </button>
          )}

          {currentItem.status === 'pendingConfig' && (
            <div className='flex items-center gap-2'>
              <button
                className='rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-subtle'
                onClick={() => onSelectTab && onSelectTab('reconciliation')}
                type='button'
              >
                {t('itAdmin.provisioning.extra.viewReconciliation')}
              </button>
              <button
                className='rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-subtle'
                onClick={() => onSelectTab && onSelectTab('usage-import')}
                type='button'
              >
                {t('itAdmin.provisioning.extra.importDocuments')}
              </button>
              <button
                className='rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90'
                onClick={() => onSelectTab && onSelectTab('dept-catalog')}
                type='button'
              >
                {t('itAdmin.provisioning.extra.configureCatalog')}
              </button>
            </div>
          )}
        </div>
      </div>

      {currentItem.status === 'completed' && (
        <div className='rounded-2xl border border-success/30 bg-success/5 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-3.5'>
            <div className='grid size-10 place-items-center rounded-xl bg-success/20 text-success shrink-0'>
              <CheckCircle2 className='size-5' />
            </div>
            <div>
              <h4 className='text-sm font-bold text-foreground'>
                {t('itAdmin.provisioning.extra.provisionedFor', {
                  unit: unitLabel(currentItem.unit),
                  beneficiary: currentItem.beneficiaryName
                })}
              </h4>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {t('itAdmin.provisioning.extra.savedForReconciliation')}
              </p>
            </div>
          </div>
          <button
            className='flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90'
            onClick={() => onSelectTab && onSelectTab('reconciliation')}
            type='button'
          >
            <Scale className='size-4' />
            <span>{t('itAdmin.provisioning.extra.licenseDiscrepancies')}</span>
          </button>
        </div>
      )}

      {(!currentItem.feasibility.isApiReady ||
        currentItem.feasibility.purchasedRemaining <= 0 ||
        !currentItem.feasibility.isConfigured) && (
        <div className='rounded-2xl border border-warning/30 bg-warning/10 p-5'>
          <div className='flex items-start gap-3'>
            <AlertTriangle className='size-5 text-warning shrink-0 mt-0.5' />
            <div className='space-y-1 text-xs'>
              <p className='font-bold text-foreground text-sm'>{t('itAdmin.provisioning.extra.blockedReason')}</p>
              <p className='text-muted-foreground'>
                {currentItem.feasibility.blockReason
                  ? demoValue(currentItem, 'blockReason', currentItem.feasibility.blockReason)
                  : t('itAdmin.provisioning.extra.blockedPackage')}
              </p>
              <div className='flex flex-wrap items-center gap-3 pt-2'>
                <button
                  className='font-bold text-primary underline underline-offset-4 hover:opacity-80'
                  onClick={() => onSelectTab && onSelectTab('reconciliation')}
                  type='button'
                >
                  {t('itAdmin.provisioning.extra.openReconciliation')}
                </button>
                <button
                  className='font-bold text-primary underline underline-offset-4 hover:opacity-80'
                  onClick={() => onSelectTab && onSelectTab('dept-catalog')}
                  type='button'
                >
                  {t('itAdmin.provisioning.extra.openCatalog')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>
              {t('itAdmin.provisioning.extra.requestDetails')}
            </h3>
            <div className='grid gap-4 sm:grid-cols-2 text-xs'>
              <div>
                <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.beneficiary')}</span>
                <p className='font-bold text-foreground text-sm mt-0.5'>{currentItem.beneficiaryName}</p>
                <p className='text-muted-foreground'>{currentItem.beneficiaryEmail}</p>
                <p className='text-muted-foreground mt-0.5 italic'>{itemText(currentItem, 'beneficiaryRole')}</p>
              </div>
              <div>
                <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.requester')}</span>
                <p className='font-bold text-foreground text-sm mt-0.5'>{currentItem.requesterName}</p>
                <p className='text-muted-foreground'>{currentItem.requesterEmail}</p>
                <p className='text-muted-foreground mt-0.5'>
                  {t('itAdmin.provisioning.extra.submittedAt')} {currentItem.submittedAt}
                </p>
              </div>
              <div>
                <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.departmentStructure')}</span>
                <p className='font-semibold text-foreground mt-0.5'>
                  {itAdminDepartmentLabel(currentItem.departmentName)}
                </p>
              </div>
              <div>
                <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.requestBatch')}</span>
                <p className='font-semibold text-foreground mt-0.5'>
                  {currentItem.batchId ? batchLabel(currentBatch) : t('itAdmin.provisioning.extra.unassigned')}
                </p>
              </div>
            </div>

            <div className='pt-3 border-t border-border/60 text-xs'>
              <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.purpose')}</span>
              <p className='mt-1 text-foreground bg-surface-subtle p-3 rounded-xl border border-border/50 leading-relaxed'>
                {itemText(currentItem, 'purpose')}
              </p>
            </div>
          </div>

          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>
              {t('itAdmin.provisioning.extra.planFeasibility')}
            </h3>
            <div className='grid gap-4 sm:grid-cols-3 text-xs'>
              <div>
                <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.softwareAgent')}</span>
                <p className='font-bold text-foreground text-sm mt-0.5'>{currentItem.softwareName}</p>
              </div>
              <div>
                <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.requestedPlan')}</span>
                <p className='font-bold text-primary text-sm mt-0.5'>{currentItem.planName}</p>
              </div>
              <div>
                <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.quantity')}</span>
                <p className='font-bold text-foreground text-sm mt-0.5'>
                  1 {unitLabel(currentItem.unit)} {t('itAdmin.provisioning.extra.oneUnit')}
                </p>
              </div>
            </div>

            <div className='grid gap-3 sm:grid-cols-3 pt-3 border-t border-border/60 text-xs'>
              <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.catalogConfig')}</span>
                <p
                  className={`font-bold mt-1 ${currentItem.feasibility.isConfigured ? 'text-success' : 'text-danger'}`}
                >
                  {currentItem.feasibility.isConfigured
                    ? t('itAdmin.provisioning.extra.catalogValid')
                    : t('itAdmin.provisioning.extra.catalogMissing')}
                </p>
              </div>
              <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.purchasedRights')}</span>
                <p
                  className={`font-bold mt-1 ${currentItem.feasibility.purchasedRemaining > 0 ? 'text-success' : 'text-danger'}`}
                >
                  {currentItem.feasibility.purchasedRemaining > 0
                    ? t('itAdmin.provisioning.extra.remainingRights', {
                        count: currentItem.feasibility.purchasedRemaining,
                        unit: unitLabel(currentItem.unit)
                      })
                    : t('itAdmin.provisioning.extra.noRights')}
                </p>
              </div>
              <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.provisioningApi')}</span>
                <p className={`font-bold mt-1 ${currentItem.feasibility.isApiReady ? 'text-success' : 'text-warning'}`}>
                  {currentItem.feasibility.isApiReady
                    ? t('itAdmin.provisioning.extra.apiConnected')
                    : t('itAdmin.provisioning.extra.apiNotReady')}
                </p>
              </div>
            </div>
          </div>

          <ProvisioningCredentialsCard
            currentItem={currentItem}
            isRevealed={isRevealed}
            onOpenRevealModal={onOpenRevealModal}
            setIsRevealed={setIsRevealed}
            showToast={showToast}
          />
        </div>

        <div className='space-y-6'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>
              {t('itAdmin.provisioning.extra.auditTrail')}
            </h3>
            <div className='space-y-3'>
              {currentItem.auditTrail.map((log, idx) => (
                <div className='relative pl-4 border-l-2 border-border/80 text-xs space-y-1' key={idx}>
                  <span className='size-2 rounded-full bg-primary absolute -left-[5px] top-1' />
                  <div className='flex items-center justify-between text-[0.7rem] text-muted-foreground'>
                    <span>{log.timestamp}</span>
                    <span className='font-bold'>{actorLabel(log.actor)}</span>
                  </div>
                  <p className='font-bold text-foreground'>
                    {demoValue(currentItem, `audit${idx}Action`, log.action)}
                  </p>
                  <p className='text-muted-foreground leading-relaxed'>
                    {demoValue(currentItem, `audit${idx}Details`, log.details)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
