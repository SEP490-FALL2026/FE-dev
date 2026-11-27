import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ParameterListResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import {
  getOperatingParameterListQueryKey,
  useOperatingParameterList
} from '~/shared/api/generated/operations/operating-parameters/operating-parameter-list'
import { getOperatingParameterHistoryQueryKey } from '~/shared/api/generated/operations/operating-parameters/operating-parameter-history'
import { useOperatingParameterSet } from '~/shared/api/generated/operations/operating-parameters/operating-parameter-set'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPageHeader, AdminSectionTitle } from '../../shared/components/admin-page-header'
import { WorkspaceEmptyState } from '~/shared/ui/workspace-empty-state'
import { SlidersHorizontal } from 'lucide-react'
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
    const group = presentation.group(parameter.group, parameter.groupLabel)
    groups.set(group, [...(groups.get(group) ?? []), parameter])
  }
  if (historyParameter)
    return <ParameterHistory parameter={historyParameter} onClose={() => setHistoryParameter(null)} />
  return (
    <div className='space-y-6'>
      <AdminPageHeader
        icon={SlidersHorizontal}
        title={translate('parameters.title')}
        subtitle={translate('parameters.futureOnly')}
      />
      <AdminQueryState query={query}>
        {!items.length && <WorkspaceEmptyState icon={SlidersHorizontal} title={translate('ui.noParametersTitle')} />}
        <div className='space-y-6'>
          {Array.from(groups, ([group, parameters]) => (
            <section key={group} className='space-y-3'>
              <AdminSectionTitle title={group} hint={translate('ui.parameterCount', { count: parameters.length })} />
              <div className='divide-y divide-border/50 overflow-hidden rounded-xl border border-border/80 bg-surface shadow-[0_1px_2px_rgb(0_0_0/4%),0_12px_28px_-24px_rgb(35_39_65/40%)]'>
                {parameters.map((parameter) => (
                  <ParameterRow
                    key={parameter.key}
                    parameter={parameter}
                    disabled={mutation.isPending || Boolean(editing) || Boolean(historyParameter)}
                    historyLoading={false}
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
          <p className='text-sm font-semibold'>{presentation.name(editing.key, editing.label)}</p>
          <p className='text-sm text-muted-foreground'>{presentation.description(editing.key)}</p>
          <p className='text-xs text-muted-foreground'>
            {translate('parameters.unit')}: {presentation.unit(editing.unit, editing.unitLabel)}
          </p>
          <ParameterInput parameter={editing} value={value} invalid={invalid} onChange={setValue} />
        </AdminFormDialog>
      )}
    </div>
  )
}
