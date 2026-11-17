import { useTranslation } from 'react-i18next'
import type { ReviewPeriodDetailResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-review-periods'
import { FinanceStatus } from '../../shared/components/finance-ui'
import { formatMoney, type FinanceMoney } from '../../shared/finance-money'

type Line = ReviewPeriodDetailResponseDtoDataItemsItem
type Light = Line['light']

/** The light is a signal, not a figure: a coloured dot and a coloured edge, named only for assistive technology. */
const lightTone: Record<Light, { dot: string; edge: string }> = {
  GREEN: { dot: 'bg-success', edge: 'border-l-success' },
  YELLOW: { dot: 'bg-warning', edge: 'border-l-warning' },
  RED: { dot: 'bg-danger', edge: 'border-l-danger' },
  UNDER: { dot: 'bg-info', edge: 'border-l-info' }
}

export function LightDot({ light }: { light: Light }) {
  const { t: translate } = useTranslation('financeReview')
  const description = translate('periods.lightLabel', {
    name: translate(`periods.lightNames.${light}`),
    meaning: translate(`periods.lightMeanings.${light}`)
  })
  return (
    <span
      role='img'
      aria-label={description}
      title={description}
      className={`inline-block size-3 shrink-0 rounded-full ring-2 ring-surface ${lightTone[light].dot}`}
    />
  )
}

const isZero = (money: FinanceMoney | null | undefined) => !money || Number(money.amount) === 0
const isNegative = (money: FinanceMoney | null | undefined) => Boolean(money) && Number(money?.amount) < 0

function Figure({ label, value, tone }: { label: string; value: string; tone?: 'danger' | 'warning' }) {
  const toneClass = tone === 'danger' ? 'text-danger-ink' : tone === 'warning' ? 'text-warning-ink' : ''
  return (
    <div className='space-y-0.5'>
      <dt className='text-xs text-muted-foreground'>{label}</dt>
      <dd className={`font-mono text-sm tabular-nums ${toneClass}`}>{value}</dd>
    </div>
  )
}

/** One Cost Center of a review period: the figures taken at closing and, for a quarter, the head's explanation. */
export function ReviewLineCard({ line, dueOn }: { line: Line; dueOn: string | null }) {
  const { t: translate, i18n } = useTranslation('financeReview')
  const money = (value: FinanceMoney | null | undefined) => formatMoney(value, i18n.language)
  const explanation = line.explanation
  const showStatus = line.explanationStatus !== 'NOT_REQUIRED'

  return (
    <article
      className={`space-y-4 rounded-lg border border-l-4 border-border/70 bg-surface p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] ${lightTone[line.light].edge}`}
    >
      <header className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex min-w-0 items-center gap-2'>
          <LightDot light={line.light} />
          <h3 className='min-w-0 truncate text-sm font-semibold'>
            {line.costCenter ? `${line.costCenter.code} · ${line.costCenter.name}` : translate('noCostCenter')}
          </h3>
        </div>
        {showStatus && (
          <FinanceStatus
            value={line.explanationStatus}
            label={translate(`periods.explanationStatus.${line.explanationStatus}`)}
          />
        )}
      </header>

      <dl className='grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4'>
        <Figure label={translate('periods.base')} value={money(line.base)} />
        <Figure label={translate('periods.reserve')} value={money(line.reserve)} />
        <Figure label={translate('periods.spentCol')} value={money(line.spent)} />
        <Figure label={translate('periods.spentAfterMonth')} value={money(line.spentAfterMonth)} />
        <Figure label={translate('periods.committed')} value={money(line.committed)} />
        <Figure label={translate('periods.pendingSpend')} value={money(line.pendingSpend)} />
        <Figure
          label={translate('periods.remaining')}
          value={money(line.remaining)}
          tone={isNegative(line.remaining) ? 'danger' : undefined}
        />
        <Figure label={translate('periods.forecast')} value={money(line.forecast)} />
        {line.paceBasisPoints !== null && (
          <Figure
            label={translate('periods.pace')}
            value={translate('periods.paceValue', { percent: (line.paceBasisPoints / 100).toFixed(0) })}
          />
        )}
        {!isZero(line.priceIncrease) && (
          <Figure label={translate('periods.priceIncrease')} value={money(line.priceIncrease)} />
        )}
        {line.variancePpm !== 0 && (
          <Figure label={translate('periods.variance')} value={`${(line.variancePpm / 10000).toFixed(2)} %`} />
        )}
        {!isZero(line.changedAfterSnapshot) && (
          <Figure
            label={translate('periods.changedAfterSnapshot')}
            value={money(line.changedAfterSnapshot)}
            tone='warning'
          />
        )}
      </dl>

      {explanation ? (
        <section
          aria-label={translate('periods.explanation')}
          className='space-y-2 rounded-md bg-surface-subtle p-3 text-sm'
        >
          <h4 className='text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
            {translate('periods.explanation')}
          </h4>
          <dl className='grid gap-x-6 gap-y-2 sm:grid-cols-2'>
            <div className='sm:col-span-2'>
              <dt className='text-xs text-muted-foreground'>{translate('periods.cause')}</dt>
              <dd className='whitespace-pre-wrap'>{explanation.cause}</dd>
            </div>
            <div>
              <dt className='text-xs text-muted-foreground'>{translate('periods.persistenceLabel')}</dt>
              <dd>{translate(`periods.persistence.${explanation.persistence}`)}</dd>
            </div>
            <div>
              <dt className='text-xs text-muted-foreground'>{translate('periods.knownNeeds')}</dt>
              <dd>
                {explanation.knownNeedsToYearEnd.amount ? (
                  <span className='font-mono tabular-nums'>{money(explanation.knownNeedsToYearEnd.amount)}</span>
                ) : null}
                {explanation.knownNeedsToYearEnd.note ? (
                  <span className='block text-muted-foreground'>{explanation.knownNeedsToYearEnd.note}</span>
                ) : null}
              </dd>
            </div>
            <div className='sm:col-span-2'>
              <dt className='text-xs text-muted-foreground'>{translate('periods.action')}</dt>
              <dd className='whitespace-pre-wrap'>{explanation.action}</dd>
            </div>
          </dl>
          {explanation.explainedBy && (
            <p className='text-xs text-muted-foreground'>
              {translate('periods.explainedBy', {
                name: explanation.explainedBy.fullName,
                date: explanation.explainedAt.slice(0, 10)
              })}
            </p>
          )}
        </section>
      ) : line.explanationStatus === 'PENDING' ? (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('periods.waitingHead')}
          {dueOn ? ` (${translate('periods.dueOn')}: ${dueOn})` : ''}
        </p>
      ) : line.explanationStatus === 'NO_HEAD' ? (
        <p className='text-sm text-muted-foreground'>{translate('periods.noHeadNote')}</p>
      ) : line.explanationStatus === 'UNEXPLAINED' ? (
        <p className='text-sm text-muted-foreground'>{translate('periods.unexplainedNote')}</p>
      ) : null}
    </article>
  )
}
