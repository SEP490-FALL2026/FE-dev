import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { WorkspaceDataTable, type WorkspaceColumn } from '~/shared/ui/workspace-data-table'

export function EmployeeDataTable<T>(props: {
  items: readonly T[]
  columns: readonly WorkspaceColumn<T>[]
  rowKey: (item: T) => string
  onOpen?: (item: T) => void
  renderAction?: (item: T) => ReactNode
  actionLabel?: string
  label: string
}) {
  const { t: translate } = useTranslation('employee')
  return <WorkspaceDataTable {...props} actionLabel={props.actionLabel ?? translate('open')} />
}
