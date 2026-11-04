import { useEffect, useState } from 'react'
import { useCallback, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  useLicenseKeyList,
  getLicenseKeyListQueryKey
} from '~/shared/api/generated/operations/license-keys/license-key-list'
import { licenseKeyReveal } from '~/shared/api/generated/operations/license-keys/license-key-reveal'
import { licenseKeyImport } from '~/shared/api/generated/operations/license-keys/license-key-import'
import { useSubscriptionList } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import type { ImportResponseDtoData } from '~/shared/api/generated/model/license-keys'
import { useAdminRetryDelay } from '~/shared/lib/use-retry-delay'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, ItFormDialog, itInputClass, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { CatalogKeyStatus } from '../enums/license-key-status'
import { ItPendingIcon } from '../../shared/components/it-pending-icon'
export function CatalogLicenseKeys({ planId }: { planId: string }) {
  const { t: translate } = useTranslation('itCatalog')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState('')
  const query = useSubscriptionList({ planId, page, pageSize: 20 })
  return (
    <section className='space-y-4 rounded-lg border border-border p-4'>
      <h2 className='font-semibold [text-wrap:balance]'>{translate('keys.title')}</h2>
      <ItQueryState query={query}>
        <fieldset>
          <legend>{translate('import.subscription')}</legend>
          {query.data?.data?.items.map((subscription) => (
            <label key={subscription.id} className='flex min-h-11 items-center gap-2'>
              <input
                type='radio'
                name='key-subscription'
                checked={selected === subscription.id}
                onChange={() => setSelected(subscription.id)}
              />
              {subscription.planName} · {subscription.id}
            </label>
          ))}
          {query.data?.data?.items.length === 0 && <ItEmpty />}
        </fieldset>
      </ItQueryState>
      <ItPagination
        page={page}
        total={query.data?.data?.pagination.totalItems ?? 0}
        pageSize={20}
        onChange={(value) => {
          setPage(value)
          setSelected('')
        }}
      />
      {selected && <CatalogKeyVault key={selected} subscriptionId={selected} />}
    </section>
  )
}
export function CatalogKeyVault({ subscriptionId }: { subscriptionId: string }) {
  const { t: translate } = useTranslation('itCatalog')
  const { t: common } = useTranslation('itAdmin')
  const [page, setPage] = useState(1)
  const [secret, setSecret] = useState<{ id: string; value: string }>()
  const [revealId, setRevealId] = useState<string>()
  const [text, setText] = useState('')
  const [result, setResult] = useState<ImportResponseDtoData>()
  const revealEpoch = useRef(0)
  const cancelReveal = useCallback(() => {
    revealEpoch.current++
  }, [])
  const clearSecret = useCallback(() => {
    cancelReveal()
    setSecret(undefined)
  }, [cancelReveal])
  const retrySeconds = useAdminRetryDelay()
  const query = useLicenseKeyList({ subscriptionId, page, pageSize: 20 })
  const feedback = useItMutationFeedback([getLicenseKeyListQueryKey()])
  useEffect(() => {
    const hideWhenBackgrounded = () => {
      if (document.hidden) clearSecret()
    }
    window.addEventListener('blur', clearSecret)
    document.addEventListener('visibilitychange', hideWhenBackgrounded)
    return () => {
      cancelReveal()
      window.removeEventListener('blur', clearSecret)
      document.removeEventListener('visibilitychange', hideWhenBackgrounded)
    }
  }, [clearSecret, cancelReveal])
  useEffect(() => {
    if (!secret) return
    const timer = window.setTimeout(clearSecret, 30000)
    return () => window.clearTimeout(timer)
  }, [secret, clearSecret])
  const reveal = useMutation({
    gcTime: 0,
    retry: false,
    mutationFn: async (id: string) => {
      const epoch = ++revealEpoch.current
      setSecret(undefined)
      const response = await licenseKeyReveal(id)
      if (response.data && epoch === revealEpoch.current) setSecret(response.data)
    },
    onError: feedback.onError,
    onSuccess: () => setRevealId(undefined)
  })
  const imported = useMutation({
    gcTime: 0,
    retry: false,
    mutationFn: async () => {
      const response = await licenseKeyImport({
        subscriptionId,
        keys: text
          .split('\n')
          .map((value) => value.trim())
          .filter(Boolean)
      })
      setResult(response.data)
      setText('')
    },
    onSuccess: feedback.onSuccess,
    onError: feedback.onError
  })
  const keys = text
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean)
  const invalid = keys.length === 0 || keys.length > 1000 || keys.some((value) => value.length > 512)
  return (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>{translate('keys.revealHint')}</p>
      <ItQueryState query={query}>
        <div className='space-y-3'>
          {query.data?.data?.items.map((key) => (
            <article
              key={key.id}
              className='flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-3'
            >
              <div>
                <p className='break-all font-mono text-sm'>{secret?.id === key.id ? secret.value : key.masked}</p>
                <p className='text-xs text-muted-foreground'>
                  {translate(`keyStates.${Object.hasOwn(CatalogKeyStatus, key.status) ? key.status : 'UNKNOWN'}`, {
                    defaultValue: translate('unknown')
                  })}
                </p>
              </div>
              <button
                className={itButtonClass}
                disabled={reveal.isPending || retrySeconds > 0}
                aria-busy={reveal.isPending}
                onClick={() => {
                  if (secret?.id === key.id) clearSecret()
                  else {
                    clearSecret()
                    setRevealId(key.id)
                  }
                }}
              >
                {retrySeconds > 0
                  ? common('retryIn', { count: retrySeconds })
                  : translate(
                      secret?.id === key.id ? 'keys.hide' : reveal.isPending ? 'keys.revealing' : 'keys.reveal'
                    )}
              </button>
            </article>
          ))}
          {query.data?.data?.items.length === 0 && <ItEmpty />}
        </div>
      </ItQueryState>
      <ItPagination
        page={page}
        total={query.data?.data?.pagination.totalItems ?? 0}
        pageSize={20}
        onChange={(value) => {
          clearSecret()
          setPage(value)
        }}
        disabled={reveal.isPending}
      />
      <form
        className='space-y-3'
        onSubmit={(event) => {
          event.preventDefault()
          if (!invalid && !imported.isPending && !retrySeconds) imported.mutate()
        }}
      >
        <ItField label={translate('keys.lines')}>
          <textarea
            autoComplete='off'
            spellCheck={false}
            placeholder={translate('placeholders.keys')}
            value={text}
            disabled={imported.isPending}
            className={itInputClass}
            onChange={(event) => setText(event.target.value)}
          />
        </ItField>
        <p className='text-xs text-muted-foreground'>{translate('keys.limit')}</p>
        <button
          className={itButtonClass}
          disabled={invalid || imported.isPending || retrySeconds > 0 || query.isError}
          aria-busy={imported.isPending}
        >
          <ItPendingIcon pending={imported.isPending} />
          {retrySeconds > 0
            ? common('retryIn', { count: retrySeconds })
            : translate(imported.isPending ? 'keys.importing' : 'keys.import')}
        </button>
      </form>
      {result && (
        <div className='space-y-2'>
          <p>{translate('keys.result', { count: result.imported })}</p>
          {result.errors.map((error) => (
            <p key={error.line} className='text-sm text-danger'>
              {translate('import.row', { number: error.line })} ·{' '}
              {translate(`keyErrors.${error.code}`, { defaultValue: translate('keys.invalidLine') })}
            </p>
          ))}
          {result.summary.warning && (
            <p className='text-sm text-muted-foreground'>
              {translate(`keyWarnings.${result.summary.warning}`, { defaultValue: translate('unknown') })}
            </p>
          )}
        </div>
      )}
      {revealId && (
        <ItFormDialog
          title={translate('keys.reveal')}
          pending={reveal.isPending}
          submitLabel={translate('keys.confirmReveal')}
          onClose={() => setRevealId(undefined)}
          onSubmit={(event) => {
            event.preventDefault()
            if (!reveal.isPending) reveal.mutate(revealId)
          }}
        >
          <p className='text-sm'>{translate('keys.revealConfirm')}</p>
        </ItFormDialog>
      )}
    </div>
  )
}
