import { getAccessRequestTimingsGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { getNeedDecisionListQueryKey } from '~/shared/api/generated/operations/need-decisions/need-decision-list'
import { getManagerDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/manager-dashboard-get'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Check, CheckCircle2, X, XCircle } from 'lucide-react'
import type { NeedDecisionBodyDto } from '~/shared/api/generated/model/access-requests/needDecisionBodyDto'
import { accessRequestNeedDecide } from '~/shared/api/generated/operations/access-requests/access-request-need-decide'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { Dialog } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { NEED_DECISION } from '../enums/need-decision'
import { allocationFromForm, ManagerPlanAllocation } from './manager-plan-allocation'

export function ManagerNeedForm({
  id,
  hasSpend,
  termRequired = false
}: {
  id: string
  hasSpend: boolean
  termRequired?: boolean
}) {
  const { t: translate } = useTranslation('manager')
  const [decision, setDecision] = useState<NeedDecisionBodyDto['decision']>(NEED_DECISION.APPROVE)
  const [confirmation, setConfirmation] = useState<NeedDecisionBodyDto | null>(null)
  const action = useManagerAction({
    mutationFn: (body: NeedDecisionBodyDto) => accessRequestNeedDecide(id, body),
    invalidate: [
      getAccessRequestGetQueryKey(id),
      getAccessRequestTimingsGetQueryKey(id),
      getSpendQueueListQueryKey(),
      getNeedDecisionListQueryKey(),
      getManagerDashboardGetQueryKey()
    ],
    onSuccess: () => setConfirmation(null)
  })
  return (
    <ManagerFormErrors fields={action.fields}>
      <form
        className='space-y-5'
        onSubmit={(event) => {
          event.preventDefault()
          if (action.blocked) return
          const form = new FormData(event.currentTarget)
          const reason = String(form.get('reason') ?? '').trim()
          const term = String(form.get('termConfirmation') ?? '').trim()
          if (
            (decision === NEED_DECISION.REJECT && !reason) ||
            (decision === NEED_DECISION.APPROVE && termRequired && !term)
          )
            return
          const spend = decision === NEED_DECISION.APPROVE && hasSpend ? allocationFromForm(form) : undefined
          if (decision === NEED_DECISION.APPROVE && hasSpend && !spend) {
            toast.error(translate('validation'), { id: 'manager-need-allocation' })
            return
          }
          setConfirmation({
            decision,
            ...(decision === NEED_DECISION.REJECT ? { reason } : {}),
            ...(decision === NEED_DECISION.APPROVE && termRequired ? { termConfirmation: { reason: term } } : {}),
            ...(spend ? { spend } : {})
          })
        }}
      >
        <fieldset disabled={action.blocked} className='space-y-4'>
          {/* Card-based decision selector */}
          <div className='grid gap-3 sm:grid-cols-2'>
            <div
              className={`rounded-md border p-3.5 transition-colors ${
                decision === NEED_DECISION.APPROVE
                  ? 'border-emerald-500/50 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500/30 dark:bg-emerald-950/20'
                  : 'border-border/70 bg-surface hover:bg-surface-subtle/60'
              }`}
            >
              <label className='flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground'>
                <input
                  name='decision'
                  type='radio'
                  checked={decision === NEED_DECISION.APPROVE}
                  onChange={() => setDecision(NEED_DECISION.APPROVE)}
                  className='size-4 accent-emerald-600'
                />
                <CheckCircle2
                  className={`size-4 ${
                    decision === NEED_DECISION.APPROVE
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-muted-foreground'
                  }`}
                />
                {translate('approve')}
              </label>
              <p className='mt-1.5 pl-6 text-xs leading-normal text-muted-foreground'>
                {translate('requestDetail.approveDesc')}
              </p>
            </div>

            <div
              className={`rounded-md border p-3.5 transition-colors ${
                decision === NEED_DECISION.REJECT
                  ? 'border-rose-500/50 bg-rose-50/50 shadow-xs ring-1 ring-rose-500/30 dark:bg-rose-950/20'
                  : 'border-border/70 bg-surface hover:bg-surface-subtle/60'
              }`}
            >
              <label className='flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground'>
                <input
                  name='decision'
                  type='radio'
                  checked={decision === NEED_DECISION.REJECT}
                  onChange={() => setDecision(NEED_DECISION.REJECT)}
                  className='size-4 accent-rose-600'
                />
                <XCircle
                  className={`size-4 ${
                    decision === NEED_DECISION.REJECT ? 'text-rose-600 dark:text-rose-400' : 'text-muted-foreground'
                  }`}
                />
                {translate('reject')}
              </label>
              <p className='mt-1.5 pl-6 text-xs leading-normal text-muted-foreground'>
                {translate('requestDetail.rejectDesc')}
              </p>
            </div>
          </div>

          {decision === NEED_DECISION.REJECT && (
            <ManagerField label={translate('requestForm.rejectionReason')}>
              <textarea
                className={managerInputClass}
                name='reason'
                aria-label={translate('reason')}
                rows={3}
                required
                maxLength={1000}
                placeholder={translate('requestDetail.reasonPlaceholderReject')}
              />
            </ManagerField>
          )}

          {decision === NEED_DECISION.APPROVE && (
            <>
              {termRequired && (
                <ManagerField label={translate('requestForm.termConfirmation')}>
                  <textarea
                    className={managerInputClass}
                    name='termConfirmation'
                    aria-label={translate('termConfirmation')}
                    rows={2}
                    required
                    maxLength={1000}
                    placeholder={translate('requestDetail.termConfirmationPlaceholder')}
                  />
                </ManagerField>
              )}
              {hasSpend && <ManagerPlanAllocation id={id} />}
            </>
          )}
        </fieldset>

        <ManagerActionState action={action} />

        <div className='flex justify-end border-t border-border/50 pt-4'>
          <ManagerButton
            primary={decision === NEED_DECISION.APPROVE}
            type='submit'
            busy={action.isPending}
            disabled={action.blocked}
            className={
              decision === NEED_DECISION.REJECT
                ? 'border border-rose-500/40 bg-rose-600 text-white hover:bg-rose-700'
                : undefined
            }
          >
            {decision === NEED_DECISION.APPROVE ? (
              <Check aria-hidden strokeWidth={1.5} className='size-4' />
            ) : (
              <X aria-hidden strokeWidth={1.5} className='size-4' />
            )}
            {action.retrySeconds ? translate('retryAfter', { seconds: action.retrySeconds }) : translate('confirm')}
          </ManagerButton>
        </div>
      </form>

      {confirmation && (
        <Dialog
          presentation='sheet'
          title={translate('decision')}
          hint={translate('confirmAction')}
          onClose={() => {
            if (!action.isPending) setConfirmation(null)
          }}
        >
          <div className='space-y-4'>
            <div className='rounded-lg border border-border/60 bg-surface-subtle/50 p-4'>
              <p className='text-sm text-foreground'>
                {confirmation.decision === NEED_DECISION.APPROVE
                  ? translate('requestDetail.confirmApproveText')
                  : translate('requestDetail.confirmRejectText')}
              </p>
              {confirmation.reason && (
                <p className='mt-2.5 border-l-2 border-border pl-3 text-xs italic text-muted-foreground'>
                  "{confirmation.reason}"
                </p>
              )}
            </div>

            <div className='flex justify-end gap-3'>
              <ManagerButton disabled={action.isPending} onClick={() => setConfirmation(null)}>
                {translate('cancel')}
              </ManagerButton>
              <ManagerButton
                primary
                busy={action.isPending}
                disabled={action.blocked}
                onClick={() => {
                  if (!action.blocked) action.mutate(confirmation)
                }}
              >
                {translate('confirm')}
              </ManagerButton>
            </div>
          </div>
        </Dialog>
      )}
    </ManagerFormErrors>
  )
}
