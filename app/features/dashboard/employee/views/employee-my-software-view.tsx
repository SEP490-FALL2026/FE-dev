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

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.mySoftware.title')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('employee.mySoftware.subtitle')}</p>
        </div>
        <button
          className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
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
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs'
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
            className='h-9 w-full rounded-xl border border-border bg-background pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('employee.mySoftware.searchPlaceholder')}
            type='search'
            value={search}
          />
        </div>
      </div>

      {/* Software Table Card */}
      <div className='overflow-hidden rounded-2xl border border-border bg-surface shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs whitespace-nowrap'>
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
                      <span className='inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-[0.7rem] font-bold text-success'>
                        <span className='size-1.5 rounded-full bg-success' />
                        {t('employee.mySoftware.statusActive')}
                      </span>
                    ) : item.status === 'expiringSoon' ? (
                      <span className='inline-flex items-center gap-1.5 rounded-full border border-warning/25 bg-warning/10 px-2.5 py-0.5 text-[0.7rem] font-bold text-warning'>
                        <span className='size-1.5 rounded-full bg-warning' />
                        {t('employee.mySoftware.statusExpiringDays', { days: item.daysLeft ?? 0 })}
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
                      className='inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs transition hover:border-primary hover:bg-primary hover:text-primary-foreground'
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
    </div>
  )
}
