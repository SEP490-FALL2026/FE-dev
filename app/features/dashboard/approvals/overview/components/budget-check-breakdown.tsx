import { useTranslation } from 'react-i18next'
import { approvalsStatusTone } from '../../shared/components/approvals-ui'
import type { checkCodeCounts } from '../approvals-insights'
import { StatusDonut } from './status-donut'

type Breakdown = ReturnType<typeof checkCodeCounts>

/** Waiting requests by budget check result; status hues keep their meaning (clear, attention, blocked). */
export function BudgetCheckBreakdown({ breakdown }: { breakdown: Breakdown }) {
  const { t: translate } = useTranslation('approvalsNeed')
  const { t: translateStatus } = useTranslation('approvals')
  const segments = [
    ...breakdown.counts.map((entry) => ({
      key: entry.code,
      label: translateStatus(`status.${entry.code}`, { defaultValue: translateStatus('unknown') }),
      count: entry.count,
      tone: approvalsStatusTone(entry.code)
    })),
    ...(breakdown.unknown
      ? [
          {
            key: 'unknown',
            label: translate('insights.unknownCode'),
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
