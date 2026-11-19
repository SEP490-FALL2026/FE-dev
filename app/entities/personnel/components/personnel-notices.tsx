import { ArrowRightLeft, ArrowUpRight, CalendarDays, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMeDepartmentTransferGet } from '~/shared/api/generated/operations/me/me-department-transfer-get'
import { useMeDepartureNoticeGet } from '~/shared/api/generated/operations/me/me-departure-notice-get'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { TRANSFER_RIGHT_STATE } from '../enums/transfer-right-state'

const buttonClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border/70 bg-surface px-3 text-sm font-medium transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50'

/** Self-service personnel notices, shared by the Employee and Manager workspaces. */
export function PersonnelNotices({ onRequest }: { onRequest: (planId: string) => void }) {
  const { t } = useTranslation('requestFlow')
  const { formatDate } = useWorkspaceFormat()
  const transfer = useMeDepartmentTransferGet({
    query: { refetchInterval: (query) => (query.state.data?.data ? 60_000 : false) }
  })
  const departure = useMeDepartureNoticeGet({
    query: { refetchInterval: (query) => (query.state.data?.data ? 60_000 : false) }
  })
  const data = !transfer.isError ? transfer.data?.data : null
  const notice = !departure.isError ? departure.data?.data : null
  return (
    <>
      {(transfer.isPending || departure.isPending) && (
        <p role='status' className='text-sm text-muted-foreground'>
          {t('personnel.loading')}
        </p>
      )}
      {(transfer.isError || departure.isError) && (
        <div
          role='alert'
          className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-surface p-4 text-sm'
        >
          <p>{t('personnel.error')}</p>
          <button
            type='button'
            className={buttonClass}
            disabled={transfer.isFetching || departure.isFetching}
            onClick={() => {
              if (transfer.isError) void transfer.refetch()
              if (departure.isError) void departure.refetch()
            }}
          >
            {t('personnel.retry')}
          </button>
        </div>
      )}
      {notice && (
        <section
          aria-label={t('personnel.departure')}
          className='rounded-lg border border-warning/30 bg-warning/10 p-4 sm:p-5'
        >
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <h2 className='flex items-center gap-2 text-sm font-semibold'>
              <CalendarDays aria-hidden strokeWidth={1.5} className='size-4' />
              {t('personnel.departure')}
            </h2>
            <p className='text-right font-mono text-sm tabular-nums'>
              {t('personnel.lastDay', { date: formatDate(notice.lastWorkingDay) })}
            </p>
          </div>
          <p className='mt-3 max-w-prose text-sm text-warning-ink'>{t('personnel.departureHint')}</p>
        </section>
      )}
      {data && (
        <section
          aria-label={t('personnel.transfer')}
          className='rounded-lg border border-primary/25 bg-primary-soft/30 p-4 sm:p-5'
        >
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='min-w-0'>
              <h2 className='flex items-center gap-2 text-sm font-semibold'>
                <ArrowRightLeft aria-hidden strokeWidth={1.5} className='size-4 shrink-0' />
                {t('personnel.transfer')}
              </h2>
              <p className='mt-2 break-words text-base font-medium'>
                {t('personnel.route', { from: data.from.department.name, to: data.to.department.name })}
              </p>
            </div>
            <p className='text-right font-mono text-sm font-medium tabular-nums'>
              {t('personnel.grace', { date: formatDate(data.grace.endsOn) })}
            </p>
          </div>
          <p className='mt-3 max-w-prose text-sm leading-relaxed text-primary-ink'>{t('personnel.guidance')}</p>
          <details className='group mt-4 border-t border-primary/15 pt-3'>
            <summary className='flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-primary'>
              {t('personnel.rights', { count: data.rights.length })}
              <ChevronDown
                aria-hidden
                strokeWidth={1.5}
                className='size-4 transition-transform group-open:rotate-180'
              />
            </summary>
            <ul className='divide-y divide-primary/15'>
              {data.rights.map((right) => (
                <li key={right.assignmentId} className='flex flex-wrap items-center justify-between gap-3 py-3'>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium' title={right.application.name}>
                      {right.application.name}
                    </p>
                    <p className='mt-1 truncate text-xs text-primary-ink' title={right.plan.name}>
                      {right.plan.name}
                    </p>
                  </div>
                  {right.regranted ? (
                    <span className='text-sm text-primary-ink'>{t('personnel.regranted')}</span>
                  ) : right.state === TRANSFER_RIGHT_STATE.ENDED ? (
                    <span className='text-sm text-primary-ink'>{t('personnel.ended')}</span>
                  ) : right.state === TRANSFER_RIGHT_STATE.REVOKING ? (
                    <span className='text-sm text-primary-ink'>{t('personnel.revoking')}</span>
                  ) : right.state === TRANSFER_RIGHT_STATE.HELD ? (
                    <button
                      type='button'
                      className={buttonClass}
                      aria-label={t('personnel.requestPlan', {
                        name: `${right.application.name} · ${right.plan.name}`
                      })}
                      onClick={() => onRequest(right.plan.id)}
                    >
                      {t('personnel.request')}
                      <ArrowUpRight aria-hidden strokeWidth={1.5} className='size-4' />
                    </button>
                  ) : (
                    <span className='text-sm'>{t('unknown')}</span>
                  )}
                </li>
              ))}
            </ul>
            {!data.rights.length && <p className='py-3 text-sm text-primary-ink'>{t('personnel.noRights')}</p>}
          </details>
        </section>
      )}
    </>
  )
}
