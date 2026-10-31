import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowLeft, Landmark } from 'lucide-react'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'
import type { BudgetProposalBodyDto } from '~/shared/api/generated/model/budget-proposals/budgetProposalBodyDto'
import type { BudgetProposalBodyDtoLinesItem } from '~/shared/api/generated/model/budget-proposals/budgetProposalBodyDtoLinesItem'
import { budgetProposalSubmit } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-submit'
import { budgetProposalResubmit } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-resubmit'
import {
  useBudgetProposalGet,
  getBudgetProposalGetQueryKey
} from '~/shared/api/generated/operations/budget-proposals/budget-proposal-get'
import {
  budgetProposalLineList,
  getBudgetProposalLineListQueryKey
} from '~/shared/api/generated/operations/budget-proposals/budget-proposal-line-list'
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
import { resourceIdPattern } from '../../shared/manager-identifiers'
import { ManagerBudgetLine, budgetLineFromForm } from '../components/manager-budget-lines'
import { PROPOSAL_STATE } from '../enums/budget-status'
import { managerBudgetYear } from './manager-live-budget'

export function ManagerBudgetForm({ id, costCenterId }: { id?: string; costCenterId?: string }) {
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
      {id ? <RevisionLoader id={id} /> : <ProposalForm costCenterId={costCenterId} year={managerBudgetYear(params)} />}
    </div>
  )
}
function RevisionLoader({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const proposal = useBudgetProposalGet(id)
  const lines = useQuery({
    queryKey: [...getBudgetProposalLineListQueryKey(id), 'revision-form'],
    enabled: proposal.data?.data?.proposal.state === PROPOSAL_STATE.RETURNED,
    queryFn: async ({ signal }) => {
      const first = await budgetProposalLineList(id, { page: 1, pageSize: 100 }, undefined, signal)
      const items = [...(first.data?.items ?? [])]
      for (let page = 2; page <= (first.data?.pagination.totalPages ?? 0); page++) {
        const next = await budgetProposalLineList(id, { page, pageSize: 100 }, undefined, signal)
        items.push(...(next.data?.items ?? []))
      }
      return items.map((line) => ({
        description: line.description,
        amount: line.amount,
        ...(line.planId ? { planId: line.planId } : {}),
        ...(line.seats ? { seats: line.seats } : {}),
        windowFrom: line.windowFrom,
        windowTo: line.windowTo,
        servicePeriodMonths: line.servicePeriodMonths,
        repeatCycle: line.repeatCycle,
        ...(line.quoteValidUntil ? { quoteValidUntil: line.quoteValidUntil } : {}),
        ...(line.note ? { note: line.note } : {})
      }))
    }
  })
  const current = !proposal.isError ? proposal.data?.data?.proposal : null
  return (
    <>
      <ManagerQueryState query={proposal} />
      {current &&
        (current.state !== PROPOSAL_STATE.RETURNED || current.successorProposalId ? (
          <p className='text-sm'>{translate('noPermission')}</p>
        ) : (
          <>
            <ManagerQueryState query={lines} />
            {lines.isSuccess && (
              <ProposalForm
                id={id}
                year={current.year}
                costCenterId={current.costCenter.id}
                initialLines={lines.data}
              />
            )}
          </>
        ))}
    </>
  )
}
function ProposalForm({
  id,
  costCenterId,
  year,
  initialLines
}: {
  id?: string
  costCenterId?: string
  year: number
  initialLines?: BudgetProposalBodyDtoLinesItem[]
}) {
  const { t: translate } = useTranslation('manager')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [lines, setLines] = useState(() =>
    (initialLines?.length ? initialLines : [undefined]).map((initial, index) => ({ key: index, initial }))
  )
  const [nextKey, setNextKey] = useState(lines.length)
  const action = useManagerAction({
    mutationFn: (body: BudgetProposalBodyDto) =>
      id ? budgetProposalResubmit(id, { lines: body.lines }) : budgetProposalSubmit(body),
    invalidate: [
      getBudgetProposalListQueryKey(),
      getBudgetMineQueryKey(),
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
      <form
        className='space-y-6'
        onSubmit={(event) => {
          event.preventDefault()
          if (action.blocked) return
          const form = new FormData(event.currentTarget)
          action.mutate({
            costCenterId: String(form.get('costCenterId')).trim(),
            year: Number(form.get('year')),
            lines: lines.map((_, index) => budgetLineFromForm(form, index))
          })
        }}
      >
        <fieldset disabled={action.blocked} className='space-y-6'>
          <ManagerSection title={translate('proposal')}>
            <div className='grid gap-4 sm:grid-cols-2'>
              <ManagerField label={translate('costCenter')}>
                <input
                  name='costCenterId'
                  className={managerInputClass}
                  required
                  pattern={resourceIdPattern}
                  defaultValue={costCenterId}
                  readOnly={!!id}
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
                  readOnly={!!id}
                />
              </ManagerField>
            </div>
          </ManagerSection>
          {lines.map((line, index) => (
            <ManagerSection key={line.key} title={`${translate('plan')} ${index + 1}`}>
              <ManagerBudgetLine index={index} initial={line.initial} />
              <div className='flex justify-end'>
                <ManagerButton
                  disabled={lines.length <= 1}
                  onClick={() => setLines((previous) => previous.filter((item) => item.key !== line.key))}
                >
                  {translate('remove')}
                </ManagerButton>
              </div>
            </ManagerSection>
          ))}
          <ManagerButton
            disabled={lines.length >= 200}
            onClick={() => {
              setLines((previous) => [...previous, { key: nextKey, initial: undefined }])
              setNextKey(nextKey + 1)
            }}
          >
            {translate('add')}
          </ManagerButton>
        </fieldset>
        <ManagerActionState action={action} />
        <div className='sticky bottom-0 flex justify-end border-t border-border/60 bg-background py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
          <ManagerButton primary type='submit' disabled={action.blocked} busy={action.isPending}>
            {action.retrySeconds
              ? translate('retryAfter', { seconds: action.retrySeconds })
              : translate(id ? 'resubmit' : 'submit')}
          </ManagerButton>
        </div>
      </form>
    </ManagerFormErrors>
  )
}
