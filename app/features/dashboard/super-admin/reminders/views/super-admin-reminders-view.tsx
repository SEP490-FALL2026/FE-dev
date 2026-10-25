import { useState } from 'react'
import {
  CheckCircle2,
  Info,
  RotateCcw,
  Save,
  ShieldCheck
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  initialPendingRequests,
  initialReminderPolicy,
  type PendingManagerRequestSample,
  type ReminderPolicy
} from '../../super-admin-data'
import {
  ReminderSimulationPanel,
  type NotificationLog
} from '../components/reminder-simulation-panel'
import { ReminderConfirmModal } from '../components/reminder-confirm-modal'

export function SuperAdminRemindersView() {
  const { t, i18n } = useTranslation('dashboard')
  // Policy State
  const [activePolicy, setActivePolicy] = useState<ReminderPolicy>(initialReminderPolicy)
  const [inputDays, setInputDays] = useState<string>(String(initialReminderPolicy.noticeDays))
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  // Simulation State
  const [requests, setRequests] = useState<PendingManagerRequestSample[]>(initialPendingRequests)
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([
    {
      departmentName: 'Phòng Thiết kế & Trải nghiệm',
      employeeName: 'Trần Tuấn',
      id: 'log-01',
      message:
        'Yêu cầu cấp phần mềm [Figma Organization] từ nhân viên Trần Tuấn đã chờ 54 giờ vượt mốc 48 giờ SLA quy định. Vui lòng mở xét duyệt.',
      recipientEmail: 'thu.ha@company.com',
      recipientName: 'Thu Hà',
      recipientRole: 'Manager',
      requestId: 'REQ-2026-101',
      sentAt: '22/10/2026 15:00:00',
      slaHours: 48,
      waitingHours: 54
    }
  ])
  const [lastRunTime, setLastRunTime] = useState<string | null>('22/10/2026 15:00:00')

  const parsedDays = parseInt(inputDays, 10)
  const slaHours = (!isNaN(parsedDays) && parsedDays > 0) ? parsedDays * 24 : 48

  const formatPreviewDate = (addedHours: number) => {
    const baseDate = new Date()
    const targetDate = new Date(baseDate.getTime() + addedHours * 60 * 60 * 1000)
    const locale = i18n.language === 'en' ? 'en-US' : 'vi-VN'
    return `${targetDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} ${targetDate.toLocaleDateString(locale)}`
  }

  const handleInputChange = (val: string) => {
    setInputDays(val)
    const num = parseInt(val, 10)
    if (!val.trim()) {
      setValidationError(t('superAdmin.reminders.valEmpty'))
    } else if (isNaN(num) || num <= 0) {
      setValidationError(t('superAdmin.reminders.valPositive'))
    } else if (num > 30) {
      setValidationError(t('superAdmin.reminders.valMax30'))
    } else {
      setValidationError(null)
    }
  }

  const handleOpenConfirm = () => {
    const num = parseInt(inputDays, 10)
    if (isNaN(num) || num <= 0) {
      setValidationError(t('superAdmin.reminders.valInvalidBeforeSave'))
      return
    }
    setShowConfirmModal(true)
  }

  const handleConfirmSave = () => {
    const days = parseInt(inputDays, 10)
    const now = new Date()
    const locale = i18n.language === 'en' ? 'en-US' : 'vi-VN'
    const formattedDate = `${now.toLocaleDateString(locale)} ${now.toLocaleTimeString(locale)}`

    setActivePolicy({
      effectiveFrom: `${formattedDate}`,
      lastUpdated: `${formattedDate} (Super Admin)`,
      noticeDays: days,
      recipientRole: 'MANAGER'
    })

    setShowConfirmModal(false)
    setToastMessage({
      text: t('superAdmin.reminders.toast.toastUpdated', {
        days,
        hours: days * 24
      }),
      type: 'success'
    })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleResetDefault = () => {
    setInputDays('2')
    setValidationError(null)
  }

  const handleRunSimulation = () => {
    const now = new Date()
    const locale = i18n.language === 'en' ? 'en-US' : 'vi-VN'
    const timestampStr = `${now.toLocaleDateString(locale)} ${now.toLocaleTimeString(locale)}`
    setLastRunTime(timestampStr)

    const limitHours = activePolicy.noticeDays * 24
    let newNotificationsCount = 0

    const updatedRequests = requests.map((req) => {
      if (
        req.status === 'APPROVED' ||
        req.status === 'REJECTED' ||
        req.status === 'CLARIFICATION_REQUESTED'
      ) {
        return req
      }

      if (req.waitingHours >= limitHours) {
        const isAlreadyLogged = notificationLogs.some(
          (log) => log.requestId === req.id && !log.isDuplicateBlocked
        )

        if (!isAlreadyLogged) {
          newNotificationsCount++
          const newLog: NotificationLog = {
            departmentName: req.departmentName,
            employeeName: req.employeeName,
            id: `log-${Date.now()}-${req.id}`,
            message: `[SLA Alert] Request ${req.id} (${req.softwareName}) from ${req.employeeName} has been waiting ${req.waitingHours}h (exceeding ${limitHours}h). Please review.`,
            recipientEmail: req.managerEmail,
            recipientName: req.managerName,
            recipientRole: 'Manager',
            requestId: req.id,
            sentAt: timestampStr,
            slaHours: limitHours,
            waitingHours: req.waitingHours
          }
          setNotificationLogs((prev) => [newLog, ...prev])
        }

        return {
          ...req,
          isOverdue: true,
          status: 'ALERT_SENT' as const
        }
      }

      return req
    })

    setRequests(updatedRequests)

    if (newNotificationsCount > 0) {
      setToastMessage({
        text: t('superAdmin.reminders.toast.toastFoundOverdue', {
          count: newNotificationsCount
        }),
        type: 'success'
      })
    } else {
      setToastMessage({
        text: t('superAdmin.reminders.toast.toastNoOverdue'),
        type: 'info'
      })
    }
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleManagerAction = (
    requestId: string,
    action: 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED'
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            isOverdue: false,
            status: action
          }
        }
        return r
      })
    )

    const actionText =
      action === 'APPROVED'
        ? t('superAdmin.reminders.toast.actionApproved')
        : action === 'REJECTED'
        ? t('superAdmin.reminders.toast.actionRejected')
        : t('superAdmin.reminders.toast.actionClarified')

    setToastMessage({
      text: t('superAdmin.reminders.toast.toastManagerAction', {
        action: actionText,
        id: requestId
      }),
      type: 'info'
    })
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className='space-y-6'>
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-xl animate-[slideUp_0.3s_ease-out] ${
            toastMessage.type === 'success'
              ? 'border-emerald-500/40 bg-surface/95 text-emerald-600 dark:text-emerald-400'
              : toastMessage.type === 'error'
              ? 'border-rose-500/40 bg-surface/95 text-rose-600 dark:text-rose-400'
              : 'border-sky-500/40 bg-surface/95 text-sky-600 dark:text-sky-400'
          }`}
        >
          <CheckCircle2 className='size-5 shrink-0' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage.text}</span>
        </div>
      )}

      {/* Hero Explainer Header */}
      <div className='relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-surface to-background p-6 shadow-sm'>
        <div className='flex items-start gap-4'>
          <div className='rounded-xl bg-primary/15 p-3 text-primary'>
            <ShieldCheck className='size-6' />
          </div>
          <div className='space-y-2 text-sm'>
            <h2 className='text-base font-semibold text-foreground'>
              {t('superAdmin.reminders.heroHeading')}
            </h2>
            <p className='text-muted-foreground leading-relaxed'>
              <strong className='text-foreground'>{t('superAdmin.reminders.heroMechanism')}</strong>{' '}
              {t('superAdmin.reminders.heroMechanismDesc', {
                days: activePolicy.noticeDays,
                hours: activePolicy.noticeDays * 24
              })}
            </p>
            <div className='grid gap-3 pt-2 sm:grid-cols-3'>
              <div className='rounded-xl border border-border/60 bg-surface/80 p-3'>
                <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                  {t('superAdmin.reminders.box1Title')}
                </p>
                <p className='mt-1 text-sm font-medium text-foreground'>
                  {t('superAdmin.reminders.box1Desc')}
                </p>
              </div>
              <div className='rounded-xl border border-border/60 bg-surface/80 p-3'>
                <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                  {t('superAdmin.reminders.box2Title')}
                </p>
                <p className='mt-1 text-sm font-medium text-foreground'>
                  {t('superAdmin.reminders.box2Desc')}
                </p>
              </div>
              <div className='rounded-xl border border-border/60 bg-surface/80 p-3'>
                <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                  {t('superAdmin.reminders.box3Title')}
                </p>
                <p className='mt-1 text-sm font-medium text-foreground'>
                  {t('superAdmin.reminders.box3Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <div className='flex items-center justify-between border-b border-border pb-4'>
          <div>
            <h2 className='text-lg font-bold text-foreground'>{t('superAdmin.reminders.configTitle')}</h2>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {t('superAdmin.reminders.configSubtitle')}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400'>
              <CheckCircle2 className='size-3.5' />
              {t('superAdmin.reminders.activeBadge', {
                days: activePolicy.noticeDays,
                hours: activePolicy.noticeDays * 24
              })}
            </span>
          </div>
        </div>

        <div className='mt-6 grid gap-6 lg:grid-cols-12'>
          <div className='space-y-5 lg:col-span-7'>
            <div>
              <label className='block text-sm font-semibold text-foreground' htmlFor='sla-notice-days'>
                {t('superAdmin.reminders.maxDaysLabel')} <span className='text-rose-500'>*</span>
              </label>
              <div className='mt-2 flex items-center gap-3'>
                <div className='relative max-w-xs flex-1'>
                  <input
                    aria-describedby={validationError ? 'sla-notice-error' : undefined}
                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-base font-bold shadow-sm transition focus:outline-none focus:ring-2 ${
                      validationError
                        ? 'border-rose-500 focus:ring-rose-500/20'
                        : 'border-border focus:border-primary focus:ring-primary/20'
                    }`}
                    id='sla-notice-days'
                    max='30'
                    min='1'
                    onChange={(e) => handleInputChange(e.target.value)}
                    type='number'
                    value={inputDays}
                  />
                  <span className='absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground'>
                    {t('superAdmin.reminders.daysUnit')}
                  </span>
                </div>
                <button
                  className='rounded-xl border border-border bg-surface-subtle px-3.5 py-2.5 text-xs font-semibold text-muted-foreground transition hover:bg-surface hover:text-foreground'
                  onClick={handleResetDefault}
                  type='button'
                >
                  <RotateCcw className='mr-1.5 inline size-3.5' />
                  {t('superAdmin.reminders.btnDefault')}
                </button>
              </div>
              {validationError && (
                <p className='mt-2 text-xs font-medium text-rose-600 dark:text-rose-400' id='sla-notice-error'>
                  {validationError}
                </p>
              )}
            </div>

            <div className='rounded-xl border border-border/80 bg-surface-subtle p-4'>
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('superAdmin.reminders.conversionTitle')}
              </p>
              <div className='mt-2 space-y-1.5 text-sm'>
                <p className='text-foreground'>
                  {t('superAdmin.reminders.conversionEq', { hours: slaHours })}
                </p>
                <p className='text-muted-foreground'>
                  {t('superAdmin.reminders.conversionSample', { time: formatPreviewDate(slaHours) })}
                </p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4 text-xs text-muted-foreground border-t border-border pt-4'>
              <div>
                <span className='block font-medium text-foreground'>{t('superAdmin.reminders.lastUpdatedLabel')}</span>
                <span className='font-mono'>{activePolicy.lastUpdated}</span>
              </div>
              <div>
                <span className='block font-medium text-foreground'>{t('superAdmin.reminders.effectiveLabel')}</span>
                <span>{activePolicy.effectiveFrom}</span>
              </div>
            </div>

            <div className='pt-2'>
              <button
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90'
                onClick={handleOpenConfirm}
                type='button'
              >
                <Save className='size-4' />
                {t('superAdmin.reminders.btnSaveConfig')}
              </button>
            </div>
          </div>

          <div className='rounded-xl border border-primary/20 bg-primary/5 p-5 lg:col-span-5'>
            <h3 className='text-sm font-bold text-foreground flex items-center gap-2'>
              <Info className='size-4 text-primary' />
              {t('superAdmin.reminders.systemBehaviorTitle')}
            </h3>
            <ul className='mt-3 space-y-2.5 text-xs text-muted-foreground'>
              <li className='flex items-start gap-2'>
                <span className='mt-1 size-1.5 rounded-full bg-primary shrink-0' />
                <span>
                  <strong>{t('superAdmin.reminders.behavior1Heading')}</strong>{' '}
                  {t('superAdmin.reminders.behavior1Desc')}
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 size-1.5 rounded-full bg-primary shrink-0' />
                <span>
                  <strong>{t('superAdmin.reminders.behavior2Heading')}</strong>{' '}
                  {t('superAdmin.reminders.behavior2Desc')}
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 size-1.5 rounded-full bg-primary shrink-0' />
                <span>
                  <strong>{t('superAdmin.reminders.behavior3Heading')}</strong>{' '}
                  {t('superAdmin.reminders.behavior3Desc')}
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 size-1.5 rounded-full bg-rose-500 shrink-0' />
                <span>
                  <strong>{t('superAdmin.reminders.behavior4Heading')}</strong>{' '}
                  {t('superAdmin.reminders.behavior4Desc')}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ReminderSimulationPanel
        activePolicy={activePolicy}
        handleManagerAction={handleManagerAction}
        handleRunSimulation={handleRunSimulation}
        lastRunTime={lastRunTime}
        notificationLogs={notificationLogs}
        requests={requests}
      />

      <ReminderConfirmModal
        activePolicy={activePolicy}
        handleConfirmSave={handleConfirmSave}
        parsedDays={parsedDays}
        setShowConfirmModal={setShowConfirmModal}
        showConfirmModal={showConfirmModal}
        slaHours={slaHours}
      />
    </div>
  )
}
