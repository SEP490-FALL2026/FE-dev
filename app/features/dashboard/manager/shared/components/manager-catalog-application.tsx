import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequestableApplicationList } from '~/shared/api/generated/operations/requestable-software/requestable-application-list'
import type { WorkspaceChoice } from '~/shared/ui/workspace-choice-select'
import { ManagerChoiceSelect } from './manager-choice-select'
import { ManagerField, ManagerPagination, ManagerQueryState, managerInputClass } from './manager-api-ui'
import { CATALOG_KIND } from '../enums/catalog-kind'
import { useCatalogSearch } from '~/shared/hooks/use-catalog-search'

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
  const [kind, setKind] = useState<'' | (typeof CATALOG_KIND)[keyof typeof CATALOG_KIND]>('')
  const search = useCatalogSearch()
  const query = useRequestableApplicationList(
    { page: search.page, pageSize: 20, ...(search.search ? { search: search.search } : {}), ...(kind ? { kind } : {}) },
    { query: { enabled: search.open && !disabled } }
  )
  const current = search.current && !query.isError
  return (
    <ManagerChoiceSelect
      label={translate('catalog.application')}
      placeholder={translate('catalog.chooseApplication')}
      disabled={disabled}
      selected={value ? [value] : []}
      onChange={(choices) => {
        if (choices[0]) onChange(choices[0])
      }}
      onOpenChange={search.setOpen}
      options={
        current
          ? (query.data?.data?.items ?? []).map((application) => ({
              value: application.id,
              label: application.name,
              description:
                application.vendorName ??
                translate(`catalog.kinds.${application.kind}`, { defaultValue: translate('unknownStatus') })
            }))
          : []
      }
      search={{
        label: translate('catalog.searchApplications'),
        placeholder: translate('catalog.searchApplicationsHint'),
        value: search.draft,
        onChange: search.setDraft
      }}
      state={
        <>
          <ManagerField label={translate('catalog.kind')}>
            <select
              className={managerInputClass}
              value={kind}
              onChange={(event) => {
                setKind(Object.values(CATALOG_KIND).find((option) => option === event.target.value) ?? '')
                search.setPage(1)
              }}
            >
              <option value=''>{translate('catalog.allKinds')}</option>
              {Object.values(CATALOG_KIND).map((option) => (
                <option key={option} value={option}>
                  {translate(`catalog.kinds.${option}`)}
                </option>
              ))}
            </select>
          </ManagerField>
          {search.current ? (
            <ManagerQueryState
              query={query}
              empty={!query.data?.data?.items.length}
              emptyTitle={translate('catalog.noApplications')}
            />
          ) : (
            <p role='status' className='py-4 text-sm text-muted-foreground'>
              {translate('loading')}
            </p>
          )}
        </>
      }
      footer={
        current && (
          <ManagerPagination
            pagination={query.data?.data?.pagination}
            onPage={search.setPage}
            busy={query.isFetching}
          />
        )
      }
    />
  )
}
