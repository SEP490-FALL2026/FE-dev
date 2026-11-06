import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentTechnicalMemberList } from '~/shared/api/generated/operations/departments/department-technical-member-list'
import { useDepartmentToolsInUse } from '~/shared/api/generated/operations/departments/department-tools-in-use'
import type { DepartmentToolsResponseDtoDataItemsItem } from '~/shared/api/generated/model/departments/departmentToolsResponseDtoDataItemsItem'
import type { DepartmentTechnicalMembersResponseDtoDataItemsItem } from '~/shared/api/generated/model/departments/departmentTechnicalMembersResponseDtoDataItemsItem'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItDetailDialog } from '../../shared/components/it-detail-dialog'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'

export function ItDepartmentContext({
  department,
  onBack
}: {
  department: { id: string; name: string; code: string }
  onBack: () => void
}) {
  const { t: translate } = useTranslation('itDepartmentWork')
  const [view, setView] = useState<'members' | 'tools'>('members')
  const pageRef = useRef<HTMLElement>(null)
  useEffect(() => {
    pageRef.current?.focus()
  }, [])
  return (
    <section ref={pageRef} tabIndex={-1} className='space-y-5 outline-none'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {translate('back')}
      </button>
      <header>
        <h1 className='truncate text-2xl font-semibold tracking-tight' title={department.name}>
          {department.name}
        </h1>
        <p className='font-mono text-xs text-muted-foreground'>{department.code}</p>
      </header>
      <div role='group' aria-label={translate('title')} className='flex flex-wrap gap-2'>
        {(['members', 'tools'] as const).map((key) => (
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
      {view === 'members' ? <DepartmentMembers id={department.id} /> : <DepartmentTools id={department.id} />}
    </section>
  )
}

function DepartmentMembers({ id }: { id: string }) {
  const { t: translate } = useTranslation('itDepartmentWork')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<DepartmentTechnicalMembersResponseDtoDataItemsItem>()
  const query = useDepartmentTechnicalMemberList(id, { page, pageSize: 20 })
  return (
    <section className='space-y-4'>
      <h2 className='text-lg font-semibold'>{translate('members')}</h2>
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border/50 rounded-lg border border-border/70 bg-surface'>
            {query.data.data.items.map((member) => (
              <article key={member.id} className='flex flex-wrap items-center justify-between gap-4 p-4'>
                <div className='min-w-0 flex-1'>
                  <h3 className='truncate font-semibold' title={member.fullName}>
                    {member.fullName}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {translate(`values.${member.employmentStatus}`, { defaultValue: translate('unknown') })}
                  </p>
                </div>
                <button type='button' className={itButtonClass} onClick={() => setSelected(member)}>
                  {translate('details')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItPagination page={page} total={query.data?.data?.pagination.totalItems ?? 0} pageSize={20} onChange={setPage} />
      {selected && (
        <ItDetailDialog title={selected.fullName} onClose={() => setSelected(undefined)}>
          <dl className='grid gap-4 text-sm sm:grid-cols-2'>
            <div>
              <dt className='text-muted-foreground'>{translate('code')}</dt>
              <dd className='font-mono'>{selected.code}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('employment')}</dt>
              <dd>{translate(`values.${selected.employmentStatus}`, { defaultValue: translate('unknown') })}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('effectiveOn')}</dt>
              <dd className='text-right font-mono tabular-nums'>{formatDate(selected.effectiveOn)}</dd>
            </div>
          </dl>
        </ItDetailDialog>
      )}
    </section>
  )
}

function DepartmentTools({ id }: { id: string }) {
  const { t: translate } = useTranslation('itDepartmentWork')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<DepartmentToolsResponseDtoDataItemsItem>()
  const query = useDepartmentToolsInUse(id, { page, pageSize: 20 })
  return (
    <section className='space-y-4'>
      <h2 className='text-lg font-semibold'>{translate('tools')}</h2>
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border/50 rounded-lg border border-border/70 bg-surface'>
            {query.data.data.items.map((tool) => (
              <article key={tool.assignmentId} className='flex flex-wrap items-center justify-between gap-4 p-4'>
                <div className='min-w-0 flex-1'>
                  <h3 className='truncate font-semibold' title={tool.application.name}>
                    {tool.application.name}
                  </h3>
                  <p className='truncate text-sm text-muted-foreground' title={tool.fullName}>
                    {tool.fullName}
                  </p>
                </div>
                <button type='button' className={itButtonClass} onClick={() => setSelected(tool)}>
                  {translate('details')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItPagination page={page} total={query.data?.data?.pagination.totalItems ?? 0} pageSize={20} onChange={setPage} />
      {selected && (
        <ItDetailDialog title={selected.application.name} onClose={() => setSelected(undefined)}>
          <dl className='grid gap-4 text-sm sm:grid-cols-2'>
            <div>
              <dt className='text-muted-foreground'>{translate('plan')}</dt>
              <dd className='break-words'>{selected.plan.name}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('holder')}</dt>
              <dd className='break-words'>{selected.fullName}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('code')}</dt>
              <dd className='font-mono'>{selected.employeeCode}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('kind')}</dt>
              <dd>{translate(`values.${selected.kind}`, { defaultValue: translate('unknown') })}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('source')}</dt>
              <dd>{translate(`values.${selected.source}`, { defaultValue: translate('unknown') })}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{translate('effectiveFrom')}</dt>
              <dd className='text-right font-mono tabular-nums'>{formatDate(selected.effectiveFrom)}</dd>
            </div>
            {selected.terminating && (
              <div>
                <dt className='text-muted-foreground'>{translate('terminatingUntil')}</dt>
                <dd className='text-right font-mono tabular-nums'>
                  {selected.terminatingUntil ? formatDate(selected.terminatingUntil) : translate('unknown')}
                </dd>
              </div>
            )}
          </dl>
        </ItDetailDialog>
      )}
    </section>
  )
}
