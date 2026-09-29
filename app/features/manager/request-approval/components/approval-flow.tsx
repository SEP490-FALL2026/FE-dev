import { BriefcaseBusiness, Check, ShieldCheck, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { TeamRequest } from '~/entities/request/manager-requests-demo'

import { suppliedRequestDetail } from '../request-approval-demo'

export function ApprovalFlow({ request }: { request: TeamRequest }) {
  const { t, i18n } = useTranslation()
  const complete = request.id === suppliedRequestDetail.id
  const steps = [
    { title: t('requestApproval.employee'), icon: UserRound, name: request.name },
    {
      title: t('requestApproval.yourApproval'),
      icon: UserRound,
      name: t('requestApproval.you', { name: suppliedRequestDetail.manager })
    },
    { title: t('requestApproval.finance'), icon: BriefcaseBusiness },
    { title: t('requestApproval.itAdmin'), icon: ShieldCheck }
  ]
  return (
    <section className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
      <h2 className='mb-6 text-base font-bold'>{t('requestApproval.flow')}</h2>
      {complete ? (
        <ol>
          {steps.map(({ title, icon: Icon, name }, index) => (
            <li key={title} className={`relative flex gap-4 ${index < steps.length - 1 ? 'pb-8' : ''}`}>
              {index < steps.length - 1 && (
                <span aria-hidden='true' className='absolute top-8 bottom-0 left-4 w-px bg-neutral-200' />
              )}
              <span
                aria-hidden='true'
                className={`z-10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border bg-white ${index === 0 ? 'border-success text-success' : index === 1 ? 'border-2 border-brand-500 text-brand-500' : 'border-neutral-200 text-neutral-300'}`}
              >
                {index === 0 ? (
                  <Check size={16} />
                ) : (
                  <span className={`rounded-full ${index === 1 ? 'size-2.5 bg-brand-500' : 'size-2 bg-neutral-300'}`} />
                )}
              </span>
              <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <p className='flex items-center gap-2 text-sm font-semibold'>
                    <Icon
                      size={16}
                      aria-hidden='true'
                      className={index === 1 ? 'text-brand-600' : 'text-neutral-500'}
                    />
                    {title}
                  </p>
                  {index > 0 && (
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-medium ${index === 1 ? 'bg-brand-100 text-brand-600' : 'bg-neutral-100 text-neutral-500'}`}
                    >
                      {t('teamRequests.statuses.pending')}
                    </span>
                  )}
                </div>
                {name && <p className='mt-1 text-sm text-neutral-500'>{name}</p>}
                {index === 0 && (
                  <p className='mt-1 text-xs text-neutral-500'>
                    {t('requestApproval.submittedOn', {
                      date: new Intl.DateTimeFormat(i18n.resolvedLanguage, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                        timeZone: 'Asia/Ho_Chi_Minh'
                      }).format(new Date(request.submitted))
                    })}
                  </p>
                )}
                {index === 1 && (
                  <p className='mt-1 text-xs font-semibold text-danger'>
                    {t('requestApproval.sla', {
                      value: t('teamRequests.hoursLeft', {
                        value: new Intl.NumberFormat(i18n.resolvedLanguage).format(request.hoursLeft)
                      })
                    })}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className='text-sm text-neutral-500'>{t('requestApproval.flowUnknown')}</p>
      )}
    </section>
  )
}
