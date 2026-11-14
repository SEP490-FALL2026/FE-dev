import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApplicationList } from '~/shared/api/generated/operations/applications/application-list'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass, itInputClass, itPrimaryClass } from '../../shared/components/it-form'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { CatalogApplicationForm } from '../components/catalog-application-form'
import { CatalogApplicationDetail } from '../components/catalog-application-detail'
import { CatalogTermWarnings } from '../components/catalog-term-warnings'
import { CatalogPlanTerms } from '../components/catalog-plan-terms'
import { CatalogFunctionalGroups } from '../components/catalog-functional-groups'
export function ItDeptCatalogView({
  initialView = 'applications'
}: {
  onSelectTab?: (tab: ItAdminTabKey) => void
  initialView?: 'applications' | 'terms' | 'groups'
}) {
  const { t: translate } = useTranslation('itCatalog')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timer)
  }, [search])
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string>()
  const [creating, setCreating] = useState(false)
  const [view, setView] = useState(initialView)
  const [termsPlan, setTermsPlan] = useState<string>()
  const query = useApplicationList(
    { search: debouncedSearch || undefined, page, pageSize: 20 },
    { query: { enabled: view === 'applications' && !termsPlan } }
  )
  if (termsPlan) return <CatalogPlanTerms planId={termsPlan} onBack={() => setTermsPlan(undefined)} />
  if (selected) return <CatalogApplicationDetail id={selected} onBack={() => setSelected(undefined)} />
  return (
    <section className='space-y-5'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('title')}</h1>
        {view === 'applications' && (
          <button className={itPrimaryClass} disabled={query.isError} onClick={() => setCreating(true)}>
            {translate('add')}
          </button>
        )}
      </header>
      <div className='flex flex-wrap gap-2' role='group' aria-label={translate('title')}>
        <button
          type='button'
          className={itButtonClass}
          aria-pressed={view === 'groups'}
          onClick={() => setView('groups')}
        >
          {translate('groups.title')}
        </button>
        <button
          type='button'
          className={itButtonClass}
          aria-pressed={view === 'applications'}
          onClick={() => setView('applications')}
        >
          {translate('title')}
        </button>
        <button
          type='button'
          className={itButtonClass}
          aria-pressed={view === 'terms'}
          onClick={() => setView('terms')}
        >
          {translate('terms.warnings')}
        </button>
      </div>
      {view === 'groups' ? (
        <CatalogFunctionalGroups />
      ) : view === 'terms' ? (
        <CatalogTermWarnings onOpen={setTermsPlan} />
      ) : (
        <>
          <input
            aria-label={translate('search')}
            placeholder={translate('search')}
            maxLength={100}
            className={`${itInputClass} max-w-md`}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
          />
          <ItQueryState query={query}>
            <div className='grid gap-3'>
              {query.data?.data?.items.map((item) => (
                <article
                  key={item.id}
                  className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4'
                >
                  <div className='min-w-0 flex-1'>
                    <h2 className='truncate font-semibold [text-wrap:balance]' title={item.name}>
                      {item.name}
                    </h2>
                    <p className='text-sm text-muted-foreground'>
                      {translate(`enums.${item.kind}`, { defaultValue: translate('unknown') })} ·{' '}
                      {translate(`enums.${item.status}`, { defaultValue: translate('unknown') })}
                    </p>
                  </div>
                  <button className={itButtonClass} onClick={() => setSelected(item.id)}>
                    {translate('details')}
                  </button>
                </article>
              ))}
              {query.data?.data?.items.length === 0 && <ItEmpty />}
            </div>
          </ItQueryState>
          <ItPagination
            page={page}
            total={query.data?.data?.pagination.totalItems ?? 0}
            pageSize={20}
            onChange={setPage}
          />
        </>
      )}
      {creating && <CatalogApplicationForm onClose={() => setCreating(false)} />}
    </section>
  )
}
