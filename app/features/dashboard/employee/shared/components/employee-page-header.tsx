import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { WorkspacePageHeader } from '~/shared/ui/workspace-page-header'

export function EmployeePageHeader(props: Omit<ComponentProps<typeof WorkspacePageHeader>, 'eyebrow'>) {
  const { t: translate } = useTranslation('employee')
  return <WorkspacePageHeader {...props} eyebrow={translate('workspace')} />
}
