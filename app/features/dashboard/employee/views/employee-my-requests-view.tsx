import { CheckCircle2, ChevronRight, Clock, Plus, Search, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { employeeRequestItems } from '../employee-data'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeMyRequestsViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}

export function EmployeeMyRequestsView({ onSelectTab }: EmployeeMyRequestsViewProps) {
  const { t } = useTranslation('dashboard')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const filteredItems = useMemo(() => {
    return employeeRequestItems.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.softwareName.toLowerCase().includes(search.toLowerCase()) ||
        item.businessReason.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || item.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
  }

  const requestTypeLabel = (item: (typeof employeeRequestItems)[number]) =>
    item.requestType === 'newSoftware'
      ? t('employee.myRequests.typeNewSoftware')
      : item.requestType === 'changePlan'
        ? t('employee.myRequests.typeChangePlan')
        : item.requestType === 'renewal'
          ? t('employee.myRequests.typeRenewal')
          : t('employee.myRequests.typeReturnLicense')

  const requestStatusLabel = (item: (typeof employeeRequestItems)[number]) =>
    item.status === 'approved'
      ? t('employee.myRequests.statusApproved')
      : item.status === 'completed'
        ? t('employee.myRequests.statusCompleted')
        : item.status === 'rejected'
          ? t('employee.myRequests.statusRejected')
          : item.status === 'cancelled'
            ? t('employee.myRequests.statusCancelled')
            : t('employee.myRequests.statusPending')

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.myRequests.title')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('employee.myRequests.subtitle')}</p>
        </div>
        <button
          className='inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-action px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
          onClick={() => onSelectTab('create-request')}
          type='button'
        >
          <Plus aria-hidden='true' className='size-4' />
          {t('employee.myRequests.createAction')}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex flex-wrap items-center gap-1.5'>
          {(['all', 'pending', 'approved', 'rejected'] as const).map((key) => {
            const isActive = statusFilter === key
            const labelKey =
              key === 'all'
                ? 'tabAll'
                : key === 'pending'
                  ? 'tabPending'
                  : key === 'approved'
                    ? 'tabApproved'
                    : 'tabRejected'

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
                {t(`employee.myRequests.${labelKey}`)}
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
            aria-label={t('employee.myRequests.searchPlaceholder')}
            className='h-11 w-full rounded-xl border border-border bg-background pr-3 pl-9 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-sm'
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('employee.myRequests.searchPlaceholder')}
            type='search'
            value={search}
          />
        </div>
      </div>

      <p aria-live='polite' className='text-sm text-muted-foreground'>
        {t('employee.myRequests.resultsCount', { count: filteredItems.length })}
      </p>

      {filteredItems.length === 0 ? (
        <div className='rounded-2xl border border-border bg-surface p-8 text-center shadow-sm'>
          <h2 className='text-lg font-bold text-foreground'>{t('employee.myRequests.emptyTitle')}</h2>
          <p className='mx-auto mt-2 max-w-md text-sm text-muted-foreground'>
            {t('employee.myRequests.emptyDescription')}
          </p>
          <button
            className='mt-5 min-h-11 rounded-xl border border-border px-4 text-sm font-semibold text-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            onClick={clearFilters}
            type='button'
          >
            {t('employee.myRequests.clearFilters')}
          </button>
        </div>
      ) : (
        <>
          <div className='grid gap-3 md:hidden'>
            {filteredItems.map((item) => (
              <article className='rounded-2xl border border-border bg-surface p-4 shadow-sm' key={item.id}>
                <div className='flex items-start gap-3'>
                  <img
                    alt=''
                    className='size-11 shrink-0 rounded-xl border border-border bg-surface object-contain p-1.5'
                    src={item.softwareLogoUrl}
                  />
                  <div className='min-w-0 flex-1'>
                    <h2 className='text-base font-bold text-foreground'>{item.softwareName}</h2>
                    <p className='font-mono text-sm text-muted-foreground'>{item.id}</p>
                  </div>
                </div>
                <dl className='mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-sm'>
                  <div>
                    <dt className='text-muted-foreground'>{t('employee.myRequests.colType')}</dt>
                    <dd className='mt-1 font-semibold text-foreground'>{requestTypeLabel(item)}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{t('employee.myRequests.colStatus')}</dt>
                    <dd className='mt-1 font-semibold text-foreground'>{requestStatusLabel(item)}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{t('employee.myRequests.colSubmitted')}</dt>
                    <dd className='mt-1 text-foreground'>{item.submittedDate}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{t('employee.myRequests.colStep')}</dt>
                    <dd className='mt-1 text-foreground'>{item.currentApprover}</dd>
                  </div>
                </dl>
                <button
                  className='mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                  onClick={() => onSelectTab('request-detail', { id: item.id })}
                  type='button'
                >
                  {t('employee.myRequests.colActions')}
                  <ChevronRight aria-hidden='true' className='size-4' />
                </button>
              </article>
            ))}
          </div>

          {/* Requests Table Card */}
          <div className='hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-sm md:block'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm whitespace-nowrap'>
                <thead className='border-b border-border bg-surface-subtle/50 text-muted-foreground'>
                  <tr>
                    <th className='py-3.5 px-6 font-semibold'>{t('employee.myRequests.colId')}</th>
                    <th className='py-3.5 px-4 font-semibold'>{t('employee.myRequests.colSoftware')}</th>
                    <th className='py-3.5 px-4 font-semibold'>{t('employee.myRequests.colType')}</th>
                    <th className='py-3.5 px-4 font-semibold'>{t('employee.myRequests.colSubmitted')}</th>
                    <th className='py-3.5 px-4 font-semibold'>{t('employee.myRequests.colStep')}</th>
                    <th className='py-3.5 px-4 font-semibold'>{t('employee.myRequests.colStatus')}</th>
                    <th className='py-3.5 px-6 text-right font-semibold'>{t('employee.myRequests.colActions')}</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border/60'>
                  {filteredItems.map((item) => (
                    <tr className='group transition hover:bg-surface-subtle/40' key={item.id}>
                      <td className='py-4 px-6 font-mono font-bold text-primary-ink'>
                        <button
                          className='hover:underline'
                          onClick={() => onSelectTab('request-detail', { id: item.id })}
                          type='button'
                        >
                          {item.id}
                        </button>
                      </td>

                      <td className='py-4 px-4'>
                        <div className='flex items-center gap-2.5'>
                          <img
                            alt={item.softwareName}
                            className='size-7 rounded-lg border border-border bg-surface object-contain p-1'
                            src={item.softwareLogoUrl}
                          />
                          <span className='font-bold text-foreground'>{item.softwareName}</span>
                        </div>
                      </td>

                      <td className='py-4 px-4'>
                        <span className='inline-flex rounded-md border border-border bg-surface-subtle px-2 py-0.5 text-[0.7rem] font-semibold text-foreground'>
                          {item.requestType === 'newSoftware'
                            ? t('employee.myRequests.typeNewSoftware')
                            : item.requestType === 'changePlan'
                              ? t('employee.myRequests.typeChangePlan')
                              : item.requestType === 'renewal'
                                ? t('employee.myRequests.typeRenewal')
                                : t('employee.myRequests.typeReturnLicense')}
                        </span>
                      </td>

                      <td className='py-4 px-4 text-muted-foreground'>
                        <p className='font-medium text-foreground'>{item.submittedDate}</p>
                        <p className='text-[0.65rem]'>{item.submittedTime}</p>
                      </td>

                      <td className='py-4 px-4'>
                        <div className='flex items-center gap-2'>
                          {item.status === 'approved' || item.status === 'completed' ? (
                            <CheckCircle2 aria-hidden='true' className='size-4 text-success' />
                          ) : item.status === 'rejected' ? (
                            <XCircle aria-hidden='true' className='size-4 text-danger' />
                          ) : (
                            <Clock aria-hidden='true' className='size-4 text-warning' />
                          )}
                          <div>
                            <p className='font-semibold text-foreground'>{item.currentApprover}</p>
                            <p className='text-[0.65rem] text-muted-foreground'>
                              {item.currentStep.stepIndex}/{item.currentStep.totalSteps}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className='py-4 px-4'>
                        {item.status === 'approved' ? (
                          <span className='inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-2 py-0.5 text-xs font-bold text-success-ink'>
                            {t('employee.myRequests.statusApproved')}
                          </span>
                        ) : item.status === 'completed' ? (
                          <span className='inline-flex items-center gap-1 rounded-md border border-info/25 bg-info/10 px-2 py-0.5 text-xs font-bold text-info-ink'>
                            {t('employee.myRequests.statusCompleted')}
                          </span>
                        ) : item.status === 'rejected' ? (
                          <span className='inline-flex items-center gap-1 rounded-md border border-danger/25 bg-danger/10 px-2 py-0.5 text-xs font-bold text-danger-ink'>
                            {t('employee.myRequests.statusRejected')}
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1 rounded-md border border-warning/25 bg-warning/10 px-2 py-0.5 text-xs font-bold text-warning-ink'>
                            {t('employee.myRequests.statusPending')}
                          </span>
                        )}
                      </td>

                      <td className='py-4 px-6 text-right'>
                        <button
                          className='inline-flex min-h-10 items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-sm font-bold text-foreground shadow-2xs transition hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                          onClick={() => onSelectTab('request-detail', { id: item.id })}
                          type='button'
                        >
                          <span>{t('employee.myRequests.colActions')}</span>
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
