import { POLICY_ACKNOWLEDGEMENT } from '../enums/policy-acknowledgement'
import { ScrollText } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { usePolicyList } from '~/shared/api/generated/operations/policies/policy-list'
import { usePolicyVersionList } from '~/shared/api/generated/operations/policies/policy-version-list'
import { SearchableSelect } from '~/shared/ui/searchable-select'
import { WorkspacePageHeader } from '~/shared/ui/workspace-page-header'
import { PolicyReader } from './policy-reader'

export function PolicyLibrary({ eyebrow }: { eyebrow?: string } = {}) {
  const { t } = useTranslation('policy')
  const [params, setParams] = useSearchParams()
  const list = usePolicyList({ page: 1, pageSize: 20 })
  const items = !list.isError ? list.data?.data?.items : undefined
  const requested = params.get('policyCode') ?? ''
  const code = /^POL-[A-Z0-9]+$/.test(requested) ? requested : ''
  const rawVersion = Number(params.get('version'))
  const version = Number.isInteger(rawVersion) && rawVersion > 0 ? rawVersion : undefined
  const select = (policyCode: string, selectedVersion?: number) => {
    const next = new URLSearchParams(params)
    if (policyCode) next.set('policyCode', policyCode)
    else next.delete('policyCode')
    if (selectedVersion) next.set('version', String(selectedVersion))
    else next.delete('version')
    setParams(next)
  }
  return (
    <div className='space-y-5'>
      <div className='page-banner'>
        <WorkspacePageHeader
          eyebrow={eyebrow ?? t('library.eyebrow')}
          title={t('library.title')}
          description={t('library.description')}
          icon={ScrollText}
        />
      </div>
      {code ? (
        <>
          <button
            type='button'
            className='min-h-11 rounded-md border border-border px-4 text-sm'
            onClick={() => select('')}
          >
            {t('library.back')}
          </button>
          <PolicyVersions key={code} code={code} version={version} onSelect={(value) => select(code, value)} />
          <PolicyReader key={`${code}:${version ?? 'current'}`} code={code} version={version} />
        </>
      ) : (
        <>
          {list.isPending ? (
            <p role='status'>{t('gate.loading')}</p>
          ) : list.isError || !items ? (
            <div role='alert' className='space-y-3'>
              <p>{t('gate.loadError')}</p>
              <button
                type='button'
                className='min-h-11 rounded-md border px-4'
                disabled={list.isFetching}
                onClick={() => void list.refetch()}
              >
                {t('gate.retry')}
              </button>
            </div>
          ) : !items.length ? (
            <p>{t('library.empty')}</p>
          ) : (
            <ul className='divide-y divide-border/50 rounded-lg border border-border/60 bg-surface'>
              {items.map((item) => (
                <li key={item.code}>
                  <button
                    type='button'
                    className='flex min-h-16 w-full flex-wrap items-center justify-between gap-3 p-4 text-left hover:bg-surface-subtle'
                    onClick={() => select(item.code)}
                  >
                    <span className='min-w-0'>
                      <span className='block font-medium'>{item.title}</span>
                      <span className='font-mono text-xs text-muted-foreground'>
                        {item.code} · {t('gate.version', { version: item.versionNumber })}
                      </span>
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {item.myAcknowledgement === POLICY_ACKNOWLEDGEMENT.PENDING
                        ? t('library.pending')
                        : item.myAcknowledgement === POLICY_ACKNOWLEDGEMENT.DONE
                          ? t('library.done')
                          : t('library.notRequired')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

/** Option value for the current version (the URL has no `version` param). */
const CURRENT_VERSION = 'current'

function PolicyVersions({
  code,
  version,
  onSelect
}: {
  code: string
  version?: number
  onSelect: (version?: number) => void
}) {
  const { t } = useTranslation('policy')
  const [page, setPage] = useState(1)
  const query = usePolicyVersionList(code, { page, pageSize: 20 })
  const data = !query.isError ? query.data?.data : null
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <label className='text-sm' htmlFor='policy-version'>
        {t('library.versions')}
      </label>
      <SearchableSelect
        id='policy-version'
        className='w-56 max-w-full'
        value={version ? String(version) : CURRENT_VERSION}
        placeholder={t('library.current')}
        loading={query.isFetching}
        options={[
          { value: CURRENT_VERSION, label: t('library.current') },
          ...(version && !data?.items.some((item) => item.versionNumber === version)
            ? [{ value: String(version), label: t('gate.version', { version }) }]
            : []),
          ...(data?.items ?? []).map((item) => ({
            value: String(item.versionNumber),
            label: t('gate.version', { version: item.versionNumber }),
            description: item.changeNote ?? undefined
          }))
        ]}
        onChange={(value) => onSelect(value && value !== CURRENT_VERSION ? Number(value) : undefined)}
      />
      {query.isError && (
        <button type='button' className='min-h-11 px-3 text-sm' onClick={() => void query.refetch()}>
          {t('gate.retry')}
        </button>
      )}
      {data && data.pagination.totalPages > 1 && (
        <>
          <button
            type='button'
            className='min-h-11 px-3 text-sm'
            disabled={page <= 1 || query.isFetching}
            onClick={() => setPage(page - 1)}
          >
            {t('library.previous')}
          </button>
          <button
            type='button'
            className='min-h-11 px-3 text-sm'
            disabled={page >= data.pagination.totalPages || query.isFetching}
            onClick={() => setPage(page + 1)}
          >
            {t('library.next')}
          </button>
        </>
      )}
    </div>
  )
}
