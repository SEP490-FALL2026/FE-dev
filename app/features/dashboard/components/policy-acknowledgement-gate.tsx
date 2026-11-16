import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { PolicyDetailResponseDtoData } from '~/shared/api/generated/model/policies'
import { usePolicyGet } from '~/shared/api/generated/operations/policies/policy-get'
import { LanguageSwitch } from '~/shared/ui/language-switch'
import { LoadingIndicator } from '~/shared/ui/page-loading'
import { PolicyMarkdown, renderPolicyInline } from './policy-markdown'
import { useAcknowledgePolicy, usePendingPolicies, type PendingPolicy } from './use-policy-acknowledgement'

type Policy = NonNullable<PolicyDetailResponseDtoData>

/**
 * Holds the role's pages back until the account has acknowledged every policy BE lists in `meGet`
 * (`pendingPolicyAcknowledgements`). BE blocks no route; this is the web's own gate. While `meGet` loads or fails
 * nothing is pending, so the pages render as usual.
 */
export function PolicyAcknowledgementGate({ children }: { children: ReactNode }) {
  const pending = usePendingPolicies()
  // The count the person started with, so the progress reads "n / total" while the list shrinks.
  const [startedWith, setStartedWith] = useState(0)
  if (pending.length > startedWith) setStartedWith(pending.length)
  if (pending.length === 0) {
    if (startedWith !== 0) setStartedWith(0)
    return <>{children}</>
  }
  return <PolicyReader pending={pending} total={Math.max(startedWith, pending.length)} />
}

function PolicyReader({ pending, total }: { pending: PendingPolicy[]; total: number }) {
  const { t: translate } = useTranslation('policyAcknowledgement')
  const current = pending[0]
  const position = total - pending.length + 1
  const headingRef = useRef<HTMLHeadingElement>(null)
  const query = usePolicyGet(current.code)
  const { acknowledge, isPending, errorKey } = useAcknowledgePolicy()
  const policy = query.data?.data ?? null

  // A new policy replaces the text on screen: move focus to its heading so a screen reader starts from the top.
  useEffect(() => {
    headingRef.current?.focus()
  }, [current.code])

  return (
    <main className='flex min-h-svh flex-col bg-background text-foreground'>
      <div className='mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6'>
        <div className='flex items-center justify-end gap-3'>
          <div className='flex items-center gap-2'>
            <LanguageSwitch />
            <a
              href='/logout'
              className='inline-flex min-h-10 items-center rounded-md border border-border px-3 text-sm font-medium hover:bg-surface-subtle'
            >
              {translate('logout')}
            </a>
          </div>
        </div>

        <header className='space-y-2'>
          <h1 ref={headingRef} tabIndex={-1} className='text-2xl font-semibold tracking-tight outline-none'>
            {translate('title')}
          </h1>
          <p className='text-sm leading-relaxed text-muted-foreground'>{translate('intro')}</p>
        </header>

        <article aria-labelledby='policy-title' className='space-y-5 rounded-lg border border-border bg-surface p-5'>
          <div className='space-y-1'>
            <h2 id='policy-title' className='text-lg font-semibold'>
              {policy?.title ?? current.title}
            </h2>
            <p className='text-xs text-muted-foreground'>
              {translate('version', { version: policy?.versionNumber ?? current.versionNumber })}
              {policy?.publishedAt && ` · ${translate('publishedAt', { date: formatDate(policy.publishedAt) })}`}
            </p>
          </div>

          {query.isPending && (
            <div className='grid min-h-40 place-items-center'>
              <LoadingIndicator message={translate('loading')} />
            </div>
          )}

          {query.isError && (
            <div role='alert' className='space-y-3'>
              <p className='text-sm text-danger-ink'>{translate('loadError')}</p>
              <button
                type='button'
                onClick={() => void query.refetch()}
                className='inline-flex min-h-10 items-center rounded-md border border-border px-3 text-sm font-medium hover:bg-surface-subtle'
              >
                {translate('retry')}
              </button>
            </div>
          )}

          {policy && <PolicyBody policy={policy} />}
        </article>
      </div>

      {/* Stays at the bottom of the viewport, so the button is reachable however long the policy is. */}
      <div
        role='group'
        aria-label={translate('actionsLabel')}
        className='sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80'
      >
        <div className='mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-3 sm:px-6'>
          {errorKey && (
            <p role='alert' className='text-sm text-danger-ink'>
              {translate(`errors.${errorKey}`)}
            </p>
          )}
          <div className='flex items-center justify-between gap-3'>
            <p className='text-sm font-semibold text-muted-foreground'>
              {translate('progress', { current: position, total })}
            </p>
            <button
              type='button'
              disabled={isPending || !policy}
              onClick={() => acknowledge(current.code)}
              className='inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:opacity-90'
            >
              {isPending ? translate('confirming') : translate('confirm')}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function PolicyBody({ policy }: { policy: Policy }) {
  const { t: translate } = useTranslation('policyAcknowledgement')
  return (
    <div className='space-y-5'>
      {policy.requiresReacknowledgement && policy.versionNumber > 1 && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('reacknowledge')}
        </p>
      )}
      {policy.changeNote && policy.versionNumber > 1 && (
        <p className='text-sm text-muted-foreground'>{translate('changeNote', { note: policy.changeNote })}</p>
      )}

      {policy.content.sections.map((section) => (
        <section key={section.heading} className='space-y-1.5'>
          <h3 className='text-sm font-semibold'>{section.heading}</h3>
          <PolicyMarkdown text={section.body} />
        </section>
      ))}

      {policy.content.steps.length > 0 && (
        <section className='space-y-3'>
          <h3 className='text-sm font-semibold'>{translate('stepsTitle')}</h3>
          <ul className='space-y-4'>
            {policy.content.steps.map((step) => (
              <li key={step.code} className='space-y-2 rounded-md border border-border/60 p-3'>
                <p className='text-sm font-medium'>
                  <span className='font-mono text-xs text-muted-foreground'>{step.code}</span>{' '}
                  {renderPolicyInline(step.title)}
                </p>
                {step.checklist.length > 0 && (
                  <ul aria-label={translate('checklistTitle')} className='space-y-1.5'>
                    {step.checklist.map((item) => (
                      <li key={item.code} className='flex flex-wrap items-baseline gap-x-2 text-sm'>
                        <span>{renderPolicyInline(item.text)}</span>
                        <span className='text-xs text-muted-foreground'>({translate(`check.${item.check}`)})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}
