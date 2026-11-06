import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentList } from '~/shared/api/generated/operations/departments/department-list'
import { useDepartmentWarningList } from '~/shared/api/generated/operations/departments/department-warning-list'
import { useCatalogSearch } from '~/shared/hooks/use-catalog-search'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, itButtonClass, itInputClass } from '../../shared/components/it-form'
import { ItDepartmentContext } from './it-department-context'
import { ItControlledWaits } from './it-controlled-waits'

export function ItDepartmentWork({ onBack }: { onBack: () => void }) {
  const { t: translate } = useTranslation('itDepartmentWork')
  const [view, setView] = useState<'departments' | 'warnings' | 'waits'>('departments')
  const [selected, setSelected] = useState<{ id: string; name: string; code: string }>()
  const { draft, setDraft, search, page, setPage } = useCatalogSearch()
  const pageRef = useRef<HTMLElement>(null)
  const query = useDepartmentList(
    { status: 'ACTIVE', search: search || undefined, page, pageSize: 20 },
    {
      query: { enabled: view === 'departments' && !selected }
    }
  )
  useEffect(() => {
    pageRef.current?.focus()
  }, [view, selected])
  if (selected)
    return <ItDepartmentContext key={selected.id} department={selected} onBack={() => setSelected(undefined)} />
  return (
    <section ref={pageRef} tabIndex={-1} className='space-y-5 outline-none'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {translate('back')}
      </button>
      <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('title')}</h1>
      <div role='group' aria-label={translate('title')} className='flex flex-wrap gap-2'>
        {(['departments', 'warnings', 'waits'] as const).map((key) => (
          <button
            key={key}
            type='button'
            className={itButtonClass}
            aria-pressed={view === key}
            onClick={() => setView(key)}
          >
            {translate(key)}
          </button>
        ))}
      </div>
      {view === 'waits' ? (
        <ItControlledWaits />
      ) : view === 'warnings' ? (
        <DepartmentWarnings onSelect={setSelected} />
      ) : (
        <>
          <p className='text-sm text-muted-foreground'>{translate('scopeHint')}</p>
          <div className='max-w-md'>
            <ItField label={translate('search')} hint={translate('searchHint')}>
              <input
                type='search'
                maxLength={100}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className={itInputClass}
              />
            </ItField>
          </div>
          <ItQueryState query={query}>
            {query.data?.data?.items.length ? (
              <div className='divide-y divide-border/50 rounded-lg border border-border/70 bg-surface'>
                {query.data.data.items.map((department) => (
                  <article key={department.id} className='flex flex-wrap items-center justify-between gap-3 p-4'>
                    <div className='min-w-0 flex-1'>
                      <h2 className='truncate font-semibold' title={department.name}>
                        {department.name}
                      </h2>
                      <p className='font-mono text-xs text-muted-foreground'>{department.code}</p>
                    </div>
                    <button type='button' className={itButtonClass} onClick={() => setSelected(department)}>
                      {translate('open')}
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <ItEmpty />
            )}
          </ItQueryState>
          <ItPagination
            page={page}
            total={query.data?.data?.pagination.totalItems ?? 0}
            pageSize={20}
            onChange={setPage}
          />
        </>
      )}
    </section>
  )
}

function DepartmentWarnings({
  onSelect
}: {
  onSelect: (department: { id: string; name: string; code: string }) => void
}) {
  const { t: translate } = useTranslation('itDepartmentWork')
  const [page, setPage] = useState(1)
  const query = useDepartmentWarningList({ page, pageSize: 20 })
  return (
    <section className='space-y-4'>
      <h2 className='text-lg font-semibold'>{translate('warnings')}</h2>
      <p className='text-sm text-muted-foreground'>{translate('warningHint')}</p>
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border/50 rounded-lg border border-border/70 bg-surface'>
            {query.data.data.items.map((warning) => (
              <article
                key={`${warning.departmentId}-${warning.warning}`}
                className='flex flex-wrap items-center justify-between gap-4 p-4'
              >
                <div className='min-w-0 flex-1'>
                  <h3 className='truncate font-semibold' title={warning.name}>
                    {warning.name}
                  </h3>
                  <p className='text-sm text-warning-ink'>
                    {translate(`values.${warning.warning}`, { defaultValue: translate('unknown') })}
                  </p>
                </div>
                <button
                  type='button'
                  className={itButtonClass}
                  onClick={() => onSelect({ id: warning.departmentId, name: warning.name, code: warning.code })}
                >
                  {translate('open')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItPagination page={page} total={query.data?.data?.pagination.totalItems ?? 0} pageSize={20} onChange={setPage} />
    </section>
  )
}
