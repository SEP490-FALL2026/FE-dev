import { Building2, Code2, Mail, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { TeamRequest } from '~/entities/request/manager-requests-demo'
import { RequestAvatar } from '~/entities/request/request-avatar'

import { suppliedRequestDetail } from '../request-approval-demo'

export function RequesterInformation({ request }: { request: TeamRequest }) {
  const { t } = useTranslation()
  const detail = request.id === suppliedRequestDetail.id ? suppliedRequestDetail : undefined
  const unknown = t('requestApproval.unknown')
  const fields = [
    { label: t('requestApproval.department'), value: detail?.department ?? unknown, icon: Building2 },
    { label: t('requestApproval.email'), value: detail?.email ?? unknown, icon: Mail },
    { label: t('requestApproval.employeeId'), value: detail?.employeeId ?? unknown, icon: Code2 },
    { label: t('requestApproval.manager'), value: detail?.manager ?? unknown, icon: UserRound }
  ]
  return (
    <section className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
      <h2 className='mb-6 text-base font-bold'>{t('requestApproval.requester')}</h2>
      <div className='mb-6 flex items-center gap-4'>
        <RequestAvatar request={request} large />
        <div>
          <p className='font-bold'>{request.name}</p>
          <p className='mt-1 text-sm text-neutral-500'>{t(`teamRequests.roles.${request.role}`)}</p>
        </div>
      </div>
      <dl className='space-y-4'>
        {fields.map(({ label, value, icon: Icon }) => (
          <div key={label} className='flex flex-wrap justify-between gap-2 text-sm'>
            <dt className='flex items-center gap-2 text-neutral-500'>
              <Icon size={16} aria-hidden='true' />
              {label}
            </dt>
            <dd className='font-medium break-all'>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
