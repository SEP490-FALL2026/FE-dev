import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ThresholdListResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import {
  getGhostSeatThresholdListQueryKey,
  useGhostSeatThresholdList
} from '~/shared/api/generated/operations/ghost-seats/ghost-seat-threshold-list'
import { useGhostSeatThresholdSet } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-threshold-set'
import { useGhostSeatThresholdDelete } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-threshold-delete'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  AdminField,
  AdminFormDialog,
  adminButtonClass,
  adminInputClass,
  adminPrimaryClass
} from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { ApplicationPicker } from './application-picker'

const dayFields = ['monitorDays', 'reviewDays', 'actionDays'] as const
type Editor = {
  applicationId: string
  applicationName: string
  monitorDays: string
  reviewDays: string
  actionDays: string
  existing: boolean
}
export function Thresholds() {
  const { t: translate } = useTranslation('admin')
  const { formatDate, formatNumber } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useGhostSeatThresholdList({ page, pageSize: 20 })
  const [editing, setEditing] = useState<Editor | null>(null)
  const [invalid, setInvalid] = useState(false)
  const [removing, setRemoving] = useState<ThresholdListResponseDtoDataItemsItem | null>(null)
  const feedback = useAdminMutationFeedback([getGhostSeatThresholdListQueryKey()], () => {
    setEditing(null)
    setRemoving(null)
  })
  const update = useGhostSeatThresholdSet({ mutation: feedback })
  const remove = useGhostSeatThresholdDelete({ mutation: feedback })
  const items = query.data?.data?.items ?? []
  const pending = update.isPending || remove.isPending
  return (
    <section className='space-y-4'>
      <div className='flex flex-wrap justify-between gap-3'>
        <p className='max-w-3xl text-sm text-muted-foreground'>{translate('ghostSeats.thresholds.future')}</p>
        <button
          type='button'
          disabled={pending}
          className={adminPrimaryClass}
          onClick={() => {
            setInvalid(false)
            setEditing({
              applicationId: '',
              applicationName: '',
              monitorDays: '',
              reviewDays: '',
              actionDays: '',
              existing: false
            })
          }}
        >
          {translate('ghostSeats.thresholds.add')}
        </button>
      </div>
      <AdminQueryState query={query}>
        {!items.length && <AdminEmpty />}
        <div className='divide-y divide-border/40'>
          {items.map((item) => (
            <article key={item.applicationId} className='flex flex-wrap items-center justify-between gap-4 py-4'>
              <div className='min-w-0'>
                <h2 className='max-w-80 truncate font-medium' title={item.applicationName}>
                  {item.applicationName}
                </h2>
                <p className='mt-1 font-mono text-sm tabular-nums'>
                  {translate('ghostSeats.thresholds.sequence', {
                    monitor: formatNumber(item.monitorDays),
                    review: formatNumber(item.reviewDays),
                    action: formatNumber(item.actionDays)
                  })}
                </p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {translate('ghostSeats.thresholds.updated', { date: formatDate(item.updatedAt) })}
                </p>
              </div>
              <details className='relative'>
                <summary className={`${adminButtonClass} cursor-pointer`}>{translate('actions')}</summary>
                <div className='absolute right-0 z-10 mt-1 grid min-w-60 gap-1 rounded-md border border-border bg-surface p-2 shadow-lg'>
                  <button
                    type='button'
                    disabled={pending}
                    className={adminButtonClass}
                    aria-label={translate('ghostSeats.thresholds.edit', { name: item.applicationName })}
                    onClick={() => {
                      setInvalid(false)
                      setEditing({
                        ...item,
                        monitorDays: String(item.monitorDays),
                        reviewDays: String(item.reviewDays),
                        actionDays: String(item.actionDays),
                        existing: true
                      })
                    }}
                  >
                    {translate('edit')}
                  </button>
                  <button
                    type='button'
                    disabled={pending}
                    className={adminButtonClass}
                    aria-label={translate('ghostSeats.thresholds.restore', { name: item.applicationName })}
                    onClick={() => setRemoving(item)}
                  >
                    {translate('ghostSeats.thresholds.restoreTitle')}
                  </button>
                </div>
              </details>
            </article>
          ))}
        </div>
        <AdminPagination pagination={query.data?.data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
      {editing && (
        <AdminFormDialog
          wide={!editing.existing}
          title={
            editing.existing
              ? translate('ghostSeats.thresholds.edit', { name: editing.applicationName })
              : translate('ghostSeats.thresholds.add')
          }
          pending={update.isPending}
          onClose={() => setEditing(null)}
          submitDisabled={!editing.applicationId}
          onSubmit={(event) => {
            event.preventDefault()
            const [monitorDays, reviewDays, actionDays] = dayFields.map((key) => Number(editing[key]))
            if (
              ![monitorDays, reviewDays, actionDays].every(
                (value) => Number.isInteger(value) && value >= 1 && value <= 365
              ) ||
              monitorDays >= reviewDays ||
              reviewDays >= actionDays
            ) {
              setInvalid(true)
              return
            }
            setInvalid(false)
            update.mutate({ applicationId: editing.applicationId, data: { monitorDays, reviewDays, actionDays } })
          }}
        >
          {!editing.existing && (
            <ApplicationPicker
              onSelect={(applicationId, applicationName) => setEditing({ ...editing, applicationId, applicationName })}
            />
          )}
          {dayFields.map((key) => (
            <AdminField
              key={key}
              label={translate(`ghostSeats.thresholds.${key}`)}
              description={translate('ghostSeats.thresholds.daysHelp')}
              error={invalid && key === 'actionDays' ? translate('ghostSeats.thresholds.invalid') : undefined}
            >
              <input
                required
                type='number'
                min={1}
                max={365}
                step={1}
                aria-invalid={invalid || undefined}
                className={adminInputClass}
                value={editing[key]}
                onChange={(event) => {
                  setInvalid(false)
                  setEditing({ ...editing, [key]: event.target.value })
                }}
              />
            </AdminField>
          ))}
          <p className='text-sm text-muted-foreground'>{translate('ghostSeats.thresholds.future')}</p>
        </AdminFormDialog>
      )}
      {removing && (
        <AdminFormDialog
          title={translate('ghostSeats.thresholds.restoreTitle')}
          pending={remove.isPending}
          submitLabel={translate('ghostSeats.thresholds.restoreTitle')}
          onClose={() => setRemoving(null)}
          onSubmit={(event) => {
            event.preventDefault()
            remove.mutate({ applicationId: removing.applicationId })
          }}
        >
          <p className='font-medium'>{removing.applicationName}</p>
          <p className='text-sm text-muted-foreground'>{translate('ghostSeats.thresholds.restoreHelp')}</p>
        </AdminFormDialog>
      )}
    </section>
  )
}
