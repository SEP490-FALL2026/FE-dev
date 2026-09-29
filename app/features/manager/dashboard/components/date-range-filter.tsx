import { CalendarDays, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

export function DateRangeFilter({ start, end }: { start: string; end: string }) {
  const { t, i18n } = useTranslation()
  const [params, setParams] = useSearchParams()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, { year: 'numeric', month: 'short', day: 'numeric' })
  return (
    <div className='relative self-start sm:self-auto'>
      <button
        type='button'
        aria-label={t('manager.range')}
        aria-expanded={open}
        aria-controls='manager-date-range'
        onClick={() => setOpen(!open)}
        className='inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium shadow-xs hover:bg-brand-bg'
      >
        <CalendarDays size={16} className='text-neutral-500' aria-hidden='true' />
        <span>
          {date.format(new Date(`${start}T00:00:00`))} – {date.format(new Date(`${end}T00:00:00`))}
        </span>
        <ChevronDown size={14} aria-hidden='true' />
      </button>
      {open && (
        <form
          id='manager-date-range'
          className='absolute top-full left-0 z-10 mt-2 w-72 max-w-[calc(100vw-2rem)] space-y-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg sm:right-0 sm:left-auto'
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            const from = String(data.get('start'))
            const to = String(data.get('end'))
            if (from > to) {
              setError(true)
              return
            }
            const next = new URLSearchParams(params)
            next.set('start', from)
            next.set('end', to)
            setParams(next)
            setError(false)
            setOpen(false)
          }}
        >
          <label className='block space-y-1 text-xs'>
            {t('manager.start')}
            <input
              name='start'
              type='date'
              required
              defaultValue={start}
              className='block w-full rounded-lg border border-neutral-200 p-2'
            />
          </label>
          <label className='block space-y-1 text-xs'>
            {t('manager.end')}
            <input
              name='end'
              type='date'
              required
              defaultValue={end}
              className='block w-full rounded-lg border border-neutral-200 p-2'
            />
          </label>
          {error && (
            <p role='alert' className='text-xs text-danger'>
              {t('manager.invalidRange')}
            </p>
          )}
          <button
            type='submit'
            className='w-full rounded-lg bg-brand-600 p-2 text-xs font-semibold text-white hover:bg-brand-500'
          >
            {t('manager.apply')}
          </button>
        </form>
      )}
    </div>
  )
}
