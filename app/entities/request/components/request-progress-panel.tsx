import { useTranslation } from 'react-i18next'
import { useAccessRequestTimingsGet } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { ACCESS_REQUEST_STATE, type AccessRequestState } from '../enums/access-request-state'
import { RequestProcessingProgress } from './request-processing-progress'

/** Timings are supplementary: a failed lookup must not block the request's own actions. */
export function RequestProgressPanel({ id, state }: { id: string; state?: string }) {
  const { t } = useTranslation('requestFlow')
  const query = useAccessRequestTimingsGet(id, { query: { retry: false } })
  const timings = !query.isError ? query.data?.data?.timings : undefined
  const knownState = Object.values(ACCESS_REQUEST_STATE).find((value) => value === state) as
    AccessRequestState | undefined
  return (
    <section className='rounded-xl border border-border/70 bg-surface p-4 shadow-sm sm:p-5'>
      <h2 className='section-accent mb-5 text-lg font-semibold'>{t('progress.title')}</h2>
      {query.isPending && (
        <p role='status' className='text-sm text-muted-foreground'>
          {t('loading')}
        </p>
      )}
      {query.isError && (
        <div role='alert' className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
          <span>{t('loadError')}</span>
          <button
            type='button'
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
            className='min-h-11 rounded-md border border-border px-3 text-foreground hover:bg-surface-subtle'
          >
            {t('retry')}
          </button>
        </div>
      )}
      {query.isSuccess && !timings && <p className='text-sm text-muted-foreground'>{t('unknown')}</p>}
      {timings && <RequestProcessingProgress timings={timings} state={knownState} />}
    </section>
  )
}
