import { useTranslation } from 'react-i18next'
import { LoaderCircle } from 'lucide-react'
import type { ParameterListResponseDtoDataItemsItem } from '~/shared/api/generated/model'
import { useDashboardFormat } from '../../../dashboard-ui'
import { adminButtonClass } from '../../shared/components/admin-form'
import { useParameterPresentation } from '../hooks/use-parameter-presentation'

export function ParameterRow({
  parameter,
  disabled,
  historyLoading,
  onEdit,
  onHistory
}: {
  parameter: ParameterListResponseDtoDataItemsItem
  disabled: boolean
  historyLoading: boolean
  onEdit: () => void
  onHistory: () => void
}) {
  const { t: translate } = useTranslation('admin')
  const presentation = useParameterPresentation()
  const { formatDateTime } = useDashboardFormat()
  const name = parameter.label || presentation.name(parameter.key)
  const editable = ['int', 'enum', 'int-list'].includes(parameter.constraints?.kind)
  return (
    <article className='grid min-w-0 gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start'>
      <div className='min-w-0'>
        <div className='flex flex-wrap items-center gap-2.5'>
          <h2 className='min-w-0 truncate font-semibold' title={name}>
            {name}
          </h2>
          <span
            className={`rounded-md px-2 py-1 text-xs font-medium ${parameter.isDefault ? 'bg-surface-subtle text-muted-foreground' : 'bg-primary-soft text-primary-ink'}`}
          >
            {translate(parameter.isDefault ? 'parameters.usingDefault' : 'parameters.customized')}
          </span>
        </div>
        <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
          {presentation.description(parameter.key, parameter.description)}
        </p>
        <dl className='mt-4 grid max-w-3xl gap-3 text-sm sm:grid-cols-3'>
          <div className='flex min-w-0 items-center justify-between gap-3 rounded-md bg-surface-subtle/70 px-3 py-2.5'>
            <dt className='min-w-0 text-xs leading-relaxed text-muted-foreground'>{translate('parameters.value')}</dt>
            <dd className='min-w-0 break-words text-right font-mono text-base font-semibold tabular-nums [overflow-wrap:anywhere]'>
              {parameter.constraints?.kind === 'enum' && typeof parameter.value === 'string'
                ? (parameter.constraints.optionLabels[parameter.value] ?? parameter.value)
                : presentation.value(parameter.value)}
            </dd>
          </div>
          <div className='flex min-w-0 items-center justify-between gap-3 rounded-md bg-surface-subtle/70 px-3 py-2.5'>
            <dt className='min-w-0 text-xs leading-relaxed text-muted-foreground'>{translate('parameters.default')}</dt>
            <dd className='min-w-0 break-words text-right font-mono font-medium tabular-nums [overflow-wrap:anywhere]'>
              {parameter.constraints?.kind === 'enum' && typeof parameter.default === 'string'
                ? (parameter.constraints.optionLabels[parameter.default] ?? parameter.default)
                : presentation.value(parameter.default)}
            </dd>
          </div>
          <div className='flex min-w-0 items-center justify-between gap-3 rounded-md bg-surface-subtle/70 px-3 py-2.5'>
            <dt className='shrink-0 text-xs leading-relaxed text-muted-foreground'>{translate('parameters.unit')}</dt>
            <dd className='min-w-0 text-right text-xs font-medium [overflow-wrap:anywhere]'>
              {parameter.unitLabel || presentation.unit(parameter.unit)}
            </dd>
          </div>
        </dl>
        <p className='mt-3 text-xs text-muted-foreground'>
          {translate('parameters.changed')}:{' '}
          {parameter.changedAt ? (
            <time dateTime={parameter.changedAt} className='font-mono tabular-nums'>
              {formatDateTime(parameter.changedAt)}
            </time>
          ) : (
            translate('parameters.notChanged')
          )}
        </p>
      </div>
      <details className='relative justify-self-end'>
        <summary className={`${adminButtonClass} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
          {translate('actions')}
        </summary>
        <div className='absolute right-0 z-10 mt-1 grid min-w-36 gap-1 rounded-md border border-border bg-surface p-2 shadow-lg'>
          <button className={adminButtonClass} type='button' disabled={disabled || !editable} onClick={onEdit}>
            {translate('edit')}
          </button>
          <button
            className={adminButtonClass}
            type='button'
            disabled={disabled}
            aria-busy={historyLoading}
            onClick={onHistory}
          >
            {historyLoading && (
              <LoaderCircle aria-hidden className='size-4 animate-spin motion-reduce:animate-none' strokeWidth={1.5} />
            )}
            {translate(historyLoading ? 'loading' : 'parameters.history')}
          </button>
        </div>
      </details>
    </article>
  )
}
