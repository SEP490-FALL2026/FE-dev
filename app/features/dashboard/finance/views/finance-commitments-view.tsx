import { BellRing, CheckCircle2, Clock, Info, Save } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BudgetSnapshotPanel, CostEstimatePanel, getBorneCost, getRemaining } from '../../budget-figures'
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
} from '../../dashboard-ui'
import {
  commitmentsToRecord,
  currentPeriod,
  financeDataAsOf,
  findBudgetLine,
  type BudgetOpinion,
  type CommitmentToRecord
} from '../finance-data'

interface RecordedCommitment {
  commitment: CommitmentToRecord
  note: string
  opinion: BudgetOpinion
}

const opinionTones: Record<BudgetOpinion, Tone> = { NO_BUDGET: 'warning', OVER: 'danger', WITHIN: 'success' }

export function FinanceCommitmentsView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { formatDateTime, formatPeriod } = useDashboardFormat()
  const [queue, setQueue] = useState(commitmentsToRecord)
  const [recorded, setRecorded] = useState<RecordedCommitment[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(commitmentsToRecord[0]?.id ?? null)
  const [opinion, setOpinion] = useState<BudgetOpinion | null>(null)
  const [note, setNote] = useState('')
  const [showError, setShowError] = useState(false)

  const selected = queue.find((item) => item.id === selectedId) ?? null
  const snapshot = selected ? findBudgetLine(selected.costCenter) : undefined
  const effectiveOpinion: BudgetOpinion | null = selected && !selected.budgetAttached ? 'NO_BUDGET' : opinion
  const lastRecorded = recorded.at(-1)

  const selectItem = (id: string) => {
    setSelectedId(id)
    setOpinion(null)
    setNote('')
    setShowError(false)
  }

  const record = () => {
    if (!selected || !effectiveOpinion) {
      setShowError(true)
      return
    }
    const nextQueue = queue.filter((item) => item.id !== selected.id)
    setRecorded((current) => [...current, { commitment: selected, note: note.trim(), opinion: effectiveOpinion }])
    setQueue(nextQueue)
    setSelectedId(nextQueue[0]?.id ?? null)
    setOpinion(null)
    setNote('')
    setShowError(false)
  }

  const suggestedFor = (item: CommitmentToRecord): BudgetOpinion => {
    const line = findBudgetLine(item.costCenter)
    const remaining = line ? getRemaining(line) : null
    if (!item.budgetAttached || remaining === null) return 'NO_BUDGET'
    return remaining >= 0 ? 'WITHIN' : 'OVER'
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        code='UF-11 · FIN-20 → FIN-21'
        subtitle={t('finance.commitments.subtitle')}
        title={t('finance.commitments.title')}
      />

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

      <Panel>
        <PanelTitle hint={t('finance.commitments.queueHint')} title={t('finance.commitments.queueTitle')} />
        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-184 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('finance.commitments.colCommitment')}</th>
                <th className='py-2.5 font-semibold'>{t('finance.commitments.colRequest')}</th>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.borneCost')}</th>
                <th className='py-2.5 font-semibold'>{t('finance.commitments.colBudget')}</th>
                <th className='py-2.5 font-semibold'>{t('finance.commitments.colDue')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {queue.map((item) => {
                const isOverdue = item.recordingDueAt <= financeDataAsOf

                return (
                  <tr
                    aria-selected={item.id === selectedId}
                    className={`cursor-pointer transition hover:bg-surface-subtle/60 ${item.id === selectedId ? 'bg-primary-soft/30' : ''}`}
                    key={item.id}
                    onClick={() => selectItem(item.id)}
                  >
                    <td className='py-3'>
                      <button
                        className='font-mono font-bold text-primary hover:underline'
                        onClick={() => selectItem(item.id)}
                        type='button'
                      >
                        {item.code}
                      </button>
                    </td>
                    <td className='py-3'>
                      <p className='font-semibold text-foreground'>{item.software}</p>
                      <p className='text-[0.7rem] text-muted-foreground'>
                        {item.requestCode} · {t('finance.commitments.approvedBy', { name: item.approvedBy })}
                      </p>
                    </td>
                    <td className='py-3 font-mono'>
                      {item.costCenter} · {formatPeriod(currentPeriod)}
                    </td>
                    <td className='py-3 text-right font-bold'>{formatCurrency(getBorneCost(item.estimate))}</td>
                    <td className='py-3'>
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
                        {isOverdue ? t('finance.commitments.overdue') : formatDateTime(item.recordingDueAt)}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {queue.length === 0 && (
                <tr>
                  <td className='py-8 text-center text-muted-foreground' colSpan={6}>
                    {t('finance.commitments.emptyQueue')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {selected && snapshot && (
        <Panel>
          <PanelTitle
            hint={`${selected.code} · ${selected.requestCode} · ${formatDateTime(selected.approvedAt)}`}
            title={t('finance.commitments.recordTitle', { software: selected.software })}
          />
          <div className='mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_1.1fr]'>
            <BudgetSnapshotPanel formatCurrency={formatCurrency} snapshot={snapshot} />
            <CostEstimatePanel estimate={selected.estimate} formatCurrency={formatCurrency} />

            <form
              className='space-y-4 rounded-xl border border-border p-4'
              onSubmit={(event) => {
                event.preventDefault()
                record()
              }}
            >
              <fieldset>
                <legend className='text-xs font-bold text-foreground'>{t('finance.commitments.opinionLegend')}</legend>
                <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                  {t('finance.questions.suggested', { opinion: t(`finance.opinion.${suggestedFor(selected)}`) })}
                </p>
                <div className='mt-2 space-y-2'>
                  {(['WITHIN', 'OVER', 'NO_BUDGET'] as const).map((value) => {
                    const disabled = !selected.budgetAttached && value !== 'NO_BUDGET'

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
                {!selected.budgetAttached && (
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
          </div>
        </Panel>
      )}

      {recorded.length > 0 && (
        <Panel>
          <PanelTitle title={t('finance.commitments.recordedTitle')} />
          <ul className='mt-3 divide-y divide-border text-xs'>
            {recorded.map(({ commitment, opinion: recordedOpinion }) => (
              <li className='flex flex-wrap items-center justify-between gap-2 py-2.5' key={commitment.id}>
                <span>
                  <span className='font-mono font-bold text-primary'>{commitment.code}</span>
                  <span className='ml-2 text-foreground'>{commitment.software}</span>
                </span>
                <span className='flex flex-wrap items-center gap-2'>
                  <Pill tone={opinionTones[recordedOpinion]}>{t(`finance.opinion.${recordedOpinion}`)}</Pill>
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
