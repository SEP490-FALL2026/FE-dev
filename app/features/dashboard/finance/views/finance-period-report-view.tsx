import { Check, Lock, Minus, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  StatTile,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat
} from '../../dashboard-ui'
import {
  aiDraftNarrative,
  aiDraftSources,
  aiNarrativeAvailable,
  budgetVsActual,
  closingPeriod,
  periodSavings
} from '../finance-data'

type NarrativeMode = 'ai' | 'manual'

/** Who sees what in the published report (BRD 5.5.3); the narrative is in the Finance and Spending Approver copies only. */
const visibility = [
  { role: 'approver', spend: true, savings: true, narrative: true },
  { role: 'finance', spend: true, savings: true, narrative: true },
  { role: 'manager', spend: 'own', savings: false, narrative: false },
  { role: 'itAdmin', spend: false, savings: true, narrative: false }
] as const

export function FinancePeriodReportView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { formatDateTime, formatPeriod } = useDashboardFormat()
  const [mode, setMode] = useState<NarrativeMode>(aiNarrativeAvailable ? 'ai' : 'manual')
  const [narrative, setNarrative] = useState('')
  const [draftGenerated, setDraftGenerated] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const [publishedAt, setPublishedAt] = useState<string | null>(null)

  const totalBudget = budgetVsActual.reduce((sum, line) => sum + (line.budget ?? 0), 0)
  const totalActual = budgetVsActual.reduce((sum, line) => sum + line.periodActual, 0)
  const unallocated = budgetVsActual.find((line) => line.costCenter === null)?.periodActual ?? 0
  const canPublish = !publishedAt && (mode === 'manual' || !draftGenerated || reviewed)

  const cell = (value: boolean | 'own') =>
    value === 'own' ? (
      <Pill tone='info'>{t('finance.report.ownDepartment')}</Pill>
    ) : value ? (
      <Check aria-label={t('finance.report.visible')} className='mx-auto size-4 text-success' />
    ) : (
      <Minus aria-label={t('finance.report.hidden')} className='mx-auto size-4 text-muted-foreground' />
    )

  return (
    <div className='space-y-6'>
      <PageHeader
        code='UF-19 · FIN-34'
        subtitle={t('finance.report.subtitle')}
        title={t('finance.report.title', { period: formatPeriod(closingPeriod) })}
      />

      <section aria-label={t('finance.report.figuresLabel')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatTile
          hint={t('finance.report.ofBudget', { budget: formatCurrency(totalBudget) })}
          icon={Send}
          label={t('finance.report.totalSpend')}
          value={formatCurrency(totalActual)}
        />
        <StatTile
          icon={Sparkles}
          label={t('finance.report.savingsImmediate')}
          tone='success'
          value={formatCurrency(periodSavings.immediate)}
        />
        <StatTile
          hint={t('finance.report.savingsSeparate')}
          icon={Sparkles}
          label={t('finance.report.savingsNextRenewal')}
          tone='info'
          value={formatCurrency(periodSavings.nextRenewal)}
        />
        <StatTile
          icon={Minus}
          label={t('finance.analysis.unallocated')}
          tone='warning'
          value={formatCurrency(unallocated)}
        />
      </section>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'>
        <Panel>
          <PanelTitle hint={t('finance.report.narrativeHint')} title={t('finance.report.narrativeTitle')} />

          <fieldset className='mt-4' disabled={Boolean(publishedAt)}>
            <legend className='sr-only'>{t('finance.report.narrativeTitle')}</legend>
            <div className='grid gap-2 sm:grid-cols-2'>
              {(['ai', 'manual'] as const).map((value) => {
                const disabled = value === 'ai' && !aiNarrativeAvailable

                return (
                  <label
                    className={`flex items-start gap-2 rounded-xl border p-3 text-xs transition ${
                      mode === value ? 'border-primary bg-primary-soft/40' : 'border-border'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-primary/40'}`}
                    key={value}
                  >
                    <input
                      checked={mode === value}
                      className='mt-0.5 accent-primary'
                      disabled={disabled}
                      name='narrative-mode'
                      onChange={() => setMode(value)}
                      type='radio'
                    />
                    <span>
                      <span className='block font-bold'>{t(`finance.report.mode.${value}`)}</span>
                      <span className='text-muted-foreground'>{t(`finance.report.modeHint.${value}`)}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          {mode === 'ai' && !draftGenerated && !publishedAt && (
            <button
              className={`${secondaryButtonClassName} mt-4`}
              onClick={() => {
                setNarrative(aiDraftNarrative)
                setDraftGenerated(true)
                setReviewed(false)
              }}
              type='button'
            >
              <Sparkles aria-hidden='true' className='size-3.5' />
              {t('finance.report.generateDraft')}
            </button>
          )}

          {(mode === 'manual' || draftGenerated) && (
            <div className='mt-4 space-y-3'>
              {mode === 'ai' && (
                <Notice icon={Sparkles} tone='warning'>
                  {t('finance.report.draftWarning')}
                </Notice>
              )}
              <label className='sr-only' htmlFor='period-narrative'>
                {t('finance.report.narrativeTitle')}
              </label>
              <textarea
                className={`${inputClassName} min-h-40`}
                id='period-narrative'
                onChange={(event) => setNarrative(event.target.value)}
                placeholder={t('finance.report.narrativePlaceholder')}
                readOnly={Boolean(publishedAt)}
                value={narrative}
              />
              {mode === 'ai' && (
                <>
                  <ul className='space-y-1 text-[0.7rem] text-muted-foreground'>
                    {aiDraftSources.map((source) => (
                      <li key={source}>{source}</li>
                    ))}
                  </ul>
                  <label className='flex items-center gap-2 text-xs font-semibold'>
                    <input
                      checked={reviewed}
                      className='accent-primary'
                      disabled={Boolean(publishedAt)}
                      onChange={(event) => setReviewed(event.target.checked)}
                      type='checkbox'
                    />
                    {t('finance.report.reviewedCheck')}
                  </label>
                </>
              )}
            </div>
          )}
        </Panel>

        <Panel className='h-fit'>
          <PanelTitle hint={t('finance.report.visibilityHint')} title={t('finance.report.visibilityTitle')} />
          <div className='mt-4 overflow-x-auto'>
            <table className='w-full text-center text-xs'>
              <thead>
                <tr className='border-b border-border text-muted-foreground'>
                  <th className='py-2 text-left font-semibold'>{t('finance.report.colRole')}</th>
                  <th className='py-2 font-semibold'>{t('finance.report.colSpend')}</th>
                  <th className='py-2 font-semibold'>{t('finance.report.colSavings')}</th>
                  <th className='py-2 font-semibold'>{t('finance.report.colNarrative')}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {visibility.map((row) => (
                  <tr key={row.role}>
                    <td className='py-2.5 text-left font-semibold'>{t(`finance.report.roles.${row.role}`)}</td>
                    <td className='py-2.5'>{cell(row.spend)}</td>
                    <td className='py-2.5'>{cell(row.savings)}</td>
                    <td className='py-2.5'>{cell(row.narrative)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-5 border-t border-border pt-5'>
            {publishedAt ? (
              <Notice icon={Lock} tone='success'>
                <p>{t('finance.report.published', { time: formatDateTime(publishedAt) })}</p>
                <p className='mt-1'>{t('finance.report.immutable')}</p>
              </Notice>
            ) : (
              <>
                <button
                  className={`${primaryButtonClassName} w-full`}
                  disabled={!canPublish}
                  onClick={() => setPublishedAt(new Date().toISOString())}
                  type='button'
                >
                  <Send aria-hidden='true' className='size-3.5' />
                  {t('finance.report.publish')}
                </button>
                {!canPublish && (
                  <p className='mt-2 text-[0.7rem] text-muted-foreground'>{t('finance.report.reviewFirst')}</p>
                )}
              </>
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}
