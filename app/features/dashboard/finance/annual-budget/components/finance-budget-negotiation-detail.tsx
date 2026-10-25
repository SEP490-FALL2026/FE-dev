import { ArrowLeft, ArrowRight, CheckCircle2, Lock, TriangleAlert, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { financeDepartmentName } from '../../finance-demo-labels'

import {
  InfoRow,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  inputClassName,
  primaryButtonClassName,
  useDashboardFormat
} from '../../../dashboard-ui'
import { proposalTotals, type AnnualProposal } from '../../annual-budget-data'
import { completeNegotiation, setProposalBuffer, setProposalOtherCosts } from '../../annual-budget-store'
import { ProposalStagePill } from './budget-plan-parts'
import { NegotiationLine, lineMissingReason } from './finance-negotiation-line'

/** FIN-41 detail: Finance negotiates each SaaS line, sets buffer and other costs, then completes the analysis. */
export function FinanceBudgetNegotiationDetail({
  formatCurrency,
  onBack,
  onOpenSummary,
  proposal
}: {
  formatCurrency: (value: number) => string
  onBack: () => void
  onOpenSummary: () => void
  proposal: AnnualProposal
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const editable = proposal.stage === 'IN_ANALYSIS' || proposal.stage === 'RETURNED'
  const [completed, setCompleted] = useState(false)
  const missingReasons = proposal.lines.filter(lineMissingReason).length

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
        actions={<ProposalStagePill stage={proposal.stage} />}
        subtitle={t('budgetPlan.negotiation.detailSubtitle', {
          costCenter: proposal.costCenter,
          manager: proposal.manager
        })}
        title={t('budgetPlan.negotiation.detailTitle', {
          department: financeDepartmentName(proposal.costCenter, proposal.department),
          year: proposal.year
        })}
      />

      {proposal.stage === 'RETURNED' && proposal.decision && (
        <Notice icon={Undo2} tone='danger'>
          {t('budgetPlan.negotiation.returned', {
            name: proposal.decision.by,
            reason: proposal.decision.reason ?? '',
            time: formatDate(proposal.decision.at)
          })}
        </Notice>
      )}

      {completed ? (
        <Notice icon={CheckCircle2} tone='success'>
          <p>{t('budgetPlan.negotiation.completed')}</p>
          <button
            className='mt-1 inline-flex items-center gap-1 font-bold underline'
            onClick={onOpenSummary}
            type='button'
          >
            {t('budgetPlan.negotiation.openSummary')}
            <ArrowRight aria-hidden='true' className='size-3.5' />
          </button>
        </Notice>
      ) : (
        !editable &&
        (proposal.stage === 'NEGOTIATED' || proposal.stage === 'SENT' || proposal.stage === 'APPROVED') && (
          <Notice icon={Lock} tone='neutral'>
            {t(`budgetPlan.negotiation.readOnly.${proposal.stage}`)}
          </Notice>
        )
      )}

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'>
        <Panel>
          <PanelTitle hint={t('budgetPlan.negotiation.linesHint')} title={t('budgetPlan.negotiation.linesTitle')} />
          <ul className='mt-4 space-y-3'>
            {proposal.lines.map((item) => (
              <NegotiationLine
                formatCurrency={formatCurrency}
                item={item}
                key={item.id}
                proposalId={proposal.id}
                readOnly={!editable}
              />
            ))}
          </ul>
        </Panel>

        <div className='space-y-6'>
          <CostPanel editable={editable} formatCurrency={formatCurrency} proposal={proposal} />
          <ComparisonPanel formatCurrency={formatCurrency} proposal={proposal} />

          {editable && (
            <div className='space-y-3'>
              {missingReasons > 0 && (
                <Notice icon={TriangleAlert} tone='warning'>
                  {t('budgetPlan.negotiation.completeBlocked', { count: missingReasons })}
                </Notice>
              )}
              <button
                className={`${primaryButtonClassName} w-full`}
                disabled={missingReasons > 0}
                onClick={() => {
                  completeNegotiation(proposal.id)
                  setCompleted(true)
                }}
                type='button'
              >
                <CheckCircle2 aria-hidden='true' className='size-3.5' />
                {t('budgetPlan.negotiation.complete')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CostPanel({
  editable,
  formatCurrency,
  proposal
}: {
  editable: boolean
  formatCurrency: (value: number) => string
  proposal: AnnualProposal
}) {
  const { t } = useTranslation('dashboard')
  const { formatPercent } = useDashboardFormat()
  const totals = proposalTotals(proposal)
  const [bufferPercent, setBufferPercent] = useState(String(Math.round(proposal.financeBufferRate * 1000) / 10))
  const [other, setOther] = useState(String(totals.other))

  return (
    <Panel>
      <PanelTitle hint={t('budgetPlan.negotiation.costHint')} title={t('budgetPlan.negotiation.costTitle')} />
      {editable && (
        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
          <div className='space-y-1'>
            <label className='text-xs font-bold' htmlFor='negotiation-buffer'>
              {t('budgetPlan.negotiation.bufferLabel')}
            </label>
            <input
              className={inputClassName}
              id='negotiation-buffer'
              max={100}
              min={0}
              onChange={(event) => {
                setBufferPercent(event.target.value)
                const value = Number(event.target.value)
                if (event.target.value !== '' && value >= 0 && value <= 100) setProposalBuffer(proposal.id, value / 100)
              }}
              step={0.5}
              type='number'
              value={bufferPercent}
            />
          </div>
          <div className='space-y-1'>
            <label className='text-xs font-bold' htmlFor='negotiation-other'>
              {t('budgetPlan.negotiation.otherLabel')}
            </label>
            <input
              className={inputClassName}
              id='negotiation-other'
              min={0}
              onChange={(event) => {
                setOther(event.target.value)
                const value = Number(event.target.value)
                if (event.target.value !== '' && value >= 0) setProposalOtherCosts(proposal.id, Math.round(value))
              }}
              type='number'
              value={other}
            />
          </div>
        </div>
      )}
      <div className='mt-4 divide-y divide-border'>
        <InfoRow label={t('budgetPlan.negotiation.base')} value={formatCurrency(totals.base)} />
        <InfoRow
          label={`${t('budgetPlan.negotiation.buffer')} (${formatPercent(proposal.financeBufferRate)})`}
          value={formatCurrency(totals.buffer)}
        />
        <InfoRow label={t('budgetPlan.negotiation.otherLabel')} value={formatCurrency(totals.other)} />
        <InfoRow
          label={t('budgetPlan.negotiation.total')}
          value={<span className='text-sm text-primary'>{formatCurrency(totals.total)}</span>}
        />
      </div>
    </Panel>
  )
}

function ComparisonPanel({
  formatCurrency,
  proposal
}: {
  formatCurrency: (value: number) => string
  proposal: AnnualProposal
}) {
  const { t } = useTranslation('dashboard')
  const { formatPercent } = useDashboardFormat()
  const totals = proposalTotals(proposal)
  const difference = totals.total - totals.requested
  const rate = totals.requested === 0 ? 0 : difference / totals.requested
  const tone = difference < 0 ? 'text-success' : 'text-warning'

  return (
    <Panel>
      <PanelTitle title={t('budgetPlan.negotiation.compareTitle')} />
      <div className='mt-4 divide-y divide-border'>
        <InfoRow label={t('budgetPlan.negotiation.managerRequested')} value={formatCurrency(totals.requested)} />
        <InfoRow label={t('budgetPlan.negotiation.financeProposed')} value={formatCurrency(totals.total)} />
        <InfoRow
          label={t('budgetPlan.negotiation.difference')}
          value={<span className={tone}>{formatCurrency(difference)}</span>}
        />
        <InfoRow
          label={t('budgetPlan.negotiation.differencePercent')}
          value={<span className={tone}>{formatPercent(rate)}</span>}
        />
      </div>
    </Panel>
  )
}
