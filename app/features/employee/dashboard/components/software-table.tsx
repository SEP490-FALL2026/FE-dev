import { ArrowRight, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { SoftwareItem } from '../employee-dashboard-page'

interface SoftwareTableProps {
  items: SoftwareItem[]
  shownCount: number
  totalCount: number
}

export function SoftwareTable({ items, shownCount, totalCount }: SoftwareTableProps) {
  const { t } = useTranslation()

  return (
    <section className='rounded-xl border border-neutral-200 bg-white shadow-sm'>
      <div className='flex items-center justify-between border-b border-neutral-200 p-5'>
        <h3 className='text-lg font-semibold text-neutral-900'>{t('dashboard.cards.mySoftware.title')}</h3>
        <a className='flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600' href='#'>
          {t('dashboard.software.viewAll')} <ArrowRight className='h-3 w-3' />
        </a>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-neutral-50 text-xs uppercase text-neutral-500'>
            <tr>
              <th className='px-5 py-3 font-medium'>{t('dashboard.software.software')}</th>
              <th className='px-5 py-3 font-medium'>{t('dashboard.software.plan')}</th>
              <th className='px-5 py-3 font-medium'>{t('dashboard.software.status')}</th>
              <th className='px-5 py-3 font-medium'>{t('dashboard.software.assignedDate')}</th>
              <th className='px-5 py-3 font-medium'>{t('dashboard.software.expiration')}</th>
              <th className='px-5 py-3 font-medium'>{t('dashboard.software.usage')}</th>
              <th className='px-5 py-3' />
            </tr>
          </thead>
          <tbody className='divide-y divide-neutral-200'>
            {items.map((item) => (
              <tr className='hover:bg-neutral-50' key={item.name}>
                <td className='px-5 py-4'>
                  <div className='flex items-center gap-3'>
                    <img alt={item.name} className='h-8 w-8 rounded' src={item.logo} />
                    <div>
                      <p className='font-semibold text-neutral-900'>{item.name}</p>
                      <p className='text-xs text-neutral-500'>{item.vendor}</p>
                    </div>
                  </div>
                </td>
                <td className='px-5 py-4 text-neutral-500'>{item.plan}</td>
                <td className='px-5 py-4'>
                  <span className='rounded-full bg-success-bg px-2.5 py-1 text-xs font-medium text-success'>
                    {item.status}
                  </span>
                </td>
                <td className='px-5 py-4 text-neutral-500'>{item.assignedDate}</td>
                <td className='px-5 py-4'>
                  {item.daysLeft !== undefined ? (
                    <div>
                      <p className='font-medium text-neutral-900'>{item.expirationDate}</p>
                      <p className='mt-0.5 flex items-center gap-1 text-xs text-danger'>
                        <Clock className='h-3 w-3' />
                        {t('dashboard.software.daysLeft', { count: item.daysLeft })}
                      </p>
                    </div>
                  ) : (
                    <span className='text-neutral-500'>{t('dashboard.software.noExpiration')}</span>
                  )}
                </td>
                <td className='px-5 py-4'>
                  <div className='flex items-center gap-2'>
                    <div className='h-1.5 w-16 overflow-hidden rounded-full bg-neutral-200'>
                      <div
                        className={`h-full rounded-full ${item.usage >= 70 ? 'bg-brand-500' : 'bg-brand-200'}`}
                        style={{ width: `${item.usage}%` }}
                      />
                    </div>
                    <span className='text-xs font-medium text-neutral-500'>{item.usage}%</span>
                  </div>
                </td>
                <td className='px-5 py-4 text-right'>
                  <button
                    className='rounded border border-neutral-200 bg-brand-100 px-3 py-1.5 text-xs font-medium text-brand-500 transition-colors hover:bg-brand-200/40'
                    type='button'
                  >
                    {t('dashboard.software.view')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex items-center justify-between rounded-b-xl border-t border-neutral-200 bg-neutral-50 p-4 text-sm'>
        <span className='text-neutral-500'>
          {t('dashboard.software.showingOf', { shown: shownCount, total: totalCount })}
        </span>
        <button
          className='flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-1.5 font-medium text-neutral-900 transition-colors hover:bg-neutral-100'
          type='button'
        >
          {t('dashboard.software.viewAllSoftware')}
          <ArrowRight className='h-3 w-3 text-brand-500' />
        </button>
      </div>
    </section>
  )
}
