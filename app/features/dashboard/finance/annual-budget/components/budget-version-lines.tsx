import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useTranslation } from 'react-i18next'
import type { VersionResponseDtoDataVersion } from '~/shared/api/generated/model/budget-versions/versionResponseDtoDataVersion'
import type { VersionLinePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-versions/versionLinePageResponseDtoDataItemsItem'
import { useBudgetVersionLineList } from '~/shared/api/generated/operations/budget-versions/budget-version-line-list'
import { useBudgetVersionLineAdd } from '~/shared/api/generated/operations/budget-versions/budget-version-line-add'
import { useBudgetVersionLineUpdate } from '~/shared/api/generated/operations/budget-versions/budget-version-line-update'
import { useBudgetVersionLineWindow } from '~/shared/api/generated/operations/budget-versions/budget-version-line-window'
import { FinanceButton, FinanceDrawer, FinancePagination, FinanceQueryState } from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { formatMoney } from '../../shared/finance-money'
import { budgetQueryKeys, invalidateRequestBudgetChecks } from '../budget-query-keys'
import { getFinanceError } from '../../shared/finance-errors'
import { canEditVersion, versionState } from '../enums/version-state'
import { BudgetLineForm } from './budget-line-form'
import { BudgetLineWindowForm } from './budget-line-window-form'
import { BudgetLineImport } from './budget-line-import'
import { BudgetLineHistory } from './budget-line-history'

export function BudgetVersionLines({
  version,
  disabled = false
}: {
  version: VersionResponseDtoDataVersion
  disabled?: boolean
}) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const queryClient = useQueryClient()
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<VersionLinePageResponseDtoDataItemsItem>()
  const [dialog, setDialog] = useState<'add' | 'edit' | 'import' | 'window' | 'history'>()
  const query = useBudgetVersionLineList(version.id, { page, pageSize: 20 })
  const result = query.data?.data
  const feedback = useFinanceFeedback(budgetQueryKeys(version.id, undefined, selected?.position), () => {
    setDialog(undefined)
    setSelected(undefined)
  })
  const addMutation = useBudgetVersionLineAdd({ mutation: feedback })
  const updateMutation = useBudgetVersionLineUpdate({ mutation: feedback })
  const windowMutation = useBudgetVersionLineWindow({
    mutation: {
      onSuccess: async () => {
        await invalidateRequestBudgetChecks(queryClient)
        await feedback.onSuccess()
      },
      onError: async (error) => {
        if (getFinanceError(error).key !== 'rateLimit') await invalidateRequestBudgetChecks(queryClient)
        await feedback.onError(error)
      }
    }
  })
  const editable = canEditVersion(version.state)
  const writeDisabled = disabled || query.isError || query.isFetching
  if (dialog === 'add' || (dialog === 'edit' && selected))
    return (
      <div className='space-y-4'>
        <FinanceQueryState query={query}>
          <span />
        </FinanceQueryState>
        <BudgetLineForm
          line={dialog === 'edit' ? selected : undefined}
          currency={version.total.currency}
          pending={addMutation.isPending || updateMutation.isPending}
          disabled={disabled || !editable || (dialog === 'edit' && (query.isError || query.isFetching))}
          onClose={() => {
            setDialog(undefined)
            setSelected(undefined)
          }}
          onSubmit={(line) => {
            if (disabled || !editable || (dialog === 'edit' && (query.isError || query.isFetching))) return
            if (dialog === 'add') {
              addMutation.mutate({ id: version.id, data: { lines: [line] } })
            } else if (selected) {
              updateMutation.mutate({
                id: version.id,
                position: selected.position,
                data: {
                  description: line.description,
                  amount: line.amount,
                  windowFrom: line.windowFrom,
                  windowTo: line.windowTo,
                  servicePeriodMonths: line.servicePeriodMonths,
                  repeatCycle: line.repeatCycle,
                  planId: line.planId ?? null,
                  seats: line.seats ?? null,
                  quoteValidUntil: line.quoteValidUntil ?? null,
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
    <section className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h3 className='font-semibold'>{translate('lines')}</h3>
        {editable && (
          <div className='flex gap-2'>
            <FinanceButton disabled={disabled} onClick={() => setDialog('add')}>
              {translate('actions.addLine')}
            </FinanceButton>
            <FinanceButton disabled={disabled} onClick={() => setDialog('import')}>
              {translate('actions.import')}
            </FinanceButton>
          </div>
        )}
      </div>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(line) => String(line.position)}
          onOpen={setSelected}
          columns={[
            { key: 'position', label: translate('fields.position'), numeric: true, render: (line) => line.position },
            { key: 'description', label: translate('fields.description'), render: (line) => line.description },
            {
              key: 'amount',
              label: translate('fields.amount'),
              numeric: true,
              render: (line) => formatMoney(line.amount, i18n.language)
            },
            {
              key: 'seats',
              label: translate('fields.seats'),
              numeric: true,
              render: (line) => line.seats ?? translate('none')
            },
            {
              key: 'windowFrom',
              label: translate('fields.windowFrom'),
              numeric: true,
              render: (line) => formatDate(line.windowFrom)
            },
            {
              key: 'windowTo',
              label: translate('fields.windowTo'),
              numeric: true,
              render: (line) => formatDate(line.windowTo)
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
      {selected && !dialog && (
        <FinanceDrawer title={selected.description} onClose={() => setSelected(undefined)}>
          <dl className='grid gap-3'>
            {(
              [
                'amount',
                'planId',
                'seats',
                'servicePeriodMonths',
                'repeatCycle',
                'quoteValidUntil',
                'financeComment',
                'adjustmentReason'
              ] as const
            ).map((field) => (
              <div key={field} className='grid gap-1 border-b border-border/40 pb-2 sm:grid-cols-2'>
                <dt className='text-sm text-muted-foreground'>{translate(`fields.${field}`)}</dt>
                <dd className='break-words text-sm'>
                  {field === 'amount'
                    ? formatMoney(selected.amount, i18n.language)
                    : field === 'repeatCycle'
                      ? translate(`cycles.${selected.repeatCycle}`, { defaultValue: translate('unknown') })
                      : (selected[field] ?? translate('none'))}
                </dd>
              </div>
            ))}
          </dl>
          <div className='mt-4 flex flex-wrap gap-2'>
            {editable && (
              <FinanceButton disabled={writeDisabled} variant='primary' onClick={() => setDialog('edit')}>
                {translate('actions.editLine')}
              </FinanceButton>
            )}
            {version.state === versionState.APPROVED && (
              <FinanceButton disabled={writeDisabled} variant='primary' onClick={() => setDialog('window')}>
                {translate('actions.moveWindow')}
              </FinanceButton>
            )}
            <FinanceButton onClick={() => setDialog('history')}>{translate('lineHistory')}</FinanceButton>
          </div>
        </FinanceDrawer>
      )}
      {dialog === 'import' && (
        <BudgetLineImport
          versionId={version.id}
          disabled={disabled || !editable}
          onClose={() => setDialog(undefined)}
        />
      )}
      {dialog === 'window' && selected && (
        <BudgetLineWindowForm
          line={selected}
          pending={windowMutation.isPending}
          disabled={writeDisabled || version.state !== versionState.APPROVED}
          onClose={() => setDialog(undefined)}
          onSubmit={(window) => windowMutation.mutate({ id: version.id, position: selected.position, data: window })}
        />
      )}
      {dialog === 'history' && selected && (
        <BudgetLineHistory versionId={version.id} position={selected.position} onClose={() => setDialog(undefined)} />
      )}
    </section>
  )
}
