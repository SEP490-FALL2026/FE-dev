import { ArrowLeft, BellRing, CheckCircle2, ChevronRight, Clock, Info, Save } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { financeDemoText } from '../../finance-demo-labels'

import {
  BudgetSnapshotPanel,
  CostEstimatePanel,
  getBorneCost,
  getRemaining,
  useFormatPeriod
} from '../../../budget-figures'
import {
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  inputClassName,
  primaryButtonClassName,
  useDashboardFormat,
  type Tone
} from '../../../dashboard-ui'
import {
  commitmentsToRecord,
  currentPeriod,
  findBudgetLine,
  type BudgetOpinion,
  type CommitmentToRecord
} from '../../finance-data'
import type { FinanceTabKey } from '../../finance-nav'
import {
  FinanceCommitmentFilters,
  defaultCommitmentFilters,
  isCommitmentOverdue,
  matchesCommitmentFilters,
  type CommitmentFilters
} from '../components/finance-commitments-filters'
import { UnpaidCommitmentsPanel } from '../components/unpaid-commitments-panel'

interface RecordedCommitment {
  commitment: CommitmentToRecord
  note: string
  opinion: BudgetOpinion
}

const opinionTones: Record<BudgetOpinion, Tone> = { NO_BUDGET: 'warning', OVER: 'danger', WITHIN: 'success' }

/**
 * FIN-20 → FIN-21: the queue opens first; choosing a commitment opens its own recording screen (`id` search param).
 * The view stays mounted while switching between the two, so the queue and recorded items survive the round trip.
 */
