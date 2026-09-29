import { CalendarDays, Download, Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useDocumentTitle } from '~/shared/lib/use-document-title'
import {
  accessAssignments,
  filterAccessAssignments,
  reviewMember,
  reviewStatuses,
  riskLevels
} from '~/entities/license/access-assignments-demo'
import { AccessReviewPreview } from './components/access-review-preview'
import { AccessReviewPagination } from './components/access-review-pagination'
import { AccessReviewMetrics } from './components/access-review-metrics'
import { AccessReviewTable } from './components/access-review-table'
import { buildAccessReviewCsv } from './export-access-review'

export function AccessReviewPage() {
  const { t, i18n } = useTranslation()
  useDocumentTitle(t('accessReview.documentTitle'))
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [selection, setSelection] = useState<string[]>([])
  const [viewIds, setViewIds] = useState<string[]>([])
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const status = reviewStatuses.find((value) => value === params.get('status')) ?? 'pending'
  const effectiveParams = new URLSearchParams(params)
  effectiveParams.set('status', status)
  const rows = filterAccessAssignments(effectiveParams)
  const size = [2, 5, 10, 20].find((value) => value === Number(params.get('size'))) ?? 10
  const totalPages = Math.max(1, Math.ceil(rows.length / size))
  const requestedPage = Number(params.get('page'))
  const page = Math.min(totalPages, Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1))
  const visible = rows.slice((page - 1) * size, page * size)
  const selected = rows.filter((row) => selection.includes(row.id)).map((row) => row.id)
  const viewRows = accessAssignments.filter((row) => viewIds.includes(row.id))
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  })
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next, { replace: true })
    setViewIds([])
  }
  const clear = () => {
    setParams({})
    setSelection([])
    setViewIds([])
  }
  const exportRows = () => {
    const url = URL.createObjectURL(
      new Blob([buildAccessReviewCsv(rows, i18n.resolvedLanguage ?? 'vi', t)], { type: 'text/csv;charset=utf-8' })
    )
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'access-review-Q2-2026.csv'
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const control = 'rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-brand-500'
  return (
    <div className='space-y-6 text-neutral-900'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>{t('accessReview.title')}</h1>
          <p className='mt-1 text-sm text-neutral-500'>{t('accessReview.subtitle')}</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <button
            type='button'
            disabled
            title={t('accessReview.periodHint')}
            className={`${control} flex items-center gap-2 disabled:cursor-not-allowed`}
          >
            <CalendarDays size={16} aria-hidden='true' />
            {t('accessReview.quarter', {
              value: number.format(2),
              year: new Intl.NumberFormat(i18n.resolvedLanguage, { useGrouping: false }).format(2026)
            })}
          </button>
          <button
            type='button'
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-expanded={filtersOpen}
            aria-controls='access-review-filters'
            className={`${control} flex items-center gap-2 hover:bg-brand-bg`}
          >
            <SlidersHorizontal size={16} aria-hidden='true' />
            {t('accessReview.filters')}
          </button>
          <button
            type='button'
            onClick={exportRows}
            disabled={!rows.length}
            className='flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <Download size={16} aria-hidden='true' />
            {t('accessReview.export')}
          </button>
        </div>
      </div>
      <p className='text-xs text-neutral-500'>
        {date.formatRange(new Date('2026-04-01T00:00:00Z'), new Date('2026-06-30T00:00:00Z'))}
      </p>
      <AccessReviewMetrics />
      <p className='text-xs leading-relaxed text-neutral-500'>{t('accessReview.sample')}</p>
      <section
        aria-label={t('accessReview.assignments')}
        className='overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm'
      >
        <div
          role='tablist'
          aria-label={t('accessReview.statusFilter')}
          className='flex overflow-x-auto border-b border-neutral-200 px-5'
        >
          {reviewStatuses.map((value, index) => (
            <button
              key={value}
              id={`access-tab-${value}`}
              role='tab'
              aria-selected={status === value}
              aria-controls='access-review-results'
              tabIndex={status === value ? 0 : -1}
              onKeyDown={(event) => {
                if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                  event.preventDefault()
                  const nextIndex =
                    event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? 2
                        : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3
                  update('status', reviewStatuses[nextIndex])
                  document.getElementById(`access-tab-${reviewStatuses[nextIndex]}`)?.focus()
                }
              }}
              onClick={() => update('status', value)}
              className={`shrink-0 border-b-2 px-4 py-4 text-sm font-medium ${status === value ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500 hover:text-brand-600'}`}
            >
              {t(`accessReview.tabs.${value}`, {
                value: number.format({ pending: 25, reviewed: 12, exempt: 2 }[value])
              })}
            </button>
          ))}
        </div>
        <div id='access-review-filters' hidden={!filtersOpen} className='border-b border-neutral-200 bg-brand-bg p-4'>
          <div className='flex flex-wrap items-center gap-3'>
            <div className='relative min-w-56 flex-1'>
              <Search size={16} aria-hidden='true' className='absolute top-3 left-3 text-neutral-500' />
              <input
                type='search'
                value={params.get('search') ?? ''}
                onChange={(event) => update('search', event.target.value)}
                aria-label={t('accessReview.search')}
                placeholder={t('accessReview.search')}
                className={`${control} w-full pl-9`}
              />
            </div>
            <label className='flex items-center gap-2 text-xs text-neutral-500'>
              {t('accessReview.columns.software')}
              <select
                value={params.get('software') ?? ''}
                onChange={(event) => update('software', event.target.value)}
                className={control}
              >
                <option value=''>{t('accessReview.all')}</option>
                {accessAssignments.map((row) => (
                  <option key={row.software} value={row.software}>
                    {row.software}
                  </option>
                ))}
              </select>
            </label>
            <label className='flex items-center gap-2 text-xs text-neutral-500'>
              {t('accessReview.team')}
              <select
                value={params.get('team') ?? ''}
                onChange={(event) => update('team', event.target.value)}
                className={control}
              >
                <option value=''>{t('accessReview.all')}</option>
                {[...new Set(accessAssignments.map((row) => reviewMember(row).team))].map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </label>
            <label className='flex items-center gap-2 text-xs text-neutral-500'>
              {t('accessReview.columns.risk')}
              <select
                value={params.get('risk') ?? ''}
                onChange={(event) => update('risk', event.target.value)}
                className={control}
              >
                <option value=''>{t('accessReview.all')}</option>
                {riskLevels.map((risk) => (
                  <option key={risk} value={risk}>
                    {t(`accessReview.risks.${risk}`)}
                  </option>
                ))}
              </select>
            </label>
            <button type='button' onClick={clear} className='text-sm font-medium text-brand-600 hover:underline'>
              {t('accessReview.clear')}
            </button>
          </div>
          {params.get('employee') && (
            <button
              type='button'
              onClick={() => update('employee', '')}
              className='mt-3 flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs text-brand-600'
            >
              {t('accessReview.removeEmployee')}
              <X size={12} aria-hidden='true' />
            </button>
          )}
        </div>
        <div id='access-review-results' role='tabpanel' aria-labelledby={`access-tab-${status}`}>
          <AccessReviewTable
            rows={visible}
            selected={selected}
            onSelect={(id) =>
              setSelection((current) =>
                current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
              )
            }
            onSelectPage={() =>
              setSelection((current) =>
                visible.every((row) => current.includes(row.id))
                  ? current.filter((id) => !visible.some((row) => row.id === id))
                  : [...new Set([...current, ...visible.map((row) => row.id)])]
              )
            }
          />
          {!rows.length && (
            <div className='space-y-3 p-10 text-center'>
              <h2 className='font-semibold'>{t('accessReview.empty')}</h2>
              <p className='text-sm text-neutral-500'>{t('accessReview.emptyHint')}</p>
              <button type='button' onClick={clear} className='text-sm font-medium text-brand-600 hover:underline'>
                {t('accessReview.clear')}
              </button>
            </div>
          )}
        </div>
        <AccessReviewPagination
          page={page}
          size={size}
          total={rows.length}
          totalPages={totalPages}
          selected={selected.length}
          onPage={(value) => update('page', String(value))}
          onSize={(value) => update('size', value)}
          onReview={() => setViewIds(selected)}
          onClear={() => setSelection([])}
        />
      </section>
      {viewRows.length > 0 && <AccessReviewPreview rows={viewRows} onClose={() => setViewIds([])} />}
      <div className='flex flex-wrap gap-4 text-xs text-neutral-500' aria-label={t('accessReview.legend')}>
        {riskLevels.map((risk) => (
          <span key={risk} className='flex items-center gap-2'>
            <span
              aria-hidden='true'
              className={`size-2 rounded-full ${risk === 'high' ? 'bg-danger' : risk === 'medium' ? 'bg-brand-500' : 'bg-success'}`}
            />
            {t(`accessReview.risks.${risk}`)}
          </span>
        ))}
      </div>
    </div>
  )
}
