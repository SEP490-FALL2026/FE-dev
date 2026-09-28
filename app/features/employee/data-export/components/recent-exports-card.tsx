import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { RecentExportItem } from '../data-export.types'

interface RecentExportsCardProps {
  exportsList: RecentExportItem[]
}

export function RecentExportsCard({ exportsList }: RecentExportsCardProps) {
  const { t } = useTranslation()

  return (
    <div className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs'>
      <div className='mb-3.5 flex items-center justify-between border-b border-neutral-200 pb-3'>
        <h3 className='text-sm font-bold text-neutral-900'>{t('dataExport.recent.title')}</h3>
        <span className='text-[11px] font-medium text-neutral-500'>{t('dataExport.recent.timeframe')}</span>
      </div>

      <div className='space-y-3'>
        {exportsList.map((item) => (
          <div
            className={`flex items-center justify-between rounded-xl border border-neutral-200 bg-[#FEFBF7] p-3 ${
              item.isExpired ? 'opacity-70' : ''
            }`}
            key={item.id}
          >
            <div className='flex items-center gap-2.5'>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                  item.format === 'ZIP' ? 'bg-brand-50 text-brand-500' : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {item.format}
              </div>
              <div>
                <div className='text-xs font-bold text-neutral-900'>{item.name}</div>
                <div className='text-[10px] text-neutral-500'>{item.details}</div>
              </div>
            </div>

            {item.isExpired ? (
              <span className='rounded bg-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-600'>
                {t('dataExport.recent.expired')}
              </span>
            ) : (
              <button
                className='inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-brand-500 transition-colors hover:border-brand-500'
                type='button'
              >
                <Download className='h-3.5 w-3.5' />
                <span>{t('dataExport.recent.download')}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
