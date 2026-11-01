import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { WorkspaceChoiceSelect } from '~/shared/ui/workspace-choice-select'
export type { WorkspaceChoice as ManagerChoice } from '~/shared/ui/workspace-choice-select'

export function ManagerChoiceSelect(props: Omit<ComponentProps<typeof WorkspaceChoiceSelect>, 'labels'>) {
  const { t: translate } = useTranslation('manager')
  return (
    <WorkspaceChoiceSelect
      {...props}
      labels={{
        selectedCount: (count) => translate('selectedPeople', { count }),
        selectedList: translate('selectedParticipants'),
        remove: (name) => translate('removeParticipant', { name })
      }}
    />
  )
}
