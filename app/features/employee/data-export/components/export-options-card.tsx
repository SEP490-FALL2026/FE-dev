import { Lock, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { DataExportFormData, ExportFormat } from '../data-export.types'

interface ExportOptionsCardProps {
  formData: DataExportFormData
  onChangeFormat: (format: ExportFormat) => void
  onTogglePassword: () => void
  onChangePassphrase: (passphrase: string) => void
  onChangePurpose: (purpose: string) => void
}

export function ExportOptionsCard({
  formData,
  onChangeFormat,
  onTogglePassword,
  onChangePassphrase,
  onChangePurpose
}: ExportOptionsCardProps) {
  const { t } = useTranslation()

  return (
    <div className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs'>
      {/* Step Header */}
      <div className='mb-4 flex items-center gap-2.5 border-b border-neutral-200 pb-4'>
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white shadow-xs'>
          {2}
        </div>
        <h2 className='text-sm font-bold text-neutral-900'>{t('dataExport.step2.title')}</h2>
      </div>

      {/* Format Options Radio Cards */}
      <div className='mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2'>
        {/* JSON Archive */}
        <label
          className={`flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all ${
            formData.format === 'json'
              ? 'border-brand-500 bg-brand-50/20'
              : 'border-neutral-200 bg-[#FEFBF7] hover:border-brand-300'
          }`}
        >
          <div className='mb-2 flex items-center justify-between'>
            <span className='inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-500'>
              {'{ }'}
            </span>
            <input
              checked={formData.format === 'json'}
              className='h-4 w-4 text-brand-500 focus:ring-brand-500'
              name='export_format'
              onChange={() => onChangeFormat('json')}
              type='radio'
              value='json'
            />
          </div>
          <div className='text-xs font-bold text-neutral-900'>{t('dataExport.step2.formats.json.title')}</div>
          <div className='mt-0.5 text-[11px] text-neutral-500'>{t('dataExport.step2.formats.json.subtitle')}</div>
        </label>

        {/* CSV & PDF Package */}
        <label
          className={`flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all ${
            formData.format === 'csv'
              ? 'border-brand-500 bg-brand-50/20'
              : 'border-neutral-200 bg-[#FEFBF7] hover:border-brand-300'
          }`}
        >
          <div className='mb-2 flex items-center justify-between'>
            <span className='inline-flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-xs font-bold text-neutral-600'>
              {t('dataExport.step2.formats.csv.badge')}
            </span>
            <input
              checked={formData.format === 'csv'}
              className='h-4 w-4 text-brand-500 focus:ring-brand-500'
              name='export_format'
              onChange={() => onChangeFormat('csv')}
              type='radio'
              value='csv'
            />
          </div>
          <div className='text-xs font-bold text-neutral-900'>{t('dataExport.step2.formats.csv.title')}</div>
          <div className='mt-0.5 text-[11px] text-neutral-500'>{t('dataExport.step2.formats.csv.subtitle')}</div>
        </label>
      </div>

      {/* Destination & Password Protection */}
      <div className='space-y-4'>
        {/* Destination Email */}
        <div>
          <label className='mb-1.5 block text-xs font-semibold text-neutral-900'>
            {t('dataExport.step2.destination.label')}
          </label>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5'>
              <Mail className='h-4 w-4 text-neutral-500' />
            </div>
            <input
              className='w-full cursor-not-allowed rounded-xl border border-neutral-200 bg-[#FEFBF7] py-2.5 pr-4 pl-9 text-xs font-medium text-neutral-900 focus:outline-hidden'
              readOnly
              type='email'
              value={formData.email}
            />
          </div>
          <p className='mt-1 text-[10px] text-neutral-500'>{t('dataExport.step2.destination.helper')}</p>
        </div>

        {/* Password Protection Toggle Card */}
        <div className='space-y-3 rounded-xl border border-neutral-200 bg-[#FEFBF7] p-3.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <div className='flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-brand-500'>
                <Lock className='h-4 w-4' />
              </div>
              <div>
                <div className='text-xs font-bold text-neutral-900'>{t('dataExport.step2.password.title')}</div>
                <div className='text-[10px] text-neutral-500'>{t('dataExport.step2.password.subtitle')}</div>
              </div>
            </div>

            <button
              aria-checked={formData.passwordProtection}
              aria-label={t('dataExport.step2.password.toggleAriaLabel')}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                formData.passwordProtection ? 'bg-brand-500' : 'bg-neutral-200'
              }`}
              onClick={onTogglePassword}
              role='switch'
              type='button'
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  formData.passwordProtection ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {formData.passwordProtection && (
            <div className='border-t border-neutral-200 pt-2'>
              <label className='mb-1 block text-[11px] font-medium text-neutral-600'>
                {t('dataExport.step2.password.inputLabel')}
              </label>
              <input
                className='w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
                onChange={(e) => onChangePassphrase(e.target.value)}
                placeholder={t('dataExport.step2.password.inputPlaceholder')}
                type='password'
                value={formData.passphrase}
              />
            </div>
          )}
        </div>

        {/* Purpose / Notes */}
        <div>
          <label className='mb-1.5 block text-xs font-semibold text-neutral-900'>
            {t('dataExport.step2.purpose.label')}{' '}
            <span className='font-normal text-neutral-500'>{t('dataExport.step2.purpose.optional')}</span>
          </label>
          <textarea
            className='w-full resize-none rounded-xl border border-neutral-200 bg-[#FEFBF7] px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-500/70 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
            onChange={(e) => onChangePurpose(e.target.value)}
            placeholder={t('dataExport.step2.purpose.placeholder')}
            rows={2}
            value={formData.purpose}
          />
        </div>
      </div>
    </div>
  )
}
