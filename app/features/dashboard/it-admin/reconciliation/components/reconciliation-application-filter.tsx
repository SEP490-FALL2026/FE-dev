import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApplicationList } from '~/shared/api/generated/operations/applications/application-list'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'

/** Filters discrepancies by a catalog application chosen by name. */
export function ReconciliationApplicationFilter({
  value,
  onChange
}: {
  value: string
  onChange: (applicationId: string) => void
}) {
  const { t: translate } = useTranslation('itReconciliation')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const applications = useApplicationList({ search: debouncedSearch || undefined, page: 1, pageSize: 50 })
  return (
    <ItChoiceSelect
      label={translate('applicationId')}
      hint={translate('applicationHint')}
      placeholder={translate('applicationPlaceholder')}
      value={value}
      clearable
      loading={applications.isFetching}
      onSearchChange={setSearch}
      options={(applications.data?.data?.items ?? []).map((item) => ({ value: item.id, label: item.name }))}
      disabled={applications.isError}
      onChange={onChange}
    />
  )
}
