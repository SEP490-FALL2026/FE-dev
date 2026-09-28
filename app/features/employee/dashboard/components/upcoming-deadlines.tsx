import { Calendar, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { DeadlineItem } from '../employee-dashboard-page'

interface UpcomingDeadlinesProps {
  items: DeadlineItem[]
}

export function UpcomingDeadlines({ items }: UpcomingDeadlinesProps) {
  const { t } = useTranslation()

  return (
    <section className='rounded-xl border border-neutral-200 bg-white p-5 shadow-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='flex items-center gap-2 font-semibold text-neutral-900'>
          <Calendar className='h-4 w-4 text-brand-500' />
          {t('dashboard.deadlines.title')}
        </h3>
        <a className='text-xs font-medium text-brand-500 hover:underline' href='#'>
          {t('dashboard.deadlines.viewAll')}
        </a>
      </div>

      <div className='space-y-3'>
        {items.map((item) => (
          <div className='rounded-lg border border-brand-200/60 bg-neutral-50 p-4' key={item.name}>
            <div className='flex items-start gap-3'>
              <img alt={item.name} className='mt-0.5 h-6 w-6 rounded' src={item.logo} />
              <div className='flex-1'>
                <h4 className='text-sm font-semibold text-neutral-900'>{item.name}</h4>
                <p className='mt-1 flex items-center gap-1 text-xs font-medium text-danger'>
                  <Clock className='h-3 w-3' />
                  {t('dashboard.deadlines.expiresIn', { count: item.daysLeft })}
                </p>
              </div>
            </div>
            <div className='mt-2 text-right'>
              <p className='text-xs text-neutral-500'>{item.expirationDate}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
