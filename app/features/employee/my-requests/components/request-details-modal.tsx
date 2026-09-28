import { Calendar, CheckCircle2, Clock, HelpCircle, ShieldCheck, X, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { SoftwareRequestItem } from '../my-requests.types'

interface RequestDetailsModalProps {
  item: SoftwareRequestItem | null
  onClose: () => void
}

export function RequestDetailsModal({ item, onClose }: RequestDetailsModalProps) {
  const { t } = useTranslation()

  if (!item) return null

  const isPending = item.status === 'pending'
  const isApproved = item.status === 'approved'
  const isCompleted = item.status === 'completed'
  const isRejected = item.status === 'rejected'

  return (
    <div
      aria-labelledby='request-modal-title'
      aria-modal='true'
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      role='dialog'
    >
      {/* Backdrop */}
      <div className='fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity' onClick={onClose} />

      {/* Modal Dialog */}
      <div className='relative w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-neutral-200 pb-4'>
          <div>
            <span className='font-mono text-xs font-semibold text-brand-600'>{item.id}</span>
            <h2 className='text-lg font-bold text-neutral-900' id='request-modal-title'>
              {t('myRequests.modal.title')}
            </h2>
          </div>
          <button
            aria-label={t('myRequests.modal.close')}
            className='rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700'
            onClick={onClose}
            type='button'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='mt-5 space-y-5'>
          {/* Software Info Card */}
          <div className='flex items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4'>
            <img alt={item.softwareName} className='h-10 w-10 rounded-lg object-contain' src={item.softwareLogoUrl} />
            <div className='flex-1'>
              <div className='text-base font-bold text-neutral-900'>{item.softwareName}</div>
              <div className='flex items-center gap-2 text-xs text-neutral-500'>
                <Calendar className='h-3.5 w-3.5' />
                <span>
                  {item.submittedDate} ({item.submittedTime})
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className='mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500'>
              {t('myRequests.modal.approvalTimeline')}
            </h3>

            <div className='space-y-3'>
              {/* Step 1: Request Submitted */}
              <div className='flex items-start gap-3'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-status-active'>
                  <CheckCircle2 className='h-4 w-4' />
                </div>
                <div>
                  <div className='text-sm font-semibold text-neutral-900'>{t('myRequests.modal.stepSubmitted')}</div>
                  <div className='text-xs text-neutral-500'>{item.submittedDate}</div>
                </div>
              </div>

              {/* Step 2: Manager Approval */}
              <div className='flex items-start gap-3'>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    isPending
                      ? 'bg-amber-100 text-amber-600'
                      : isRejected
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-emerald-100 text-status-active'
                  }`}
                >
                  {isPending ? (
                    <Clock className='h-4 w-4' />
                  ) : isRejected ? (
                    <XCircle className='h-4 w-4' />
                  ) : (
                    <CheckCircle2 className='h-4 w-4' />
                  )}
                </div>
                <div>
                  <div className='text-sm font-semibold text-neutral-900'>{t('myRequests.modal.stepManager')}</div>
                  <div className='text-xs text-neutral-500'>
                    {isPending
                      ? t('myRequests.steps.managerWaiting')
                      : isRejected
                        ? t('myRequests.steps.managerRejected')
                        : t('myRequests.status.approved')}
                  </div>
                </div>
              </div>

              {/* Step 3: IT Provisioning */}
              <div className='flex items-start gap-3'>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    isApproved
                      ? 'bg-amber-100 text-amber-600'
                      : isCompleted
                        ? 'bg-emerald-100 text-status-active'
                        : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className='h-4 w-4' /> : <ShieldCheck className='h-4 w-4' />}
                </div>
                <div>
                  <div className='text-sm font-semibold text-neutral-900'>{t('myRequests.modal.stepIT')}</div>
                  <div className='text-xs text-neutral-500'>
                    {isApproved
                      ? t('myRequests.steps.itProvisioning')
                      : isCompleted
                        ? t('myRequests.status.completed')
                        : t('myRequests.status.pending')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className='border-t border-neutral-200 pt-4 flex gap-3'>
            {isPending && (
              <button
                className='flex-1 rounded-lg border border-neutral-200 bg-white py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50'
                type='button'
              >
                {t('myRequests.modal.cancelRequest')}
              </button>
            )}
            <button
              className='flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50'
              type='button'
            >
              <HelpCircle className='h-4 w-4 text-neutral-400' />
              {t('myRequests.modal.contactSupport')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
