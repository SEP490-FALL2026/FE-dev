import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { WorkspacePageHeader } from '~/shared/ui/workspace-page-header'

/** Every Employee page opens with the decorated lavender banner; title, icon and actions stay with the caller. */
export function EmployeePageHeader(props: Omit<ComponentProps<typeof WorkspacePageHeader>, 'eyebrow'>) {
  const { t: translate } = useTranslation('employee')
  return (
    <div className='page-banner'>
      <WorkspacePageHeader {...props} eyebrow={translate('workspace')} />
    </div>
  )
}
