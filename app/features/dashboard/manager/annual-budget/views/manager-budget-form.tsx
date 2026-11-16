import { useState } from 'react'
import { ArrowLeft, Landmark } from 'lucide-react'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'
import type { BudgetProposalBodyDto } from '~/shared/api/generated/model/budget-proposals/budgetProposalBodyDto'
import { budgetProposalSubmit } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-submit'
import { budgetProposalResubmit } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-resubmit'
import {
  useBudgetProposalGet,
  getBudgetProposalGetQueryKey
} from '~/shared/api/generated/operations/budget-proposals/budget-proposal-get'
import { getBudgetProposalListQueryKey } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { getBudgetMineQueryKey } from '~/shared/api/generated/operations/budgets/budget-mine'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  ManagerQueryState,
  ManagerSection,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { isResourceId } from '../../shared/manager-identifiers'
import { ManagerBudgetAttachments } from '../components/manager-budget-attachments'
import { ManagerBudgetFiles } from '../components/manager-budget-files'
import { useBudgetAttachments } from '../hooks/use-budget-attachments'
import { getBudgetAttachmentMineListQueryKey } from '~/shared/api/generated/operations/budgets/budget-attachment-mine-list'
import { PROPOSAL_STATE } from '../enums/budget-status'
import { managerBudgetYear } from './manager-live-budget'
import { ManagerBudgetContext } from '../components/manager-budget-context'
import { ManagerBudgetTemplate } from '../components/manager-budget-template'
import { useBudgetContext } from '../hooks/use-budget-context'

