import { useTranslation } from 'react-i18next'
import { useApplicationList } from '~/shared/api/generated/operations/applications/application-list'
import { useCatalogSearch } from '~/shared/hooks/use-catalog-search'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { ItField, itInputClass } from '../../shared/components/it-form'

/** Picks a catalog application by name so the allowlist never asks for a raw identifier. */
export function AllowlistApplicationSelect({
  value,
  initial,
  onChange
}: {
  value: string
  initial?: { id: string; name: string }
  onChange: (id: string) => void
}) {
  const { t: translate } = useTranslation('itDevices')
  const { t: translatePlaceholder } = useTranslation('itPlaceholders')
  const { draft, setDraft, search, page } = useCatalogSearch()
  const applications = useApplicationList({ search: search || undefined, page, pageSize: 50 })
  const options = (applications.data?.data?.items ?? []).map((item) => ({ value: item.id, label: item.name }))
  if (initial && !options.some((option) => option.value === initial.id))
    options.unshift({ value: initial.id, label: initial.name })
  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      <ItField label={translate('search')}>
        <input
          placeholder={translatePlaceholder('searchApp')}
          className={itInputClass}
          type='search'
          maxLength={100}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
      </ItField>
      <ItChoiceSelect
        label={translate('applicationId')}
        hint={translate('hints.applicationId')}
        required
        value={value}
        options={options}
        disabled={applications.isError}
        onChange={onChange}
      />
    </div>
  )
}
