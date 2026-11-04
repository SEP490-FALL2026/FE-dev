import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import { WorkspaceDataTable, type WorkspaceColumn } from '~/shared/ui/workspace-data-table'

export type ManagerColumn<T> = WorkspaceColumn<T>
export function ManagerDataTable<T>(props: {
  items: readonly T[]
  columns: readonly ManagerColumn<T>[]
  rowKey: (item: T) => string
  onOpen?: (item: T) => void
  label: string
  emptyState?: ReactNode
}) {
  const { t: translate } = useTranslation('manager')
  return <WorkspaceDataTable {...props} actionLabel={translate('open')} />
}
