import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { usePlanList } from '~/shared/api/generated/operations/plans/plan-list'
import {
  departmentSoftwareList,
  getDepartmentSoftwareListQueryKey
} from '~/shared/api/generated/operations/department-software-list/department-software-list'
import { useDepartmentSoftwareListChange } from '~/shared/api/generated/operations/department-software-list/department-software-list-change'
import { useCatalogSearch } from '~/shared/hooks/use-catalog-search'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'

export function DepartmentSoftwareEditor({ departmentId, onClose }: { departmentId: string; onClose: () => void }) {
  const { t } = useTranslation('itDepartmentSoftware')
  const { t: translatePlaceholder } = useTranslation('itPlaceholders')
  const { draft, setDraft, search, page, setPage } = useCatalogSearch()
  const [changes, setChanges] = useState<Record<string, { checked: boolean; applicationId: string }>>({})
  const [removedApplications, setRemovedApplications] = useState<Record<string, boolean>>({})
  const existing = useQuery({
    queryKey: [...getDepartmentSoftwareListQueryKey(departmentId), 'editor-all'],
    queryFn: async () => {
      const items = []
      let page = 1
      let totalPages = 1
      while (page <= totalPages) {
        const response = await departmentSoftwareList(departmentId, { page, pageSize: 100 })
        if (!response.data) throw new Error('Missing department software page')
        items.push(...response.data.items)
        totalPages = response.data.pagination.totalPages
        page++
      }
      return items
    }
  })
  const plans = usePlanList({ status: 'APPROVED', search: search || undefined, page, pageSize: 20 })
  const feedback = useItMutationFeedback([getDepartmentSoftwareListQueryKey(departmentId)], onClose)
  const mutation = useDepartmentSoftwareListChange({ mutation: feedback })
  const initial = new Map((existing.data ?? []).filter((item) => item.planId).map((item) => [item.planId!, item]))
  const add = Object.entries(changes)
    .filter(([id, change]) => change.checked && !initial.has(id))
    .map(([planId, change]) => ({ applicationId: change.applicationId, planId }))
  const remove = [
    ...Object.entries(changes).flatMap(([id, change]) =>
      !change.checked && initial.has(id) ? [initial.get(id)!.entryId] : []
    ),
    ...Object.keys(removedApplications).filter((id) => removedApplications[id])
  ]
  const ready =
    existing.isSuccess &&
    !existing.isFetching &&
    !plans.isFetching &&
    !plans.isError &&
    add.length <= 50 &&
    remove.length <= 50 &&
    add.length + remove.length > 0
  return (
    <ItFormDialog
      page
      title={t('editSelection')}
      onClose={onClose}
      pending={mutation.isPending}
      submitLabel={t('saveChanges')}
      submitDisabled={!ready}
      onSubmit={(event) => {
        event.preventDefault()
        if (ready && !mutation.isPending)
          mutation.mutate({
            id: departmentId,
            data: { ...(add.length ? { add } : {}), ...(remove.length ? { remove } : {}) }
          })
      }}
    >
      <p className='text-sm text-muted-foreground'>{t('editSelectionHint')}</p>
      <ItField label={t('search')} hint={t('searchHint')}>
        <input
          placeholder={translatePlaceholder('searchApp')}
          type='search'
          className={itInputClass}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value)
            setPage(1)
          }}
          maxLength={100}
        />
      </ItField>
      <ItQueryState query={existing}>
        <ItQueryState query={plans}>
          {(existing.data ?? []).filter((item) =>
            `${item.applicationName} ${item.planName ?? ''}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())
          ).length > 0 && (
            <fieldset className='space-y-2'>
              <legend className='font-medium'>{t('currentSelection')}</legend>
              <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
                {(existing.data ?? [])
                  .filter((item) =>
                    `${item.applicationName} ${item.planName ?? ''}`
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
                  )
                  .map((item) => (
                    <label key={item.entryId} className='flex items-center gap-3 p-4'>
                      <input
                        type='checkbox'
                        className='size-5'
                        disabled={mutation.isPending}
                        checked={
                          item.planId ? (changes[item.planId]?.checked ?? true) : !removedApplications[item.entryId]
                        }
                        onChange={(event) => {
                          if (item.planId)
                            setChanges((previous) => ({
                              ...previous,
                              [item.planId!]: { checked: event.target.checked, applicationId: item.applicationId }
                            }))
                          else
                            setRemovedApplications((previous) => ({
                              ...previous,
                              [item.entryId]: !event.target.checked
                            }))
                        }}
                      />
                      <span>
                        {item.applicationName} · {item.planName ?? t('wholeApplication')}
                      </span>
                    </label>
                  ))}
              </div>
            </fieldset>
          )}
          {plans.data?.data?.items.length ? (
            <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
              {plans.data.data.items
                .filter((plan) => !initial.has(plan.id))
                .map((plan) => {
                  const covered =
                    existing.data?.some(
                      (item) =>
                        item.applicationId === plan.applicationId && !item.planId && !removedApplications[item.entryId]
                    ) ?? false
                  const checked = covered || (changes[plan.id]?.checked ?? initial.has(plan.id))
                  return (
                    <label key={plan.id} className='flex items-center gap-3 p-4'>
                      <input
                        type='checkbox'
                        className='size-5'
                        checked={checked}
                        disabled={covered || mutation.isPending}
                        onChange={(event) =>
                          setChanges((previous) => ({
                            ...previous,
                            [plan.id]: { checked: event.target.checked, applicationId: plan.applicationId }
                          }))
                        }
                      />
                      <span>
                        {plan.applicationName} · {plan.name}
                      </span>
                      {covered && <span className='text-sm text-muted-foreground'>{t('coveredByApplication')}</span>}
                    </label>
                  )
                })}
            </div>
          ) : (
            <ItEmpty />
          )}
        </ItQueryState>
      </ItQueryState>
      <ItPagination page={page} pageSize={20} total={plans.data?.data?.pagination.totalItems ?? 0} onChange={setPage} />
      {(add.length > 50 || remove.length > 50) && <p className='text-sm text-danger'>{t('changeLimit')}</p>}
    </ItFormDialog>
  )
}
