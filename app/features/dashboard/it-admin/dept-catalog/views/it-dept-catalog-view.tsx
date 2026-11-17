import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApplicationList } from '~/shared/api/generated/operations/applications/application-list'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass, itInputClass, itPrimaryClass } from '../../shared/components/it-form'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { CatalogApplicationForm } from '../components/catalog-application-form'
import { CatalogTermWarnings } from '../components/catalog-term-warnings'
import { CatalogPlanTerms } from '../components/catalog-plan-terms'
import { CatalogFunctionalGroups } from '../components/catalog-functional-groups'
import { DepartmentSoftware } from '../components/department-software'
import { CatalogApplicationCard } from '../components/catalog-application-card'
import { CatalogPlanSetup, type SetupPlan } from '../components/catalog-plan-setup'
import { CatalogPurchaseForm } from '../components/catalog-purchase-form'
import { CatalogApplicationEdit } from '../components/catalog-application-edit'
export function ItDeptCatalogView({
  initialView = 'applications',
  departmentId,
  departmentName,
  onBackToDepartments
}: {
  onSelectTab?: (tab: ItAdminTabKey) => void
  initialView?: 'applications' | 'terms' | 'groups'
  departmentId?: string
  departmentName?: string
  onBackToDepartments?: () => void
}) {
  const { t: translate } = useTranslation('itCatalog')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timer)
  }, [search])
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)
  const [view, setView] = useState(initialView)
  const [termsPlan, setTermsPlan] = useState<string>()
  const [addingPlan, setAddingPlan] = useState<{ id: string; kind: string }>()
  const [editingApplication, setEditingApplication] = useState('')
  const [setup, setSetup] = useState<{ plan: SetupPlan; kind: string }>()
  const query = useApplicationList(
    { search: debouncedSearch || undefined, page, pageSize: 20 },
    { query: { enabled: view === 'applications' && !termsPlan } }
  )
  if (departmentId)
    return (
      <DepartmentSoftware
        key={departmentId}
        departmentId={departmentId}
        departmentName={departmentName ?? ''}
        onBack={onBackToDepartments ?? (() => undefined)}
      />
    )
  if (termsPlan) return <CatalogPlanTerms planId={termsPlan} onBack={() => setTermsPlan(undefined)} />
  if (setup)
    return <CatalogPlanSetup plan={setup.plan} applicationKind={setup.kind} onBack={() => setSetup(undefined)} />
  return (
    <section className='space-y-6'>
      <header className='flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5'>
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
            <div className='grid gap-4'>
              {query.data?.data?.items.map((item) => (
                <CatalogApplicationCard
                  key={item.id}
                  item={item}
                  onEdit={() => setEditingApplication(item.id)}
                  onAddPlan={() => setAddingPlan({ id: item.id, kind: item.kind })}
                  onSetup={(plan) => setSetup({ plan, kind: item.kind })}
                />
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
      {creating && (
        <CatalogApplicationForm
          onClose={() => setCreating(false)}
          onUseExisting={(name) => {
            setCreating(false)
            setSearch(name)
            setPage(1)
          }}
          onCreated={(plan) => {
            setCreating(false)
            setSetup({ plan, kind: plan.provisioningType === 'K5' ? 'INTERNAL' : 'SAAS' })
          }}
        />
      )}
      {addingPlan && (
        <CatalogPurchaseForm
          mode='plan'
          applicationId={addingPlan.id}
          applicationKind={addingPlan.kind}
          onClose={() => setAddingPlan(undefined)}
          onPlanCreated={(plan) => {
            setSetup({ plan, kind: addingPlan.kind })
            setAddingPlan(undefined)
          }}
        />
      )}
      {editingApplication && (
        <CatalogApplicationEdit id={editingApplication} onClose={() => setEditingApplication('')} />
      )}
    </section>
  )
}
