import { useTranslation } from 'react-i18next'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { useUsageNavigation } from '../hooks/use-usage-navigation'
import { useUsageImportList } from '~/shared/api/generated/operations/usage-imports/usage-import-list'
import { itButtonClass } from '../../shared/components/it-form'
import { ImportForm } from './usage-import-form'
import { ImportDetail } from './usage-import-detail'

export function UsageImports({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation('itDepartmentWork')
  const { params, update, page: readPage } = useUsageNavigation()
  const selected = params.get('importId') || undefined
  const setSelected = (id?: string) => update({ importId: id, rowPage: undefined, rowOutcome: undefined })
  const adding = params.get('importNew') === 'true'
  const setAdding = (value: boolean) => update({ importNew: value ? 'true' : undefined })
  const page = readPage('importPage')
  const setPage = (value: number) => update({ importPage: String(value) })
  const query = useUsageImportList({ page, pageSize: 20 }, { query: { enabled: !selected && !adding } })
  if (selected) return <ImportDetail id={selected} onBack={() => setSelected(undefined)} />
  if (adding)
    return (
      <ImportForm
        onBack={() => setAdding(false)}
        onUploaded={(id) => {
          update({ importNew: undefined, importId: id, rowPage: undefined, rowOutcome: undefined })
        }}
      />
    )
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {t('back')}
      </button>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl font-semibold'>{t('usageImport.history')}</h1>
        <button type='button' className={itButtonClass} onClick={() => setAdding(true)}>
          {t('usageImport.new')}
        </button>
      </header>
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
            {query.data.data.items.map((item) => (
              <article key={item.id} className='flex flex-wrap items-center justify-between gap-4 p-4'>
                <div>
                  <h2 className='font-medium'>
                    {item.application.name} · {item.source.name}
                  </h2>
                  <p className='text-sm text-muted-foreground'>
                    {t(`usageImport.${item.status}`, { defaultValue: t('unknown') })}
                  </p>
                </div>
                <button type='button' className={itButtonClass} onClick={() => setSelected(item.id)}>
                  {t('details')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItPagination page={page} pageSize={20} total={query.data?.data?.pagination.totalItems ?? 0} onChange={setPage} />
    </section>
  )
}
