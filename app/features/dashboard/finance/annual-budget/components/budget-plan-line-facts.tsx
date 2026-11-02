import { useTranslation } from 'react-i18next'
import type { ProposalLinePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-proposals/proposalLinePageResponseDtoDataItemsItem'
import { FinanceDrawer } from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'

export function BudgetPlanLineFacts({
  line,
  onClose
}: {
  line: ProposalLinePageResponseDtoDataItemsItem
  onClose: () => void
}) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const facts = [
    ['amount', formatMoney(line.amount, i18n.language)],
    ['planId', line.planId],
    ['seats', line.seats],
    ['windowFrom', line.windowFrom],
    ['windowTo', line.windowTo],
    ['servicePeriodMonths', line.servicePeriodMonths],
    ['repeatCycle', translate(`cycles.${line.repeatCycle}`, { defaultValue: translate('unknown') })],
    ['quoteValidUntil', line.quoteValidUntil],
    ['note', line.note]
  ] as const
  return (
    <FinanceDrawer title={line.description} onClose={onClose}>
      <dl className='grid gap-3'>
        {facts.map(([key, value]) => (
          <div key={key} className='grid gap-1 border-b border-border/40 py-2 sm:grid-cols-2'>
            <dt className='text-sm text-muted-foreground'>{translate(`fields.${key}`)}</dt>
            <dd className='break-words text-sm'>{value ?? translate('none')}</dd>
          </div>
        ))}
      </dl>
    </FinanceDrawer>
  )
}
