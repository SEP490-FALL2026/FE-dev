import { useTranslation } from 'react-i18next'
import { ManagerMoney } from '../../shared/components/manager-api-ui'
import { calculateBudgetShares, isNegativeBudgetMoney, type BudgetMoney } from '../budget-shares'

export function ManagerBudgetUsage({
  total,
  spent,
  committed,
  pending,
  remaining,
  overBudget
}: {
  total: BudgetMoney | null
  spent: BudgetMoney | null
  committed: BudgetMoney | null
  pending: BudgetMoney | null
  remaining: BudgetMoney | null
  overBudget: boolean
}) {
  const { t: translate, i18n } = useTranslation('manager')
  const title = translate('overviewBudget.usage')
  const exceedsBudget = overBudget || isNegativeBudgetMoney(remaining)
  const rows = [
    { label: translate('overviewBudget.spent'), money: spent, stroke: 'stroke-primary-ink', dot: 'bg-primary-ink' },
    { label: translate('overviewBudget.committed'), money: committed, stroke: 'stroke-primary', dot: 'bg-primary' },
    { label: translate('overviewBudget.pending'), money: pending, stroke: 'stroke-primary/35', dot: 'bg-primary/35' },
    {
      label: translate('overviewBudget.remaining'),
      money: remaining,
      stroke: 'stroke-success',
      dot: exceedsBudget ? 'bg-warning' : 'bg-success'
    }
  ]
  const shares = !exceedsBudget
    ? calculateBudgetShares(
        total,
        rows.map((row) => row.money)
      )
    : null
  const remainingShare = shares?.[3]
  const percent = new Intl.NumberFormat(i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN', {
    style: 'percent',
    maximumFractionDigits: 1
  })
  const remainingPercent = remainingShare
    ? remainingShare.positive && remainingShare.percent < 0.1
      ? translate('overviewBudget.lessThan', { percent: percent.format(0.001) })
      : percent.format(remainingShare.percent / 100)
    : null
  return (
    <section className='min-w-0 space-y-5' aria-label={title}>
      <h3 className='text-base font-semibold'>{title}</h3>
      <div className='grid items-center gap-6 sm:grid-cols-[224px_minmax(0,1fr)] lg:gap-10'>
        <div className='relative mx-auto size-56 shrink-0'>
          <svg viewBox='0 0 200 200' className='size-full -rotate-90' aria-hidden='true'>
            <circle cx='100' cy='100' r='82' fill='none' strokeWidth='18' className='stroke-border/50' />
            {shares?.map(
              (share, index) =>
                share.percent > 0 && (
                  <circle
                    key={rows[index].label}
                    cx='100'
                    cy='100'
                    r='82'
                    fill='none'
                    strokeWidth='18'
                    pathLength='100'
                    strokeDasharray={`${share.percent} ${100 - share.percent}`}
                    strokeDashoffset={-shares.slice(0, index).reduce((sum, previous) => sum + previous.percent, 0)}
                    className={rows[index].stroke}
                  />
                )
            )}
          </svg>
          <div className='absolute inset-0 flex flex-col items-center justify-center px-9 text-center'>
            {remainingPercent ? (
              <>
                <p className='font-mono text-4xl font-semibold tabular-nums tracking-tight text-success-ink'>
                  {remainingPercent}
                </p>
                <p className='mt-2 text-sm text-muted-foreground'>{translate('overviewBudget.available')}</p>
              </>
            ) : (
              <p className={`text-sm font-medium ${exceedsBudget ? 'text-warning-ink' : 'text-muted-foreground'}`}>
                {translate(exceedsBudget ? 'overviewBudget.overBudget' : 'overviewBudget.noRatio')}
              </p>
            )}
          </div>
        </div>
        <dl className='min-w-0 divide-y divide-border/60'>
          {rows.map((row, index) => (
            <div
              key={row.label}
              className={`flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 py-3.5 first:pt-0 last:pb-0 ${index === 3 ? 'font-semibold' : ''}`}
            >
              <dt className='flex min-w-0 items-center gap-2.5 text-sm'>
                <span aria-hidden='true' className={`size-2.5 shrink-0 rounded-full ${row.dot}`} />
                <span className={index === 3 ? 'text-foreground' : 'text-muted-foreground'}>{row.label}</span>
              </dt>
              <dd
                className={`ml-auto min-w-0 break-all text-right font-mono tabular-nums ${index === 3 ? (exceedsBudget ? 'text-lg text-warning-ink' : 'text-lg text-success-ink') : 'text-sm text-foreground'}`}
              >
                {row.money ? <ManagerMoney money={row.money} /> : translate('overviewBudget.notAvailable')}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <p className='text-xs leading-relaxed text-muted-foreground'>
        {translate(
          shares
            ? 'overviewBudget.usageNote'
            : exceedsBudget
              ? 'overviewBudget.overBudgetNote'
              : 'overviewBudget.incomparable'
        )}
      </p>
    </section>
  )
}

export function ManagerBudgetComposition({
  total,
  base,
  reserve
}: {
  total: BudgetMoney | null
  base: BudgetMoney | null
  reserve: BudgetMoney | null
}) {
  const { t: translate } = useTranslation('manager')
  const title = translate('overviewBudget.structure')
  const shares = calculateBudgetShares(total, [base, reserve])
  const rows = [
    { label: translate('overviewBudget.base'), money: base, color: 'bg-primary' },
    { label: translate('overviewBudget.reserve'), money: reserve, color: 'bg-primary/30' }
  ]
  return (
    <section aria-label={title} className='min-w-0 space-y-4 border-t border-border/60 pt-5'>
      <h3 className='text-sm font-semibold'>{title}</h3>
      {shares && (
        <div aria-hidden='true' className='flex h-3 overflow-hidden rounded-full bg-surface-subtle'>
          {rows.map((row, index) => (
            <span key={row.label} className={row.color} style={{ width: `${shares[index].percent}%` }} />
          ))}
        </div>
      )}
      <dl className='grid gap-4 text-sm sm:grid-cols-2 sm:gap-8'>
        {rows.map((row) => (
          <div key={row.label} className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
            <dt className='flex items-center gap-2 text-muted-foreground'>
              <span aria-hidden='true' className={`size-2 shrink-0 rounded-full ${row.color}`} />
              {row.label}
            </dt>
            <dd className='ml-auto min-w-0 break-all text-right font-mono font-medium tabular-nums'>
              {row.money ? <ManagerMoney money={row.money} /> : translate('overviewBudget.notAvailable')}
            </dd>
          </div>
        ))}
      </dl>
      {!shares && (
        <p className='text-xs leading-relaxed text-muted-foreground'>{translate('overviewBudget.incomparable')}</p>
      )}
    </section>
  )
}
