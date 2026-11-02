import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { financeAreas } from '../../finance-nav'
import { FinanceSearch } from './finance-ui'

export function FinanceWorkspaceSearch() {
  const { t: translate } = useTranslation('finance')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const term = search.trim().toLocaleLowerCase()
  const matches = term
    ? financeAreas
        .flatMap((area) => area.tabs)
        .filter((tab) => translate(tab.translationKey).toLocaleLowerCase().includes(term))
    : []
  return (
    <div className='relative ml-auto hidden w-full max-w-md sm:block'>
      <FinanceSearch
        hideLabel
        label={translate('searchLabel')}
        placeholder={translate('searchPlaceholder')}
        value={search}
        onChange={setSearch}
      />
      {term && (
        <div className='absolute top-full right-0 left-0 z-40 mt-2 rounded-lg border border-border bg-surface p-1 shadow-lg'>
          {matches.length ? (
            matches.map((tab) => (
              <button
                key={tab.key}
                type='button'
                className='min-h-11 w-full rounded-md px-3 text-left text-sm hover:bg-surface-subtle'
                onClick={() => {
                  void navigate(`/dashboard/finance?tab=${tab.key}`)
                  setSearch('')
                }}
              >
                {translate(tab.translationKey)}
              </button>
            ))
          ) : (
            <p role='status' className='p-3 text-sm text-muted-foreground'>
              {translate('searchEmpty')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
