import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ApprovalsEmpty } from './approvals-ui'

export interface ApprovalsColumn<Item> {
  key: string
  label: string
  render: (item: Item) => ReactNode
  numeric?: boolean
}

export function ApprovalsTable<Item>({
  items,
  columns,
  rowKey,
  onOpen
}: {
  items: Item[]
  columns: ApprovalsColumn<Item>[]
  rowKey: (item: Item) => string
  onOpen?: (item: Item) => void
}) {
  const { t: translate } = useTranslation('approvals')
  if (!items.length) return <ApprovalsEmpty />
  return (
    <>
      <div className='space-y-3 md:hidden'>
        {items.map((item) => (
          <article key={rowKey(item)} className='space-y-3 rounded-lg border border-border bg-surface p-4'>
            <dl className='space-y-2'>
              {columns.map((column) => (
                <div key={column.key} className='flex items-start justify-between gap-4 text-sm'>
                  <dt className='text-muted-foreground'>{column.label}</dt>
                  <dd className={`min-w-0 break-words text-right ${column.numeric ? 'font-mono tabular-nums' : ''}`}>
                    {column.render(item)}
                  </dd>
                </div>
              ))}
            </dl>
            {onOpen && (
              <button
                type='button'
                className='min-h-11 w-full rounded-md border border-border px-3 text-sm font-medium hover:bg-surface-subtle'
                onClick={() => onOpen(item)}
              >
                {translate('open')}
              </button>
            )}
          </article>
        ))}
      </div>
      <div className='hidden overflow-x-auto rounded-lg border border-border bg-surface md:block'>
        <table className='w-full text-sm'>
          <thead className='border-b border-border bg-surface-subtle/50'>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope='col'
                  className={`px-4 py-3 font-medium text-muted-foreground ${column.numeric ? 'text-right font-mono tabular-nums' : 'text-left'}`}
                >
                  {column.label}
                </th>
              ))}
              {onOpen && (
                <th scope='col' className='px-4 py-3 text-right'>
                  <span className='sr-only'>{translate('actions')}</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className='divide-y divide-border/40'>
            {items.map((item) => (
              <tr key={rowKey(item)} className='hover:bg-surface-subtle/50'>
                {columns.map((column) => {
                  const content = column.render(item)
                  const title = typeof content === 'string' || typeof content === 'number' ? String(content) : undefined
                  return (
                    <td
                      key={column.key}
                      className={`px-4 py-3 ${column.numeric ? 'text-right font-mono tabular-nums' : 'text-left'}`}
                    >
                      <div className={column.numeric ? '' : 'max-w-64 truncate'} title={title}>
                        {content}
                      </div>
                    </td>
                  )
                })}
                {onOpen && (
                  <td className='sticky right-0 bg-surface px-4 py-3 text-right'>
                    <button
                      type='button'
                      className='min-h-8 rounded-md px-2 text-primary hover:bg-surface-subtle'
                      onClick={() => onOpen(item)}
                    >
                      {translate('open')}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
