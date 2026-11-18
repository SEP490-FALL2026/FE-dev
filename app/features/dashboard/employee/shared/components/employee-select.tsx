import { useTranslation } from 'react-i18next'
import { SearchableSelect, type SearchableSelectProps } from '~/shared/ui/searchable-select'

/** Every Employee dropdown: a searchable combobox with the role's empty text. */
export function EmployeeSelect(props: SearchableSelectProps) {
  const { t: translate } = useTranslation('employee')
  return <SearchableSelect emptyText={translate('ui.select.empty')} {...props} />
}
