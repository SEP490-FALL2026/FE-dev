import { CatalogImportStatus } from '../enums/baseline-import-status'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useSeatBaselineImportGet,
  getSeatBaselineImportGetQueryKey
} from '~/shared/api/generated/operations/seat-baseline-imports/seat-baseline-import-get'
import { useSeatBaselineImportRows } from '~/shared/api/generated/operations/seat-baseline-imports/seat-baseline-import-rows'
import { useSeatBaselineImportConfirm } from '~/shared/api/generated/operations/seat-baseline-imports/seat-baseline-import-confirm'
import { useSeatBaselineImportCancel } from '~/shared/api/generated/operations/seat-baseline-imports/seat-baseline-import-cancel'
import { getSubscriptionListQueryKey } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { getSubscriptionSeatUsageQueryKey } from '~/shared/api/generated/operations/subscriptions/subscription-seat-usage'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'
export function CatalogSeatPreview({
  id,
  subscriptionId,
  closed,
  onReset
}: {
  id: string
  subscriptionId?: string
  closed: boolean
  onReset?: () => void
}) {
  const { t: translate } = useTranslation('itCatalog')
  const [page, setPage] = useState(1)
  const intentKeys = useRef(new Map<number, string>())
  const preview = useSeatBaselineImportGet(id)
  const rows = useSeatBaselineImportRows(id, { page, pageSize: 20 })
  const feedback = useItMutationFeedback([
    getSeatBaselineImportGetQueryKey(id),
    rows.queryKey,
    getSubscriptionListQueryKey(),
    ...(subscriptionId ? [getSubscriptionSeatUsageQueryKey(subscriptionId)] : [])
  ])
  const confirm = useSeatBaselineImportConfirm({ mutation: feedback })
  const cancel = useSeatBaselineImportCancel({ mutation: feedback })
  const data = preview.data?.data
  const pending = confirm.isPending || cancel.isPending
  return (
    <div className='space-y-4'>
      <ItQueryState query={preview}>
        {data && (
          <>
            <h3 className='font-semibold [text-wrap:balance]'>{data.fileName}</h3>
            <p>{translate(`importStates.${data.status}`, { defaultValue: translate('unknown') })}</p>
            <dl className='flex flex-wrap gap-5'>
              {(['totalRows', 'valid', 'errors'] as const).map((key) => (
                <div key={key}>
                  <dt className='text-xs text-muted-foreground'>{translate(`import.${key}`)}</dt>
                  <dd className='font-mono tabular-nums'>{data.summary[key]}</dd>
                </div>
              ))}
            </dl>
            {data.summary.seats && (
              <dl className='flex flex-wrap gap-5'>
                {(['occupiedBefore', 'freeBefore', 'freeAfter'] as const).map((key) => (
                  <div key={key}>
                    <dt className='text-xs text-muted-foreground'>{translate(`import.${key}`)}</dt>
                    <dd className='font-mono tabular-nums'>{data.summary.seats?.[key]}</dd>
                  </div>
                ))}
              </dl>
            )}
            {data.result && (
              <p>{translate('import.result', { count: data.result.created, errors: data.result.errors })}</p>
            )}
            {data.status !== CatalogImportStatus.PREVIEW && onReset && (
              <button className={itButtonClass} onClick={onReset}>
                {translate('import.another')}
              </button>
            )}
            {data.status === CatalogImportStatus.PREVIEW && (
              <>
                <p className='text-sm text-muted-foreground'>{translate('import.confirmHint')}</p>
                <div className='flex flex-wrap gap-3'>
                  <button
                    className={itButtonClass}
                    aria-busy={confirm.isPending}
                    disabled={pending || closed || data.summary.valid === 0 || preview.isFetching}
                    onClick={() => {
                      let idempotencyKey = intentKeys.current.get(data.previewVersion)
                      if (!idempotencyKey) {
                        idempotencyKey = crypto.randomUUID()
                        intentKeys.current.set(data.previewVersion, idempotencyKey)
                      }
                      confirm.mutate({ id, data: { previewVersion: data.previewVersion, idempotencyKey } })
                    }}
                  >
                    {translate(confirm.isPending ? 'import.confirming' : 'import.confirm')}
                  </button>
                  <button
                    className={itButtonClass}
                    disabled={pending}
                    aria-busy={cancel.isPending}
                    onClick={() => cancel.mutate({ id })}
                  >
                    {translate(cancel.isPending ? 'import.cancelling' : 'import.cancel')}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </ItQueryState>
      <ItQueryState query={rows}>
        <div className='space-y-3'>
          {rows.data?.data?.items.map((row) => (
            <article key={row.lineNumber} className='space-y-2 rounded-md border border-border p-3'>
              <p>
                {translate('import.row', { number: row.lineNumber })} ·{' '}
                {translate(`importOutcomes.${row.outcome}`, { defaultValue: translate('unknown') })}
              </p>
              <dl className='grid gap-2 sm:grid-cols-2'>
                {Object.entries(row.cells).map(([key, value]) => (
                  <div key={key}>
                    <dt className='text-xs text-muted-foreground'>
                      {translate(`importColumns.${key}`, { defaultValue: translate('import.unknownColumn') })}
                    </dt>
                    <dd className='break-words text-sm'>{value}</dd>
                  </div>
                ))}
              </dl>
              {row.errors.map((error, index) => (
                <p key={index} className='text-sm text-danger'>
                  {translate(`importErrors.${error.code}`, { defaultValue: translate('import.unknownError') })}
                </p>
              ))}
            </article>
          ))}
          {rows.data?.data?.items.length === 0 && <ItEmpty />}
        </div>
      </ItQueryState>
      <ItPagination
        page={page}
        total={rows.data?.data?.pagination.totalItems ?? 0}
        pageSize={20}
        onChange={setPage}
        disabled={pending}
      />
    </div>
  )
}
