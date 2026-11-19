import { useDeferredValue, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequestablePlanList } from '~/shared/api/generated/operations/requestable-software/requestable-plan-list'
import { useRequestablePlanGet } from '~/shared/api/generated/operations/requestable-software/requestable-plan-get'
import { ManagerChoiceSelect, type ManagerChoice } from '../../shared/components/manager-choice-select'
import { ManagerPagination, ManagerQueryState } from '../../shared/components/manager-api-ui'

export function ManagerBudgetPlanPicker({
  name,
  initialId,
  onChange
}: {
  name: string
  initialId?: string
  onChange?: (id?: string) => void
}) {
  const { t: translate } = useTranslation('manager')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const term = useDeferredValue(search.trim())
  const [page, setPage] = useState(1)
  const [selection, setSelection] = useState<ManagerChoice | null>(
    initialId ? { value: initialId, label: translate('budgetForm.existingPlan') } : null
  )
  const initial = useRequestablePlanGet(initialId ?? '', { query: { enabled: !!initialId } })
  const initialPlan = !initial.isError ? initial.data?.data : null
  const selected =
    selection?.value === initialId && initialPlan
      ? { value: initialPlan.id, label: initialPlan.name, description: initialPlan.application.name }
      : selection
  const query = useRequestablePlanList(
    { page, pageSize: 20, ...(term ? { search: term } : {}) },
    { query: { enabled: open } }
  )
  const options = (!query.isError ? (query.data?.data?.items ?? []) : []).map((plan) => ({
    value: plan.id,
    label: plan.name,
    description: plan.application.name
  }))
  return (
    <div className='min-w-0'>
      <input type='hidden' name={name} value={selection?.value ?? ''} />
      <ManagerChoiceSelect
        label={translate('budgetForm.optionalPlan')}
        placeholder={translate('budgetForm.choosePlan')}
        selected={selected ? [selected] : []}
        options={options}
        onChange={(choices) => {
          setSelection(choices[0] ?? null)
          onChange?.(choices[0]?.value)
        }}
        onOpenChange={setOpen}
        hint={translate('budgetForm.planHint')}
        search={{
          label: translate('budgetForm.searchPlan'),
          placeholder: translate('budgetForm.searchPlan'),
          value: search,
          onChange: (value) => {
            setSearch(value)
            setPage(1)
          }
        }}
        state={open ? <ManagerQueryState query={query} empty={!options.length} /> : undefined}
        footer={
          <ManagerPagination pagination={query.data?.data?.pagination} onPage={setPage} busy={query.isFetching} />
        }
      />
    </div>
  )
}
