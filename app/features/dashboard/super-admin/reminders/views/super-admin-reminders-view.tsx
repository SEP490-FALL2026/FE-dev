import { useState } from 'react'
import { useIsFetching } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { ParameterListResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import {
  getOperatingParameterListQueryKey,
  useOperatingParameterList
} from '~/shared/api/generated/operations/operating-parameters/operating-parameter-list'
import { getOperatingParameterHistoryQueryKey } from '~/shared/api/generated/operations/operating-parameters/operating-parameter-history'
import { useOperatingParameterSet } from '~/shared/api/generated/operations/operating-parameters/operating-parameter-set'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminFormDialog } from '../../shared/components/admin-form'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { ParameterHistory } from '../components/parameter-history'
import { ParameterRow } from '../components/parameter-row'
import { useParameterPresentation } from '../hooks/use-parameter-presentation'
import { ParameterInput } from '../components/parameter-input'
import { parseParameterValue } from '../parameter-validation'

export function SuperAdminRemindersView() {
  const { t: translate } = useTranslation('admin')
  const query = useOperatingParameterList()
  const presentation = useParameterPresentation()
  const [editing, setEditing] = useState<ParameterListResponseDtoDataItemsItem | null>(null)
  const [historyParameter, setHistoryParameter] = useState<ParameterListResponseDtoDataItemsItem | null>(null)
  const historyFetching =
    useIsFetching({ queryKey: getOperatingParameterHistoryQueryKey(historyParameter?.key ?? '') }) > 0
  const [value, setValue] = useState('')
  const [invalid, setInvalid] = useState(false)
  const feedback = useAdminMutationFeedback(
    [getOperatingParameterListQueryKey(), ...(editing ? [getOperatingParameterHistoryQueryKey(editing.key)] : [])],
    () => setEditing(null)
  )
  const mutation = useOperatingParameterSet({ mutation: feedback })
  const items = query.data?.data?.items ?? []
  const groups = new Map<string, ParameterListResponseDtoDataItemsItem[]>()
  for (const parameter of items) {
    const group = parameter.groupLabel || translate('parameters.contract.ungrouped')
    groups.set(group, [...(groups.get(group) ?? []), parameter])
  }
  return (
    <div className='space-y-5'>
      <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('parameters.title')}</h1>
      <p className='text-sm text-muted-foreground'>{translate('parameters.futureOnly')}</p>
      <AdminQueryState query={query}>
        {!items.length && <AdminEmpty />}
        <div className='space-y-5'>
          {Array.from(groups, ([group, parameters]) => (
            <section key={group} className='space-y-3'>
              <h2 className='text-sm font-semibold text-muted-foreground'>{group}</h2>
              <div className='divide-y divide-border/40 rounded-lg border border-border bg-surface'>
                {parameters.map((parameter) => (
                  <ParameterRow
                    key={parameter.key}
                    parameter={parameter}
                    disabled={mutation.isPending || Boolean(editing) || Boolean(historyParameter)}
                    historyLoading={historyFetching && historyParameter?.key === parameter.key}
                    onEdit={() => {
                      setEditing(parameter)
                      setValue(Array.isArray(parameter.value) ? parameter.value.join(', ') : String(parameter.value))
                      setInvalid(false)
                    }}
                    onHistory={() => setHistoryParameter(parameter)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </AdminQueryState>
      {editing && (
        <AdminFormDialog
          title={translate('parameters.edit')}
          pending={mutation.isPending}
          onClose={() => setEditing(null)}
          onSubmit={(event) => {
            event.preventDefault()
            if (mutation.isPending) return
            const parsed = parseParameterValue(value, editing.constraints)
            if (parsed === undefined) {
              setInvalid(true)
              return
            }
            setInvalid(false)
            mutation.mutate({ key: editing.key, data: { value: parsed } })
          }}
        >
          <p className='text-sm font-semibold'>{editing.label || presentation.name(editing.key)}</p>
          <p className='text-sm text-muted-foreground'>{presentation.description(editing.key, editing.description)}</p>
          <p className='text-xs text-muted-foreground'>
            {translate('parameters.unit')}: {editing.unitLabel || presentation.unit(editing.unit)}
          </p>
          <ParameterInput parameter={editing} value={value} invalid={invalid} onChange={setValue} />
        </AdminFormDialog>
      )}
      {historyParameter && <ParameterHistory parameter={historyParameter} onClose={() => setHistoryParameter(null)} />}
    </div>
  )
}
