import { useTranslation } from 'react-i18next'
import { useOperatingParameterHistory } from '~/shared/api/generated/operations/operating-parameters/operating-parameter-history'
import { useDashboardFormat } from '../../../dashboard-ui'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { adminButtonClass } from '../../shared/components/admin-form'

export function ParameterHistory({ parameterKey, onClose }: { parameterKey: string; onClose: () => void }) {
  const { t: translate } = useTranslation('admin')
  const query = useOperatingParameterHistory(parameterKey)
  const { formatDateTime } = useDashboardFormat()
  return (
    <section className='space-y-3 rounded-lg border border-border bg-surface p-5'>
      <div className='flex items-center justify-between gap-3'>
        <h2 className='font-semibold'>
          {translate('parameters.history')}
          {' · '}
          {parameterKey}
        </h2>
        <button type='button' className={adminButtonClass} onClick={onClose}>
          {translate('close')}
        </button>
      </div>
      <AdminQueryState query={query}>
        {!query.data?.data?.items.length && <AdminEmpty />}
        {query.data?.data?.items.map((item) => (
          <div key={item.from} className='flex justify-between gap-3 border-b border-border/40 py-3 text-sm'>
            <span className='font-mono tabular-nums'>
              {Array.isArray(item.value) ? item.value.join(', ') : item.value}
            </span>
            <time className='text-right font-mono tabular-nums' dateTime={item.from}>
              {formatDateTime(item.from)}
            </time>
          </div>
        ))}
        {query.data?.data?.hasMore && (
          <p className='text-xs text-muted-foreground'>{translate('parameters.olderHistory')}</p>
        )}
      </AdminQueryState>
    </section>
  )
}
