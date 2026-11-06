import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { VersionResponseDtoDataVersion } from '~/shared/api/generated/model/budget-versions/versionResponseDtoDataVersion'
import type { VersionLinePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-versions/versionLinePageResponseDtoDataItemsItem'
import { useBudgetVersionLineList } from '~/shared/api/generated/operations/budget-versions/budget-version-line-list'
import { useBudgetVersionLineAdd } from '~/shared/api/generated/operations/budget-versions/budget-version-line-add'
import { useBudgetVersionLineUpdate } from '~/shared/api/generated/operations/budget-versions/budget-version-line-update'
import {
  FinanceButton,
  FinanceDrawer,
  FinancePagination,
  FinanceQueryState,
  FinanceSection
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { formatMoney } from '../../shared/finance-money'
import { budgetQueryKeys } from '../budget-query-keys'
import { canEditVersion } from '../enums/version-state'
import { BudgetLineForm } from './budget-line-form'
import { BudgetLineImport } from './budget-line-import'

const lineFacts = ['amount', 'planId', 'seats', 'financeComment', 'adjustmentReason'] as const

export function BudgetVersionLines({
  version,
  disabled = false
}: {
  version: VersionResponseDtoDataVersion
  disabled?: boolean
}) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<VersionLinePageResponseDtoDataItemsItem>()
  const [dialog, setDialog] = useState<'add' | 'edit' | 'import'>()
  const query = useBudgetVersionLineList(version.id, { page, pageSize: 20 })
  const result = query.data?.data
  const feedback = useFinanceFeedback(budgetQueryKeys(version.id), () => {
    setDialog(undefined)
    setSelected(undefined)
  })
  const addMutation = useBudgetVersionLineAdd({ mutation: feedback })
  const updateMutation = useBudgetVersionLineUpdate({ mutation: feedback })
  const editable = canEditVersion(version.state)
  const writeDisabled = disabled || query.isError || query.isFetching
  if (dialog === 'add' || (dialog === 'edit' && selected))
    return (
      <div className='space-y-4'>
        {/* A failed refresh keeps the draft and offers a retry instead of forcing a cancel. */}
        {query.isError && (
          <FinanceQueryState query={query}>
            <span />
          </FinanceQueryState>
        )}
        <BudgetLineForm
          line={dialog === 'edit' ? selected : undefined}
          currency={version.total.currency}
          pending={addMutation.isPending || updateMutation.isPending}
          disabled={disabled || !editable || (dialog === 'edit' && writeDisabled)}
          onClose={() => {
            setDialog(undefined)
            setSelected(undefined)
          }}
          onSubmit={(line) => {
            if (dialog === 'add') {
              addMutation.mutate({
                id: version.id,
                data: {
                  lines: [
                    {
                      description: line.description,
                      amount: line.amount,
                      ...(line.planId ? { planId: line.planId } : {}),
                      ...(line.seats ? { seats: line.seats } : {}),
                      ...(line.note ? { note: line.note } : {})
                    }
                  ]
                }
              })
            } else if (selected) {
              updateMutation.mutate({
                id: version.id,
                position: selected.position,
                data: {
                  description: line.description,
                  amount: line.amount,
                  planId: line.planId ?? null,
                  seats: line.seats ?? null,
                  financeComment: line.financeComment ?? null,
                  adjustmentReason: line.adjustmentReason ?? null
                }
              })
            }
          }}
        />
      </div>
    )
  return (
    <FinanceSection
      title={translate('lines')}
      actions={
        editable && (
          <>
            <FinanceButton disabled={disabled} onClick={() => setDialog('add')}>
              {translate('actions.addLine')}
            </FinanceButton>
            <FinanceButton disabled={disabled} onClick={() => setDialog('import')}>
              {translate('actions.import')}
            </FinanceButton>
          </>
        )
      }
    >
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(line) => String(line.position)}
          onOpen={setSelected}
          columns={[
            { key: 'position', label: translate('fields.position'), numeric: true, render: (line) => line.position },
            {
              key: 'description',
              label: translate('fields.description'),
              render: (line) => <span title={line.description}>{line.description}</span>
            },
            {
              key: 'seats',
              label: translate('fields.seats'),
              numeric: true,
              render: (line) => line.seats ?? translate('none')
            },
            {
              key: 'amount',
              label: translate('fields.amount'),
              numeric: true,
              render: (line) => formatMoney(line.amount, i18n.language)
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
      {selected && !dialog && (
        <FinanceDrawer title={selected.description} onClose={() => setSelected(undefined)}>
          <dl className='grid gap-3'>
            {lineFacts.map((field) => (
              <div key={field} className='grid gap-1 border-b border-border/40 pb-2 sm:grid-cols-2'>
                <dt className='text-sm text-muted-foreground'>{translate(`fields.${field}`)}</dt>
                <dd className='text-sm break-words'>
                  {field === 'amount'
                    ? formatMoney(selected.amount, i18n.language)
                    : (selected[field] ?? translate('none'))}
                </dd>
              </div>
            ))}
          </dl>
          {editable && (
            <div className='mt-4 flex justify-end'>
              <FinanceButton disabled={writeDisabled} variant='primary' onClick={() => setDialog('edit')}>
                {translate('actions.editLine')}
              </FinanceButton>
            </div>
          )}
        </FinanceDrawer>
      )}
      {dialog === 'import' && (
        <BudgetLineImport
          versionId={version.id}
          disabled={disabled || !editable}
          onClose={() => setDialog(undefined)}
        />
      )}
    </FinanceSection>
  )
}
