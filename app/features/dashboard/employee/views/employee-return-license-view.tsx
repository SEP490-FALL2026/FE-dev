import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { employeeSoftwareItems } from '../employee-data'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeReturnLicenseViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  softwareId?: string
}

export function EmployeeReturnLicenseView({ onSelectTab, softwareId }: EmployeeReturnLicenseViewProps) {
  const { t } = useTranslation('dashboard')
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(softwareId || '1')
  const [reasonCategory, setReasonCategory] = useState('projectEnded')
  const [note, setNote] = useState('Dự án đã bàn giao xong, xin trả lại seat license cho IT Admin tái sử dụng.')

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

      {/* Stepper */}
      <div className='flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex items-center gap-3'>
          <span className='grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
            {1}
          </span>
          <span className='text-xs font-bold text-foreground'>{t('employee.returnLicense.step1')}</span>
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
            {t('employee.returnLicense.fieldSoftware')}
          </label>
          <select
            className='h-11 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
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

        <div>
          <label className='block text-xs font-semibold text-muted-foreground mb-2'>
            {t('employee.returnLicense.fieldReason')}
          </label>
          <div className='space-y-2'>
            {[
              { id: 'projectEnded', label: t('employee.returnLicense.reasonProjectEnded') },
              { id: 'alternative', label: t('employee.returnLicense.reasonAlternative') },
              { id: 'rarelyUsed', label: t('employee.returnLicense.reasonRarelyUsed') }
            ].map((opt) => (
              <label
                className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition ${
                  reasonCategory === opt.id
                    ? 'border-primary bg-primary-soft/50 font-bold text-primary'
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
                <span className='text-xs'>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className='block text-xs font-semibold text-muted-foreground mb-2'>
            {t('employee.returnLicense.additionalNotes')}
          </label>
          <textarea
            className='w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
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
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
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
