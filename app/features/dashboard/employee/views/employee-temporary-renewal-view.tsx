import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { employeeSoftwareItems } from '../employee-data'
import type { EmployeeTabKey } from '../employee-nav'
import { EmployeeRequestStepper } from '../employee-request-stepper'

interface EmployeeTemporaryRenewalViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  initialParams?: Record<string, string>
  softwareId?: string
}

export function EmployeeTemporaryRenewalView({
  onSelectTab,
  initialParams = {},
  softwareId
}: EmployeeTemporaryRenewalViewProps) {
  const { t } = useTranslation('dashboard')
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(() =>
    softwareId && employeeSoftwareItems.some((item) => item.id === softwareId) ? softwareId : '6'
  )
  const [duration, setDuration] = useState(initialParams.duration || '3months')
  const [reason, setReason] = useState(initialParams.reason || '')
  const canContinue = reason.trim().length > 0

  const software = employeeSoftwareItems.find((s) => s.id === selectedSoftwareId) || employeeSoftwareItems[0]

  const handleContinue = () => {
    if (!canContinue) return
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

      <EmployeeRequestStepper currentStep={1} firstStepLabel={t('employee.temporaryRenewal.step1')} />

      {/* Form Card */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-5'>
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground' htmlFor='employee-renewal-software'>
            {t('employee.temporaryRenewal.fieldSoftware')}
          </label>
          <select
            className='h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action sm:text-sm'
            id='employee-renewal-software'
            onChange={(e) => setSelectedSoftwareId(e.target.value)}
            value={selectedSoftwareId}
          >
            {employeeSoftwareItems.map((s) => (
              <option key={s.id} value={s.id}>
                {t('employee.temporaryRenewal.optionLabel', {
                  date: s.expirationDate || t('employee.mySoftware.noExpiration'),
                  name: s.name,
                  plan: s.plan
                })}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className='mb-2 text-sm font-semibold text-foreground'>
            {t('employee.temporaryRenewal.fieldDuration')}
          </legend>
          <div className='grid grid-cols-3 gap-3'>
            {[
              { id: '1month', label: t('employee.temporaryRenewal.duration1Month') },
              { id: '3months', label: t('employee.temporaryRenewal.duration3Months') },
              { id: '6months', label: t('employee.temporaryRenewal.duration6Months') }
            ].map((opt) => (
              <button
                aria-pressed={duration === opt.id}
                className={`min-h-11 rounded-xl border p-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action ${
                  duration === opt.id
                    ? 'border-primary bg-primary-soft text-primary-ink shadow-xs'
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
        </fieldset>

        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground' htmlFor='employee-renewal-reason'>
            {t('employee.temporaryRenewal.fieldReason')}
          </label>
          <textarea
            className='w-full rounded-xl border border-border bg-background p-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action sm:text-sm'
            id='employee-renewal-reason'
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            value={reason}
          />
        </div>

        {!canContinue && (
          <p className='text-sm text-danger-ink' role='status'>
            {t('employee.temporaryRenewal.reasonRequired')}
          </p>
        )}

        <div className='flex items-center justify-between pt-3 border-t border-border'>
          <button
            className='rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
            onClick={() => onSelectTab('create-request')}
            type='button'
          >
            {t('employee.temporaryRenewal.actCancel')}
          </button>
          <button
            className='inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-action px-5 py-2 text-sm font-bold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action disabled:cursor-not-allowed disabled:opacity-50'
            disabled={!canContinue}
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
