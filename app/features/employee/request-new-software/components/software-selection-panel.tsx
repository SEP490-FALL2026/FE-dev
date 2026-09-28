import { ArrowRight, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import type { AvailableSoftwareItem } from '../request-new-software.types'

interface SoftwareSelectionPanelProps {
  items: AvailableSoftwareItem[]
  selectedId: string
  onSelect: (id: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

function SoftwareLogo({ type }: { type: AvailableSoftwareItem['logoType'] }) {
  switch (type) {
    case 'figma':
      return <div className='h-6 w-6 rounded-full bg-gradient-to-br from-brand-500 to-rose-500' />
    case 'github':
      return (
        <div className='flex h-10 w-10 items-center justify-center rounded bg-slate-900 text-white shadow-xs'>
          <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
            <path
              clipRule='evenodd'
              d='M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z'
              fillRule='evenodd'
            />
          </svg>
        </div>
      )
    case 'jira':
      return (
        <div className='flex h-10 w-10 items-center justify-center rounded bg-brand-500 text-white shadow-xs'>
          <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M11.53 2c0 2.4-1.97 4.35-4.4 4.35H2.8C2.36 6.35 2 6.7 2 7.15V11.5c0 2.4 1.95 4.35 4.37 4.35h4.33c.44 0 .8-.36.8-.8V2z' />
            <path
              d='M21.2 2c0 2.4-1.97 4.35-4.4 4.35h-4.33c-.44 0-.8.35-.8.8V11.5c0 2.4 1.95 4.35 4.37 4.35h4.33c.44 0 .8-.36.8-.8V2z'
              opacity='0.7'
            />
          </svg>
        </div>
      )
  }
}

export function SoftwareSelectionPanel({
  items,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange
}: SoftwareSelectionPanelProps) {
  const { t } = useTranslation()

  return (
    <div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <div className='mb-6'>
        <div className='mb-1 text-sm font-medium text-brand-500'>{t('requestNewSoftware.selection.stepIndicator')}</div>
        <h2 className='mb-1 text-xl font-bold text-neutral-900'>{t('requestNewSoftware.selection.title')}</h2>
        <p className='text-sm text-neutral-600'>{t('requestNewSoftware.selection.subtitle')}</p>
      </div>

      {/* Search Input */}
      <div className='relative mb-6'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400'>
          <Search className='h-5 w-5' />
        </div>
        <input
          className='block w-full rounded-lg border border-neutral-200 bg-brand-50/50 py-2.5 pr-3 pl-10 text-sm text-neutral-900 placeholder-neutral-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-hidden'
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('requestNewSoftware.selection.searchPlaceholder')}
          type='text'
          value={searchQuery}
        />
      </div>

      {/* List */}
      <div className='space-y-3'>
        {items.map((item) => {
          const isSelected = item.id === selectedId

          return (
            <label
              className={`flex cursor-pointer items-start gap-4 rounded-xl p-4 transition-colors ${
                isSelected
                  ? 'border-2 border-brand-500 bg-brand-50/50 shadow-xs'
                  : 'border border-neutral-200 bg-white hover:border-brand-300'
              }`}
              key={item.id}
            >
              <div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border border-neutral-200 bg-white shadow-xs'>
                <SoftwareLogo type={item.logoType} />
              </div>

              <div className='flex-1'>
                <div className='mb-1 flex items-center justify-between'>
                  <h3 className='text-base font-semibold text-neutral-900'>{item.name}</h3>
                  <span className='rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-status-active'>
                    {t('requestNewSoftware.selection.statusAvailable')}
                  </span>
                </div>
                <p className='line-clamp-2 text-sm text-neutral-600'>{t(item.descriptionKey)}</p>
              </div>

              <div className='pt-1'>
                <input
                  checked={isSelected}
                  className='h-5 w-5 cursor-pointer accent-brand-500'
                  name='software'
                  onChange={() => onSelect(item.id)}
                  type='radio'
                />
              </div>
            </label>
          )
        })}
      </div>

      {/* Footer Support Notice */}
      <div className='mt-6 border-t border-neutral-100 pt-4'>
        <p className='mb-1 text-sm text-neutral-600'>{t('requestNewSoftware.selection.cantFind')}</p>
        <Link
          className='flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 hover:underline'
          to='/employee/my-requests'
        >
          <span>{t('requestNewSoftware.selection.contactSupport')}</span>
          <ArrowRight className='h-4 w-4' />
        </Link>
      </div>
    </div>
  )
}
