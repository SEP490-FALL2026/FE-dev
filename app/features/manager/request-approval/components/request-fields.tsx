import { Building2, CalendarDays, FileText, Folder, Layers, UserRound, CircleDollarSign } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { TeamRequest } from '~/entities/request/manager-requests-demo'

import { suppliedRequestDetail } from '../request-approval-demo'

export function RequestFields({ request }: { request: TeamRequest }) {
  const { t, i18n } = useTranslation()
  const detail = request.id === suppliedRequestDetail.id ? suppliedRequestDetail : undefined
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium', timeZone: 'UTC' })
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const unknown = t('requestApproval.unknown')
  const fields = [
    {
      label: t('teamRequests.requestedBy'),
      value: request.name,
      sub: detail?.department,
      icon: UserRound,
      tone: 'bg-blue-50 text-blue-600'
    },
    { label: t('teamRequests.plan'), value: request.plan, icon: Layers, tone: 'bg-indigo-50 text-indigo-600' },
    {
      label: t('requestApproval.reason'),
      value: detail ? t('requestApproval.sampleReason') : unknown,
      icon: FileText,
      tone: 'bg-brand-100 text-brand-600'
    },
    {
      label: t('requestApproval.requiredFrom'),
      value: detail ? date.format(new Date(detail.requiredFrom)) : unknown,
      icon: CalendarDays,
      tone: 'bg-neutral-100 text-neutral-500'
    },
    {
      label: t('requestApproval.project'),
      value: detail?.project ?? unknown,
      icon: Folder,
      tone: 'bg-blue-50 text-blue-600'
    },
    {
      label: t('requestApproval.requiredUntil'),
      value: detail
        ? t('requestApproval.period', {
            date: date.format(new Date(detail.requiredUntil)),
            days: number.format((Date.parse(detail.requiredUntil) - Date.parse(detail.requiredFrom)) / 86400000 + 1)
          })
        : unknown,
      icon: CalendarDays,
      tone: 'bg-neutral-100 text-neutral-500'
    },
    {
      label: t('requestApproval.costCenter'),
      value: detail ? t('requestApproval.sampleCostCenter') : unknown,
      icon: Building2,
      tone: 'bg-blue-50 text-blue-600'
    },
    {
      label: t('requestApproval.estimatedCost'),
      value: detail
        ? t('requestApproval.monthly', {
            amount: new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'currency', currency: 'USD' }).format(
              detail.estimatedMonthlyCost
            )
          })
        : unknown,
      icon: CircleDollarSign,
      tone: 'bg-success/10 text-success'
    }
  ]
  return (
    <section className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
      <h2 className='mb-6 text-lg font-bold'>{t('requestApproval.details')}</h2>
      <dl className='grid gap-x-8 gap-y-6 md:grid-cols-2'>
        {fields.map(({ label, value, sub, icon: Icon, tone }) => (
          <div key={label} className='flex items-start gap-3'>
            <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${tone}`}>
              <Icon size={16} aria-hidden='true' />
            </span>
            <div>
              <dt className='mb-1 text-xs font-medium text-neutral-500'>{label}</dt>
              <dd className='text-sm leading-relaxed font-semibold'>{value}</dd>
              {sub && <dd className='text-xs text-neutral-500'>{sub}</dd>}
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
