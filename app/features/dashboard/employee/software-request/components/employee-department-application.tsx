import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMeDepartmentSoftwareList } from '~/shared/api/generated/operations/department-software-list/me-department-software-list'
import type { MyDepartmentSoftwareListResponseDtoDataItemsItem } from '~/shared/api/generated/model/department-software-list/myDepartmentSoftwareListResponseDtoDataItemsItem'
import type { WorkspaceChoice } from '~/shared/ui/workspace-choice-select'
import { EmployeeChoiceSelect } from '../../shared/components/employee-choice-select'
import { EmployeePagination, EmployeeQueryState } from '../../shared/components/employee-api-ui'

export function EmployeeDepartmentApplication({
  value,
  selectedEntry,
  disabled,
  onSelect
}: {
  value: WorkspaceChoice | null
  selectedEntry: MyDepartmentSoftwareListResponseDtoDataItemsItem | null
  disabled: boolean
  onSelect: (entry: MyDepartmentSoftwareListResponseDtoDataItemsItem) => void
}) {
  const { t } = useTranslation('employee')
  const { t: flow } = useTranslation('requestFlow')
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const query = useMeDepartmentSoftwareList({ page, pageSize: 20 }, { query: { enabled: open && !disabled } })
  const data = !query.isError ? query.data?.data : null
  return (
    <EmployeeChoiceSelect
      label={t('catalog.application')}
      placeholder={flow('departmentSoftware.choose')}
      selected={
        selectedEntry && selectedEntry.applicationId === value?.value
          ? [
              {
                value: selectedEntry.entryId,
                label: selectedEntry.applicationName,
                description: selectedEntry.planName ?? undefined
              }
            ]
          : value
            ? [value]
            : []
      }
      options={(data?.items ?? []).map((entry) => ({
        value: entry.entryId,
        label: entry.applicationName,
        description: [entry.planName, entry.note].filter(Boolean).join(' · ')
      }))}
      disabled={disabled}
      onOpenChange={setOpen}
      onChange={(choices) => {
        const entry = data?.items.find((item) => item.entryId === choices[0]?.value)
        if (entry) {
          onSelect(entry)
        }
      }}
      state={
        <EmployeeQueryState
          query={query}
          empty={!data?.items.length}
          emptyTitle={flow(data?.departmentId === null ? 'departmentSoftware.unplaced' : 'departmentSoftware.empty')}
        />
      }
      footer={<EmployeePagination pagination={data?.pagination} busy={query.isFetching} onPage={setPage} />}
    />
  )
}
