import { ArrowDownUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'

import type { RequestFilters } from '../hooks/use-request-filters'
import { RequestAvatar } from '~/entities/request/request-avatar'
import { RequestBadge } from '~/entities/request/request-badge'
import { RequestSoftware } from '~/entities/request/request-software'

export function RequestTable({ visible, descending, update, reset }: RequestFilters) {
  const { t, i18n } = useTranslation()
  const { search } = useLocation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
  const time = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-265 text-left text-sm'>
        <caption className='sr-only'>{t('teamRequests.title')}</caption>
        <thead className='border-b border-neutral-200 bg-brand-bg text-xs tracking-wider text-neutral-500 uppercase'>
          <tr>
            <th scope='col' aria-sort={descending ? 'descending' : 'ascending'} className='px-4 py-3'>
              <button
                type='button'
                onClick={() => update('sort', descending ? '' : 'desc')}
                className='flex items-center gap-2'
              >
                {t('teamRequests.id')}
                <ArrowDownUp size={12} aria-hidden='true' />
              </button>
            </th>
            {(['requestedBy', 'software', 'type', 'submitted', 'sla', 'status', 'actions'] as const).map((key) => (
              <th scope='col' key={key} className='px-4 py-3 whitespace-nowrap'>
                {t(`teamRequests.${key}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-neutral-200'>
          {visible.map((request) => (
            <tr key={request.id} className='hover:bg-brand-bg'>
              <td className='p-4 align-top'>
                <Link
                  to={`/manager/team-requests/${request.id}${search}`}
                  className='font-semibold text-brand-600 hover:underline'
                >
                  {request.id}
                </Link>
                <p className='mt-0.5 text-xs text-neutral-500'>{t(`teamRequests.types.${request.type}`)}</p>
              </td>
              <td className='p-4 align-top'>
                <div className='flex items-center gap-3'>
                  <RequestAvatar request={request} />
                  <div>
                    <p className='font-semibold whitespace-nowrap'>{request.name}</p>
                    <p className='mt-0.5 text-xs text-neutral-500'>{t(`teamRequests.roles.${request.role}`)}</p>
                  </div>
                </div>
              </td>
              <td className='p-4 align-top'>
                <RequestSoftware request={request} />
              </td>
              <td className='p-4 align-top'>
                <span
                  className={`inline-flex whitespace-nowrap rounded px-2 py-1 text-[11px] font-medium ${request.type === 'renewal' ? 'bg-success/10 text-success' : 'bg-brand-100 text-brand-600'}`}
                >
                  {t(`teamRequests.types.${request.type}`)}
                </span>
              </td>
              <td className='p-4 align-top whitespace-nowrap'>
                <time dateTime={request.submitted} className='font-medium'>
                  {date.format(new Date(request.submitted))}
                </time>
                <p className='mt-0.5 text-xs text-neutral-500'>{time.format(new Date(request.submitted))}</p>
              </td>
              <td className='p-4 align-top'>
                <p
                  className={`mb-1 text-xs font-medium whitespace-nowrap ${request.status === 'overdue' ? 'text-danger' : request.hoursLeft >= 24 ? 'text-success' : 'text-brand-600'}`}
                >
                  {request.hoursLeft >= 24
                    ? t('teamRequests.daysLeft', { value: number.format(request.hoursLeft / 24) })
                    : t('teamRequests.hoursLeft', { value: number.format(request.hoursLeft) })}
                </p>
                <div aria-hidden='true' className='h-1.5 w-24 overflow-hidden rounded-full bg-neutral-200'>
                  <div
                    style={{ width: new Intl.NumberFormat('en', { style: 'percent' }).format(request.slaFraction) }}
                    className={`h-full rounded-full ${request.status === 'overdue' ? 'bg-danger' : request.hoursLeft >= 24 ? 'bg-success' : 'bg-brand-200'}`}
                  />
                </div>
              </td>
              <td className='p-4 align-top'>
                <RequestBadge status={request.status} />
              </td>
              <td className='p-4 align-top'>
                <Link
                  to={`/manager/team-requests/${request.id}${search}`}
                  id={`review-${request.id}`}
                  aria-label={t('teamRequests.reviewRequest', { id: request.id })}
                  className='rounded-md border border-neutral-200 px-3 py-1 text-sm font-medium text-brand-600 hover:bg-brand-100'
                >
                  {t('teamRequests.review')}
                </Link>
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr>
              <td colSpan={8} className='p-12 text-center'>
                <p className='font-semibold'>{t('teamRequests.empty')}</p>
                <p className='mt-2 text-sm text-neutral-500'>{t('teamRequests.emptyHint')}</p>
                <button type='button' onClick={reset} className='mt-4 text-brand-600 hover:underline'>
                  {t('teamRequests.reset')}
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
