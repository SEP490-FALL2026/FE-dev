import { AlertCircle, CheckCircle2, Clock, Eye, Play, ShieldAlert, UserCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { itProvisioningTasks, type ProvisioningTask } from '../it-admin-data'

export function ItProvisioningView() {
  const { t } = useTranslation('dashboard')
  const [filter, setFilter] = useState<'all' | 'manual' | 'auto' | 'error' | 'pending'>('all')
  const [selectedTask, setSelectedTask] = useState<ProvisioningTask>(itProvisioningTasks[0])

  const filteredTasks = itProvisioningTasks.filter((task) => {
    if (filter === 'manual') return task.status === 'manual'
    if (filter === 'auto') return task.channel.includes('Connector')
    if (filter === 'error') return task.status === 'retry' || task.status === 'authError' || task.status === 'capacity'
    if (filter === 'pending') return task.status === 'pendingAccept'
    return true
  })

  const statusConfig = {
    authError: { label: t('itAdmin.provisioning.statusAuthError'), tone: 'bg-danger/10 text-danger border-danger/25' },
    capacity: {
      label: t('itAdmin.provisioning.statusCapacity'),
      tone: 'bg-warning/15 text-warning border-warning/30'
    },
    manual: { label: t('itAdmin.provisioning.statusManual'), tone: 'bg-primary-soft text-primary border-primary/25' },
    pendingAccept: {
      label: t('itAdmin.provisioning.statusPendingAccept'),
      tone: 'bg-info/10 text-info border-info/25'
    },
    retry: { label: t('itAdmin.provisioning.statusRetry'), tone: 'bg-danger/10 text-danger border-danger/25' }
  }

  const metricCounts = {
    auto: 12,
    completed: 14,
    failed: 3,
    manual: 8,
    pending: 2
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.provisioning.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.provisioning.subtitle')}</p>
      </div>

      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <UserCheck aria-hidden='true' className='size-4 text-primary' />
            <span>{t('itAdmin.provisioning.manualMetric')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricCounts.manual}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <Play aria-hidden='true' className='size-4 text-info' />
            <span>{t('itAdmin.provisioning.autoMetric')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricCounts.auto}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <Clock aria-hidden='true' className='size-4 text-warning' />
            <span>{t('itAdmin.provisioning.pendingMetric')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricCounts.pending}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <AlertCircle aria-hidden='true' className='size-4 text-danger' />
            <span>{t('itAdmin.provisioning.failedMetric')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricCounts.failed}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <CheckCircle2 aria-hidden='true' className='size-4 text-success' />
            <span>{t('itAdmin.provisioning.completedToday')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricCounts.completed}</p>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-2 border-b border-border pb-3'>
        <button
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border bg-surface text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setFilter('all')}
          type='button'
        >
          {t('itAdmin.provisioning.filterAll')}
        </button>
        <button
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            filter === 'manual'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border bg-surface text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setFilter('manual')}
          type='button'
        >
          {t('itAdmin.provisioning.filterManual')}
        </button>
        <button
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            filter === 'auto'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border bg-surface text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setFilter('auto')}
          type='button'
        >
          {t('itAdmin.provisioning.filterAuto')}
        </button>
        <button
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            filter === 'error'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border bg-surface text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setFilter('error')}
          type='button'
        >
          {t('itAdmin.provisioning.filterError')}
        </button>
        <button
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            filter === 'pending'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border bg-surface text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setFilter('pending')}
          type='button'
        >
          {t('itAdmin.provisioning.filterPending')}
        </button>
      </div>

      <div className='grid gap-6 lg:grid-cols-[1.6fr_1fr]'>
        <div className='overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
              <tr>
                <th className='p-3 font-semibold'>{t('itAdmin.provisioning.colId')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.provisioning.colApp')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.provisioning.colUser')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.provisioning.colChannel')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.provisioning.colStatus')}</th>
                <th className='p-3 font-semibold text-right'>{t('itAdmin.provisioning.colActions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredTasks.map((task) => {
                const isSelected = selectedTask.id === task.id
                const cfg = statusConfig[task.status]

                return (
                  <tr
                    className={`cursor-pointer transition hover:bg-surface-subtle/80 ${
                      isSelected ? 'bg-primary-soft/30' : ''
                    }`}
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                  >
                    <td className='p-3 font-mono font-bold text-foreground'>{task.id}</td>
                    <td className='p-3 font-semibold text-foreground'>{task.app}</td>
                    <td className='p-3'>
                      <span className='block font-semibold text-foreground'>{task.user}</span>
                      <span className='text-[0.7rem] text-muted-foreground'>{task.account}</span>
                    </td>
                    <td className='p-3 text-muted-foreground'>{task.channel}</td>
                    <td className='p-3'>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${cfg.tone}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className='p-3 text-right'>
                      <button
                        className='inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold hover:border-primary hover:text-primary'
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTask(task)
                        }}
                        type='button'
                      >
                        <Eye aria-hidden='true' className='size-3.5' />
                        <span>{t('savings.action')}</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div className='flex items-center justify-between border-b border-border pb-3'>
            <div>
              <span className='text-xs font-mono font-bold text-primary'>{selectedTask.id}</span>
              <h2 className='text-base font-bold text-foreground'>{selectedTask.app}</h2>
            </div>
            <span className='rounded-lg bg-surface-subtle px-2 py-1 text-xs font-bold text-muted-foreground'>
              {selectedTask.sla}
            </span>
          </div>

          <div className='mt-4 space-y-3 text-xs'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.provisioning.colUser')}:</span>
              <span className='font-semibold text-foreground'>{selectedTask.user}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.provisioning.colAccount')}:</span>
              <span className='font-mono text-foreground'>{selectedTask.account}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.provisioning.colDecision')}:</span>
              <span className='font-mono font-semibold text-foreground'>{selectedTask.decisionSource}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.provisioning.colChannel')}:</span>
              <span className='font-semibold text-foreground'>{selectedTask.channel}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.provisioning.colStatus')}:</span>
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${statusConfig[selectedTask.status].tone}`}
              >
                {statusConfig[selectedTask.status].label}
              </span>
            </div>
          </div>

          <div className='mt-6 border-t border-border pt-4'>
            <div className='rounded-xl border border-primary/20 bg-primary-soft/40 p-3'>
              <div className='flex items-start gap-2'>
                <ShieldAlert aria-hidden='true' className='mt-0.5 size-4 text-primary shrink-0' />
                <p className='text-xs text-muted-foreground'>{t('itAdmin.provisioning.subtitle')}</p>
              </div>
            </div>

            <div className='mt-4 flex gap-2'>
              <button
                className='flex-1 rounded-xl bg-primary py-2.5 text-center text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
                type='button'
              >
                {selectedTask.status === 'manual'
                  ? t('itAdmin.provisioning.actTake')
                  : selectedTask.status === 'pendingAccept'
                    ? t('itAdmin.provisioning.actCheck')
                    : t('itAdmin.provisioning.actExecute')}
              </button>
              <button
                className='rounded-xl border border-border bg-surface px-3 py-2.5 text-xs font-semibold hover:border-primary'
                type='button'
              >
                {t('itAdmin.provisioning.actEvidence')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
