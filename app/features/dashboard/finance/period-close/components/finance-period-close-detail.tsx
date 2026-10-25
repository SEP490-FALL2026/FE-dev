import { ArrowLeft, Building2, CheckCircle2, Lock, Plus, Unlock, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { financeDemoText } from '../../finance-demo-labels'

import { useFormatPeriod } from '../../../budget-figures'
import {
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  StatTile,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat
} from '../../../dashboard-ui'
import { closingPeriod, type CostCenter, type InternalCost } from '../../finance-data'
import { financeUser, summarizeCostCenterClose, type CostCenterClosure } from '../../period-close-data'

interface FinancePeriodCloseDetailProps {
  closures: Record<string, CostCenterClosure>
  costCenter: CostCenter
  costs: InternalCost[]
  formatCurrency: (value: number) => string
  onAddCost: (cost: Omit<InternalCost, 'id'>) => void
  onBack: () => void
  onClose: (closure: CostCenterClosure) => void
  onRelease: (id: string, reason: string) => void
  released: Record<string, string>
}

/** FIN-30/31 for one Cost Center: release held remainders, record internal costs, then close the line. */
export function FinancePeriodCloseDetail({
  closures,
  costCenter,
  costs,
  formatCurrency,
  onAddCost,
  onBack,
  onClose,
  onRelease,
  released
}: FinancePeriodCloseDetailProps) {
  const { t } = useTranslation('dashboard')
  const formatPeriod = useFormatPeriod()
  const { formatDate } = useDashboardFormat()
  const [releasingId, setReleasingId] = useState<string | null>(null)
  const [releaseReason, setReleaseReason] = useState('')
  const [showReasonError, setShowReasonError] = useState(false)
  const [draft, setDraft] = useState({ amount: '', description: '' })
  const [showCostErrors, setShowCostErrors] = useState(false)
  const [reviewed, setReviewed] = useState(false)

  const code = costCenter.code
  const summary = summarizeCostCenterClose(code, released, costs, closures)
  const closure = closures[code]
  const isClosed = Boolean(closure)
  const draftAmount = Number(draft.amount.replace(/\D/g, ''))

  const confirmRelease = () => {
    if (!releasingId) return
    if (releaseReason.trim().length === 0) {
      setShowReasonError(true)
      return
    }
    onRelease(releasingId, releaseReason.trim())
    setReleasingId(null)
    setReleaseReason('')
    setShowReasonError(false)
  }

  const addCost = () => {
    if (!draft.description.trim() || draftAmount <= 0) {
      setShowCostErrors(true)
      return
    }
    onAddCost({ amount: draftAmount, costCenter: code, description: draft.description.trim() })
    setDraft({ amount: '', description: '' })
    setShowCostErrors(false)
  }

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={onBack}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('finance.close.backToList')}
      </button>

      <PageHeader
        actions={
          <Pill tone={isClosed ? 'success' : summary.status === 'BLOCKED' ? 'warning' : 'info'}>
            {t(`finance.close.status.${summary.status}`)}
          </Pill>
        }
        subtitle={t('finance.close.detailSubtitle', { name: costCenter.name })}
        title={t('finance.close.detailTitle', { code, period: formatPeriod(closingPeriod) })}
      />

      <section aria-label={t('finance.close.summaryLabel')} className='grid gap-4 sm:grid-cols-3'>
        <StatTile icon={Building2} label={t('finance.close.periodCost')} value={formatCurrency(summary.periodCost)} />
        <StatTile
          icon={Wallet}
          label={t('budget.budget')}
          tone='info'
          value={summary.budget === null ? t('budget.noBudget') : formatCurrency(summary.budget)}
        />
        <StatTile
          icon={Unlock}
          label={t('finance.close.heldRemainder')}
          tone='warning'
          value={formatCurrency(summary.heldAmount)}
        />
      </section>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]'>
        <div className='space-y-6'>
          <Panel>
            <PanelTitle hint={t('finance.close.remaindersHint')} title={t('finance.close.remaindersTitle')} />
            {summary.remainders.length === 0 ? (
              <p className='mt-4 text-xs text-muted-foreground'>{t('finance.close.noRemainders')}</p>
            ) : (
              <ul className='mt-4 divide-y divide-border text-xs'>
                {summary.remainders.map((item) => {
                  const releaseReasonText = released[item.id]

                  return (
                    <li className='flex flex-wrap items-center justify-between gap-3 py-3' key={item.id}>
                      <div className='min-w-0'>
                        <p className='font-mono font-bold text-primary'>{item.code}</p>
                        <p className='text-[0.7rem] text-muted-foreground'>
                          {item.requestCode} · {item.software}
                        </p>
                        <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                          {t('finance.close.remainderFigures', {
                            committed: formatCurrency(item.committed),
                            invoiced: formatCurrency(item.invoiced)
                          })}
                        </p>
                      </div>
                      <div className='flex flex-wrap items-center gap-2'>
                        {item.moreInvoicesExpected ? (
                          <Pill tone='info'>{t('finance.close.moreExpected')}</Pill>
                        ) : (
                          <Pill tone='neutral'>
                            {item.lastInvoiceAt
                              ? t('finance.close.noMoreInvoices', { date: formatDate(item.lastInvoiceAt) })
                              : t('finance.close.noInvoice')}
                          </Pill>
                        )}
                        <span className='font-bold text-warning'>
                          {releaseReasonText ? '—' : formatCurrency(item.committed - item.invoiced)}
                        </span>
                        {releaseReasonText ? (
                          <Pill tone='success'>{t('finance.close.released')}</Pill>
                        ) : (
                          <button
                            className='inline-flex items-center gap-1 font-bold text-primary hover:underline disabled:text-muted-foreground disabled:no-underline'
                            disabled={item.moreInvoicesExpected || isClosed}
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
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}

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
                    code: summary.remainders.find((item) => item.id === releasingId)?.code ?? ''
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
            {summary.internal.length === 0 ? (
              <p className='mt-4 text-xs text-muted-foreground'>{t('finance.close.noInternal')}</p>
            ) : (
              <ul className='mt-4 divide-y divide-border text-xs'>
                {summary.internal.map((cost) => (
                  <li className='flex flex-wrap items-center justify-between gap-2 py-2.5' key={cost.id}>
                    <span className='font-semibold text-foreground'>{financeDemoText(cost.description)}</span>
                    <span className='font-bold'>{formatCurrency(cost.amount)}</span>
                  </li>
                ))}
              </ul>
            )}

            {!isClosed && (
              <form
                className='mt-4 grid gap-3 rounded-xl border border-border bg-background p-4 md:grid-cols-[2fr_1fr_auto]'
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
                <button className={primaryButtonClassName} type='submit'>
                  <Plus aria-hidden='true' className='size-3.5' />
                  {t('finance.close.addInternal')}
                </button>
              </form>
            )}
            {showCostErrors && (
              <p className='mt-2 text-[0.7rem] font-semibold text-danger' role='alert'>
                {t('finance.close.internalRequired')}
              </p>
            )}
          </Panel>
        </div>

        <Panel className='h-fit'>
          <PanelTitle hint={t('finance.close.checklistHint')} title={t('finance.close.checklistTitle')} />
          {closure ? (
            <div className='mt-4'>
              <Notice icon={Lock} tone='success'>
                {t('finance.close.closed', { name: closure.closedBy, time: formatDate(closure.closedAt) })}
              </Notice>
            </div>
          ) : (
            <div className='mt-4 space-y-3 text-xs'>
              <p className='flex items-start gap-2'>
                <CheckCircle2
                  aria-hidden='true'
                  className={`mt-0.5 size-4 shrink-0 ${summary.toRelease.length === 0 ? 'text-success' : 'text-muted-foreground'}`}
                />
                {summary.toRelease.length === 0
                  ? t('finance.close.checkReleased')
                  : t('finance.close.checkToRelease', { count: summary.toRelease.length })}
              </p>
              {summary.carriedOver.length > 0 && (
                <p className='flex items-start gap-2 text-muted-foreground'>
                  <CheckCircle2 aria-hidden='true' className='mt-0.5 size-4 shrink-0 text-info' />
                  {t('finance.close.checkCarried', { count: summary.carriedOver.length })}
                </p>
              )}
              <label className='flex items-start gap-2 font-semibold'>
                <input
                  checked={reviewed}
                  className='mt-0.5 accent-primary'
                  onChange={(event) => setReviewed(event.target.checked)}
                  type='checkbox'
                />
                {t('finance.close.checkReviewed')}
              </label>
              <button
                className={`${primaryButtonClassName} w-full`}
                disabled={summary.status === 'BLOCKED' || !reviewed}
                onClick={() => onClose({ closedAt: new Date().toISOString(), closedBy: financeUser })}
                type='button'
              >
                <Lock aria-hidden='true' className='size-3.5' />
                {t('finance.close.closeCostCenter', { code })}
              </button>
              {summary.status === 'BLOCKED' && (
                <p className='text-[0.7rem] text-muted-foreground'>{t('finance.close.closeBlocked')}</p>
              )}
              <p className='text-[0.7rem] text-muted-foreground'>{t('finance.close.noLockNote')}</p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
