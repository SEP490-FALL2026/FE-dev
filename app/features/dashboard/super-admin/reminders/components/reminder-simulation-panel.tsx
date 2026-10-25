import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Play
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PendingManagerRequestSample, ReminderPolicy } from '../../super-admin-data'

export interface NotificationLog {
  id: string
  recipientName: string
  recipientRole: string
  recipientEmail: string
  departmentName: string
  requestId: string
  employeeName: string
  waitingHours: number
  slaHours: number
  message: string
  sentAt: string
  isDuplicateBlocked?: boolean
}

export interface ReminderSimulationPanelProps {
  requests: PendingManagerRequestSample[]
  activePolicy: ReminderPolicy
  lastRunTime: string | null
  notificationLogs: NotificationLog[]
  handleRunSimulation: () => void
  handleManagerAction: (
    requestId: string,
    action: 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED'
  ) => void
}

export function ReminderSimulationPanel({
  requests,
  activePolicy,
  lastRunTime,
  notificationLogs,
  handleRunSimulation,
  handleManagerAction
}: ReminderSimulationPanelProps) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
      <div className='flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded-md bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400'>
              <Play className='size-4' />
            </span>
            <h2 className='text-lg font-bold text-foreground'>
              {t('superAdmin.reminders.simulation.panelTitle')}
            </h2>
          </div>
          <p className='text-xs text-muted-foreground mt-0.5'>
            {t('superAdmin.reminders.simulation.panelDesc')}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          {lastRunTime && (
            <span className='text-xs text-muted-foreground'>
              {t('superAdmin.reminders.simulation.lastScan', { time: lastRunTime })}
            </span>
          )}
          <button
            className='inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700'
            onClick={handleRunSimulation}
            type='button'
          >
            <Play className='size-3.5 fill-current' />
            {t('superAdmin.reminders.simulation.scanNowBtn')}
          </button>
        </div>
      </div>

      <div className='mt-6 overflow-hidden rounded-xl border border-border'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
              <tr>
                <th className='px-4 py-3 font-semibold'>{t('superAdmin.reminders.simulation.colReqId')}</th>
                <th className='px-4 py-3 font-semibold'>{t('superAdmin.reminders.simulation.colEmployee')}</th>
                <th className='px-4 py-3 font-semibold'>{t('superAdmin.reminders.simulation.colSoftware')}</th>
                <th className='px-4 py-3 font-semibold'>{t('superAdmin.reminders.simulation.colDeptManager')}</th>
                <th className='px-4 py-3 font-semibold text-center'>{t('superAdmin.reminders.simulation.colWaitingTime')}</th>
                <th className='px-4 py-3 font-semibold text-center'>{t('superAdmin.reminders.simulation.colSlaStatus')}</th>
                <th className='px-4 py-3 font-semibold text-right'>{t('superAdmin.reminders.simulation.colSimActions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {requests.map((req) => {
                const isResolved =
                  req.status === 'APPROVED' ||
                  req.status === 'REJECTED' ||
                  req.status === 'CLARIFICATION_REQUESTED'
                const isOverdueNow = req.waitingHours >= activePolicy.noticeDays * 24

                return (
                  <tr className='hover:bg-surface-subtle/50 transition' key={req.id}>
                    <td className='px-4 py-3 font-mono font-bold text-foreground'>{req.id}</td>
                    <td className='px-4 py-3'>
                      <div className='font-semibold text-foreground'>{req.employeeName}</div>
                      <div className='text-[0.7rem] text-muted-foreground'>{req.employeeEmail}</div>
                    </td>
                    <td className='px-4 py-3'>
                      <span className='font-medium text-foreground'>{req.softwareName}</span>
                      <div className='text-[0.7rem] text-muted-foreground'>
                        {t('superAdmin.reminders.simulation.sentAt', { time: req.requestedAt })}
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='font-medium text-foreground'>{req.departmentName}</div>
                      <div className='text-[0.7rem]'>
                        {req.managerEmail.includes('Chưa có Manager') ? (
                          <span className='inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400'>
                            <AlertCircle className='size-3' /> {t('superAdmin.reminders.simulation.noManager')}
                          </span>
                        ) : (
                          <span className='text-muted-foreground'>
                            {t('superAdmin.reminders.simulation.managerLabel', {
                              email: req.managerEmail,
                              name: req.managerName
                            })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <span
                        className={`font-mono text-sm font-bold ${
                          isOverdueNow && !isResolved ? 'text-rose-600 dark:text-rose-400' : 'text-foreground'
                        }`}
                      >
                        {t('superAdmin.reminders.simulation.waitingHours', { hours: req.waitingHours })}
                      </span>
                      <div className='text-[0.65rem] text-muted-foreground'>
                        {t('superAdmin.reminders.simulation.limitHours', {
                          hours: activePolicy.noticeDays * 24
                        })}
                      </div>
                    </td>
                    <td className='px-4 py-3 text-center'>
                      {isResolved ? (
                        <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.7rem] font-semibold text-emerald-700 dark:text-emerald-400'>
                          <CheckCircle2 className='size-3' />
                          {req.status === 'APPROVED'
                            ? t('superAdmin.reminders.simulation.statusApproved')
                            : req.status === 'REJECTED'
                            ? t('superAdmin.reminders.simulation.statusRejected')
                            : t('superAdmin.reminders.simulation.statusClarification')}
                        </span>
                      ) : isOverdueNow ? (
                        <span className='inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[0.7rem] font-bold text-rose-700 dark:text-rose-400'>
                          <AlertTriangle className='size-3' />
                          {req.status === 'ALERT_SENT'
                            ? t('superAdmin.reminders.simulation.statusAlertSent')
                            : t('superAdmin.reminders.simulation.statusOverdueUnsent')}
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-[0.7rem] font-semibold text-sky-700 dark:text-sky-400'>
                          <Clock className='size-3' />
                          {t('superAdmin.reminders.simulation.statusWithinSla')}
                        </span>
                      )}
                    </td>
                    <td className='px-4 py-3 text-right'>
                      {isResolved ? (
                        <span className='text-[0.7rem] italic text-muted-foreground'>
                          {t('superAdmin.reminders.simulation.resolvedText')}
                        </span>
                      ) : (
                        <div className='inline-flex items-center gap-1.5'>
                          <button
                            className='rounded-lg bg-emerald-600 px-2 py-1 text-[0.65rem] font-semibold text-white transition hover:bg-emerald-700'
                            onClick={() => handleManagerAction(req.id, 'APPROVED')}
                            title={t('superAdmin.reminders.simulation.titleApprove')}
                            type='button'
                          >
                            {t('superAdmin.reminders.simulation.btnApprove')}
                          </button>
                          <button
                            className='rounded-lg bg-rose-600 px-2 py-1 text-[0.65rem] font-semibold text-white transition hover:bg-rose-700'
                            onClick={() => handleManagerAction(req.id, 'REJECTED')}
                            title={t('superAdmin.reminders.simulation.titleReject')}
                            type='button'
                          >
                            {t('superAdmin.reminders.simulation.btnReject')}
                          </button>
                          <button
                            className='rounded-lg border border-border bg-surface px-2 py-1 text-[0.65rem] font-medium text-foreground transition hover:bg-surface-subtle'
                            onClick={() => handleManagerAction(req.id, 'CLARIFICATION_REQUESTED')}
                            title={t('superAdmin.reminders.simulation.titleClarify')}
                            type='button'
                          >
                            {t('superAdmin.reminders.simulation.btnClarify')}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className='mt-6 rounded-xl border border-border bg-surface-subtle p-5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Bell className='size-4 text-primary' />
            <h3 className='text-sm font-bold text-foreground'>
              {t('superAdmin.reminders.simulation.logsHeading')}
            </h3>
          </div>
          <span className='text-xs text-muted-foreground'>
            {t('superAdmin.reminders.simulation.logsCount', { count: notificationLogs.length })}
          </span>
        </div>
        <p className='mt-1 text-xs text-muted-foreground'>
          {t('superAdmin.reminders.simulation.logsDesc')}
        </p>

        <div className='mt-4 space-y-3'>
          {notificationLogs.length === 0 ? (
            <p className='py-6 text-center text-xs text-muted-foreground italic'>
              {t('superAdmin.reminders.simulation.emptyLogsDesc')}
            </p>
          ) : (
            notificationLogs.map((log) => (
              <div
                className='rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs transition'
                key={log.id}
              >
                <div className='flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-2'>
                  <div className='flex items-center gap-2'>
                    <span className='rounded bg-amber-500/20 px-1.5 py-0.5 font-bold text-amber-800 dark:text-amber-300'>
                      {t('superAdmin.reminders.simulation.badgeSendToManager')}
                    </span>
                    <strong className='text-foreground'>{log.recipientName}</strong>
                    <span className='text-muted-foreground'>({log.recipientEmail})</span>
                    <span className='text-muted-foreground'>• {log.departmentName}</span>
                  </div>
                  <span className='font-mono text-muted-foreground'>{log.sentAt}</span>
                </div>
                <p className='mt-2.5 text-foreground leading-relaxed'>{log.message}</p>
                <div className='mt-2 flex items-center justify-between text-[0.7rem] text-muted-foreground pt-1 border-t border-amber-500/10'>
                  <span>
                    {t('superAdmin.reminders.simulation.logFooter', {
                      empName: log.employeeName,
                      reqId: log.requestId
                    })}
                  </span>
                  <span className='font-semibold text-emerald-600 dark:text-emerald-400'>
                    {t('superAdmin.reminders.simulation.logDeliveredBadge')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
