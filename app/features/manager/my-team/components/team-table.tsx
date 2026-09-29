import { Ellipsis, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import type { TeamMember } from '~/entities/user/team-member.types'
import { MemberAvatar } from '~/entities/user/member-avatar'

const columns = [
  'employee',
  'department',
  'team',
  'costCenter',
  'activeLicenses',
  'pendingRequests',
  'status',
  'lastActive',
  'actions'
] as const

export function TeamTable({
  members,
  onView,
  onClear
}: {
  members: TeamMember[]
  onView: (member: TeamMember) => void
  onClear: () => void
}) {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const relative = new Intl.RelativeTimeFormat(i18n.resolvedLanguage, { style: 'short' })
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-left text-sm'>
        <caption className='sr-only'>{t('managerTeam.title')}</caption>
        <thead className='border-b border-neutral-200 bg-brand-bg text-xs font-semibold tracking-wider text-neutral-500 uppercase'>
          <tr>
            {columns.map((key) => (
              <th
                key={key}
                scope='col'
                className={`px-6 py-4 whitespace-nowrap ${key === 'activeLicenses' || key === 'pendingRequests' ? 'text-center' : key === 'actions' ? 'text-right' : ''}`}
              >
                {t(`managerTeam.${key}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-neutral-200'>
          {members.map((member) => (
            <tr key={member.id} className='transition-colors hover:bg-brand-bg'>
              <th scope='row' className='px-6 py-4 text-left font-normal whitespace-nowrap'>
                <div className='flex items-center gap-3'>
                  <MemberAvatar member={member} />
                  <div>
                    <p className='font-medium'>{member.name}</p>
                    <p className='text-xs text-neutral-500'>{member.email}</p>
                  </div>
                </div>
              </th>
              <td className='px-6 py-4 whitespace-nowrap text-neutral-500'>{member.department}</td>
              <td className='px-6 py-4 whitespace-nowrap text-neutral-500'>{member.team}</td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <p>{member.costCenter}</p>
                <p className='text-xs text-neutral-500'>{member.costCenterName}</p>
              </td>
              <td className='px-6 py-4 text-center font-medium tabular-nums'>{number.format(member.activeLicenses)}</td>
              <td className='px-6 py-4 text-center tabular-nums'>
                {member.pendingRequests > 0 ? (
                  <span className='inline-flex size-5 items-center justify-center rounded bg-brand-100 text-xs font-medium text-brand-600'>
                    {number.format(member.pendingRequests)}
                  </span>
                ) : (
                  number.format(0)
                )}
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${member.status === 'active' ? 'bg-success-bg text-success' : 'bg-neutral-200/50 text-neutral-500'}`}
                >
                  {t(`managerTeam.${member.status}`)}
                </span>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-neutral-500'>
                {relative.format(member.lastActive.value, member.lastActive.unit)}
              </td>
              <td className='px-6 py-4'>
                <div className='flex items-center justify-end gap-2'>
                  <button
                    type='button'
                    onClick={() => onView(member)}
                    aria-label={t('managerTeam.viewMember', { name: member.name })}
                    className='rounded border border-neutral-200 bg-white p-1.5 text-neutral-500 shadow-xs hover:text-brand-600'
                  >
                    <Eye size={14} aria-hidden='true' />
                  </button>
                  <details className='relative'>
                    <summary
                      aria-label={t('managerTeam.moreActions', { name: member.name })}
                      className='cursor-pointer list-none rounded border border-neutral-200 bg-white p-1.5 text-neutral-500 shadow-xs hover:text-brand-600'
                    >
                      <Ellipsis size={14} aria-hidden='true' />
                    </summary>
                    <div className='absolute right-0 bottom-full z-10 mb-2 w-56 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm'>
                      <button
                        type='button'
                        className='w-full rounded px-2 py-2 text-left text-xs hover:bg-brand-100'
                        onClick={(e) => {
                          onView(member)
                          e.currentTarget.closest('details')?.removeAttribute('open')
                        }}
                      >
                        {t('manager.viewDetails')}
                      </button>
                      <Link
                        to={`/manager/create-request?employee=${member.id}`}
                        className='block w-full rounded px-2 py-2 text-left text-xs text-neutral-500 hover:bg-brand-100'
                      >
                        {t('managerTeam.createRequest')}
                      </Link>
                    </div>
                  </details>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {members.length === 0 && (
        <div className='px-6 py-14 text-center'>
          <h2 className='text-base font-semibold'>{t('managerTeam.emptyTitle')}</h2>
          <p className='mt-1 text-sm text-neutral-500'>{t('managerTeam.emptyDescription')}</p>
          <button
            type='button'
            onClick={onClear}
            className='mt-4 rounded-lg bg-brand-100 px-4 py-2 text-sm font-medium text-brand-600'
          >
            {t('managerTeam.clearFilters')}
          </button>
        </div>
      )}
    </div>
  )
}