export function ManagerBudgetForm({
  id,
  costCenterId,
  costCenterName
}: {
  id?: string
  costCenterId?: string
  costCenterName?: string
}) {
  const { t: translate } = useTranslation('manager')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const back = () =>
    void navigate({
      pathname: '/dashboard/manager',
      search: new URLSearchParams({ ...Object.fromEntries(params), tab: 'annual-budget' }).toString()
    })
  return (
    <div className='space-y-6'>
      <ManagerPageHeader
        title={translate(id ? 'resubmit' : 'newProposal')}
        icon={Landmark}
        description={translate('budgetHint')}
        actions={
          <ManagerButton onClick={back}>
            <ArrowLeft aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('back')}
          </ManagerButton>
        }
      />
      {id ? (
        <RevisionLoader id={id} />
      ) : (
        <ProposalForm costCenterId={costCenterId} costCenterName={costCenterName} year={managerBudgetYear(params)} />
      )}
    </div>
  )
}
function RevisionLoader({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const proposal = useBudgetProposalGet(id)
  const current = !proposal.isError ? proposal.data?.data?.proposal : null
  return (
    <>
      <ManagerQueryState query={proposal} />
      {current &&
        (current.state !== PROPOSAL_STATE.RETURNED || current.successorProposalId ? (
          <p className='text-sm'>{translate('noPermission')}</p>
        ) : (
          <ProposalForm
            id={id}
            year={current.year}
            costCenterId={current.costCenter.id}
            costCenterName={current.costCenter.name}
            initialAmount={current.requestedAmount?.amount}
            initialNote={current.note ?? undefined}
          />
        ))}
    </>
  )
}
function ProposalForm({
  id,
  costCenterId,
  costCenterName,
  year,
  initialAmount,
  initialNote
}: {
  id?: string
  costCenterId?: string
  costCenterName?: string
  year: number
  initialAmount?: string
  initialNote?: string
}) {
  const { t: translate } = useTranslation('manager')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [draftYear, setDraftYear] = useState(year)
  const attachments = useBudgetAttachments()
  const budgetContext = useBudgetContext(draftYear, costCenterId)
  const validCostCenter = isResourceId(costCenterId ?? '')
  const action = useManagerAction({
    mutationFn: (body: BudgetProposalBodyDto) =>
      id
        ? budgetProposalResubmit(id, {
            requestedAmount: body.requestedAmount,
            ...(body.note ? { note: body.note } : {}),
            attachmentIds: body.attachmentIds
          })
        : budgetProposalSubmit(body),
    invalidate: [
      getBudgetProposalListQueryKey(),
      getBudgetMineQueryKey(),
      getBudgetAttachmentMineListQueryKey(),
      ...(id ? [getBudgetProposalGetQueryKey(id)] : [])
    ],
    onSuccess: (result) => {
      const proposal = result.data?.proposal
      const next = new URLSearchParams(params)
      next.set('tab', 'annual-budget')
      if (proposal) {
        next.set('proposalId', proposal.id)
        next.set('year', String(proposal.year))
      }
      void navigate({ pathname: '/dashboard/manager', search: next.toString() })
    }
  })
  return (
    <ManagerFormErrors fields={action.fields}>
      <ManagerBudgetContext year={draftYear} context={budgetContext} />
      <form
        className='space-y-6'
        onSubmit={(event) => {
          event.preventDefault()
          if (action.blocked || attachments.blocked || !validCostCenter || !budgetContext.cycleOpen) return
          const form = new FormData(event.currentTarget)
          const note = String(form.get('note') ?? '').trim()
          action.mutate({
            year: Number(form.get('year')),
            costCenterId,
            requestedAmount: { amount: String(form.get('requestedAmount') ?? '').trim() },
            ...(note ? { note } : {}),
            attachmentIds: attachments.selected
          })
        }}
      >
        <fieldset disabled={action.blocked} className='space-y-6'>
          <ManagerSection title={translate('proposal')}>
            <div className='grid gap-4 sm:grid-cols-2'>
              <ManagerField label={translate('budgetForm.costCenter')}>
                <input
                  className={managerInputClass}
                  value={costCenterName ?? (validCostCenter ? translate('budgetForm.costCenter') : '')}
                  readOnly
                />
              </ManagerField>
              <ManagerField label={translate('year')}>
                <input
                  name='year'
                  className={managerInputClass}
                  type='number'
                  min={2000}
                  max={2200}
                  step={1}
                  required
                  defaultValue={year}
                  onChange={(event) => {
                    const value = Number(event.target.value)
                    if (Number.isInteger(value) && value >= 2000 && value <= 2200) setDraftYear(value)
                  }}
                  readOnly={!!id}
                />
              </ManagerField>
              <ManagerField label={translate('amount')}>
                <input
                  name='requestedAmount'
                  className={managerInputClass}
                  required
                  inputMode='decimal'
                  pattern='[0-9]{1,16}(\.[0-9]+)?'
                  maxLength={40}
                  defaultValue={initialAmount}
                />
              </ManagerField>
              <ManagerField label={translate('note')}>
                <textarea
                  name='note'
                  className={managerInputClass}
                  maxLength={1000}
                  rows={3}
                  defaultValue={initialNote}
                />
              </ManagerField>
            </div>
          </ManagerSection>
          {!validCostCenter && (
            <p role='alert' className='text-sm text-warning-ink'>
              {translate('budgetForm.noCostCenter')}
            </p>
          )}
          <ManagerBudgetTemplate />
          <ManagerBudgetAttachments
            files={attachments}
            disabled={action.blocked}
            invalid={action.fields.includes('attachmentIds')}
          />
          {id && (
            <ManagerSection title={translate('budgetForm.previousFiles')}>
              <p className='mb-4 text-sm text-muted-foreground'>{translate('budgetForm.previousHint')}</p>
              <ManagerBudgetFiles id={id} />
            </ManagerSection>
          )}
        </fieldset>
        <ManagerActionState action={action} />
        <div className='sticky bottom-0 flex justify-end border-t border-border/60 bg-background py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
          <ManagerButton
            primary
            type='submit'
            disabled={
              action.blocked ||
              attachments.blocked ||
              !validCostCenter ||
              !budgetContext.cycleOpen ||
              attachments.selected.length < 1 ||
              attachments.selected.length > 10
            }
            busy={action.isPending}
          >
            {action.retrySeconds
              ? translate('retryAfter', { seconds: action.retrySeconds })
              : translate(id ? 'resubmit' : 'submit')}
          </ManagerButton>
        </div>
      </form>
    </ManagerFormErrors>
  )
}
