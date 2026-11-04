import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { WorkspaceChoiceSelect } from '~/shared/ui/workspace-choice-select'

export function EmployeeChoiceSelect(props: Omit<ComponentProps<typeof WorkspaceChoiceSelect>, 'labels'>) {
  const { t: translate } = useTranslation('employee')
  return (
    <WorkspaceChoiceSelect
      {...props}
      labels={{
        selectedCount: (count) => translate('selected', { count }),
        selectedList: translate('selectedMembers'),
        remove: (name) => translate('removeMember', { name })
      }}
    />
  )
}
