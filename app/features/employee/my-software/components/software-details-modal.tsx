import { ArrowRightLeft, Calendar, Key, RotateCcw, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { SoftwareLicenseItem } from '../my-software.types'

interface SoftwareDetailsModalProps {
  item: SoftwareLicenseItem | null
  onClose: () => void
}

export function SoftwareDetailsModal({ item, onClose }: SoftwareDetailsModalProps) {
  const { t } = useTranslation()

  if (!item) return null

  return (
    <div
      aria-labelledby='software-modal-title'
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
          <h2 className='text-lg font-bold text-neutral-900' id='software-modal-title'>
            {t('mySoftware.modal.title')}
          </h2>
          <button
            aria-label={t('mySoftware.modal.close')}
            className='rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700'
            onClick={onClose}
            type='button'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='mt-5 space-y-5'>
          {/* Main Info */}
          <div className='flex items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4'>
            <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white p-2.5 shadow-xs'>
              <img alt={item.name} className='h-9 w-9 object-contain' src={item.logoUrl} />
            </div>
            <div>
              <div className='text-lg font-bold text-neutral-900'>{item.name}</div>
              <div className='text-xs text-neutral-500'>{item.vendor}</div>
              <div className='mt-1 inline-block rounded bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700'>
                {item.plan}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className='grid grid-cols-2 gap-3 text-sm'>
            <div className='rounded-lg border border-neutral-200 bg-white p-3'>
              <div className='flex items-center gap-1.5 text-xs text-neutral-500'>
                <Calendar className='h-3.5 w-3.5 text-neutral-400' />
                {t('mySoftware.modal.assignedDate')}
              </div>
              <div className='mt-1 font-semibold text-neutral-900'>{item.assignedDate}</div>
            </div>

            <div className='rounded-lg border border-neutral-200 bg-white p-3'>
              <div className='flex items-center gap-1.5 text-xs text-neutral-500'>
                <Calendar className='h-3.5 w-3.5 text-neutral-400' />
                {t('mySoftware.modal.expirationDate')}
              </div>
              <div className='mt-1 font-semibold text-neutral-900'>
                {item.expirationDate ?? t('mySoftware.table.noExpiration')}
              </div>
            </div>

            <div className='col-span-2 rounded-lg border border-neutral-200 bg-white p-3'>
              <div className='flex items-center gap-1.5 text-xs text-neutral-500'>
                <Key className='h-3.5 w-3.5 text-neutral-400' />
                {t('mySoftware.modal.licenseKey')}
              </div>
              <div className='mt-1 font-mono text-xs font-semibold text-neutral-700'>
                {item.licenseKey ?? 'LIC-ENT-2026-X998A'}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className='border-t border-neutral-200 pt-4'>
            <div className='mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500'>
              {t('mySoftware.modal.requestAction')}
            </div>
            <div className='flex gap-3'>
              <button
                className='flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100'
                type='button'
              >
                <RotateCcw className='h-4 w-4' />
                {t('mySoftware.modal.requestRenewal')}
              </button>
              <button
                className='flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50'
                type='button'
              >
                <ArrowRightLeft className='h-4 w-4' />
                {t('mySoftware.modal.returnLicense')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
