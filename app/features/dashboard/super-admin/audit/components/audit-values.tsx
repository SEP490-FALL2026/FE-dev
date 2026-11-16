import { useTranslation } from 'react-i18next'
import { useDashboardFormat } from '../../../dashboard-ui'

export function AuditValues({ value, depth = 0 }: { value: unknown; depth?: number }) {
  const { t: translate } = useTranslation('admin')
  const { t: accountText } = useTranslation('adminAccounts')
  const { formatNumber } = useDashboardFormat()
  if (value == null) return <span className='text-muted-foreground'>{translate('auditView.noValue')}</span>
  if (typeof value === 'boolean') return <span>{translate(value ? 'auditView.yes' : 'auditView.no')}</span>
  if (typeof value === 'number') return <span className='font-mono tabular-nums'>{formatNumber(value)}</span>
  if (typeof value === 'string')
    return (
      <span className='whitespace-pre-wrap break-words'>
        {/^[A-Z][A-Z_]+$/.test(value)
          ? accountText(`roles.${value}`, {
              defaultValue: accountText(`statuses.${value}`, { defaultValue: translate('unknown') })
            })
          : value}
      </span>
    )
  if (depth > 8) return <span>{translate('auditView.record')}</span>
  if (Array.isArray(value))
    return (
      <ul className='grid gap-2'>
        {value.map((entry, index) => (
          <li key={index}>
            <AuditValues value={entry} depth={depth + 1} />
          </li>
        ))}
      </ul>
    )
  if (typeof value !== 'object') return null
  return (
    <dl className='grid gap-3'>
      {Object.entries(value).map(([key, entry], index) => (
        <div key={key} className='grid gap-1 border-l border-border pl-3'>
          <dt className='text-xs font-medium text-muted-foreground'>
            {translate(`auditView.fields.${key}`, {
              defaultValue: translate('auditView.otherField', { number: index + 1 })
            })}
          </dt>
          <dd className='text-sm'>
            <AuditValues value={entry} depth={depth + 1} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function useAuditLabels() {
  const { t: translate } = useTranslation('admin')
  return {
    action: (action: string) =>
      translate(`auditView.actions.${action.split('.').at(-1)}`, { defaultValue: translate('auditView.event') }),
    resource: (type: string) =>
      translate(`auditView.resources.${type.toLowerCase().replace(/[_-]/g, '')}`, {
        defaultValue: translate('auditView.record')
      })
  }
}
