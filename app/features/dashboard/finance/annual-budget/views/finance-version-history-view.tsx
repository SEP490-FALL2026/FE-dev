import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FinanceButton, FinanceEmpty, FinancePage } from '../../shared/components/finance-ui'
import type { BudgetViewProps } from '../budget-view-props'
import { BudgetVersionHistory } from '../components/budget-version-history'

/** The change history of one budget version, on its own screen; back returns to the version. */
export function FinanceVersionHistoryView({ itemId, onSelectTab }: BudgetViewProps) {
  const { t: translate } = useTranslation('financeBudget')
  return (
    <FinancePage
      title={translate('history')}
      actions={
        <FinanceButton
          variant='ghost'
          onClick={() => onSelectTab?.('budget-negotiation', itemId ? { id: itemId } : undefined)}
        >
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('backToVersion')}
        </FinanceButton>
      }
    >
      {itemId ? <BudgetVersionHistory versionId={itemId} /> : <FinanceEmpty />}
    </FinancePage>
  )
}
