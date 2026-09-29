import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Calendar, Clock, Search, Zap } from 'lucide-react'

export interface RenewalScheduleItem {
  id: string
  subscriptionName: string
  vendor: string
  seats: number
  cancellationDeadline: string
  renewalDate: string
  annualCost: number
  unassignedSeats: number
  inactiveUsers: number
  potentialSavings: number
  status: 'PENDING_DECISION' | 'DECIDED_RENEW' | 'DECIDED_DOWNSIZE' | 'AUTO_RENEWED_INCIDENT'
}

export const MOCK_RENEWAL_ITEMS: RenewalScheduleItem[] = [
  {
    id: 'sub-01',
    subscriptionName: 'GitHub Enterprise & Copilot Business',
    vendor: 'GitHub / Microsoft',
    seats: 50,
    cancellationDeadline: '2026-10-05',
    renewalDate: '2026-11-05',
    annualCost: 45000000,
    unassignedSeats: 10,
    inactiveUsers: 5,
    potentialSavings: 13500000,
    status: 'PENDING_DECISION'
  },
  {
    id: 'sub-02',
    subscriptionName: 'Slack Enterprise Grid',
    vendor: 'Salesforce',
    seats: 120,
    cancellationDeadline: '2026-10-15',
    renewalDate: '2026-11-15',
    annualCost: 96000000,
    unassignedSeats: 15,
    inactiveUsers: 12,
    potentialSavings: 21600000,
    status: 'PENDING_DECISION'
  },
  {
    id: 'sub-03',
    subscriptionName: 'Jira Software Enterprise',
    vendor: 'Atlassian',
    seats: 80,
    cancellationDeadline: '2026-09-20',
    renewalDate: '2026-10-20',
    annualCost: 64000000,
    unassignedSeats: 8,
    inactiveUsers: 4,
    potentialSavings: 9600000,
    status: 'AUTO_RENEWED_INCIDENT'
  }
]

export function RenewalSchedulePage() {
  const { t } = useTranslation(['finance', 'common'])
  const [searchTerm, setSearchTerm] = useState('')

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  const filteredItems = MOCK_RENEWAL_ITEMS.filter(
    (item) =>
      item.subscriptionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{t('finance:renewals.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('finance:renewals.subtitle')}</p>
      </div>

      {/* Auto-Renewal Incident Warning Banner (BR-26.3 · KPI-4) */}
      <div className='rounded-xl border border-danger/40 bg-danger/10 p-5 shadow-xs flex items-start gap-4'>
        <div className='rounded-lg bg-danger/20 p-2 text-danger shrink-0'>
          <AlertTriangle className='h-6 w-6' />
        </div>
        <div className='space-y-1'>
          <h3 className='text-sm font-bold text-danger'>{t('finance:renewals.autoRenewalAlert.title')}</h3>
          <p className='text-xs text-foreground/90 leading-relaxed'>{t('finance:renewals.autoRenewalAlert.desc')}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className='rounded-xl border border-border bg-surface p-4 shadow-xs'>
        <div className='relative'>
          <Search className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('finance:renewals.searchPlaceholder')}
            className='w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden'
          />
        </div>
      </div>

      {/* Renewals Table */}
      <div className='overflow-hidden rounded-xl border border-border bg-surface shadow-xs'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-foreground'>
            <thead className='border-b border-border bg-surface-subtle text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              <tr>
                <th className='px-6 py-4'>{t('finance:renewals.table.subscription')}</th>
                <th className='px-6 py-4'>{t('finance:renewals.table.cancellationDeadline')}</th>
                <th className='px-6 py-4'>{t('finance:renewals.table.renewalDate')}</th>
                <th className='px-6 py-4'>{t('finance:renewals.table.wasteRecommendation')}</th>
                <th className='px-6 py-4 text-right'>{t('finance:renewals.table.status')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredItems.map((item) => (
                <tr key={item.id} className='transition-colors hover:bg-surface-subtle/60'>
                  {/* Subscription Info */}
                  <td className='px-6 py-4'>
                    <p className='font-bold text-foreground'>{item.subscriptionName}</p>
                    <p className='text-xs text-muted-foreground'>
                      {t('finance:renewals.vendorText', {
                        vendor: item.vendor,
                        seats: item.seats,
                        cost: formatCurrency(item.annualCost)
                      })}
                    </p>
                  </td>

                  {/* Cancellation Deadline */}
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-danger' />
                      <span className='font-bold text-danger text-sm'>{item.cancellationDeadline}</span>
                    </div>
                    <span className='text-[11px] text-muted-foreground'>{t('finance:renewals.landmarkText')}</span>
                  </td>

                  {/* Renewal Date */}
                  <td className='px-6 py-4'>
                    <span className='font-medium text-foreground text-xs'>{item.renewalDate}</span>
                  </td>

                  {/* Open Waste Recommendation */}
                  <td className='px-6 py-4'>
                    <div className='rounded-lg bg-warning/10 border border-warning/30 p-2.5 text-xs space-y-1'>
                      <div className='flex items-center gap-1 font-bold text-warning'>
                        <Zap className='h-3.5 w-3.5' />
                        <span>{t('finance:renewals.waste.badge')}</span>
                      </div>
                      <p className='text-[11px] text-foreground'>
                        {t('finance:renewals.unassignedText', {
                          unassigned: item.unassignedSeats,
                          inactive: item.inactiveUsers
                        })}
                      </p>
                      <p className='text-[11px] font-bold text-success'>
                        {t('finance:renewals.waste.potentialSavings', {
                          amount: formatCurrency(item.potentialSavings)
                        })}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className='px-6 py-4 text-right'>
                    {item.status === 'AUTO_RENEWED_INCIDENT' ? (
                      <span className='inline-flex items-center gap-1 rounded-full bg-danger/10 px-3 py-1 text-xs font-bold text-danger border border-danger/30'>
                        <AlertTriangle className='h-3.5 w-3.5' />
                        {t('finance:renewals.incidentBadge')}
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1 text-xs font-bold text-warning border border-warning/30'>
                        <Clock className='h-3.5 w-3.5' />
                        {t('finance:renewals.pendingBadge')}
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
