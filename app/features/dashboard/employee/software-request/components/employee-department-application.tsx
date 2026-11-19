import { useTranslation } from 'react-i18next'
import { getMeDepartmentSoftwareListQueryOptions } from '~/shared/api/generated/operations/department-software-list/me-department-software-list'
import type { MyDepartmentSoftwareListResponseDtoDataItemsItem } from '~/shared/api/generated/model/department-software-list/myDepartmentSoftwareListResponseDtoDataItemsItem'
import type { WorkspaceChoice } from '~/shared/ui/workspace-choice-select'
import { EmployeeField, EmployeeQueryState } from '../../shared/components/employee-api-ui'
import { EmployeeSelect } from '../../shared/components/employee-select'
import { usePagedOptions } from '../hooks/use-paged-options'

/** Department software list (guidance only): the operation has no search, so loaded pages are filtered locally. */
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
  const entries = usePagedOptions('department', (page) =>
    getMeDepartmentSoftwareListQueryOptions({ page, pageSize: 20 }, { query: { enabled: !disabled } })
  )
  const unplaced = entries.query?.data?.data?.departmentId === null
  const selectedValue =
    selectedEntry && selectedEntry.applicationId === value?.value ? selectedEntry.entryId : (value?.value ?? '')
  return (
    <div className='min-w-0'>
      <EmployeeField label={t('catalog.application')}>
        <EmployeeSelect
          required
          value={selectedValue}
          selectedLabel={selectedEntry?.applicationName ?? value?.label}
          placeholder={t('ui.placeholders.departmentApplication')}
          disabled={disabled}
          loading={entries.loading}
          hasMore={entries.hasMore}
          onLoadMore={entries.loadMore}
          emptyText={flow(unplaced ? 'departmentSoftware.unplaced' : 'departmentSoftware.empty')}
          options={entries.items.map((entry) => ({
            value: entry.entryId,
            label: entry.applicationName,
            description: [entry.planName, entry.note].filter(Boolean).join(' · ') || undefined
          }))}
          onChange={(entryId) => {
            const entry = entries.items.find((item) => item.entryId === entryId)
            if (entry) onSelect(entry)
          }}
        />
      </EmployeeField>
      {entries.query?.isError && <EmployeeQueryState query={entries.query} />}
    </div>
  )
}
