import { useTranslation } from 'react-i18next'
import type { FinanceTabKey } from '../../enums'
import { FinanceEmpty, FinanceQueryState, FinanceSection, FinanceStatus } from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { useCostCenterVersions } from '../hooks/use-cost-center-budgets'

/** Budget versions of one cost center across years; a row opens the version in the budget workspace. */
export function CostCenterBudgetVersions({
  costCenterId,
  onSelectTab
}: {
  costCenterId: string
  onSelectTab?: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const versions = useCostCenterVersions(costCenterId)
  const items = versions.data?.items ?? []
  return (
    <FinanceSection title={translate('budgetVersions')}>
      <FinanceQueryState query={versions}>
        {items.length ? (
          <FinanceTable
            items={items}
            rowKey={(version) => version.id}
            onOpen={onSelectTab ? (version) => onSelectTab('budget-negotiation', { id: version.id }) : undefined}
            columns={[
              { key: 'year', label: translate('budgetYear'), numeric: true, render: (version) => version.year },
              {
                key: 'number',
                label: translate('versionNumber'),
                numeric: true,
                render: (version) => version.number
              },
              {
                key: 'state',
                label: translate('status'),
                render: (version) => <FinanceStatus value={version.state} />
              },
              {
                key: 'total',
                label: translate('budgetTotal'),
                numeric: true,
                render: (version) => formatMoney(version.total, i18n.language)
              }
            ]}
          />
        ) : (
          <FinanceEmpty message={translate('noBudgetVersions')} />
        )}
        {versions.data?.truncated && <p className='text-xs text-muted-foreground'>{translate('listTruncated')}</p>}
      </FinanceQueryState>
    </FinanceSection>
  )
}
