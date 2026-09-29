import { Check, FileText, RefreshCw, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { activities } from '../employee-detail-demo'

export function EmployeeActivity() {
  const { t, i18n } = useTranslation()
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium', timeZone: 'UTC' })
  const icons = { approved: Check, requested: FileText, renewed: RefreshCw, review: UserRound }
  return (
    <ul className='space-y-4'>
      {activities.map((activity) => {
        const Icon = icons[activity.id]
        const actor =
          'actor' in activity
            ? t('employeeDetail.by', { name: activity.actor })
            : activity.id === 'requested'
              ? t('employeeDetail.awaitingApproval')
              : activity.id === 'renewed'
                ? t('employeeDetail.by', { name: t('employeeDetail.itAdmin') })
                : t('employeeDetail.completed')
        return (
          <li key={activity.id} className='flex items-start gap-3'>
            <span
              className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${activity.id === 'approved' ? 'bg-success-bg text-success' : 'bg-brand-100 text-brand-500'}`}
            >
              <Icon size={14} aria-hidden='true' />
            </span>
            <div>
              <p className='text-sm font-medium'>
                {t(`employeeDetail.${activity.key}`, {
                  software: 'software' in activity ? activity.software : undefined
                })}
              </p>
              <p className='mt-0.5 text-xs text-neutral-500'>
                <time dateTime={activity.date}>{date.format(new Date(`${activity.date}T00:00:00Z`))}</time> · {actor}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
