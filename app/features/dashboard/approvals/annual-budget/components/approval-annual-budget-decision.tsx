import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { getBudgetVersionGetQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-get'
import { getBudgetVersionListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import { getBudgetVersionHistoryListQueryKey } from '~/shared/api/generated/operations/budget-versions/budget-version-history-list'
import { getBudgetTableQueryKey } from '~/shared/api/generated/operations/budgets/budget-table'
import { getBudgetProposalListQueryKey } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { useBudgetVersionDecide } from '~/shared/api/generated/operations/budget-versions/budget-version-decide'
import { ApprovalsField, ApprovalsSelect, approvalsInputClass } from '../../shared/components/approvals-ui'
import { useApprovalsFeedback } from '../../shared/hooks/use-approvals-feedback'
import { getApprovalsError } from '../../shared/approvals-errors'
import { versionDecision, type VersionDecision } from '../enums/version-decision'

export function ApprovalAnnualBudgetDecision({
  itemId,
  disabled,
  onClose
}: {
  itemId: string
  disabled: boolean
  onClose: () => void
}) {
  const { t: translate } = useTranslation('approvalsBudget')
  const queryClient = useQueryClient()
  const submissionLocked = useRef(false)
  const [decision, setDecision] = useState<VersionDecision>(versionDecision.APPROVE)
  const [reason, setReason] = useState('')
  const [permissionBlocked, setPermissionBlocked] = useState(false)
  const feedback = useApprovalsFeedback(
    [
      getBudgetVersionGetQueryKey(itemId),
      getBudgetVersionListQueryKey(),
      getBudgetVersionHistoryListQueryKey(itemId),
      getBudgetTableQueryKey(),
      getBudgetProposalListQueryKey()
    ],
    onClose
  )
  const invalidateSpend = () =>
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) =>
        queryKey.some(
          (part) =>
            typeof part === 'string' &&
            /\/(budget-check|spend-approvals|spend-batches|budget-commitments|notifications)(\/|$)/.test(
              part
            )
        )
    })
  const mutation = useBudgetVersionDecide({
    mutation: {
      onSettled: () => {
        submissionLocked.current = false
      },
      onSuccess: async () => {
        await invalidateSpend()
        await feedback.onSuccess()
      },
      onError: async (error) => {
        if (['ownVersion', 'forbidden'].includes(getApprovalsError(error).key)) setPermissionBlocked(true)
        if (getApprovalsError(error).key !== 'rateLimit') await invalidateSpend()
        await feedback.onError(error)
      }
    }
  })
  const requiresReason = decision !== versionDecision.APPROVE
  const invalidReason = requiresReason && !reason.trim()
  return (
    <AdminFormDialog
      title={translate('reviewDecision')}
      pending={mutation.isPending}
      submitLabel={translate('confirmDecision')}
      submitDisabled={disabled || permissionBlocked || invalidReason}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        if (submissionLocked.current || mutation.isPending || disabled || permissionBlocked || invalidReason) return
        submissionLocked.current = true
        mutation.mutate({ id: itemId, data: { decision, ...(requiresReason ? { reason: reason.trim() } : {}) } })
      }}
    >
      <ApprovalsSelect
        label={translate('decision')}
        value={decision}
        disabled={mutation.isPending || permissionBlocked}
        options={[
          { value: versionDecision.APPROVE, label: translate('approve') },
          { value: versionDecision.REJECT, label: translate('reject') },
          { value: versionDecision.REQUEST_CHANGES, label: translate('requestChanges') }
        ]}
        onChange={(selected) => {
          const next = Object.values(versionDecision).find((value) => value === selected)
          if (next) setDecision(next)
        }}
      />
      {requiresReason ? (
        <ApprovalsField label={translate('reason')} hint={translate('reasonRequired')} required>
          <textarea
            rows={4}
            className={approvalsInputClass}
            value={reason}
            maxLength={1000}
            required
            disabled={mutation.isPending}
            placeholder={translate('reasonPlaceholder')}
            onChange={(event) => setReason(event.target.value)}
          />
        </ApprovalsField>
      ) : (
        <p className='text-sm text-muted-foreground'>{translate('approvalHint')}</p>
      )}
    </AdminFormDialog>
  )
}