export function FinanceCommitmentsView({
  commitmentId,
  formatCurrency,
  onSelectTab
}: {
  commitmentId?: string
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const [queue, setQueue] = useState(commitmentsToRecord)
  const [recorded, setRecorded] = useState<RecordedCommitment[]>([])
  const [filters, setFilters] = useState<CommitmentFilters>(defaultCommitmentFilters)
  const selected = queue.find((item) => item.id === commitmentId)

  const record = (entry: RecordedCommitment) => {
    setRecorded((current) => [...current, entry])
    setQueue((current) => current.filter((item) => item.id !== entry.commitment.id))
    onSelectTab('commitments')
  }

  if (selected) {
    return (
      <CommitmentDetail
        commitment={selected}
        formatCurrency={formatCurrency}
        key={selected.id}
        onBack={() => onSelectTab('commitments')}
        onRecord={record}
      />
    )
  }

  return (
    <CommitmentQueue
      filters={filters}
      formatCurrency={formatCurrency}
      onFiltersChange={setFilters}
      onOpen={(id) => onSelectTab('commitments', { id })}
      queue={queue}
      recorded={recorded}
    />
  )
}

function CommitmentQueue({
  filters,
  formatCurrency,
  onFiltersChange,
  onOpen,
  queue,
  recorded
}: {
  filters: CommitmentFilters
  formatCurrency: (value: number) => string
  onFiltersChange: (filters: CommitmentFilters) => void
  onOpen: (id: string) => void
  queue: CommitmentToRecord[]
  recorded: RecordedCommitment[]
}) {
  const { t } = useTranslation('dashboard')
  const formatPeriod = useFormatPeriod()
  const { formatDate } = useDashboardFormat()
  const lastRecorded = recorded.at(-1)
  const visible = queue.filter((item) => matchesCommitmentFilters(item, filters))

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('finance.commitments.subtitle')} title={t('finance.commitments.title')} />

      <Notice icon={Info} tone='info'>
        {t('finance.commitments.ruleNotice')}
      </Notice>

      {lastRecorded && (
        <Notice
          icon={lastRecorded.opinion === 'WITHIN' ? CheckCircle2 : BellRing}
          tone={lastRecorded.opinion === 'WITHIN' ? 'success' : 'warning'}
        >
          {lastRecorded.opinion === 'WITHIN'
            ? t('finance.commitments.recordedWithin', { code: lastRecorded.commitment.code })
            : t('finance.commitments.recordedNotified', { code: lastRecorded.commitment.code })}
        </Notice>
      )}

      <FinanceCommitmentFilters applied={filters} onApply={onFiltersChange} queue={queue} />

      <Panel>
        <PanelTitle hint={t('finance.commitments.queueHint')} title={t('finance.commitments.queueTitle')} />
        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-200 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('finance.commitments.colCommitment')}</th>
                <th className='py-2.5 font-semibold'>{t('finance.commitments.colRequest')}</th>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.borneCost')}</th>
                <th className='py-2.5 pl-6 font-semibold'>{t('finance.commitments.colBudget')}</th>
                <th className='py-2.5 font-semibold'>{t('finance.commitments.colDue')}</th>
                <th className='py-2.5'>
                  <span className='sr-only'>{t('finance.commitments.openDetail')}</span>
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {visible.map((item) => {
                const isOverdue = isCommitmentOverdue(item)

                return (
                  <tr
                    className='cursor-pointer transition hover:bg-surface-subtle/60'
                    key={item.id}
                    onClick={() => onOpen(item.id)}
                  >
                    <td className='py-3 font-mono font-bold text-primary'>{item.code}</td>
                    <td className='py-3'>
                      <p className='font-semibold text-foreground'>{financeDemoText(item.software)}</p>
                      <p className='text-[0.7rem] text-muted-foreground'>
                        {item.requestCode} · {t('finance.commitments.approvedBy', { name: item.approvedBy })}
                      </p>
                    </td>
                    <td className='py-3 font-mono'>
                      {item.costCenter} · {formatPeriod(currentPeriod)}
                    </td>
                    <td className='py-3 text-right font-bold'>{formatCurrency(getBorneCost(item.estimate))}</td>
                    <td className='py-3 pl-6'>
                      {item.budgetAttached ? (
                        <Pill tone='success'>{t('finance.commitments.attached')}</Pill>
                      ) : (
                        <Pill tone='warning'>{t('budget.noBudget')}</Pill>
                      )}
                    </td>
                    <td className='py-3'>
                      <span
                        className={`flex items-center gap-1 ${isOverdue ? 'font-bold text-danger' : 'text-muted-foreground'}`}
                      >
                        <Clock aria-hidden='true' className='size-3.5' />
                        {isOverdue ? t('finance.commitments.overdue') : formatDate(item.recordingDueAt)}
                      </span>
                    </td>
                    <td className='py-3 text-right'>
                      <button
                        aria-label={t('finance.commitments.openDetailFor', { code: item.code })}
                        className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                        onClick={(event) => {
                          event.stopPropagation()
                          onOpen(item.id)
                        }}
                        type='button'
                      >
                        {t('finance.commitments.openDetail')}
                        <ChevronRight aria-hidden='true' className='size-3.5' />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {visible.length === 0 && (
                <tr>
                  <td className='py-8 text-center text-muted-foreground' colSpan={7}>
                    {queue.length === 0
                      ? t('finance.commitments.emptyQueue')
                      : t('budgetPlan.filtersSpend.commitments.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <UnpaidCommitmentsPanel formatCurrency={formatCurrency} />

      {recorded.length > 0 && (
        <Panel>
          <PanelTitle title={t('finance.commitments.recordedTitle')} />
          <ul className='mt-3 divide-y divide-border text-xs'>
            {recorded.map(({ commitment, opinion }) => (
              <li className='flex flex-wrap items-center justify-between gap-2 py-2.5' key={commitment.id}>
                <span>
                  <span className='font-mono font-bold text-primary'>{commitment.code}</span>
                  <span className='ml-2 text-foreground'>{financeDemoText(commitment.software)}</span>
                </span>
                <span className='flex flex-wrap items-center gap-2'>
                  <Pill tone={opinionTones[opinion]}>{t(`finance.opinion.${opinion}`)}</Pill>
                  {!commitment.budgetAttached && (
                    <Pill tone='neutral'>{t('finance.commitments.awaitingBackfill')}</Pill>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  )
}

function CommitmentDetail({
  commitment,
  formatCurrency,
  onBack,
  onRecord
}: {
  commitment: CommitmentToRecord
  formatCurrency: (value: number) => string
  onBack: () => void
  onRecord: (entry: RecordedCommitment) => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const [opinion, setOpinion] = useState<BudgetOpinion | null>(null)
  const [note, setNote] = useState('')
  const [showError, setShowError] = useState(false)

  const snapshot = findBudgetLine(commitment.costCenter)
  const remaining = snapshot ? getRemaining(snapshot) : null
  const suggested: BudgetOpinion =
    !commitment.budgetAttached || remaining === null ? 'NO_BUDGET' : remaining >= 0 ? 'WITHIN' : 'OVER'
  const effectiveOpinion: BudgetOpinion | null = commitment.budgetAttached ? opinion : 'NO_BUDGET'
  const isOverdue = isCommitmentOverdue(commitment)

  const record = () => {
    if (!effectiveOpinion) {
      setShowError(true)
      return
    }
    onRecord({ commitment, note: note.trim(), opinion: effectiveOpinion })
  }

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={onBack}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('finance.commitments.backToList')}
      </button>

      <PageHeader
        actions={
          <Pill tone={isOverdue ? 'danger' : 'neutral'}>
            {isOverdue
              ? t('finance.commitments.overdue')
              : t('finance.commitments.dueAt', { time: formatDate(commitment.recordingDueAt) })}
          </Pill>
        }
        subtitle={`${commitment.requestCode} · ${t('finance.commitments.approvedBy', { name: commitment.approvedBy })} · ${formatDate(commitment.approvedAt)}`}
        title={financeDemoText(commitment.software)}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'>
        <Panel>
          <PanelTitle title={t('finance.commitments.figuresTitle')} />
          <div className='mt-4 space-y-3'>
            {snapshot && <BudgetSnapshotPanel formatCurrency={formatCurrency} snapshot={snapshot} />}
            <CostEstimatePanel estimate={commitment.estimate} formatCurrency={formatCurrency} />
          </div>
        </Panel>

        <Panel className='h-fit xl:sticky xl:top-0'>
          <form
            className='space-y-4'
            onSubmit={(event) => {
              event.preventDefault()
              record()
            }}
          >
            <fieldset>
              <legend className='text-sm font-bold text-foreground'>{t('finance.commitments.opinionLegend')}</legend>
              <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                {t('finance.questions.suggested', { opinion: t(`finance.opinion.${suggested}`) })}
              </p>
              <div className='mt-3 space-y-2'>
                {(['WITHIN', 'OVER', 'NO_BUDGET'] as const).map((value) => {
                  const disabled = !commitment.budgetAttached && value !== 'NO_BUDGET'

                  return (
                    <label
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                        effectiveOpinion === value ? 'border-primary bg-primary-soft/40' : 'border-border'
                      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-primary/40'}`}
                      key={value}
                    >
                      <input
                        checked={effectiveOpinion === value}
                        className='accent-primary'
                        disabled={disabled}
                        name='commitment-opinion'
                        onChange={() => setOpinion(value)}
                        type='radio'
                      />
                      <span className='flex-1'>{t(`finance.opinion.${value}`)}</span>
                      {value !== 'WITHIN' && (
                        <Pill tone={opinionTones[value]}>{t('finance.commitments.notifies')}</Pill>
                      )}
                    </label>
                  )
                })}
              </div>
              {!commitment.budgetAttached && (
                <p className='mt-2 text-[0.7rem] text-muted-foreground'>{t('finance.commitments.noBudgetLocked')}</p>
              )}
              {showError && !effectiveOpinion && (
                <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                  {t('finance.questions.opinionRequired')}
                </p>
              )}
            </fieldset>

            <div>
              <label className='text-xs font-bold text-foreground' htmlFor='commitment-note'>
                {t('finance.commitments.noteLabel')}
              </label>
              <textarea
                className={`${inputClassName} mt-2 min-h-20`}
                id='commitment-note'
                onChange={(event) => setNote(event.target.value)}
                value={note}
              />
            </div>

            <button className={`${primaryButtonClassName} w-full`} type='submit'>
              <Save aria-hidden='true' className='size-3.5' />
              {t('finance.commitments.submit')}
            </button>
            <p className='text-[0.7rem] text-muted-foreground'>{t('finance.commitments.sodNote')}</p>
          </form>
        </Panel>
      </div>
    </div>
  )
}
