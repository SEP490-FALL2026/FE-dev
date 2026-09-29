import { BriefcaseBusiness, Building2, CalendarDays, Mail, MapPin, Phone, UserRound, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MemberAvatar } from '~/entities/user/member-avatar'
import type { TeamMember } from '~/entities/user/team-member.types'

import { employeeDetailDemo } from '../employee-detail-demo'

export function EmployeeProfile({ member, detailed }: { member: TeamMember; detailed: boolean }) {
  const { t, i18n } = useTranslation()
  const demo = employeeDetailDemo
  const missing = t('employeeDetail.missing')
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium', timeZone: 'UTC' })
  const details = [
    { key: 'manager', value: detailed ? demo.manager : missing, icon: UserRound },
    { key: 'team', value: member.team, icon: UsersRound },
    { key: 'department', value: member.department, icon: Building2 },
    { key: 'costCenter', value: `${member.costCenter} · ${member.costCenterName}`, icon: BriefcaseBusiness },
    { key: 'location', value: detailed ? demo.location : missing, icon: MapPin },
    { key: 'employment', value: detailed ? t('employeeDetail.fullTime') : missing, icon: CalendarDays }
  ] as const
  return (
    <section aria-label={member.name} className='rounded-xl border border-neutral-200 bg-white p-6'>
      <div className='flex flex-col items-start gap-6 md:flex-row md:items-center'>
        <MemberAvatar key={member.id} member={detailed ? { ...member, avatar: demo.avatar } : member} large />
        <div className='grid min-w-0 flex-1 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
          <div>
            <div className='mb-1 flex flex-wrap items-center gap-3'>
              <h2 className='text-xl font-bold'>{member.name}</h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${member.status === 'active' ? 'bg-success-bg text-success' : 'bg-neutral-200/50 text-neutral-500'}`}
              >
                {t(`managerTeam.${member.status}`)}
              </span>
            </div>
            <p className='mb-3 text-sm'>
              {detailed ? `${demo.jobTitle} · ` : ''}
              {member.department}
            </p>
            <div className='space-y-2 text-sm text-neutral-500'>
              <p className='flex items-center gap-2 break-all'>
                <Mail size={16} className='shrink-0' aria-hidden='true' />
                {member.email}
              </p>
              <p className='flex items-center gap-2'>
                <Phone size={16} aria-hidden='true' />
                {detailed ? demo.phone : missing}
              </p>
            </div>
            <div className='mt-3 space-y-1 text-xs text-neutral-500'>
              <p>
                {t('employeeDetail.employeeId')}: {detailed ? demo.employeeCode : missing}
              </p>
              <p>
                {t('employeeDetail.joined')}: {detailed ? date.format(new Date(`${demo.joined}T00:00:00Z`)) : missing}
              </p>
            </div>
          </div>
          <dl className='space-y-4'>
            {details.slice(0, 3).map(({ key, value, icon: Icon }) => (
              <div key={key} className='flex items-start gap-2 text-sm'>
                <Icon size={16} aria-hidden='true' className='mt-0.5 shrink-0 text-neutral-500/70' />
                <div>
                  <dt className='text-xs text-neutral-500'>
                    {t(key === 'manager' ? 'employeeDetail.manager' : `managerTeam.${key}`)}
                  </dt>
                  <dd className='font-medium'>{value}</dd>
                </div>
              </div>
            ))}
          </dl>
          <dl className='space-y-4'>
            {details.slice(3).map(({ key, value, icon: Icon }) => (
              <div key={key} className='flex items-start gap-2 text-sm'>
                <Icon size={16} aria-hidden='true' className='mt-0.5 shrink-0 text-neutral-500/70' />
                <div>
                  <dt className='text-xs text-neutral-500'>
                    {t(key === 'costCenter' ? 'managerTeam.costCenter' : `employeeDetail.${key}`)}
                  </dt>
                  <dd className='font-medium'>{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
