import { useTranslation } from 'react-i18next'
import type { ReviewPeriodDetailResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-review-periods/reviewPeriodDetailResponseDtoDataItemsItem'
import { useDashboardFormat } from '../../../dashboard-ui'
import { formatMoney } from '../../shared/approvals-money'
import { ReviewLightDot, reviewLightEdge } from './review-light'

type Line = ReviewPeriodDetailResponseDtoDataItemsItem
type Money = { amount: string; currency: string }

const isNonZero = (value: Money) => Number(value.amount) !== 0
const isNegative = (value: Money) => Number(value.amount) < 0

function Figure({ label, value, tone }: { label: string; value: string; tone?: 'danger' | 'warning' }) {
  const toneClass = tone === 'danger' ? 'text-danger-ink' : tone === 'warning' ? 'text-warning-ink' : ''
  return (
    <div className='min-w-0 space-y-0.5'>
      <dt className='text-xs text-muted-foreground'>{label}</dt>
      <dd className={`font-mono text-sm tabular-nums ${toneClass}`}>{value}</dd>
    </div>
  )
}

/**
 * One Cost Center of a review period: the figures taken when Finance closed the month and, for a quarter, the head's
 * explanation. The light is only a dot and a coloured edge; it is never listed as a value.
 */
export function ReviewLineCard({ line }: { line: Line }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDateTime, formatPercent } = useDashboardFormat()
  const money = (value: Money) => formatMoney(value, i18n.language)
  const explanation = line.explanation
  const needs = explanation?.knownNeedsToYearEnd
  const figureCount = 8 + (line.paceBasisPoints !== null ? 1 : 0) + (isNonZero(line.changedAfterSnapshot) ? 1 : 0)
  // 8, 9 and 10 figures fill whole rows in 4, 3 and 5 columns instead of leaving an orphan row.
  const figureColumns = figureCount === 9 ? 'lg:grid-cols-3' : figureCount === 10 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
  const showStatus = line.explanationStatus !== 'NOT_REQUIRED'

  return (
    <li
      className={`list-none space-y-4 rounded-lg border border-l-4 border-border/70 bg-surface p-4 ${reviewLightEdge(line.light)}`}
    >
      <header className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex min-w-0 items-center gap-2'>
          <ReviewLightDot light={line.light} />
          <h3 className='min-w-0 truncate text-sm font-semibold'>
            {line.costCenter ? `${line.costCenter.code} · ${line.costCenter.name}` : translate('inYear.none')}
          </h3>
        </div>
        {showStatus && (
          <span className='rounded-md bg-surface-subtle px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border/70 ring-inset'>
            {translate(`inYear.explanationStatus.${line.explanationStatus}`)}
          </span>
        )}
      </header>

      <dl className={`grid gap-x-6 gap-y-3 sm:grid-cols-2 ${figureColumns}`}>
        <Figure label={translate('inYear.base')} value={money(line.base)} />
        <Figure label={translate('inYear.reserve')} value={money(line.reserve)} />
        <Figure label={translate('inYear.spent')} value={money(line.spent)} />
        <Figure label={translate('inYear.spentAfterMonth')} value={money(line.spentAfterMonth)} />
        <Figure label={translate('inYear.committed')} value={money(line.committed)} />
        <Figure label={translate('inYear.pendingSpend')} value={money(line.pendingSpend)} />
        <Figure
          label={translate('inYear.remaining')}
          value={money(line.remaining)}
          tone={isNegative(line.remaining) ? 'danger' : undefined}
        />
        <Figure label={translate('inYear.forecast')} value={money(line.forecast)} />
        {line.paceBasisPoints !== null && (
          <Figure label={translate('inYear.pace')} value={formatPercent(line.paceBasisPoints / 10000)} />
        )}
        {isNonZero(line.changedAfterSnapshot) && (
          <Figure
            label={translate('inYear.changedAfterSnapshot')}
            value={money(line.changedAfterSnapshot)}
            tone='warning'
          />
        )}
      </dl>

      {explanation && needs && (
        <section
          aria-label={translate('inYear.explanationsTitle')}
          className='space-y-2 rounded-md bg-surface-subtle p-3 text-sm'
        >
          <h4 className='text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
            {translate('inYear.explanationsTitle')}
          </h4>
          <dl className='grid gap-x-6 gap-y-2 sm:grid-cols-2'>
            <div className='sm:col-span-2'>
              <dt className='text-xs text-muted-foreground'>{translate('inYear.cause')}</dt>
              <dd className='break-words whitespace-pre-wrap'>{explanation.cause}</dd>
            </div>
            <div>
              <dt className='text-xs text-muted-foreground'>{translate('inYear.persistence')}</dt>
              <dd>{translate(`inYear.persistenceValues.${explanation.persistence}`)}</dd>
            </div>
            <div>
              <dt className='text-xs text-muted-foreground'>{translate('inYear.knownNeeds')}</dt>
              <dd className='break-words'>
                {needs.amount ? (
                  <span className='font-mono tabular-nums'>{money(needs.amount)}</span>
                ) : (
                  translate('inYear.none')
                )}
                {needs.note ? ` — ${needs.note}` : ''}
              </dd>
            </div>
            <div className='sm:col-span-2'>
              <dt className='text-xs text-muted-foreground'>{translate('inYear.action')}</dt>
              <dd className='break-words whitespace-pre-wrap'>{explanation.action}</dd>
            </div>
          </dl>
          <p className='text-xs text-muted-foreground'>
            {translate('inYear.explainedBy', {
              name: explanation.explainedBy?.fullName ?? translate('inYear.none'),
              time: formatDateTime(explanation.explainedAt)
            })}
          </p>
        </section>
      )}
    </li>
  )
}
