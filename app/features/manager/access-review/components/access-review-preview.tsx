import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import { reviewMember, type AccessAssignment } from '~/entities/license/access-assignments-demo'

export function AccessReviewPreview({ rows, onClose }: { rows: readonly AccessAssignment[]; onClose: () => void }) {
  const { t, i18n } = useTranslation()
  const [params] = useSearchParams()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const query = params.size ? `?${params}` : ''
  return (
    <section
      aria-label={t('accessReview.details')}
      className='space-y-4 rounded-xl border border-brand-200 bg-white p-6'
      tabIndex={-1}
      ref={(element) => element?.focus()}
    >
      <div className='flex items-center justify-between gap-3'>
        <h2 className='text-lg font-semibold'>{t('accessReview.details')}</h2>
        <button
          type='button'
          onClick={onClose}
          aria-label={t('accessReview.close')}
          className='rounded-lg p-2 hover:bg-brand-100'
        >
          <X size={18} aria-hidden='true' />
        </button>
      </div>
      <p className='text-sm leading-relaxed text-neutral-500'>{t('accessReview.readOnly')}</p>
      {rows.map((row) => (
        <div
          key={row.id}
          className='flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4'
        >
          <div>
            <Link to={`/manager/my-team/${row.employeeId}`} className='font-medium hover:text-brand-600'>
              {reviewMember(row).name}
            </Link>
            <p className='mt-1 text-sm text-neutral-500'>
              {row.software} · {row.plan}
            </p>
            <p className='mt-2 text-xs text-neutral-500'>
              {t('accessReview.activityDetail', {
                value: number.format(row.days),
                risk: t(`accessReview.risks.${row.risk}`)
              })}
            </p>
            <Link
              to={`/manager/access-review/${row.id}${query}`}
              className='mt-2 inline-block text-xs font-medium text-brand-600 hover:underline'
            >
              {t('assignmentDetail.openDetails')}
            </Link>
          </div>
          <span className='rounded-full bg-brand-100 px-3 py-1 text-xs text-brand-600'>
            {t(`accessReview.statuses.${row.status}`)}
          </span>
        </div>
      ))}
    </section>
  )
}
