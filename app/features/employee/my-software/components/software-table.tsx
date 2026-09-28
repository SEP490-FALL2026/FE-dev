import { MoreVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { SoftwareLicenseItem, SoftwareStatus } from '../my-software.types'

interface SoftwareTableProps {
  items: SoftwareLicenseItem[]
  onSelect: (item: SoftwareLicenseItem) => void
}

function StatusBadge({ status }: { status: SoftwareStatus }) {
  const { t } = useTranslation()

  switch (status) {
    case 'active':
      return (
        <span className='inline-flex items-center gap-1.5 rounded-full border border-status-active/20 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-status-active'>
          <span className='h-1.5 w-1.5 rounded-full bg-status-active' />
          {t('mySoftware.status.active')}
        </span>
      )
    case 'expiringSoon':
      return (
        <span className='inline-flex items-center gap-1.5 rounded-full border border-status-expiring/20 bg-orange-50 px-2.5 py-1 text-xs font-medium text-status-expiring'>
          <span className='h-1.5 w-1.5 rounded-full bg-status-expiring' />
          {t('mySoftware.status.expiringSoon')}
        </span>
      )
    case 'pending':
      return (
        <span className='inline-flex items-center gap-1.5 rounded-full border border-sky-300 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700'>
          <span className='h-1.5 w-1.5 rounded-full bg-sky-500' />
          {t('mySoftware.status.pending')}
        </span>
      )
    case 'returned':
      return (
        <span className='inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500'>
          <span className='h-1.5 w-1.5 rounded-full bg-neutral-400' />
          {t('mySoftware.status.returned')}
        </span>
      )
  }
}

export function SoftwareTable({ items, onSelect }: SoftwareTableProps) {
  const { t } = useTranslation()

  if (items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-sm'>
        <p className='text-base font-semibold text-neutral-900'>{t('mySoftware.table.emptyTitle')}</p>
        <p className='mt-1 text-sm text-neutral-500'>{t('mySoftware.table.emptyDescription')}</p>
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full text-left text-sm whitespace-nowrap'>
          <thead className='border-b border-neutral-200 bg-neutral-50/70 text-xs font-semibold uppercase tracking-wider text-neutral-500'>
            <tr>
              <th className='px-6 py-4'>{t('mySoftware.table.software')}</th>
              <th className='px-6 py-4'>{t('mySoftware.table.plan')}</th>
              <th className='px-6 py-4'>{t('mySoftware.table.status')}</th>
              <th className='px-6 py-4'>{t('mySoftware.table.assignedDate')}</th>
              <th className='px-6 py-4'>{t('mySoftware.table.expiration')}</th>
              <th className='px-6 py-4'>{t('mySoftware.table.action')}</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-neutral-200'>
            {items.map((item) => (
              <tr className='transition-colors hover:bg-neutral-50/60' key={item.id}>
                {/* Software Logo + Name */}
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-2'>
                      <img alt={item.name} className='h-6 w-6 object-contain' src={item.logoUrl} />
                    </div>
                    <div>
                      <div className='font-semibold text-neutral-900'>{item.name}</div>
                      <div className='text-xs text-neutral-500'>{item.vendor}</div>
                    </div>
                  </div>
                </td>

                {/* Plan */}
                <td className='px-6 py-4 text-neutral-600'>{item.plan}</td>

                {/* Status */}
                <td className='px-6 py-4'>
                  <StatusBadge status={item.status} />
                </td>

                {/* Assigned Date */}
                <td className='px-6 py-4 text-neutral-600'>{item.assignedDate}</td>

                {/* Expiration */}
                <td className='px-6 py-4 text-neutral-600'>
                  {item.expirationDate ? item.expirationDate : t('mySoftware.table.noExpiration')}
                </td>

                {/* Action */}
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    <button
                      className='rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-100 hover:text-brand-700'
                      onClick={() => onSelect(item)}
                      type='button'
                    >
                      {t('mySoftware.table.viewDetails')}
                    </button>
                    <button
                      aria-label={t('mySoftware.table.moreOptions')}
                      className='rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700'
                      type='button'
                    >
                      <MoreVertical className='h-4 w-4' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
