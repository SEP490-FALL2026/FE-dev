import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileCheck,
  Key,
  Loader2,
  Play,
  RefreshCw,
  Shield,
  ShieldAlert,
  Upload,
  UserCheck,
  X
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { itProvisioningTasks, itLicenseKeys, type ProvisioningTask, type LicenseKey } from '../it-admin-data'
import type { ItAdminTabKey } from '../it-admin-nav'

type ViewState = 'queue' | 'detail' | 'evidence' | 'keyPool'

export type ItProvisioningViewProps = {
  initialTaskId?: string
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItProvisioningView({ initialTaskId, onSelectTab }: ItProvisioningViewProps = {}) {
  const { t } = useTranslation('dashboard')
  const [tasks, setTasks] = useState<ProvisioningTask[]>(itProvisioningTasks)
  const [keys, setKeys] = useState<LicenseKey[]>(itLicenseKeys)
  const [filter, setFilter] = useState<'all' | 'manual' | 'auto' | 'error' | 'pending'>('all')
  const [selectedTask, setSelectedTask] = useState<ProvisioningTask | null>(null)
  const [viewState, setViewState] = useState<ViewState>('queue')
  const [evidenceNote, setEvidenceNote] = useState('')
  const [evidenceFile, setEvidenceFile] = useState<string | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('Thao tác thành công!')
  const [selectedKey, setSelectedKey] = useState<LicenseKey | null>(null)
  const [showKeyReveal, setShowKeyReveal] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    if (initialTaskId) {
      const task = tasks.find((t) => t.id === initialTaskId)
      if (task) {
        setSelectedTask(task)
        setViewState('detail')
      }
    }
  }, [initialTaskId, tasks])

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'manual') return task.status === 'manual'
    if (filter === 'auto')
      return task.channel.includes('Connector') && !['retry', 'authError', 'capacity'].includes(task.status)
    if (filter === 'error') return task.status === 'retry' || task.status === 'authError' || task.status === 'capacity'
    if (filter === 'pending') return task.status === 'pendingAccept'
    return true
  })

  const statusConfig: Record<string, { label: string; tone: string }> = {
    authError: { label: t('itAdmin.provisioning.statusAuthError'), tone: 'bg-danger/10 text-danger border-danger/25' },
    capacity: {
      label: t('itAdmin.provisioning.statusCapacity'),
      tone: 'bg-warning/15 text-warning border-warning/30'
    },
    completed: {
      label: t('itAdmin.provisioning.statusCompleted'),
      tone: 'bg-success/10 text-success border-success/25'
    },
    inProgress: { label: 'Đang xử lý', tone: 'bg-info/10 text-info border-info/25' },
    manual: { label: t('itAdmin.provisioning.statusManual'), tone: 'bg-primary-soft text-primary border-primary/25' },
    pendingAccept: {
      label: t('itAdmin.provisioning.statusPendingAccept'),
      tone: 'bg-info/10 text-info border-info/25'
    },
    retry: { label: t('itAdmin.provisioning.statusRetry'), tone: 'bg-danger/10 text-danger border-danger/25' }
  }

  const metricCounts = {
    auto: tasks.filter(
      (t) => t.channel.includes('Connector') && !['retry', 'authError', 'capacity'].includes(t.status)
    ).length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    failed: tasks.filter((t) =>
      ['retry', 'authError', 'capacity'].includes(t.status)
    ).length,
    manual: tasks.filter((t) => t.status === 'manual').length,
    pending: tasks.filter((t) => t.status === 'pendingAccept').length
  }

  const handleOpenDetail = (task: ProvisioningTask) => {
    setSelectedTask(task)
    setViewState('detail')
    if (onSelectTab) {
      onSelectTab('provisioning', { id: task.id })
    }
  }

  const handleOpenEvidence = () => {
    setEvidenceNote('')
    setEvidenceFile(null)
    setViewState('evidence')
  }

  const handleOpenKeyPool = () => {
    setSelectedKey(null)
    setViewState('keyPool')
  }

  const handleConfirmEvidence = () => {
    if (!selectedTask) return
    const updatedStatus = 'completed'
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? {
              ...t,
              status: updatedStatus,
              evidence: evidenceNote,
              lastError: undefined
            }
          : t
      )
    )
    setSelectedTask((prev) =>
      prev ? { ...prev, status: updatedStatus, evidence: evidenceNote, lastError: undefined } : null
    )
    setToastMsg('Đã xác nhận hoàn tất tác vụ cấp phát kèm bằng chứng!')
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
      setViewState('queue')
      setSelectedTask(null)
      if (onSelectTab) {
        onSelectTab('provisioning')
      }
    }, 2000)
  }

  const handleAssignKey = (key: LicenseKey) => {
    setSelectedKey(key)
  }

  const handleConfirmKeyAssign = () => {
    if (!selectedKey || !selectedTask) return
    setKeys((prev) =>
      prev.map((k) =>
        k.id === selectedKey.id
          ? { ...k, status: 'assigned', assignedTo: selectedTask.user }
          : k
      )
    )
    setEvidenceNote(`Đã gán khóa bản quyền ${selectedKey.id} (${selectedKey.product}) cho tài khoản ${selectedTask.account}.`)
    setToastMsg(`Đã gán khóa ${selectedKey.id} từ kho thành công!`)
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
      setViewState('evidence')
    }, 1200)
  }

  const handleRetryConnector = () => {
    if (!selectedTask) return
    setIsRetrying(true)
    setTimeout(() => {
      setIsRetrying(false)
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id
            ? { ...t, status: 'completed', lastError: undefined, retryCount: (t.retryCount ?? 0) + 1 }
            : t
        )
      )
      setSelectedTask((prev) =>
        prev
          ? { ...prev, status: 'completed', lastError: undefined, retryCount: (prev.retryCount ?? 0) + 1 }
          : null
      )
      setToastMsg('Connector đã kết nối và cấp quyền thành công!')
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 2500)
    }, 1500)
  }

  const handleMarkNotDone = () => {
    if (!selectedTask) return
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? { ...t, status: 'authError', lastError: 'IT Admin đánh dấu không hoàn tất được: Cần liên hệ Vendor hỗ trợ' }
          : t
      )
    )
    setSelectedTask((prev) =>
      prev
        ? { ...prev, status: 'authError', lastError: 'IT Admin đánh dấu không hoàn tất được: Cần liên hệ Vendor hỗ trợ' }
        : null
    )
    setToastMsg('Đã ghi nhận tác vụ lỗi cho IT Admin phụ trách!')
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
      setViewState('queue')
      setSelectedTask(null)
      if (onSelectTab) {
        onSelectTab('provisioning')
      }
    }, 2000)
  }

  const handleBack = () => {
    if (viewState === 'evidence') setViewState('detail')
    else if (viewState === 'keyPool') setViewState('detail')
    else if (viewState === 'detail') {
      setViewState('queue')
      setSelectedTask(null)
      if (onSelectTab) {
        onSelectTab('provisioning')
      }
    }
  }

  /* ─── Toast ─── */
  const SuccessToast = () =>
    showSuccessToast ? (
      <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-5 py-3.5 shadow-lg backdrop-blur-md animate-[slideUp_0.3s_ease-out]'>
        <CheckCircle2 className='size-5 text-success' />
        <span className='text-sm font-semibold text-success'>{toastMsg}</span>
      </div>
    ) : null

  /* ─── QUEUE VIEW ─── */
  if (viewState === 'queue') {
    return (
      <div className='space-y-6'>
        <SuccessToast />
        <div>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
            <span className='size-2 rounded-full bg-primary' />
            ITA-05 · Cấp phát & Thu hồi AI
          </div>
          <h1 className='mt-3 text-2xl font-bold tracking-tight sm:text-3xl'>
            {t('itAdmin.provisioning.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.provisioning.subtitle')}</p>
        </div>

        {/* Metric Cards */}
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
          {[
            {
              count: metricCounts.manual,
              icon: UserCheck,
              iconColor: 'text-primary',
              label: t('itAdmin.provisioning.manualMetric')
            },
            {
              count: metricCounts.auto,
              icon: Play,
              iconColor: 'text-info',
              label: t('itAdmin.provisioning.autoMetric')
            },
            {
              count: metricCounts.pending,
              icon: Clock,
              iconColor: 'text-warning',
              label: t('itAdmin.provisioning.pendingMetric')
            },
            {
              count: metricCounts.failed,
              icon: AlertCircle,
              iconColor: 'text-danger',
              label: t('itAdmin.provisioning.failedMetric')
            },
            {
              count: metricCounts.completed,
              icon: CheckCircle2,
              iconColor: 'text-success',
              label: t('itAdmin.provisioning.completedToday')
            }
          ].map((m) => {
            const Icon = m.icon
            return (
              <div className='rounded-xl border border-border bg-surface p-4 shadow-sm' key={m.label}>
                <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
                  <Icon aria-hidden='true' className={`size-4 ${m.iconColor}`} />
                  <span>{m.label}</span>
                </div>
                <p className='mt-2 text-2xl font-bold text-foreground'>{m.count}</p>
              </div>
            )
          })}
        </div>

        {/* Filter Tabs */}
        <div className='flex flex-wrap items-center gap-2 border-b border-border pb-3'>
          {(['all', 'manual', 'auto', 'error', 'pending'] as const).map((f) => (
            <button
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === f
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border bg-surface text-muted-foreground hover:text-foreground'
              }`}
              key={f}
              onClick={() => setFilter(f)}
              type='button'
            >
              {f === 'all'
                ? t('itAdmin.provisioning.filterAll')
                : f === 'manual'
                  ? t('itAdmin.provisioning.filterManual')
                  : f === 'auto'
                    ? t('itAdmin.provisioning.filterAuto')
                    : f === 'error'
                      ? t('itAdmin.provisioning.filterError')
                      : t('itAdmin.provisioning.filterPending')}
            </button>
          ))}
        </div>

        {/* Task Table */}
        <div className='overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
              <tr>
                <th className='p-3 font-semibold'>{t('itAdmin.provisioning.colId')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.provisioning.colApp')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.provisioning.colUser')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.provisioning.colChannel')}</th>
                <th className='p-3 font-semibold'>Hình thức cấp phát</th>
                <th className='p-3 font-semibold'>{t('itAdmin.provisioning.colStatus')}</th>
                <th className='p-3 font-semibold text-right'>{t('itAdmin.provisioning.colActions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredTasks.map((task) => {
                const cfg = statusConfig[task.status]

                return (
                  <tr
                    className='cursor-pointer transition hover:bg-surface-subtle/80'
                    key={task.id}
                    onClick={() => handleOpenDetail(task)}
                  >
                    <td className='p-3 font-mono font-bold text-foreground'>{task.id}</td>
                    <td className='p-3'>
                      <span className='font-semibold text-foreground'>{task.app}</span>
                    </td>
                    <td className='p-3'>
                      <span className='block font-semibold text-foreground'>{task.user}</span>
                      <span className='text-[0.7rem] text-muted-foreground'>{task.account}</span>
                    </td>
                    <td className='p-3 text-muted-foreground'>{task.channel}</td>
                    <td className='p-3'>
                      <span className='rounded-md border border-border bg-surface-subtle px-1.5 py-0.5 text-[0.65rem] font-bold text-muted-foreground'>
                        {task.planTypeCode ? `${task.planTypeCode} · ` : ''}{task.planType}
                      </span>
                    </td>
                    <td className='p-3'>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${cfg.tone}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className='p-3 text-right'>
                      <button
                        className='inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold hover:border-primary hover:text-primary transition'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenDetail(task)
                        }}
                        type='button'
                      >
                        <Eye aria-hidden='true' className='size-3.5' />
                        <span>Chi tiết</span>
                        <ChevronRight aria-hidden='true' className='size-3' />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  /* ─── TASK DETAIL VIEW ─── */
  if (viewState === 'detail' && selectedTask) {
    const cfg = statusConfig[selectedTask.status]
    const isError = ['retry', 'authError', 'capacity'].includes(selectedTask.status)
    const isKeyPlan = selectedTask.planType === 'Khóa bản quyền & Token API'

    return (
      <div className='space-y-6'>
        <SuccessToast />

        {/* Breadcrumb */}
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <button
            className='inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline'
            onClick={handleBack}
            type='button'
          >
            <ArrowLeft className='size-4' />
            Hàng đợi cấp phát
          </button>
          <ChevronRight className='size-3' />
          <span className='font-semibold text-foreground'>{selectedTask.id}</span>
        </div>

        {/* Header Card */}
        <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
            <div className='flex items-start gap-4'>
              <span
                className={`grid size-12 place-items-center rounded-2xl border ${
                  selectedTask.action === 'provision'
                    ? 'border-primary/20 bg-primary-soft text-primary'
                    : 'border-danger/20 bg-danger/10 text-danger'
                }`}
              >
                {selectedTask.action === 'provision' ? (
                  <UserCheck className='size-6' />
                ) : (
                  <X className='size-6' />
                )}
              </span>
              <div>
                <div className='flex items-center gap-2'>
                  <h1 className='text-xl font-bold text-foreground'>{selectedTask.app}</h1>
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${cfg.tone}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className='mt-0.5 text-sm text-muted-foreground'>
                  {selectedTask.action === 'provision' ? 'Cấp quyền tài khoản mới' : 'Thu hồi tài khoản'} — {selectedTask.channel}
                </p>
                <p className='mt-0.5 text-xs font-mono text-muted-foreground'>{selectedTask.id}</p>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                <span className='block text-[0.7rem] text-muted-foreground'>Thời hạn cam kết xử lý (SLA)</span>
                <span className='font-bold text-foreground'>{selectedTask.sla}</span>
              </div>
              <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                <span className='block text-[0.7rem] text-muted-foreground'>Hình thức cấp phát</span>
                <span className='font-bold text-primary'>{selectedTask.planType}</span>
              </div>
            </div>
          </div>

          {/* Detail Grid */}
          <div className='mt-6 grid gap-4 rounded-xl border border-border bg-background/50 p-4 sm:grid-cols-2 lg:grid-cols-3'>
            {[
              { label: 'Người dùng', value: selectedTask.user },
              { label: 'Tài khoản / Email', value: selectedTask.account },
              { label: 'Phòng ban', value: selectedTask.department },
              { label: 'Nguồn quyết định', mono: true, value: selectedTask.decisionSource },
              { label: 'Kênh thực thi', value: selectedTask.channel },
              { label: 'Tạo lúc', value: selectedTask.createdAt }
            ].map((item) => (
              <div key={item.label}>
                <span className='text-[0.7rem] text-muted-foreground'>{item.label}</span>
                <p className={`text-sm font-semibold text-foreground ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps Card (Manual) */}
        {selectedTask.steps && (
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
            <h2 className='text-base font-bold text-foreground'>
              {selectedTask.status === 'manual' ? 'Hướng dẫn thao tác thủ công' : 'Tiến trình thực thi'}
            </h2>
            <p className='mt-1 text-xs text-muted-foreground'>
              Theo dõi từng bước để đảm bảo phân quyền tài khoản AI an toàn và chuẩn quy trình
            </p>
            <ol className='mt-4 space-y-3'>
              {selectedTask.steps.map((step, i) => (
                <li className='flex items-start gap-3' key={i}>
                  <span className='mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary-soft text-[0.7rem] font-bold text-primary'>
                    {i + 1}
                  </span>
                  <span className='text-sm text-foreground'>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Error Card */}
        {isError && selectedTask.lastError && (
          <div className='rounded-2xl border border-danger/30 bg-danger/5 p-5 shadow-sm'>
            <div className='flex items-start gap-3'>
              <AlertCircle className='mt-0.5 size-5 shrink-0 text-danger' />
              <div>
                <h3 className='text-sm font-bold text-danger'>
                  Lỗi kết nối nhà cung cấp AI — Lần thử {selectedTask.retryCount ?? 0}/6
                </h3>
                <p className='mt-1 text-xs font-mono text-danger/80'>{selectedTask.lastError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex flex-wrap gap-3'>
          {selectedTask.status === 'manual' && (
            <>
              {isKeyPlan && (
                <button
                  className='inline-flex items-center gap-2 rounded-xl bg-info px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-info/90'
                  onClick={handleOpenKeyPool}
                  type='button'
                >
                  <Key className='size-4' />
                  Kho mã bản quyền & Token API
                </button>
              )}
              <button
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
                onClick={handleOpenEvidence}
                type='button'
              >
                <FileCheck className='size-4' />
                Xác nhận đã thực hiện & Ghi bằng chứng
              </button>
              <button
                className='inline-flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-5 py-3 text-sm font-semibold text-danger transition hover:bg-danger/10'
                onClick={handleMarkNotDone}
                type='button'
              >
                <X className='size-4' />
                Đánh dấu không hoàn tất
              </button>
            </>
          )}
          {isError && (
            <>
              <button
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:opacity-60'
                disabled={isRetrying}
                onClick={handleRetryConnector}
                type='button'
              >
                {isRetrying ? <Loader2 className='size-4 animate-spin' /> : <RefreshCw className='size-4' />}
                {isRetrying ? 'Đang thử lại kết nối API...' : t('itAdmin.provisioning.actRetry')}
              </button>
              <button
                className='inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold hover:border-primary'
                onClick={handleOpenEvidence}
                type='button'
              >
                <FileCheck className='size-4' />
                Làm thủ công & Ghi bằng chứng
              </button>
            </>
          )}
          {selectedTask.status === 'pendingAccept' && (
            <button
              className='inline-flex items-center gap-2 rounded-xl bg-info px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-info/90'
              type='button'
            >
              <Loader2 className='size-4 animate-spin' />
              Đang chờ nhân viên chấp nhận lời mời
            </button>
          )}
          {selectedTask.status === 'inProgress' && (
            <div className='inline-flex items-center gap-2 rounded-xl border border-info/30 bg-info/5 px-5 py-3 text-sm font-semibold text-info'>
              <Loader2 className='size-4 animate-spin' />
              Connector đang xử lý tự động...
            </div>
          )}
          {selectedTask.status === 'completed' && (
            <div className='inline-flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 px-5 py-3 text-sm font-semibold text-success'>
              <CheckCircle2 className='size-4' />
              Đã hoàn tất — Quyền đã được cấp
            </div>
          )}
        </div>

        {/* Audit Info */}
        <div className='rounded-xl border border-primary/20 bg-primary-soft/40 p-4'>
          <div className='flex items-start gap-2'>
            <Shield className='mt-0.5 size-4 shrink-0 text-primary' />
            <p className='text-xs text-muted-foreground'>
              Mọi thay đổi được ghi Audit Trail tự động. IT Admin phụ trách phòng{' '}
              <strong className='text-foreground'>{selectedTask.department}</strong>. IT Admin khác xử lý thay được, có
              ghi nhận.
            </p>
          </div>
        </div>
      </div>
    )
  }

  /* ─── EVIDENCE VIEW ─── */
  if (viewState === 'evidence' && selectedTask) {
    return (
      <div className='space-y-6'>
        <SuccessToast />

        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <button
            className='inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline'
            onClick={handleBack}
            type='button'
          >
            <ArrowLeft className='size-4' />
            {selectedTask.id}
          </button>
          <ChevronRight className='size-3' />
          <span className='font-semibold text-foreground'>Xác nhận & Ghi bằng chứng</span>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
          <div className='flex items-center gap-3 border-b border-border pb-4'>
            <span className='grid size-10 place-items-center rounded-xl bg-primary-soft text-primary'>
              <FileCheck className='size-5' />
            </span>
            <div>
              <h1 className='text-lg font-bold text-foreground'>Xác nhận thực hiện kèm bằng chứng</h1>
              <p className='text-xs text-muted-foreground'>
                Xác nhận thao tác phân quyền ngoài hệ thống kèm biên bản hoặc ảnh chụp thực tế
              </p>
            </div>
          </div>

          <div className='mt-6 space-y-5'>
            {/* Task Summary */}
            <div className='rounded-xl border border-border bg-surface-subtle/50 p-4'>
              <div className='grid gap-3 sm:grid-cols-3'>
                <div>
                  <span className='text-[0.7rem] text-muted-foreground'>Phần mềm</span>
                  <p className='text-sm font-bold text-foreground'>{selectedTask.app}</p>
                </div>
                <div>
                  <span className='text-[0.7rem] text-muted-foreground'>Người dùng</span>
                  <p className='text-sm font-bold text-foreground'>{selectedTask.user}</p>
                </div>
                <div>
                  <span className='text-[0.7rem] text-muted-foreground'>Tài khoản</span>
                  <p className='text-sm font-mono font-bold text-foreground'>{selectedTask.account}</p>
                </div>
              </div>
            </div>

            {/* Evidence Form */}
            <div>
              <label className='block text-sm font-semibold text-foreground'>
                Ghi chú xác nhận <span className='text-danger'>*</span>
              </label>
              <p className='mt-0.5 text-xs text-muted-foreground'>
                Mô tả ngắn gọn thao tác đã thực hiện ngoài hệ thống
              </p>
              <textarea
                className='mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary-soft'
                onChange={(e) => setEvidenceNote(e.target.value)}
                placeholder='Ví dụ: Đã thêm tran.minh@company.com vào workspace Figma Organization, vai trò Editor. Screenshot đính kèm bên dưới.'
                rows={4}
                value={evidenceNote}
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-foreground'>Tải lên ảnh chụp bằng chứng</label>
              <p className='mt-0.5 text-xs text-muted-foreground'>
                Ảnh chụp màn hình hoặc file xác nhận từ nhà cung cấp (PNG, JPG, PDF — tối đa 5MB)
              </p>
              <div className='mt-2'>
                {evidenceFile ? (
                  <div className='flex items-center gap-3 rounded-xl border border-success/30 bg-success/5 px-4 py-3'>
                    <CheckCircle2 className='size-4 text-success' />
                    <span className='text-sm font-semibold text-success'>{evidenceFile}</span>
                    <button
                      className='ml-auto text-muted-foreground hover:text-danger'
                      onClick={() => setEvidenceFile(null)}
                      type='button'
                    >
                      <X className='size-4' />
                    </button>
                  </div>
                ) : (
                  <button
                    className='flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-8 text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary'
                    onClick={() => setEvidenceFile('screenshot-figma-provision-20261013.png')}
                    type='button'
                  >
                    <Upload className='size-5' />
                    Kéo thả hoặc bấm để tải lên
                  </button>
                )}
              </div>
            </div>

            {/* Confirmer */}
            <div className='rounded-xl border border-border bg-surface-subtle/50 p-4'>
              <div className='flex items-center gap-3'>
                <span className='grid size-8 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground'>
                  NH
                </span>
                <div>
                  <p className='text-xs text-muted-foreground'>Người xác nhận</p>
                  <p className='text-sm font-bold text-foreground'>Nguyễn Phú Hoàng (IT Admin)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='mt-6 flex flex-wrap gap-3 border-t border-border pt-5'>
            <button
              className='inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:opacity-50'
              disabled={!evidenceNote.trim()}
              onClick={handleConfirmEvidence}
              type='button'
            >
              <CheckCircle2 className='size-4' />
              Xác nhận hoàn tất kèm bằng chứng
            </button>
            <button
              className='inline-flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-6 py-3 text-sm font-semibold text-danger transition hover:bg-danger/10'
              onClick={handleMarkNotDone}
              type='button'
            >
              <X className='size-4' />
              Đánh dấu không hoàn tất
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ─── LICENSE KEY POOL VIEW ─── */
  if (viewState === 'keyPool' && selectedTask) {
    const productKeys = keys.filter((k) => k.product === selectedTask.app || true)

    return (
      <div className='space-y-6'>
        <SuccessToast />

        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <button
            className='inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline'
            onClick={handleBack}
            type='button'
          >
            <ArrowLeft className='size-4' />
            {selectedTask.id}
          </button>
          <ChevronRight className='size-3' />
          <span className='font-semibold text-foreground'>Kho mã bản quyền & Token API</span>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
          <div className='flex items-center gap-3 border-b border-border pb-4'>
            <span className='grid size-10 place-items-center rounded-xl bg-info/10 text-info'>
              <Key className='size-5' />
            </span>
            <div>
              <h1 className='text-lg font-bold text-foreground'>Kho mã bản quyền & Token truy cập API</h1>
              <p className='text-xs text-muted-foreground'>
                Khóa lưu mã hóa và hiển thị che bớt. Mỗi thao tác xem đầy đủ đều được lưu vào Nhật ký kiểm toán an toàn thông tin.
              </p>
            </div>
          </div>

          {/* Target info */}
          <div className='mt-4 rounded-xl border border-primary/20 bg-primary-soft/40 p-4'>
            <p className='text-xs text-muted-foreground'>
              Gán khóa cho: <strong className='text-foreground'>{selectedTask.user}</strong> —{' '}
              <span className='font-mono'>{selectedTask.account}</span> — {selectedTask.app}
            </p>
          </div>

          {/* Keys Table */}
          <div className='mt-5 overflow-x-auto rounded-xl border border-border'>
            <table className='w-full text-left text-xs'>
              <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
                <tr>
                  <th className='p-3 font-semibold'>Mã khóa</th>
                  <th className='p-3 font-semibold'>Sản phẩm</th>
                  <th className='p-3 font-semibold'>Khóa (che bớt)</th>
                  <th className='p-3 font-semibold'>Hết hạn</th>
                  <th className='p-3 font-semibold'>Trạng thái</th>
                  <th className='p-3 font-semibold'>Người sử dụng</th>
                  <th className='p-3 font-semibold text-right'>Hành động</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {productKeys.map((key) => {
                  const isAvailable = key.status === 'available'
                  const isRevealed = showKeyReveal === key.id
                  const isSelected = selectedKey?.id === key.id

                  return (
                    <tr
                      className={`transition ${
                        isSelected
                          ? 'bg-primary-soft/30'
                          : isAvailable
                            ? 'hover:bg-surface-subtle/80 cursor-pointer'
                            : 'opacity-60'
                      }`}
                      key={key.id}
                    >
                      <td className='p-3 font-mono font-bold text-foreground'>{key.id}</td>
                      <td className='p-3 font-semibold text-foreground'>{key.product}</td>
                      <td className='p-3 font-mono text-muted-foreground'>
                        {isRevealed ? key.key : key.maskedKey}
                        <button
                          className='ml-2 text-primary hover:underline'
                          onClick={() => setShowKeyReveal(isRevealed ? null : key.id)}
                          type='button'
                        >
                          <Eye className='inline size-3' />
                        </button>
                      </td>
                      <td className='p-3 text-muted-foreground'>{key.expiresAt}</td>
                      <td className='p-3'>
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${
                            key.status === 'available'
                              ? 'bg-success/10 text-success border-success/25'
                              : key.status === 'assigned'
                                ? 'bg-info/10 text-info border-info/25'
                                : 'bg-danger/10 text-danger border-danger/25'
                          }`}
                        >
                          {key.status === 'available' ? 'Khả dụng' : key.status === 'assigned' ? 'Đã gán' : 'Hết hạn'}
                        </span>
                      </td>
                      <td className='p-3 text-muted-foreground'>{key.assignedTo || '—'}</td>
                      <td className='p-3 text-right'>
                        {isAvailable && (
                          <button
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border hover:border-primary hover:text-primary'
                            }`}
                            onClick={() => handleAssignKey(key)}
                            type='button'
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className='size-3' /> Đã chọn
                              </>
                            ) : (
                              'Chọn gán'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Confirm Assignment */}
          {selectedKey && (
            <div className='mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary-soft/30 p-4'>
              <div>
                <p className='text-sm font-bold text-foreground'>
                  Khóa <span className='font-mono text-primary'>{selectedKey.id}</span> sẽ được gán cho{' '}
                  {selectedTask.user}
                </p>
                <p className='text-xs text-muted-foreground'>
                  Thiết bị: {selectedTask.account} — Sản phẩm: {selectedKey.product}
                </p>
              </div>
              <button
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
                onClick={handleConfirmKeyAssign}
                type='button'
              >
                <Key className='size-4' />
                Xác nhận gán khóa
              </button>
            </div>
          )}
        </div>

        <div className='rounded-xl border border-warning/30 bg-warning/5 p-4'>
          <div className='flex items-start gap-2'>
            <ShieldAlert className='mt-0.5 size-4 shrink-0 text-warning' />
            <p className='text-xs text-muted-foreground'>
              <strong className='text-warning'>Cảnh báo bảo mật:</strong> Mỗi thao tác xem đầy đủ khóa bản quyền đều được ghi lại trong Nhật ký kiểm toán. Mã bản quyền được mã hóa lưu trữ trong hệ thống và che bớt trên giao diện theo chính sách an toàn thông tin doanh nghiệp.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
