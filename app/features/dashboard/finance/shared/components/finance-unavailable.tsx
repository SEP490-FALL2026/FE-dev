import { CalendarClock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { FinanceTabKey } from '../../enums'
import { FinanceButton, FinancePage } from './finance-ui'

export function FinanceUnavailable({ onSelectTab }: { onSelectTab: (tab: FinanceTabKey) => void }) {
  const { t: translate } = useTranslation('finance')
  return (
    <FinancePage title={translate('unavailable')}>
      <div className='space-y-4 rounded-lg border border-border bg-surface p-6'>
        <CalendarClock aria-hidden className='size-6 text-muted-foreground' strokeWidth={1.5} />
        <p className='max-w-xl text-sm text-muted-foreground [text-wrap:pretty]'>{translate('unavailableHint')}</p>
        <FinanceButton onClick={() => onSelectTab('cost-centers')}>{translate('backToBudgets')}</FinanceButton>
      </div>
    </FinancePage>
  )
}
