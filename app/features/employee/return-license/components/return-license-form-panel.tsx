import { ArrowRight, Calendar, CalendarX, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import type { ReturnLicenseFormData, ReturnReasonKey, ReturnSoftwareDetail } from '../return-license.types'

interface ReturnLicenseFormPanelProps {
  software: ReturnSoftwareDetail
  formData: ReturnLicenseFormData
  onChangeReason: (reason: ReturnReasonKey) => void
  onChangeNotes: (notes: string) => void
  onReview?: () => void
}

export function ReturnLicenseFormPanel({
  software,
  formData,
  onChangeReason,
  onChangeNotes,
  onReview
}: ReturnLicenseFormPanelProps) {
  const { t } = useTranslation()

  const reasonOptions: Array<{
    key: ReturnReasonKey
    titleKey: string
    descKey: string
  }> = [
    {
      key: 'project_completed',
      titleKey: 'returnLicense.reasons.projectCompleted.title',
      descKey: 'returnLicense.reasons.projectCompleted.description'
    },
    {
      key: 'no_longer_needed',
      titleKey: 'returnLicense.reasons.noLongerNeeded.title',
      descKey: 'returnLicense.reasons.noLongerNeeded.description'
    },
    {
      key: 'switching_tool',
      titleKey: 'returnLicense.reasons.switchingTool.title',
      descKey: 'returnLicense.reasons.switchingTool.description'
    },
    {
      key: 'other',
      titleKey: 'returnLicense.reasons.other.title',
      descKey: 'returnLicense.reasons.other.description'
    }
  ]

  return (
    <div className='space-y-6'>
      <div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
        {/* Section 1: Software to return */}
        <div className='mb-8'>
          <h3 className='mb-4 text-base font-semibold text-neutral-900'>
            {t('returnLicense.softwareCard.sectionTitle')}
          </h3>
          <div className='rounded-lg border border-neutral-200 bg-[#FEFBF7] p-5'>
            <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
              {/* Software Header */}
              <div className='flex items-center gap-4'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white p-2 shadow-2xs'>
                  <svg className='h-7 w-7 shrink-0' fill='none' viewBox='0 0 38 57'>
                    <path
                      d='M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z'
                      fill='#1ABCFE'
                    />
                    <path
                      d='M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z'
                      fill='#0ACF83'
                    />
                    <path
                      d='M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z'
                      fill='#FF7262'
                    />
                    <path d='M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z' fill='#F24E1E' />
                    <path
                      d='M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z'
                      fill='#A259FF'
                    />
                  </svg>
                </div>
                <div>
                  <h4 className='text-lg font-bold text-neutral-900'>{software.name}</h4>
                  <p className='text-sm text-neutral-500'>{software.plan}</p>
                  <span className='mt-1 inline-flex items-center rounded bg-[#E7F7F0] px-2 py-0.5 text-xs font-semibold text-status-active'>
                    {t('returnLicense.softwareCard.statusActive')}
                  </span>
                </div>
              </div>

              {/* Software Meta Information */}
              <div className='grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2 sm:gap-x-6'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 shrink-0 text-brand-400' />
                  <span className='text-neutral-500'>{t('returnLicense.softwareCard.assignedDateLabel')}:</span>
                  <span className='font-medium text-neutral-900'>{software.assignedDate}</span>
                </div>

                <div className='flex items-center gap-2'>
                  <CalendarX className='h-4 w-4 shrink-0 text-brand-400' />
                  <span className='text-neutral-500'>{t('returnLicense.softwareCard.expirationDateLabel')}:</span>
                  <span className='font-medium text-neutral-900'>{software.expirationDate}</span>
                </div>

                <div className='flex items-center gap-2 sm:col-span-2'>
                  <User className='h-4 w-4 shrink-0 text-brand-400' />
                  <span className='text-neutral-500'>{t('returnLicense.softwareCard.assignedByLabel')}:</span>
                  <span className='font-medium text-neutral-900'>{software.assignedBy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Why are you returning this license? */}
        <div className='mb-8'>
          <h3 className='mb-4 text-base font-semibold text-neutral-900'>
            {t('returnLicense.reasons.sectionTitle')}{' '}
            <span className='text-status-danger'>{t('returnLicense.reasons.required')}</span>
          </h3>
          <div className='space-y-3'>
            {reasonOptions.map((opt) => {
              const isSelected = formData.reason === opt.key
              return (
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                    isSelected
                      ? 'border-brand-300 bg-brand-50/50 ring-1 ring-brand-500'
                      : 'border-neutral-200 hover:bg-[#FEFBF7]'
                  }`}
                  key={opt.key}
                >
                  <div className='mt-0.5 flex h-5 items-center'>
                    <input
                      checked={isSelected}
                      className='h-4 w-4 text-brand-500 focus:ring-brand-500'
                      name='return_reason'
                      onChange={() => onChangeReason(opt.key)}
                      type='radio'
                      value={opt.key}
                    />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-neutral-900'>{t(opt.titleKey)}</span>
                    <span className='mt-0.5 text-xs text-neutral-500'>{t(opt.descKey)}</span>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Section 3: Additional note */}
        <div className='mb-6'>
          <h3 className='mb-2 text-base font-semibold text-neutral-900'>
            {t('returnLicense.additionalNotes.label')}{' '}
            <span className='font-normal text-neutral-500'>{t('returnLicense.additionalNotes.optional')}</span>
          </h3>
          <textarea
            className='w-full resize-y rounded-lg border border-neutral-200 bg-white p-3 text-sm text-neutral-900 shadow-2xs focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder={t('returnLicense.additionalNotes.placeholder')}
            rows={4}
            value={formData.additionalNotes}
          />
          <p className='mt-2 text-xs text-neutral-500'>{t('returnLicense.additionalNotes.helperText')}</p>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center justify-between border-t border-neutral-200 pt-4'>
          <Link
            className='rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900'
            to='/employee/create-request'
          >
            {t('returnLicense.actions.cancel')}
          </Link>
          <button
            className='flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-brand-600'
            onClick={onReview}
            type='button'
          >
            {t('returnLicense.actions.review')}
            <ArrowRight className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  )
}
