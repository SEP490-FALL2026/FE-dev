import { useTranslation } from 'react-i18next'
import { ManagerMoney } from '../../shared/components/manager-api-ui'

type Money = { amount: string; currency: string }
type Row = { label: string; money: Money | null; accent?: boolean }

// Scale decimal strings as integers so chart widths do not round the monetary values.
function scaleAmounts(rows: readonly Row[]) {
  const currencies = new Set(rows.flatMap((row) => (row.money ? [row.money.currency] : [])))
  const parsed = rows.map((row) => {
    const match = typeof row.money?.amount === 'string' ? row.money.amount.match(/^(-?)(\d+)(?:\.(\d+))?$/) : null
    return match ? { negative: !!match[1], digits: `${match[2]}${match[3] ?? ''}`, scale: match[3]?.length ?? 0 } : null
  })
  if (currencies.size > 1 || parsed.some((value, index) => rows[index].money && !value)) return null
  const scale = Math.max(0, ...parsed.map((value) => value?.scale ?? 0))
  const values = parsed.map((value) =>
    value && !value.negative ? BigInt(value.digits) * 10n ** BigInt(scale - value.scale) : 0n
  )
  const maximum = values.reduce((a, b) => (a > b ? a : b), 0n)
  return values.map((value) => (maximum > 0n ? Number((value * 10000n) / maximum) / 100 : 0))
}

export function ManagerBudgetChart({ title, rows }: { title: string; rows: readonly Row[] }) {
  const { t } = useTranslation('manager')
  const widths = scaleAmounts(rows)
  return (
    <section className='min-w-0 space-y-4' aria-label={title}>
      <h3 className='text-sm font-semibold text-foreground'>{title}</h3>
      <ul className='space-y-4'>
        {rows.map((row, index) => (
          <li key={row.label} className='space-y-2'>
            <div className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm'>
              <span className='text-muted-foreground'>{row.label}</span>
              <span className='min-w-0 break-all font-medium text-foreground'>
                {row.money ? <ManagerMoney money={row.money} /> : t('overviewBudget.notAvailable')}
              </span>
            </div>
            {widths && (
              <div aria-hidden='true' className='h-2 overflow-hidden rounded-full bg-surface-subtle'>
                <div
                  className={`h-full rounded-full ${row.accent ? 'bg-primary' : 'bg-primary/45'}`}
                  style={{ width: `${widths[index]}%` }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      <p className='text-xs leading-relaxed text-muted-foreground'>
        {t(widths ? 'overviewBudget.scaleNote' : 'overviewBudget.incomparable')}
      </p>
    </section>
  )
}
