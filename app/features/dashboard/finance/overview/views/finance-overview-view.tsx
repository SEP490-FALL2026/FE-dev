import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FinanceTabKey } from '../../enums'
import { FinancePage } from '../../shared/components/finance-ui'
import { OverviewAnalyticsSection } from '../components/overview-analytics-section'
import { OverviewPeriodFilter } from '../components/overview-period-filter'
import { OverviewShortcuts, OverviewWorkQueue } from '../components/overview-work-queue'
import type { OverviewPeriod } from '../overview-analytics'

function currentPeriod(): OverviewPeriod {
  const today = new Date()
  const month = today.getMonth() + 1
  return { year: today.getFullYear(), mode: 'year', quarter: Math.ceil(month / 3), month }
}

export function FinanceOverviewView({ onSelectTab }: { onSelectTab: (tab: FinanceTabKey) => void }) {
  const { t: translate } = useTranslation('finance')
  const [period, setPeriod] = useState(currentPeriod)
  return (
    <FinancePage title={translate('overview')} description={translate('overviewDescription')}>
      <OverviewWorkQueue onSelectTab={onSelectTab} />
      <OverviewPeriodFilter period={period} onChange={setPeriod} />
      <OverviewAnalyticsSection period={period} />
      <OverviewShortcuts onSelectTab={onSelectTab} />
    </FinancePage>
  )
}
