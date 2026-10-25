import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'

import {
  initialItDepartments,
  initialItBatches,
  initialItProvisioningItems,
  type ItDepartment,
  type ItBatch,
  type ItProvisioningItem,
  type ItProvisioningStatus
} from '../../it-admin-data'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { ProvisioningDeptList } from '../components/provisioning-dept-list'
import { ProvisioningBatchList } from '../components/provisioning-batch-list'
import { ProvisioningRequestsList } from '../components/provisioning-requests-list'
import { ProvisioningItemDetail } from '../components/provisioning-item-detail'
import { ProvisioningModals } from '../components/provisioning-modals'

export type ItProvisioningViewProps = {
  initialTaskId?: string
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItProvisioningView({ initialTaskId, onSelectTab }: ItProvisioningViewProps) {
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

  // Datasets
  const [departments] = useState<ItDepartment[]>(initialItDepartments)
  const [batches, setBatches] = useState<ItBatch[]>(initialItBatches)
  const [items, setItems] = useState<ItProvisioningItem[]>(initialItProvisioningItems)

  // Navigation hierarchy: Level 1 (Depts) -> Level 2 (Batches) -> Level 3 (Requests) -> Level 4 (Detail)
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null)
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<'all' | ItProvisioningStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals & UI States
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false)
  const [newBatchName, setNewBatchName] = useState('')
  const [newBatchMonth, setNewBatchMonth] = useState('10/2026')
  const [newBatchStartDate, setNewBatchStartDate] = useState('20/10/2026')
  const [newBatchEndDate, setNewBatchEndDate] = useState('31/10/2026')
  const [selectedUnbatchedIds, setSelectedUnbatchedIds] = useState<string[]>([])
  const [batchError, setBatchError] = useState<string | null>(null)

  // Provisioning Action & Branch Simulation
  const [isConfirmGrantOpen, setIsConfirmGrantOpen] = useState(false)
  const [simulatedBranch, setSimulatedBranch] = useState<'success' | 'failed' | 'timeout' | 'handoverError'>('success')
  const [isApiExecuting, setIsApiExecuting] = useState(false)

  // Credential Reveal & Audit Trail Modal
  const [isRevealModalOpen, setIsRevealModalOpen] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Beneficiary Preview Mode (IT-AC-06A)
  const [isBeneficiaryPreviewOpen, setIsBeneficiaryPreviewOpen] = useState(false)

  // Move request between open batches modal
  const [isMoveBatchOpen, setIsMoveBatchOpen] = useState(false)
  const [movingItem, setMovingItem] = useState<ItProvisioningItem | null>(null)
  const [targetBatchId, setTargetBatchId] = useState<string>('')

  // Derived current entities
  const currentDept = departments.find((d) => d.id === selectedDeptId) || null
  const currentBatch = batches.find((b) => b.id === selectedBatchId) || null
  const currentItem = items.find((i) => i.id === selectedItemId) || null

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Handle Creating Batch with Duplication Check
  const handleCreateBatch = () => {
    if (!newBatchName.trim()) {
      setBatchError(t('itAdmin.provisioning.extra.batchNameRequired'))
      return
    }

    const isDuplicate = batches.some(
      (b) =>
        b.departmentId === selectedDeptId &&
        b.month === newBatchMonth &&
        b.name.trim().toLowerCase() === newBatchName.trim().toLowerCase()
    )

    if (isDuplicate) {
      setBatchError(t('itAdmin.provisioning.extra.duplicateBatch', { name: newBatchName, month: newBatchMonth }))
      return
    }

    const newId = `batch-${Date.now()}`
    const createdBatch: ItBatch = {
      id: newId,
      departmentId: selectedDeptId!,
      departmentName: currentDept?.name || '',
      name: newBatchName.trim(),
      month: newBatchMonth,
      startDate: newBatchStartDate,
      endDate: newBatchEndDate,
      status: 'open',
      totalRequests: selectedUnbatchedIds.length,
      readyCount: selectedUnbatchedIds.length,
      inProgressCount: 0,
      completedCount: 0,
      failedCount: 0
    }

    setBatches((prev) => [...prev, createdBatch])

    if (selectedUnbatchedIds.length > 0) {
      setItems((prev) =>
        prev.map((item) => (selectedUnbatchedIds.includes(item.id) ? { ...item, batchId: newId } : item))
      )
    }

    setIsCreateBatchOpen(false)
    setNewBatchName('')
    setSelectedUnbatchedIds([])
    setBatchError(null)
    showToast(t('itAdmin.provisioning.extra.batchCreated', { name: createdBatch.name }))
  }

  // Handle Locking Batch
  const handleToggleLockBatch = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          const nextStatus = b.status === 'open' ? 'locked' : 'open'
          showToast(
            t('itAdmin.provisioning.extra.batchStatusChanged', {
              status:
                nextStatus === 'locked'
                  ? t('itAdmin.provisioning.extra.batchLocked')
                  : t('itAdmin.provisioning.extra.batchOpen')
            })
          )
          return { ...b, status: nextStatus }
        }
        return b
      })
    )
  }

  // Handle Moving Item Between Open Batches
  const handleConfirmMoveBatch = () => {
    if (!movingItem || !targetBatchId) return
    setItems((prev) => prev.map((item) => (item.id === movingItem.id ? { ...item, batchId: targetBatchId } : item)))
    setIsMoveBatchOpen(false)
    setMovingItem(null)
    showToast(t('itAdmin.provisioning.extra.requestMoved'))
  }

  // Handle Execute Provisioning
  const handleExecuteGrant = () => {
    if (!currentItem) return
    setIsApiExecuting(true)

    setTimeout(() => {
      setIsApiExecuting(false)
      setIsConfirmGrantOpen(false)

      const isAccount = currentItem.credentialType === 'account'
      const isKey = currentItem.credentialType === 'apiKey'

      setItems((prev) =>
        prev.map((item) => {
          if (item.id === currentItem.id) {
            return {
              ...item,
              status: 'completed',
              provisioningResult: {
                grantedAt: t('itAdmin.provisioning.extra.todayAt', {
                  time: new Date().toLocaleTimeString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }),
                operatorName: 'Quang Huy (IT Admin)',
                providerRef: `TX-API-VND-${Math.floor(100000 + Math.random() * 900000)}`,
                grantedPlan: `${item.softwareName} - ${item.planName}`,
                accountDetails: isAccount
                  ? {
                      username: item.beneficiaryEmail,
                      initialPassword: 'Cp8$kL2#mP9@vX7!',
                      setupLink: 'https://auth.company.com/portal/credential/init-token-4819',
                      activated: true
                    }
                  : undefined,
                apiKeyDetails: isKey
                  ? {
                      keyName: `${item.softwareName.toUpperCase().replace(/\s+/g, '_')}_LIVE_KEY`,
                      maskedKey: 'sk-live-••••-••••-9842',
                      fullKey: 'sk-live-demo-token-998240182471928410948',
                      createdAt: '23/10/2026',
                      expiresAt: '23/10/2027',
                      scopes: 'Default Production Scopes, Code Generation & Telemetry'
                    }
                  : undefined,
                directAccessDetails:
                  !isAccount && !isKey
                    ? {
                        accountId: item.beneficiaryEmail,
                        workspaceId: 'company-org-workspace',
                        status: t('itAdmin.provisioning.extra.ssoAssigned')
                      }
                    : undefined
              },
              auditTrail: [
                ...item.auditTrail,
                {
                  timestamp: new Date().toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US'),
                  action: t('itAdmin.provisioning.extra.provisioningSucceeded'),
                  actor: 'Quang Huy (IT Admin)',
                  details: t('itAdmin.provisioning.extra.oneUnitGranted', {
                    unit: unitLabel(item.unit),
                    beneficiary: item.beneficiaryName
                  })
                }
              ]
            }
          }
          return item
        })
      )
      showToast(t('itAdmin.provisioning.extra.grantRecorded'))
    }, 500)
  }

  // Handle Check Status for Timeout requests
  const handleCheckStatus = (item: ItProvisioningItem) => {
    showToast(t('itAdmin.provisioning.extra.checkingVendor'))
    setTimeout(() => {
      setItems((prev) =>
        prev.map((i) => {
          if (i.id === item.id) {
            return {
              ...i,
              status: 'ready',
              provisioningResult: undefined,
              auditTrail: [
                ...i.auditTrail,
                {
                  timestamp: new Date().toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US'),
                  action: t('itAdmin.provisioning.extra.vendorChecked'),
                  actor: 'Quang Huy (IT Admin)',
                  details: t('itAdmin.provisioning.extra.vendorNotActivated')
                }
              ]
            }
          }
          return i
        })
      )
      showToast(t('itAdmin.provisioning.extra.vendorCheckComplete'))
    }, 1000)
  }

  // Handle Recover Handover
  const handleRecoverHandover = (item: ItProvisioningItem) => {
    showToast(t('itAdmin.provisioning.extra.restoringHandover'))
    setTimeout(() => {
      setItems((prev) =>
        prev.map((i) => {
          if (i.id === item.id) {
            return {
              ...i,
              status: 'completed',
              provisioningResult: {
                ...i.provisioningResult,
                grantedAt: new Date().toLocaleString('vi-VN'),
                operatorName: 'Quang Huy (IT Admin)',
                apiKeyDetails: {
                  keyName: 'CLAUDE_PRO_5X_KEY',
                  maskedKey: 'sk-ant-••••-••••-1192',
                  fullKey: 'sk-ant-api03-recovered-key-9982410',
                  createdAt: '23/10/2026',
                  expiresAt: '23/10/2027',
                  scopes: 'All Pro models'
                }
              },
              auditTrail: [
                ...i.auditTrail,
                {
                  timestamp: new Date().toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US'),
                  action: t('itAdmin.provisioning.extra.restoreHandover'),
                  actor: 'Quang Huy (IT Admin)',
                  details: t('itAdmin.provisioning.extra.secretsRestored')
                }
              ]
            }
          }
          return i
        })
      )
      showToast(t('itAdmin.provisioning.extra.handoverRestored'))
    }, 1200)
  }

  // Group items by Beneficiary for IT-03
  const filteredItemsInBatch = items.filter((item) => {
    if (selectedBatchId === 'unbatched') {
      if (item.batchId !== null || item.departmentId !== selectedDeptId) return false
    } else if (selectedBatchId) {
      if (item.batchId !== selectedBatchId) return false
    } else {
      if (item.departmentId !== selectedDeptId) return false
    }

    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        item.beneficiaryName.toLowerCase().includes(q) ||
        item.softwareName.toLowerCase().includes(q) ||
        item.planName.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  const groupedBeneficiaries = filteredItemsInBatch.reduce<Record<string, ItProvisioningItem[]>>((acc, item) => {
    const key = `${item.beneficiaryName}__${item.beneficiaryEmail}`
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  const unbatchedItemsInDept = items.filter((item) => item.departmentId === selectedDeptId && item.batchId === null)

  return (
    <div className='space-y-6'>
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-success/40 bg-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl'>
          <CheckCircle2 className='size-5 text-success shrink-0' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
        </div>
      )}

      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
          <span className='size-2 rounded-full bg-primary' />
          {t('itAdmin.provisioning.extra.kicker')}
        </div>
        <h1 className='mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {t('itAdmin.provisioning.extra.title')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.provisioning.extra.intro')}</p>
      </div>

      <nav aria-label='Breadcrumb' className='flex items-center gap-2 text-sm text-muted-foreground'>
        <button
          className={`font-semibold hover:text-foreground transition ${
            !selectedDeptId ? 'text-primary font-bold' : ''
          }`}
          onClick={() => {
            setSelectedDeptId(null)
            setSelectedBatchId(null)
            setSelectedItemId(null)
          }}
          type='button'
        >
          {t('itAdmin.provisioning.extra.departments')}
        </button>

        {currentDept && (
          <>
            <ChevronRight className='size-4' />
            <button
              className={`font-semibold hover:text-foreground transition ${
                selectedDeptId && !selectedBatchId && !selectedItemId ? 'text-primary font-bold' : ''
              }`}
              onClick={() => {
                setSelectedBatchId(null)
                setSelectedItemId(null)
              }}
              type='button'
            >
              {itAdminDepartmentLabel(currentDept.name)}
            </button>
          </>
        )}

        {selectedBatchId && (
          <>
            <ChevronRight className='size-4' />
            <button
              className={`font-semibold hover:text-foreground transition ${
                selectedBatchId && !selectedItemId ? 'text-primary font-bold' : ''
              }`}
              onClick={() => setSelectedItemId(null)}
              type='button'
            >
              {selectedBatchId === 'unbatched'
                ? t('itAdmin.provisioning.extra.unassigned')
                : batchLabel(currentBatch)}
            </button>
          </>
        )}

        {currentItem && (
          <>
            <ChevronRight className='size-4' />
            <span className='font-bold text-foreground'>
              {currentItem.softwareName} ({currentItem.beneficiaryName})
            </span>
          </>
        )}
      </nav>

      {currentItem ? (
        <ProvisioningItemDetail
          currentBatch={currentBatch}
          currentItem={currentItem}
          isRevealed={isRevealed}
          onBack={() => setSelectedItemId(null)}
          onCheckStatus={handleCheckStatus}
          onOpenBeneficiaryPreview={() => setIsBeneficiaryPreviewOpen(true)}
          onOpenConfirmGrant={() => setIsConfirmGrantOpen(true)}
          onOpenRevealModal={() => setIsRevealModalOpen(true)}
          onRecoverHandover={handleRecoverHandover}
          onSelectTab={onSelectTab}
          setIsRevealed={setIsRevealed}
          showToast={showToast}
        />
      ) : selectedBatchId ? (
        <ProvisioningRequestsList
          currentBatch={currentBatch}
          currentDept={currentDept}
          groupedBeneficiaries={groupedBeneficiaries}
          onBack={() => setSelectedBatchId(null)}
          onOpenMoveBatch={(item) => {
            setMovingItem(item)
            setIsMoveBatchOpen(true)
          }}
          onSelectItem={(itemId) => setSelectedItemId(itemId)}
          onToggleLockBatch={handleToggleLockBatch}
          searchQuery={searchQuery}
          selectedBatchId={selectedBatchId}
          setSearchQuery={setSearchQuery}
          setStatusFilter={setStatusFilter}
          statusFilter={statusFilter}
        />
      ) : selectedDeptId ? (
        <ProvisioningBatchList
          batchLabel={batchLabel}
          batches={batches}
          currentDept={currentDept}
          onBack={() => setSelectedDeptId(null)}
          onOpenCreateBatch={() => {
            setNewBatchName(
              t('itAdmin.provisioning.extra.batchDefaultName', {
                number: batches.filter((b) => b.departmentId === selectedDeptId).length + 1
              })
            )
            setIsCreateBatchOpen(true)
          }}
          onSelectBatch={(batchId: string) => setSelectedBatchId(batchId)}
          onToggleLockBatch={handleToggleLockBatch}
          selectedDeptId={selectedDeptId}
          unbatchedItemsInDept={unbatchedItemsInDept}
        />
      ) : (
        <ProvisioningDeptList
          departments={departments}
          onSelectDept={(deptId) => setSelectedDeptId(deptId)}
        />
      )}

      <ProvisioningModals
        batches={batches}
        batchError={batchError}
        currentItem={currentItem}
        isApiExecuting={isApiExecuting}
        isBeneficiaryPreviewOpen={isBeneficiaryPreviewOpen}
        isConfirmGrantOpen={isConfirmGrantOpen}
        isCreateBatchOpen={isCreateBatchOpen}
        isMoveBatchOpen={isMoveBatchOpen}
        isRevealModalOpen={isRevealModalOpen}
        movingItem={movingItem}
        newBatchEndDate={newBatchEndDate}
        newBatchMonth={newBatchMonth}
        newBatchName={newBatchName}
        newBatchStartDate={newBatchStartDate}
        onConfirmGrant={handleExecuteGrant}
        onConfirmMoveBatch={handleConfirmMoveBatch}
        onCreateBatch={handleCreateBatch}
        selectedDeptId={selectedDeptId}
        selectedUnbatchedIds={selectedUnbatchedIds}
        setIsBeneficiaryPreviewOpen={setIsBeneficiaryPreviewOpen}
        setIsConfirmGrantOpen={setIsConfirmGrantOpen}
        setIsCreateBatchOpen={setIsCreateBatchOpen}
        setIsMoveBatchOpen={setIsMoveBatchOpen}
        setIsRevealModalOpen={setIsRevealModalOpen}
        setIsRevealed={setIsRevealed}
        setNewBatchEndDate={setNewBatchEndDate}
        setNewBatchMonth={setNewBatchMonth}
        setNewBatchName={setNewBatchName}
        setNewBatchStartDate={setNewBatchStartDate}
        setSelectedUnbatchedIds={setSelectedUnbatchedIds}
        setSimulatedBranch={setSimulatedBranch}
        setTargetBatchId={setTargetBatchId}
        showToast={showToast}
        simulatedBranch={simulatedBranch}
        targetBatchId={targetBatchId}
        unbatchedItemsInDept={unbatchedItemsInDept}
      />
    </div>
  )
}
