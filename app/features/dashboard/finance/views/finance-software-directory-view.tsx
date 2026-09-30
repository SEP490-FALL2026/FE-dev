import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreditCard, FileText, Layers, Search } from 'lucide-react'

import { MOCK_SOFTWARE_DIRECTORY } from '../finance-data'
import type { FinanceTabKey } from '../finance-nav'

interface FinanceSoftwareDirectoryViewProps {
  formatCurrency: (value: number) => string
  onSelectTab?: (tab: FinanceTabKey, params?: Record<string, string>) => void
}

export function FinanceSoftwareDirectoryView({ formatCurrency }: FinanceSoftwareDirectoryViewProps) {
  const { t } = useTranslation('dashboard')
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = MOCK_SOFTWARE_DIRECTORY.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.costCenter.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {t('finance.directory.title')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('finance.directory.subtitle')}</p>
      </div>

      {/* Main Table Card */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='relative w-full sm:w-72'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <input
              className='h-9 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('finance.directory.searchPlaceholder')}
              type='text'
              value={searchTerm}
            />
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-3 px-4 font-semibold'>{t('finance.directory.colName')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.directory.colVendor')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.directory.colPricing')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('finance.directory.colSeats')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('finance.directory.colCost')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.directory.colDepartment')}</th>
                <th className='py-3 px-4 font-semibold'>{t('finance.directory.colPayment')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('finance.directory.colStatus')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className='py-12 text-center text-muted-foreground'>
                    <Layers className='mx-auto size-8 text-muted-foreground/40 mb-2' />
                    <p className='font-medium'>{t('finance.directory.empty')}</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className='transition hover:bg-surface-subtle/50'>
                    <td className='py-3.5 px-4'>
                      <div className='flex items-center gap-2.5'>
                        <span className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-base'>
                          {item.logo}
                        </span>
                        <p className='font-bold text-foreground'>{item.name}</p>
                      </div>
                    </td>
                    <td className='py-3.5 px-4 text-muted-foreground'>{item.vendor}</td>
                    <td className='py-3.5 px-4 text-muted-foreground'>{item.pricingModel}</td>
                    <td className='py-3.5 px-4 text-center font-mono'>
                      {t('finance.directory.seatsFormat', {
                        assigned: item.assignedSeats,
                        total: item.totalSeats
                      })}
                    </td>
                    <td className='py-3.5 px-4 text-right font-bold text-foreground'>
                      {formatCurrency(item.annualCost)}
                    </td>
                    <td className='py-3.5 px-4 font-mono text-muted-foreground'>{item.costCenter}</td>
                    <td className='py-3.5 px-4'>
                      {item.paymentMethod === 'INVOICE' ? (
                        <div className='flex items-center gap-1.5 text-muted-foreground'>
                          <FileText className='size-3.5 text-primary' />
                          <span>{t('finance.directory.paymentInvoice')}</span>
                        </div>
                      ) : (
                        <div className='flex items-center gap-1.5 text-muted-foreground'>
                          <CreditCard className='size-3.5 text-warning' />
                          <span>{t('finance.directory.paymentCard', { last4: item.cardLast4 || '••••' })}</span>
                        </div>
                      )}
                    </td>
                    <td className='py-3.5 px-4 text-center'>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          item.status === 'ACTIVE'
                            ? 'bg-success/10 text-success border border-success/20'
                            : 'bg-warning/10 text-warning border border-warning/20'
                        }`}
                      >
                        {item.status === 'ACTIVE'
                          ? t('finance.directory.statusActive')
                          : t('finance.directory.statusPendingRenewal')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
