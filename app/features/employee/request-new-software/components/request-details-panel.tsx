import { Calendar, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { AvailableSoftwareItem, RequestFormData } from '../request-new-software.types'

interface RequestDetailsPanelProps {
  selectedSoftware: AvailableSoftwareItem
  formData: RequestFormData
  onChangeField: <K extends keyof RequestFormData>(field: K, value: RequestFormData[K]) => void
  onChangeSoftwareClick?: () => void
}

export function RequestDetailsPanel({
  selectedSoftware,
  formData,
  onChangeField,
  onChangeSoftwareClick
}: RequestDetailsPanelProps) {
  const { t } = useTranslation()

  return (
    <div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <div className='mb-6'>
        <div className='mb-1 text-sm font-medium text-brand-500'>{t('requestNewSoftware.details.stepIndicator')}</div>
        <h2 className='mb-1 text-xl font-bold text-neutral-900'>{t('requestNewSoftware.details.title')}</h2>
        <p className='text-sm text-neutral-600'>{t('requestNewSoftware.details.subtitle')}</p>
      </div>

      <div className='space-y-5'>
        {/* Selected Software Row */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-neutral-900'>
            {t('requestNewSoftware.details.selectedSoftware')}
          </label>
          <div className='flex items-center justify-between rounded-lg border border-neutral-200 bg-brand-50/50 p-3'>
            <div className='flex items-center gap-3'>
              <div className='h-6 w-6 rounded-full bg-gradient-to-br from-brand-500 to-rose-500' />
              <span className='text-sm font-medium text-neutral-900'>{selectedSoftware.name}</span>
            </div>
            <button
              className='text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 hover:underline'
              onClick={onChangeSoftwareClick}
              type='button'
            >
              {t('requestNewSoftware.details.changeSoftware')}
            </button>
          </div>
        </div>

        {/* Plan Select */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-neutral-900'>
            <span>{t('requestNewSoftware.details.planLabel')}</span>
            <span className='ml-1 text-rose-500'>*</span>
          </label>
          <select
            className='block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
            onChange={(e) => onChangeField('plan', e.target.value)}
            value={formData.plan}
          >
            <option value='Professional'>{t('requestNewSoftware.details.planOptions.professional')}</option>
            <option value='Organization'>{t('requestNewSoftware.details.planOptions.organization')}</option>
            <option value='Enterprise'>{t('requestNewSoftware.details.planOptions.enterprise')}</option>
          </select>
        </div>

        {/* Business Reason */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-neutral-900'>
            <span>{t('requestNewSoftware.details.businessReasonLabel')}</span>
            <span className='ml-1 text-rose-500'>*</span>
          </label>
          <div className='relative'>
            <textarea
              className='block w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 pb-7 text-sm text-neutral-900 placeholder-neutral-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
              maxLength={500}
              onChange={(e) => onChangeField('businessReason', e.target.value)}
              placeholder={t('requestNewSoftware.details.businessReasonPlaceholder')}
              rows={3}
              value={formData.businessReason}
            />
            <div className='pointer-events-none absolute right-2.5 bottom-2 text-xs text-neutral-500'>
              {`${formData.businessReason.length}/500`}
            </div>
          </div>
        </div>

        {/* Project Select */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-neutral-900'>
            <span>{t('requestNewSoftware.details.projectLabel')}</span>
            <span className='ml-1 text-rose-500'>*</span>
          </label>
          <select
            className='block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
            onChange={(e) => onChangeField('project', e.target.value)}
            value={formData.project}
          >
            <option value='Project Alpha'>{t('requestNewSoftware.details.projectOptions.alpha')}</option>
            <option value='Project Beta'>{t('requestNewSoftware.details.projectOptions.beta')}</option>
            <option value='Design System'>{t('requestNewSoftware.details.projectOptions.designSystem')}</option>
          </select>
        </div>

        {/* Cost Center Select */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-neutral-900'>
            <span>{t('requestNewSoftware.details.costCenterLabel')}</span>
            <span className='ml-1 text-rose-500'>*</span>
          </label>
          <select
            className='block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
            onChange={(e) => onChangeField('costCenter', e.target.value)}
            value={formData.costCenter}
          >
            <option value='CC-001 - Product Design'>{t('requestNewSoftware.details.costCenterOptions.cc001')}</option>
            <option value='CC-002 - Engineering'>{t('requestNewSoftware.details.costCenterOptions.cc002')}</option>
            <option value='CC-003 - Marketing'>{t('requestNewSoftware.details.costCenterOptions.cc003')}</option>
          </select>
        </div>

        {/* Dates Grid */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='mb-2 block text-sm font-semibold text-neutral-900'>
              <span>{t('requestNewSoftware.details.requiredFromLabel')}</span>
              <span className='ml-1 text-rose-500'>*</span>
            </label>
            <div className='relative'>
              <input
                className='block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 pr-10 text-sm text-neutral-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
                onChange={(e) => onChangeField('requiredFrom', e.target.value)}
                type='text'
                value={formData.requiredFrom}
              />
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400'>
                <Calendar className='h-4 w-4' />
              </div>
            </div>
          </div>

          <div>
            <label className='mb-2 block text-sm font-semibold text-neutral-900'>
              <span>{t('requestNewSoftware.details.requiredUntilLabel')}</span>
            </label>
            <div className='relative'>
              <input
                className='block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 pr-10 text-sm text-neutral-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
                onChange={(e) => onChangeField('requiredUntil', e.target.value)}
                type='text'
                value={formData.requiredUntil}
              />
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400'>
                <Calendar className='h-4 w-4' />
              </div>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className='mt-6 flex gap-3 rounded-lg border border-brand-200 bg-brand-50/50 p-4'>
          <Info className='mt-0.5 h-5 w-5 shrink-0 text-brand-500' />
          <p className='text-sm text-neutral-700'>{t('requestNewSoftware.details.approvalAlert')}</p>
        </div>
      </div>
    </div>
  )
}
