import { useApplicationGet } from '~/shared/api/generated/operations/applications/application-get'
import { useTranslation } from 'react-i18next'
import { ItQueryState } from '../../shared/components/it-query-state'
import { itButtonClass } from '../../shared/components/it-form'
import { CatalogApplicationForm } from './catalog-application-form'

export function CatalogApplicationEdit({ id, onClose }: { id: string; onClose: () => void }) {
  const { t: translate } = useTranslation('itCatalog')
  const query = useApplicationGet(id, { query: { staleTime: 0, refetchOnMount: 'always' } })
  return (
    <div className='space-y-3'>
      {!query.data?.data && (
        <button type='button' className={itButtonClass} onClick={onClose}>
          {translate('back')}
        </button>
      )}
      <ItQueryState query={query}>
        {query.data?.data && <CatalogApplicationForm application={query.data.data} onClose={onClose} />}
      </ItQueryState>
    </div>
  )
}
