import { ArrowUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { SummaryCardData } from '../employee-dashboard-page'

interface SummaryCardsProps {
  cards: SummaryCardData[]
}

const accentColors: Record<string, { bar: string; iconBg: string; iconText: string }> = {
  brand: { bar: 'bg-brand-500', iconBg: 'bg-brand-100', iconText: 'text-brand-500' },
  warning: { bar: 'bg-brand-200', iconBg: 'bg-brand-100', iconText: 'text-brand-500' },
  danger: { bar: 'bg-danger', iconBg: 'bg-danger-bg', iconText: 'text-danger' },
  dark: { bar: 'bg-brand-600', iconBg: 'bg-brand-100', iconText: 'text-brand-600' }
}

export function SummaryCards({ cards }: SummaryCardsProps) {
  const { t } = useTranslation()

  return (
    <div className='mb-8 grid grid-cols-4 gap-6'>
      {cards.map((card) => {
        const colors = accentColors[card.accent] ?? accentColors.brand
        return (
          <div
            className='relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'
            key={card.titleKey}
          >
            <div className={`absolute top-0 left-0 h-full w-1 ${colors.bar}`} />
            <div className='flex gap-4'>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${colors.iconBg}`}>
                <card.icon className={`h-5 w-5 ${colors.iconText}`} />
              </div>
              <div>
                <p className='text-sm font-medium text-neutral-500'>{t(card.titleKey)}</p>
                <p className='my-1 text-3xl font-bold text-neutral-900'>{card.value}</p>
                <p className='text-sm text-neutral-500'>{t(card.subtitleKey)}</p>
              </div>
            </div>
            <div className='mt-4 flex items-center border-t border-neutral-200 pt-4 text-xs'>
              {card.change !== undefined && card.change !== 0 ? (
                <>
                  <span className='flex items-center gap-1 font-medium text-success'>
                    <ArrowUp className='h-3 w-3' />+{card.change}
                  </span>
                  <span className='ml-1 text-neutral-500'>{t(card.footerKey)}</span>
                </>
              ) : (
                <span className='text-neutral-500'>{t(card.footerKey)}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
