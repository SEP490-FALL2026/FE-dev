import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import { MemberAvatar } from '~/entities/user/member-avatar'
import { reviewMember, type AccessAssignment } from '~/entities/license/access-assignments-demo'

export function AccessReviewTable({
  rows,
  selected,
  onSelect,
  onSelectPage
}: {
  rows: readonly AccessAssignment[]
  selected: string[]
  onSelect: (id: string) => void
  onSelectPage: () => void
}) {
  const { t, i18n } = useTranslation()
  const [params] = useSearchParams()
  const query = params.size ? `?${params}` : ''
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  })
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const columns = ['employee', 'software', 'plan', 'assigned', 'activity', 'risk', 'status', 'actions'] as const
  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[1050px] text-left text-sm'>
        <caption className='sr-only'>{t('accessReview.assignments')}</caption>
        <thead className='border-y border-neutral-200 bg-brand-bg text-xs text-neutral-500'>
          <tr>
            <th className='p-4'>
              <input
                type='checkbox'
                disabled={!rows.length}
                aria-label={t('accessReview.selectPage')}
                checked={rows.length > 0 && rows.every((row) => selected.includes(row.id))}
                ref={(input) => {
                  if (input)
                    input.indeterminate =
                      rows.some((row) => selected.includes(row.id)) && !rows.every((row) => selected.includes(row.id))
                }}
                onChange={onSelectPage}
                className='size-4 accent-brand-500'
              />
            </th>
            {columns.map((column) => (
              <th key={column} scope='col' className='px-4 py-4 font-semibold'>
                {t(`accessReview.columns.${column}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-neutral-200'>
          {rows.map((row) => {
            const member = reviewMember(row)
            return (
              <tr key={row.id} className={selected.includes(row.id) ? 'bg-brand-100/40' : 'hover:bg-brand-bg'}>
                <td className='p-4'>
                  <input
                    type='checkbox'
                    aria-label={t('accessReview.selectRow', { name: member.name, software: row.software })}
                    checked={selected.includes(row.id)}
                    onChange={() => onSelect(row.id)}
                    className='size-4 accent-brand-500'
                  />
                </td>
                <td className='px-4 py-5'>
                  <div className='flex items-center gap-3'>
                    <MemberAvatar key={member.id} member={member} />
                    <div>
                      <Link to={`/manager/my-team/${member.id}`} className='font-medium hover:text-brand-600'>
                        {member.name}
                      </Link>
                      <p className='mt-1 text-xs text-neutral-500'>{t(`accessReview.jobs.${row.job}`)}</p>
                    </div>
                  </div>
                </td>
                <td className='px-4 py-5'>
                  <div className='flex items-center gap-2'>
                    <span
                      aria-hidden='true'
                      className='flex size-7 items-center justify-center rounded-md border border-neutral-200 bg-brand-bg font-semibold text-brand-600'
                    >
                      {row.software.charAt(0)}
                    </span>
                    <div className='font-medium'>
                      {row.software}
                      <p className='mt-1 text-xs font-normal text-neutral-500'>{row.plan}</p>
                    </div>
                  </div>
                </td>
                <td className='px-4 py-5 text-neutral-500'>{row.plan}</td>
                <td className='px-4 py-5 whitespace-nowrap text-neutral-500'>
                  {date.format(new Date(`${row.assigned}T00:00:00Z`))}
                </td>
                <td
                  className={`px-4 py-5 whitespace-nowrap ${row.risk === 'medium' ? 'text-brand-600' : 'text-success'}`}
                >
                  {t('accessReview.days', { value: number.format(row.days) })}
                </td>
                <td className='px-4 py-5'>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${row.risk === 'medium' ? 'bg-brand-100 text-brand-600' : 'bg-success/10 text-success'}`}
                  >
                    {t(`accessReview.risks.${row.risk}`)}
                  </span>
                </td>
                <td className='px-4 py-5'>
                  <span className='rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-600'>
                    {t(`accessReview.statuses.${row.status}`)}
                  </span>
                </td>
                <td className='px-4 py-5'>
                  <Link
                    to={`/manager/access-review/${row.id}${query}`}
                    aria-label={t('accessReview.viewRow', { name: member.name, software: row.software })}
                    className='rounded-lg p-2 text-neutral-500 hover:bg-brand-100 hover:text-brand-600'
                  >
                    <Eye size={18} aria-hidden='true' />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
