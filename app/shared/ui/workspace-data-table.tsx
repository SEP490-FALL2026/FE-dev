import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import './workspace.css'

export interface WorkspaceColumn<T> {
  key: string
  label: string
  render: (item: T) => ReactNode
  align?: 'right'
}

/** One DOM tree: desktop table, labeled rows on mobile. */
export function WorkspaceDataTable<T>({
  items,
  columns,
  rowKey,
  onOpen,
  label,
  actionLabel,
  renderAction,
  emptyState
}: {
  items: readonly T[]
  columns: readonly WorkspaceColumn<T>[]
  rowKey: (item: T) => string
  onOpen?: (item: T) => void
  label: string
  actionLabel: string
  renderAction?: (item: T) => ReactNode
  emptyState?: ReactNode
}) {
  if (!items.length && !emptyState) return null
  return (
    <table className='workspace-data-table w-full text-sm' aria-label={label}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} scope='col' className={column.align === 'right' ? 'text-right' : 'text-left'}>
              {column.label}
            </th>
          ))}
          {(onOpen || renderAction) && (
            <th scope='col' className='text-right'>
              <span className='sr-only'>{actionLabel}</span>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {!items.length && emptyState && (
          <tr>
            <td className='workspace-table-empty' colSpan={columns.length + (onOpen || renderAction ? 1 : 0)}>
              {emptyState}
            </td>
          </tr>
        )}
        {items.map((item) => (
          <tr key={rowKey(item)}>
            {columns.map((column) => (
              <td
                key={column.key}
                className={column.align === 'right' ? 'text-right font-mono tabular-nums' : 'text-left'}
              >
                <span aria-hidden className='workspace-mobile-label'>
                  {column.label}
                </span>
                <div className='min-w-0'>{column.render(item)}</div>
              </td>
            ))}
            {(onOpen || renderAction) && (
              <td className='workspace-row-action text-right'>
                {renderAction ? (
                  renderAction(item)
                ) : (
                  <button
                    type='button'
                    className='inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-primary-ink transition-colors hover:bg-primary-soft'
                    onClick={() => onOpen?.(item)}
                  >
                    {actionLabel}
                    <ChevronRight aria-hidden strokeWidth={1.5} className='size-4' />
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
