import { Building2, CalendarDays, ClipboardList, Clock, FileText, Folder, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { type AccessAssignment, reviewMember } from '~/entities/license/access-assignments-demo'
import { FigmaMark } from '~/entities/software/figma-mark'
import { MemberAvatar } from '~/entities/user/member-avatar'

export function AssignmentSummary({ assignment }: { assignment: AccessAssignment }) {
  const { t, i18n } = useTranslation()
  const member = reviewMember(assignment)
  const detailed = assignment.id === 'AR-1'
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  })
  const rows = [
    { key: 'assigned', icon: CalendarDays, value: date.format(new Date(`${assignment.assigned}T00:00:00Z`)) },
    { key: 'plan', icon: FileText, value: assignment.plan },
    { key: 'activity', icon: Clock, value: t('accessReview.days', { value: number.format(assignment.days) }) },
    {
      key: 'purpose',
      icon: ClipboardList,
      value: detailed ? t('assignmentDetail.purposeAlpha') : t('assignmentDetail.missing')
    },
    {
      key: 'project',
      icon: Folder,
      value: detailed ? t('assignmentDetail.projectAlpha') : t('assignmentDetail.missing')
    },
    { key: 'costCenter', icon: Building2, value: `${member.costCenter} · ${member.costCenterName}` }
  ] as const
  return (
    <div className='space-y-6'>
      <section aria-label={t('assignmentDetail.employee')} className='flex items-center gap-4'>
        <MemberAvatar key={member.id} member={member} />
        <div>
          <Link to={`/manager/my-team/${member.id}`} className='font-semibold hover:text-brand-600'>
            {member.name}
          </Link>
          <p className='mt-1 text-sm text-neutral-500'>{t(`accessReview.jobs.${assignment.job}`)}</p>
          <p className='text-sm text-neutral-500'>{t('assignmentDetail.team', { name: member.department })}</p>
        </div>
      </section>
      <div className='flex flex-wrap items-center gap-4 border-y border-neutral-200 py-4'>
        <span className='w-32 text-sm font-medium text-neutral-500'>{t('accessReview.columns.software')}</span>
        <div className='flex items-center gap-2'>
          {assignment.software === 'Figma' ? (
            <FigmaMark />
          ) : (
            <span
              aria-hidden='true'
              className='flex size-6 items-center justify-center rounded bg-brand-100 text-xs font-semibold text-brand-600'
            >
              {assignment.software.charAt(0)}
            </span>
          )}
          <span className='text-sm font-medium'>{assignment.software}</span>
          <span className='rounded-full border border-neutral-200 bg-brand-bg px-2 py-0.5 text-xs text-neutral-500'>
            {assignment.plan}
          </span>
        </div>
      </div>
      <dl className='space-y-4'>
        {rows.map((row) => (
          <div key={row.key} className='grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-3'>
            <dt className='flex items-center gap-2 text-sm text-neutral-500'>
              <row.icon size={16} aria-hidden='true' />
              {t(`assignmentDetail.fields.${row.key}`)}
            </dt>
            <dd
              className={`text-sm ${row.key === 'activity' ? (assignment.risk === 'low' ? 'font-medium text-success' : 'font-medium text-brand-600') : 'text-neutral-900'}`}
            >
              {row.value}
            </dd>
          </div>
        ))}
        <div className='grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-3'>
          <dt className='flex items-start gap-2 text-sm text-neutral-500'>
            <TriangleAlert size={16} aria-hidden='true' />
            {t('accessReview.columns.risk')}
          </dt>
          <dd>
            <span
              className={`rounded-md px-2 py-1 text-xs font-medium ${assignment.risk === 'low' ? 'bg-success/10 text-success' : 'bg-brand-100 text-brand-600'}`}
            >
              {t(`accessReview.risks.${assignment.risk}`)}
            </span>
            <p className='mt-2 text-xs text-neutral-500'>
              {detailed ? t('assignmentDetail.lowRiskHint') : t('assignmentDetail.riskSampleHint')}
            </p>
          </dd>
        </div>
      </dl>
    </div>
  )
}
