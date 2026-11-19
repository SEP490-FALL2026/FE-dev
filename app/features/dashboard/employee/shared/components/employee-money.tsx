import { useTranslation } from 'react-i18next'
import { formatDecimalMoney } from '~/shared/lib/format-decimal-money'

export function EmployeeMoney({ value }: { value: { amount: string; currency: string } | null }) {
  const { t: translate, i18n } = useTranslation('employee')
  return (
    <span className='text-right font-mono tabular-nums'>
      {value ? (formatDecimalMoney(value, i18n.language) ?? translate('noValue')) : translate('noValue')}
    </span>
  )
}
