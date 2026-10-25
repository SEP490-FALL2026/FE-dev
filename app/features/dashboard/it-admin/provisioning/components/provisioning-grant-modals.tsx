import { ExternalLink, Shield, UserCheck, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ItBatch, ItProvisioningItem } from '../../it-admin-data'

export interface RevealCredentialsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmReveal: () => void
}

export function RevealCredentialsModal({
  isOpen,
  onClose,
  onConfirmReveal,
}: RevealCredentialsModalProps) {
  const { t } = useTranslation('dashboard')
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
        <div className='flex items-center gap-2 text-warning'>
          <Shield className='size-5' />
          <h3 className='text-base font-bold text-foreground'>{t('itAdmin.provisioning.extra.secretTitle')}</h3>
        </div>
        <p className='text-xs text-muted-foreground leading-relaxed'>
          {t('itAdmin.provisioning.extra.secretNotice')}
        </p>
        <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
          <button
            className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
            onClick={onClose}
            type='button'
          >
            {t('itAdmin.provisioning.extra.cancel')}
          </button>
          <button
            className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
            onClick={onConfirmReveal}
            type='button'
          >
            {t('itAdmin.provisioning.extra.continue')}
          </button>
        </div>
      </div>
    </div>
  )
}

export interface BeneficiaryPreviewModalProps {
  isOpen: boolean
  item: ItProvisioningItem | null
  onClose: () => void
  onOpenPortal: () => void
}

export function BeneficiaryPreviewModal({
  isOpen,
  item,
  onClose,
  onOpenPortal,
}: BeneficiaryPreviewModalProps) {
  const { t } = useTranslation('dashboard')
  if (!isOpen || !item) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-primary'>
            <UserCheck className='size-5' />
            <h3 className='text-base font-bold text-foreground'>{t('itAdmin.provisioning.extra.recipientMode')}</h3>
          </div>
          <button
            className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
            onClick={onClose}
            type='button'
          >
            <X className='size-5' />
          </button>
        </div>

        <div className='rounded-xl border border-border bg-surface-subtle p-4 space-y-3 text-xs'>
          <span className='font-bold text-muted-foreground uppercase text-[0.65rem]'>
            {t('itAdmin.provisioning.extra.employeeNotice')}
          </span>
          <div className='rounded-xl bg-surface p-4 border border-border space-y-2'>
            <p className='font-bold text-foreground text-sm'>
              {t('itAdmin.provisioning.extra.requestApprovedStart')} {item.softwareName}{' '}
              {t('itAdmin.provisioning.extra.requestApprovedEnd')}
            </p>
            <p className='text-muted-foreground leading-relaxed'>
              {t('itAdmin.provisioning.extra.hello')} {item.beneficiaryName}
              {t('itAdmin.provisioning.extra.planFragment')} {item.planName}{' '}
              {t('itAdmin.provisioning.extra.recipientHelp')}
            </p>
            <p className='text-danger font-semibold text-[0.7rem]'>
              {t('itAdmin.provisioning.extra.recipientSafety')}
            </p>
            <div className='pt-2'>
              <a
                className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90'
                href='#credential-portal'
                onClick={(e) => {
                  e.preventDefault()
                  onOpenPortal()
                }}
              >
                <span>{t('itAdmin.provisioning.extra.openPortal')}</span>
                <ExternalLink className='size-3' />
              </a>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-end pt-2 border-t border-border'>
          <button
            className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
            onClick={onClose}
            type='button'
          >
            {t('itAdmin.provisioning.extra.closePreview')}
          </button>
        </div>
      </div>
    </div>
  )
}

export interface MoveBatchModalProps {
  batches: ItBatch[]
  isOpen: boolean
  movingItem: ItProvisioningItem | null
  onClose: () => void
  onConfirmMove: () => void
  selectedDeptId: string | null
  setTargetBatchId: (id: string) => void
  targetBatchId: string
}

export function MoveBatchModal({
  batches,
  isOpen,
  movingItem,
  onClose,
  onConfirmMove,
  selectedDeptId,
  setTargetBatchId,
  targetBatchId,
}: MoveBatchModalProps) {
  const { t } = useTranslation('dashboard')
  if (!isOpen || !movingItem) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-base font-bold text-foreground'>
            {t('itAdmin.provisioning.extra.moveBetweenBatches')}
          </h3>
          <button
            className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
            onClick={onClose}
            type='button'
          >
            <X className='size-5' />
          </button>
        </div>
        <p className='text-xs text-muted-foreground'>
          {t('itAdmin.provisioning.extra.moveNoticeStart')}{' '}
          <strong>{t('itAdmin.provisioning.extra.notStarted')}</strong>{' '}
          {t('itAdmin.provisioning.extra.moveNoticeEnd')}
        </p>
        <div className='space-y-1.5 text-xs'>
          {batches
            .filter((b) => b.departmentId === selectedDeptId && b.status === 'open' && b.id !== movingItem.batchId)
            .map((target) => (
              <button
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                  targetBatchId === target.id
                    ? 'border-primary bg-primary-soft text-primary font-bold'
                    : 'border-border bg-surface text-foreground hover:bg-surface-subtle'
                }`}
                key={target.id}
                onClick={() => setTargetBatchId(target.id)}
                type='button'
              >
                <span>{target.name}</span>
                <span className='text-[0.65rem] text-muted-foreground'>
                  {target.startDate} – {target.endDate}
                </span>
              </button>
            ))}
        </div>

        <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
          <button
            className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
            onClick={onClose}
            type='button'
          >
            {t('itAdmin.provisioning.extra.cancel')}
          </button>
          <button
            className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50'
            disabled={!targetBatchId}
            onClick={onConfirmMove}
            type='button'
          >
            {t('itAdmin.provisioning.extra.confirmMove')}
          </button>
        </div>
      </div>
    </div>
  )
}
