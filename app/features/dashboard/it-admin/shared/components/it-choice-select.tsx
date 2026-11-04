import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { WorkspaceChoiceSelect, type WorkspaceChoice } from '~/shared/ui/workspace-choice-select'

export function ItChoiceSelect({
  label,
  value,
  options,
  onChange,
  disabled = false
}: {
  label: string
  value: string
  options: readonly WorkspaceChoice[]
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const { t: translate } = useTranslation('itAdmin')
  const [remembered, setRemembered] = useState<WorkspaceChoice>()
  const current =
    options.find((option) => option.value === value) ?? (remembered?.value === value ? remembered : undefined)
  return (
    <WorkspaceChoiceSelect
      label={label}
      placeholder={translate('selectPlaceholder')}
      options={options}
      selected={current ? [current] : []}
      disabled={disabled}
      onChange={(selected) => {
        const next = selected[0]
        if (next) {
          setRemembered(next)
          onChange(next.value)
        }
      }}
      labels={{
        selectedCount: (count) => translate('selectedCount', { count }),
        selectedList: translate('selectedList'),
        remove: (name) => translate('removeSelection', { name })
      }}
    />
  )
}
