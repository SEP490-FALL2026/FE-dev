import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MOCK_TEAM_MEMBERS, MOCK_TEAM_SOFTWARE } from '../manager-data'
import type { ManagerTabKey } from '../manager-nav'

interface ManagerCreateEmployeeRequestViewProps {
  employeeId?: string
  formatCurrency?: (value: number) => string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerCreateEmployeeRequestView({
  employeeId,
  formatCurrency,
  onSelectTab
}: ManagerCreateEmployeeRequestViewProps) {
  const { t } = useTranslation('dashboard')

  const [selectedMemberId, setSelectedMemberId] = useState(employeeId || MOCK_TEAM_MEMBERS[0].id)
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(MOCK_TEAM_SOFTWARE[0].id)
  const [justification, setJustification] = useState('')
  const [urgency, setUrgency] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')
  const [submitted, setSubmitted] = useState(false)

  const selectedMember = MOCK_TEAM_MEMBERS.find((m) => m.id === selectedMemberId) || MOCK_TEAM_MEMBERS[0]
  const selectedSoftware = MOCK_TEAM_SOFTWARE.find((s) => s.id === selectedSoftwareId) || MOCK_TEAM_SOFTWARE[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      onSelectTab('team-requests')
    }, 2000)
  }

  return (
    <div className='max-w-3xl space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <button
          className='inline-flex items-center justify-center rounded-xl border border-border bg-surface p-2 text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground'
          onClick={() => onSelectTab('my-team')}
          type='button'
        >
          <ArrowLeft className='size-5' />
        </button>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('manager.createRequest.title')}
          </h1>
          <p className='mt-0.5 text-xs text-muted-foreground'>{t('manager.createRequest.subtitle')}</p>
        </div>
      </div>

      {submitted ? (
        <div className='rounded-2xl border border-success/30 bg-success/10 p-8 text-center space-y-3 shadow-sm'>
          <CheckCircle2 className='size-12 text-success mx-auto' />
          <h2 className='text-base font-bold text-foreground'>{t('manager.createRequest.successTitle')}</h2>
          <p className='text-xs text-muted-foreground max-w-md mx-auto'>
            {t('manager.createRequest.successDesc', {
              employee: selectedMember.name,
              software: selectedSoftware.name
            })}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-6'>
          {/* Member Selection */}
          <div className='space-y-2'>
            <label className='block text-xs font-bold text-foreground'>
              {t('manager.createRequest.labelEmployee')}
            </label>
            <select
              className='h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setSelectedMemberId(e.target.value)}
              value={selectedMemberId}
            >
              {MOCK_TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.code}) - {m.jobTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Software Selection */}
          <div className='space-y-2'>
            <label className='block text-xs font-bold text-foreground'>
              {t('manager.createRequest.labelSoftware')}
            </label>
            <select
              className='h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setSelectedSoftwareId(e.target.value)}
              value={selectedSoftwareId}
            >
              {MOCK_TEAM_SOFTWARE.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.plan}) - {s.category}
                </option>
              ))}
            </select>
          </div>

          {/* Cost Center info */}
          <div className='rounded-xl border border-border bg-surface-subtle/50 p-4 text-xs space-y-1'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('manager.createRequest.costCenterLabel')}:</span>
              <span className='font-mono font-bold text-foreground'>{selectedMember.costCenter}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('manager.createRequest.deptLabel')}:</span>
              <span className='font-medium text-foreground'>{selectedMember.department}</span>
            </div>
            {formatCurrency && (
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>{t('manager.software.colMonthlyCost')}:</span>
                <span className='font-bold text-foreground'>{formatCurrency(selectedSoftware.monthlyCost)}</span>
              </div>
            )}
          </div>

          {/* Urgency */}
          <div className='space-y-2'>
            <label className='block text-xs font-bold text-foreground'>{t('manager.createRequest.labelUrgency')}</label>
            <div className='grid grid-cols-3 gap-2'>
              {[
                { id: 'LOW' as const, label: t('manager.requests.urgencyLow') },
                { id: 'MEDIUM' as const, label: t('manager.requests.urgencyMedium') },
                { id: 'HIGH' as const, label: t('manager.requests.urgencyHigh') }
              ].map((opt) => (
                <button
                  key={opt.id}
                  className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                    urgency === opt.id
                      ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                      : 'border-border bg-background text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                  }`}
                  onClick={() => setUrgency(opt.id)}
                  type='button'
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Justification */}
          <div className='space-y-2'>
            <label className='block text-xs font-bold text-foreground'>
              {t('manager.createRequest.labelJustification')}
            </label>
            <textarea
              className='w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setJustification(e.target.value)}
              placeholder={t('manager.createRequest.justificationPlaceholder')}
              required
              rows={4}
              value={justification}
            />
          </div>

          {/* Form Actions */}
          <div className='flex items-center justify-end gap-3 pt-4 border-t border-border'>
            <button
              className='rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground'
              onClick={() => onSelectTab('my-team')}
              type='button'
            >
              {t('manager.createRequest.cancelBtn')}
            </button>
            <button
              className='rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
              type='submit'
            >
              {t('manager.createRequest.submitBtn')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
