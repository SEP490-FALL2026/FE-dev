import { Gauge, Sparkles, Timer } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageHeader, Panel, PanelTitle, StatTile, useDashboardFormat } from '../../dashboard-ui'
import { approverReport } from '../approvals-data'

export function ApproverReportsView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { formatNumber, formatPercent } = useDashboardFormat()
  const report = approverReport
  const usage = report.usage

  const usageIndicators = [
    { key: 'kpi3', value: usage.active / usage.purchased },
    { key: 'coverage', value: usage.evaluated / usage.purchased },
    { key: 'activeInEvaluated', value: usage.active / usage.evaluated }
  ] as const

  return (
    <div className='space-y-6'>
      <PageHeader
        code='UF-15 · FR-5.9 → FR-5.11'
        subtitle={t('approvals.reports.subtitle', { period: report.period })}
        title={t('approvals.reports.title')}
      />

      <Panel>
        <PanelTitle
          hint={t('approvals.reports.spendHint')}
          title={t('approvals.reports.spendTitle', {
            budget: formatCurrency(report.totalBudget),
            spend: formatCurrency(report.totalSpend)
          })}
        />
        <ul className='mt-4 space-y-3'>
          {report.costCenters.map((cc) => {
            const ratio = cc.spend / cc.budget

            return (
              <li key={cc.code}>
                <div className='flex justify-between gap-2 text-xs'>
                  <span className='font-mono font-bold'>{cc.code}</span>
                  <span className='text-muted-foreground'>
                    {formatCurrency(cc.spend)} / {formatCurrency(cc.budget)} · {formatPercent(ratio)}
                  </span>
                </div>
                <div className='mt-1 h-2 overflow-hidden rounded-full bg-surface-subtle'>
                  <div
                    className={`h-full rounded-full ${ratio > 0.9 ? 'bg-warning' : 'bg-primary'}`}
                    style={{ width: `${Math.min(1, ratio) * 100}%` }}
                  />
                </div>
              </li>
            )
          })}
          <li className='flex justify-between gap-2 border-t border-dashed border-warning/50 pt-3 text-xs'>
            <span className='font-bold text-warning'>{t('finance.analysis.unallocated')}</span>
            <span className='font-bold text-warning'>{formatCurrency(report.unallocated)}</span>
          </li>
        </ul>
      </Panel>

      <section aria-label={t('approvals.reports.savingsLabel')} className='grid gap-4 sm:grid-cols-3'>
        <StatTile
          icon={Sparkles}
          label={t('finance.report.savingsImmediate')}
          tone='success'
          value={formatCurrency(report.savings.immediate)}
        />
        <StatTile
          hint={t('finance.report.savingsSeparate')}
          icon={Sparkles}
          label={t('finance.report.savingsNextRenewal')}
          tone='info'
          value={formatCurrency(report.savings.nextRenewal)}
        />
        <StatTile
          hint={t('approvals.reports.reclaimedHint')}
          icon={Gauge}
          label={t('approvals.reports.reclaimedSeats')}
          tone='neutral'
          value={formatNumber(report.savings.reclaimedSeats)}
        />
      </section>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Panel>
          <PanelTitle hint={t('approvals.reports.usageHint')} title={t('approvals.reports.usageTitle')} />
          <div className='mt-4 grid gap-3 sm:grid-cols-3'>
            {usageIndicators.map((indicator) => (
              <div
                className={`rounded-xl border p-3 ${indicator.key === 'kpi3' ? 'border-primary bg-primary-soft/30' : 'border-border'}`}
                key={indicator.key}
              >
                <p className='text-[0.7rem] font-bold text-muted-foreground'>
                  {t(`approvals.reports.usage.${indicator.key}`)}
                </p>
                <p className='mt-1 text-xl font-extrabold'>{formatPercent(indicator.value)}</p>
              </div>
            ))}
          </div>
          <p className='mt-3 text-[0.7rem] text-muted-foreground'>
            {t('approvals.reports.usageNote', {
              active: usage.active,
              evaluated: usage.evaluated,
              purchased: usage.purchased
            })}
          </p>
        </Panel>

        <Panel>
          <PanelTitle hint={t('approvals.reports.processHint')} title={t('approvals.reports.processTitle')} />
          <ul className='mt-4 divide-y divide-border text-xs'>
            {report.stepDays.map((step) => (
              <li className='flex justify-between py-2' key={step.key}>
                <span className='flex items-center gap-1.5 text-muted-foreground'>
                  <Timer aria-hidden='true' className='size-3.5' />
                  {t(`approvals.reports.step.${step.key}`)}
                </span>
                <span className='font-bold'>{t('approvals.reports.days', { value: formatNumber(step.value) })}</span>
              </li>
            ))}
            <li className='flex justify-between py-2'>
              <span className='text-muted-foreground'>{t('approvals.reports.financeResponse')}</span>
              <span className='font-bold'>
                {t('approvals.reports.days', { value: formatNumber(report.financeResponseDays) })}
              </span>
            </li>
            <li className='flex justify-between py-2'>
              <span className='text-muted-foreground'>{t('approvals.reports.financeRecording')}</span>
              <span className='font-bold'>
                {t('approvals.reports.days', { value: formatNumber(report.financeRecordingDays) })}
              </span>
            </li>
            <li className='flex justify-between py-2'>
              <span className='text-muted-foreground'>{t('approvals.reports.myOverdue')}</span>
              <span className='font-bold text-warning'>{formatPercent(report.myOverdueRate)}</span>
            </li>
          </ul>

          <p className='mt-4 text-xs font-bold'>{t('approvals.reports.branchATitle')}</p>
          <ul className='mt-2 space-y-1.5 text-xs'>
            {report.branchASeats.map((row) => (
              <li className='flex justify-between gap-2' key={row.app}>
                <span className='text-muted-foreground'>
                  {row.app} · <span className='font-mono'>{row.costCenter}</span>
                </span>
                <span className='font-bold'>{t('approvals.reports.seats', { count: row.seats })}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
