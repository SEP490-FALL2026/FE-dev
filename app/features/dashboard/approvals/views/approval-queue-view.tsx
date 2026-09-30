import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, AlertTriangle, ArrowRight, Clock, Layers, Search, ShieldAlert } from 'lucide-react'

import { MOCK_APPROVAL_TASKS } from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'

interface ApprovalQueueViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

export function ApprovalQueueView({ formatCurrency, onSelectTab }: ApprovalQueueViewProps) {
  const { t } = useTranslation('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'EXPENSE' | 'RENEWAL' | 'NEW_SAAS' | 'URGENT'>('ALL')

  const filteredTasks = MOCK_APPROVAL_TASKS.filter((task) => {
    const matchesSearch =
      task.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.saasName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.costCenter.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (selectedTab === 'ALL') return true
    if (selectedTab === 'EXPENSE') return task.taskType === 'EXPENSE'
    if (selectedTab === 'RENEWAL') return task.taskType === 'RENEWAL'
    if (selectedTab === 'NEW_SAAS') return task.taskType === 'NEW_SAAS'
    if (selectedTab === 'URGENT') return task.isOverdue || task.slaHoursRemaining <= 24

    return true
  })

  const taskCounts = {
    all: MOCK_APPROVAL_TASKS.length,
    expense: MOCK_APPROVAL_TASKS.filter((t) => t.taskType === 'EXPENSE').length,
    newSaas: MOCK_APPROVAL_TASKS.filter((t) => t.taskType === 'NEW_SAAS').length,
    renewal: MOCK_APPROVAL_TASKS.filter((t) => t.taskType === 'RENEWAL').length,
    urgent: MOCK_APPROVAL_TASKS.filter((t) => t.isOverdue || t.slaHoursRemaining <= 24).length
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{t('approvals.queue.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('approvals.queue.subtitle')}</p>
      </div>

      {/* Main Table Card */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
        {/* Controls: Search & Tabs */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          {/* Tabs */}
          <div className='flex flex-wrap gap-1.5'>
            {[
              { id: 'ALL' as const, label: t('approvals.queue.filterAll', { count: taskCounts.all }) },
              { id: 'EXPENSE' as const, label: t('approvals.queue.filterExpense', { count: taskCounts.expense }) },
              { id: 'RENEWAL' as const, label: t('approvals.queue.filterRenewal', { count: taskCounts.renewal }) },
              { id: 'NEW_SAAS' as const, label: t('approvals.queue.filterNewSaas', { count: taskCounts.newSaas }) },
              { id: 'URGENT' as const, label: t('approvals.queue.filterUrgent', { count: taskCounts.urgent }) }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  selectedTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                }`}
                onClick={() => setSelectedTab(tab.id)}
                type='button'
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className='relative w-full sm:w-72'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <input
              className='h-9 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('approvals.queue.searchPlaceholder')}
              type='text'
              value={searchTerm}
            />
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-3 px-4 font-semibold'>{t('approvals.queue.colRequest')}</th>
                <th className='py-3 px-4 font-semibold'>{t('approvals.queue.colRequester')}</th>
                <th className='py-3 px-4 font-semibold'>{t('approvals.queue.colType')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('approvals.queue.colAmount')}</th>
                <th className='py-3 px-4 font-semibold'>{t('approvals.queue.colSla')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('approvals.queue.colActions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className='py-12 text-center text-muted-foreground'>
                    <Layers className='mx-auto size-8 text-muted-foreground/40 mb-2' />
                    <p className='font-medium'>{t('approvals.queue.empty')}</p>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className='transition hover:bg-surface-subtle/50'>
                    {/* Request Info */}
                    <td className='py-3.5 px-4 max-w-xs sm:max-w-md'>
                      <div className='flex items-start gap-3'>
                        <div className='flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-lg shadow-xs'>
                          {task.saasLogo}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center gap-2'>
                            <span className='font-mono font-bold text-primary'>{task.code}</span>
                            <span className='font-bold text-foreground truncate'>{task.saasName}</span>
                          </div>
                          <p className='mt-0.5 font-medium text-foreground/80 leading-snug line-clamp-2'>
                            {task.title}
                          </p>

                          {/* Alert badges */}
                          <div className='mt-1.5 flex flex-wrap items-center gap-1.5'>
                            {task.isSodConflict && (
                              <span className='inline-flex items-center gap-1 rounded-md bg-info/10 px-2 py-0.5 text-[11px] font-bold text-info border border-info/20'>
                                <ShieldAlert className='size-3' />
                                <span>{t('approvals.queue.badges.sodAlert')}</span>
                              </span>
                            )}
                            {task.isOverdue && (
                              <span className='inline-flex items-center gap-1 rounded-md bg-danger/10 px-2 py-0.5 text-[11px] font-bold text-danger border border-danger/20'>
                                <AlertCircle className='size-3' />
                                <span>{t('approvals.queue.badges.overdueAlert')}</span>
                              </span>
                            )}
                            {task.cancellationDeadline && (
                              <span className='inline-flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5 text-[11px] font-bold text-warning border border-warning/20'>
                                <Clock className='size-3' />
                                <span>
                                  {t('approvals.queue.deadlineFormat', {
                                    date: task.cancellationDeadline
                                  })}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Requester & Cost Center */}
                    <td className='py-3.5 px-4'>
                      <div>
                        <p className='font-bold text-foreground'>{task.requesterName}</p>
                        <p className='text-muted-foreground'>{task.requesterRole}</p>
                        <span className='mt-1 inline-block rounded-md border border-border bg-surface-subtle px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'>
                          {task.costCenter}
                        </span>
                      </div>
                    </td>

                    {/* Task Type */}
                    <td className='py-3.5 px-4'>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-bold ${
                          task.taskType === 'EXPENSE'
                            ? 'bg-primary-soft text-primary'
                            : task.taskType === 'RENEWAL'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-info/10 text-info'
                        }`}
                      >
                        {t(`approvals.queue.types.${task.taskType}`)}
                      </span>
                    </td>

                    {/* Amount & Seats */}
                    <td className='py-3.5 px-4 text-right'>
                      <p className='font-bold text-foreground'>{formatCurrency(task.amount)}</p>
                      {task.seatCount && (
                        <p className='text-muted-foreground text-[11px]'>
                          {t('approvals.queue.paidSeatsFormat', { count: task.seatCount })}
                        </p>
                      )}
                    </td>

                    {/* SLA Status */}
                    <td className='py-3.5 px-4'>
                      {task.isOverdue ? (
                        <div className='flex items-center gap-1 font-bold text-danger'>
                          <AlertTriangle className='size-3.5 shrink-0' />
                          <span>
                            {t('approvals.queue.overdueSlaFormat', {
                              hours: Math.abs(task.slaHoursRemaining)
                            })}
                          </span>
                        </div>
                      ) : task.slaHoursRemaining <= 24 ? (
                        <div className='flex items-center gap-1 font-bold text-warning'>
                          <Clock className='size-3.5 shrink-0' />
                          <span>
                            {t('approvals.queue.urgentSlaFormat', {
                              hours: task.slaHoursRemaining
                            })}
                          </span>
                        </div>
                      ) : (
                        <div className='flex items-center gap-1 text-muted-foreground'>
                          <Clock className='size-3.5 shrink-0' />
                          <span>
                            {t('approvals.queue.remainingSlaFormat', {
                              hours: task.slaHoursRemaining
                            })}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className='py-3.5 px-4 text-center'>
                      <button
                        className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 font-bold text-primary-foreground shadow-xs transition hover:bg-primary/90'
                        onClick={() =>
                          onSelectTab(task.taskType === 'RENEWAL' ? 'renewal-decision' : 'expense-approval', {
                            id: task.id
                          })
                        }
                        type='button'
                      >
                        <span>{t('approvals.queue.actions.review')}</span>
                        <ArrowRight className='size-3.5' />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
