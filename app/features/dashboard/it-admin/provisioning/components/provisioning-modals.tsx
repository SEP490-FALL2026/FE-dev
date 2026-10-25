import {
  AlertCircle,
  ExternalLink,
  PackageCheck,
  RefreshCw,
  Shield,
  UserCheck,
  X
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'
import type { ItBatch, ItProvisioningItem } from '../../it-admin-data'
import {
  RevealCredentialsModal,
  BeneficiaryPreviewModal,
  MoveBatchModal,
  type RevealCredentialsModalProps,
  type BeneficiaryPreviewModalProps,
  type MoveBatchModalProps,
} from './provisioning-grant-modals'

export {
  RevealCredentialsModal,
  BeneficiaryPreviewModal,
  MoveBatchModal,
  type RevealCredentialsModalProps,
  type BeneficiaryPreviewModalProps,
  type MoveBatchModalProps,
}

export interface CreateBatchModalProps {
  batchError: string | null
  isOpen: boolean
  newBatchEndDate: string
  newBatchMonth: string
  newBatchName: string
  newBatchStartDate: string
  onClose: () => void
  onCreateBatch: () => void
  selectedUnbatchedIds: string[]
  setNewBatchEndDate: (val: string) => void
  setNewBatchMonth: (val: string) => void
  setNewBatchName: (val: string) => void
  setNewBatchStartDate: (val: string) => void
  setSelectedUnbatchedIds: React.Dispatch<React.SetStateAction<string[]>>
  unbatchedItemsInDept: ItProvisioningItem[]
}

export function CreateBatchModal({
  batchError,
  isOpen,
  newBatchEndDate,
  newBatchMonth,
  newBatchName,
  newBatchStartDate,
  onClose,
  onCreateBatch,
  selectedUnbatchedIds,
  setNewBatchEndDate,
  setNewBatchMonth,
  setNewBatchName,
  setNewBatchStartDate,
  setSelectedUnbatchedIds,
  unbatchedItemsInDept
}: CreateBatchModalProps) {
  const { t } = useTranslation('dashboard')
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-base font-bold text-foreground'>
            {t('itAdmin.provisioning.extra.createBatchTitle')}
          </h3>
          <button
            className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
            onClick={onClose}
            type='button'
          >
            <X className='size-5' />
          </button>
        </div>

        {batchError && (
          <div className='rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger font-semibold flex items-center gap-2'>
            <AlertCircle className='size-4 shrink-0' />
            <span>{batchError}</span>
          </div>
        )}

        <div className='space-y-3 text-xs'>
          <div>
            <label className='font-bold text-foreground'>{t('itAdmin.provisioning.extra.batchName')}</label>
            <input
              className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
              onChange={(e) => setNewBatchName(e.target.value)}
              placeholder={t('itAdmin.provisioning.extra.batchNamePlaceholder')}
              type='text'
              value={newBatchName}
            />
          </div>

          <div className='grid grid-cols-3 gap-2'>
            <div>
              <label className='font-bold text-foreground'>{t('itAdmin.provisioning.extra.batchMonth')}</label>
              <input
                className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                onChange={(e) => setNewBatchMonth(e.target.value)}
                type='text'
                value={newBatchMonth}
              />
            </div>
            <div>
              <label className='font-bold text-foreground'>{t('itAdmin.provisioning.extra.startDate')}</label>
              <input
                className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                onChange={(e) => setNewBatchStartDate(e.target.value)}
                type='text'
                value={newBatchStartDate}
              />
            </div>
            <div>
              <label className='font-bold text-foreground'>{t('itAdmin.provisioning.extra.endDate')}</label>
              <input
                className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                onChange={(e) => setNewBatchEndDate(e.target.value)}
                type='text'
                value={newBatchEndDate}
              />
            </div>
          </div>

          <div>
            <label className='font-bold text-foreground block mb-1'>
              {t('itAdmin.provisioning.extra.selectRequests')}
              {unbatchedItemsInDept.length} {t('itAdmin.provisioning.extra.unassignedItemsClose')}
            </label>
            {unbatchedItemsInDept.length === 0 ? (
              <p className='text-muted-foreground italic'>{t('itAdmin.provisioning.extra.noUnassigned')}</p>
            ) : (
              <div className='max-h-40 overflow-y-auto space-y-1.5 rounded-xl border border-border p-2 bg-surface-subtle'>
                {unbatchedItemsInDept.map((item) => (
                  <label
                    className='flex items-center gap-2 rounded-lg p-1.5 hover:bg-surface cursor-pointer'
                    key={item.id}
                  >
                    <input
                      checked={selectedUnbatchedIds.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedUnbatchedIds((prev) => [...prev, item.id])
                        else setSelectedUnbatchedIds((prev) => prev.filter((id) => id !== item.id))
                      }}
                      type='checkbox'
                    />
                    <span className='font-semibold text-foreground'>{item.beneficiaryName}</span>
                    <span className='text-muted-foreground'>
                      — {item.softwareName} ({item.planName})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
          <button
            className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
            onClick={onClose}
            type='button'
          >
            {t('itAdmin.provisioning.extra.cancelFull')}
          </button>
          <button
            className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
            onClick={onCreateBatch}
            type='button'
          >
            {t('itAdmin.provisioning.extra.createBatch')}
          </button>
        </div>
      </div>
    </div>
  )
}

export interface ConfirmGrantModalProps {
  isApiExecuting: boolean
  isOpen: boolean
  item: ItProvisioningItem | null
  onClose: () => void
  onExecuteGrant: () => void
  unitLabel: (unit: string) => string
}

export function ConfirmGrantModal({
  isApiExecuting,
  isOpen,
  item,
  onClose,
  onExecuteGrant,
  unitLabel
}: ConfirmGrantModalProps) {
  const { t } = useTranslation('dashboard')
  if (!isOpen || !item) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
      <div className='w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground font-bold text-xs'>
              <PackageCheck className='size-4' />
            </span>
            <h3 className='text-base font-bold text-foreground'>
              {t('itAdmin.provisioning.extra.confirmProvisionTitle')}
            </h3>
          </div>
          <button
            className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
            disabled={isApiExecuting}
            onClick={onClose}
            type='button'
          >
            <X className='size-5' />
          </button>
        </div>

        <div className='rounded-xl border border-border bg-surface-subtle p-4 space-y-2 text-xs'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.beneficiaryLabel')}</span>
            <span className='font-bold text-foreground'>
              {item.beneficiaryName} ({item.beneficiaryEmail})
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.department')}</span>
            <span className='font-semibold text-foreground'>
              {itAdminDepartmentLabel(item.departmentName)}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.provisionedPlan')}</span>
            <span className='font-bold text-primary'>
              {item.softwareName} — {item.planName}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>{t('itAdmin.provisioning.extra.provisionedUnit')}</span>
            <span className='font-semibold text-foreground'>
              {t('itAdmin.provisioning.extra.exactlyOne')} {unitLabel(item.unit)} ({item.credentialType})
            </span>
          </div>
        </div>

        <p className='text-xs text-muted-foreground leading-relaxed'>
          {t('itAdmin.provisioning.extra.provisionNotice')}
        </p>

        <div className='flex items-center justify-end gap-3 pt-4 border-t border-border'>
          <button
            className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
            disabled={isApiExecuting}
            onClick={onClose}
            type='button'
          >
            {t('itAdmin.provisioning.extra.cancel')}
          </button>
          <button
            className='flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50'
            disabled={isApiExecuting}
            onClick={onExecuteGrant}
            type='button'
          >
            {isApiExecuting ? (
              <>
                <RefreshCw className='size-3.5 animate-spin' />
                <span>{t('itAdmin.provisioning.extra.provisioning')}</span>
              </>
            ) : (
              <>
                <PackageCheck className='size-4' />
                <span>{t('itAdmin.provisioning.extra.confirmProvision')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}


export interface ProvisioningModalsProps {
  batches: ItBatch[]
  batchError: string | null
  currentItem: ItProvisioningItem | null
  isApiExecuting: boolean
  isBeneficiaryPreviewOpen: boolean
  isConfirmGrantOpen: boolean
  isCreateBatchOpen: boolean
  isMoveBatchOpen: boolean
  isRevealModalOpen: boolean
  movingItem: ItProvisioningItem | null
  newBatchEndDate: string
  newBatchMonth: string
  newBatchName: string
  newBatchStartDate: string
  onConfirmGrant: () => void
  onConfirmMoveBatch: () => void
  onCreateBatch: () => void
  selectedDeptId: string | null
  selectedUnbatchedIds: string[]
  setIsBeneficiaryPreviewOpen: (open: boolean) => void
  setIsConfirmGrantOpen: (open: boolean) => void
  setIsCreateBatchOpen: (open: boolean) => void
  setIsMoveBatchOpen: (open: boolean) => void
  setIsRevealModalOpen: (open: boolean) => void
  setIsRevealed: (revealed: boolean) => void
  setNewBatchEndDate: (val: string) => void
  setNewBatchMonth: (val: string) => void
  setNewBatchName: (val: string) => void
  setNewBatchStartDate: (val: string) => void
  setSelectedUnbatchedIds: React.Dispatch<React.SetStateAction<string[]>>
  setSimulatedBranch: (branch: 'success' | 'failed' | 'timeout' | 'handoverError') => void
  setTargetBatchId: (id: string) => void
  showToast: (msg: string) => void
  simulatedBranch: 'success' | 'failed' | 'timeout' | 'handoverError'
  targetBatchId: string
  unbatchedItemsInDept: ItProvisioningItem[]
}

export function ProvisioningModals({
  batches,
  batchError,
  currentItem,
  isApiExecuting,
  isBeneficiaryPreviewOpen,
  isConfirmGrantOpen,
  isCreateBatchOpen,
  isMoveBatchOpen,
  isRevealModalOpen,
  movingItem,
  newBatchEndDate,
  newBatchMonth,
  newBatchName,
  newBatchStartDate,
  onConfirmGrant,
  onConfirmMoveBatch,
  onCreateBatch,
  selectedDeptId,
  selectedUnbatchedIds,
  setIsBeneficiaryPreviewOpen,
  setIsConfirmGrantOpen,
  setIsCreateBatchOpen,
  setIsMoveBatchOpen,
  setIsRevealModalOpen,
  setIsRevealed,
  setNewBatchEndDate,
  setNewBatchMonth,
  setNewBatchName,
  setNewBatchStartDate,
  setSelectedUnbatchedIds,
  setTargetBatchId,
  showToast,
  targetBatchId,
  unbatchedItemsInDept
}: ProvisioningModalsProps) {
  return (
    <>
      <CreateBatchModal
        batchError={batchError}
        isOpen={isCreateBatchOpen}
        newBatchEndDate={newBatchEndDate}
        newBatchMonth={newBatchMonth}
        newBatchName={newBatchName}
        newBatchStartDate={newBatchStartDate}
        onClose={() => setIsCreateBatchOpen(false)}
        onCreateBatch={onCreateBatch}
        selectedUnbatchedIds={selectedUnbatchedIds}
        setNewBatchEndDate={setNewBatchEndDate}
        setNewBatchMonth={setNewBatchMonth}
        setNewBatchName={setNewBatchName}
        setNewBatchStartDate={setNewBatchStartDate}
        setSelectedUnbatchedIds={setSelectedUnbatchedIds}
        unbatchedItemsInDept={unbatchedItemsInDept}
      />

      <ConfirmGrantModal
        isApiExecuting={isApiExecuting}
        isOpen={isConfirmGrantOpen}
        item={currentItem}
        onClose={() => setIsConfirmGrantOpen(false)}
        onExecuteGrant={onConfirmGrant}
        unitLabel={(u) => u}
      />

      <RevealCredentialsModal
        isOpen={isRevealModalOpen}
        onClose={() => setIsRevealModalOpen(false)}
        onConfirmReveal={() => {
          setIsRevealed(true)
          setIsRevealModalOpen(false)
          showToast('Đã mở khoá thông tin nhạy cảm. Lưu vết kiểm toán đã ghi nhận.')
        }}
      />

      <BeneficiaryPreviewModal
        isOpen={isBeneficiaryPreviewOpen}
        item={currentItem}
        onClose={() => setIsBeneficiaryPreviewOpen(false)}
        onOpenPortal={() => {}}
      />

      <MoveBatchModal
        batches={batches}
        isOpen={isMoveBatchOpen}
        movingItem={movingItem}
        onClose={() => setIsMoveBatchOpen(false)}
        onConfirmMove={onConfirmMoveBatch}
        selectedDeptId={selectedDeptId}
        setTargetBatchId={setTargetBatchId}
        targetBatchId={targetBatchId}
      />
    </>
  )
}


