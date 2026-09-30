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

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.myRequests.title')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('employee.myRequests.subtitle')}</p>
        </div>
        <button
          className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
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
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs'
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
            className='h-9 w-full rounded-xl border border-border bg-background pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('employee.myRequests.searchPlaceholder')}
            type='search'
            value={search}
          />
        </div>
      </div>

      {/* Requests Table Card */}
      <div className='overflow-hidden rounded-2xl border border-border bg-surface shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs whitespace-nowrap'>
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
                  <td className='py-4 px-6 font-mono font-bold text-primary'>
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
                      <span className='inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-2 py-0.5 text-[0.7rem] font-bold text-success'>
                        {t('employee.myRequests.statusApproved')}
                      </span>
                    ) : item.status === 'completed' ? (
                      <span className='inline-flex items-center gap-1 rounded-md border border-info/25 bg-info/10 px-2 py-0.5 text-[0.7rem] font-bold text-info'>
                        {t('employee.myRequests.statusCompleted')}
                      </span>
                    ) : item.status === 'rejected' ? (
                      <span className='inline-flex items-center gap-1 rounded-md border border-danger/25 bg-danger/10 px-2 py-0.5 text-[0.7rem] font-bold text-danger'>
                        {t('employee.myRequests.statusRejected')}
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1 rounded-md border border-warning/25 bg-warning/10 px-2 py-0.5 text-[0.7rem] font-bold text-warning'>
                        {t('employee.myRequests.statusPending')}
                      </span>
                    )}
                  </td>

                  <td className='py-4 px-6 text-right'>
                    <button
                      className='inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs transition hover:border-primary hover:bg-primary hover:text-primary-foreground'
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
    </div>
  )
}
