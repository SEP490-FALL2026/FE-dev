import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Calendar, Clock, Search, Zap } from 'lucide-react'

import { MOCK_RENEWAL_ITEMS } from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'

interface FinanceRenewalScheduleViewProps {
  formatCurrency: (value: number) => string
  onSelectTab?: (tab: FinanceTabKey, params?: Record<string, string>) => void
}

export function FinanceRenewalScheduleView({ formatCurrency }: FinanceRenewalScheduleViewProps) {
  const { t } = useTranslation('dashboard')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = MOCK_RENEWAL_ITEMS.filter(
    (item) =>
      item.subscriptionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{t('finance.schedule.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('finance.schedule.subtitle')}</p>
      </div>

      {/* Main Table Card */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='relative w-full sm:w-72'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <input
              className='h-9 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('approvals.queue.searchPlaceholder')}
              type='text'
              value={searchTerm}
            />
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-3 px-4 font-semibold'>{t('finance.schedule.colSubscription')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.schedule.colVendor')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('finance.schedule.colSeats')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.schedule.colDeadline')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.schedule.colRenewal')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('finance.schedule.colCost')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('finance.schedule.colSavings')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('finance.schedule.colStatus')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredItems.map((item) => (
                <tr key={item.id} className='transition hover:bg-surface-subtle/50'>
                  <td className='py-3.5 px-4'>
                    <p className='font-bold text-foreground'>{item.subscriptionName}</p>
                  </td>
                  <td className='py-3.5 px-4 text-muted-foreground'>{item.vendor}</td>
                  <td className='py-3.5 px-4 text-center font-mono'>
                    {t('finance.schedule.seatsCount', { count: item.seats })}
                  </td>
                  <td className='py-3.5 px-4'>
                    <div className='flex items-center gap-1.5 font-bold text-danger'>
                      <Clock className='size-3.5 shrink-0' />
                      <span>{item.cancellationDeadline}</span>
                    </div>
                  </td>
                  <td className='py-3.5 px-4'>
                    <div className='flex items-center gap-1.5 text-muted-foreground'>
                      <Calendar className='size-3.5 shrink-0' />
                      <span>{item.renewalDate}</span>
                    </div>
                  </td>
                  <td className='py-3.5 px-4 text-right font-bold text-foreground'>
                    {formatCurrency(item.annualCost)}
                  </td>
                  <td className='py-3.5 px-4 text-right'>
                    <div className='flex items-center justify-end gap-1 font-bold text-success'>
                      <Zap className='size-3.5 text-warning shrink-0' />
                      <span>{formatCurrency(item.potentialSavings)}</span>
                    </div>
                    <p className='text-[10px] text-muted-foreground'>
                      {t('finance.schedule.savingsNote', {
                        amount: formatCurrency(item.potentialSavings),
                        seats: item.unassignedSeats + item.inactiveUsers
                      })}
                    </p>
                  </td>
                  <td className='py-3.5 px-4 text-center'>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${
                        item.status === 'AUTO_RENEWED_INCIDENT'
                          ? 'bg-danger/10 text-danger border border-danger/20'
                          : item.status === 'DECIDED_RENEW' || item.status === 'DECIDED_DOWNSIZE'
                            ? 'bg-success/10 text-success border border-success/20'
                            : 'bg-warning/10 text-warning border border-warning/20'
                      }`}
                    >
                      {item.status === 'AUTO_RENEWED_INCIDENT' ? (
                        <div className='flex items-center gap-1'>
                          <AlertTriangle className='size-3' />
                          <span>{t('finance.schedule.statusIncident')}</span>
                        </div>
                      ) : item.status === 'DECIDED_RENEW' ? (
                        t('finance.schedule.statusRenew')
                      ) : item.status === 'DECIDED_DOWNSIZE' ? (
                        t('finance.schedule.statusDownsize')
                      ) : (
                        t('finance.schedule.statusPending')
                      )}
                    </span>
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
