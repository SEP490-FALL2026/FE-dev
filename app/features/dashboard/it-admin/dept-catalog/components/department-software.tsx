import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useDepartmentSoftwareList,
  getDepartmentSoftwareListQueryKey
} from '~/shared/api/generated/operations/department-software-list/department-software-list'
import { useDepartmentSoftwareListChange } from '~/shared/api/generated/operations/department-software-list/department-software-list-change'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItFormDialog, itButtonClass, itPrimaryClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { DepartmentSoftwareAdd } from './department-software-add'

export function DepartmentSoftware({
  departmentId,
  departmentName,
  onBack,
  canManage = false
}: {
  departmentId: string
  departmentName: string
  onBack: () => void
  canManage?: boolean
}) {
  const { t: translate } = useTranslation('itDepartmentSoftware')
  const { formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [adding, setAdding] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const query = useDepartmentSoftwareList(departmentId, { page, pageSize: 20 })
  const feedback = useItMutationFeedback([getDepartmentSoftwareListQueryKey(departmentId)], () => {
    setReviewing(false)
    setSelected({})
  })
  const mutation = useDepartmentSoftwareListChange({ mutation: feedback })
  const remove = Object.keys(selected)
  if (adding) return <DepartmentSoftwareAdd departmentId={departmentId} onClose={() => setAdding(false)} />
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {translate('back')}
      </button>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-semibold'>{translate('title')}</h1>
          <p className='text-sm text-muted-foreground'>{departmentName}</p>
        </div>
        <button
          type='button'
          className={itPrimaryClass}
          onClick={() => setAdding(true)}
          disabled={!canManage || query.isError}
        >
          {translate('add')}
        </button>
      </header>
      <p className='max-w-3xl text-sm text-muted-foreground'>{translate('description')}</p>
      {!canManage && <p className='text-sm text-muted-foreground'>{translate('readOnly')}</p>}
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
            {query.data.data.items.map((item) => {
              const name = `${item.applicationName} · ${item.planName ?? translate('wholeApplication')}`
              return (
                <label key={item.entryId} className='flex items-start gap-3 p-4'>
                  <input
                    type='checkbox'
                    className='mt-1 size-5 shrink-0'
                    aria-label={translate('remove', { name })}
                    checked={!!selected[item.entryId]}
                    disabled={!canManage || mutation.isPending || query.isFetching}
                    onChange={(event) =>
                      setSelected((previous) => {
                        const next = { ...previous }
                        if (event.target.checked) next[item.entryId] = name
                        else delete next[item.entryId]
                        return next
                      })
                    }
                  />
                  <div className='min-w-0 flex-1'>
                    <h2 className='break-words font-medium'>{name}</h2>
                    {item.note && <p className='whitespace-pre-wrap text-sm text-muted-foreground'>{item.note}</p>}
                    <p className='mt-1 text-right font-mono text-xs tabular-nums text-muted-foreground'>
                      {translate('addedAt')}: {formatDateTime(item.addedAt)}
                    </p>
                  </div>
                </label>
              )
            })}
          </div>
        ) : (
          <p role='status' className='p-6 text-sm text-muted-foreground'>
            {translate('empty')}
          </p>
        )}
      </ItQueryState>
      <ItPagination page={page} pageSize={20} total={query.data?.data?.pagination.totalItems ?? 0} onChange={setPage} />
      <button
        type='button'
        className={itButtonClass}
        disabled={!canManage || !remove.length || remove.length > 50 || query.isFetching || mutation.isPending}
        onClick={() => setReviewing(true)}
      >
        {translate('review')}
      </button>
      {reviewing && (
        <ItFormDialog
          title={translate('review')}
          submitLabel={translate('confirm')}
          pending={mutation.isPending}
          onClose={() => setReviewing(false)}
          onSubmit={(event) => {
            event.preventDefault()
            if (remove.length && !mutation.isPending) mutation.mutate({ id: departmentId, data: { remove } })
          }}
        >
          <p>{translate('reviewHint', { count: remove.length })}</p>
          <ul className='list-inside list-disc space-y-1 text-sm'>
            {Object.entries(selected).map(([id, name]) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
        </ItFormDialog>
      )}
    </section>
  )
}
