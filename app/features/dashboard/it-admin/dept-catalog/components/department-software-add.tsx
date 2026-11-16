import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApplicationList } from '~/shared/api/generated/operations/applications/application-list'
import { usePlanList } from '~/shared/api/generated/operations/plans/plan-list'
import { useDepartmentSoftwareListChange } from '~/shared/api/generated/operations/department-software-list/department-software-list-change'
import { getDepartmentSoftwareListQueryKey } from '~/shared/api/generated/operations/department-software-list/department-software-list'
import { useCatalogSearch } from '~/shared/hooks/use-catalog-search'
import { ItField, ItFormDialog, itInputClass, itButtonClass } from '../../shared/components/it-form'
import type { DepartmentSoftwareChangesBodyDtoAddItem } from '~/shared/api/generated/model/department-software-list'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'

export function DepartmentSoftwareAdd({ departmentId, onClose }: { departmentId: string; onClose: () => void }) {
  const { t: translate } = useTranslation('itDepartmentSoftware')
  const { draft, setDraft, search, page, setPage } = useCatalogSearch()
  const [applicationId, setApplicationId] = useState('')
  const [planId, setPlanId] = useState('')
  const [note, setNote] = useState('')
  const [planPage, setPlanPage] = useState(1)
  const [applicationName, setApplicationName] = useState('')
  const [planName, setPlanName] = useState('')
  const [selected, setSelected] = useState<
    Record<string, { label: string; entry: DepartmentSoftwareChangesBodyDtoAddItem }>
  >({})
  const selectionKey = `${applicationId}:${planId}`
  const applications = useApplicationList({ status: 'APPROVED', search: search || undefined, page, pageSize: 20 })
  const plans = usePlanList({ applicationId, page: planPage, pageSize: 20 }, { query: { enabled: !!applicationId } })
  const feedback = useItMutationFeedback([getDepartmentSoftwareListQueryKey(departmentId)], onClose)
  const mutation = useDepartmentSoftwareListChange({ mutation: feedback })
  return (
    <ItFormDialog
      title={translate('add')}
      page
      pending={mutation.isPending}
      submitLabel={translate('save')}
      submitDisabled={!Object.keys(selected).length}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        if (!Object.keys(selected).length || mutation.isPending) return
        mutation.mutate({
          id: departmentId,
          data: {
            add: Object.values(selected).map((item) => item.entry)
          }
        })
      }}
    >
      <ItField label={translate('search')} hint={translate('searchHint')}>
        <input
          type='search'
          className={itInputClass}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={100}
        />
      </ItField>
      <ItQueryState query={applications}>
        <ItChoiceSelect
          label={translate('application')}
          hint={translate('applicationHint')}
          required
          value={applicationId}
          disabled={mutation.isPending}
          options={(applications.data?.data?.items ?? []).map((item) => ({ value: item.id, label: item.name }))}
          onChange={(value) => {
            setApplicationId(value)
            setApplicationName(applications.data?.data?.items.find((item) => item.id === value)?.name ?? '')
            setPlanId('')
            setPlanName('')
            setPlanPage(1)
          }}
        />
        <ItPagination
          page={page}
          pageSize={20}
          total={applications.data?.data?.pagination.totalItems ?? 0}
          onChange={setPage}
        />
      </ItQueryState>
      {applicationId && (
        <ItQueryState query={plans}>
          <ItChoiceSelect
            label={translate('plan')}
            hint={translate('planHint')}
            value={planId}
            disabled={mutation.isPending}
            options={[
              { value: '', label: translate('wholeApplication') },
              ...(plans.data?.data?.items ?? []).map((item) => ({ value: item.id, label: item.name }))
            ]}
            onChange={(value) => {
              setPlanId(value)
              setPlanName(plans.data?.data?.items.find((item) => item.id === value)?.name ?? '')
            }}
          />
          <ItPagination
            page={planPage}
            pageSize={20}
            total={plans.data?.data?.pagination.totalItems ?? 0}
            onChange={setPlanPage}
          />
        </ItQueryState>
      )}
      <ItField label={translate('note')} hint={translate('noteHint')}>
        <textarea
          className={itInputClass}
          maxLength={500}
          value={note}
          disabled={mutation.isPending}
          onChange={(event) => setNote(event.target.value)}
        />
      </ItField>
      <button
        type='button'
        className={itButtonClass}
        disabled={
          !applicationId ||
          applications.isFetching ||
          plans.isFetching ||
          plans.isError ||
          !!selected[selectionKey] ||
          Object.keys(selected).length >= 50 ||
          mutation.isPending
        }
        onClick={() =>
          setSelected((previous) => ({
            ...previous,
            [selectionKey]: {
              label: `${applicationName} · ${planName || translate('wholeApplication')}`,
              entry: { applicationId, ...(planId ? { planId } : {}), ...(note.trim() ? { note: note.trim() } : {}) }
            }
          }))
        }
      >
        {translate('addSelection')}
      </button>
      <section className='space-y-2'>
        <h2 className='font-semibold'>{translate('selection', { count: Object.keys(selected).length })}</h2>
        {Object.entries(selected).map(([key, item]) => (
          <div key={key} className='flex items-center justify-between gap-3 rounded-md border border-border p-3'>
            <p className='break-words text-sm'>{item.label}</p>
            <button
              type='button'
              className={itButtonClass}
              disabled={mutation.isPending}
              onClick={() =>
                setSelected((previous) => {
                  const next = { ...previous }
                  delete next[key]
                  return next
                })
              }
            >
              {translate('remove', { name: item.label })}
            </button>
          </div>
        ))}
      </section>
    </ItFormDialog>
  )
}
