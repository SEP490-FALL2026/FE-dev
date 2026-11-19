import { ChevronRight, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { employeeSoftwareItems, type EmployeeSoftwareItem } from '../../employee-data'
import type { EmployeeTabKey } from '../../employee-nav'

interface EmployeeMySoftwareViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}

type StatusFilter = 'all' | EmployeeSoftwareItem['status']

function formatSoftwareDate(value: string, locale: string) {
  const [day, month, year] = value.split('/').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(
    date
  )
}

export function EmployeeMySoftwareView({ onSelectTab }: EmployeeMySoftwareViewProps) {
  const { i18n, t } = useTranslation('dashboard')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return employeeSoftwareItems.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesSearch =
        !query || [item.name, item.vendor, item.plan].some((value) => value.toLocaleLowerCase().includes(query))
      return matchesStatus && matchesSearch
    })
  }, [search, statusFilter])

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: t('employee.mySoftware.filterAll') },
    { key: 'active', label: t('employee.mySoftware.filterActive') },
    { key: 'expiringSoon', label: t('employee.mySoftware.filterExpiring') },
    { key: 'returned', label: t('employee.mySoftware.filterReturned') }
  ]

  const statusLabel = (item: EmployeeSoftwareItem) => {
    if (item.status === 'active') return t('employee.mySoftware.statusActive')
    if (item.status === 'returned') return t('employee.mySoftware.statusReturned')
    if (item.status === 'pending') return t('employee.mySoftware.statusPending')
    return item.daysLeft
      ? t('employee.mySoftware.statusExpiringDays', { days: item.daysLeft })
      : t('employee.mySoftware.statusExpiring')
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>{t('employee.mySoftware.title')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('employee.mySoftware.subtitle')}</p>
        </div>
        <button
          className='inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
          onClick={() => onSelectTab('create-request')}
          type='button'
        >
          <Plus aria-hidden='true' className='size-4' />
          {t('employee.mySoftware.actRequestNew')}
        </button>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex flex-wrap gap-1.5'>
          {filters.map((filter) => (
            <button
              aria-pressed={statusFilter === filter.key}
              className={`min-h-10 rounded-xl px-3.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                statusFilter === filter.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              }`}
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              type='button'
            >
              {filter.label}
            </button>
          ))}
        </div>
        <label className='flex min-h-11 w-full items-center gap-2 rounded-xl border border-border bg-surface-subtle px-3 text-muted-foreground sm:w-72'>
          <Search aria-hidden='true' className='size-4 shrink-0' />
          <input
            aria-label={t('employee.mySoftware.searchPlaceholder')}
            className='min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('employee.mySoftware.searchPlaceholder')}
            type='search'
            value={search}
          />
        </label>
      </div>

      {filteredItems.length === 0 ? (
        <div className='rounded-2xl border border-border bg-surface px-6 py-12 text-center'>
          <h2 className='text-lg font-bold text-foreground'>{t('employee.mySoftware.emptyTitle')}</h2>
          <p className='mx-auto mt-2 max-w-md text-sm text-muted-foreground'>
            {t('employee.mySoftware.emptyDescription')}
          </p>
          <button
            className='mt-5 min-h-11 rounded-xl border border-border px-4 text-sm font-semibold text-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            onClick={() => {
              setSearch('')
              setStatusFilter('all')
            }}
            type='button'
          >
            {t('employee.mySoftware.clearFilters')}
          </button>
        </div>
      ) : (
        <div className='space-y-3'>
          {filteredItems.map((item) => (
            <article
              className='overflow-hidden rounded-2xl border border-border border-l-4 border-l-primary bg-surface text-foreground shadow-sm'
              key={item.id}
            >
              <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-subtle/50 px-4 py-3 sm:px-5'>
                <p className='text-xs font-medium text-muted-foreground'>
                  {t('employee.mySoftware.colAssigned')}:{' '}
                  <span className='font-semibold text-foreground'>
                    {formatSoftwareDate(item.assignedDate, i18n.language)}
                  </span>
                </p>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    item.status === 'active'
                      ? 'border-success/20 bg-success/10 text-success-ink'
                      : item.status === 'returned'
                        ? 'border-border bg-surface text-muted-foreground'
                        : 'border-warning/25 bg-warning/10 text-warning-ink'
                  }`}
                >
                  {statusLabel(item)}
                </span>
              </div>
              <div className='flex flex-wrap items-center gap-4 px-4 py-4 sm:px-5'>
                <img
                  alt=''
                  className='size-14 shrink-0 rounded-xl border border-border bg-surface object-contain p-1.5'
                  src={item.logoUrl}
                />
                <div className='min-w-40 flex-1'>
                  <h2 className='text-base font-bold'>{item.name}</h2>
                  <p className='mt-0.5 text-sm text-muted-foreground'>{item.vendor}</p>
                </div>
                <div className='grid min-w-40 flex-1 grid-cols-2 gap-4 text-sm sm:max-w-sm'>
                  <div>
                    <p className='text-xs text-muted-foreground'>{t('employee.mySoftware.colPlan')}</p>
                    <p className='mt-1 font-semibold'>{item.plan}</p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>{t('employee.mySoftware.colExpiration')}</p>
                    <p className='mt-1 font-semibold'>
                      {item.expirationDate
                        ? formatSoftwareDate(item.expirationDate, i18n.language)
                        : t('employee.mySoftware.noExpiration')}
                    </p>
                  </div>
                </div>
                <button
                  className='inline-flex min-h-10 items-center gap-1.5 rounded-full border border-primary/25 bg-primary-soft/40 px-4 text-sm font-semibold text-primary-ink transition hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                  onClick={() => onSelectTab('software-detail', { id: item.id })}
                  type='button'
                >
                  {t('employee.mySoftware.actViewDetails')}
                  <ChevronRight aria-hidden='true' className='size-4' />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
