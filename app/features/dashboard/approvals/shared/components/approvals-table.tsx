import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ApprovalsEmpty } from './approvals-ui'

export interface ApprovalsColumn<Item> {
  key: string
  label: string
  render: (item: Item) => ReactNode
  numeric?: boolean
  /** Short figures such as a year or a count read straighter centered than against the far edge. */
  align?: 'center'
}

const cellAlign = <Item,>(column: ApprovalsColumn<Item>) =>
  column.align === 'center'
    ? 'text-center font-mono tabular-nums'
    : column.numeric
      ? 'text-right font-mono tabular-nums'
      : 'text-left'

export function ApprovalsTable<Item>({
  items,
  columns,
  rowKey,
  onOpen,
  emptyMessage,
  emptyDescription
}: {
  items: Item[]
  columns: ApprovalsColumn<Item>[]
  rowKey: (item: Item) => string
  onOpen?: (item: Item) => void
  emptyMessage?: string
  emptyDescription?: string
}) {
  const { t: translate } = useTranslation('approvals')
  if (!items.length) return <ApprovalsEmpty message={emptyMessage} description={emptyDescription} />
  const [leadColumn, ...restColumns] = columns
  return (
    <>
      {/* Below md every row becomes a card: the first column is its heading, the rest a label/value list. */}
      <div className='space-y-3 md:hidden'>
        {items.map((item) => (
          <article
            key={rowKey(item)}
            className='space-y-3 rounded-xl border border-border/70 bg-surface p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]'
          >
            {leadColumn && (
              <div className='min-w-0 border-b border-border/50 pb-3 text-sm font-semibold break-words'>
                {leadColumn.render(item)}
              </div>
            )}
            <dl className='space-y-2'>
              {restColumns.map((column) => (
                <div
                  key={column.key}
                  className='grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-start gap-3 text-sm'
                >
                  <dt className='min-w-0 text-muted-foreground [overflow-wrap:anywhere]'>{column.label}</dt>
                  <dd
                    className={`min-w-0 text-right [overflow-wrap:anywhere] ${column.numeric ? 'font-mono tabular-nums' : ''}`}
                  >
                    {column.render(item)}
                  </dd>
                </div>
              ))}
            </dl>
            {onOpen && (
              <button
                type='button'
                className='min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm font-medium text-primary-ink transition-colors duration-150 hover:bg-primary-soft/60 focus-visible:outline-2 focus-visible:outline-primary'
                onClick={() => onOpen(item)}
              >
                {translate('open')}
              </button>
            )}
          </article>
        ))}
      </div>
      <div className='hidden overflow-x-auto rounded-xl border border-border/70 bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.04),0_12px_28px_-24px_rgba(35,39,65,0.45)] md:block'>
        <table className='w-full text-sm'>
          <thead className='border-b border-border/70 bg-primary-soft/25'>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope='col'
                  className={`px-4 py-3 text-xs font-medium tracking-wide whitespace-nowrap text-muted-foreground uppercase ${cellAlign(column)}`}
                >
                  {column.label}
                </th>
              ))}
              {onOpen && (
                <th scope='col' className='sticky right-0 z-10 bg-surface-subtle px-4 py-3 text-right'>
                  <span className='sr-only'>{translate('actions')}</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className='divide-y divide-border/40'>
            {items.map((item) => (
              <tr key={rowKey(item)} className='group transition-colors duration-150 hover:bg-surface-subtle/50'>
                {columns.map((column) => {
                  const content = column.render(item)
                  const title = typeof content === 'string' || typeof content === 'number' ? String(content) : undefined
                  return (
                    <td key={column.key} className={`px-4 py-3 ${cellAlign(column)}`}>
                      <div
                        className={
                          column.numeric
                            ? 'whitespace-nowrap'
                            : title !== undefined
                              ? 'max-w-64 truncate'
                              : 'max-w-80 [overflow-wrap:anywhere]'
                        }
                        title={title}
                      >
                        {content}
                      </div>
                    </td>
                  )
                })}
                {onOpen && (
                  <td className='sticky right-0 bg-surface px-4 py-3 text-right transition-colors duration-150 group-hover:bg-surface-subtle'>
                    <button
                      type='button'
                      className='min-h-8 rounded-md px-2.5 text-sm font-medium whitespace-nowrap text-primary-ink transition-colors duration-150 hover:bg-primary-soft/60 focus-visible:outline-2 focus-visible:outline-primary'
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
