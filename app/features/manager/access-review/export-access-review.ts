import type { TFunction } from 'i18next'
import { csvCell } from '~/shared/lib/csv'
import { reviewMember, type AccessAssignment } from '~/entities/license/access-assignments-demo'

export function buildAccessReviewCsv(rows: readonly AccessAssignment[], locale: string, t: TFunction) {
  const date = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
  const number = new Intl.NumberFormat(locale)
  const header = ['employee', 'software', 'plan', 'assigned', 'activity', 'risk', 'status'] as const
  return (
    '\uFEFF' +
    [
      [t('accessReview.exportNote')],
      header.map((key) => t(`accessReview.columns.${key}`)),
      ...rows.map((row) => [
        reviewMember(row).name,
        row.software,
        row.plan,
        date.format(new Date(`${row.assigned}T00:00:00Z`)),
        t('accessReview.days', { value: number.format(row.days) }),
        t(`accessReview.risks.${row.risk}`),
        t(`accessReview.statuses.${row.status}`)
      ])
    ]
      .map((cells) => cells.map(csvCell).join(','))
      .join('\r\n')
  )
}
