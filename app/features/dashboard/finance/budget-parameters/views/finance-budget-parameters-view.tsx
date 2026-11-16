import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOperatingParameterList } from '~/shared/api/generated/operations/operating-parameters'
import { FinanceButton, FinancePage, FinanceQueryState } from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { pickBudgetParameters, type BudgetParameter } from '../budget-parameters'
import { ParameterEditDialog } from '../components/parameter-edit-dialog'

export function FinanceBudgetParametersView() {
  const { t: translate } = useTranslation('financeReview')
  const [editing, setEditing] = useState<string | null>(null)
  const query = useOperatingParameterList()
  const parameters = pickBudgetParameters(query.data?.data?.items)
  const selected = parameters.find((parameter) => parameter.key === editing)

  return (
    <FinancePage title={translate('parameters.title')} description={translate('parameters.description')}>
      <FinanceQueryState query={query}>
        {parameters.length === 0 ? (
          <p className='text-sm text-muted-foreground'>{translate('parameters.empty')}</p>
        ) : (
          <FinanceTable<BudgetParameter>
            items={parameters}
            rowKey={(parameter) => parameter.key}
            columns={[
              {
                key: 'label',
                label: translate('parameters.title'),
                render: (parameter) => (
                  <div>
                    <div className='font-medium'>{parameter.label}</div>
                    <div className='text-xs text-muted-foreground'>{parameter.description}</div>
                    <div className='font-mono text-[11px] text-muted-foreground'>{parameter.key}</div>
                  </div>
                )
              },
              {
                key: 'value',
                label: translate('parameters.value'),
                numeric: true,
                render: (parameter) => `${String(parameter.value)} ${parameter.unitLabel}`
              },
              {
                key: 'default',
                label: translate('parameters.default'),
                numeric: true,
                render: (parameter) => `${String(parameter.default)} ${parameter.unitLabel}`
              },
              {
                key: 'changedAt',
                label: translate('parameters.changedAt'),
                numeric: true,
                align: 'center',
                render: (parameter) => parameter.changedAt?.slice(0, 10) ?? translate('parameters.isDefault')
              },
              {
                key: 'actions',
                label: '',
                actions: true,
                render: (parameter) => (
                  <FinanceButton onClick={() => setEditing(parameter.key)}>
                    {translate('parameters.edit')}
                  </FinanceButton>
                )
              }
            ]}
          />
        )}
      </FinanceQueryState>
      {selected && <ParameterEditDialog parameter={selected} onClose={() => setEditing(null)} />}
    </FinancePage>
  )
}
