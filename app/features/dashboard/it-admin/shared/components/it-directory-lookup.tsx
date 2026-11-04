import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentList } from '~/shared/api/generated/operations/departments/department-list'
import { useDepartmentTechnicalMemberList } from '~/shared/api/generated/operations/departments/department-technical-member-list'
import { useCatalogSearch } from '~/shared/hooks/use-catalog-search'
import { ItQueryState, ItEmpty } from './it-query-state'
import { ItPagination } from './it-pagination'
import { itInputClass, itButtonClass } from './it-form'

export function ItDirectoryLookup({
  mode,
  onSelect
}: {
  mode: 'department' | 'employee'
  onSelect: (id: string) => void
}) {
  const { t: translate } = useTranslation('itAdmin')
  const [open, setOpen] = useState(false)
  const [selectedName, setSelectedName] = useState('')
  return (
    <div className='space-y-2'>
      <button type='button' className={itButtonClass} aria-expanded={open} onClick={() => setOpen(!open)}>
        {translate(mode === 'employee' ? 'directory.people' : 'directory.departments')}
      </button>
      {selectedName && (
        <p className='truncate text-xs font-normal text-muted-foreground' title={selectedName}>
          {selectedName}
        </p>
      )}
      {open && (
        <DirectoryPanel
          mode={mode}
          onSelect={(id, name) => {
            onSelect(id)
            setSelectedName(name)
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}
function DirectoryPanel({
  mode,
  onSelect
}: {
  mode: 'department' | 'employee'
  onSelect: (id: string, name: string) => void
}) {
  const { t: translate } = useTranslation('itAdmin')
  const { draft: search, setDraft: setSearch, search: debounced, page, setPage } = useCatalogSearch()
  const [department, setDepartment] = useState<{ id: string; name: string }>()
  const query = useDepartmentList(
    { status: 'ACTIVE', search: debounced || undefined, page, pageSize: 20 },
    { query: { enabled: !department } }
  )
  return (
    <div className='space-y-3 rounded-md border border-border/70 bg-surface-subtle p-3'>
      {department ? (
        <>
          <button type='button' className={itButtonClass} onClick={() => setDepartment(undefined)}>
            {translate('directory.changeDepartment')}
          </button>
          <p className='truncate text-sm font-medium' title={department.name}>
            {department.name}
          </p>
          <TechnicalMembers key={department.id} id={department.id} onSelect={onSelect} />
        </>
      ) : (
        <>
          <input
            type='search'
            aria-label={translate('directory.search')}
            placeholder={translate('directory.search')}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            className={itInputClass}
          />
          <ItQueryState query={query}>
            {query.data?.data?.items.length ? (
              <div className='grid max-h-56 gap-1 overflow-y-auto'>
                {query.data.data.items.map((item) => (
                  <button
                    key={item.id}
                    type='button'
                    className={`${itButtonClass} justify-start text-left`}
                    onClick={() =>
                      mode === 'department'
                        ? onSelect(item.id, item.name)
                        : setDepartment({ id: item.id, name: item.name })
                    }
                  >
                    <span className='truncate' title={item.name}>
                      {item.name}
                    </span>
                    <span className='font-mono text-xs text-muted-foreground'>{item.code}</span>
                  </button>
                ))}
              </div>
            ) : (
              <ItEmpty />
            )}
          </ItQueryState>
          {query.data?.data && (
            <ItPagination page={page} total={query.data.data.pagination.totalItems} pageSize={20} onChange={setPage} />
          )}
        </>
      )}
    </div>
  )
}
function TechnicalMembers({ id, onSelect }: { id: string; onSelect: (id: string, name: string) => void }) {
  const { t: translate } = useTranslation('itAdmin')
  const [page, setPage] = useState(1)
  const query = useDepartmentTechnicalMemberList(id, { page, pageSize: 20 })
  const eligible = query.data?.data?.items.filter((item) => item.employmentStatus === 'WORKING')
  return (
    <div className='space-y-3'>
      <p className='text-xs text-muted-foreground'>{translate('directory.scopeHint')}</p>
      <ItQueryState query={query}>
        {eligible?.length ? (
          <div className='grid max-h-56 gap-1 overflow-y-auto'>
            {eligible.map((item) => (
              <button
                type='button'
                key={item.id}
                className={`${itButtonClass} justify-start text-left`}
                onClick={() => onSelect(item.id, item.fullName)}
              >
                <span className='truncate' title={item.fullName}>
                  {item.fullName}
                </span>
                <span className='font-mono text-xs text-muted-foreground'>{item.code}</span>
              </button>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {query.data?.data && (
        <ItPagination page={page} total={query.data.data.pagination.totalItems} pageSize={20} onChange={setPage} />
      )}
    </div>
  )
}
