import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import type { AdjustmentListResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-adjustments/adjustmentListResponseDtoDataItemsItem'
import { getBudgetAdjustmentListQueryKey } from '~/shared/api/generated/operations/budget-adjustments/budget-adjustment-list'
import { useBudgetAdjustmentDecide } from '~/shared/api/generated/operations/budget-adjustments/budget-adjustment-decide'
import { getBudgetTableQueryKey } from '~/shared/api/generated/operations/budgets/budget-table'
import { ApprovalsField, ApprovalsSelect, approvalsInputClass } from '../../shared/components/approvals-ui'
import { useApprovalsFeedback } from '../../shared/hooks/use-approvals-feedback'
import { formatMoney } from '../../shared/approvals-money'
import { useDashboardFormat } from '../../../dashboard-ui'
import { adjustmentDecision, type AdjustmentDecision } from '../enums/in-year'

type Center = AdjustmentListResponseDtoDataItemsItem['from']

/** One decision per adjustment; BE re-checks the conditions on today's figures and refuses with a coded error. */
export function AdjustmentDecisionDialog({
  adjustment,
  onClose
}: {
  adjustment: AdjustmentListResponseDtoDataItemsItem
  onClose: () => void
}) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const queryClient = useQueryClient()
  const { formatDateTime } = useDashboardFormat()
  const submissionLocked = useRef(false)
  // An adjustment of a year that has ended can only be cleared from the queue: BE answers 422 BUDGET.YEAR_ENDED to an approval.
  const yearEnded = adjustment.year < new Date().getFullYear()
  const [decision, setDecision] = useState<AdjustmentDecision>(
    yearEnded ? adjustmentDecision.REJECT : adjustmentDecision.APPROVE
  )
  const [reason, setReason] = useState('')
  const feedback = useApprovalsFeedback([getBudgetAdjustmentListQueryKey(), getBudgetTableQueryKey()], onClose)
  const mutation = useBudgetAdjustmentDecide({
    mutation: {
      onSettled: () => {
        submissionLocked.current = false
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          predicate: ({ queryKey }) =>
            queryKey.some((part) => typeof part === 'string' && /\/(budget-versions|budget-cycles)(\/|$)/.test(part))
        })
        await feedback.onSuccess()
      },
      onError: feedback.onError
    }
  })
  const rejecting = decision === adjustmentDecision.REJECT
  const blocked = rejecting && !reason.trim()
  const centerName = (center: Center) => (center ? `${center.code} · ${center.name}` : translate('inYear.none'))
  return (
    <AdminFormDialog
      title={translate('inYear.decisionTitle')}
      pending={mutation.isPending}
      submitLabel={translate('confirmDecision')}
      submitDisabled={blocked}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        if (submissionLocked.current || mutation.isPending || blocked) return
        submissionLocked.current = true
        mutation.mutate({
          id: adjustment.id,
          data: { decision, ...(reason.trim() ? { reason: reason.trim() } : {}) }
        })
      }}
    >
      <dl className='grid gap-2 text-sm sm:grid-cols-2'>
        <div>
          <dt className='text-muted-foreground'>{translate('inYear.kind')}</dt>
          <dd className='font-medium'>{translate(`inYear.kinds.${adjustment.kind}`)}</dd>
        </div>
        <div>
          <dt className='text-muted-foreground'>{translate('inYear.amount')}</dt>
          <dd className='font-mono font-medium tabular-nums'>{formatMoney(adjustment.amount, i18n.language)}</dd>
        </div>
        <div>
          <dt className='text-muted-foreground'>{translate('inYear.from')}</dt>
          <dd>{centerName(adjustment.from)}</dd>
        </div>
        <div>
          <dt className='text-muted-foreground'>{translate('inYear.to')}</dt>
          <dd>{centerName(adjustment.to)}</dd>
        </div>
        <div>
          <dt className='text-muted-foreground'>{translate('year')}</dt>
          <dd className='font-mono font-medium tabular-nums'>{adjustment.year}</dd>
        </div>
        <div>
          <dt className='text-muted-foreground'>{translate('inYear.createdBy')}</dt>
          <dd>
            {adjustment.createdBy?.fullName ?? translate('inYear.none')} · {formatDateTime(adjustment.createdAt)}
          </dd>
        </div>
        {adjustment.transferReason && (
          <div className='sm:col-span-2'>
            <dt className='text-muted-foreground'>{translate('inYear.transferReason')}</dt>
            <dd>{translate(`inYear.transferReasons.${adjustment.transferReason}`)}</dd>
          </div>
        )}
        <div className='sm:col-span-2'>
          <dt className='text-muted-foreground'>{translate('inYear.createdReason')}</dt>
          <dd className='break-words'>{adjustment.reason}</dd>
        </div>
      </dl>
      <p role='note' className='text-sm text-muted-foreground'>
        {translate(yearEnded ? 'inYear.yearEndedNote' : 'inYear.recheckNote')}
      </p>
      <ApprovalsSelect
        label={translate('decision')}
        value={decision}
        disabled={mutation.isPending}
        options={[
          ...(yearEnded ? [] : [{ value: adjustmentDecision.APPROVE, label: translate('approve') }]),
          { value: adjustmentDecision.REJECT, label: translate('reject') }
        ]}
        onChange={(selected) => {
          const next = Object.values(adjustmentDecision).find((value) => value === selected)
          if (next) setDecision(next)
        }}
      />
      <ApprovalsField
        label={translate('inYear.decisionReason')}
        hint={rejecting ? translate('inYear.reasonRequired') : translate('inYear.optional')}
        required={rejecting}
      >
        <textarea
          rows={3}
          maxLength={1000}
          className={approvalsInputClass}
          value={reason}
          disabled={mutation.isPending}
          onChange={(event) => setReason(event.target.value)}
        />
      </ApprovalsField>
    </AdminFormDialog>
  )
}
