import { CalendarDays, Download } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SoftwareFilters } from '../hooks/use-software-filters'
import { buildSoftwareCsv } from '../export-software'

export function SoftwareActions({ filters, invalidDates, filtered, update }: SoftwareFilters) {
  const { t, i18n } = useTranslation()
  const [dates, setDates] = useState(false)
  const [failed, setFailed] = useState(false)
  const format = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  })
  function download() {
    setFailed(false)
    try {
      const url = URL.createObjectURL(
        new Blob([buildSoftwareCsv(filtered, i18n.resolvedLanguage ?? 'vi', t)], { type: 'text/csv;charset=utf-8' })
      )
      const link = document.createElement('a')
      link.href = url
      link.download = `team-software-${filters.from}-${filters.to}.csv`
      document.body.append(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setFailed(true)
    }
  }
  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap items-center gap-3'>
        <button
          type='button'
          onClick={() => setDates(!dates)}
          aria-label={t('teamSoftware.period')}
          aria-expanded={dates}
          aria-controls='software-period'
          className='flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium hover:bg-brand-bg'
        >
          <CalendarDays size={16} aria-hidden='true' className='text-neutral-500' />
          {format.formatRange(new Date(filters.from), new Date(filters.to < filters.from ? filters.from : filters.to))}
        </button>
        <button
          type='button'
          disabled={filtered.length === 0}
          onClick={download}
          className='flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium hover:bg-brand-bg disabled:cursor-not-allowed disabled:opacity-40'
        >
          <Download size={16} aria-hidden='true' className='text-neutral-500' />
          {t('teamSoftware.export')}
        </button>
      </div>
      <fieldset
        id='software-period'
        hidden={!dates}
        className={dates ? 'flex flex-wrap gap-3 rounded-lg border border-neutral-200 bg-white p-3' : ''}
      >
        <legend className='text-xs text-neutral-500'>{t('teamSoftware.period')}</legend>
        {(['from', 'to'] as const).map((key) => (
          <label key={key} className='space-y-1 text-xs text-neutral-500'>
            <span>{t(`teamSoftware.${key}`)}</span>
            <input
              type='date'
              value={filters[key]}
              onChange={(event) => update(key, event.target.value)}
              aria-invalid={invalidDates}
              aria-describedby={invalidDates ? 'software-period-error' : undefined}
              className='block rounded border border-neutral-200 px-3 py-2 outline-brand-500'
            />
          </label>
        ))}
      </fieldset>
      {invalidDates && (
        <p id='software-period-error' role='alert' className='text-xs text-danger'>
          {t('teamSoftware.invalidDates')}
        </p>
      )}
      {failed && (
        <p role='alert' className='text-xs text-danger'>
          {t('teamSoftware.exportFailed')}
        </p>
      )}
    </div>
  )
}
