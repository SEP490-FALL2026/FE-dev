import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { AlertCircle, AlertTriangle, ArrowRight, Clock, Layers, Search, ShieldAlert } from 'lucide-react'

export interface ApprovalTask {
  id: string
  code: string
  title: string
  saasName: string
  saasLogo: string
  taskType: 'EXPENSE' | 'RENEWAL' | 'NEW_SAAS'
  requesterName: string
  requesterRole: string
  costCenter: string
  amount: number
  currency: string
  seatCount?: number
  slaHoursRemaining: number
  isOverdue: boolean
  isSodConflict: boolean
  managerApproved: boolean
  itRiskLevel?: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  cancellationDeadline?: string
}

export const MOCK_APPROVAL_TASKS: ApprovalTask[] = [
  {
    id: 'req-01',
    code: 'REQ-2026-089',
    title: 'Xin cấp 15 seat Figma Organization cho Dự án Fintech Redesign',
    saasName: 'Figma Enterprise',
    saasLogo: '🎨',
    taskType: 'EXPENSE',
    requesterName: 'Trần Vũ Bảo',
    requesterRole: 'Lead Product Designer',
    costCenter: 'CC-DESIGN-01 (Product Design)',
    amount: 13500000,
    currency: 'VND',
    seatCount: 15,
    slaHoursRemaining: 6,
    isOverdue: false,
    isSodConflict: false,
    managerApproved: true,
    createdAt: '2026-09-28T14:30:00Z'
  },
  {
    id: 'req-02',
    code: 'REQ-2026-092',
    title: 'Kỳ gia hạn hợp đồng GitHub Enterprise & Copilot (Hạn chót báo hủy)',
    saasName: 'GitHub Copilot Business',
    saasLogo: '🐙',
    taskType: 'RENEWAL',
    requesterName: 'Nguyễn Văn Minh',
    requesterRole: 'VP of Engineering',
    costCenter: 'CC-ENG-02 (Core Backend)',
    amount: 45000000,
    currency: 'VND',
    seatCount: 50,
    slaHoursRemaining: 14,
    isOverdue: false,
    isSodConflict: false,
    managerApproved: true,
    cancellationDeadline: '2026-10-05',
    createdAt: '2026-09-27T09:00:00Z'
  },
  {
    id: 'req-03',
    code: 'REQ-2026-078',
    title: 'Yêu cầu đăng ký SaaS mới: Cursor AI Pro cho Đội phát triển AI',
    saasName: 'Cursor AI IDE',
    saasLogo: '⚡',
    taskType: 'NEW_SAAS',
    requesterName: 'Phạm Hoàng Nam',
    requesterRole: 'Chief Executive Officer',
    costCenter: 'CC-EXEC-01 (Executive)',
    amount: 8200000,
    currency: 'VND',
    seatCount: 10,
    slaHoursRemaining: -4,
    isOverdue: true,
    isSodConflict: true,
    managerApproved: true,
    itRiskLevel: 'MEDIUM',
    createdAt: '2026-09-25T11:20:00Z'
  },
  {
    id: 'req-04',
    code: 'REQ-2026-095',
    title: 'Mua bổ sung 25 seat Notion AI Team Workspace',
    saasName: 'Notion AI',
    saasLogo: '📝',
    taskType: 'EXPENSE',
    requesterName: 'Đặng Thanh Hà',
    requesterRole: 'Head of Operations',
    costCenter: 'CC-OPS-03 (Operations)',
    amount: 18750000,
    currency: 'VND',
    seatCount: 25,
    slaHoursRemaining: 32,
    isOverdue: false,
    isSodConflict: false,
    managerApproved: true,
    createdAt: '2026-09-29T08:10:00Z'
  }
]

