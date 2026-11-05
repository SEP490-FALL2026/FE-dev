import { useTranslation } from 'react-i18next'
import type { FinanceColumn } from '../../shared/components/finance-table'

export interface TaxLine {
  taxType: string
  ratePercent: string
  deductible: boolean
  payer: string
}

/** Shared column set for declared, default and estimated tax lines. */
export function useTaxLineColumns(): FinanceColumn<TaxLine>[] {
  const { t: translate } = useTranslation('financeSettings')
  return [
    { key: 'type', label: translate('taxType'), render: (line) => line.taxType },
    { key: 'rate', label: translate('ratePercent'), numeric: true, render: (line) => line.ratePercent },
    {
      key: 'deductible',
      label: translate('deductible'),
      render: (line) => translate(line.deductible ? 'yes' : 'no')
    },
    {
      key: 'payer',
      label: translate('payer'),
      render: (line) => translate(`enum.${line.payer}`, { defaultValue: translate('unavailable') })
    }
  ]
}

export function taxLineKey(line: TaxLine) {
  return `${line.taxType}-${line.ratePercent}-${line.payer}`
}
