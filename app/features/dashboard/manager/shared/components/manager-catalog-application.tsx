import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequestableApplicationList } from '~/shared/api/generated/operations/requestable-software/requestable-application-list'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
import type { WorkspaceChoice } from '~/shared/ui/workspace-choice-select'
import { ManagerField } from './manager-api-ui'
import { ManagerSelect, enumOptions } from './manager-select'
import { CATALOG_KIND } from '../enums/catalog-kind'

const PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

/** Requestable application picker: server search by name/vendor, optional kind filter, "load more" grows the page. */
export function ManagerCatalogApplication({
  value,
  onChange,
  disabled
}: {
  value: WorkspaceChoice | null
  onChange: (choice: WorkspaceChoice) => void
  disabled: boolean
}) {
  const { t: translate } = useTranslation('employee')
  const { t: manager } = useTranslation('manager')
  const [kind, setKind] = useState<'' | (typeof CATALOG_KIND)[keyof typeof CATALOG_KIND]>('')
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const debounced = useDebouncedValue(search, 300)
  const query = useRequestableApplicationList(
    { page: 1, pageSize, ...(debounced ? { search: debounced } : {}), ...(kind ? { kind } : {}) },
    { query: { enabled: !disabled } }
  )
  const items = !query.isError ? (query.data?.data?.items ?? []) : []
  const pagination = !query.isError ? query.data?.data?.pagination : undefined
  return (
    <div className='grid min-w-0 gap-x-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,12rem)]'>
      <ManagerField label={translate('catalog.application')}>
        <ManagerSelect
          value={value?.value ?? ''}
          selectedLabel={value?.label}
          required
          disabled={disabled}
          placeholder={manager('ui.placeholders.application')}
          loading={query.isFetching}
          emptyText={query.isError ? manager('ui.loadFailed') : translate('catalog.noApplications')}
          onSearchChange={(next) => {
            setSearch(next)
            setPageSize(PAGE_SIZE)
          }}
          hasMore={!!pagination && pagination.totalPages > 1 && pageSize < MAX_PAGE_SIZE}
          onLoadMore={() => setPageSize((size) => Math.min(size + PAGE_SIZE, MAX_PAGE_SIZE))}
          options={items.map((application) => ({
            value: application.id,
            label: application.name,
            description:
              application.vendorName ??
              translate(`catalog.kinds.${application.kind}`, { defaultValue: translate('unknownStatus') })
          }))}
          onChange={(next, option) => {
            if (next && option) onChange({ value: option.value, label: option.label, description: option.description })
          }}
        />
      </ManagerField>
      <ManagerField label={translate('catalog.kind')}>
        <ManagerSelect
          value={kind}
          disabled={disabled}
          placeholder={manager('ui.placeholders.kind')}
          options={[
            { value: '', label: translate('catalog.allKinds') },
            ...enumOptions(Object.values(CATALOG_KIND), (option) => translate(`catalog.kinds.${option}`))
          ]}
          onChange={(next) => {
            setKind(Object.values(CATALOG_KIND).find((option) => option === next) ?? '')
            setPageSize(PAGE_SIZE)
          }}
        />
      </ManagerField>
    </div>
  )
}
