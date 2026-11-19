import { useTranslation } from 'react-i18next'
import { approvalsStatusTone } from '../../shared/components/approvals-ui'
import type { outcomeCounts } from '../approvals-insights'
import { StatusDonut } from './status-donut'

type Breakdown = ReturnType<typeof outcomeCounts>

/** Waiting requests by the outcome of the budget check; status hues keep their meaning (clear, attention, blocked). */
export function BudgetCheckBreakdown({ breakdown }: { breakdown: Breakdown }) {
  const { t: translate } = useTranslation('approvalsNeed')
  const { t: translateStatus } = useTranslation('approvals')
  const segments = [
    ...breakdown.counts.map((entry) => ({
      key: entry.outcome,
      label: translateStatus(`status.${entry.outcome}`, { defaultValue: translateStatus('unknown') }),
      count: entry.count,
      tone: approvalsStatusTone(entry.outcome)
    })),
    ...(breakdown.unknown
      ? [
          {
            key: 'unknown',
            label: translate('insights.noOutcome'),
            count: breakdown.unknown,
            tone: 'neutral' as const
          }
        ]
      : [])
  ]
  return (
    <StatusDonut
      segments={segments}
      label={translate('insights.checks')}
      totalLabel={translate('insights.totalRequests')}
    />
  )
}
