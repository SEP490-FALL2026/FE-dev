import { Filter, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SoftwareFilters } from '../hooks/use-software-filters'

const control = 'rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-brand-500'
export function SoftwareFiltersBar({ filters, update, reset }: SoftwareFilters) {
  const { t } = useTranslation()
  const [more, setMore] = useState(filters.ghost || filters.expiring)
  return (
    <div className='border-b border-neutral-200 p-4'>
      <div className='flex flex-wrap items-center gap-3'>
        <div className='relative min-w-52 flex-1'>
          <Search size={16} aria-hidden='true' className='pointer-events-none absolute top-3 left-3 text-neutral-500' />
          <input
            type='search'
            aria-label={t('teamSoftware.search')}
            placeholder={t('teamSoftware.searchPlaceholder')}
            value={filters.search}
            onChange={(event) => update('search', event.target.value)}
            className={`${control} w-full bg-brand-bg pl-9`}
          />
        </div>
        <select
          aria-label={t('teamSoftware.status')}
          value={filters.status}
          onChange={(event) => update('status', event.target.value)}
          className={control}
        >
          <option value=''>{t('teamSoftware.filterAll', { label: t('teamSoftware.status') })}</option>
          <option value='active'>{t('teamSoftware.active')}</option>
          <option value='expired'>{t('teamSoftware.expired')}</option>
        </select>
        {(['department', 'team', 'costCenter'] as const).map((key) => (
          <select
            key={key}
            disabled
            aria-label={t(`teamSoftware.${key}`)}
            title={t('teamSoftware.organizationUnavailable')}
            className={`${control} disabled:cursor-not-allowed disabled:text-neutral-500`}
          >
            <option>{t('teamSoftware.filterAll', { label: t(`teamSoftware.${key}`) })}</option>
          </select>
        ))}
        <button
          type='button'
          onClick={() => setMore(!more)}
          aria-expanded={more}
          aria-controls='software-extra-filters'
          className={`${control} flex items-center gap-2 hover:bg-brand-bg`}
        >
          <Filter size={14} aria-hidden='true' />
          {t('teamSoftware.moreFilters')}
        </button>
        <button type='button' onClick={reset} className='text-xs font-medium text-brand-600 hover:underline'>
          {t('teamSoftware.reset')}
        </button>
        {filters.ghost && (
          <span className='rounded bg-brand-100 px-2 py-1 text-xs text-brand-600'>{t('teamSoftware.ghostOnly')}</span>
        )}
        {filters.expiring && (
          <span className='rounded bg-brand-100 px-2 py-1 text-xs text-brand-600'>
            {t('teamSoftware.expiringOnly')}
          </span>
        )}
        {filters.usage && (
          <span className='rounded bg-brand-100 px-2 py-1 text-xs text-brand-600'>
            {t(`teamSoftware.health.${filters.usage as 'high' | 'medium' | 'low'}`)}
          </span>
        )}
      </div>
      <div id='software-extra-filters' hidden={!more} className={more ? 'mt-4 flex flex-wrap items-center gap-4' : ''}>
        <select
          aria-label={t('teamSoftware.usage')}
          value={filters.usage}
          onChange={(event) => update('usage', event.target.value)}
          className={control}
        >
          <option value=''>{t('teamSoftware.filterAll', { label: t('teamSoftware.usage') })}</option>
          {(['high', 'medium', 'low'] as const).map((key) => (
            <option key={key} value={key}>
              {t(`teamSoftware.health.${key}`)}
            </option>
          ))}
        </select>
        {(['ghost', 'expiring'] as const).map((key) => (
          <label key={key} className='flex items-center gap-2 text-xs text-neutral-500'>
            <input
              type='checkbox'
              checked={filters[key]}
              onChange={(event) => update(key, event.target.checked ? '1' : '')}
              className='accent-brand-500'
            />
            {t(key === 'ghost' ? 'teamSoftware.ghostOnly' : 'teamSoftware.expiringOnly')}
          </label>
        ))}
      </div>
    </div>
  )
}
