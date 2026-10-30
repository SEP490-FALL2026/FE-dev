import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getNonWorkingDateListQueryKey,
  useNonWorkingDateList
} from '~/shared/api/generated/operations/operating-parameters/non-working-date-list'
import { useNonWorkingDateAdd } from '~/shared/api/generated/operations/operating-parameters/non-working-date-add'
import { useNonWorkingDateRename } from '~/shared/api/generated/operations/operating-parameters/non-working-date-rename'
import { useNonWorkingDateRemove } from '~/shared/api/generated/operations/operating-parameters/non-working-date-remove'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { AdminField, AdminFormDialog, adminButtonClass, adminInputClass } from '../../shared/components/admin-form'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { useDashboardFormat } from '../../../dashboard-ui'

type EditingDate = { mode: 'add' | 'rename' | 'remove'; date: string; reason: string }
export function NonWorkingDates() {
  const { t: translate } = useTranslation('admin')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const query = useNonWorkingDateList({ page, pageSize: 20, ...(from ? { from } : {}), ...(to ? { to } : {}) })
  const [editing, setEditing] = useState<EditingDate | null>(null)
  const feedback = useAdminMutationFeedback([getNonWorkingDateListQueryKey()], () => setEditing(null))
  const add = useNonWorkingDateAdd({ mutation: feedback })
  const rename = useNonWorkingDateRename({ mutation: feedback })
  const remove = useNonWorkingDateRemove({ mutation: feedback })
  const pending = add.isPending || rename.isPending || remove.isPending
  const items = query.data?.data?.items ?? []
  return (
    <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='font-semibold'>{translate('settings.holidays')}</h2>
        <button
          type='button'
          className={adminButtonClass}
          onClick={() => setEditing({ mode: 'add', date: '', reason: '' })}
        >
          {translate('settings.addDate')}
        </button>
      </div>
      <div className='grid max-w-xl gap-3 sm:grid-cols-2'>
        <AdminField label={translate('settings.from')}>
          <input
            type='date'
            className={adminInputClass}
            value={from}
            onChange={(event) => {
              setFrom(event.target.value)
              setPage(1)
            }}
          />
        </AdminField>
        <AdminField label={translate('settings.to')}>
          <input
            type='date'
            min={from || undefined}
            className={adminInputClass}
            value={to}
            onChange={(event) => {
              setTo(event.target.value)
              setPage(1)
            }}
          />
        </AdminField>
      </div>
      <AdminQueryState query={query}>
        {!items.length && <AdminEmpty />}
        <ul className='divide-y divide-border/40'>
          {items.map((item) => (
            <li key={item.date} className='flex items-center gap-4 py-3'>
              <time className='font-mono text-sm tabular-nums' dateTime={item.date}>
                {formatDate(item.date)}
              </time>
              <p className='min-w-0 flex-1 truncate text-sm' title={item.reason}>
                {item.reason}
              </p>
              <details className='relative'>
                <summary className={`${adminButtonClass} cursor-pointer`}>{translate('actions')}</summary>
                <div className='absolute right-0 z-10 mt-1 grid min-w-40 gap-1 rounded-md border border-border bg-surface p-2 shadow-lg'>
                  <button
                    type='button'
                    className={adminButtonClass}
                    onClick={() => setEditing({ mode: 'rename', ...item })}
                  >
                    {translate('edit')}
                  </button>
                  <button
                    type='button'
                    className={adminButtonClass}
                    onClick={() => setEditing({ mode: 'remove', ...item })}
                  >
                    {translate('remove')}
                  </button>
                </div>
              </details>
            </li>
          ))}
        </ul>
        <AdminPagination pagination={query.data?.data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
      {editing && (
        <AdminFormDialog
          title={translate(
            `settings.${editing.mode === 'add' ? 'addDate' : editing.mode === 'rename' ? 'renameDate' : 'removeDate'}`
          )}
          pending={pending}
          danger={editing.mode === 'remove'}
          onClose={() => setEditing(null)}
          onSubmit={(event) => {
            event.preventDefault()
            if (editing.mode === 'add') add.mutate({ data: { date: editing.date, reason: editing.reason.trim() } })
            else if (editing.mode === 'rename')
              rename.mutate({ date: editing.date, data: { reason: editing.reason.trim() } })
            else remove.mutate({ date: editing.date })
          }}
        >
          <AdminField label={translate('settings.date')}>
            <input
              type='date'
              required
              readOnly={editing.mode !== 'add'}
              className={adminInputClass}
              value={editing.date}
              onChange={(event) => setEditing({ ...editing, date: event.target.value })}
            />
          </AdminField>
          {editing.mode === 'remove' ? (
            <p>{translate('settings.confirmRemove')}</p>
          ) : (
            <AdminField label={translate('settings.reason')}>
              <input
                required
                maxLength={1000}
                className={adminInputClass}
                value={editing.reason}
                onChange={(event) => setEditing({ ...editing, reason: event.target.value })}
              />
            </AdminField>
          )}
        </AdminFormDialog>
      )}
    </section>
  )
}
