import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Pill, type Tone } from '../../dashboard-ui'
import {
  currentPeriodOf,
  getTiming,
  granularities,
  listPeriods,
  type BudgetPeriod,
  type PeriodGranularity,
  type PeriodTiming
} from '../budget-periods'

const timingTones: Record<PeriodTiming, Tone> = { CURRENT: 'primary', FUTURE: 'info', PAST: 'neutral' }

/**
 * Month / quarter / year selection; switching the granularity jumps to the period holding the current month.
 * `initialKey` opens on another period of the initial granularity (e.g. the reported quarter).
 */
export function useBudgetPeriod(initial: PeriodGranularity = 'QUARTER', initialKey?: string) {
  const { t } = useTranslation('dashboard')
  const [granularity, setGranularity] = useState<PeriodGranularity>(initial)
  const [periodKey, setPeriodKey] = useState(initialKey ?? currentPeriodOf(initial).key)

  const periods = listPeriods(granularity)
  const period = periods.find((item) => item.key === periodKey) ?? currentPeriodOf(granularity)
  const periodLabel = (item: BudgetPeriod) =>
    t(`finance.budgets.periodName.${item.granularity}`, { number: item.number, year: item.year })

  const changeGranularity = (next: PeriodGranularity) => {
    setGranularity(next)
    setPeriodKey(currentPeriodOf(next).key)
  }

  return { changeGranularity, granularity, period, periodLabel, periods, setPeriodKey }
}

export function BudgetPeriodFilter({
  changeGranularity,
  granularity,
  period,
  periodLabel,
  periods,
  setPeriodKey
}: ReturnType<typeof useBudgetPeriod>) {
  const { t } = useTranslation('dashboard')
  const selectId = useId()
  const timing = getTiming(period)

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div
        aria-label={t('finance.budgets.granularityLabel')}
        className='inline-flex rounded-lg border border-border bg-surface p-0.5'
        role='group'
      >
        {granularities.map((value) => (
          <button
            aria-pressed={granularity === value}
            className={`rounded-md px-3 py-1 text-xs font-bold transition ${
              granularity === value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            key={value}
            onClick={() => changeGranularity(value)}
            type='button'
          >
            {t(`finance.budgets.periodTypes.${value}`)}
          </button>
        ))}
      </div>
      <label className='sr-only' htmlFor={selectId}>
        {t('finance.budgets.periodLabel')}
      </label>
      <select
        className='h-8 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary-soft disabled:opacity-70'
        disabled={periods.length === 1}
        id={selectId}
        onChange={(event) => setPeriodKey(event.target.value)}
        title={t('finance.budgets.periodNote')}
        value={period.key}
      >
        {periods.map((item) => (
          <option key={item.key} value={item.key}>
            {periodLabel(item)}
          </option>
        ))}
      </select>
      <Pill tone={timingTones[timing]}>{t(`finance.budgets.timing.${timing}`)}</Pill>
    </div>
  )
}
