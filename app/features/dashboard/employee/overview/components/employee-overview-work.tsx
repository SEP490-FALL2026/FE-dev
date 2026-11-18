import { ArrowRight, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccessRequestDraftList } from '~/shared/api/generated/operations/access-requests/access-request-draft-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { EmployeeTabKey } from '../../enums'

/**
 * Saved-draft total, shown as a compact link inside the overview hero. The total comes from the draft list
 * pagination of the BE; it is kept apart from the four dashboard metrics as before, but no longer as an orphan card.
 */
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
    <button
      type='button'
      aria-label={translate('redesign.savedDrafts')}
      className='hero-stat group flex min-h-11 min-w-44 items-center gap-3 rounded-lg px-3.5 py-2.5 text-left transition-colors'
      onClick={() => onSelectTab('my-requests')}
    >
      <span className='grid size-9 shrink-0 place-items-center rounded-md bg-white/15'>
        <FileText aria-hidden strokeWidth={1.5} className='size-4.5' />
      </span>
      <span className='min-w-0 flex-1'>
        <span className='block text-xs opacity-80'>{translate('redesign.savedDrafts')}</span>
        {drafts.isPending ? (
          <span
            role='status'
            aria-label={translate('loading')}
            className='mt-1 block h-5 w-10 animate-pulse rounded bg-white/25'
          />
        ) : (
          <span className='block font-mono text-lg leading-tight font-semibold'>
            {total === undefined ? translate('noValue') : formatNumber(total)}
          </span>
        )}
      </span>
      <ArrowRight
        aria-hidden
        strokeWidth={1.5}
        className='size-4 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5'
      />
    </button>
  )
}
