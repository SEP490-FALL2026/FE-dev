import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Boxes,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  FolderOpen,
  Info,
  Key,
  Layers,
  Lock,
  Package,
  PackageCheck,
  RefreshCw,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Unlock,
  User,
  UserCheck,
  Users,
  WifiOff,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  initialItDepartments,
  initialItBatches,
  initialItProvisioningItems,
  type ItDepartment,
  type ItBatch,
  type ItProvisioningItem,
  type ItProvisioningStatus
} from '../it-admin-data'
import type { ItAdminTabKey } from '../it-admin-nav'

export type ItProvisioningViewProps = {
  initialTaskId?: string
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItProvisioningView({ initialTaskId, onSelectTab }: ItProvisioningViewProps) {
  const { t } = useTranslation('dashboard')

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

  // Handle status labels & styling
  const getStatusBadge = (status: ItProvisioningStatus) => {
    switch (status) {
      case 'ready':
        return {
          label: 'Sẵn sàng cấp',
          tone: 'border-success/30 bg-success/10 text-success'
        }
      case 'inProgress':
        return {
          label: 'Đang cấp',
          tone: 'border-primary/30 bg-primary/10 text-primary animate-pulse'
        }
      case 'needsCheck':
        return {
          label: 'Cần kiểm tra kết quả',
          tone: 'border-warning/30 bg-warning/10 text-warning'
        }
      case 'needsHandover':
        return {
          label: 'Cần xử lý bàn giao',
          tone: 'border-warning/30 bg-warning/15 text-warning font-bold'
        }
      case 'failed':
        return {
          label: 'Cấp thất bại',
          tone: 'border-danger/30 bg-danger/10 text-danger'
        }
      case 'completed':
        return {
          label: 'Hoàn thành',
          tone: 'border-border bg-surface-subtle text-muted-foreground'
        }
      case 'pendingConfig':
        return {
          label: 'Chờ cấu hình/mua',
          tone: 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
        }
    }
  }

  // Handle Creating Batch with Duplication Check
  const handleCreateBatch = () => {
    if (!newBatchName.trim()) {
      setBatchError('Vui lòng nhập tên đợt.')
      return
    }

    // Check duplicate in same dept & month
    const isDuplicate = batches.some(
      (b) =>
        b.departmentId === selectedDeptId &&
        b.month === newBatchMonth &&
        b.name.trim().toLowerCase() === newBatchName.trim().toLowerCase()
    )

    if (isDuplicate) {
      setBatchError(`Tên đợt "${newBatchName}" đã tồn tại trong ${newBatchMonth} của phòng ban này.`)
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

    // Assign selected items to this batch
    if (selectedUnbatchedIds.length > 0) {
      setItems((prev) =>
        prev.map((item) => (selectedUnbatchedIds.includes(item.id) ? { ...item, batchId: newId } : item))
      )
    }

    setIsCreateBatchOpen(false)
    setNewBatchName('')
    setSelectedUnbatchedIds([])
    setBatchError(null)
    showToast(`Đã tạo thành công đợt "${createdBatch.name}"!`)
  }

  // Handle Locking Batch
  const handleToggleLockBatch = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          const nextStatus = b.status === 'open' ? 'locked' : 'open'
          showToast(`Đã chuyển trạng thái đợt sang ${nextStatus === 'locked' ? 'Đã khóa' : 'Đang mở'}`)
          return { ...b, status: nextStatus }
        }
        return b
      })
    )
  }

  // Handle Moving Item Between Open Batches
  const handleConfirmMoveBatch = () => {
    if (!movingItem || !targetBatchId) return
    setItems((prev) =>
      prev.map((item) => (item.id === movingItem.id ? { ...item, batchId: targetBatchId } : item))
    )
    setIsMoveBatchOpen(false)
    setMovingItem(null)
    showToast(`Đã chuyển yêu cầu sang đợt mới thành công!`)
  }

  // Handle Execute Provisioning
  const handleExecuteGrant = () => {
    if (!currentItem) return
    setIsApiExecuting(true)

    // Execute provisioning with short delay
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
                grantedAt: 'Hôm nay lúc ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
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
                        status: 'Gán seat SSO hoàn tất'
                      }
                    : undefined
              },
              auditTrail: [
                ...item.auditTrail,
                {
                  timestamp: new Date().toLocaleString('vi-VN'),
                  action: 'Cấp phát thành công',
                  actor: 'Quang Huy (IT Admin)',
                  details: `Đã cấp đúng 1 đơn vị ${item.unit} cho ${item.beneficiaryName}`
                }
              ]
            }
          }
          return item
        })
      )
      showToast('Cấp phát thành công! Đã ghi nhận bản ghi để đối chiếu với hóa đơn mua.')
    }, 500)
  }

  // Handle Check Status for Timeout requests
  const handleCheckStatus = (item: ItProvisioningItem) => {
    showToast('Đang gọi API đối soát trạng thái giao dịch với Vendor...')
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
                  timestamp: new Date().toLocaleString('vi-VN'),
                  action: 'Đối soát xác nhận',
                  actor: 'Quang Huy (IT Admin)',
                  details: 'Đã xác nhận phía Vendor CHƯA kích hoạt. Yêu cầu trở về trạng thái Sẵn sàng cấp'
                }
              ]
            }
          }
          return i
        })
      )
      showToast('Xác nhận Vendor chưa cấp! Đã mở khóa trạng thái Sẵn sàng cấp an toàn.')
    }, 1000)
  }

  // Handle Recover Handover
  const handleRecoverHandover = (item: ItProvisioningItem) => {
    showToast('Đang khôi phục và mã hóa thông tin credential từ Vendor API...')
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
                  timestamp: new Date().toLocaleString('vi-VN'),
                  action: 'Khôi phục bàn giao',
                  actor: 'Quang Huy (IT Admin)',
                  details: 'Đã đồng bộ lại bí mật từ Vendor và lưu trữ an toàn'
                }
              ]
            }
          }
          return i
        })
      )
      showToast('Khôi phục bàn giao thành công! Thông tin đã lưu an toàn.')
    }, 1200)
  }

  // Group items by Beneficiary for IT-03
  const filteredItemsInBatch = items.filter((item) => {
    // If a batch is selected
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

  // Group by Beneficiary
  const groupedBeneficiaries = filteredItemsInBatch.reduce<Record<string, ItProvisioningItem[]>>(
    (acc, item) => {
      const key = `${item.beneficiaryName}__${item.beneficiaryEmail}`
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    },
    {}
  )

  const unbatchedItemsInDept = items.filter(
    (item) => item.departmentId === selectedDeptId && item.batchId === null
  )

  return (
    <div className='space-y-6'>
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-success/40 bg-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl'>
          <CheckCircle2 className='size-5 text-success shrink-0' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
        </div>
      )}

      {/* Prototype Banner */}
      {/* Header */}
      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
          <span className='size-2 rounded-full bg-primary' />
          Hàng đợi cấp phát & thu hồi bản quyền
        </div>
        <h1 className='mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          Cấp phát & Phân bổ Bản quyền Phần mềm
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Quy trình xử lý theo từng phòng ban, đợt phê duyệt và nhân sự thụ hưởng; tự động đồng bộ số liệu sang kiểm tra sai lệch bản quyền.
        </p>
      </div>

      {/* Breadcrumb Navigation */}
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
          Danh sách phòng ban
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
              {currentDept.name}
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
              {selectedBatchId === 'unbatched' ? 'Chưa xếp đợt' : currentBatch?.name || 'Đợt'}
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

      {/* ========================================================================= */}
      {/* LEVEL 4: CHI TIẾT YÊU CẦU & CẤP PHÁT TÀI KHOẢN                             */}
      {/* ========================================================================= */}
      {currentItem ? (
        <div className='space-y-6'>
          {/* Prominent Back Button */}
          <div className='flex items-center gap-3'>
            <button
              className='inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground transition hover:bg-surface-subtle shadow-sm'
              onClick={() => setSelectedItemId(null)}
              type='button'
            >
              <ArrowLeft className='size-4 text-primary' />
              <span>Quay lại danh sách yêu cầu</span>
            </button>
          </div>

          {/* Top Bar for Level 4 */}
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <div className='flex items-center gap-2'>
                <span className='text-xs font-mono font-bold text-muted-foreground'>{currentItem.id}</span>
                {currentItem.originalRequestId !== currentItem.id && (
                  <span className='rounded-md bg-surface-subtle px-2 py-0.5 text-[0.65rem] font-bold text-muted-foreground'>
                    Đề nghị gốc: {currentItem.originalRequestId}
                  </span>
                )}
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold ${getStatusBadge(currentItem.status).tone}`}>
                  {getStatusBadge(currentItem.status).label}
                </span>
              </div>
              <h1 className='text-xl font-bold tracking-tight text-foreground sm:text-2xl mt-1'>
                {currentItem.softwareName} — {currentItem.planName}
              </h1>
            </div>

            <div className='flex items-center gap-3'>
              {/* Beneficiary Preview Mode button */}
              {currentItem.status === 'completed' && (
                <button
                  className='flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary transition hover:bg-primary/20'
                  onClick={() => setIsBeneficiaryPreviewOpen(true)}
                  type='button'
                >
                  <UserCheck className='size-4' />
                  <span>Xem giao diện người nhận</span>
                </button>
              )}

              {/* Action Buttons based on Status */}
              {currentItem.status === 'ready' && (
                <button
                  className='flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition hover:bg-primary/90'
                  onClick={() => setIsConfirmGrantOpen(true)}
                  type='button'
                >
                  <PackageCheck className='size-4' />
                  <span>Cấp gói ngay</span>
                </button>
              )}

              {currentItem.status === 'failed' && (
                <button
                  className='flex items-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-danger/90'
                  onClick={() => setIsConfirmGrantOpen(true)}
                  type='button'
                >
                  <RefreshCw className='size-4' />
                  <span>Thử lại cấp phát</span>
                </button>
              )}

              {currentItem.status === 'needsCheck' && (
                <button
                  className='flex items-center gap-2 rounded-xl bg-warning px-4 py-2.5 text-xs font-bold text-warning-foreground shadow-md transition hover:bg-warning/90'
                  onClick={() => handleCheckStatus(currentItem)}
                  type='button'
                >
                  <RefreshCw className='size-4' />
                  <span>Kiểm tra lại trạng thái</span>
                </button>
              )}

              {currentItem.status === 'needsHandover' && (
                <button
                  className='flex items-center gap-2 rounded-xl bg-warning px-4 py-2.5 text-xs font-bold text-warning-foreground shadow-md transition hover:bg-warning/90'
                  onClick={() => handleRecoverHandover(currentItem)}
                  type='button'
                >
                  <Lock className='size-4' />
                  <span>Khôi phục bàn giao</span>
                </button>
              )}

              {currentItem.status === 'pendingConfig' && (
                <div className='flex items-center gap-2'>
                  <button
                    className='rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-subtle'
                    onClick={() => onSelectTab && onSelectTab('reconciliation')}
                    type='button'
                  >
                    Xem Đối chiếu mua sắm
                  </button>
                  <button
                    className='rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-subtle'
                    onClick={() => onSelectTab && onSelectTab('usage-import')}
                    type='button'
                  >
                    Nhập hóa đơn & Hợp đồng
                  </button>
                  <button
                    className='rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90'
                    onClick={() => onSelectTab && onSelectTab('dept-catalog')}
                    type='button'
                  >
                    Cấu hình danh mục gói
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reconciliation Sync Notification Card when completed */}
          {currentItem.status === 'completed' && (
            <div className='rounded-2xl border border-success/30 bg-success/5 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4'>
              <div className='flex items-center gap-3.5'>
                <div className='grid size-10 place-items-center rounded-xl bg-success/20 text-success shrink-0'>
                  <CheckCircle2 className='size-5' />
                </div>
                <div>
                  <h4 className='text-sm font-bold text-foreground'>
                    Đã cấp thành công 1 {currentItem.unit} cho {currentItem.beneficiaryName}
                  </h4>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    Bản ghi cấp phát này đã được lưu vào hệ thống để đối chiếu tự động với các hóa đơn/hợp đồng gói mua của IT Admin.
                  </p>
                </div>
              </div>
              <button
                className='flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90'
                onClick={() => onSelectTab && onSelectTab('reconciliation')}
                type='button'
              >
                <Scale className='size-4' />
                <span>Kiểm tra sai lệch bản quyền</span>
              </button>
            </div>
          )}

          {/* Feasibility Warning Box if blocked */}
          {!currentItem.feasibility.isApiReady || currentItem.feasibility.purchasedRemaining <= 0 || !currentItem.feasibility.isConfigured ? (
            <div className='rounded-2xl border border-warning/30 bg-warning/10 p-5'>
              <div className='flex items-start gap-3'>
                <AlertTriangle className='size-5 text-warning shrink-0 mt-0.5' />
                <div className='space-y-1 text-xs'>
                  <p className='font-bold text-foreground text-sm'>Nút cấp gói bị khóa do chưa đủ điều kiện cấp phát:</p>
                  <p className='text-muted-foreground'>
                    {currentItem.feasibility.blockReason ||
                      'Gói chưa sẵn sàng quyền sử dụng đã mua hoặc cấu hình kết nối API đang ở trạng thái Nháp.'}
                  </p>
                  <div className='flex flex-wrap items-center gap-3 pt-2'>
                    <button
                      className='font-bold text-primary underline underline-offset-4 hover:opacity-80'
                      onClick={() => onSelectTab && onSelectTab('reconciliation')}
                      type='button'
                    >
                      → Mở Kiểm tra sai lệch bản quyền
                    </button>
                    <button
                      className='font-bold text-primary underline underline-offset-4 hover:opacity-80'
                      onClick={() => onSelectTab && onSelectTab('dept-catalog')}
                      type='button'
                    >
                      → Mở Cấu hình danh mục phòng ban
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Details Grid */}
          <div className='grid gap-6 lg:grid-cols-3'>
            {/* Left 2 Cols: Main Request & Provisioning Info */}
            <div className='space-y-6 lg:col-span-2'>
              {/* Card 1: Beneficiary & Request Info */}
              <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
                <h3 className='text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground'>
                  Thông tin người thụ hưởng & Yêu cầu
                </h3>
                <div className='grid gap-4 sm:grid-cols-2 text-xs'>
                  <div>
                    <span className='text-muted-foreground'>Người thụ hưởng quyền sử dụng:</span>
                    <p className='font-bold text-foreground text-sm mt-0.5'>{currentItem.beneficiaryName}</p>
                    <p className='text-muted-foreground'>{currentItem.beneficiaryEmail}</p>
                    <p className='text-muted-foreground mt-0.5 italic'>{currentItem.beneficiaryRole}</p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Người gửi đề nghị:</span>
                    <p className='font-bold text-foreground text-sm mt-0.5'>{currentItem.requesterName}</p>
                    <p className='text-muted-foreground'>{currentItem.requesterEmail}</p>
                    <p className='text-muted-foreground mt-0.5'>Ngày gửi: {currentItem.submittedAt}</p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Phòng ban & Cơ cấu:</span>
                    <p className='font-semibold text-foreground mt-0.5'>{currentItem.departmentName}</p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Đợt yêu cầu:</span>
                    <p className='font-semibold text-foreground mt-0.5'>
                      {currentItem.batchId ? currentBatch?.name || 'Đợt trong phòng' : 'Chưa xếp đợt'}
                    </p>
                  </div>
                </div>

                <div className='pt-3 border-t border-border/60 text-xs'>
                  <span className='text-muted-foreground'>Mục đích sử dụng:</span>
                  <p className='mt-1 text-foreground bg-surface-subtle p-3 rounded-xl border border-border/50 leading-relaxed'>
                    {currentItem.purpose}
                  </p>
                </div>
              </div>

              {/* Card 2: Package & Entitlement Feasibility */}
              <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
                <h3 className='text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground'>
                  Gói xin cấp & Khả năng đáp ứng
                </h3>
                <div className='grid gap-4 sm:grid-cols-3 text-xs'>
                  <div>
                    <span className='text-muted-foreground'>Phần mềm / AI Agent:</span>
                    <p className='font-bold text-foreground text-sm mt-0.5'>{currentItem.softwareName}</p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Gói xin cấp:</span>
                    <p className='font-bold text-primary text-sm mt-0.5'>{currentItem.planName}</p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Số lượng cấp:</span>
                    <p className='font-bold text-foreground text-sm mt-0.5'>
                      1 {currentItem.unit} (Đúng 1 đơn vị)
                    </p>
                  </div>
                </div>

                <div className='grid gap-3 sm:grid-cols-3 pt-3 border-t border-border/60 text-xs'>
                  <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                    <span className='text-muted-foreground'>Cấu hình danh mục:</span>
                    <p className={`font-bold mt-1 ${currentItem.feasibility.isConfigured ? 'text-success' : 'text-danger'}`}>
                      {currentItem.feasibility.isConfigured ? 'Đã cấu hình hợp lệ' : 'Chưa cấu hình'}
                    </p>
                  </div>
                  <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                    <span className='text-muted-foreground'>Quyền đã mua còn hiệu lực:</span>
                    <p className={`font-bold mt-1 ${currentItem.feasibility.purchasedRemaining > 0 ? 'text-success' : 'text-danger'}`}>
                      {currentItem.feasibility.purchasedRemaining > 0
                        ? `Còn ${currentItem.feasibility.purchasedRemaining} ${currentItem.unit}`
                        : 'Hết quyền sử dụng'}
                    </p>
                  </div>
                  <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                    <span className='text-muted-foreground'>API cấp phát tự động:</span>
                    <p className={`font-bold mt-1 ${currentItem.feasibility.isApiReady ? 'text-success' : 'text-warning'}`}>
                      {currentItem.feasibility.isApiReady ? 'Sẵn sàng kết nối' : 'Chưa sẵn sàng'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Post-grant Credential Info (Section 3.4 & IT-AC-06) */}
              {currentItem.provisioningResult && (
                <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground'>
                        Thông tin đã cấp phát (Bảo mật)
                      </h3>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        Cấp lúc: {currentItem.provisioningResult.grantedAt} · Người thao tác: {currentItem.provisioningResult.operatorName}
                      </p>
                    </div>
                    {currentItem.provisioningResult.providerRef && (
                      <span className='font-mono text-xs rounded-md bg-surface-subtle px-2 py-1 border border-border text-muted-foreground'>
                        Ref: {currentItem.provisioningResult.providerRef}
                      </span>
                    )}
                  </div>

                  {/* Account Type */}
                  {currentItem.provisioningResult.accountDetails && (
                    <div className='rounded-xl border border-border bg-surface-subtle p-4 space-y-3 text-xs'>
                      <div className='grid gap-3 sm:grid-cols-2'>
                        <div>
                          <span className='text-muted-foreground'>Tên đăng nhập / Email:</span>
                          <p className='font-mono font-bold text-foreground mt-0.5'>
                            {currentItem.provisioningResult.accountDetails.username}
                          </p>
                        </div>
                        <div>
                          <span className='text-muted-foreground'>Mật khẩu khởi tạo:</span>
                          <div className='flex items-center gap-2 mt-0.5'>
                            <span className='font-mono font-bold text-foreground'>
                              {isRevealed
                                ? currentItem.provisioningResult.accountDetails.initialPassword
                                : '••••••••••••••••'}
                            </span>
                            <button
                              className='rounded-md border border-border bg-surface p-1.5 text-xs text-muted-foreground hover:text-foreground'
                              onClick={() => {
                                if (!isRevealed) setIsRevealModalOpen(true)
                                else setIsRevealed(false)
                              }}
                              title={isRevealed ? 'Ẩn mật khẩu' : 'Hiện mật khẩu (Có kiểm tra quyền)'}
                              type='button'
                            >
                              {isRevealed ? <EyeOff className='size-3.5' /> : <Eye className='size-3.5' />}
                            </button>
                            {isRevealed && (
                              <button
                                className='rounded-md border border-border bg-surface p-1.5 text-xs text-muted-foreground hover:text-foreground'
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    currentItem.provisioningResult?.accountDetails?.initialPassword || ''
                                  )
                                  showToast('Đã sao chép mật khẩu an toàn!')
                                }}
                                title='Sao chép'
                                type='button'
                              >
                                <Copy className='size-3.5' />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {currentItem.provisioningResult.accountDetails.setupLink && (
                        <div className='pt-2 border-t border-border/40'>
                          <span className='text-muted-foreground'>Liên kết kích hoạt an toàn:</span>
                          <p className='font-mono text-[0.7rem] text-primary truncate mt-0.5'>
                            {currentItem.provisioningResult.accountDetails.setupLink}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* API Key Type */}
                  {currentItem.provisioningResult.apiKeyDetails && (
                    <div className='rounded-xl border border-border bg-surface-subtle p-4 space-y-3 text-xs'>
                      <div className='grid gap-3 sm:grid-cols-2'>
                        <div>
                          <span className='text-muted-foreground'>Tên Key định danh:</span>
                          <p className='font-mono font-bold text-foreground mt-0.5'>
                            {currentItem.provisioningResult.apiKeyDetails.keyName}
                          </p>
                        </div>
                        <div>
                          <span className='text-muted-foreground'>Mã khóa bí mật API:</span>
                          <div className='flex items-center gap-2 mt-0.5'>
                            <span className='font-mono font-bold text-foreground'>
                              {isRevealed
                                ? currentItem.provisioningResult.apiKeyDetails.fullKey
                                : currentItem.provisioningResult.apiKeyDetails.maskedKey}
                            </span>
                            <button
                              className='rounded-md border border-border bg-surface p-1.5 text-xs text-muted-foreground hover:text-foreground'
                              onClick={() => {
                                if (!isRevealed) setIsRevealModalOpen(true)
                                else setIsRevealed(false)
                              }}
                              title={isRevealed ? 'Ẩn key' : 'Hiện key (Có kiểm tra quyền)'}
                              type='button'
                            >
                              {isRevealed ? <EyeOff className='size-3.5' /> : <Eye className='size-3.5' />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='pt-2 border-t border-border/40 text-[0.7rem] text-muted-foreground'>
                        Hạn dùng: {currentItem.provisioningResult.apiKeyDetails.expiresAt} · Phạm vi: {currentItem.provisioningResult.apiKeyDetails.scopes}
                      </div>
                    </div>
                  )}

                  {/* Direct Access / SSO Seat */}
                  {currentItem.provisioningResult.directAccessDetails && (
                    <div className='rounded-xl border border-border bg-surface-subtle p-4 text-xs'>
                      <span className='text-muted-foreground'>Trạng thái phân quyền SSO:</span>
                      <p className='font-bold text-success mt-1'>
                        {currentItem.provisioningResult.directAccessDetails.status}
                      </p>
                      <p className='text-muted-foreground mt-0.5'>
                        Định danh tài khoản: {currentItem.provisioningResult.directAccessDetails.accountId} · Workspace: {currentItem.provisioningResult.directAccessDetails.workspaceId}
                      </p>
                    </div>
                  )}

                  {/* Error & Recovery Note */}
                  {currentItem.provisioningResult.lastError && (
                    <div className='rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs space-y-1'>
                      <span className='font-bold text-danger'>Lỗi từ API nhà cung cấp:</span>
                      <p className='text-muted-foreground font-mono'>{currentItem.provisioningResult.lastError}</p>
                    </div>
                  )}
                  {currentItem.provisioningResult.recoveryGuide && (
                    <div className='rounded-xl border border-warning/30 bg-warning/10 p-4 text-xs space-y-1'>
                      <span className='font-bold text-warning'>Hướng dẫn xử lý bàn giao:</span>
                      <p className='text-foreground'>{currentItem.provisioningResult.recoveryGuide}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Col: Audit Trail & Fast Actions */}
            <div className='space-y-6'>
              {/* Audit Trail Card */}
              <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
                <h3 className='text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground'>
                  Lịch sử vết tác vụ (Audit Trail)
                </h3>
                <div className='space-y-3'>
                  {currentItem.auditTrail.map((log, idx) => (
                    <div className='relative pl-4 border-l-2 border-border/80 text-xs space-y-1' key={idx}>
                      <span className='size-2 rounded-full bg-primary absolute -left-[5px] top-1' />
                      <div className='flex items-center justify-between text-[0.7rem] text-muted-foreground'>
                        <span>{log.timestamp}</span>
                        <span className='font-bold'>{log.actor}</span>
                      </div>
                      <p className='font-bold text-foreground'>{log.action}</p>
                      <p className='text-muted-foreground leading-relaxed'>{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : selectedBatchId ? (
        /* ========================================================================= */
        /* LEVEL 3: IT-03 NHÂN VIÊN VÀ YÊU CẦU TRONG ĐỢT                             */
        /* ========================================================================= */
        <div className='space-y-6'>
          {/* Prominent Back Button */}
          <div className='flex items-center gap-3'>
            <button
              className='inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground transition hover:bg-surface-subtle shadow-sm'
              onClick={() => setSelectedBatchId(null)}
              type='button'
            >
              <ArrowLeft className='size-4 text-primary' />
              <span>Quay lại danh sách các đợt ({currentDept?.name})</span>
            </button>
          </div>

          {/* Header of Batch */}
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <div className='flex items-center gap-2'>
                <span className='rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-bold text-muted-foreground'>
                  {currentDept?.name}
                </span>
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold ${
                  currentBatch?.status === 'locked'
                    ? 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
                    : 'border-success/30 bg-success/10 text-success'
                }`}>
                  {currentBatch?.status === 'locked' ? 'Đã khóa đợt' : 'Đang mở nhận yêu cầu'}
                </span>
              </div>
              <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1'>
                {selectedBatchId === 'unbatched' ? 'Hàng đợi Chưa xếp đợt' : currentBatch?.name}
              </h1>
              {currentBatch && (
                <p className='text-xs text-muted-foreground mt-0.5'>
                  Khoảng ngày hiệu lực: {currentBatch.startDate} – {currentBatch.endDate} · Tháng {currentBatch.month}
                </p>
              )}
            </div>

            <div className='flex items-center gap-3'>
              {currentBatch && (
                <button
                  className='flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground transition hover:bg-surface-subtle'
                  onClick={() => handleToggleLockBatch(currentBatch.id)}
                  type='button'
                >
                  {currentBatch.status === 'open' ? (
                    <>
                      <Lock className='size-4 text-warning' />
                      <span>Khóa đợt này</span>
                    </>
                  ) : (
                    <>
                      <Unlock className='size-4 text-success' />
                      <span>Mở khóa đợt</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm'>
            <div className='flex flex-wrap items-center gap-2'>
              {(
                [
                  { id: 'all', label: 'Tất cả trạng thái' },
                  { id: 'ready', label: 'Sẵn sàng cấp' },
                  { id: 'inProgress', label: 'Đang cấp' },
                  { id: 'needsCheck', label: 'Cần kiểm tra' },
                  { id: 'needsHandover', label: 'Cần bàn giao' },
                  { id: 'failed', label: 'Cấp thất bại' },
                  { id: 'completed', label: 'Hoàn thành' },
                  { id: 'pendingConfig', label: 'Chờ cấu hình' }
                ] as const
              ).map((tab) => (
                <button
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    statusFilter === tab.id
                      ? 'bg-primary text-primary-foreground font-bold shadow'
                      : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                  }`}
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  type='button'
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className='relative w-full sm:w-64'>
              <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
              <input
                className='h-9 w-full rounded-xl border border-border bg-surface-subtle pl-9 pr-4 text-xs outline-none focus:border-primary'
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Tìm theo nhân viên, phần mềm...'
                type='search'
                value={searchQuery}
              />
            </div>
          </div>

          {/* List of Beneficiaries with their items underneath (Section 3.1 & IT-AC-02) */}
          <div className='space-y-4'>
            {Object.keys(groupedBeneficiaries).length === 0 ? (
              <div className='rounded-2xl border border-border bg-surface p-12 text-center text-muted-foreground'>
                <Package className='size-10 mx-auto opacity-40 mb-3' />
                <p className='text-sm font-semibold'>Không có yêu cầu nào phù hợp trong đợt này</p>
                <p className='text-xs mt-1'>Thử chuyển bộ lọc trạng thái hoặc tạo đợt mới</p>
              </div>
            ) : (
              Object.entries(groupedBeneficiaries).map(([beneficiaryKey, userItems]) => {
                const [name, email] = beneficiaryKey.split('__')
                return (
                  <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-3' key={beneficiaryKey}>
                    <div className='flex items-center justify-between pb-3 border-b border-border/60'>
                      <div className='flex items-center gap-3'>
                        <span className='grid size-9 place-items-center rounded-xl bg-primary-soft text-primary font-bold text-xs'>
                          {name.split(' ').slice(-1)[0][0]}
                        </span>
                        <div>
                          <div className='flex items-center gap-2'>
                            <h3 className='text-sm font-bold text-foreground'>{name}</h3>
                            <span className='text-xs text-muted-foreground'>({email})</span>
                          </div>
                          <p className='text-[0.7rem] text-muted-foreground'>{userItems[0].beneficiaryRole}</p>
                        </div>
                      </div>
                      <span className='text-xs font-semibold text-muted-foreground'>
                        {userItems.length} yêu cầu độc lập trong đợt
                      </span>
                    </div>

                    {/* Each item row under the beneficiary */}
                    <div className='space-y-2'>
                      {userItems.map((item) => (
                        <div
                          className='flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-surface-subtle p-3.5 transition hover:border-primary/50'
                          key={item.id}
                        >
                          <div className='flex items-center gap-4 min-w-[280px]'>
                            <div>
                              <div className='flex items-center gap-2'>
                                <span className='text-sm font-bold text-foreground'>{item.softwareName}</span>
                                <span className='rounded-md bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary'>
                                  {item.planName}
                                </span>
                                <span className='rounded-md bg-surface px-1.5 py-0.5 text-[0.65rem] font-bold text-muted-foreground border border-border'>
                                  1 {item.unit}
                                </span>
                              </div>
                              <div className='flex items-center gap-3 mt-1 text-[0.7rem] text-muted-foreground'>
                                <span>Mã: {item.id}</span>
                                <span>Gửi: {item.submittedAt}</span>
                                <span>Loại: {item.unit}</span>
                              </div>
                            </div>
                          </div>

                          <div className='flex items-center gap-3'>
                            {/* Feasibility Alert pill if lacking license */}
                            {item.feasibility.purchasedRemaining <= 0 && (
                              <span className='inline-flex items-center gap-1 rounded-md bg-danger/10 px-2 py-0.5 text-[0.65rem] font-bold text-danger border border-danger/20'>
                                <AlertCircle className='size-3' />
                                <span>Thiếu quyền đã mua</span>
                              </span>
                            )}

                            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold ${getStatusBadge(item.status).tone}`}>
                              {getStatusBadge(item.status).label}
                            </span>

                            {/* Move button if batch is open and not yet started */}
                            {item.status === 'ready' && currentBatch?.status === 'open' && (
                              <button
                                className='rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground'
                                onClick={() => {
                                  setMovingItem(item)
                                  setIsMoveBatchOpen(true)
                                }}
                                title='Chuyển sang đợt khác'
                                type='button'
                              >
                                Đổi đợt
                              </button>
                            )}

                            <button
                              className='flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90'
                              onClick={() => setSelectedItemId(item.id)}
                              type='button'
                            >
                              <span>Chi tiết</span>
                              <ChevronRight className='size-3.5' />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      ) : selectedDeptId ? (
        /* ========================================================================= */
        /* LEVEL 2: IT-02 CÁC ĐỢT CỦA PHÒNG                                          */
        /* ========================================================================= */
        <div className='space-y-6'>
          {/* Prominent Back Button */}
          <div className='flex items-center gap-3'>
            <button
              className='inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground transition hover:bg-surface-subtle shadow-sm'
              onClick={() => setSelectedDeptId(null)}
              type='button'
            >
              <ArrowLeft className='size-4 text-primary' />
              <span>Quay lại danh sách phòng ban</span>
            </button>
          </div>

          {/* Header of Department */}
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <div className='flex items-center gap-2'>
                <span className='rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-bold text-muted-foreground'>
                  Mã: {currentDept?.code}
                </span>
                <span className='text-xs text-muted-foreground'>Trưởng phòng: {currentDept?.managerName}</span>
              </div>
              <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1'>
                Các đợt cấp phát — {currentDept?.name}
              </h1>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Quản lý các đợt theo tháng; gom nhóm yêu cầu để đối chiếu quyền mua và cấp phát đồng bộ
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <button
                className='flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90'
                onClick={() => {
                  setNewBatchName(`Đợt ${batches.filter((b) => b.departmentId === selectedDeptId).length + 1} - tháng 10/2026`)
                  setIsCreateBatchOpen(true)
                }}
                type='button'
              >
                <PackageCheck className='size-4' />
                <span>Tạo đợt yêu cầu mới</span>
              </button>
            </div>
          </div>

          {/* Batches Grid */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {batches
              .filter((b) => b.departmentId === selectedDeptId)
              .map((batch) => (
                <div
                  className='rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md flex flex-col justify-between'
                  key={batch.id}
                >
                  <div>
                    <div className='flex items-center justify-between'>
                      <span className='rounded-md bg-surface-subtle px-2 py-0.5 text-xs font-bold text-muted-foreground border border-border'>
                        Tháng {batch.month}
                      </span>
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.65rem] font-bold ${
                        batch.status === 'locked'
                          ? 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
                          : 'border-success/30 bg-success/10 text-success'
                      }`}>
                        {batch.status === 'locked' ? 'Đã khóa' : 'Đang mở'}
                      </span>
                    </div>

                    <h3 className='text-base font-bold text-foreground mt-3'>{batch.name}</h3>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Thời gian: {batch.startDate} – {batch.endDate}
                    </p>

                    <div className='mt-4 grid grid-cols-3 gap-2 text-center text-xs'>
                      <div className='rounded-xl border border-border bg-surface-subtle p-2'>
                        <span className='text-[0.65rem] text-muted-foreground block'>Tổng số</span>
                        <span className='text-sm font-bold text-foreground'>{batch.totalRequests}</span>
                      </div>
                      <div className='rounded-xl border border-border bg-surface-subtle p-2'>
                        <span className='text-[0.65rem] text-muted-foreground block'>Sẵn sàng</span>
                        <span className='text-sm font-bold text-success'>{batch.readyCount}</span>
                      </div>
                      <div className='rounded-xl border border-border bg-surface-subtle p-2'>
                        <span className='text-[0.65rem] text-muted-foreground block'>Hoàn thành</span>
                        <span className='text-sm font-bold text-foreground'>{batch.completedCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className='mt-5 pt-3 border-t border-border flex items-center justify-between'>
                    <button
                      className='text-xs font-semibold text-muted-foreground hover:text-foreground'
                      onClick={() => handleToggleLockBatch(batch.id)}
                      type='button'
                    >
                      {batch.status === 'open' ? 'Khóa đợt' : 'Mở khóa'}
                    </button>
                    <button
                      className='flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                      onClick={() => setSelectedBatchId(batch.id)}
                      type='button'
                    >
                      <span>Mở đợt</span>
                      <ChevronRight className='size-3.5' />
                    </button>
                  </div>
                </div>
              ))}

            {/* Special Card: Chưa xếp đợt */}
            <div className='rounded-2xl border border-dashed border-border bg-surface/50 p-5 shadow-sm flex flex-col justify-between'>
              <div>
                <span className='rounded-md bg-warning/10 px-2 py-0.5 text-xs font-bold text-warning border border-warning/20'>
                  Chưa xếp đợt
                </span>
                <h3 className='text-base font-bold text-foreground mt-3'>Yêu cầu chờ xếp đợt</h3>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  Các đề nghị đã duyệt nhưng chưa phân bổ vào đợt cấp phát nào
                </p>

                <div className='mt-4 flex items-baseline gap-2'>
                  <span className='text-3xl font-black text-foreground'>{unbatchedItemsInDept.length}</span>
                  <span className='text-xs text-muted-foreground'>yêu cầu đang chờ</span>
                </div>
              </div>

              <div className='mt-5 pt-3 border-t border-border flex items-center justify-end'>
                <button
                  className='flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-foreground shadow-sm hover:bg-surface-subtle'
                  onClick={() => setSelectedBatchId('unbatched')}
                  type='button'
                >
                  <span>Xem nhóm này</span>
                  <ChevronRight className='size-3.5' />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* LEVEL 1: IT-01 HÀNG ĐỢI THEO PHÒNG BAN                                    */
        /* ========================================================================= */
        <div className='space-y-6'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              Danh sách phòng ban cần cấp phát bản quyền
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Xem danh sách phòng ban, số lượng đợt yêu cầu và các bộ đếm trạng thái cấp phát tài khoản
            </p>
          </div>

          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {departments.map((dept) => {
              const hasRequests = dept.totalRequests > 0

              return (
                <div
                  className={`rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between ${
                    hasRequests
                      ? 'border-border bg-surface hover:border-primary/50 hover:shadow-md'
                      : 'border-dashed border-border/80 bg-surface/40'
                  }`}
                  key={dept.id}
                >
                  <div>
                    <div className='flex items-center justify-between'>
                      <span className='rounded-md bg-surface-subtle px-2 py-0.5 text-xs font-mono font-bold text-muted-foreground border border-border'>
                        {dept.code}
                      </span>
                      <span className='text-xs text-muted-foreground'>{dept.batchCount} đợt yêu cầu</span>
                    </div>

                    <h3 className='text-lg font-bold text-foreground mt-3'>{dept.name}</h3>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Trưởng phòng: {dept.managerName} · {dept.managerEmail}
                    </p>

                    {hasRequests ? (
                      <div className='mt-4 grid grid-cols-2 gap-2 text-xs'>
                        <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                          <span className='text-[0.65rem] text-muted-foreground block'>Sẵn sàng cấp</span>
                          <span className='text-base font-bold text-success'>{dept.requestCounts.ready}</span>
                        </div>
                        <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                          <span className='text-[0.65rem] text-muted-foreground block'>Đang cấp / Cần xử lý</span>
                          <span className='text-base font-bold text-warning'>
                            {dept.requestCounts.inProgress + dept.requestCounts.needsCheck + dept.requestCounts.needsHandover}
                          </span>
                        </div>
                        <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                          <span className='text-[0.65rem] text-muted-foreground block'>Cấp thất bại</span>
                          <span className='text-base font-bold text-danger'>{dept.requestCounts.failed}</span>
                        </div>
                        <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                          <span className='text-[0.65rem] text-muted-foreground block'>Hoàn thành</span>
                          <span className='text-base font-bold text-foreground'>{dept.requestCounts.completed}</span>
                        </div>
                      </div>
                    ) : (
                      <div className='mt-6 rounded-xl border border-border/60 bg-surface-subtle/50 p-4 text-center text-xs text-muted-foreground'>
                        <FolderOpen className='size-6 mx-auto opacity-40 mb-1' />
                        <span>Phòng ban chưa có đợt và yêu cầu cấp phát nào</span>
                      </div>
                    )}
                  </div>

                  <div className='mt-5 pt-3 border-t border-border flex items-center justify-between'>
                    <span className='text-xs text-muted-foreground font-semibold'>
                      Tổng: {dept.totalRequests} yêu cầu
                    </span>
                    <button
                      className='flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                      onClick={() => {
                        setSelectedDeptId(dept.id)
                        setSelectedBatchId(null)
                        setSelectedItemId(null)
                      }}
                      type='button'
                    >
                      <span>Vào phòng</span>
                      <ChevronRight className='size-3.5' />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TẠO ĐỢT MỚI (VỚI CHECK TRÙNG & CHỌN YÊU CẦU CHƯA THUỘC ĐỢT)      */}
      {/* ========================================================================= */}
      {isCreateBatchOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-bold text-foreground'>Tạo đợt yêu cầu cấp phát mới</h3>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => {
                  setIsCreateBatchOpen(false)
                  setBatchError(null)
                }}
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
                <label className='font-bold text-foreground'>Tên đợt:</label>
                <input
                  className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                  onChange={(e) => setNewBatchName(e.target.value)}
                  placeholder='Ví dụ: Đợt 2 - tháng 10/2026'
                  type='text'
                  value={newBatchName}
                />
              </div>

              <div className='grid grid-cols-3 gap-2'>
                <div>
                  <label className='font-bold text-foreground'>Tháng:</label>
                  <input
                    className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                    onChange={(e) => setNewBatchMonth(e.target.value)}
                    type='text'
                    value={newBatchMonth}
                  />
                </div>
                <div>
                  <label className='font-bold text-foreground'>Ngày bắt đầu:</label>
                  <input
                    className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                    onChange={(e) => setNewBatchStartDate(e.target.value)}
                    type='text'
                    value={newBatchStartDate}
                  />
                </div>
                <div>
                  <label className='font-bold text-foreground'>Ngày kết thúc:</label>
                  <input
                    className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                    onChange={(e) => setNewBatchEndDate(e.target.value)}
                    type='text'
                    value={newBatchEndDate}
                  />
                </div>
              </div>

              {/* Select from unbatched items */}
              <div>
                <label className='font-bold text-foreground block mb-1'>
                  Chọn các yêu cầu đưa vào đợt ({unbatchedItemsInDept.length} mục chưa xếp đợt):
                </label>
                {unbatchedItemsInDept.length === 0 ? (
                  <p className='text-muted-foreground italic'>Hiện không có yêu cầu nào chưa xếp đợt.</p>
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
                        <span className='text-muted-foreground'>— {item.softwareName} ({item.planName})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
              <button
                className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                onClick={() => {
                  setIsCreateBatchOpen(false)
                  setBatchError(null)
                }}
                type='button'
              >
                Hủy bỏ
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                onClick={handleCreateBatch}
                type='button'
              >
                Tạo đợt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: XÁC NHẬN CẤP PHÁT BẢN QUYỀN                                        */}
      {/* ========================================================================= */}
      {isConfirmGrantOpen && currentItem && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground font-bold text-xs'>
                  <PackageCheck className='size-4' />
                </span>
                <h3 className='text-base font-bold text-foreground'>Xác nhận cấp phát bản quyền</h3>
              </div>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                disabled={isApiExecuting}
                onClick={() => setIsConfirmGrantOpen(false)}
                type='button'
              >
                <X className='size-5' />
              </button>
            </div>

            {/* Checklist summary */}
            <div className='rounded-xl border border-border bg-surface-subtle p-4 space-y-2 text-xs'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Người thụ hưởng:</span>
                <span className='font-bold text-foreground'>{currentItem.beneficiaryName} ({currentItem.beneficiaryEmail})</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Phòng ban:</span>
                <span className='font-semibold text-foreground'>{currentItem.departmentName}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Gói cấp phát:</span>
                <span className='font-bold text-primary'>{currentItem.softwareName} — {currentItem.planName}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Đơn vị cấp:</span>
                <span className='font-semibold text-foreground'>Đúng 1 {currentItem.unit} ({currentItem.credentialType})</span>
              </div>
            </div>

            <p className='text-xs text-muted-foreground leading-relaxed'>
              Thao tác này sẽ cấp 1 tài khoản/bản quyền cho người thụ hưởng. Bản ghi cấp phát sẽ được lưu lại để hệ thống tự động đối chiếu với hóa đơn mua phần mềm.
            </p>

            <div className='flex items-center justify-end gap-3 pt-4 border-t border-border'>
              <button
                className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                disabled={isApiExecuting}
                onClick={() => setIsConfirmGrantOpen(false)}
                type='button'
              >
                Hủy
              </button>
              <button
                className='flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50'
                disabled={isApiExecuting}
                onClick={handleExecuteGrant}
                type='button'
              >
                {isApiExecuting ? (
                  <>
                    <RefreshCw className='size-3.5 animate-spin' />
                    <span>Đang xử lý cấp phát...</span>
                  </>
                ) : (
                  <>
                    <PackageCheck className='size-4' />
                    <span>Xác nhận cấp phát</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: HIỆN THÔNG TIN BÍ MẬT & GHI AUDIT LOG (IT-AC-06)                   */}
      {/* ========================================================================= */}
      {isRevealModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center gap-2 text-warning'>
              <Shield className='size-5' />
              <h3 className='text-base font-bold text-foreground'>Xác nhận xem thông tin bí mật</h3>
            </div>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              Thao tác xem mật khẩu/mã khóa API này sẽ được ghi lại vào nhật ký kiểm toán hệ thống (Audit Trail)
              kèm định danh tài khoản IT Admin và thời điểm truy cập.
            </p>
            <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
              <button
                className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                onClick={() => setIsRevealModalOpen(false)}
                type='button'
              >
                Hủy
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                onClick={() => {
                  setIsRevealed(true)
                  setIsRevealModalOpen(false)
                  showToast('Đã xác thực quyền và ghi vết truy cập bí mật!')
                }}
                type='button'
              >
                Tôi xác nhận & Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHẾ ĐỘ XEM NGƯỜI ĐƯỢC CẤP (IT-AC-06A)                              */}
      {/* ========================================================================= */}
      {isBeneficiaryPreviewOpen && currentItem && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-primary'>
                <UserCheck className='size-5' />
                <h3 className='text-base font-bold text-foreground'>
                  Chế độ xem giao diện người được cấp
                </h3>
              </div>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setIsBeneficiaryPreviewOpen(false)}
                type='button'
              >
                <X className='size-5' />
              </button>
            </div>

            <div className='rounded-xl border border-border bg-surface-subtle p-4 space-y-3 text-xs'>
              <span className='font-bold text-muted-foreground uppercase text-[0.65rem]'>
                Thông báo gửi tới hộp thư nhân viên:
              </span>
              <div className='rounded-xl bg-surface p-4 border border-border space-y-2'>
                <p className='font-bold text-foreground text-sm'>
                  🎉 Yêu cầu cấp bản quyền {currentItem.softwareName} đã được phê duyệt & bàn giao
                </p>
                <p className='text-muted-foreground leading-relaxed'>
                  Chào {currentItem.beneficiaryName}, gói {currentItem.planName} của bạn đã được quản trị viên CNTT
                  cấp phát thành công. Vui lòng truy cập cổng bảo mật cá nhân dưới đây để thiết lập thông tin.
                </p>
                <p className='text-danger font-semibold text-[0.7rem]'>
                  * Lưu ý an toàn: Nội dung thông báo này KHÔNG chứa mật khẩu hoặc mã bí mật API nhằm tuân thủ chính sách an ninh thông tin.
                </p>
                <div className='pt-2'>
                  <a
                    className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90'
                    href='#credential-portal'
                    onClick={(e) => {
                      e.preventDefault()
                      showToast('Đã mở cổng Portal bảo mật của nhân viên')
                    }}
                  >
                    <span>Mở cổng nhận quyền sử dụng</span>
                    <ExternalLink className='size-3' />
                  </a>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-end pt-2 border-t border-border'>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                onClick={() => setIsBeneficiaryPreviewOpen(false)}
                type='button'
              >
                Đóng chế độ xem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHUYỂN YÊU CẦU GIỮA CÁC ĐỢT ĐANG MỞ                                 */}
      {/* ========================================================================= */}
      {isMoveBatchOpen && movingItem && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-bold text-foreground'>Chuyển yêu cầu giữa các đợt đang mở</h3>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setIsMoveBatchOpen(false)}
                type='button'
              >
                <X className='size-5' />
              </button>
            </div>
            <p className='text-xs text-muted-foreground'>
              Chỉ được phép chuyển các yêu cầu <strong>chưa bắt đầu cấp phát</strong> giữa các đợt đang mở trong cùng phòng ban:
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
                    <span className='text-[0.65rem] text-muted-foreground'>{target.startDate} – {target.endDate}</span>
                  </button>
                ))}
            </div>

            <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
              <button
                className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                onClick={() => setIsMoveBatchOpen(false)}
                type='button'
              >
                Hủy
              </button>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50'
                disabled={!targetBatchId}
                onClick={handleConfirmMoveBatch}
                type='button'
              >
                Xác nhận chuyển
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
