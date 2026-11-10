import { useSearchParams } from 'react-router'
import { useBudgetScope } from '../hooks/use-budget-scope'
import { useTranslation } from 'react-i18next'
import { ManagerChoiceSelect } from '../../shared/components/manager-choice-select'

export function ManagerBudgetScope() {
  const { t } = useTranslation('manager')
  const scope = useBudgetScope()
  const [, setParams] = useSearchParams()
  if (scope.units.length < 2) return null
  const options = scope.units.map((unit) => ({ value: unit.departmentId, label: unit.departmentName }))
  const selected = options.find((option) => option.value === scope.departmentId) ?? options[0]
  return (
    <ManagerChoiceSelect
      placeholder={t('department')}
      label={t('department')}
      options={options}
      selected={selected ? [selected] : []}
      onChange={(choices) => {
        const id = choices[0]?.value
        if (!id) return
        setParams((old) => {
          const next = new URLSearchParams(old)
          next.set('departmentId', id)
          const cc = scope.units.find((unit) => unit.departmentId === id)?.costCenterId
          if (cc) next.set('costCenterId', cc)
          else next.delete('costCenterId')
          next.delete('proposalId')
          next.delete('page')
          return next
        })
      }}
    />
  )
}
