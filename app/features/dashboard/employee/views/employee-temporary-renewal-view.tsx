import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { employeeSoftwareItems } from '../employee-data'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeTemporaryRenewalViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  softwareId?: string
}

export function EmployeeTemporaryRenewalView({ onSelectTab, softwareId }: EmployeeTemporaryRenewalViewProps) {
  const { t } = useTranslation('dashboard')
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(softwareId || '6') // Default Zoom
  const [duration, setDuration] = useState('3months')
  const [reason, setReason] = useState(
    'Cần gia hạn để hoàn thành giai đoạn chạy thử nghiệm và kiểm thử với khách hàng.'
  )

  const software = employeeSoftwareItems.find((s) => s.id === selectedSoftwareId) || employeeSoftwareItems[0]

  const handleContinue = () => {
    onSelectTab('review-request', {
      duration,
      reason,
      softwareId: software.id,
      softwareName: software.name,
      type: 'renewal'
    })
  }

  return (
    <div className='mx-auto max-w-4xl space-y-6'>
      {/* Header */}
      <div>
        <button
          className='inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground'
          onClick={() => onSelectTab('create-request')}
          type='button'
        >
          <ArrowLeft aria-hidden='true' className='size-4' />
          <span>{t('employee.temporaryRenewal.back')}</span>
        </button>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.temporaryRenewal.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.temporaryRenewal.subtitle')}</p>
      </div>

      {/* Stepper */}
      <div className='flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex items-center gap-3'>
          <span className='grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
            {1}
          </span>
          <span className='text-xs font-bold text-foreground'>{t('employee.temporaryRenewal.step1')}</span>
        </div>
        <div className='h-0.5 w-20 bg-border' />
        <div className='flex items-center gap-3 opacity-50'>
          <span className='grid size-7 place-items-center rounded-full border border-border text-xs font-bold text-muted-foreground'>
            {2}
          </span>
          <span className='text-xs font-medium text-muted-foreground'>{t('employee.requestNewSoftware.step2')}</span>
        </div>
        <div className='h-0.5 w-20 bg-border' />
        <div className='flex items-center gap-3 opacity-50'>
          <span className='grid size-7 place-items-center rounded-full border border-border text-xs font-bold text-muted-foreground'>
            {3}
          </span>
          <span className='text-xs font-medium text-muted-foreground'>{t('employee.requestNewSoftware.step3')}</span>
        </div>
      </div>

      {/* Form Card */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-5'>
        <div>
          <label className='block text-xs font-semibold text-muted-foreground mb-2'>
            {t('employee.temporaryRenewal.fieldSoftware')}
          </label>
          <select
            className='h-11 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
            onChange={(e) => setSelectedSoftwareId(e.target.value)}
            value={selectedSoftwareId}
          >
            {employeeSoftwareItems.map((s) => (
              <option key={s.id} value={s.id}>
                {t('employee.temporaryRenewal.optionLabel', {
                  date: s.expirationDate || 'N/A',
                  name: s.name,
                  plan: s.plan
                })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-xs font-semibold text-muted-foreground mb-2'>
            {t('employee.temporaryRenewal.fieldDuration')}
          </label>
          <div className='grid grid-cols-3 gap-3'>
            {[
              { id: '1month', label: t('employee.temporaryRenewal.duration1Month') },
              { id: '3months', label: t('employee.temporaryRenewal.duration3Months') },
              { id: '6months', label: t('employee.temporaryRenewal.duration6Months') }
            ].map((opt) => (
              <button
                className={`rounded-xl border p-3 text-xs font-bold transition ${
                  duration === opt.id
                    ? 'border-primary bg-primary-soft text-primary shadow-xs'
                    : 'border-border bg-surface text-muted-foreground hover:bg-surface-subtle'
                }`}
                key={opt.id}
                onClick={() => setDuration(opt.id)}
                type='button'
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className='block text-xs font-semibold text-muted-foreground mb-2'>
            {t('employee.temporaryRenewal.fieldReason')}
          </label>
          <textarea
            className='w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            value={reason}
          />
        </div>

        <div className='flex items-center justify-between pt-3 border-t border-border'>
          <button
            className='rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
            onClick={() => onSelectTab('create-request')}
            type='button'
          >
            {t('employee.temporaryRenewal.actCancel')}
          </button>
          <button
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
            onClick={handleContinue}
            type='button'
          >
            <span>{t('employee.temporaryRenewal.actContinue')}</span>
            <ArrowRight aria-hidden='true' className='size-3.5' />
          </button>
        </div>
      </div>
    </div>
  )
}
