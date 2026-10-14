import { ArrowRight, Building2, CheckCircle2, FileCheck2, Plus, Unlock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  StatTile,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat
} from '../../dashboard-ui'
import {
  closingPeriod,
  costCenters,
  heldRemainders,
  internalCosts,
  periodCloseSummary,
  type InternalCost
} from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'

interface FinancePeriodCloseViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey) => void
}

export function FinancePeriodCloseView({ formatCurrency, onSelectTab }: FinancePeriodCloseViewProps) {
  const { t } = useTranslation('dashboard')
  const { formatDate, formatNumber } = useDashboardFormat()
  const [released, setReleased] = useState<Record<string, string>>({})
  const [releasingId, setReleasingId] = useState<string | null>(null)
  const [releaseReason, setReleaseReason] = useState('')
  const [showReasonError, setShowReasonError] = useState(false)
  const [costs, setCosts] = useState<InternalCost[]>(internalCosts)
  const [draft, setDraft] = useState({ amount: '', costCenter: '', description: '' })
  const [showCostErrors, setShowCostErrors] = useState(false)

  const activeCenters = costCenters.filter((cc) => cc.status === 'ACTIVE')
  const draftAmount = Number(draft.amount.replace(/\D/g, ''))

  const confirmRelease = () => {
    if (!releasingId) return
    if (releaseReason.trim().length === 0) {
      setShowReasonError(true)
      return
    }
    setReleased((current) => ({ ...current, [releasingId]: releaseReason.trim() }))
    setReleasingId(null)
    setReleaseReason('')
    setShowReasonError(false)
  }

  const addCost = () => {
    if (!draft.description.trim() || draftAmount <= 0 || !draft.costCenter) {
      setShowCostErrors(true)
      return
    }
    setCosts((current) => [
      ...current,
      {
        amount: draftAmount,
        costCenter: draft.costCenter,
        description: draft.description.trim(),
        id: `int-${current.length + 1}`
      }
    ])
    setDraft({ amount: '', costCenter: '', description: '' })
    setShowCostErrors(false)
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        actions={
          <button className={primaryButtonClassName} onClick={() => onSelectTab('cost-analysis')} type='button'>
            {t('finance.close.toAllocation')}
            <ArrowRight aria-hidden='true' className='size-3.5' />
          </button>
        }
        code='UF-19 · FIN-30 → FIN-31'
        subtitle={t('finance.close.subtitle', { period: closingPeriod })}
        title={t('finance.close.title', { period: closingPeriod })}
      />

      <section aria-label={t('finance.close.summaryLabel')} className='grid gap-4 sm:grid-cols-3'>
        <StatTile
          hint={t('finance.close.convertedHint')}
          icon={FileCheck2}
          label={t('finance.close.matchedInvoices')}
          tone='success'
          value={formatNumber(periodCloseSummary.matchedInvoices)}
        />
        <StatTile
          icon={CheckCircle2}
          label={t('finance.close.convertedToCost')}
          tone='primary'
          value={formatCurrency(periodCloseSummary.convertedToCost)}
        />
        <StatTile
          icon={Unlock}
          label={t('finance.close.remainders')}
          tone='warning'
          value={String(heldRemainders.length - Object.keys(released).length)}
        />
      </section>

      <Panel>
        <PanelTitle hint={t('finance.close.remaindersHint')} title={t('finance.close.remaindersTitle')} />
        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-184 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('finance.commitments.colCommitment')}</th>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.close.committed')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.close.invoiced')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.close.heldRemainder')}</th>
                <th className='py-2.5 font-semibold'>{t('finance.close.invoiceOutlook')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('finance.budgets.colAction')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {heldRemainders.map((item) => {
                const releaseReasonText = released[item.id]

                return (
                  <tr key={item.id}>
                    <td className='py-3'>
                      <p className='font-mono font-bold text-primary'>{item.code}</p>
                      <p className='text-[0.7rem] text-muted-foreground'>
                        {item.requestCode} · {item.software}
                      </p>
                    </td>
                    <td className='py-3 font-mono'>{item.costCenter}</td>
                    <td className='py-3 text-right'>{formatCurrency(item.committed)}</td>
                    <td className='py-3 text-right'>{formatCurrency(item.invoiced)}</td>
                    <td className='py-3 text-right font-bold text-warning'>
                      {releaseReasonText ? '—' : formatCurrency(item.committed - item.invoiced)}
                    </td>
                    <td className='py-3'>
                      {item.moreInvoicesExpected ? (
                        <Pill tone='info'>{t('finance.close.moreExpected')}</Pill>
                      ) : (
                        <Pill tone='neutral'>
                          {item.lastInvoiceAt
                            ? t('finance.close.noMoreInvoices', { date: formatDate(item.lastInvoiceAt) })
                            : t('finance.close.noInvoice')}
                        </Pill>
                      )}
                    </td>
                    <td className='py-3 text-right'>
                      {releaseReasonText ? (
                        <Pill tone='success'>{t('finance.close.released')}</Pill>
                      ) : (
                        <button
                          className='inline-flex items-center gap-1 font-bold text-primary hover:underline disabled:text-muted-foreground disabled:no-underline'
                          disabled={item.moreInvoicesExpected}
                          onClick={() => {
                            setReleasingId(item.id)
                            setReleaseReason('')
                            setShowReasonError(false)
                          }}
                          title={item.moreInvoicesExpected ? t('finance.close.releaseDisabled') : undefined}
                          type='button'
                        >
                          <Unlock aria-hidden='true' className='size-3.5' />
                          {t('finance.close.release')}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {releasingId && (
          <form
            className='mt-4 space-y-2 rounded-xl border border-primary/40 bg-background p-4'
            onSubmit={(event) => {
              event.preventDefault()
              confirmRelease()
            }}
          >
            <label className='text-xs font-bold' htmlFor='release-reason'>
              {t('finance.close.releaseReason', {
                code: heldRemainders.find((item) => item.id === releasingId)?.code ?? ''
              })}
            </label>
            <textarea
              className={`${inputClassName} min-h-20`}
              id='release-reason'
              onChange={(event) => setReleaseReason(event.target.value)}
              value={releaseReason}
            />
            {showReasonError && (
              <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
                {t('finance.close.releaseReasonRequired')}
              </p>
            )}
            <div className='flex gap-2'>
              <button className={primaryButtonClassName} type='submit'>
                {t('finance.close.confirmRelease')}
              </button>
              <button className={secondaryButtonClassName} onClick={() => setReleasingId(null)} type='button'>
                {t('ui.cancel')}
              </button>
            </div>
            <p className='text-[0.7rem] text-muted-foreground'>{t('finance.close.auditNote')}</p>
          </form>
        )}
      </Panel>

      <Panel>
        <PanelTitle hint={t('finance.close.internalHint')} title={t('finance.close.internalTitle')} />
        <ul className='mt-4 divide-y divide-border text-xs'>
          {costs.map((cost) => (
            <li className='flex flex-wrap items-center justify-between gap-2 py-2.5' key={cost.id}>
              <span className='flex items-center gap-2'>
                <Building2 aria-hidden='true' className='size-3.5 text-muted-foreground' />
                <span className='font-semibold text-foreground'>{cost.description}</span>
              </span>
              <span className='flex items-center gap-3'>
                <span className='font-mono text-muted-foreground'>{cost.costCenter}</span>
                <span className='font-bold'>{formatCurrency(cost.amount)}</span>
              </span>
            </li>
          ))}
        </ul>

        <form
          className='mt-4 grid gap-3 rounded-xl border border-border bg-background p-4 md:grid-cols-[2fr_1fr_1fr_auto]'
          onSubmit={(event) => {
            event.preventDefault()
            addCost()
          }}
        >
          <input
            aria-label={t('finance.close.internalDescription')}
            className={inputClassName}
            onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
            placeholder={t('finance.close.internalDescription')}
            value={draft.description}
          />
          <input
            aria-label={t('finance.close.internalAmount')}
            className={inputClassName}
            inputMode='numeric'
            onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))}
            placeholder={t('finance.close.internalAmount')}
            value={draft.amount}
          />
          <select
            aria-label={t('budget.costCenter')}
            className={inputClassName}
            onChange={(event) => setDraft((current) => ({ ...current, costCenter: event.target.value }))}
            value={draft.costCenter}
          >
            <option value=''>{t('finance.close.pickCostCenter')}</option>
            {activeCenters.map((cc) => (
              <option key={cc.code} value={cc.code}>
                {cc.code} · {cc.name}
              </option>
            ))}
          </select>
          <button className={primaryButtonClassName} type='submit'>
            <Plus aria-hidden='true' className='size-3.5' />
            {t('finance.close.addInternal')}
          </button>
        </form>
        {showCostErrors && (
          <p className='mt-2 text-[0.7rem] font-semibold text-danger' role='alert'>
            {t('finance.close.internalRequired')}
          </p>
        )}
      </Panel>
    </div>
  )
}
