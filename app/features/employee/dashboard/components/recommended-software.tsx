import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { RecommendedItem } from '../employee-dashboard-page'

interface RecommendedSoftwareProps {
  items: RecommendedItem[]
}

const badgeStyles: Record<string, string> = {
  brand: 'bg-brand-100 text-brand-500',
  success: 'bg-success-bg text-success'
}

export function RecommendedSoftware({ items }: RecommendedSoftwareProps) {
  const { t } = useTranslation()

  return (
    <section className='rounded-xl border border-neutral-200 bg-white shadow-sm'>
      <div className='flex items-start justify-between border-b border-neutral-200 p-5'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-neutral-900'>
            <Sparkles className='h-5 w-5 text-brand-500' />
            {t('dashboard.recommended.title')}
          </h3>
          <p className='mt-1 text-sm text-neutral-500'>{t('dashboard.recommended.subtitle')}</p>
        </div>
        <a className='flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600' href='#'>
          {t('dashboard.recommended.viewCatalog')} <ArrowRight className='h-3 w-3' />
        </a>
      </div>

      <div className='grid grid-cols-4 gap-4 p-5'>
        {items.map((item) => (
          <div
            className='flex cursor-pointer flex-col items-center rounded-lg border border-neutral-200 bg-white p-4 text-center transition-colors hover:border-brand-200'
            key={item.name}
          >
            <img alt={item.name} className='mb-3 h-10 w-10 rounded' src={item.logo} />
            <h4 className='text-sm font-semibold text-neutral-900'>{item.name}</h4>
            <p className='mb-3 text-xs text-neutral-500'>{item.description}</p>
            <span
              className={`mb-4 rounded px-2 py-0.5 text-[10px] font-medium ${badgeStyles[item.badgeVariant] ?? badgeStyles.brand}`}
            >
              {item.badge}
            </span>
            <button
              className='mt-auto w-full rounded border border-brand-200 py-1.5 text-xs font-medium text-brand-500 transition-colors hover:bg-brand-100'
              type='button'
            >
              {t('dashboard.recommended.requestAccess')}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
