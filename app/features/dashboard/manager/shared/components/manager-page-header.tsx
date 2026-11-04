import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { WorkspacePageHeader } from '~/shared/ui/workspace-page-header'

export function ManagerPageHeader(props: Omit<ComponentProps<typeof WorkspacePageHeader>, 'eyebrow'>) {
  const { t: translate } = useTranslation('manager')
  return <WorkspacePageHeader {...props} eyebrow={translate('workspace')} />
}
