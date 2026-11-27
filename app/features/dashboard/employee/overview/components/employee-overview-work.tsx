import { ArrowRight, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccessRequestDraftList } from '~/shared/api/generated/operations/access-requests/access-request-draft-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { EmployeeTabKey } from '../../enums'

/** Draft navigation stays separate from the dashboard's four backend metrics. */
export function EmployeeOverviewWork({
  selfServiceOnly,
  onSelectTab
}: {
  selfServiceOnly: boolean
  onSelectTab: (tab: EmployeeTabKey) => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatNumber } = useDashboardFormat()
  const drafts = useAccessRequestDraftList({ page: 1, pageSize: 1 }, { query: { enabled: !selfServiceOnly } })
  if (selfServiceOnly) return null
  const total = drafts.data?.data?.pagination.totalItems
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <button
        type='button'
        aria-label={translate('redesign.savedDrafts')}
        className='group flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-left text-primary-ink transition-colors hover:bg-primary-soft'
        onClick={() => onSelectTab('my-requests')}
      >
        <span className='grid size-8 shrink-0 place-items-center rounded-md bg-primary-soft'>
          <FileText aria-hidden strokeWidth={1.5} className='size-4.5' />
        </span>
        <span className='flex min-w-0 flex-1 items-center gap-2'>
          <span className='text-sm'>{translate('redesign.savedDrafts')}</span>
          {drafts.isPending ? (
            <span
              role='status'
              aria-label={translate('loading')}
              className='block h-5 w-8 animate-pulse rounded bg-primary-soft'
            />
          ) : (
            <span className='font-mono text-sm font-semibold tabular-nums'>
              {drafts.isError || total === undefined ? translate('noValue') : formatNumber(total)}
            </span>
          )}
        </span>
        <ArrowRight
          aria-hidden
          strokeWidth={1.5}
          className='size-4 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5'
        />
      </button>
      {drafts.isError && (
        <button
          type='button'
          className='min-h-11 rounded-md px-3 text-sm text-primary-ink hover:bg-primary-soft'
          onClick={() => void drafts.refetch()}
        >
          {translate('retry')}
        </button>
      )}
    </div>
  )
}
