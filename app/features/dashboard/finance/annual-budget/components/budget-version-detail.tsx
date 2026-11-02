import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetVersionGet } from '~/shared/api/generated/operations/budget-versions/budget-version-get'
import { useBudgetVersionUpdate } from '~/shared/api/generated/operations/budget-versions/budget-version-update'
import { useBudgetVersionRevise } from '~/shared/api/generated/operations/budget-versions/budget-version-revise'
import { useBudgetVersionSend } from '~/shared/api/generated/operations/budget-versions/budget-version-send'
import { useBudgetVersionCreate } from '~/shared/api/generated/operations/budget-versions/budget-version-create'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import {
  FinanceButton,
  FinanceEmpty,
  FinancePage,
  FinanceQueryState,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { formatMoney } from '../../shared/finance-money'
import { budgetQueryKeys } from '../budget-query-keys'
import type { BudgetViewProps } from '../budget-view-props'
import { canEditVersion, versionState } from '../enums/version-state'
import { BudgetVersionForm } from './budget-version-form'
import { BudgetVersionLines } from './budget-version-lines'
import { BudgetVersionHistory } from './budget-version-history'

export function BudgetVersionDetail({ itemId, onSelectTab }: BudgetViewProps & { itemId: string }) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const query = useBudgetVersionGet(itemId)
  const version = query.data?.data?.version
  const [dialog, setDialog] = useState<'edit' | 'revise' | 'send' | 'history' | 'rebuild'>()
  const feedback = useFinanceFeedback(budgetQueryKeys(itemId, version?.proposalId ?? undefined), () =>
    setDialog(undefined)
  )
  const updateMutation = useBudgetVersionUpdate({ mutation: feedback })
  const sendMutation = useBudgetVersionSend({ mutation: feedback })
  const rebuildMutation = useBudgetVersionCreate({
    mutation: {
      onError: feedback.onError,
      onSuccess: async (result) => {
        await feedback.onSuccess()
        if (result.data?.version) onSelectTab?.('budget-negotiation', { id: result.data.version.id })
      }
    }
  })
  const reviseMutation = useBudgetVersionRevise({
    mutation: {
      onError: feedback.onError,
      onSuccess: async (result) => {
        await feedback.onSuccess()
        if (result.data?.version) onSelectTab?.('budget-negotiation', { id: result.data.version.id })
      }
    }
  })
  if (version && (dialog === 'edit' || dialog === 'revise' || dialog === 'rebuild'))
    return (
      <BudgetVersionForm
        initial={{ ...version, reason: version.reason ?? undefined }}
        revision={dialog === 'revise'}
        allowReason={dialog !== 'rebuild'}
        disabled={query.isError || query.isFetching}
        pending={updateMutation.isPending || reviseMutation.isPending || rebuildMutation.isPending}
        onClose={() => setDialog(undefined)}
        onSubmit={(figures) => {
          if (dialog === 'rebuild' && version.proposalId) {
            rebuildMutation.mutate({
              data: {
                proposalId: version.proposalId,
                base: figures.base,
                reserve: figures.reserve,
                highValuePercent: figures.highValuePercent,
                highValueAmount: figures.highValueAmount,
                quarters: figures.quarters
              }
            })
          } else if (dialog === 'revise')
            reviseMutation.mutate({ data: { costCenterId: version.costCenter.id, year: version.year, ...figures } })
          else updateMutation.mutate({ id: itemId, data: figures })
        }}
      />
    )
  return (
    <FinancePage
      title={translate('versions')}
      actions={<FinanceButton onClick={() => onSelectTab?.('budget-negotiation')}>{translate('back')}</FinanceButton>}
    >
      <FinanceQueryState query={query}>
        {version ? (
          <>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div className='min-w-0'>
                <h2 className='truncate text-lg font-semibold' title={version.costCenter.name}>
                  {version.costCenter.name}
                </h2>
                <p className='font-mono tabular-nums'>
                  {translate('fields.year')}: {version.year} · {translate('fields.number')}: {version.number}
                </p>
              </div>
              <FinanceStatus value={version.state} />
            </div>
            <dl className='grid gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-3'>
              {(['base', 'reserve', 'total'] as const).map((field) => (
                <div key={field}>
                  <dt className='text-sm text-muted-foreground'>{translate(`fields.${field}`)}</dt>
                  <dd className='mt-1 font-mono tabular-nums'>{formatMoney(version[field], i18n.language)}</dd>
                </div>
              ))}
            </dl>
            {version.reason && (
              <p className='text-sm'>
                {translate('fields.reason')}: {version.reason}
              </p>
            )}
            {version.decision?.reason && (
              <p className='text-sm'>
                {translate('fields.decision')}: {version.decision.reason}
              </p>
            )}
            <div className='flex flex-wrap gap-2'>
              {canEditVersion(version.state) && (
                <>
                  <FinanceButton variant='primary' onClick={() => setDialog('send')}>
                    {translate('actions.send')}
                  </FinanceButton>
                  <FinanceButton onClick={() => setDialog('edit')}>{translate('actions.edit')}</FinanceButton>
                </>
              )}
              {version.state === versionState.APPROVED && (
                <FinanceButton variant='primary' onClick={() => setDialog('revise')}>
                  {translate('actions.revise')}
                </FinanceButton>
              )}
              {version.state === versionState.REJECTED && version.proposalId && (
                <FinanceButton variant='primary' onClick={() => setDialog('rebuild')}>
                  {translate('actions.rebuild')}
                </FinanceButton>
              )}
              <FinanceButton onClick={() => setDialog('history')}>{translate('actions.showHistory')}</FinanceButton>
              {version.proposalId && (
                <FinanceButton onClick={() => onSelectTab?.('annual-proposals', { id: version.proposalId ?? '' })}>
                  {translate('fields.proposal')}
                </FinanceButton>
              )}
            </div>
          </>
        ) : (
          <FinanceEmpty />
        )}
      </FinanceQueryState>
      {version && <BudgetVersionLines version={version} disabled={query.isError || query.isFetching} />}
      {dialog === 'send' && (
        <FinanceFormDialog
          title={translate('actions.send')}
          pending={sendMutation.isPending}
          submitDisabled={query.isError || query.isFetching || !version || !canEditVersion(version.state)}
          onClose={() => setDialog(undefined)}
          submitLabel={translate('actions.confirmSend')}
          onSubmit={(event) => {
            event.preventDefault()
            sendMutation.mutate({ id: itemId })
          }}
        >
          <p className='text-sm'>{translate('sendHint')}</p>
        </FinanceFormDialog>
      )}
      {dialog === 'history' && <BudgetVersionHistory versionId={itemId} onClose={() => setDialog(undefined)} />}
    </FinancePage>
  )
}
