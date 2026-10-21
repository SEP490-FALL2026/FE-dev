import { CheckCircle2, ChevronRight, Clock, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { RemainingValue, getRemaining, useFormatPeriod } from '../../budget-figures'
import { InfoRow, Notice, Panel, PanelTitle, Pill, useDashboardFormat, type Tone } from '../../dashboard-ui'
import { currentPeriod, findBudgetLine } from '../finance-data'
import {
  annualSaving,
  inactiveDays,
  monthlySaving,
  windowSaving,
  type OptimizationKind,
  type OptimizationOpportunity,
  type OptimizationStatus
} from '../optimization-data'

/*
 * Pieces shared by the Finance proposal screens (FIN-35) and the Spending Approver decision screens (APV-04),
 * so both roles read the same evidence and the same saving figures.
 */

export const optimizationKindTones: Record<OptimizationKind, Tone> = {
  CANCEL: 'danger',
  DOWNGRADE: 'info',
  GHOST_SEAT: 'warning'
}

export const optimizationStatusTones: Record<OptimizationStatus, Tone> = {
  APPROVED: 'success',
  DRAFT: 'neutral',
  REJECTED: 'danger',
  SENT: 'primary'
}

export function OptimizationBasis({ item }: { item: OptimizationOpportunity }) {
  const { t } = useTranslation('dashboard')

  if (item.kind === 'GHOST_SEAT') {
    return t('finance.optimization.basis.GHOST_SEAT', {
      count: item.ghostSeats?.length ?? 0,
      purchased: item.seats.purchased
    })
  }
  if (item.kind === 'DOWNGRADE') {
    return t('finance.optimization.basis.DOWNGRADE', {
      current: item.plan?.current ?? '',
      proposed: item.plan?.proposed ?? ''
    })
  }
  return t('finance.optimization.basis.CANCEL', { active: item.seats.active, purchased: item.seats.purchased })
}

export function OptimizationTable({
  formatCurrency,
  items,
  onOpen
}: {
  formatCurrency: (value: number) => string
  items: OptimizationOpportunity[]
  onOpen: (id: string) => void
}) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-184 text-left text-xs'>
        <thead>
          <tr className='border-b border-border text-muted-foreground'>
            <th className='py-2.5 font-semibold'>{t('finance.optimization.colProposal')}</th>
            <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
            <th className='py-2.5 font-semibold'>{t('finance.optimization.colBasis')}</th>
            <th className='py-2.5 text-right font-semibold'>{t('finance.optimization.colMonthly')}</th>
            <th className='py-2.5 text-right font-semibold'>{t('finance.optimization.colWindow')}</th>
            <th className='py-2.5 pl-6 font-semibold'>{t('finance.optimization.colStatus')}</th>
            <th className='py-2.5'>
              <span className='sr-only'>{t('finance.optimization.openDetail')}</span>
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border'>
          {items.map((item) => (
            <tr
              className='cursor-pointer transition hover:bg-surface-subtle/60'
              key={item.id}
              onClick={() => onOpen(item.id)}
            >
              <td className='py-3'>
                <p className='font-mono font-bold text-primary'>{item.code}</p>
                <p className='mt-0.5 font-semibold text-foreground'>{item.app}</p>
              </td>
              <td className='py-3 font-mono'>{item.costCenter}</td>
              <td className='py-3'>
                <Pill tone={optimizationKindTones[item.kind]}>{t(`finance.optimization.kind.${item.kind}`)}</Pill>
                <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                  <OptimizationBasis item={item} />
                </p>
              </td>
              <td className='py-3 text-right font-semibold'>{formatCurrency(monthlySaving(item))}</td>
              <td className='py-3 text-right font-bold text-success'>{formatCurrency(windowSaving(item))}</td>
              <td className='py-3 pl-6'>
                <Pill tone={optimizationStatusTones[item.status]}>
                  {t(`finance.optimization.status.${item.status}`)}
                </Pill>
              </td>
              <td className='py-3 text-right'>
                <button
                  aria-label={t('finance.optimization.openDetailFor', { code: item.code })}
                  className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                  onClick={(event) => {
                    event.stopPropagation()
                    onOpen(item.id)
                  }}
                  type='button'
                >
                  {t('finance.optimization.openDetail')}
                  <ChevronRight aria-hidden='true' className='size-3.5' />
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td className='py-8 text-center text-muted-foreground' colSpan={7}>
                {t('finance.optimization.empty')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function OptimizationEvidencePanel({ item }: { item: OptimizationOpportunity }) {
  const { t } = useTranslation('dashboard')
  const { formatDate, formatNumber, formatPercent } = useDashboardFormat()

  return (
    <Panel>
      <PanelTitle
        hint={t(`finance.optimization.evidenceHint.${item.kind}`)}
        title={t('finance.optimization.evidenceTitle')}
      />
      <div className='mt-4 divide-y divide-border'>
        <InfoRow label={t('finance.optimization.vendor')} value={item.vendor} />
        <InfoRow label={t('finance.optimization.seatsPurchased')} value={formatNumber(item.seats.purchased)} />
        <InfoRow label={t('finance.optimization.seatsActive')} value={formatNumber(item.seats.active)} />
        {item.plan && (
          <>
            <InfoRow label={t('finance.optimization.currentPlan')} value={item.plan.current} />
            <InfoRow label={t('finance.optimization.proposedPlan')} value={item.plan.proposed} />
            <InfoRow label={t('finance.optimization.premiumUsage')} value={formatPercent(item.plan.premiumUsage)} />
          </>
        )}
        {item.overlapWith && <InfoRow label={t('finance.optimization.overlapWith')} value={item.overlapWith} />}
      </div>

      {item.plan && (
        <div className='mt-4'>
          <p className='text-xs font-bold'>{t('finance.optimization.featuresLost')}</p>
          <ul className='mt-2 flex flex-wrap gap-1.5'>
            {item.plan.featuresLost.map((feature) => (
              <li key={feature}>
                <Pill>{feature}</Pill>
              </li>
            ))}
          </ul>
        </div>
      )}

      {item.ghostSeats && (
        <div className='mt-4 overflow-x-auto'>
          <p className='text-xs font-bold'>{t('finance.optimization.ghostTitle', { count: item.ghostSeats.length })}</p>
          <table className='mt-2 w-full text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2 font-semibold'>{t('finance.optimization.colUser')}</th>
                <th className='py-2 font-semibold'>{t('finance.optimization.colSignal')}</th>
                <th className='py-2 text-right font-semibold'>{t('finance.optimization.colLastActivity')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {item.ghostSeats.map((seat) => (
                <tr key={seat.name}>
                  <td className='py-2 font-semibold'>{seat.name}</td>
                  <td className='py-2 text-muted-foreground'>
                    {t(`finance.optimization.signal.${seat.signal}`, { days: inactiveDays(seat) ?? 0 })}
                  </td>
                  <td className='py-2 text-right'>{seat.lastActivity ? formatDate(seat.lastActivity) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className='mt-4 text-[0.7rem] text-muted-foreground'>{t('finance.optimization.usageNote')}</p>
    </Panel>
  )
}

export function OptimizationSavingsPanel({
  formatCurrency,
  item
}: {
  formatCurrency: (value: number) => string
  item: OptimizationOpportunity
}) {
  const { t } = useTranslation('dashboard')
  const formatPeriod = useFormatPeriod()
  const { formatDate, formatMonthYear } = useDashboardFormat()
  const line = findBudgetLine(item.costCenter)
  const remaining = line ? getRemaining(line) : null

  return (
    <Panel>
      <PanelTitle hint={t('finance.optimization.savingsHint')} title={t('finance.optimization.savingsTitle')} />
      <div className='mt-4 divide-y divide-border'>
        <InfoRow label={t('finance.optimization.currentMonthly')} value={formatCurrency(item.currentMonthly)} />
        <InfoRow label={t('finance.optimization.proposedMonthly')} value={formatCurrency(item.proposedMonthly)} />
        <InfoRow label={t('finance.optimization.monthlySaving')} value={formatCurrency(monthlySaving(item))} />
        <InfoRow
          label={t('finance.optimization.windowSaving', { period: formatPeriod(currentPeriod) })}
          value={<span className='text-success'>{formatCurrency(windowSaving(item))}</span>}
        />
        <InfoRow label={t('finance.optimization.annualSaving')} value={formatCurrency(annualSaving(item))} />
        <InfoRow
          label={t('finance.optimization.timingLabel')}
          value={
            item.timing === 'NEXT_RENEWAL' && item.renewalDate
              ? t('finance.optimization.timing.NEXT_RENEWAL', { date: formatDate(item.renewalDate) })
              : t('finance.optimization.timing.IMMEDIATE', { month: formatMonthYear(`${item.effectiveMonth}-01`) })
          }
        />
      </div>

      <div className='mt-4 rounded-xl border border-border bg-background p-3'>
        <p className='text-xs font-bold'>
          {t('finance.optimization.budgetImpact', { costCenter: item.costCenter, period: formatPeriod(currentPeriod) })}
        </p>
        {remaining === null ? (
          <p className='mt-2'>
            <Pill tone='warning'>{t('budget.noBudget')}</Pill>
          </p>
        ) : (
          <div className='mt-1 divide-y divide-border'>
            <InfoRow
              label={t('finance.optimization.remainingBefore')}
              value={<RemainingValue formatCurrency={formatCurrency} remaining={remaining} />}
            />
            <InfoRow
              label={t('finance.optimization.remainingAfter')}
              value={<RemainingValue formatCurrency={formatCurrency} remaining={remaining + windowSaving(item)} />}
            />
          </div>
        )}
      </div>
    </Panel>
  )
}

/** The outcome so far, worded the same for both roles. */
export function OptimizationStatusNotice({ item }: { item: OptimizationOpportunity }) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()

  if (item.status === 'SENT' && item.sentAt) {
    return (
      <Notice icon={Clock} tone='primary'>
        {t('finance.optimization.sent', { time: formatDate(item.sentAt) })}
      </Notice>
    )
  }
  if (item.status === 'APPROVED' && item.decision) {
    return (
      <Notice icon={CheckCircle2} tone='success'>
        {t('finance.optimization.approved', { name: item.decision.by, time: formatDate(item.decision.at) })}
      </Notice>
    )
  }
  if (item.status === 'REJECTED' && item.decision) {
    return (
      <Notice icon={XCircle} tone='danger'>
        {t('finance.optimization.rejected', {
          name: item.decision.by,
          reason: item.decision.reason ?? '',
          time: formatDate(item.decision.at)
        })}
      </Notice>
    )
  }
  return null
}
