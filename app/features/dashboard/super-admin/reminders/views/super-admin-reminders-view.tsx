import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ParameterListResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import {
  getOperatingParameterListQueryKey,
  useOperatingParameterList
} from '~/shared/api/generated/operations/operating-parameters/operating-parameter-list'
import { getOperatingParameterHistoryQueryKey } from '~/shared/api/generated/operations/operating-parameters/operating-parameter-history'
import { useOperatingParameterSet } from '~/shared/api/generated/operations/operating-parameters/operating-parameter-set'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminField, AdminFormDialog, adminButtonClass, adminInputClass } from '../../shared/components/admin-form'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'
import { ParameterHistory } from '../components/parameter-history'

export function SuperAdminRemindersView() {
  const { t: translate } = useTranslation('admin')
  const query = useOperatingParameterList()
  const [editing, setEditing] = useState<ParameterListResponseDtoDataItemsItem | null>(null)
  const [historyKey, setHistoryKey] = useState<string | null>(null)
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
            <article key={parameter.key} className='grid gap-3 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center'>
              <div className='min-w-0'>
                <h2 className='truncate font-medium' title={parameter.description}>
                  {parameter.key}
                </h2>
                <dl className='mt-2 flex flex-wrap gap-5 text-sm'>
                  <div>
                    <dt className='text-muted-foreground'>{translate('parameters.value')}</dt>
                    <dd className='text-right font-mono tabular-nums'>
                      {Array.isArray(parameter.value) ? parameter.value.join(', ') : parameter.value}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{translate('parameters.default')}</dt>
                    <dd className='text-right font-mono tabular-nums'>
                      {Array.isArray(parameter.default) ? parameter.default.join(', ') : parameter.default}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{translate('parameters.unit')}</dt>
                    <dd>{parameter.unit}</dd>
                  </div>
                </dl>
              </div>
              <details className='relative justify-self-end'>
                <summary className={`${adminButtonClass} cursor-pointer`}>{translate('actions')}</summary>
                <div className='absolute right-0 z-10 mt-1 grid min-w-36 gap-1 rounded-md border border-border bg-surface p-2 shadow-lg'>
                  <button
                    className={adminButtonClass}
                    type='button'
                    onClick={() => {
                      setEditing(parameter)
                      setValue(Array.isArray(parameter.value) ? parameter.value.join(', ') : String(parameter.value))
                      setInvalid(false)
                    }}
                  >
                    {translate('edit')}
                  </button>
                  <button className={adminButtonClass} type='button' onClick={() => setHistoryKey(parameter.key)}>
                    {translate('parameters.history')}
                  </button>
                </div>
              </details>
            </article>
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
          <p className='font-mono text-sm'>{editing.key}</p>
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
      {historyKey && <ParameterHistory parameterKey={historyKey} onClose={() => setHistoryKey(null)} />}
    </div>
  )
}
