import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useFunctionalGroupList,
  getFunctionalGroupListQueryKey
} from '~/shared/api/generated/operations/functional-groups/functional-group-list'
import { useFunctionalGroupCreate } from '~/shared/api/generated/operations/functional-groups/functional-group-create'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, ItFormDialog, itInputClass, itPrimaryClass } from '../../shared/components/it-form'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getItError } from '../../shared/hooks/it-errors'
import { FunctionalGroupStatus } from '../enums/functional-group-status'

export function CatalogFunctionalGroups() {
  const { t: translate } = useTranslation('itCatalog')
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)
  const query = useFunctionalGroupList({ page, pageSize: 20 })
  return (
    <section className='space-y-4'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-lg font-semibold [text-wrap:balance]'>{translate('groups.title')}</h2>
        <button type='button' className={itPrimaryClass} onClick={() => setCreating(true)}>
          {translate('groups.create')}
        </button>
      </header>
      <p className='text-sm text-muted-foreground'>{translate('groups.hint')}</p>
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border/50 rounded-lg border border-border/70 bg-surface'>
            {query.data.data.items.map((group) => (
              <article key={group.id} className='flex items-center justify-between gap-4 p-4'>
                <h3 className='min-w-0 flex-1 truncate font-medium' title={group.name}>
                  {group.name}
                </h3>
                <span className='text-sm text-muted-foreground'>
                  {translate(`groups.states.${group.status}`, { defaultValue: translate('unknown') })}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItPagination page={page} total={query.data?.data?.pagination.totalItems ?? 0} pageSize={20} onChange={setPage} />
      {creating && <GroupCreateDialog onClose={() => setCreating(false)} />}
    </section>
  )
}

function GroupCreateDialog({ onClose }: { onClose: () => void }) {
  const { t: translate } = useTranslation('itCatalog')
  const [name, setName] = useState('')
  const [uncertain, setUncertain] = useState(false)
  const feedback = useItMutationFeedback([getFunctionalGroupListQueryKey()], onClose)
  const mutation = useFunctionalGroupCreate({
    mutation: {
      ...feedback,
      onError: async (error) => {
        setUncertain(getItError(error).key === 'unknownOutcome')
        await feedback.onError(error)
      }
    }
  })
  return (
    <ItFormDialog
      title={translate('groups.create')}
      onClose={onClose}
      pending={mutation.isPending}
      submitDisabled={!name.trim() || uncertain}
      onSubmit={(event) => {
        event.preventDefault()
        if (name.trim() && !uncertain && !mutation.isPending) mutation.mutate({ data: { name: name.trim() } })
      }}
    >
      <ItField label={translate('groups.name')} hint={translate('groups.nameHint')}>
        <input
          required
          maxLength={1000}
          className={itInputClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </ItField>
      {uncertain && (
        <p role='status' className='text-sm text-danger-ink'>
          {translate('groups.uncertain')}
        </p>
      )}
    </ItFormDialog>
  )
}

export function CatalogFunctionalGroupPicker({
  value,
  initial,
  onChange
}: {
  value: string
  initial?: { id: string; name: string } | null
  onChange: (value: string) => void
}) {
  const { t: translate } = useTranslation('itCatalog')
  const [page, setPage] = useState(1)
  const query = useFunctionalGroupList({ status: FunctionalGroupStatus.ACTIVE, page, pageSize: 20 })
  const options = query.data?.data?.items.map((group) => ({ value: group.id, label: group.name })) ?? []
  if (initial && !options.some((option) => option.value === initial.id))
    options.unshift({ value: initial.id, label: initial.name })
  return (
    <div className='space-y-2'>
      <ItChoiceSelect
        label={translate('groups.field')}
        hint={translate('groups.fieldHint')}
        value={value}
        onChange={onChange}
        options={[{ value: '', label: translate('groups.none') }, ...options]}
      />
      <ItQueryState query={query}>{null}</ItQueryState>
      <ItPagination page={page} total={query.data?.data?.pagination.totalItems ?? 0} pageSize={20} onChange={setPage} />
    </div>
  )
}
