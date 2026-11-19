import { POLICY_ACKNOWLEDGEMENT } from '../enums/policy-acknowledgement'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'
import { getPolicyGetQueryKey, policyGet, usePolicyGet } from '~/shared/api/generated/operations/policies/policy-get'
import { getPolicyListQueryKey } from '~/shared/api/generated/operations/policies/policy-list'
import { policyAcknowledgementCreate } from '~/shared/api/generated/operations/policies/policy-acknowledgement-create'
import { useApiWrite } from '~/shared/api/use-api-write'
import { PolicyContent } from './policy-content'

export function PolicyReader({ code, version }: { code: string; version?: number }) {
  const { t } = useTranslation('policy')
  const query = usePolicyGet(code, version ? { version } : undefined)
  const policy = !query.isError ? query.data?.data : null
  const [consentedVersion, setConsentedVersion] = useState<number>()
  const action = useApiWrite({
    successMessage: t('gate.acknowledged'),
    mutationFn: async (seenVersion: number) => {
      const current = (await policyGet(code)).data
      if (!current || current.versionNumber !== seenVersion) throw new Error('POLICY.VERSION_CHANGED')
      return policyAcknowledgementCreate(code)
    },
    invalidate: [getMeGetQueryKey(), getPolicyListQueryKey(), getPolicyGetQueryKey(code)],
    errorMessage: (_code, error) =>
      t(error instanceof Error && error.message === 'POLICY.VERSION_CHANGED' ? 'errors.versionChanged' : 'gate.error'),
    onError: () => {
      setConsentedVersion(undefined)
      void query.refetch()
    }
  })
  if (!policy)
    return (
      <div className='space-y-3' role={query.isError ? 'alert' : 'status'}>
        <p>{t(query.isPending ? 'gate.loading' : 'gate.loadError')}</p>
        {!query.isPending && (
          <button
            type='button'
            className='min-h-11 rounded-md border border-border px-4 text-sm'
            disabled={query.isFetching}
            onClick={() => void query.refetch()}
          >
            {t('gate.retry')}
          </button>
        )}
      </div>
    )
  const needsAcknowledgement = policy.isCurrent && policy.myAcknowledgement === POLICY_ACKNOWLEDGEMENT.PENDING
  return (
    <article className='space-y-6 rounded-lg border border-border/60 bg-surface p-5 sm:p-6'>
      <header className='space-y-2'>
        <h2 className='text-xl font-semibold'>{policy.title}</h2>
        <p className='font-mono text-xs text-muted-foreground'>
          {policy.code} · {t('gate.version', { version: policy.versionNumber })}
        </p>
        <p className='text-sm text-muted-foreground'>
          {policy.isCurrent ? t('library.current') : t('library.historical')}
        </p>
      </header>
      <PolicyContent policy={policy} />
      {needsAcknowledgement && (
        <div className='space-y-4 border-t border-border/60 pt-5'>
          <label className='flex min-h-11 items-start gap-3 text-sm'>
            <input
              type='checkbox'
              className='mt-1 size-4 accent-primary'
              checked={consentedVersion === policy.versionNumber}
              disabled={action.blocked || query.isFetching}
              onChange={(event) => setConsentedVersion(event.target.checked ? policy.versionNumber : undefined)}
            />
            {t('library.consent')}
          </label>
          <button
            type='button'
            className='min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50'
            disabled={action.blocked || query.isFetching || consentedVersion !== policy.versionNumber}
            onClick={() => action.mutate(policy.versionNumber)}
          >
            {action.seconds ? t('library.retryAfter', { seconds: action.seconds }) : t('gate.acknowledge')}
          </button>
        </div>
      )}
      {policy.myAcknowledgement === POLICY_ACKNOWLEDGEMENT.DONE && (
        <p className='text-sm text-success-ink'>{t('library.done')}</p>
      )}
      {action.uncertain && (
        <button
          type='button'
          className='min-h-11 rounded-md border border-border px-4 text-sm'
          onClick={() => window.location.reload()}
        >
          {t('gate.retry')}
        </button>
      )}
    </article>
  )
}
