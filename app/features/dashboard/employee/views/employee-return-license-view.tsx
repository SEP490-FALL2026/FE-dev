import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { employeeSoftwareItems } from '../employee-data'
import type { EmployeeTabKey } from '../employee-nav'
import { EmployeeRequestStepper } from '../employee-request-stepper'

interface EmployeeReturnLicenseViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  initialParams?: Record<string, string>
  softwareId?: string
}

export function EmployeeReturnLicenseView({
  onSelectTab,
  initialParams = {},
  softwareId
}: EmployeeReturnLicenseViewProps) {
  const { t } = useTranslation('dashboard')
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(() =>
    softwareId && employeeSoftwareItems.some((item) => item.id === softwareId) ? softwareId : '1'
  )
  const [reasonCategory, setReasonCategory] = useState(initialParams.reasonCategory || 'projectEnded')
  const [note, setNote] = useState(initialParams.note || '')

  const software = employeeSoftwareItems.find((s) => s.id === selectedSoftwareId) || employeeSoftwareItems[0]

  const handleContinue = () => {
    onSelectTab('review-request', {
      note,
      reasonCategory,
      softwareId: software.id,
      softwareName: software.name,
      type: 'returnLicense'
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
          <span>{t('employee.returnLicense.back')}</span>
        </button>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.returnLicense.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.returnLicense.subtitle')}</p>
      </div>

      <EmployeeRequestStepper currentStep={1} firstStepLabel={t('employee.returnLicense.step1')} />

      {/* Form Card */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-5'>
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground' htmlFor='employee-return-software'>
            {t('employee.returnLicense.fieldSoftware')}
          </label>
          <select
            className='h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action sm:text-sm'
            id='employee-return-software'
            onChange={(e) => setSelectedSoftwareId(e.target.value)}
            value={selectedSoftwareId}
          >
            {employeeSoftwareItems.map((s) => (
              <option key={s.id} value={s.id}>
                {t('employee.returnLicense.optionLabel', { key: s.licenseKey, name: s.name, plan: s.plan })}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className='mb-2 text-sm font-semibold text-foreground'>
            {t('employee.returnLicense.fieldReason')}
          </legend>
          <div className='space-y-2'>
            {[
              { id: 'projectEnded', label: t('employee.returnLicense.reasonProjectEnded') },
              { id: 'alternative', label: t('employee.returnLicense.reasonAlternative') },
              { id: 'rarelyUsed', label: t('employee.returnLicense.reasonRarelyUsed') }
            ].map((opt) => (
              <label
                className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition ${
                  reasonCategory === opt.id
                    ? 'border-primary bg-primary-soft/50 font-bold text-primary-ink'
                    : 'border-border bg-surface text-foreground hover:bg-surface-subtle'
                }`}
                key={opt.id}
              >
                <input
                  checked={reasonCategory === opt.id}
                  className='size-4 text-primary'
                  name='returnReason'
                  onChange={() => setReasonCategory(opt.id)}
                  type='radio'
                />
                <span className='text-sm'>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground' htmlFor='employee-return-notes'>
            {t('employee.returnLicense.additionalNotes')}
          </label>
          <textarea
            className='w-full rounded-xl border border-border bg-background p-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action sm:text-sm'
            id='employee-return-notes'
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            value={note}
          />
        </div>

        <div className='flex items-center justify-between pt-3 border-t border-border'>
          <button
            className='rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
            onClick={() => onSelectTab('create-request')}
            type='button'
          >
            {t('employee.returnLicense.actCancel')}
          </button>
          <button
            className='inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-action px-5 py-2 text-sm font-bold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
            onClick={handleContinue}
            type='button'
          >
            <span>{t('employee.returnLicense.actContinue')}</span>
            <ArrowRight aria-hidden='true' className='size-3.5' />
          </button>
        </div>
      </div>
    </div>
  )
}
