import { Check, Minus, RotateCcw, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { RequestTimingsResponseDtoDataTimings } from '~/shared/api/generated/model/access-requests/requestTimingsResponseDtoDataTimings'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import type { AccessRequestState } from '../enums/access-request-state'
import { requestProcessingSteps } from '../request-processing-progress'

/** Shared Employee/Manager presentation; each role retains ownership of its query and errors. */
export function RequestProcessingProgress({
  timings,
  state
}: {
  timings: RequestTimingsResponseDtoDataTimings
  state?: AccessRequestState
}) {
  const { t, i18n } = useTranslation('requestFlow')
  const { formatDate, formatDateTime, formatNumber } = useWorkspaceFormat()
  const timeFormat = new Intl.DateTimeFormat(i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
  const steps = requestProcessingSteps(timings, state)
  return (
    <div className='@container'>
      <ol
        aria-label={t('progress.title')}
        className='grid gap-y-5 py-1 @min-[48rem]:auto-cols-fr @min-[48rem]:grid-flow-col @min-[48rem]:grid-rows-[auto_auto_auto_auto] @min-[48rem]:gap-y-2'
      >
        {steps.map((step, index) => {
          const timestamp = step.endedAt ?? step.startedAt
          const timestampLabel = t(
            step.kind === 'SUBMITTED' ? 'progress.sentAt' : step.endedAt ? 'progress.endedAt' : 'progress.startedAt'
          )
          const fullTiming = `${t('progress.startedAt')}: ${formatDateTime(step.startedAt)}${step.endedAt ? ` · ${t('progress.endedAt')}: ${formatDateTime(step.endedAt)}` : ''}`
          const current = step.phase === 'active' || step.phase === 'revision' || step.phase === 'closing'
          const negative = step.phase === 'rejected' || step.phase === 'failed'
          const paused = step.phase === 'stopped' || step.phase === 'revision' || step.phase === 'closing'
          const Icon = negative
            ? X
            : step.phase === 'closed'
              ? Check
              : step.phase === 'revision'
                ? RotateCcw
                : paused
                  ? Minus
                  : null
          const tone = negative
            ? 'border-danger/25 bg-danger/10 text-danger-ink'
            : paused
              ? 'border-warning/30 bg-warning/10 text-warning-ink'
              : current
                ? 'border-primary bg-primary text-primary-foreground ring-4 ring-primary/10'
                : step.phase === 'closed'
                  ? 'border-primary/25 bg-primary-soft text-primary-ink'
                  : 'border-border bg-surface-subtle text-muted-foreground'
          return (
            <li
              key={step.kind}
              aria-current={current ? 'step' : undefined}
              className='relative grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 @min-[48rem]:row-span-4 @min-[48rem]:grid-cols-1 @min-[48rem]:grid-rows-subgrid @min-[48rem]:gap-x-0 @min-[48rem]:px-2 @min-[48rem]:text-center'
            >
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute bottom-[-1.25rem] left-5 top-10 w-px @min-[48rem]:bottom-auto @min-[48rem]:left-1/2 @min-[48rem]:top-5 @min-[48rem]:h-px @min-[48rem]:w-full ${step.phase === 'closed' ? 'bg-primary/30' : 'bg-border/70'}`}
                />
              )}
              <span
                aria-hidden
                className={`relative z-10 row-span-3 grid size-10 place-items-center rounded-full border text-sm font-semibold tabular-nums @min-[48rem]:row-span-1 @min-[48rem]:justify-self-center ${tone}`}
              >
                {Icon ? <Icon strokeWidth={1.5} className='size-4' /> : formatNumber(index + 1)}
              </span>
              <p className={`text-sm font-semibold leading-5 ${current ? 'text-primary-ink' : 'text-foreground'}`}>
                <span className='sr-only'>{t('progress.step', { number: formatNumber(index + 1) })} </span>
                {t(`progress.stages.${step.kind}`)}
              </p>
              <p
                className={`text-xs leading-5 ${negative ? 'text-danger-ink' : paused ? 'text-warning-ink' : current ? 'font-medium text-primary-ink' : 'text-muted-foreground'}`}
              >
                {t(`progress.phases.${step.phase}`)}
              </p>
              <div className='pt-1 @min-[48rem]:mt-1 @min-[48rem]:border-t @min-[48rem]:border-border/40 @min-[48rem]:pt-3'>
                <span className='sr-only'>{timestampLabel}: </span>
                <time
                  dateTime={timestamp}
                  title={fullTiming}
                  className='inline-grid gap-0.5 text-right font-mono text-xs leading-5 tabular-nums'
                >
                  <span className='whitespace-nowrap text-foreground'>{formatDate(timestamp)}</span>
                  <span className='whitespace-nowrap text-muted-foreground'>
                    {timeFormat.format(new Date(timestamp))}
                  </span>
                </time>
                {step.endedAt && step.endedAt !== step.startedAt && (
                  <span className='sr-only'>
                    {t('progress.startedAt')}: <time dateTime={step.startedAt}>{formatDateTime(step.startedAt)}</time>
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
