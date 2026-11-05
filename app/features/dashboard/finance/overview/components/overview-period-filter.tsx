import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FinanceSelect, FinanceToolbar } from '../../shared/components/finance-ui'
import { overviewPeriodModes, type OverviewPeriod } from '../overview-analytics'

const segmentClass =
  'inline-flex min-h-11 items-center justify-center rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none md:min-h-9'
const segmentIdle =
  'text-muted-foreground hover:bg-surface hover:text-foreground active:bg-primary-soft active:text-primary-ink'
const segmentActive = 'bg-primary text-primary-foreground shadow-[0_1px_2px_0_rgba(0,0,0,0.12)]'
const stepButtonClass =
  'grid size-11 place-items-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-surface-subtle hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none active:bg-primary-soft active:text-primary-ink disabled:cursor-not-allowed disabled:opacity-40 md:size-9'

function Segmented<Value extends string | number>({
  label,
  options,
  value,
  onChange,
  render
}: {
  label: string
  options: readonly Value[]
  value: Value
  onChange: (value: Value) => void
  render: (value: Value) => string
}) {
  return (
    <div
      role='group'
      aria-label={label}
      className='inline-flex gap-1 rounded-lg border border-border/70 bg-surface-subtle p-1'
    >
      {options.map((option) => (
        <button
          key={option}
          type='button'
          aria-pressed={option === value}
          className={`${segmentClass} ${option === value ? segmentActive : segmentIdle}`}
          onClick={() => onChange(option)}
        >
          {render(option)}
        </button>
      ))}
    </div>
  )
}

export function OverviewPeriodFilter({
  period,
  onChange,
  minYear = 2000,
  maxYear = 2200
}: {
  period: OverviewPeriod
  onChange: (period: OverviewPeriod) => void
  minYear?: number
  maxYear?: number
}) {
  const { t: translate, i18n } = useTranslation('finance')
  const monthName = (month: number) =>
    new Intl.DateTimeFormat(i18n.language, { month: 'long' }).format(new Date(2000, month - 1, 1))
  return (
    <FinanceToolbar>
      <div className='space-y-1.5'>
        <span className='block text-sm font-medium'>{translate('analytics.filters.year')}</span>
        <div className='inline-flex items-center gap-1 rounded-lg border border-border/70 bg-surface p-1'>
          <button
            type='button'
            aria-label={translate('analytics.filters.previousYear')}
            disabled={period.year <= minYear}
            className={stepButtonClass}
            onClick={() => onChange({ ...period, year: period.year - 1 })}
          >
            <ChevronLeft aria-hidden className='size-4' strokeWidth={1.5} />
          </button>
          <output aria-live='polite' className='min-w-16 text-center font-mono text-sm font-semibold tabular-nums'>
            {period.year}
          </output>
          <button
            type='button'
            aria-label={translate('analytics.filters.nextYear')}
            disabled={period.year >= maxYear}
            className={stepButtonClass}
            onClick={() => onChange({ ...period, year: period.year + 1 })}
          >
            <ChevronRight aria-hidden className='size-4' strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className='space-y-1.5'>
        <span className='block text-sm font-medium'>{translate('analytics.filters.period')}</span>
        <Segmented
          label={translate('analytics.filters.period')}
          options={overviewPeriodModes}
          value={period.mode}
          onChange={(mode) => onChange({ ...period, mode })}
          render={(mode) => translate(`analytics.modes.${mode}`)}
        />
      </div>
      {period.mode === 'quarter' && (
        <div className='space-y-1.5'>
          <span className='block text-sm font-medium'>{translate('analytics.filters.quarter')}</span>
          <Segmented
            label={translate('analytics.filters.quarter')}
            options={[1, 2, 3, 4] as const}
            value={period.quarter as 1 | 2 | 3 | 4}
            onChange={(quarter) => onChange({ ...period, quarter })}
            render={(quarter) => translate('analytics.quarterShort', { quarter })}
          />
        </div>
      )}
      {period.mode === 'month' && (
        <label className='block w-full space-y-1.5 text-sm font-medium sm:w-48'>
          <span>{translate('analytics.filters.month')}</span>
          <FinanceSelect
            value={period.month}
            onChange={(event) => onChange({ ...period, month: Number(event.target.value) })}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {monthName(index + 1)}
              </option>
            ))}
          </FinanceSelect>
        </label>
      )}
    </FinanceToolbar>
  )
}
