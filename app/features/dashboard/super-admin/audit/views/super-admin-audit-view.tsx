import {
  FileText,
  Play,
  RefreshCw,
  Search,
  Server
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FilterChips, PageHeader, Panel, PanelTitle, Pill } from '../../../dashboard-ui'
import {
  type AuditLogItem,
  type BackgroundJobItem,
  initialAuditLogs,
  initialBackgroundJobs
} from '../../super-admin-data'

type AuditFilterStatus = 'ALL' | 'SUCCESS' | 'REJECTED'

export function SuperAdminAuditView() {
  const { t } = useTranslation('dashboard')
  const [activeSubTab, setActiveSubTab] = useState<'AUDIT' | 'JOBS'>('AUDIT')
  const [logs] = useState<AuditLogItem[]>(initialAuditLogs)
  const [jobs, setJobs] = useState<BackgroundJobItem[]>(initialBackgroundJobs)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<AuditFilterStatus>('ALL')
  const [runningJobId, setRunningJobId] = useState<string | null>(null)
  const [jobNotice, setJobNotice] = useState<string | null>(null)

  const filteredLogs = logs.filter((log) => {
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleTriggerJob = (jobId: string) => {
    setRunningJobId(jobId)
    setJobNotice(t('superAdmin.audit.triggeringNotice', { id: jobId }))
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                lastRunAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
                processedRecords: job.processedRecords + Math.floor(Math.random() * 5) + 1,
                status: 'SUCCESS'
              }
            : job
        )
      )
      setRunningJobId(null)
      setJobNotice(t('superAdmin.audit.triggeredSuccess'))
      setTimeout(() => setJobNotice(null), 3000)
    }, 1500)
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        actions={
          <div className='flex items-center gap-2'>
            <button
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeSubTab === 'AUDIT'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border bg-surface text-foreground hover:bg-surface-subtle'
              }`}
              onClick={() => setActiveSubTab('AUDIT')}
              type='button'
            >
              <FileText className='mr-1.5 inline size-3.5' />
              {t('superAdmin.audit.tabAudit')}
            </button>
            <button
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeSubTab === 'JOBS'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border bg-surface text-foreground hover:bg-surface-subtle'
              }`}
              onClick={() => setActiveSubTab('JOBS')}
              type='button'
            >
              <Server className='mr-1.5 inline size-3.5' />
              {t('superAdmin.audit.tabJobs', { count: jobs.length })}
            </button>
          </div>
        }
        code={t('superAdmin.audit.headerCode')}
        subtitle={t('superAdmin.audit.headerSubtitle')}
        title={t('superAdmin.audit.headerTitle')}
      />

      {jobNotice && (
        <div className='flex items-center gap-2 rounded-xl border border-info/30 bg-info/10 p-3 text-xs font-semibold text-info animate-in fade-in'>
          <RefreshCw className='size-4 animate-spin' />
          <span>{jobNotice}</span>
        </div>
      )}

      {activeSubTab === 'AUDIT' ? (
        <Panel>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <FilterChips<AuditFilterStatus>
              label={t('superAdmin.audit.filterLabel')}
              onChange={setStatusFilter}
              options={[
                { count: logs.length, label: t('superAdmin.audit.filterAllLog'), value: 'ALL' },
                {
                  count: logs.filter((l) => l.status === 'SUCCESS').length,
                  label: t('superAdmin.audit.filterSuccess'),
                  value: 'SUCCESS'
                },
                {
                  count: logs.filter((l) => l.status === 'REJECTED').length,
                  label: t('superAdmin.audit.filterRejected'),
                  value: 'REJECTED'
                }
              ]}
              value={statusFilter}
            />

            <div className='relative min-w-[16rem] flex-1 sm:max-w-xs'>
              <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
              <input
                className='w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('superAdmin.audit.searchPlaceholder')}
                type='search'
                value={searchTerm}
              />
            </div>
          </div>

          <div className='mt-4 overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead className='border-b border-border bg-surface-subtle/50 text-[0.7rem] font-bold uppercase text-muted-foreground'>
                <tr>
                  <th className='px-3 py-2.5'>{t('superAdmin.audit.colTime')}</th>
                  <th className='px-3 py-2.5'>{t('superAdmin.audit.colActorRole')}</th>
                  <th className='px-3 py-2.5'>{t('superAdmin.audit.colAdminAction')}</th>
                  <th className='px-3 py-2.5'>{t('superAdmin.audit.colTarget')}</th>
                  <th className='px-3 py-2.5'>{t('superAdmin.audit.colDataChange')}</th>
                  <th className='px-3 py-2.5 text-right'>{t('superAdmin.audit.colStatus')}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {filteredLogs.map((log) => (
                  <tr className='transition hover:bg-surface-subtle/30' key={log.id}>
                    <td className='px-3 py-3 font-mono text-[0.7rem] text-muted-foreground whitespace-nowrap'>
                      {log.timestamp}
                    </td>
                    <td className='px-3 py-3'>
                      <div className='font-bold text-foreground'>{log.actorName}</div>
                      <span className='font-mono text-[0.65rem] text-primary'>{log.actorRole}</span>
                    </td>
                    <td className='px-3 py-3'>
                      <span className='font-semibold text-foreground'>{log.action}</span>
                      <p className='text-[0.65rem] text-muted-foreground'>
                        {t('superAdmin.audit.ipLabel', { ip: log.ipAddress })}
                      </p>
                    </td>
                    <td className='px-3 py-3 font-mono text-xs text-foreground'>{log.target}</td>
                    <td className='px-3 py-3 text-xs'>
                      {log.prevValue && log.newValue ? (
                        <div className='space-y-0.5 text-[0.7rem]'>
                          <div className='text-danger line-through'>
                            {t('superAdmin.audit.prevLabel', { val: log.prevValue })}
                          </div>
                          <div className='text-success font-semibold'>
                            {t('superAdmin.audit.newLabel', { val: log.newValue })}
                          </div>
                        </div>
                      ) : (
                        <span className='text-muted-foreground'>—</span>
                      )}
                    </td>
                    <td className='px-3 py-3 text-right'>
                      {log.status === 'SUCCESS' ? (
                        <Pill tone='success'>{t('superAdmin.audit.appliedStatus')}</Pill>
                      ) : (
                        <Pill tone='danger'>{t('superAdmin.audit.blockedStatus')}</Pill>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <div className='space-y-4'>
          <Panel>
            <PanelTitle
              hint={t('superAdmin.audit.jobsHint')}
              title={t('superAdmin.audit.jobsTitle')}
            />

            <div className='mt-4 divide-y divide-border'>
              {jobs.map((job) => {
                const isRunning = job.id === runningJobId || job.status === 'RUNNING'
                return (
                  <div className='flex flex-wrap items-center justify-between gap-4 py-4' key={job.id}>
                    <div className='flex items-start gap-3 min-w-0'>
                      <span className='mt-1 grid size-9 shrink-0 place-items-center rounded-xl bg-surface-subtle text-primary'>
                        <Server className='size-4' />
                      </span>
                      <div>
                        <div className='flex items-center gap-2'>
                          <h3 className='text-sm font-bold text-foreground'>{job.name}</h3>
                          <Pill tone={isRunning ? 'primary' : 'success'}>
                            {isRunning ? t('superAdmin.audit.jobRunning') : t('superAdmin.audit.jobReady')}
                          </Pill>
                        </div>
                        <p className='mt-1 text-xs text-muted-foreground'>
                          {t('superAdmin.audit.jobCycle', { schedule: job.schedule })} ·{' '}
                          {t('superAdmin.audit.jobProcessed', { count: job.processedRecords })}
                        </p>
                        <div className='mt-1 flex items-center gap-4 text-[0.7rem] text-muted-foreground'>
                          <span>{t('superAdmin.audit.jobLastRun', { time: job.lastRunAt })}</span>
                          <span>{t('superAdmin.audit.jobNextRun', { time: job.nextRunAt })}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className='inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-surface px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:opacity-50'
                      disabled={isRunning}
                      onClick={() => handleTriggerJob(job.id)}
                      type='button'
                    >
                      {isRunning ? (
                        <>
                          <RefreshCw className='size-3.5 animate-spin' />
                          {t('superAdmin.audit.running')}
                        </>
                      ) : (
                        <>
                          <Play className='size-3.5' />
                          {t('superAdmin.audit.triggerNow')}
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}
