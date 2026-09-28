import { AlertCircle, ArrowRight, Building2, Calendar, ChevronDown, Folder, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { TemporaryRenewalFormData } from '../temporary-renewal.types'

interface RenewalFormPanelProps {
  formData: TemporaryRenewalFormData
  onChangeField: <K extends keyof TemporaryRenewalFormData>(field: K, value: TemporaryRenewalFormData[K]) => void
  onCancel: () => void
  onReview: () => void
}

export function RenewalFormPanel({ formData, onChangeField, onCancel, onReview }: RenewalFormPanelProps) {
  const { t } = useTranslation()

  return (
    <div className='space-y-6'>
      {/* Alert Banner */}
      <div className='flex gap-4 rounded-xl border border-brand-300 bg-amber-50/70 p-4 shadow-2xs'>
        <AlertCircle className='mt-0.5 h-5 w-5 shrink-0 text-brand-500' />
        <div>
          <h4 className='mb-1 text-sm font-semibold text-neutral-900'>{t('temporaryRenewal.alert.title')}</h4>
          <p className='text-sm text-neutral-600'>{t('temporaryRenewal.alert.description')}</p>
        </div>
      </div>

      {/* Form Container */}
      <div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8'>
        {/* Row 1: Dates & Duration */}
        <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* New Expiration Date */}
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-neutral-900'>
              <span>{t('temporaryRenewal.form.newExpirationDateLabel')}</span>
              <span className='ml-1 text-rose-500'>*</span>
            </label>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500'>
                <Calendar className='h-4 w-4' />
              </div>
              <input
                className='block w-full rounded-lg border border-neutral-200 bg-white py-2.5 pr-10 pl-10 text-sm text-neutral-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
                onChange={(e) => onChangeField('newExpirationDate', e.target.value)}
                type='text'
                value={formData.newExpirationDate}
              />
              {formData.newExpirationDate && (
                <button
                  aria-label={t('temporaryRenewal.form.clearDate')}
                  className='absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-700'
                  onClick={() => onChangeField('newExpirationDate', '')}
                  type='button'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>
            <p className='mt-1.5 text-xs text-neutral-500'>{t('temporaryRenewal.form.newExpirationDateHelper')}</p>
          </div>

          {/* Requested Extension Duration */}
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-neutral-900'>
              {t('temporaryRenewal.form.durationLabel')}
            </label>
            <input
              className='block w-full cursor-not-allowed rounded-lg border border-neutral-200 bg-brand-50/40 px-3 py-2.5 text-sm text-neutral-600'
              disabled
              readOnly
              type='text'
              value={formData.duration}
            />
            <p className='mt-1.5 text-xs text-neutral-500'>{t('temporaryRenewal.form.durationHelper')}</p>
          </div>
        </div>

        {/* Reason for renewal */}
        <div className='mb-6'>
          <label className='mb-1.5 block text-sm font-semibold text-neutral-900'>
            <span>{t('temporaryRenewal.form.reasonLabel')}</span>
            <span className='ml-1 text-rose-500'>*</span>
          </label>
          <textarea
            className='block min-h-[80px] w-full resize-y rounded-lg border border-neutral-200 bg-white p-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
            onChange={(e) => onChangeField('reason', e.target.value)}
            placeholder={t('temporaryRenewal.form.reasonPlaceholder')}
            rows={3}
            value={formData.reason}
          />
          <p className='mt-1.5 text-xs text-neutral-500'>{t('temporaryRenewal.form.reasonHelper')}</p>
        </div>

        {/* Row 2: Project & Cost Center */}
        <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Project */}
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-neutral-900'>
              <span>{t('temporaryRenewal.form.projectLabel')}</span>
              <span className='ml-1 text-rose-500'>*</span>
            </label>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500'>
                <Folder className='h-4 w-4' />
              </div>
              <select
                className='block w-full appearance-none rounded-lg border border-neutral-200 bg-white py-2.5 pr-10 pl-10 text-sm text-neutral-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
                onChange={(e) => onChangeField('project', e.target.value)}
                value={formData.project}
              >
                <option value='Project Alpha'>{t('temporaryRenewal.form.projectOptions.alpha')}</option>
                <option value='Project Beta'>{t('temporaryRenewal.form.projectOptions.beta')}</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400'>
                <ChevronDown className='h-4 w-4' />
              </div>
            </div>
          </div>

          {/* Cost Center */}
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-neutral-900'>
              <span>{t('temporaryRenewal.form.costCenterLabel')}</span>
              <span className='ml-1 text-rose-500'>*</span>
            </label>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500'>
                <Building2 className='h-4 w-4' />
              </div>
              <select
                className='block w-full appearance-none rounded-lg border border-neutral-200 bg-white py-2.5 pr-10 pl-10 text-sm text-neutral-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
                onChange={(e) => onChangeField('costCenter', e.target.value)}
                value={formData.costCenter}
              >
                <option value='CC-001 - Product Development'>
                  {t('temporaryRenewal.form.costCenterOptions.cc001')}
                </option>
                <option value='CC-002 - Engineering'>{t('temporaryRenewal.form.costCenterOptions.cc002')}</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400'>
                <ChevronDown className='h-4 w-4' />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Additional Notes */}
        <div className='mb-8'>
          <label className='mb-1.5 block text-sm font-semibold text-neutral-900'>
            <span>{t('temporaryRenewal.form.additionalNotesLabel')}</span>{' '}
            <span className='font-normal text-neutral-500'>{t('temporaryRenewal.form.additionalNotesOptional')}</span>
          </label>
          <textarea
            className='block min-h-[80px] w-full resize-y rounded-lg border border-neutral-200 bg-white p-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
            onChange={(e) => onChangeField('additionalNotes', e.target.value)}
            placeholder={t('temporaryRenewal.form.additionalNotesPlaceholder')}
            rows={3}
            value={formData.additionalNotes}
          />
          <p className='mt-1.5 text-xs text-neutral-500'>{t('temporaryRenewal.form.additionalNotesHelper')}</p>
        </div>

        {/* Form Actions */}
        <div className='flex items-center justify-between border-t border-neutral-200 pt-6'>
          <button
            className='rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-brand-50/50 hover:text-neutral-900'
            onClick={onCancel}
            type='button'
          >
            {t('temporaryRenewal.actions.cancel')}
          </button>
          <button
            className='flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-brand-600'
            onClick={onReview}
            type='button'
          >
            <span>{t('temporaryRenewal.actions.review')}</span>
            <ArrowRight className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  )
}
