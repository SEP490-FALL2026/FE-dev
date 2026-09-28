import { ChevronRight, Clock, Info, Plus, Repeat, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import type { RequestTypeCardItem } from '../create-request.types'

interface RequestTypeCardProps {
  item: RequestTypeCardItem
}

export function RequestTypeCard({ item }: RequestTypeCardProps) {
  const { t } = useTranslation()

  const renderIcon = () => {
    switch (item.iconType) {
      case 'plus':
        return <Plus className='h-8 w-8' />
      case 'arrows-swap':
        return <Repeat className='h-8 w-8' />
      case 'clock':
        return <Clock className='h-8 w-8' />
      case 'rotate-ccw':
        return <Undo2 className='h-8 w-8' />
    }
  }

  const colorStyles = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600',
      calloutBg: 'bg-blue-50/60 text-blue-950',
      calloutIcon: 'text-blue-500',
      chevron: 'text-brand-500'
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600',
      calloutBg: 'bg-emerald-50/60 text-emerald-950',
      calloutIcon: 'text-emerald-500',
      chevron: 'text-emerald-500'
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600',
      calloutBg: 'bg-purple-50/60 text-purple-950',
      calloutIcon: 'text-purple-500',
      chevron: 'text-purple-500'
    },
    orange: {
      iconBg: 'bg-brand-100 text-brand-600',
      calloutBg: 'bg-brand-50/70 text-neutral-800',
      calloutIcon: 'text-brand-500',
      chevron: 'text-brand-500'
    }
  }[item.themeColor]

  return (
    <Link
      className='group relative block overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs transition-all hover:border-brand-200 hover:shadow-md'
      to={item.targetPath}
    >
      <div className='mb-4 flex items-start justify-between'>
        <div className='flex gap-4'>
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${colorStyles.iconBg}`}>
            {renderIcon()}
          </div>
          <div>
            <h2 className='mb-1 text-xl font-bold text-neutral-900 transition-colors group-hover:text-brand-600'>
              {t(item.titleKey)}
            </h2>
            <p className='max-w-[220px] text-sm text-neutral-600'>{t(item.descriptionKey)}</p>
          </div>
        </div>

        <ChevronRight
          className={`mt-2 h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1 ${colorStyles.chevron}`}
        />
      </div>

      <div className={`flex gap-3 rounded-xl p-4 text-sm ${colorStyles.calloutBg}`}>
        <Info className={`mt-0.5 h-5 w-5 shrink-0 ${colorStyles.calloutIcon}`} />
        <p className='leading-relaxed'>{t(item.calloutKey)}</p>
      </div>
    </Link>
  )
}
