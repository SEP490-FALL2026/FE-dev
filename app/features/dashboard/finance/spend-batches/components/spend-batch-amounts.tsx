import { useTranslation } from 'react-i18next'
import { formatMoney } from '../../shared/finance-money'

/** `approvedAmounts` maps a currency code to a decimal string in that currency's major unit (`{ USD: '123.45' }`). */
export function SpendBatchAmounts({ amounts }: { amounts: Record<string, string> }) {
  const { t: translate, i18n } = useTranslation('financeSpend')
  const entries = Object.entries(amounts).sort(([left], [right]) => left.localeCompare(right))
  if (!entries.length) return <span className='text-muted-foreground'>{translate('noValue')}</span>
  return (
    <span className='flex flex-col items-end gap-0.5'>
      {entries.map(([currency, amount]) => (
        <span key={currency} className='whitespace-nowrap'>
          {formatMoney({ amount, currency }, i18n.language)}
        </span>
      ))}
    </span>
  )
}
