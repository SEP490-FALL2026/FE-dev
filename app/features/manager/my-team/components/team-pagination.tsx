import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function TeamPagination({
  page,
  pageSize,
  pageCount,
  total,
  onPage,
  onSize
}: {
  page: number
  pageSize: number
  pageCount: number
  total: number
  onPage: (page: number) => void
  onSize: (size: number) => void
}) {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  return (
    <div className='flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 p-4 text-sm text-neutral-500'>
      <p>
        {t('managerTeam.showing', {
          from: number.format(total === 0 ? 0 : (page - 1) * pageSize + 1),
          to: number.format(Math.min(page * pageSize, total)),
          total: number.format(total)
        })}
      </p>
      <div className='flex flex-wrap items-center gap-4'>
        <nav aria-label={t('managerTeam.pagination')} className='flex items-center gap-1'>
          <button
            type='button'
            aria-label={t('managerTeam.previous')}
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
            className='flex size-8 items-center justify-center rounded border border-neutral-200 hover:bg-brand-bg disabled:opacity-50'
          >
            <ChevronLeft size={14} aria-hidden='true' />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type='button'
              aria-label={t('managerTeam.page', { page: number.format(n) })}
              aria-current={page === n ? 'page' : undefined}
              onClick={() => onPage(n)}
              className={`size-8 rounded border font-medium ${page === n ? 'border-brand-500 bg-brand-100 text-brand-600' : 'border-transparent hover:bg-brand-bg'}`}
            >
              {number.format(n)}
            </button>
          ))}
          <button
            type='button'
            aria-label={t('managerTeam.next')}
            disabled={page >= pageCount}
            onClick={() => onPage(page + 1)}
            className='flex size-8 items-center justify-center rounded border border-neutral-200 hover:bg-brand-bg disabled:opacity-50'
          >
            <ChevronRight size={14} aria-hidden='true' />
          </button>
        </nav>
        <select
          aria-label={t('managerTeam.pageSize')}
          value={pageSize}
          onChange={(e) => onSize(Number(e.target.value))}
          className='rounded border border-neutral-200 bg-white px-2 py-1 outline-brand-500'
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {t('managerTeam.perPage', { count: size })}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
