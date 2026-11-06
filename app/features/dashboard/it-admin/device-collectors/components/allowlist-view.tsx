import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  useCollectorAllowlistEntryList,
  getCollectorAllowlistEntryListQueryKey
} from '~/shared/api/generated/operations/collector-allowlist/collector-allowlist-entry-list'
import { collectorAllowlistVersionCreate } from '~/shared/api/generated/operations/collector-allowlist/collector-allowlist-version-create'
import type { AllowlistEntryPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/collector-allowlist'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ItField, ItFormDialog, itInputClass, itPrimaryClass } from '../../shared/components/it-form'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { AiTool } from '../enums/ai-tool'

export function AllowlistView() {
  const { t: translate } = useTranslation('itDevices')
  const { formatDateTime } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const query = useCollectorAllowlistEntryList({ page, pageSize: 20 })
  const data = query.data?.data
  return (
    <div className='space-y-4'>
      <button type='button' className={itPrimaryClass} onClick={() => setOpen(true)}>
        {translate('publish')}
      </button>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/40 rounded-lg border border-border bg-surface px-4'>
            {data.items.map((item) => (
              <article className='space-y-1 py-4 text-sm' key={`${item.kind}-${item.key}`}>
                <p>
                  {translate(`values.${item.key}`, { defaultValue: item.key })}
                  {item.experimental && (
                    <span className='ml-2 text-xs text-muted-foreground'>{translate('experimental')}</span>
                  )}
                </p>
                <p className='max-w-96 truncate' title={item.application.name}>
                  {item.application.name}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {translate('versionNumber')}: {item.versionNumber} · {formatDateTime(item.publishedAt)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && (
        <ItPagination
          page={page}
          total={data.pagination.totalItems}
          pageSize={20}
          onChange={setPage}
          disabled={query.isFetching}
        />
      )}
      {open && <AllowlistLoader onClose={() => setOpen(false)} />}
    </div>
  )
}

function AllowlistLoader({ onClose }: { onClose: () => void }) {
  const query = useCollectorAllowlistEntryList({ page: 1, pageSize: 100 })
  const { t: translate } = useTranslation('itDevices')
  if (!query.data?.data)
    return (
      <ItFormDialog
        title={translate('publish')}
        onClose={onClose}
        pending={false}
        submitDisabled
        onSubmit={(event) => event.preventDefault()}
      >
        <ItQueryState query={query}>
          <ItEmpty />
        </ItQueryState>
      </ItFormDialog>
    )
  return <AllowlistDialog entries={query.data.data.items} onClose={onClose} />
}

function AllowlistDialog({
  entries,
  onClose
}: {
  entries: AllowlistEntryPageResponseDtoDataItemsItem[]
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itDevices')
  const [reason, setReason] = useState('')
  const [mapping, setMapping] = useState(() =>
    Object.values(AiTool).map((tool) => ({
      tool,
      applicationId: entries.find((item) => item.key === tool)?.application.id ?? '',
      enabled: entries.some((item) => item.key === tool)
    }))
  )
  const feedback = useItMutationFeedback([getCollectorAllowlistEntryListQueryKey()], onClose)
  const mutation = useMutation({
    mutationFn: () =>
      collectorAllowlistVersionCreate({
        reason,
        aiTools: mapping.filter((item) => item.enabled).map(({ tool, applicationId }) => ({ tool, applicationId }))
      }),
    retry: false,
    ...feedback
  })
  const enabled = mapping.filter((item) => item.enabled)
  const valid =
    enabled.every((item) => /^[0-9a-fA-F-]{36}$/.test(item.applicationId)) &&
    new Set(enabled.map((item) => item.applicationId)).size === enabled.length
  return (
    <ItFormDialog
      wide
      title={translate('publish')}
      onClose={onClose}
      pending={mutation.isPending}
      submitLabel={translate('publish')}
      submitDisabled={!valid}
      onSubmit={(event) => {
        event.preventDefault()
        if (valid) mutation.mutate()
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate('hints.allowlist')}</p>
      <ItField label={translate('reason')} hint={translate('hints.reason')}>
        <input
          className={itInputClass}
          required
          maxLength={1000}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </ItField>
      {mapping.map((item, index) => (
        <section key={item.tool} className='space-y-3 border-t border-border/40 pt-4'>
          <label className='flex items-center gap-2 text-sm font-medium'>
            <input
              type='checkbox'
              checked={item.enabled}
              onChange={(event) =>
                setMapping(
                  mapping.map((entry, entryIndex) =>
                    entryIndex === index ? { ...entry, enabled: event.target.checked } : entry
                  )
                )
              }
            />
            {translate(`values.${item.tool}`)}
          </label>
          {item.enabled && (
            <ItField label={translate('applicationId')} hint={translate('hints.applicationId')}>
              <input
                className={itInputClass}
                required
                pattern='[0-9a-fA-F-]{36}'
                value={item.applicationId}
                onChange={(event) =>
                  setMapping(
                    mapping.map((entry, entryIndex) =>
                      entryIndex === index ? { ...entry, applicationId: event.target.value } : entry
                    )
                  )
                }
              />
            </ItField>
          )}
        </section>
      ))}
    </ItFormDialog>
  )
}
