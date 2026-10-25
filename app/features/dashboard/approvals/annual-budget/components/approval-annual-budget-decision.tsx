import { CheckCircle2, Undo2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Notice,
  Panel,
  PanelTitle,
  dangerButtonClassName,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat
} from '../../../dashboard-ui'
import type { AnnualProposal, ApproverDecision, DecisionOutcome } from '../../../finance/annual-budget-data'
import { decideProposal } from '../../../finance/annual-budget-store'
import { decisionOutcomeTones } from './approval-annual-budget-history'

type ReasonOutcome = Exclude<DecisionOutcome, 'APPROVED'>

const outcomeIcons = { ADJUSTMENT_REQUESTED: Undo2, APPROVED: CheckCircle2, REJECTED: XCircle } as const

/**
 * APV-05 decision: while Finance's version is pending the approver approves it, asks Finance to adjust it or rejects
 * it (both need a reason); afterwards the panel shows the recorded decision.
 */
export function ApprovalAnnualBudgetDecision({ proposal }: { proposal: AnnualProposal }) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()

  return (
    <Panel>
      <PanelTitle
        hint={proposal.sentAt ? t('budgetPlan.approver.sentBy', { time: formatDate(proposal.sentAt) }) : undefined}
        title={t('budgetPlan.approver.decisionTitle')}
      />
      <div className='mt-4 space-y-3 text-xs'>
        {proposal.stage === 'SENT' ? (
          <DecisionActions proposalId={proposal.id} />
        ) : proposal.decision ? (
          <DecisionNotice decision={proposal.decision} department={proposal.department} year={proposal.year} />
        ) : null}
      </div>
    </Panel>
  )
}

function DecisionActions({ proposalId }: { proposalId: string }) {
  const { t } = useTranslation('dashboard')
  const [pending, setPending] = useState<ReasonOutcome | null>(null)
  const [reason, setReason] = useState('')
  const [showReasonError, setShowReasonError] = useState(false)

  const open = (outcome: ReasonOutcome) => {
    setPending(outcome)
    setReason('')
    setShowReasonError(false)
  }

  if (pending) {
    const fieldId = `annual-budget-reason-${pending.toLowerCase()}`

    return (
      <form
        className='space-y-2'
        onSubmit={(event) => {
          event.preventDefault()
          if (reason.trim().length === 0) {
            setShowReasonError(true)
            return
          }
          decideProposal(proposalId, pending, reason.trim())
        }}
      >
        <label className='font-bold' htmlFor={fieldId}>
          {t(`budgetPlan.approver.reasonLabel.${pending}`)}
        </label>
        <textarea
          className={`${inputClassName} min-h-20`}
          id={fieldId}
          onChange={(event) => setReason(event.target.value)}
          value={reason}
        />
        {showReasonError && (
          <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
            {t('budgetPlan.approver.reasonRequired')}
          </p>
        )}
        <div className='flex flex-wrap gap-2'>
          <button className={pending === 'REJECTED' ? dangerButtonClassName : primaryButtonClassName} type='submit'>
            {t(`budgetPlan.approver.confirm.${pending}`)}
          </button>
          <button className={secondaryButtonClassName} onClick={() => setPending(null)} type='button'>
            {t('ui.cancel')}
          </button>
        </div>
      </form>
    )
  }

  return (
    <>
      <p className='text-muted-foreground'>{t('budgetPlan.approver.decisionHint')}</p>
      <div className='grid gap-2'>
        <button className={primaryButtonClassName} onClick={() => decideProposal(proposalId, 'APPROVED')} type='button'>
          <CheckCircle2 aria-hidden='true' className='size-3.5' />
          {t('budgetPlan.approver.actions.APPROVED')}
        </button>
        <button className={secondaryButtonClassName} onClick={() => open('ADJUSTMENT_REQUESTED')} type='button'>
          <Undo2 aria-hidden='true' className='size-3.5' />
          {t('budgetPlan.approver.actions.ADJUSTMENT_REQUESTED')}
        </button>
        <button className={dangerButtonClassName} onClick={() => open('REJECTED')} type='button'>
          <XCircle aria-hidden='true' className='size-3.5' />
          {t('budgetPlan.approver.actions.REJECTED')}
        </button>
      </div>
    </>
  )
}

function DecisionNotice({
  decision,
  department,
  year
}: {
  decision: ApproverDecision
  department: string
  year: number
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()

  return (
    <Notice icon={outcomeIcons[decision.outcome]} tone={decisionOutcomeTones[decision.outcome]}>
      <p className='font-bold'>
        {t(`budgetPlan.approver.notice.title.${decision.outcome}`, { version: decision.version })}
      </p>
      <p className='mt-0.5'>{t('budgetPlan.approver.notice.by', { by: decision.by, time: formatDate(decision.at) })}</p>
      <p className='mt-0.5'>{t(`budgetPlan.approver.notice.effect.${decision.outcome}`, { department, year })}</p>
      {decision.reason && (
        <p className='mt-0.5'>{t('budgetPlan.approver.notice.reason', { reason: decision.reason })}</p>
      )}
    </Notice>
  )
}
