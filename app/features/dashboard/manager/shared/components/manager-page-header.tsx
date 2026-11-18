import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { WorkspacePageHeader } from '~/shared/ui/workspace-page-header'

/** Every manager page opens with the decorated lavender banner (icon tile, eyebrow, title, actions). */
export function ManagerPageHeader(props: Omit<ComponentProps<typeof WorkspacePageHeader>, 'eyebrow'>) {
  const { t: translate } = useTranslation('manager')
  return (
    <div className='page-banner manager-page-banner'>
      <WorkspacePageHeader {...props} eyebrow={translate('workspace')} />
    </div>
  )
}
