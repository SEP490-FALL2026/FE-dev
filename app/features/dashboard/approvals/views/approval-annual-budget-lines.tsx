import { useTranslation } from 'react-i18next'

import { InfoRow, Panel, PanelTitle, Pill, useDashboardFormat } from '../../dashboard-ui'
import {
  activeFiscalYear,
  annualBudgets2026,
  annualTotal,
  financeAmount,
  proposalTotals,
  requestedAmount,
  type AnnualProposal
} from '../../finance/annual-budget-data'

const signed = (value: number, format: (value: number) => string) => (value > 0 ? `+${format(value)}` : format(value))

/** APV-05: per software line, the Manager's request next to Finance's analysed amount and the reason for any cut. */
export function ApprovalAnnualBudgetLines({
  formatCurrency,
  proposal
}: {
  formatCurrency: (value: number) => string
  proposal: AnnualProposal
}) {
  const { t } = useTranslation('dashboard')
  const head = 'py-2.5 pr-3 font-semibold'

  return (
    <Panel>
      <PanelTitle hint={t('budgetPlan.approver.linesHint')} title={t('budgetPlan.approver.linesTitle')} />
      <div className='mt-4 overflow-x-auto'>
        <table className='w-full min-w-176 text-left text-xs'>
          <thead>
            <tr className='border-b border-border text-muted-foreground'>
              <th className={head}>{t('budgetPlan.approver.colSoftware')}</th>
              <th className={`${head} text-right`}>{t('budgetPlan.approver.colRequested')}</th>
              <th className={`${head} text-right`}>{t('budgetPlan.approver.colFinance')}</th>
              <th className={`${head} text-right`}>{t('budgetPlan.approver.colDifference')}</th>
              <th className={head}>{t('budgetPlan.approver.colReason')}</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {proposal.lines.map((line) => {
              const requested = requestedAmount(line)
              const finance = financeAmount(line)
              const difference = finance - requested

              return (
                <tr className='align-top' key={line.id}>
                  <td className='py-3 pr-3'>
                    <p className='font-semibold text-foreground'>{line.software}</p>
                    <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                      {t('budgetPlan.approver.lineDetail', {
                        group: t(`budgetPlan.group.${line.group}`),
                        months: line.months,
                        plan: line.plan,
                        users: line.users
                      })}
                    </p>
                    <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                      {t('budgetPlan.approver.managerNeed', { need: line.need })}
                    </p>
                  </td>
                  <td className='py-3 pr-3 text-right text-muted-foreground'>{formatCurrency(requested)}</td>
                  <td className='py-3 pr-3 text-right font-bold text-foreground'>{formatCurrency(finance)}</td>
                  <td
                    className={`py-3 pr-3 text-right font-semibold ${difference < 0 ? 'text-success' : difference > 0 ? 'text-danger' : 'text-muted-foreground'}`}
                  >
                    {signed(difference, formatCurrency)}
                  </td>
                  <td className='py-3 pr-3 text-muted-foreground'>
                    {line.finance?.reason || t('budgetPlan.approver.noReason')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

/** APV-05: the department total Finance submits — base cost, buffer and rate, other costs — against last year. */
export function ApprovalAnnualBudgetTotals({
  formatCurrency,
  proposal
}: {
  formatCurrency: (value: number) => string
  proposal: AnnualProposal
}) {
  const { t } = useTranslation('dashboard')
  const { formatPercent } = useDashboardFormat()
  const totals = proposalTotals(proposal)
  const previous = annualBudgets2026.find((budget) => budget.costCenter === proposal.costCenter)
  const previousTotal = previous ? annualTotal(previous) : null

  return (
    <Panel>
      <PanelTitle hint={t('budgetPlan.approver.totalsHint')} title={t('budgetPlan.approver.totalsTitle')} />
      <div className='mt-3 divide-y divide-border'>
        <InfoRow label={t('budgetPlan.approver.base')} value={formatCurrency(totals.base)} />
        <InfoRow
          label={t('budgetPlan.approver.buffer', { rate: formatPercent(proposal.financeBufferRate) })}
          value={formatCurrency(totals.buffer)}
        />
        <InfoRow
          label={t('budgetPlan.approver.other')}
          value={
            <>
              {formatCurrency(totals.other)}
              {totals.other !== proposal.otherCosts && (
                <span className='block text-[0.7rem] font-normal text-muted-foreground'>
                  {t('budgetPlan.approver.otherRequested', { amount: formatCurrency(proposal.otherCosts) })}
                </span>
              )}
            </>
          }
        />
        <InfoRow
          label={t('budgetPlan.approver.total')}
          value={<span className='text-sm font-extrabold'>{formatCurrency(totals.total)}</span>}
        />
        <InfoRow label={t('budgetPlan.approver.requestedTotal')} value={formatCurrency(totals.requested)} />
        <InfoRow
          label={t('budgetPlan.approver.previousYear', { year: activeFiscalYear })}
          value={previousTotal !== null ? formatCurrency(previousTotal) : t('budgetPlan.approver.previousNone')}
        />
        {previousTotal !== null && (
          <InfoRow
            label={t('budgetPlan.approver.vsPrevious')}
            value={
              <Pill tone={totals.total > previousTotal ? 'warning' : 'success'}>
                {signed(totals.total - previousTotal, formatCurrency)}
              </Pill>
            }
          />
        )}
      </div>
    </Panel>
  )
}
