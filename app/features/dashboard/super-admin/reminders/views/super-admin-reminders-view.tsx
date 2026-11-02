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
import { AdminField, AdminFormDialog, adminInputClass } from '../../shared/components/admin-form'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { ParameterHistory } from '../components/parameter-history'
import { ParameterRow } from '../components/parameter-row'
import { useParameterPresentation } from '../hooks/use-parameter-presentation'

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
  return (
    <div className='space-y-5'>
      <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('parameters.title')}</h1>
      <p className='text-sm text-muted-foreground'>{translate('parameters.futureOnly')}</p>
      <AdminQueryState query={query}>
        {!items.length && <AdminEmpty />}
        <div className='divide-y divide-border/40 rounded-lg border border-border bg-surface'>
          {items.map((parameter) => (
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
      </AdminQueryState>
      {editing && (
        <AdminFormDialog
          title={translate('parameters.edit')}
          pending={mutation.isPending}
          onClose={() => setEditing(null)}
          onSubmit={(event) => {
            event.preventDefault()
            let parsed: string | number | number[] = value
            if (typeof editing.value === 'number') parsed = Number(value)
            if (Array.isArray(editing.value)) parsed = value.split(',').map((part) => Number(part.trim()))
            if (
              (typeof parsed === 'number' && (!value.trim() || !Number.isFinite(parsed))) ||
              (Array.isArray(parsed) && (!value.trim() || parsed.some((number) => !Number.isFinite(number))))
            ) {
              setInvalid(true)
              return
            }
            setInvalid(false)
            mutation.mutate({ key: editing.key, data: { value: parsed } })
          }}
        >
          <p className='text-sm font-semibold'>{presentation.name(editing.key)}</p>
          <p className='text-sm text-muted-foreground'>{presentation.description(editing.key)}</p>
          <p className='text-xs text-muted-foreground'>
            {translate('parameters.unit')}: {presentation.unit(editing.unit)}
          </p>
          <AdminField
            label={translate('parameters.value')}
            error={invalid ? translate('parameters.invalid') : undefined}
          >
            <input
              required
              aria-invalid={invalid}
              className={adminInputClass}
              type={typeof editing.value === 'number' ? 'number' : 'text'}
              step='any'
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </AdminField>
          {Array.isArray(editing.value) && (
            <p className='text-xs text-muted-foreground'>{translate('parameters.numericArray')}</p>
          )}
        </AdminFormDialog>
      )}
      {historyParameter && <ParameterHistory parameter={historyParameter} onClose={() => setHistoryParameter(null)} />}
    </div>
  )
}
