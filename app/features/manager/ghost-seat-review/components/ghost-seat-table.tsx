import { ArrowDownUp, Ellipsis } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import { GhostSeatLogo } from '~/entities/license/ghost-seat-logo'
import { seatTier } from '~/entities/license/ghost-seats-demo'
import type { GhostSeatFilters } from '../hooks/use-ghost-seat-filters'
import { GhostSeatPagination } from './ghost-seat-pagination'

export function GhostSeatTable(state: GhostSeatFilters) {
  const { t, i18n } = useTranslation()
  const { search } = useLocation()
  const [selected, setSelected] = useState<Set<string>>(() => new Set(['github']))
  const percent = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'percent' })
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC'
  })
  const allSelected = state.rows.length > 0 && state.rows.every((seat) => selected.has(seat.id))
  function toggle(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }
  function togglePage() {
    const next = new Set(selected)
    state.rows.forEach((seat) => {
      if (allSelected) next.delete(seat.id)
      else next.add(seat.id)
    })
    setSelected(next)
  }
  return (
    <>
      {selected.size > 0 && (
        <div className='flex items-center justify-between gap-3 border-b border-neutral-200 bg-brand-bg px-4 py-2 text-xs text-neutral-500'>
          <span role='status'>{t('ghostSeat.selected', { count: selected.size })}</span>
          <button type='button' onClick={() => setSelected(new Set())} className='text-brand-600 hover:underline'>
            {t('ghostSeat.clearSelection')}
          </button>
        </div>
      )}
      <div className='overflow-x-auto'>
        <table className='w-full min-w-260 text-left text-xs'>
          <thead className='border-b border-neutral-200 bg-brand-bg text-neutral-500'>
            <tr>
              <th className='px-4 py-3'>
                <input
                  type='checkbox'
                  checked={allSelected}
                  ref={(node) => {
                    if (node) node.indeterminate = !allSelected && state.rows.some((seat) => selected.has(seat.id))
                  }}
                  onChange={togglePage}
                  aria-label={t('ghostSeat.selectPage')}
                  className='size-4 accent-brand-500'
                />
              </th>
              {(
                [
                  'application',
                  'employee',
                  'activity',
                  'inactive',
                  'tier',
                  'recommendation',
                  'confidence',
                  'actions'
                ] as const
              ).map((column) => (
                <th
                  key={column}
                  scope='col'
                  aria-sort={
                    column === 'activity' && state.sort.startsWith('activity')
                      ? state.sort === 'activity'
                        ? 'ascending'
                        : 'descending'
                      : column === 'confidence' && state.sort.startsWith('confidence')
                        ? state.sort === 'confidence'
                          ? 'descending'
                          : 'ascending'
                        : undefined
                  }
                  className={`px-3 py-3 font-medium ${column === 'actions' ? 'text-right' : ''}`}
                >
                  {column === 'activity' || column === 'confidence' ? (
                    <button
                      type='button'
                      className='flex items-center gap-1 hover:text-brand-600'
                      onClick={() =>
                        state.update(
                          'sort',
                          column === 'activity'
                            ? state.sort === 'activity'
                              ? 'activityDesc'
                              : 'activity'
                            : state.sort === 'confidence'
                              ? 'confidenceAsc'
                              : 'confidence'
                        )
                      }
                    >
                      {t(`ghostSeat.columns.${column}`)}
                      <ArrowDownUp size={12} aria-hidden='true' />
                    </button>
                  ) : (
                    t(`ghostSeat.columns.${column}`)
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-neutral-200'>
            {state.rows.map((seat) => (
              <tr key={seat.id} className={`hover:bg-brand-bg ${selected.has(seat.id) ? 'bg-brand-bg' : ''}`}>
                <td className='px-4 py-4'>
                  <input
                    type='checkbox'
                    checked={selected.has(seat.id)}
                    onChange={() => toggle(seat.id)}
                    aria-label={t('ghostSeat.selectSeat', { application: seat.application, employee: seat.employee })}
                    className='size-4 accent-brand-500'
                  />
                </td>
                <td className='px-3 py-4'>
                  <div className='flex items-center gap-3'>
                    <GhostSeatLogo seat={seat} />
                    <div>
                      <p className='font-semibold'>{seat.application}</p>
                      <p className='mt-1 text-[11px] text-neutral-500'>{t(`ghostSeat.categories.${seat.category}`)}</p>
                    </div>
                  </div>
                </td>
                <td className='px-3 py-4'>
                  <p className='font-medium'>{seat.employee}</p>
                  <p className='mt-1 text-[11px] text-neutral-500'>{seat.email}</p>
                </td>
                <td className='px-3 py-4 whitespace-nowrap text-neutral-500'>
                  {date.format(new Date(`${seat.lastActivity}T00:00:00Z`))}
                </td>
                <td className='px-3 py-4'>
                  <span
                    className={`rounded-full px-2 py-1 font-medium ${seatTier(seat) === 'critical' ? 'bg-danger/10 text-danger' : 'bg-brand-100 text-brand-600'}`}
                  >
                    {t('ghostSeat.days', { count: seat.inactiveDays })}
                  </span>
                </td>
                <td className='px-3 py-4 whitespace-nowrap'>
                  <span
                    className={`rounded-md border px-2 py-1 text-[11px] ${seatTier(seat) === 'critical' ? 'border-danger/20 bg-danger/5 text-danger' : 'border-brand-200 bg-brand-bg text-brand-600'}`}
                  >
                    {t(`ghostSeat.tiers.${seatTier(seat)}`)}
                  </span>
                </td>
                <td className='px-3 py-4 font-medium'>{t(`ghostSeat.recommendations.${seat.recommendation}`)}</td>
                <td className='px-3 py-4'>
                  <span
                    className={`rounded-full px-2 py-1 font-semibold ${seat.confidence >= 0.8 ? 'bg-success/10 text-success' : 'bg-brand-100 text-brand-600'}`}
                  >
                    {percent.format(seat.confidence)}
                  </span>
                </td>
                <td className='px-3 py-4'>
                  <div className='flex items-center justify-end gap-2'>
                    <Link
                      to={`/manager/ghost-seat-review/${seat.id}${search}`}
                      aria-label={t('ghostSeat.viewSeat', { application: seat.application, employee: seat.employee })}
                      className='font-semibold text-brand-600 hover:underline'
                    >
                      {t('ghostSeat.view')}
                    </Link>
                    <button
                      type='button'
                      disabled
                      title={t('ghostSeat.actionsUnavailable')}
                      aria-label={t('ghostSeat.moreActions', {
                        application: seat.application,
                        employee: seat.employee
                      })}
                      className='p-1 text-neutral-500 disabled:cursor-not-allowed'
                    >
                      <Ellipsis size={16} aria-hidden='true' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {state.rows.length === 0 && (
              <tr>
                <td colSpan={9} className='p-10 text-center'>
                  <p className='font-semibold'>{t('ghostSeat.empty')}</p>
                  <p className='mt-2 text-neutral-500'>{t('ghostSeat.emptyHint')}</p>
                  <button type='button' onClick={state.reset} className='mt-3 text-brand-600 hover:underline'>
                    {t('ghostSeat.reset')}
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <GhostSeatPagination {...state} />
    </>
  )
}
