import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useTranslation } from 'react-i18next'
import { useOffboardingCaseList } from '~/shared/api/generated/operations/offboarding-cases/offboarding-case-list'
import type { OffboardingCaseListParams } from '~/shared/api/generated/model/offboarding-cases/offboardingCaseListParams'
import { OffboardingCaseListRevocationOverdue } from '~/shared/api/generated/model/offboarding-cases/offboardingCaseListRevocationOverdue'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, itButtonClass, itInputClass } from '../../shared/components/it-form'
import { OffboardingDetails } from '../components/offboarding-details'
import { OffboardingState } from '../enums/offboarding-state'

export function ItOffboardingView({
  onSelectTab,
  initialCaseId,
  initialState
}: {
  onSelectTab: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
  initialCaseId?: string
  initialState?: OffboardingCaseListParams['state']
}) {
  const { t: translate } = useTranslation('itOffboarding')
  const { formatDate } = useDashboardFormat()
  const [searchParams, setSearchParams] = useSearchParams()
  const [fallbackId, setFallbackId] = useState(initialCaseId)
  const [fallbackState, setFallbackState] = useState(initialState)
  const selected = searchParams.get('id') ?? fallbackId
  const requestedPage = Number(searchParams.get('page') ?? 1)
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const state = Object.values(OffboardingState).find((value) => value === searchParams.get('state')) ?? fallbackState
  const overdueOnly = searchParams.get('revocationOverdue') === 'true'
  const lastWorkingDayFrom = searchParams.get('lastWorkingDayFrom') || undefined
  const lastWorkingDayTo = searchParams.get('lastWorkingDayTo') || undefined
  function update(values: Record<string, string | undefined>) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('tab', 'offboarding')
      for (const [key, value] of Object.entries(values)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      return next
    })
  }
  function select(id?: string) {
    setFallbackId(undefined)
    update({ id })
  }
  const query = useOffboardingCaseList(
    {
      page,
      pageSize: 20,
      state,
      lastWorkingDayFrom,
      lastWorkingDayTo,
      ...(overdueOnly ? { revocationOverdue: OffboardingCaseListRevocationOverdue.true } : {})
    },
    { query: { enabled: !selected } }
  )
  const data = query.data?.data
  if (selected)
    return <OffboardingDetails key={selected} id={selected} onBack={() => select()} onSelectTab={onSelectTab} />
  return (
    <div className='space-y-5'>
      <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('title')}</h1>
      <div className='flex flex-wrap gap-2' role='group' aria-label={translate('filter')}>
        {[undefined, ...Object.values(OffboardingState)].map((value) => (
          <button
            key={value ?? 'all'}
            className={itButtonClass}
            aria-pressed={state === value}
            onClick={() => {
              setFallbackState(undefined)
              update({ state: value, page: '1' })
            }}
          >
            {value ? translate(`states.${value}`) : translate('all')}
          </button>
        ))}
        <button
          className={itButtonClass}
          aria-pressed={overdueOnly}
          onClick={() => {
            update({ revocationOverdue: overdueOnly ? undefined : 'true', page: '1' })
          }}
        >
          {translate('overdueFilter')}
        </button>
      </div>
      <form
        key={String(lastWorkingDayFrom) + ':' + String(lastWorkingDayTo)}
        className='grid items-end gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-3'
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          update({
            lastWorkingDayFrom: String(form.get('lastWorkingDayFrom') ?? '') || undefined,
            lastWorkingDayTo: String(form.get('lastWorkingDayTo') ?? '') || undefined,
            page: '1'
          })
        }}
      >
        <ItField label={translate('lastWorkingDayFrom')}>
          <input
            name='lastWorkingDayFrom'
            type='date'
            defaultValue={lastWorkingDayFrom ?? ''}
            className={itInputClass}
          />
        </ItField>
        <ItField label={translate('lastWorkingDayTo')}>
          <input name='lastWorkingDayTo' type='date' defaultValue={lastWorkingDayTo ?? ''} className={itInputClass} />
        </ItField>
        <button type='submit' className={itButtonClass}>
          {translate('applyFilters')}
        </button>
      </form>
      <ItQueryState query={query}>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
          {data?.items.map((item) => (
            <button
              key={item.id}
              className='space-y-2 rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:bg-surface-subtle focus-visible:outline-primary'
              onClick={() => select(item.id)}
            >
              <p className='truncate font-semibold' title={item.employee.fullName}>
                {item.employee.fullName}
              </p>
              <p className='text-sm text-muted-foreground'>{item.employee.employeeCode}</p>
              <p className='text-sm'>
                {translate('lastDay')}: {formatDate(item.lastWorkingDay)}
              </p>
              <p className='text-sm'>
                {translate(`states.${item.state}`, { defaultValue: translate('states.UNKNOWN') })} ·{' '}
                {translate('rightsCount', { count: item.heldRights })}
              </p>
              {item.revocation.dueOn && (
                <p className={`text-sm ${item.revocation.overdue ? 'text-danger' : ''}`}>
                  {translate(item.revocation.overdue ? 'revocationOverdueOn' : 'revocationDueOn', {
                    date: formatDate(item.revocation.dueOn)
                  })}
                </p>
              )}
              {item.accountLockMissing && <p className='text-sm text-danger'>{translate('lockMissing')}</p>}
              {item.closed && <p className='text-sm'>{translate('closed')}</p>}
            </button>
          ))}
          {!data?.items.length && <ItEmpty />}
        </div>
      </ItQueryState>
      <ItPagination
        page={page}
        total={data?.pagination.totalItems ?? 0}
        pageSize={20}
        disabled={query.isFetching}
        onChange={(value) => update({ page: String(value) })}
      />
    </div>
  )
}
