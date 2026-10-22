import { ArrowLeft, ArrowRight, CheckCircle2, Clock, MessageSquareWarning, Paperclip, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  InfoRow,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat
} from '../../dashboard-ui'
import {
  proposalBudgetStatus,
  proposalTotals,
  requestedAmount,
  type AnnualProposal,
  type ProposalStage
} from '../annual-budget-data'
import { requestProposalInfo, startProposalAnalysis } from '../annual-budget-store'
import { BudgetStatusPill, ProposalStagePill } from './budget-plan-parts'

const actionableStages: readonly ProposalStage[] = ['SUBMITTED', 'NEEDS_INFO', 'RETURNED']

/** FIN-40 detail: what the Manager submitted; Finance asks for more information or moves it to analysis. */
export function FinanceAnnualProposalDetail({
  formatCurrency,
  onBack,
  onOpenNegotiation,
  proposal
}: {
  formatCurrency: (value: number) => string
  onBack: () => void
  onOpenNegotiation: () => void
  proposal: AnnualProposal
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const totals = proposalTotals(proposal)

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={onBack}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('budgetPlan.backToList')}
      </button>

      <PageHeader
        actions={
          <span className='flex flex-wrap gap-2'>
            <ProposalStagePill stage={proposal.stage} />
            <BudgetStatusPill status={proposalBudgetStatus(proposal.stage)} />
          </span>
        }
        subtitle={t('budgetPlan.proposals.detailSubtitle', {
          costCenter: proposal.costCenter,
          manager: proposal.manager,
          time: formatDate(proposal.submittedAt)
        })}
        title={t('budgetPlan.proposals.detailTitle', { department: proposal.department, year: proposal.year })}
      />

      {proposal.infoRequest && (
        <Notice icon={MessageSquareWarning} tone='warning'>
          {t('budgetPlan.proposals.infoRequested', {
            message: proposal.infoRequest.message,
            time: formatDate(proposal.infoRequest.at)
          })}
        </Notice>
      )}

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'>
        <Panel>
          <PanelTitle hint={t('budgetPlan.proposals.inputHint')} title={t('budgetPlan.proposals.inputTitle')} />
          <ManagerInputTable formatCurrency={formatCurrency} proposal={proposal} />
          <div className='mt-4 divide-y divide-border border-t border-border pt-2'>
            <InfoRow label={t('budgetPlan.proposals.requestedSaas')} value={formatCurrency(totals.requestedSaas)} />
            <InfoRow label={t('budgetPlan.proposals.otherCosts')} value={formatCurrency(proposal.otherCosts)} />
            <InfoRow label={t('budgetPlan.proposals.requestedTotal')} value={formatCurrency(totals.requested)} />
          </div>
        </Panel>

        <div className='space-y-6'>
          <Panel>
            <PanelTitle title={t('budgetPlan.proposals.attachmentsTitle')} />
            {proposal.attachments.length === 0 ? (
              <p className='mt-3 text-xs text-muted-foreground'>{t('budgetPlan.proposals.noAttachments')}</p>
            ) : (
              <ul className='mt-3 space-y-2'>
                {proposal.attachments.map((name) => (
                  <li className='flex items-center gap-2 text-xs font-semibold' key={name}>
                    <Paperclip aria-hidden='true' className='size-3.5 text-muted-foreground' />
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <PanelTitle hint={t('budgetPlan.proposals.actionsHint')} title={t('budgetPlan.proposals.actionsTitle')} />
            <div className='mt-4'>
              {actionableStages.includes(proposal.stage) ? (
                <ProposalActions onOpenNegotiation={onOpenNegotiation} proposal={proposal} />
              ) : (
                <StageNotice onOpenNegotiation={onOpenNegotiation} stage={proposal.stage} />
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

function ManagerInputTable({
  formatCurrency,
  proposal
}: {
  formatCurrency: (value: number) => string
  proposal: AnnualProposal
}) {
  const { t } = useTranslation('dashboard')
  const { formatNumber } = useDashboardFormat()

  return (
    <div className='mt-4 overflow-x-auto'>
      <table className='w-full min-w-200 text-left text-xs'>
        <thead>
          <tr className='border-b border-border text-muted-foreground'>
            <th className='py-2.5 font-semibold'>{t('budgetPlan.proposals.colSoftware')}</th>
            <th className='py-2.5 font-semibold'>{t('budgetPlan.proposals.colPlan')}</th>
            <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.proposals.colUsers')}</th>
            <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.proposals.colMonths')}</th>
            <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.proposals.colUnitPrice')}</th>
            <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.proposals.colEstimated')}</th>
            <th className='py-2.5 pl-4 font-semibold'>{t('budgetPlan.proposals.colCatalog')}</th>
            <th className='py-2.5 font-semibold'>{t('budgetPlan.proposals.colNeed')}</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border'>
          {proposal.lines.map((item) => (
            <tr key={item.id}>
              <td className='py-3'>
                <p className='font-semibold text-foreground'>{item.software}</p>
                <p className='mt-0.5 text-muted-foreground'>{t(`budgetPlan.group.${item.group}`)}</p>
              </td>
              <td className='py-3'>{item.plan}</td>
              <td className='py-3 text-right'>{formatNumber(item.users)}</td>
              <td className='py-3 text-right'>{formatNumber(item.months)}</td>
              <td className='py-3 text-right'>{formatCurrency(item.monthlyUnitPrice)}</td>
              <td className='py-3 text-right font-bold'>{formatCurrency(requestedAmount(item))}</td>
              <td className='py-3 pl-4'>
                <Pill tone={item.inCatalog ? 'success' : 'warning'}>
                  {item.inCatalog ? t('budgetPlan.proposals.inCatalog') : t('budgetPlan.proposals.newTool')}
                </Pill>
              </td>
              <td className='max-w-56 py-3 text-muted-foreground'>{item.need}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProposalActions({ onOpenNegotiation, proposal }: { onOpenNegotiation: () => void; proposal: AnnualProposal }) {
  const { t } = useTranslation('dashboard')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)

  return (
    <div className='space-y-4'>
      <form
        className='space-y-2'
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          const text = message.trim()
          if (!text) {
            setError(true)
            return
          }
          requestProposalInfo(proposal.id, text)
          setMessage('')
          setError(false)
          setSent(true)
        }}
      >
        <label className='text-xs font-bold' htmlFor='proposal-info-message'>
          {t('budgetPlan.proposals.messageLabel')}
        </label>
        <textarea
          aria-describedby={error ? 'proposal-info-error' : undefined}
          aria-invalid={error}
          className={`${inputClassName} min-h-20`}
          id='proposal-info-message'
          onChange={(event) => setMessage(event.target.value)}
          placeholder={t('budgetPlan.proposals.messagePlaceholder')}
          value={message}
        />
        {error && (
          <p className='text-[0.7rem] font-semibold text-danger' id='proposal-info-error' role='alert'>
            {t('budgetPlan.proposals.messageRequired')}
          </p>
        )}
        <button className={`${secondaryButtonClassName} w-full`} type='submit'>
          <Send aria-hidden='true' className='size-3.5' />
          {t('budgetPlan.proposals.requestInfo')}
        </button>
      </form>

      {sent && (
        <Notice icon={CheckCircle2} tone='success'>
          {t('budgetPlan.proposals.infoSent')}
        </Notice>
      )}

      <button
        className={`${primaryButtonClassName} w-full`}
        onClick={() => {
          startProposalAnalysis(proposal.id)
          onOpenNegotiation()
        }}
        type='button'
      >
        <ArrowRight aria-hidden='true' className='size-3.5' />
        {t('budgetPlan.proposals.startAnalysis')}
      </button>
    </div>
  )
}

function StageNotice({ onOpenNegotiation, stage }: { onOpenNegotiation: () => void; stage: ProposalStage }) {
  const { t } = useTranslation('dashboard')

  if (stage === 'APPROVED') {
    return (
      <Notice icon={CheckCircle2} tone='success'>
        {t('budgetPlan.proposals.stageNotice.APPROVED')}
      </Notice>
    )
  }
  if (stage !== 'IN_ANALYSIS' && stage !== 'NEGOTIATED' && stage !== 'SENT') return null

  return (
    <div className='space-y-3'>
      <Notice icon={Clock} tone='info'>
        {t(`budgetPlan.proposals.stageNotice.${stage}`)}
      </Notice>
      <button className={`${secondaryButtonClassName} w-full`} onClick={onOpenNegotiation} type='button'>
        {t('budgetPlan.proposals.openNegotiation')}
        <ArrowRight aria-hidden='true' className='size-3.5' />
      </button>
    </div>
  )
}
