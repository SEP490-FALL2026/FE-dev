import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getRequestableApplicationListQueryOptions } from '~/shared/api/generated/operations/requestable-software/requestable-application-list'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
import type { WorkspaceChoice } from '~/shared/ui/workspace-choice-select'
import { EmployeeField, EmployeeQueryState } from '../../shared/components/employee-api-ui'
import { EmployeeSelect } from '../../shared/components/employee-select'
import type { CATALOG_KIND } from '../enums/catalog-kind'
import { usePagedOptions } from '../hooks/use-paged-options'

export type CatalogKindFilter = '' | (typeof CATALOG_KIND)[keyof typeof CATALOG_KIND]

/** Whole-catalog software picker: server search by name or vendor, optional kind filter, paged with "load more". */
export function EmployeeCatalogApplication({
  value,
  onChange,
  disabled,
  kind
}: {
  value: WorkspaceChoice | null
  onChange: (choice: WorkspaceChoice) => void
  disabled: boolean
  kind: CatalogKindFilter
}) {
  const { t: translate } = useTranslation('employee')
  const [draft, setDraft] = useState('')
  const search = useDebouncedValue(draft, 300)
  const applications = usePagedOptions(`${search}:${kind}`, (page) =>
    getRequestableApplicationListQueryOptions(
      { page, pageSize: 20, ...(search ? { search } : {}), ...(kind ? { kind } : {}) },
      { query: { enabled: !disabled } }
    )
  )
  return (
    <div className='min-w-0'>
      <EmployeeField label={translate('catalog.application')}>
        <EmployeeSelect
          required
          value={value?.value ?? ''}
          selectedLabel={value?.label}
          placeholder={translate('ui.placeholders.application')}
          disabled={disabled}
          loading={applications.loading}
          onSearchChange={setDraft}
          hasMore={applications.hasMore}
          onLoadMore={applications.loadMore}
          emptyText={translate('catalog.noApplications')}
          options={applications.items.map((application) => ({
            value: application.id,
            label: application.name,
            description:
              application.vendorName ??
              translate(`catalog.kinds.${application.kind}`, { defaultValue: translate('unknownStatus') })
          }))}
          onChange={(selected, option) => {
            if (selected && option) onChange({ value: option.value, label: option.label })
          }}
        />
      </EmployeeField>
      {applications.query?.isError && <EmployeeQueryState query={applications.query} />}
    </div>
  )
}