export function ApprovalQueuePage() {
  const { t } = useTranslation(['approvals', 'common'])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [sodOnly, setSodOnly] = useState(false)

  const filteredTasks = MOCK_APPROVAL_TASKS.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.saasName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.requesterName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'ALL' || task.taskType === typeFilter
    const matchesUrgent = !urgentOnly || task.slaHoursRemaining <= 24 || task.isOverdue
    const matchesSod = !sodOnly || task.isSodConflict

    return matchesSearch && matchesType && matchesUrgent && matchesSod
  })

  const stats = {
    pending: MOCK_APPROVAL_TASKS.length,
    urgent: MOCK_APPROVAL_TASKS.filter((t) => t.slaHoursRemaining <= 24 && !t.isOverdue).length,
    overdue: MOCK_APPROVAL_TASKS.filter((t) => t.isOverdue).length,
    sodConflict: MOCK_APPROVAL_TASKS.filter((t) => t.isSodConflict).length
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('approvals:queue.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('approvals:queue.subtitle')}</p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-primary/40'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('approvals:queue.stats.pending')}
            </span>
            <div className='rounded-lg bg-primary-soft p-2 text-primary'>
              <Layers className='h-5 w-5' />
            </div>
          </div>
          <p className='mt-3 text-3xl font-extrabold text-foreground'>{stats.pending}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('approvals:queue.pendingDesc')}</p>
        </div>

        <div className='rounded-xl border border-warning/40 bg-surface p-5 shadow-xs transition-all hover:border-warning'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-warning'>
              {t('approvals:queue.stats.urgent')}
            </span>
            <div className='rounded-lg bg-warning/10 p-2 text-warning'>
              <Clock className='h-5 w-5' />
            </div>
          </div>
          <p className='mt-3 text-3xl font-extrabold text-foreground'>{stats.urgent}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('approvals:queue.urgentDesc')}</p>
        </div>

        <div className='rounded-xl border border-danger/40 bg-surface p-5 shadow-xs transition-all hover:border-danger'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-danger'>
              {t('approvals:queue.stats.overdue')}
            </span>
            <div className='rounded-lg bg-danger/10 p-2 text-danger'>
              <AlertCircle className='h-5 w-5' />
            </div>
          </div>
          <p className='mt-3 text-3xl font-extrabold text-foreground'>{stats.overdue}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('approvals:queue.overdueDesc')}</p>
        </div>

        <div className='rounded-xl border border-info/40 bg-surface p-5 shadow-xs transition-all hover:border-info'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold uppercase tracking-wider text-info'>
              {t('approvals:queue.stats.sodConflict')}
            </span>
            <div className='rounded-lg bg-info/10 p-2 text-info'>
              <ShieldAlert className='h-5 w-5' />
            </div>
          </div>
          <p className='mt-3 text-3xl font-extrabold text-foreground'>{stats.sodConflict}</p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('approvals:queue.sodDesc')}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className='rounded-xl border border-border bg-surface p-4 shadow-xs space-y-4'>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          {/* Search Box */}
          <div className='relative flex-1'>
            <Search className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('approvals:queue.filters.searchPlaceholder')}
              className='w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden'
            />
          </div>

          {/* Filters */}
          <div className='flex flex-wrap items-center gap-2'>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className='rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-hidden'
            >
              <option value='ALL'>{t('approvals:queue.filters.allTypes')}</option>
              <option value='EXPENSE'>{t('approvals:queue.filters.expense')}</option>
              <option value='RENEWAL'>{t('approvals:queue.filters.renewal')}</option>
              <option value='NEW_SAAS'>{t('approvals:queue.filters.newSaas')}</option>
            </select>

            <button
              onClick={() => setUrgentOnly(!urgentOnly)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                urgentOnly
                  ? 'bg-warning text-warning-foreground font-semibold shadow-xs'
                  : 'border border-border bg-background text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              }`}
            >
              <Clock className='h-4 w-4' />
              <span>{t('approvals:queue.filters.urgentOnly')}</span>
            </button>

            <button
              onClick={() => setSodOnly(!sodOnly)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                sodOnly
                  ? 'bg-info text-info-foreground font-semibold shadow-xs'
                  : 'border border-border bg-background text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              }`}
            >
              <ShieldAlert className='h-4 w-4' />
              <span>{t('approvals:queue.filters.sodOnly')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task Queue List / Table */}
      <div className='overflow-hidden rounded-xl border border-border bg-surface shadow-xs'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-foreground'>
            <thead className='border-b border-border bg-surface-subtle text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              <tr>
                <th className='px-6 py-4'>{t('approvals:queue.table.requestInfo')}</th>
                <th className='px-6 py-4'>{t('approvals:queue.table.requester')}</th>
                <th className='px-6 py-4'>{t('approvals:queue.table.type')}</th>
                <th className='px-6 py-4 text-right'>{t('approvals:queue.table.amount')}</th>
                <th className='px-6 py-4'>{t('approvals:queue.table.sla')}</th>
                <th className='px-6 py-4 text-center'>{t('approvals:queue.table.actions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className='px-6 py-12 text-center text-muted-foreground'>
                    <Layers className='mx-auto h-8 w-8 text-muted-foreground/50 mb-2' />
                    <p className='font-medium'>{t('approvals:queue.empty')}</p>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const targetUrl =
                    task.taskType === 'RENEWAL' ? `/approvals/renewal/${task.id}` : `/approvals/expense/${task.id}`

                  return (
                    <tr key={task.id} className='transition-colors hover:bg-surface-subtle/60 group'>
                      {/* Request Info */}
                      <td className='px-6 py-4 max-w-xs sm:max-w-md'>
                        <div className='flex items-start gap-3'>
                          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-xl shadow-xs'>
                            {task.saasLogo}
                          </div>
                          <div className='min-w-0'>
                            <div className='flex items-center gap-2'>
                              <span className='font-mono text-xs font-semibold text-primary'>{task.code}</span>
                              <span className='font-semibold text-foreground truncate'>{task.saasName}</span>
                            </div>
                            <p className='mt-0.5 text-xs text-foreground/80 font-medium leading-snug line-clamp-2'>
                              {task.title}
                            </p>

                            {/* Alert badges */}
                            <div className='mt-2 flex flex-wrap items-center gap-1.5'>
                              {task.isSodConflict && (
                                <span className='inline-flex items-center gap-1 rounded-md bg-info/10 px-2 py-0.5 text-[11px] font-semibold text-info ring-1 ring-info/20'>
                                  <ShieldAlert className='h-3 w-3' />
                                  {t('approvals:queue.badges.sodAlert')}
                                </span>
                              )}
                              {task.isOverdue && (
                                <span className='inline-flex items-center gap-1 rounded-md bg-danger/10 px-2 py-0.5 text-[11px] font-semibold text-danger ring-1 ring-danger/20'>
                                  <AlertCircle className='h-3 w-3' />
                                  {t('approvals:queue.badges.overdueAlert')}
                                </span>
                              )}
                              {task.cancellationDeadline && (
                                <span className='inline-flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning ring-1 ring-warning/20'>
                                  <Clock className='h-3 w-3' />
                                  {t('approvals:queue.deadlineFormat', {
                                    date: task.cancellationDeadline
                                  })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Requester & Cost Center */}
                      <td className='px-6 py-4'>
                        <div className='text-xs'>
                          <p className='font-semibold text-foreground'>{task.requesterName}</p>
                          <p className='text-muted-foreground'>{task.requesterRole}</p>
                          <span className='mt-1 inline-block rounded-md bg-surface-subtle px-2 py-0.5 font-mono text-[10px] text-muted-foreground border border-border'>
                            {task.costCenter}
                          </span>
                        </div>
                      </td>

                      {/* Task Type */}
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            task.taskType === 'EXPENSE'
                              ? 'bg-primary-soft text-primary'
                              : task.taskType === 'RENEWAL'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-info/10 text-info'
                          }`}
                        >
                          {t(`approvals:queue.types.${task.taskType}`)}
                        </span>
                      </td>

                      {/* Amount & Seats */}
                      <td className='px-6 py-4 text-right'>
                        <p className='font-bold text-foreground'>{formatCurrency(task.amount)}</p>
                        {task.seatCount && (
                          <p className='text-xs text-muted-foreground'>
                            {t('approvals:queue.paidSeatsFormat', { count: task.seatCount })}
                          </p>
                        )}
                      </td>

                      {/* SLA Status */}
                      <td className='px-6 py-4'>
                        {task.isOverdue ? (
                          <div className='flex items-center gap-1.5 text-xs font-bold text-danger'>
                            <AlertTriangle className='h-4 w-4 shrink-0' />
                            <span>
                              {t('approvals:queue.overdueSlaFormat', {
                                hours: Math.abs(task.slaHoursRemaining)
                              })}
                            </span>
                          </div>
                        ) : task.slaHoursRemaining <= 24 ? (
                          <div className='flex items-center gap-1.5 text-xs font-bold text-warning'>
                            <Clock className='h-4 w-4 shrink-0 animate-pulse' />
                            <span>
                              {t('approvals:queue.urgentSlaFormat', {
                                hours: task.slaHoursRemaining
                              })}
                            </span>
                          </div>
                        ) : (
                          <div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
                            <Clock className='h-4 w-4 shrink-0' />
                            <span>
                              {t('approvals:queue.remainingSlaFormat', {
                                hours: task.slaHoursRemaining
                              })}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className='px-6 py-4 text-center'>
                        <Link
                          to={targetUrl}
                          className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary-hover hover:gap-2'
                        >
                          <span>{t('approvals:queue.actions.review')}</span>
                          <ArrowRight className='h-3.5 w-3.5' />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
