import { ArrowLeft, History, Pencil, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetVersionAttachmentList } from '~/shared/api/generated/operations/budgets/budget-version-attachment-list'
import { useBudgetVersionGet } from '~/shared/api/generated/operations/budget-versions/budget-version-get'
import { useBudgetVersionUpdate } from '~/shared/api/generated/operations/budget-versions/budget-version-update'
import { useBudgetVersionSend } from '~/shared/api/generated/operations/budget-versions/budget-version-send'
import { useBudgetVersionCreate } from '~/shared/api/generated/operations/budget-versions/budget-version-create'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import {
  FinanceButton,
  FinanceEmpty,
  FinancePage,
  FinanceQueryState,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { formatMoney } from '../../shared/finance-money'
import { budgetQueryKeys } from '../budget-query-keys'
import type { BudgetViewProps } from '../budget-view-props'
import { attachmentStatus } from '../enums/attachment-rules'
import { canEditVersion, versionState } from '../enums/version-state'
import { BudgetVersionForm } from './budget-version-form'
import { BudgetAttachments, attachmentPageSize } from './budget-attachments'

export function BudgetVersionDetail({ itemId, onSelectTab }: BudgetViewProps & { itemId: string }) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const query = useBudgetVersionGet(itemId)
  const version = query.data?.data?.version
  // Same params as the attachment list below, so both share one cached request.
  const attachmentsQuery = useBudgetVersionAttachmentList(itemId, { page: 1, pageSize: attachmentPageSize })
  const hasExplanationFile =
    attachmentsQuery.data?.data?.items.some((attachment) => attachment.status !== attachmentStatus.REMOVED) ?? false
  const [dialog, setDialog] = useState<'edit' | 'send' | 'rebuild'>()
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
  if (version && (dialog === 'edit' || dialog === 'rebuild'))
    return (
      <BudgetVersionForm
        initial={{
          base: version.base,
          reserve: version.reserve,
          reservePercent: version.reservePercent,
          reserveReason: version.reserveReason ?? undefined
        }}
        currency={version.total.currency}
        disabled={query.isError || query.isFetching}
        askBaseReason={dialog === 'edit'}
        pending={updateMutation.isPending || rebuildMutation.isPending}
        onClose={() => setDialog(undefined)}
        onSubmit={(figures) => {
          if (dialog === 'rebuild' && version.proposalId) {
            rebuildMutation.mutate({
              data: {
                source: 'PROPOSAL',
                proposalId: version.proposalId,
                base: figures.base,
                reserve: figures.reserve,
                reservePercent: figures.reservePercent,
                reserveReason: figures.reserveReason
              }
            })
          } else updateMutation.mutate({ id: itemId, data: figures })
        }}
      />
    )
  return (
    <FinancePage
      title={translate('versions')}
      actions={
        <FinanceButton variant='ghost' onClick={() => onSelectTab?.('budget-negotiation')}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('back')}
        </FinanceButton>
      }
    >
      <FinanceQueryState query={query}>
        {version ? (
          <>
            <div className='min-w-0 space-y-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <h2 className='truncate text-lg font-semibold tracking-tight' title={version.costCenter.name}>
                  {version.costCenter.name}
                </h2>
                <FinanceStatus value={version.state} />
              </div>
              <p className='font-mono text-xs text-muted-foreground tabular-nums'>
                {version.costCenter.code} · {translate('fields.year')} {version.year} · {translate('fields.number')}{' '}
                {version.number} · {translate(`origins.${version.origin}`, { defaultValue: translate('unknown') })}
              </p>
            </div>
            <FinanceStatGrid>
              <FinanceStat label={translate('fields.base')} value={formatMoney(version.base, i18n.language)} />
              <FinanceStat label={translate('fields.reserve')} value={formatMoney(version.reserve, i18n.language)} />
              <FinanceStat
                emphasis
                label={translate('fields.total')}
                value={formatMoney(version.total, i18n.language)}
              />
            </FinanceStatGrid>
            {version.carriedOverNextYear && (
              <FinanceStatGrid>
                <FinanceStat
                  label={translate('fields.carriedOver')}
                  value={formatMoney(version.carriedOverNextYear, i18n.language)}
                />
                {version.reservePercent !== null && (
                  <FinanceStat label={translate('fields.reservePercent')} value={`${version.reservePercent} %`} />
                )}
                {version.belowCarriedOver && (
                  <FinanceStat
                    emphasis
                    label={translate('fields.shortfall')}
                    value={formatMoney(version.carriedOverShortfall, i18n.language)}
                  />
                )}
              </FinanceStatGrid>
            )}
            {version.belowCarriedOver && (
              <p role='status' className='text-sm text-danger'>
                {translate('versionFlags.belowCarriedOver')}
              </p>
            )}
            {version.noProposalSubmitted && (
              <p role='status' className='text-sm text-warning-ink'>
                {translate('versionFlags.noProposalSubmitted')}
              </p>
            )}
            {version.waitingReason === 'NO_SPENDING_APPROVER' && (
              <p role='status' className='text-sm text-warning-ink'>
                {translate('versionNotices.waitingNoApprover')}
              </p>
            )}
            {version.detachedAt && (
              <p role='status' className='text-sm text-warning-ink'>
                {translate('versionNotices.detached')}
              </p>
            )}
            {version.neverCurrent && (
              <p role='status' className='text-sm text-muted-foreground'>
                {translate('versionNotices.neverCurrent')}
              </p>
            )}
            {version.state === versionState.EXPIRED && !version.neverCurrent && (
              <p role='status' className='text-sm text-muted-foreground'>
                {translate('versionNotices.expired')}
              </p>
            )}
            <dl className='grid gap-3 rounded-lg border border-border/70 bg-surface-subtle/50 p-4 text-sm sm:grid-cols-2'>
              {version.defaultReserve && (
                <DetailItem
                  label={translate('detail.defaultReserve')}
                  value={formatMoney(version.defaultReserve, i18n.language)}
                />
              )}
              {version.baseReason && <DetailItem label={translate('detail.baseReason')} value={version.baseReason} />}
              {version.reserveReason && (
                <DetailItem label={translate('detail.reserveReason')} value={version.reserveReason} />
              )}
              {version.createdBy && (
                <DetailItem
                  label={translate('detail.createdBy')}
                  value={`${version.createdBy.fullName} (${version.createdBy.employeeCode})`}
                />
              )}
              <DetailItem
                label={translate('detail.createdAt')}
                value={new Date(version.createdAt).toLocaleString(i18n.language)}
              />
              {version.sentAt && (
                <DetailItem
                  label={translate('detail.sentAt')}
                  value={new Date(version.sentAt).toLocaleString(i18n.language)}
                />
              )}
              {version.expiredAt && (
                <DetailItem
                  label={translate('detail.expiredAt')}
                  value={new Date(version.expiredAt).toLocaleString(i18n.language)}
                />
              )}
            </dl>
            {version.decision && (
              <dl className='grid gap-3 rounded-lg border border-border/70 bg-surface-subtle/50 p-4 text-sm sm:grid-cols-2'>
                <DetailItem
                  label={translate('detail.decisionResult')}
                  value={translate(`states.${version.decision.decision}`, { defaultValue: translate('unknown') })}
                />
                {version.decision.by && (
                  <DetailItem
                    label={translate('detail.decisionBy')}
                    value={`${version.decision.by.fullName} (${version.decision.by.employeeCode})`}
                  />
                )}
                <DetailItem
                  label={translate('detail.decisionAt')}
                  value={new Date(version.decision.at).toLocaleString(i18n.language)}
                />
                {version.decision.reason && (
                  <DetailItem label={translate('fields.decision')} value={version.decision.reason} />
                )}
              </dl>
            )}
            <div className='flex flex-wrap gap-2 border-t border-border/60 pt-4'>
              {canEditVersion(version.state) && !version.detachedAt && (
                <>
                  <FinanceButton
                    variant='primary'
                    disabled={!hasExplanationFile}
                    title={hasExplanationFile ? undefined : translate('attachments.explanationRequired')}
                    onClick={() => setDialog('send')}
                  >
                    <Send aria-hidden className='size-4' strokeWidth={1.5} />
                    {translate('actions.send')}
                  </FinanceButton>
                  <FinanceButton onClick={() => setDialog('edit')}>
                    <Pencil aria-hidden className='size-4' strokeWidth={1.5} />
                    {translate('actions.edit')}
                  </FinanceButton>
                </>
              )}
              {version.state === versionState.REJECTED && version.proposalId && (
                <FinanceButton variant='primary' onClick={() => setDialog('rebuild')}>
                  {translate('actions.rebuild')}
                </FinanceButton>
              )}
              <FinanceButton variant='ghost' onClick={() => onSelectTab?.('version-history', { id: itemId })}>
                <History aria-hidden className='size-4' strokeWidth={1.5} />
                {translate('actions.showHistory')}
              </FinanceButton>
              {version.proposalId && (
                <FinanceButton
                  variant='ghost'
                  onClick={() => onSelectTab?.('annual-proposals', { id: version.proposalId ?? '' })}
                >
                  {translate('fields.proposal')}
                </FinanceButton>
              )}
            </div>
          </>
        ) : (
          <FinanceEmpty />
        )}
      </FinanceQueryState>
      {version && (
        <BudgetAttachments
          target='version'
          ownerId={itemId}
          editable={canEditVersion(version.state) && !version.detachedAt && !query.isError && !query.isFetching}
        />
      )}
      {dialog === 'send' && (
        <FinanceFormDialog
          title={translate('actions.send')}
          pending={sendMutation.isPending}
          submitDisabled={
            query.isError ||
            query.isFetching ||
            !version ||
            !canEditVersion(version.state) ||
            Boolean(version.detachedAt) ||
            !hasExplanationFile
          }
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
    </FinancePage>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className='min-w-0'>
      <dt className='text-xs font-medium text-muted-foreground'>{label}</dt>
      <dd className='mt-1 break-words [text-wrap:pretty]'>{value}</dd>
    </div>
  )
}
