import { BellRing } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ReminderPolicy } from '../../super-admin-data'

export interface ReminderConfirmModalProps {
  showConfirmModal: boolean
  setShowConfirmModal: (show: boolean) => void
  activePolicy: ReminderPolicy
  parsedDays: number
  slaHours: number
  handleConfirmSave: () => void
}

export function ReminderConfirmModal({
  showConfirmModal,
  setShowConfirmModal,
  activePolicy,
  parsedDays,
  slaHours,
  handleConfirmSave
}: ReminderConfirmModalProps) {
  const { t } = useTranslation('dashboard')

  if (!showConfirmModal) return null

  return (
    <div
      aria-labelledby='confirm-save-title'
      aria-modal='true'
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
      role='dialog'
    >
      <div className='w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
        <div className='flex items-center gap-3 text-primary'>
          <div className='rounded-xl bg-primary/10 p-2.5'>
            <BellRing className='size-6' />
          </div>
          <h3 className='text-lg font-bold text-foreground' id='confirm-save-title'>
            {t('superAdmin.reminders.confirmModal.confirmTitle')}
          </h3>
        </div>

        <p className='mt-3 text-sm text-muted-foreground leading-relaxed'>
          {t('superAdmin.reminders.confirmModal.confirmSubtitle')}
        </p>

        <div className='mt-4 rounded-xl border border-border bg-surface-subtle p-3.5 text-xs space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>
              {t('superAdmin.reminders.confirmModal.currentValLabel')}
            </span>
            <span className='font-bold text-foreground'>
              {t('superAdmin.reminders.confirmModal.currentValText', {
                days: activePolicy.noticeDays,
                hours: activePolicy.noticeDays * 24
              })}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>
              {t('superAdmin.reminders.confirmModal.newValLabel')}
            </span>
            <span className='font-bold text-primary text-sm'>
              {t('superAdmin.reminders.confirmModal.newValText', {
                days: parsedDays,
                hours: slaHours
              })}
            </span>
          </div>
          <div className='flex items-center justify-between border-t border-border/60 pt-2'>
            <span className='text-muted-foreground'>
              {t('superAdmin.reminders.confirmModal.recipientTargetLabel')}
            </span>
            <span className='font-semibold text-foreground'>
              {t('superAdmin.reminders.confirmModal.recipientTargetValue')}
            </span>
          </div>
        </div>

        <p className='mt-3 text-xs text-muted-foreground italic'>
          {t('superAdmin.reminders.confirmModal.noteDesc')}
        </p>

        <div className='mt-6 flex justify-end gap-3'>
          <button
            className='rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground'
            onClick={() => setShowConfirmModal(false)}
            type='button'
          >
            {t('superAdmin.reminders.confirmModal.cancelBtn')}
          </button>
          <button
            className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90'
            onClick={handleConfirmSave}
            type='button'
          >
            {t('superAdmin.reminders.confirmModal.confirmBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}
