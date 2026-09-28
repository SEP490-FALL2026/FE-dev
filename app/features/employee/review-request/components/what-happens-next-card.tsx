import { Check, Clock, SendHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NextStepItem } from '../review-request.types'

export function WhatHappensNextCard() {
  const { t } = useTranslation()

  const items: NextStepItem[] = [
    {
      id: 'item1',
      text: t('reviewRequest.whatNext.item1'),
      color: 'purple'
    },
    {
      id: 'item2',
      text: t('reviewRequest.whatNext.item2'),
      color: 'orange'
    },
    {
      id: 'item3',
      text: t('reviewRequest.whatNext.item3'),
      color: 'green'
    }
  ]

  const getItemIcon = (color: NextStepItem['color']) => {
    switch (color) {
      case 'purple':
        return (
          <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600'>
            <SendHorizontal className='h-3.5 w-3.5' />
          </div>
        )
      case 'orange':
        return (
          <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600'>
            <Clock className='h-3.5 w-3.5' />
          </div>
        )
      case 'green':
      default:
        return (
          <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600'>
            <Check className='h-3.5 w-3.5' />
          </div>
        )
    }
  }

  return (
    <div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <h2 className='mb-4 text-base font-semibold text-neutral-900'>{t('reviewRequest.whatNext.title')}</h2>
      <ul className='space-y-4 text-sm text-neutral-600'>
        {items.map((item) => (
          <li className='flex items-start gap-3' key={item.id}>
            {getItemIcon(item.color)}
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
