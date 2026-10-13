import { ChevronRight, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { employeeSoftwareItems } from '../employee-data'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeMySoftwareViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}

export function EmployeeMySoftwareView({ onSelectTab }: EmployeeMySoftwareViewProps) {
  const { t } = useTranslation('dashboard')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiringSoon' | 'pending' | 'returned'>('all')

  const filteredItems = useMemo(() => {
    return employeeSoftwareItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.vendor.toLowerCase().includes(search.toLowerCase()) ||
        item.plan.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || item.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
  }

  const statusLabel = (item: (typeof employeeSoftwareItems)[number]) =>
    item.status === 'active'
      ? t('employee.mySoftware.statusActive')
      : item.status === 'expiringSoon'
        ? t('employee.mySoftware.statusExpiringDays', { days: item.daysLeft ?? 0 })
        : item.status === 'pending'
          ? t('employee.mySoftware.statusPending')
          : t('employee.mySoftware.statusReturned')

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.mySoftware.title')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('employee.mySoftware.subtitle')}</p>
        </div>
        <button
          className='inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-action px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
          onClick={() => onSelectTab('create-request')}
          type='button'
        >
          <Plus aria-hidden='true' className='size-4' />
          {t('employee.mySoftware.actRequestNew')}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex flex-wrap items-center gap-1.5'>
          {(['all', 'active', 'expiringSoon', 'returned'] as const).map((key) => {
            const isActive = statusFilter === key
            const labelKey =
              key === 'all'
                ? 'filterAll'
                : key === 'active'
                  ? 'filterActive'
                  : key === 'expiringSoon'
                    ? 'filterExpiring'
                    : 'filterReturned'

            return (
              <button
                aria-pressed={isActive}
                className={`min-h-11 rounded-xl px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? 'bg-primary-action text-white shadow-xs'
                    : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                }`}
                key={key}
                onClick={() => setStatusFilter(key)}
                type='button'
              >
                {t(`employee.mySoftware.${labelKey}`)}
              </button>
            )
          })}
        </div>

        <div className='relative w-full sm:w-64'>
          <Search
            aria-hidden='true'
            className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
          />
          <input
            aria-label={t('employee.mySoftware.searchPlaceholder')}
            className='h-11 w-full rounded-xl border border-border bg-background pr-3 pl-9 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-sm'
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('employee.mySoftware.searchPlaceholder')}
            type='search'
            value={search}
          />
        </div>
      </div>

      <p aria-live='polite' className='text-sm text-muted-foreground'>
        {t('employee.mySoftware.resultsCount', { count: filteredItems.length })}
      </p>

      {filteredItems.length === 0 ? (
        <div className='rounded-2xl border border-border bg-surface p-8 text-center shadow-sm'>
          <h2 className='text-lg font-bold text-foreground'>{t('employee.mySoftware.emptyTitle')}</h2>
          <p className='mx-auto mt-2 max-w-md text-sm text-muted-foreground'>
            {t('employee.mySoftware.emptyDescription')}
          </p>
          <button
            className='mt-5 min-h-11 rounded-xl border border-border px-4 text-sm font-semibold text-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            onClick={clearFilters}
            type='button'
          >
            {t('employee.mySoftware.clearFilters')}
          </button>
        </div>
      ) : (
        <>
          <div className='grid gap-3 md:hidden'>
            {filteredItems.map((item) => (
              <article className='rounded-2xl border border-border bg-surface p-4 shadow-sm' key={item.id}>
                <div className='flex min-w-0 items-start gap-3'>
                  <img
                    alt=''
                    className='size-11 shrink-0 rounded-xl border border-border bg-surface object-contain p-1.5'
                    src={item.logoUrl}
                  />
                  <div className='min-w-0 flex-1'>
                    <h2 className='truncate text-base font-bold text-foreground'>{item.name}</h2>
                    <p className='text-sm text-muted-foreground'>{item.vendor}</p>
                  </div>
                </div>
                <dl className='mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-sm'>
                  <div>
                    <dt className='text-muted-foreground'>{t('employee.mySoftware.colPlan')}</dt>
                    <dd className='mt-1 font-semibold text-foreground'>{item.plan}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{t('employee.mySoftware.colStatus')}</dt>
                    <dd className='mt-1 font-semibold text-foreground'>{statusLabel(item)}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{t('employee.mySoftware.colAssigned')}</dt>
                    <dd className='mt-1 text-foreground'>{item.assignedDate}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{t('employee.mySoftware.colExpiration')}</dt>
                    <dd className='mt-1 text-foreground'>
                      {item.expirationDate ?? t('employee.mySoftware.noExpiration')}
                    </dd>
                  </div>
                </dl>
                <button
                  className='mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                  onClick={() => onSelectTab('software-detail', { id: item.id })}
                  type='button'
                >
                  {t('employee.mySoftware.actViewDetails')}
                  <ChevronRight aria-hidden='true' className='size-4' />
                </button>
              </article>
            ))}
          </div>

          {/* Software Table Card */}
          <div className='hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-sm md:block'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm whitespace-nowrap'>
                <thead className='border-b border-border bg-surface-subtle/50 text-muted-foreground'>
                  <tr>
                    <th className='py-3.5 px-6 font-semibold'>{t('employee.mySoftware.colSoftware')}</th>
                    <th className='py-3.5 px-4 font-semibold'>{t('employee.mySoftware.colPlan')}</th>
                    <th className='py-3.5 px-4 font-semibold'>{t('employee.mySoftware.colStatus')}</th>
                    <th className='py-3.5 px-4 font-semibold'>{t('employee.mySoftware.colAssigned')}</th>
                    <th className='py-3.5 px-4 font-semibold'>{t('employee.mySoftware.colExpiration')}</th>
                    <th className='py-3.5 px-6 text-right font-semibold'>{t('employee.mySoftware.colActions')}</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border/60'>
                  {filteredItems.map((item) => (
                    <tr className='group transition hover:bg-surface-subtle/40' key={item.id}>
                      <td className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <img
                            alt={item.name}
                            className='size-9 rounded-xl border border-border bg-surface object-contain p-1.5 shadow-xs'
                            src={item.logoUrl}
                          />
                          <div>
                            <p className='font-bold text-foreground'>{item.name}</p>
                            <p className='text-[0.7rem] text-muted-foreground'>{item.vendor}</p>
                          </div>
                        </div>
                      </td>

                      <td className='py-4 px-4 font-medium text-foreground'>{item.plan}</td>

                      <td className='py-4 px-4'>
                        {item.status === 'active' ? (
                          <span className='inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-xs font-bold text-success-ink'>
                            <span className='size-1.5 rounded-full bg-success' />
                            {t('employee.mySoftware.statusActive')}
                          </span>
                        ) : item.status === 'expiringSoon' ? (
                          <span className='inline-flex items-center gap-1.5 rounded-full border border-warning/25 bg-warning/10 px-2.5 py-0.5 text-xs font-bold text-warning-ink'>
                            <span className='size-1.5 rounded-full bg-warning' />
                            {t('employee.mySoftware.statusExpiringDays', { days: item.daysLeft ?? 0 })}
                          </span>
                        ) : item.status === 'pending' ? (
                          <span className='inline-flex items-center rounded-full border border-info/20 bg-info/10 px-2.5 py-0.5 text-xs font-bold text-info-ink'>
                            {t('employee.mySoftware.statusPending')}
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-2.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground'>
                            {t('employee.mySoftware.statusReturned')}
                          </span>
                        )}
                      </td>

                      <td className='py-4 px-4 text-muted-foreground'>{item.assignedDate}</td>

                      <td className='py-4 px-4'>
                        {item.expirationDate ? (
                          <span className='font-medium text-foreground'>{item.expirationDate}</span>
                        ) : (
                          <span className='text-muted-foreground'>{t('employee.mySoftware.noExpiration')}</span>
                        )}
                      </td>

                      <td className='py-4 px-6 text-right'>
                        <button
                          className='inline-flex min-h-10 items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-sm font-bold text-foreground shadow-2xs transition hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                          onClick={() => onSelectTab('software-detail', { id: item.id })}
                          type='button'
                        >
                          <span>{t('employee.mySoftware.actViewDetails')}</span>
                          <ChevronRight aria-hidden='true' className='size-3.5' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
