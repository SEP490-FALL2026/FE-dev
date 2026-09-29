import { CalendarCheck, Clock, DollarSign, FileText, Ghost } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { TeamMember } from '~/entities/user/team-member.types'

import { assignedSoftware } from '~/entities/license/employee-assignments-demo'
import { employeeDetailDemo } from '../employee-detail-demo'

export function EmployeeMetrics({ member, detailed }: { member: TeamMember; detailed: boolean }) {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const currency = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'currency', currency: 'USD' })
  const missing = t('employeeDetail.missing')
  const items = [
    {
      key: 'activeLicenses',
      value: number.format(member.activeLicenses),
      footer: detailed ? t('employeeDetail.across', { count: assignedSoftware.length }) : missing,
      icon: CalendarCheck,
      color: 'bg-success-bg text-success'
    },
    {
      key: 'pendingRequests',
      value: number.format(member.pendingRequests),
      footer: t('employeeDetail.awaitingApproval'),
      icon: Clock,
      color: 'bg-brand-100 text-brand-500'
    },
    {
      key: 'totalRequests',
      value: detailed ? number.format(employeeDetailDemo.totalRequests) : missing,
      footer: t('employeeDetail.allTime'),
      icon: FileText,
      color: 'bg-brand-100 text-brand-500'
    },
    {
      key: 'ghostSeats',
      value: detailed ? number.format(0) : missing,
      footer: detailed ? t('employeeDetail.noReview') : missing,
      icon: Ghost,
      color: 'bg-brand-100 text-brand-600'
    },
    {
      key: 'monthlyCost',
      value: detailed ? currency.format(assignedSoftware.reduce((sum, app) => sum + app.cost, 0)) : missing,
      footer: detailed ? t('employeeDetail.across', { count: assignedSoftware.length }) : missing,
      icon: DollarSign,
      color: 'bg-brand-100 text-brand-500'
    }
  ] as const
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5'>
      {items.map(({ key, value, footer, icon: Icon, color }) => (
        <section
          key={key}
          className='flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs'
        >
          <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${color}`}>
            <Icon size={20} aria-hidden='true' />
          </span>
          <div>
            <h2 className='text-xs text-neutral-500'>{t(`employeeDetail.${key}`)}</h2>
            <p className={value === missing ? 'mt-1 text-xs font-medium' : 'text-2xl font-bold tabular-nums'}>
              {value}
            </p>
            <p className='mt-0.5 text-xs text-neutral-500'>{footer}</p>
          </div>
        </section>
      ))}
    </div>
  )
}
