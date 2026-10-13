import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MOCK_TEAM_MEMBERS, MOCK_TEAM_SOFTWARE } from '../manager-data'
import type { ManagerTabKey } from '../manager-nav'
import type { ManagerPreviewRequestInput } from '../manager-preview-request'

interface ManagerCreateEmployeeRequestViewProps {
  employeeId?: string
  formatCurrency?: (value: number) => string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
  onSavePreview: (request: ManagerPreviewRequestInput) => void
  scope?: 'team' | 'individual'
}

export function ManagerCreateEmployeeRequestView({
  employeeId,
  formatCurrency,
  onSelectTab,
  onSavePreview,
  scope = 'individual'
}: ManagerCreateEmployeeRequestViewProps) {
  const { i18n, t } = useTranslation('dashboard')

  const [selectedMemberId, setSelectedMemberId] = useState(employeeId || MOCK_TEAM_MEMBERS[0].id)
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(MOCK_TEAM_SOFTWARE[0].id)
  const [desiredPlan, setDesiredPlan] = useState('')
  const [usageStartDate, setUsageStartDate] = useState('')
  const [usageEndDate, setUsageEndDate] = useState('')
  const [justification, setJustification] = useState('')
  const [urgency, setUrgency] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')
  const [submitted, setSubmitted] = useState(false)

  const selectedMember = MOCK_TEAM_MEMBERS.find((m) => m.id === selectedMemberId) || MOCK_TEAM_MEMBERS[0]
  const selectedSoftware = MOCK_TEAM_SOFTWARE.find((s) => s.id === selectedSoftwareId) || MOCK_TEAM_SOFTWARE[0]
  const selectedTeamMembers = MOCK_TEAM_MEMBERS.filter((member) => selectedMemberIds.includes(member.id))
  const teamMemberNames = new Intl.ListFormat(i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN').format(
    selectedTeamMembers.map((member) => member.name)
  )
  const dateLocale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN'
  const formatUsageDate = (date: string) =>
    new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(`${date}T00:00:00Z`)
    )
  const invalidUsageRange = Boolean(usageStartDate && usageEndDate && usageEndDate < usageStartDate)
  const canPreview =
    (scope === 'individual' || selectedTeamMembers.length > 0) &&
    desiredPlan.trim().length > 0 &&
    Boolean(usageStartDate && usageEndDate) &&
    !invalidUsageRange

  const toggleTeamMember = (id: string) => {
    setSelectedMemberIds((current) =>
      current.includes(id) ? current.filter((memberId) => memberId !== id) : [...current, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canPreview) return
    setSubmitted(true)
  }

  const handleSavePreview = () => {
    onSavePreview({
      scope,
      recipientNames: scope === 'team' ? selectedTeamMembers.map((member) => member.name) : [selectedMember.name],
      softwareName: selectedSoftware.name,
      desiredPlan: desiredPlan.trim(),
      usageStartDate,
      usageEndDate,
      urgency,
      justification: justification.trim()
    })
  }

  return (
    <div className='max-w-3xl space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <button
          aria-label={t('manager.createRequest.backToTeam')}
          className='inline-flex items-center justify-center rounded-xl border border-border bg-surface p-2 text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground'
          onClick={() => onSelectTab('my-team')}
          type='button'
        >
          <ArrowLeft className='size-5' />
        </button>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t(scope === 'team' ? 'manager.createRequest.teamTitle' : 'manager.createRequest.title')}
          </h1>
          <p className='mt-0.5 text-xs text-muted-foreground'>{t('manager.createRequest.subtitle')}</p>
        </div>
      </div>

      {submitted ? (
        <div
          role='status'
          className='rounded-2xl border border-success/30 bg-success/10 p-8 text-center space-y-3 shadow-sm'
        >
          <CheckCircle2 className='size-12 text-success mx-auto' />
          <h2 className='text-base font-bold text-foreground'>{t('manager.createRequest.successTitle')}</h2>
          <p className='text-xs text-muted-foreground max-w-md mx-auto'>{t('manager.createRequest.successDesc')}</p>
          <p className='text-sm font-semibold text-foreground'>
            {scope === 'team' ? teamMemberNames : selectedMember.name}
          </p>
          <dl className='mx-auto max-w-md space-y-2 rounded-xl border border-border bg-surface p-4 text-left text-sm'>
            <div className='flex justify-between gap-4'>
              <dt className='text-muted-foreground'>{t('manager.createRequest.labelSoftware')}</dt>
              <dd className='font-medium text-foreground'>{selectedSoftware.name}</dd>
            </div>
            <div className='flex justify-between gap-4'>
              <dt className='text-muted-foreground'>{t('manager.createRequest.labelDesiredPlan')}</dt>
              <dd className='font-medium text-foreground'>{desiredPlan.trim()}</dd>
            </div>
            <div className='flex justify-between gap-4'>
              <dt className='text-muted-foreground'>{t('manager.createRequest.labelUsageDuration')}</dt>
              <dd className='font-medium text-foreground'>
                {formatUsageDate(usageStartDate)} – {formatUsageDate(usageEndDate)}
              </dd>
            </div>
          </dl>
          <div className='flex flex-wrap justify-center gap-2 pt-3'>
            <button
              className='rounded-xl border border-border bg-surface px-4 py-2 font-semibold text-foreground hover:bg-surface-subtle'
              onClick={() => setSubmitted(false)}
              type='button'
            >
              {t('manager.createRequest.editPreviewBtn')}
            </button>
            <button
              className='rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground hover:bg-primary/90'
              onClick={handleSavePreview}
              type='button'
            >
              {t('manager.createRequest.savePreviewBtn')}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-6'>
          {scope === 'team' ? (
            <fieldset className='space-y-2'>
              <legend className='text-xs font-bold text-foreground'>
                {t('manager.createRequest.labelTeamMembers')}
              </legend>
              <div className='max-h-56 space-y-1 overflow-y-auto rounded-xl border border-border bg-background p-2'>
                {MOCK_TEAM_MEMBERS.map((member) => (
                  <label
                    className='flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-3 text-xs text-foreground hover:bg-surface-subtle'
                    key={member.id}
                  >
                    <input
                      checked={selectedMemberIds.includes(member.id)}
                      className='accent-primary-action'
                      onChange={() => toggleTeamMember(member.id)}
                      type='checkbox'
                    />
                    <span>
                      {member.name} ({member.code})
                    </span>
                  </label>
                ))}
              </div>
              {selectedTeamMembers.length === 0 && (
                <p className='text-xs text-danger-ink' role='status'>
                  {t('manager.createRequest.teamSelectionRequired')}
                </p>
              )}
            </fieldset>
          ) : (
            <div className='space-y-2'>
              <label className='block text-xs font-bold text-foreground' htmlFor='manager-request-member'>
                {t('manager.createRequest.labelEmployee')}
              </label>
              <select
                id='manager-request-member'
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
          )}

          {/* Software Selection */}
          <div className='space-y-2'>
            <label className='block text-xs font-bold text-foreground' htmlFor='manager-request-software'>
              {t('manager.createRequest.labelSoftware')}
            </label>
            <select
              id='manager-request-software'
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

          <div className='space-y-2'>
            <label className='block text-xs font-bold text-foreground' htmlFor='manager-request-plan'>
              {t('manager.createRequest.labelDesiredPlan')}
            </label>
            <input
              className='h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              id='manager-request-plan'
              onChange={(event) => setDesiredPlan(event.target.value)}
              required
              type='text'
              value={desiredPlan}
            />
            {!desiredPlan.trim() && (
              <p className='text-xs text-danger-ink' role='status'>
                {t('manager.createRequest.planRequired')}
              </p>
            )}
          </div>

          <fieldset className='space-y-2'>
            <legend className='text-xs font-bold text-foreground'>
              {t('manager.createRequest.labelUsageDuration')}
            </legend>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='space-y-2'>
                <label className='block text-xs text-muted-foreground' htmlFor='manager-request-start-date'>
                  {t('manager.createRequest.labelUsageStartDate')}
                </label>
                <input
                  className='h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                  id='manager-request-start-date'
                  onChange={(event) => setUsageStartDate(event.target.value)}
                  required
                  type='date'
                  value={usageStartDate}
                />
              </div>
              <div className='space-y-2'>
                <label className='block text-xs text-muted-foreground' htmlFor='manager-request-end-date'>
                  {t('manager.createRequest.labelUsageEndDate')}
                </label>
                <input
                  aria-describedby={invalidUsageRange ? 'manager-request-date-error' : undefined}
                  aria-invalid={invalidUsageRange}
                  className='h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                  id='manager-request-end-date'
                  min={usageStartDate || undefined}
                  onChange={(event) => setUsageEndDate(event.target.value)}
                  required
                  type='date'
                  value={usageEndDate}
                />
              </div>
            </div>
            {invalidUsageRange ? (
              <p className='text-xs text-danger-ink' id='manager-request-date-error' role='alert'>
                {t('manager.createRequest.usageDateOrderInvalid')}
              </p>
            ) : (
              (!usageStartDate || !usageEndDate) && (
                <p className='text-xs text-danger-ink' role='status'>
                  {t('manager.createRequest.usageDatesRequired')}
                </p>
              )
            )}
          </fieldset>

          {/* Cost Center info */}
          <div className='rounded-xl border border-border bg-surface-subtle/50 p-4 text-xs space-y-1'>
            {scope === 'individual' && (
              <>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>{t('manager.createRequest.costCenterLabel')}:</span>
                  <span className='font-mono font-bold text-foreground'>{selectedMember.costCenter}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>{t('manager.createRequest.deptLabel')}:</span>
                  <span className='font-medium text-foreground'>{selectedMember.department}</span>
                </div>
              </>
            )}
            {formatCurrency && (
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>
                  {t(scope === 'team' ? 'manager.createRequest.costPerSeatLabel' : 'manager.software.colMonthlyCost')}:
                </span>
                <span className='font-bold text-foreground'>{formatCurrency(selectedSoftware.monthlyCost)}</span>
              </div>
            )}
          </div>

          {/* Urgency */}
          <div className='space-y-2'>
            <p className='block text-xs font-bold text-foreground' id='manager-request-urgency-label'>
              {t('manager.createRequest.labelUrgency')}
            </p>
            <div aria-labelledby='manager-request-urgency-label' className='grid grid-cols-3 gap-2' role='group'>
              {[
                { id: 'LOW' as const, label: t('manager.requests.urgencyLow') },
                { id: 'MEDIUM' as const, label: t('manager.requests.urgencyMedium') },
                { id: 'HIGH' as const, label: t('manager.requests.urgencyHigh') }
              ].map((opt) => (
                <button
                  aria-pressed={urgency === opt.id}
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
            <label className='block text-xs font-bold text-foreground' htmlFor='manager-request-justification'>
              {t('manager.createRequest.labelJustification')}
            </label>
            <textarea
              id='manager-request-justification'
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
              className='rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
              disabled={!canPreview}
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
