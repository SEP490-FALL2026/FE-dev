import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreditCard, FileText, Search } from 'lucide-react'

export interface SoftwareExpenseItem {
  id: string
  name: string
  vendor: string
  logo: string
  pricingModel: string
  totalSeats: number
  assignedSeats: number
  annualCost: number
  costCenter: string
  paymentMethod: 'INVOICE' | 'CARD'
  cardLast4?: string
  status: 'ACTIVE' | 'PENDING_RENEWAL'
}

export const MOCK_SOFTWARE_DIRECTORY: SoftwareExpenseItem[] = [
  {
    id: 'soft-01',
    name: 'Figma Enterprise',
    vendor: 'Figma Inc.',
    logo: '🎨',
    pricingModel: 'Per Seat / Month',
    totalSeats: 35,
    assignedSeats: 25,
    annualCost: 31500000.0,
    costCenter: 'CC-DESIGN-01',
    paymentMethod: 'INVOICE',
    status: 'ACTIVE'
  },
  {
    id: 'soft-02',
    name: 'GitHub Copilot Business',
    vendor: 'GitHub / Microsoft',
    logo: '🐙',
    pricingModel: 'Per Seat / Month',
    totalSeats: 50,
    assignedSeats: 40,
    annualCost: 45000000,
    costCenter: 'CC-ENG-02',
    paymentMethod: 'INVOICE',
    status: 'PENDING_RENEWAL'
  },
  {
    id: 'soft-03',
    name: 'Notion AI Workspace',
    vendor: 'Notion Labs',
    logo: '📝',
    pricingModel: 'Per Seat / Month',
    totalSeats: 40,
    assignedSeats: 35,
    annualCost: 28800000,
    costCenter: 'CC-OPS-03',
    paymentMethod: 'CARD',
    cardLast4: '4892',
    status: 'ACTIVE'
  },
  {
    id: 'soft-04',
    name: 'Slack Enterprise Grid',
    vendor: 'Salesforce',
    logo: '💬',
    pricingModel: 'Per Seat / Year',
    totalSeats: 120,
    assignedSeats: 105,
    annualCost: 96000000,
    costCenter: 'CC-EXEC-01',
    paymentMethod: 'INVOICE',
    status: 'ACTIVE'
  }
]

export function SoftwareDirectoryPage() {
  const { t } = useTranslation(['finance', 'common'])
  const [searchTerm, setSearchTerm] = useState('')

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

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
          {t('finance:directory.title')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('finance:directory.subtitle')}</p>
      </div>

      {/* Search Bar */}
      <div className='rounded-xl border border-border bg-surface p-4 shadow-xs'>
        <div className='relative'>
          <Search className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('finance:directory.searchPlaceholder')}
            className='w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden'
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className='overflow-hidden rounded-xl border border-border bg-surface shadow-xs'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-foreground'>
            <thead className='border-b border-border bg-surface-subtle text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              <tr>
                <th className='px-6 py-4'>{t('finance:directory.table.software')}</th>
                <th className='px-6 py-4'>{t('finance:directory.table.pricingModel')}</th>
                <th className='px-6 py-4 text-right'>{t('finance:directory.table.annualCost')}</th>
                <th className='px-6 py-4'>{t('finance:directory.table.costCenter')}</th>
                <th className='px-6 py-4'>{t('finance:directory.table.paymentMethod')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filtered.map((item) => (
                <tr key={item.id} className='transition-colors hover:bg-surface-subtle/60'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl'>{item.logo}</span>
                      <div>
                        <p className='font-bold text-foreground'>{item.name}</p>
                        <p className='text-xs text-muted-foreground'>{item.vendor}</p>
                      </div>
                    </div>
                  </td>

                  <td className='px-6 py-4 text-xs'>
                    <p className='font-semibold text-foreground'>{item.pricingModel}</p>
                    <p className='text-muted-foreground'>
                      {t('finance:directory.seatsFormat', {
                        assigned: item.assignedSeats,
                        total: item.totalSeats
                      })}
                    </p>
                  </td>

                  <td className='px-6 py-4 text-right font-extrabold text-foreground'>
                    {formatCurrency(item.annualCost)}
                  </td>

                  <td className='px-6 py-4 text-xs font-mono font-semibold text-primary'>{item.costCenter}</td>

                  <td className='px-6 py-4 text-xs'>
                    {item.paymentMethod === 'INVOICE' ? (
                      <span className='inline-flex items-center gap-1 text-foreground font-medium'>
                        <FileText className='h-3.5 w-3.5 text-muted-foreground' />
                        {t('finance:directory.invoiceMethod')}
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1 text-foreground font-medium'>
                        <CreditCard className='h-3.5 w-3.5 text-warning' />
                        {t('finance:directory.cardMethod', { last4: item.cardLast4 || '****' })}
                      </span>
                    )}
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
