import { GHOST_CHOICE, GHOST_CONFIDENCE } from '../enums/ghost-seat'
import { useTranslation } from 'react-i18next'
import type { RecommendationResponseDtoDataRecommendation } from '~/shared/api/generated/model'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { moneyFromMinor } from '~/shared/lib/money'
import { ManagerMoney } from '../../shared/components/manager-api-ui'

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}
/** Only the Manager evidence whitelist; never render the full queue evidence or IT confidence reasons. */
export function ManagerGhostEvidence({ item }: { item: RecommendationResponseDtoDataRecommendation }) {
  const { t } = useTranslation('manager')
  const { formatDate, formatNumber } = useWorkspaceFormat()
  const evidence = item.evidence ?? {}
  const thresholds = record(evidence.thresholds)
  const confidence = record(evidence.confidence).level ?? item.confidence
  const sources = Array.isArray(evidence.sources) ? evidence.sources.map(record) : []
  const previous = record(evidence.previousDecision)
  const previousChoice = Object.values(GHOST_CHOICE).find((choice) => choice === previous.choice)
  const count = (value: unknown) =>
    typeof value === 'number' && Number.isFinite(value) ? formatNumber(value) : t('empty')
  const date = (value: unknown) =>
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? formatDate(value) : t('empty')
  const saving = item.potentialSaving
  return (
    <div className='space-y-5'>
      <h2 className='font-semibold'>{t('ghost.evidence')}</h2>
      <dl className='grid gap-x-6 gap-y-4 sm:grid-cols-2'>
        {(
          [
            [
              t('ghost.activity'),
              item.activityStatus ? t(`ghost.activityStatuses.${item.activityStatus}`) : t('empty')
            ],
            [t('ghost.lastActive'), date(evidence.lastActiveDate ?? item.lastActiveDate), true],
            [t('ghost.inactive'), count(evidence.inactiveDays ?? item.inactiveDays), true],
            [t('ghost.coverage'), count(evidence.coverageDays), true],
            [
              t('ghost.confidence'),
              confidence === GHOST_CONFIDENCE.HIGH ||
              confidence === GHOST_CONFIDENCE.MEDIUM ||
              confidence === GHOST_CONFIDENCE.LOW
                ? t(`ghost.confidences.${confidence}`)
                : t('empty')
            ],
            [
              t('ghost.timeBound'),
              evidence.timeBound === true
                ? t('ghost.limited')
                : evidence.timeBound === false
                  ? t('ghost.unlimited')
                  : t('empty')
            ],
            [t('ghost.reviewThreshold'), count(thresholds.reviewDays), true],
            [t('ghost.actionThreshold'), count(thresholds.actionDays), true]
          ] satisfies [string, string, boolean?][]
        ).map(([label, value, numeric]) => (
          <div key={label} className='border-b border-border/40 pb-3'>
            <dt className={`text-xs text-muted-foreground ${numeric ? 'text-right' : ''}`}>{label}</dt>
            <dd className={`mt-1 text-sm ${numeric ? 'text-right font-mono tabular-nums' : ''}`}>{value}</dd>
          </div>
        ))}
        <div>
          <dt className='text-right text-xs text-muted-foreground'>{t('ghost.saving')}</dt>
          <dd className='mt-1 text-right text-sm'>
            <ManagerMoney
              money={
                saving?.monthlyAmountMinor && saving.currency
                  ? moneyFromMinor(saving.monthlyAmountMinor, saving.currency)
                  : null
              }
            />
          </dd>
        </div>
      </dl>
      {previousChoice && (
        <section className='space-y-2 border-t border-border/50 pt-4'>
          <h3 className='text-sm font-medium'>{t('ghost.previousDecision')}</h3>
          <p className='text-sm'>{t(`ghost.choices.${previousChoice}`)}</p>
          {typeof previous.reason === 'string' && (
            <p className='whitespace-pre-wrap text-sm text-muted-foreground [overflow-wrap:anywhere]'>
              {previous.reason}
            </p>
          )}
        </section>
      )}
      <h3 className='text-sm font-medium'>{t('ghost.sources')}</h3>
      {!sources.length ? (
        <p className='text-sm text-muted-foreground'>{t('empty')}</p>
      ) : (
        <ul className='divide-y divide-border/40'>
          {sources.map((source, index) => (
            <li key={index} className='flex flex-wrap justify-between gap-2 py-3 text-sm'>
              <span>
                {typeof source.name === 'string' ? source.name : t('empty')}
                {typeof source.kind === 'string' && (
                  <span className='ml-2 text-xs text-muted-foreground'>{source.kind}</span>
                )}
              </span>
              <span className='text-right font-mono text-xs tabular-nums'>
                {date(source.coverageFrom)} – {date(source.coverageTo)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
