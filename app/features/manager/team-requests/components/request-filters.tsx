import { CalendarDays, Filter, RotateCcw, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { requestStatuses, requestTypes } from '~/entities/request/manager-requests-demo'
import { softwareNames, type RequestFilters as FilterState } from '../hooks/use-request-filters'

const control = 'w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-brand-500'
export function RequestFilters({ filters, invalidDates, update, reset }: FilterState) {
  const { t, i18n } = useTranslation()
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  })
  const [showDates, setShowDates] = useState(false)
  return (
    <div className='rounded-t-xl border-b border-neutral-200 bg-brand-bg p-4'>
      <div className='flex flex-wrap items-end gap-4'>
        <div className='relative min-w-52 flex-1'>
          <Search size={16} aria-hidden='true' className='pointer-events-none absolute top-3 left-3 text-neutral-500' />
          <input
            type='search'
            value={filters.search}
            onChange={(event) => update('search', event.target.value)}
            aria-label={t('teamRequests.search')}
            placeholder={t('teamRequests.searchPlaceholder')}
            className={`${control} pl-9`}
          />
        </div>
        <label className='w-full space-y-1 text-xs font-medium text-neutral-500 sm:w-44'>
          <span>{t('teamRequests.status')}</span>
          <select value={filters.status} onChange={(event) => update('status', event.target.value)} className={control}>
            <option value=''>{t('teamRequests.all')}</option>
            <option value='open'>{t('teamRequests.open')}</option>
            {requestStatuses.map((status) => (
              <option key={status} value={status}>
                {t(`teamRequests.statuses.${status}`)}
              </option>
            ))}
          </select>
        </label>
        <label className='w-full space-y-1 text-xs font-medium text-neutral-500 sm:w-36'>
          <span>{t('teamRequests.type')}</span>
          <select value={filters.type} onChange={(event) => update('type', event.target.value)} className={control}>
            <option value=''>{t('teamRequests.all')}</option>
            {requestTypes.map((type) => (
              <option key={type} value={type}>
                {t(`teamRequests.types.${type}`)}
              </option>
            ))}
          </select>
        </label>
        <label className='w-full space-y-1 text-xs font-medium text-neutral-500 sm:w-36'>
          <span>{t('teamRequests.software')}</span>
          <select
            value={filters.software}
            onChange={(event) => update('software', event.target.value)}
            className={control}
          >
            <option value=''>{t('teamRequests.all')}</option>
            {softwareNames.map((software) => (
              <option key={software} value={software}>
                {software}
              </option>
            ))}
          </select>
        </label>
        <div className='w-full space-y-1 text-xs font-medium text-neutral-500 sm:w-56'>
          <p>{t('teamRequests.date')}</p>
          <button
            type='button'
            onClick={() => setShowDates(!showDates)}
            aria-label={t('teamRequests.date')}
            aria-expanded={showDates}
            aria-controls='request-date-filters'
            className={`${control} flex items-center gap-2`}
          >
            <CalendarDays size={14} aria-hidden='true' />
            <span>
              {date.formatRange(
                new Date(filters.from),
                new Date(filters.to < filters.from ? filters.from : filters.to)
              )}
            </span>
          </button>
        </div>
        <div className='ml-auto flex gap-2'>
          <button
            type='button'
            onClick={reset}
            className='flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-500 hover:bg-brand-bg'
          >
            <RotateCcw size={14} aria-hidden='true' />
            {t('teamRequests.reset')}
          </button>
          <button
            type='button'
            onClick={() => setShowDates(!showDates)}
            aria-expanded={showDates}
            aria-controls='request-date-filters'
            className='flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-500 hover:bg-brand-bg'
          >
            <Filter size={14} aria-hidden='true' />
            {t('teamRequests.filters')}
          </button>
        </div>
      </div>
      <fieldset id='request-date-filters' hidden={!showDates} className={showDates ? 'mt-4 flex flex-wrap gap-3' : ''}>
        <legend className='mb-1 text-xs font-medium text-neutral-500'>{t('teamRequests.date')}</legend>
        {(['from', 'to'] as const).map((key) => (
          <label key={key} className='space-y-1 text-xs text-neutral-500'>
            <span>{t(`teamRequests.${key}`)}</span>
            <input
              type='date'
              value={filters[key]}
              onChange={(event) => update(key, event.target.value)}
              tabIndex={showDates ? 0 : -1}
              aria-invalid={invalidDates}
              aria-describedby={invalidDates ? 'request-date-error' : undefined}
              className={control}
            />
          </label>
        ))}
      </fieldset>
      {invalidDates && (
        <p id='request-date-error' role='alert' className='mt-3 text-sm text-danger'>
          {t('teamRequests.invalidDates')}
        </p>
      )}
    </div>
  )
}
