import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Save
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, Panel, PanelTitle, Pill } from '../../../dashboard-ui'
import { type SystemSettings, initialSystemSettings } from '../../super-admin-data'

export function SuperAdminSettingsView() {
  const { t } = useTranslation('dashboard')
  const [settings, setSettings] = useState<SystemSettings>(initialSystemSettings)
  const [isSaved, setIsSaved] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reroutedStepsCount, setReroutedStepsCount] = useState<number | null>(null)

  // Handlers
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Validation 1: Alternate cannot be the same as Primary
    if (settings.primaryApproverId === settings.alternateApproverId) {
      setErrorMessage(t('superAdmin.settings.conflictError'))
      return
    }

    // Check if approver changed -> Re-determine pending steps (FR-3.16, QĐ-28d)
    const approverChanged =
      settings.primaryApproverId !== initialSystemSettings.primaryApproverId ||
      settings.alternateApproverId !== initialSystemSettings.alternateApproverId

    if (approverChanged) {
      setReroutedStepsCount(3) // 3 pending requests re-routed
    } else {
      setReroutedStepsCount(null)
    }

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 5000)
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        code={t('superAdmin.settings.headerCode')}
        subtitle={t('superAdmin.settings.headerSubtitle')}
        title={t('superAdmin.settings.headerTitle')}
      />

      {isSaved && (
        <div className='flex items-center justify-between rounded-xl border border-success/30 bg-success/15 p-4 text-xs font-semibold text-success animate-in fade-in'>
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='size-5' />
            <div>
              <p className='font-bold'>{t('superAdmin.settings.savedNoticeTitle')}</p>
              {reroutedStepsCount !== null && (
                <p className='mt-0.5 text-[0.7rem]'>
                  {t('superAdmin.settings.reroutedNotice', { count: reroutedStepsCount })}
                </p>
              )}
            </div>
          </div>
          <Pill tone='success'>{t('superAdmin.settings.savedBadge')}</Pill>
        </div>
      )}

      {errorMessage && (
        <div className='flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs font-semibold text-danger animate-in fade-in'>
          <AlertTriangle className='size-5 shrink-0' />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className='space-y-6'>
        {/* Section 1: Approver Hierarchy (UF-13, FR-3.15, SoD-1) */}
        <Panel>
          <PanelTitle
            hint={t('superAdmin.settings.section1Hint')}
            title={t('superAdmin.settings.section1Title')}
          />

          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <div>
              <label className='block text-xs font-bold text-foreground'>
                {t('superAdmin.settings.primaryApproverLabel')}
              </label>
              <select
                className='mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                onChange={(e) => {
                  const name = e.target.options[e.target.selectedIndex].text
                  setSettings({
                    ...settings,
                    primaryApproverId: e.target.value,
                    primaryApproverName: name
                  })
                }}
                value={settings.primaryApproverId}
              >
                <option value='EMP-005'>{t('superAdmin.settings.optNam')}</option>
                <option value='EMP-007'>{t('superAdmin.settings.optMinh')}</option>
                <option value='EMP-009'>{t('superAdmin.settings.optTrong')}</option>
              </select>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                {t('superAdmin.settings.primaryApproverDesc')}
              </p>
            </div>

            <div>
              <label className='block text-xs font-bold text-foreground'>
                {t('superAdmin.settings.alternateApproverLabel')}
              </label>
              <select
                className='mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                onChange={(e) => {
                  const name = e.target.options[e.target.selectedIndex].text
                  setSettings({
                    ...settings,
                    alternateApproverId: e.target.value,
                    alternateApproverName: name
                  })
                }}
                value={settings.alternateApproverId}
              >
                <option value='EMP-007'>{t('superAdmin.settings.optMinh')}</option>
                <option value='EMP-005'>{t('superAdmin.settings.optNam')}</option>
                <option value='EMP-009'>{t('superAdmin.settings.optTrong')}</option>
              </select>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                {t('superAdmin.settings.alternateApproverDesc')}
              </p>
            </div>

            <div>
              <label className='block text-xs font-bold text-foreground'>
                {t('superAdmin.settings.fallbackApproverLabel')}
              </label>
              <select
                className='mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                onChange={(e) => {
                  const name = e.target.options[e.target.selectedIndex].text
                  setSettings({
                    ...settings,
                    fallbackApproverId: e.target.value,
                    fallbackApproverName: name
                  })
                }}
                value={settings.fallbackApproverId}
              >
                <option value='EMP-003'>{t('superAdmin.settings.optMai')}</option>
                <option value='EMP-002'>{t('superAdmin.settings.optVinh')}</option>
              </select>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                {t('superAdmin.settings.fallbackApproverDesc')}
              </p>
            </div>
          </div>
        </Panel>

        {/* Section 2: SLA & Thresholds (FR-3.6, FR-3.13) */}
        <Panel>
          <PanelTitle
            hint={t('superAdmin.settings.section2Hint')}
            title={t('superAdmin.settings.section2Title')}
          />

          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <div>
              <label className='block text-xs font-bold text-foreground'>
                {t('superAdmin.settings.slaHoursLabel')}
              </label>
              <select
                className='mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                onChange={(e) => setSettings({ ...settings, slaHours: Number(e.target.value) })}
                value={settings.slaHours}
              >
                <option value={24}>{t('superAdmin.settings.sla24h')}</option>
                <option value={48}>{t('superAdmin.settings.sla48h')}</option>
                <option value={72}>{t('superAdmin.settings.sla72h')}</option>
              </select>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                {t('superAdmin.settings.slaHint')}
              </p>
            </div>

            <div>
              <label className='block text-xs font-bold text-foreground'>
                {t('superAdmin.settings.seatThresholdLabel')}
              </label>
              <div className='mt-1 flex items-center gap-2'>
                <input
                  className='w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                  max={99}
                  min={50}
                  onChange={(e) =>
                    setSettings({ ...settings, seatWarningThresholdPercent: Number(e.target.value) })
                  }
                  type='number'
                  value={settings.seatWarningThresholdPercent}
                />
                <span className='font-bold text-muted-foreground'>%</span>
              </div>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                {t('superAdmin.settings.seatThresholdHint')}
              </p>
            </div>

            <div>
              <label className='block text-xs font-bold text-foreground'>
                {t('superAdmin.settings.ghostThresholdLabel')}
              </label>
              <div className='mt-1 flex items-center gap-2'>
                <input
                  className='w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                  max={180}
                  min={15}
                  onChange={(e) =>
                    setSettings({ ...settings, ghostSeatThresholdDays: Number(e.target.value) })
                  }
                  type='number'
                  value={settings.ghostSeatThresholdDays}
                />
                <span className='font-bold text-muted-foreground'>{t('superAdmin.settings.daysUnit')}</span>
              </div>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                {t('superAdmin.settings.ghostThresholdHint')}
              </p>
            </div>
          </div>
        </Panel>

        {/* Section 3: Budget Period & Retention Policy (FR-5.1, OI-11b, FR-8.3) */}
        <Panel>
          <PanelTitle
            hint={t('superAdmin.settings.section3Hint')}
            title={t('superAdmin.settings.section3Title')}
          />

          <div className='mt-4 grid gap-4 sm:grid-cols-2'>
            <div className='rounded-xl border border-border bg-surface-subtle/50 p-4'>
              <div className='flex items-center justify-between'>
                <label className='block text-xs font-bold text-foreground'>
                  {t('superAdmin.settings.budgetPeriodLabel')}
                </label>
                <Pill tone='primary'>
                  <Lock className='size-3' /> {t('superAdmin.settings.fixedLockedBadge')}
                </Pill>
              </div>
              <p className='mt-2 text-sm font-bold text-foreground'>{t('superAdmin.settings.quarterlyText')}</p>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                {t('superAdmin.settings.quarterlyHint')}
              </p>
            </div>

            <div className='rounded-xl border border-border bg-surface-subtle/50 p-4'>
              <label className='block text-xs font-bold text-foreground'>
                {t('superAdmin.settings.auditRetentionLabel')}
              </label>
              <div className='mt-2 flex items-center gap-2'>
                <input
                  className='w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none'
                  max={3650}
                  min={90}
                  onChange={(e) =>
                    setSettings({ ...settings, auditRetentionDays: Number(e.target.value) })
                  }
                  type='number'
                  value={settings.auditRetentionDays}
                />
                <span className='font-bold text-muted-foreground'>{t('superAdmin.settings.daysUnit')}</span>
              </div>
              <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                {t('superAdmin.settings.auditRetentionHint')}
              </p>
            </div>
          </div>
        </Panel>

        {/* Save button and Audit Trail note */}
        <div className='flex items-center justify-between pt-2'>
          <p className='text-xs text-muted-foreground'>
            {t('superAdmin.settings.bottomAuditNote')}
          </p>
          <button
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
            type='submit'
          >
            <Save className='size-4' />
            {t('superAdmin.settings.saveBtn')}
          </button>
        </div>
      </form>
    </div>
  )
}
