import { useTranslation } from 'react-i18next'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDashboardFormat } from '~/features/dashboard/dashboard-ui'
import { useUsageNavigation } from '../hooks/use-usage-navigation'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { UsageImportRowListOutcome } from '~/shared/api/generated/model'
import {
  useUsageImportGet,
  getUsageImportGetQueryKey
} from '~/shared/api/generated/operations/usage-imports/usage-import-get'
import { getUsageImportListQueryKey } from '~/shared/api/generated/operations/usage-imports/usage-import-list'
import { useUsageImportRowList } from '~/shared/api/generated/operations/usage-imports/usage-import-row-list'
import { usageImportConfirm } from '~/shared/api/generated/operations/usage-imports/usage-import-confirm'
import { useUsageImportCancel } from '~/shared/api/generated/operations/usage-imports/usage-import-cancel'
import { itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'

export function ImportDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t } = useTranslation('itDepartmentWork')
  const queryClient = useQueryClient()
  const { formatDate } = useDashboardFormat()
  const { params, update, page: readPage } = useUsageNavigation()
  const page = readPage('rowPage')
  const setPage = (value: number) => update({ rowPage: String(value) })
  const outcome = Object.values(UsageImportRowListOutcome).find((value) => value === params.get('rowOutcome'))
  const [notice, setNotice] = useState(false)
  const keys = useRef(new Map<number, string>())
  const preview = useUsageImportGet(id)
  const rows = useUsageImportRowList(id, { page, pageSize: 20, outcome })
  const feedback = useItMutationFeedback([getUsageImportGetQueryKey(id), getUsageImportListQueryKey(), rows.queryKey])
  const confirm = useMutation({
    mutationFn: ({ version, key, sendNotice }: { version: number; key: string; sendNotice: boolean }) =>
      usageImportConfirm(
        id,
        { previewVersion: version, ...(sendNotice ? { notice: 'SYSTEM_SENT' as const } : {}) },
        { headers: { 'Idempotency-Key': key } }
      ),
    ...feedback,
    onSuccess: async () => {
      await feedback.onSuccess()
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some(
            (part) => typeof part === 'string' && /\/(usage-overview|employees\/[^/]+\/usage-software)/.test(part)
          )
      })
    }
  })
  const cancel = useUsageImportCancel({ mutation: feedback })
  const data = preview.data?.data
  const pending = confirm.isPending || cancel.isPending
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {t('back')}
      </button>
      <h1 className='text-2xl font-semibold'>{t('usageImport.preview')}</h1>
      <ItQueryState query={preview}>
        {data && (
          <>
            <p>{t(`usageImport.${data.status}`, { defaultValue: t('unknown') })}</p>
            {data.summary.window && (
              <p className='text-sm text-muted-foreground'>
                {t('usage.period')}: {formatDate(data.summary.window.from)} – {formatDate(data.summary.window.to)}
              </p>
            )}
            {data.summary.activityDefinition && (
              <p className='text-sm'>
                {t('usageImport.activityDefinition')}: {data.summary.activityDefinition}
              </p>
            )}
            {data.result && (
              <section className='space-y-2 rounded-lg border border-border bg-surface p-4'>
                <h2 className='font-medium'>{t('usageImport.result')}</h2>
                <dl className='grid gap-3 sm:grid-cols-3'>
                  {(
                    [
                      'daysWritten',
                      'daysSuperseded',
                      'matched',
                      'unmatched',
                      'ambiguous',
                      'invalid',
                      'notAPerson',
                      'noticesSent'
                    ] as const
                  ).map((key) => (
                    <div key={key}>
                      <dt className='text-sm text-muted-foreground'>
                        {t(`usageImport.${key}`, { defaultValue: t('unknown') })}
                      </dt>
                      <dd className='font-mono tabular-nums'>{data.result![key]}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
            <dl className='grid gap-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-5'>
              {(['totalRows', 'matched', 'unmatched', 'ambiguous', 'invalid'] as const).map((key) => (
                <div key={key}>
                  <dt className='text-sm text-muted-foreground'>{t(`usageImport.${key}`)}</dt>
                  <dd className='text-xl font-semibold tabular-nums'>{data.summary[key]}</dd>
                </div>
              ))}
            </dl>
            {data.summary.duplicateOfImportId && <p className='text-warning-ink'>{t('usageImport.duplicate')}</p>}
            {data.summary.unmappedEventTypes.length > 0 && (
              <p className='text-danger'>{t('usageImport.eventWarning')}</p>
            )}
            {data.status === 'PREVIEW' && (
              <>
                {data.summary.trackingNoticeRequired && (
                  <label className='flex items-start gap-2'>
                    <input type='checkbox' checked={notice} onChange={(event) => setNotice(event.target.checked)} />
                    <span>{t('usageImport.notice')}</span>
                  </label>
                )}
                <div className='flex flex-wrap gap-3'>
                  <button
                    type='button'
                    className={itButtonClass}
                    disabled={
                      pending ||
                      preview.isFetching ||
                      (data.summary.trackingNoticeRequired && !notice) ||
                      data.summary.unmappedEventTypes.length > 0
                    }
                    onClick={() => {
                      let key = keys.current.get(data.previewVersion)
                      if (!key) {
                        key = crypto.randomUUID()
                        keys.current.set(data.previewVersion, key)
                      }
                      confirm.mutate({
                        version: data.previewVersion,
                        key,
                        sendNotice: data.summary.trackingNoticeRequired
                      })
                    }}
                  >
                    {t('usageImport.confirm')}
                  </button>
                  <button
                    type='button'
                    className={itButtonClass}
                    disabled={pending}
                    onClick={() => cancel.mutate({ id })}
                  >
                    {t('usageImport.cancel')}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </ItQueryState>
      <ItChoiceSelect
        label={t('usageImport.outcome')}
        value={outcome ?? ''}
        onChange={(value) => update({ rowOutcome: value, rowPage: undefined })}
        options={[
          { value: '', label: t('usageImport.all') },
          ...Object.values(UsageImportRowListOutcome).map((value) => ({
            value,
            label: t(`usageImport.${value}`, { defaultValue: t('unknown') })
          }))
        ]}
      />
      <ItQueryState query={rows}>
        {rows.data?.data?.items.length ? (
          <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
            {rows.data.data.items.map((row) => (
              <article key={row.lineNumber} className='space-y-1 p-4'>
                <p className='font-medium'>
                  {t('usageImport.row', { number: row.lineNumber })} ·{' '}
                  {t(`usageImport.${row.outcome}`, { defaultValue: t('unknown') })}
                </p>
                <p className='break-all text-sm text-muted-foreground'>{row.identifier}</p>
                {row.errors.length > 0 && <p className='text-sm text-danger'>{t('usageImport.rowError')}</p>}
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItPagination
        page={page}
        pageSize={20}
        total={rows.data?.data?.pagination.totalItems ?? 0}
        onChange={setPage}
        disabled={pending}
      />
    </section>
  )
}
