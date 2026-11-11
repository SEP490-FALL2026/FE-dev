import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FinanceEmpty } from './finance-ui'

export interface FinanceColumn<Item> {
  key: string
  label: string
  render: (item: Item) => ReactNode
  numeric?: boolean
  /** Short figures such as a year or a count read straighter centered than against the far edge. */
  align?: 'center'
  /** Cột thao tác: không cắt nội dung, ghim sát mép phải khi bảng cuộn ngang. */
  actions?: boolean
  /** Lớp độ rộng Tailwind cho cột (ví dụ `w-20`, `w-1/2`). */
  width?: string
}

function alignClass(column: { numeric?: boolean; actions?: boolean; align?: 'center' }) {
  if (column.align === 'center') return 'text-center'
  return column.numeric || column.actions ? 'text-right' : 'text-left'
}

function cellClass(column: { numeric?: boolean; actions?: boolean; align?: 'center' }) {
  if (column.align === 'center') return 'text-center font-mono tabular-nums'
  if (column.actions) {
    return 'sticky right-0 bg-surface text-right whitespace-nowrap transition-colors duration-150 group-hover:bg-surface-subtle'
  }
  return column.numeric ? 'text-right font-mono tabular-nums' : 'text-left'
}

const openButtonFocus = 'focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none'

export function FinanceTable<Item>({
  items,
  columns,
  rowKey,
  onOpen
}: {
  items: Item[]
  columns: FinanceColumn<Item>[]
  rowKey: (item: Item) => string
  onOpen?: (item: Item) => void
}) {
  const { t: translate } = useTranslation('finance')
  if (!items.length) return <FinanceEmpty />
  return (
    <>
      <div className='space-y-3 md:hidden'>
        {items.map((item) => (
          <article
            key={rowKey(item)}
            className='space-y-3 rounded-lg border border-border/70 bg-surface p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]'
          >
            <dl className='space-y-2'>
              {columns.map((column) => (
                <div key={column.key} className='flex items-start justify-between gap-4 text-sm'>
                  <dt className='text-muted-foreground'>{column.label}</dt>
                  <dd className={`min-w-0 text-right ${column.numeric ? 'font-mono tabular-nums' : ''}`}>
                    {column.render(item)}
                  </dd>
                </div>
              ))}
            </dl>
            {onOpen && (
              <button
                type='button'
                className={`inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium transition-colors duration-150 hover:border-primary/40 hover:bg-surface-subtle active:border-primary/50 active:bg-primary-soft active:text-primary-ink ${openButtonFocus}`}
                onClick={() => onOpen(item)}
              >
                {translate('open')}
                <ChevronRight aria-hidden className='size-4' strokeWidth={1.5} />
              </button>
            )}
          </article>
        ))}
      </div>
      <div className='hidden overflow-x-auto rounded-lg border border-border/70 bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] md:block'>
        <table className='w-full text-sm'>
          <thead className='border-b border-border/70 bg-surface-subtle/60'>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope='col'
                  className={`px-4 py-2.5 text-[11px] font-semibold tracking-wider whitespace-nowrap text-muted-foreground uppercase ${alignClass(column)} ${column.width ?? ''}`}
                >
                  {column.label}
                </th>
              ))}
              {onOpen && (
                <th scope='col' className='px-4 py-2.5 text-right'>
                  <span className='sr-only'>{translate('actions')}</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className='divide-y divide-border/40'>
            {items.map((item) => (
              <tr
                key={rowKey(item)}
                className={`group transition-colors duration-150 hover:bg-surface-subtle/60 ${onOpen ? 'cursor-pointer' : ''}`}
                onClick={onOpen ? () => onOpen(item) : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 align-middle ${cellClass(column)}`}>
                    {column.actions ? (
                      column.render(item)
                    ) : (
                      <div className={column.numeric ? '' : 'max-w-64 truncate'}>{column.render(item)}</div>
                    )}
                  </td>
                ))}
                {onOpen && (
                  <td className='sticky right-0 bg-surface px-4 py-2 text-right transition-colors duration-150 group-hover:bg-surface-subtle'>
                    <button
                      type='button'
                      className={`inline-flex min-h-8 items-center gap-1 rounded-md px-2.5 text-sm font-medium whitespace-nowrap text-primary-ink transition-colors duration-150 hover:bg-primary-soft active:bg-primary-soft ${openButtonFocus}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        onOpen(item)
                      }}
                    >
                      {translate('open')}
                      <ChevronRight aria-hidden className='size-4' strokeWidth={1.5} />
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
