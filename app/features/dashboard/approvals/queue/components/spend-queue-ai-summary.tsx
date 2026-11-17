import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { isAxiosError } from 'axios'
import {
  useAiAccessRequestSummaryCreate,
  useAiAccessRequestSummaryGet,
  useAiAccessRequestSummarySource
} from '~/shared/api/generated/operations/ai-assist'
import { ApprovalsButton } from '../../shared/components/approvals-ui'

const RUNNING = ['PENDING', 'RUNNING']
const POLL_MS = 2000

function errorCode(error: unknown) {
  const body = isAxiosError(error) ? (error.response?.data as { error?: { code?: string } } | undefined) : undefined
  return body?.error?.code
}

/** Messages a failed ask can carry; anything else reads as the AI being unavailable for now. */
type AskError = 'ai.disabled' | 'ai.noSteps' | 'ai.sourceStale' | 'ai.unavailable'
const askErrors: Partial<Record<string, AskError>> = {
  'AI.DISABLED': 'ai.disabled',
  'AI.NO_ASSIGNED_STEPS': 'ai.noSteps',
  'AI.SOURCE_STALE': 'ai.sourceStale',
  'AI.PROVIDER_UNAVAILABLE': 'ai.unavailable'
}

/**
 * A reading aid over the queue: the AI writes one line per waiting request. It never decides, and the queue read by
 * hand below stays the source of truth. Hidden when nothing waits; a plain note when the feature is off.
 */
export function SpendQueueAiSummary({ onOpen }: { onOpen: (requestId: string) => void }) {
  const { t: translate } = useTranslation('approvalsSpend')
  const [invocationId, setInvocationId] = useState<string | null>(null)
  const [askError, setAskError] = useState<AskError | null>(null)
  const source = useAiAccessRequestSummarySource({ query: { retry: false } })
  const create = useAiAccessRequestSummaryCreate()
  const summary = useAiAccessRequestSummaryGet(invocationId ?? '', {
    query: {
      enabled: Boolean(invocationId),
      refetchInterval: (query) => (RUNNING.includes(query.state.data?.data?.status ?? '') ? POLL_MS : false)
    }
  })

  if (source.isPending) return null
  if (source.isError) {
    if (errorCode(source.error) !== 'AI.DISABLED') return null
    return <p className='text-xs text-muted-foreground'>{translate('ai.disabled')}</p>
  }
  const revision = source.data?.data
  if (!revision?.queueRevision || !revision.stepCount) return null

  const ask = () => {
    setAskError(null)
    create.mutate(
      { data: { queueRevision: revision.queueRevision } },
      {
        onSuccess: (response) => setInvocationId(response.data?.invocationId ?? null),
        onError: (error) => {
          const code = errorCode(error) ?? ''
          if (code === 'AI.SOURCE_STALE') void source.refetch()
          setAskError(askErrors[code] ?? 'ai.unavailable')
        }
      }
    )
  }

  const result = summary.data?.data
  const running = Boolean(invocationId) && (!result || RUNNING.includes(result.status))
  const failed =
    result?.status === 'FAILED' || result?.status === 'NO_VALID_OUTPUT' || result?.status === 'STALE'
      ? result.status
      : null
  // The contract documents `simulated` on every state; the generated type does not carry it yet.
  const simulated = Boolean(result && (result as { simulated?: boolean }).simulated)

  return (
    <section
      aria-label={translate('ai.title')}
      className='space-y-3 rounded-lg border border-border/70 bg-surface p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]'
    >
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='min-w-0 space-y-1'>
          <h2 className='flex items-center gap-2 text-sm font-semibold'>
            <Sparkles aria-hidden className='size-4 text-primary' strokeWidth={1.5} />
            {translate('ai.title')}
            {simulated && (
              <span className='rounded-md bg-surface-subtle px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border ring-inset'>
                {translate('ai.simulated')}
              </span>
            )}
          </h2>
          <p className='text-xs text-muted-foreground'>{translate('ai.readingAid')}</p>
        </div>
        <ApprovalsButton variant='secondary' pending={create.isPending || running} onClick={ask}>
          {translate(result ? 'ai.again' : 'ai.ask', { count: revision.stepCount })}
        </ApprovalsButton>
      </div>
      {revision.omittedCount > 0 && !result && (
        <p className='text-xs text-muted-foreground'>{translate('ai.omitted', { count: revision.omittedCount })}</p>
      )}
      {askError && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate(askError)}
        </p>
      )}
      {running && (
        <p role='status' className='text-sm text-muted-foreground'>
          {translate('ai.running')}
        </p>
      )}
      {failed && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate(`ai.status.${failed}`)}
        </p>
      )}
      {result?.status === 'COMPLETED' && (
        <>
          {result.sourceStale && (
            <p role='status' className='text-sm text-warning-ink'>
              {translate('ai.changed')}
            </p>
          )}
          {result.lines.length === 0 ? (
            <p className='text-sm text-muted-foreground'>{translate('ai.noLines')}</p>
          ) : (
            <ul className='divide-y divide-border/60 rounded-md border border-border/60'>
              {result.lines.map((line) => (
                <li key={line.stepId} className='flex flex-wrap items-start justify-between gap-3 p-3 text-sm'>
                  <p className='min-w-0 flex-1 break-words whitespace-pre-wrap'>{line.summary}</p>
                  <ApprovalsButton variant='ghost' onClick={() => onOpen(line.requestId)}>
                    {translate('open')}
                  </ApprovalsButton>
                </li>
              ))}
            </ul>
          )}
          {result.omittedCount > 0 && (
            <p className='text-xs text-muted-foreground'>{translate('ai.omitted', { count: result.omittedCount })}</p>
          )}
        </>
      )}
    </section>
  )
}
