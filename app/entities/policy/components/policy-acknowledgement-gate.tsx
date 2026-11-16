import type { ReactNode } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ScrollText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getMeGetQueryKey, useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { usePolicyGet } from '~/shared/api/generated/operations/policies/policy-get'
import { policyAcknowledgementCreate } from '~/shared/api/generated/operations/policies/policy-acknowledgement-create'
import { InlineMarkdown } from '~/shared/ui/inline-markdown'

/**
 * While `meGet.pendingPolicyAcknowledgements` has entries the workspace is replaced by the policies to read
 * (QĐ-111ar). The server does not block other routes; this gate is the client's part of the rule.
 */
export function PolicyAcknowledgementGate({ children }: { children: ReactNode }) {
  const me = useMeGet()
  const pending = !me.isError ? (me.data?.data?.pendingPolicyAcknowledgements ?? []) : []
  const current = pending[0]
  if (!current) return children
  return <PendingPolicy key={`${current.code}:${current.versionNumber}`} code={current.code} total={pending.length} />
}

function PendingPolicy({ code, total }: { code: string; total: number }) {
  const { t: translate } = useTranslation('policy')
  const client = useQueryClient()
  const query = usePolicyGet(code, undefined)
  const policy = !query.isError ? query.data?.data : null
  const acknowledge = useMutation({
    retry: false,
    mutationFn: () => policyAcknowledgementCreate(code),
    onSuccess: async () => {
      toast.success(translate('gate.acknowledged'), { id: 'policy-acknowledgement' })
      await client.invalidateQueries({ queryKey: getMeGetQueryKey() })
    },
    onError: () => toast.error(translate('gate.error'), { id: 'policy-acknowledgement' })
  })
  return (
    <section aria-labelledby='policy-gate-title' className='mx-auto max-w-3xl space-y-6'>
      <header className='space-y-2'>
        <p className='flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
          <ScrollText aria-hidden strokeWidth={1.5} className='size-4' />
          {translate('gate.progress', { current: 1, total })}
        </p>
        <h1 id='policy-gate-title' className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>
          {translate('gate.title')}
        </h1>
        <p className='text-sm text-muted-foreground [text-wrap:pretty]'>{translate('gate.hint')}</p>
      </header>
      {query.isPending ? (
        <p role='status' className='text-sm text-muted-foreground'>
          {translate('gate.loading')}
        </p>
      ) : !policy ? (
        <div role='alert' className='space-y-3 text-sm'>
          <p className='text-danger-ink'>{translate('gate.loadError')}</p>
          <button
            type='button'
            className='min-h-11 rounded-md border border-border px-4 text-sm transition-colors hover:bg-surface-subtle'
            disabled={query.isFetching}
            aria-busy={query.isFetching}
            onClick={() => void query.refetch()}
          >
            {translate('gate.retry')}
          </button>
        </div>
      ) : (
        <article className='space-y-5 rounded-lg border border-border/70 bg-surface p-5'>
          <div className='space-y-1'>
            <h2 className='text-lg font-semibold tracking-tight [text-wrap:balance]'>{policy.title}</h2>
            <p className='font-mono text-xs text-muted-foreground tabular-nums'>
              {policy.code} · {translate('gate.version', { version: policy.versionNumber })}
            </p>
          </div>
          {policy.changeNote && (
            <div className='space-y-1 rounded-md bg-surface-subtle p-3 text-sm'>
              <p className='font-medium'>{translate('gate.changeNote')}</p>
              <InlineMarkdown text={policy.changeNote} className='[overflow-wrap:anywhere]' />
            </div>
          )}
          {policy.content.sections.map((section, index) => (
            <div key={`${index}:${section.heading}`} className='space-y-1.5'>
              <h3 className='text-sm font-semibold'>{section.heading}</h3>
              <InlineMarkdown text={section.body} className='text-sm leading-relaxed [overflow-wrap:anywhere]' />
            </div>
          ))}
          <div className='flex justify-end border-t border-border/60 pt-4'>
            <button
              type='button'
              className='min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50'
              disabled={acknowledge.isPending || query.isFetching}
              aria-busy={acknowledge.isPending}
              onClick={() => acknowledge.mutate()}
            >
              {translate('gate.acknowledge')}
            </button>
          </div>
        </article>
      )}
    </section>
  )
}
