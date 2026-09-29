import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useSearchParams } from 'react-router'
import { accessAssignments } from '~/entities/license/access-assignments-demo'
import { useDocumentTitle } from '~/shared/lib/use-document-title'
import { AssignmentDecision } from './components/assignment-decision'
import { AssignmentSummary } from './components/assignment-summary'

export function AssignmentDetailPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [params] = useSearchParams()
  const assignment = accessAssignments.find((row) => row.id === id)
  const back = `/manager/access-review${params.size ? `?${params}` : ''}`
  useDocumentTitle(t('assignmentDetail.documentTitle'))
  const backLink = (
    <Link to={back} className='inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:underline'>
      <ArrowLeft size={16} aria-hidden='true' />
      {t('assignmentDetail.back')}
    </Link>
  )
  if (!assignment)
    return (
      <div className='space-y-4 rounded-xl border border-neutral-200 bg-white p-8'>
        <h1 className='text-xl font-semibold'>{t('assignmentDetail.notFound')}</h1>
        <p className='text-sm text-neutral-500'>{t('assignmentDetail.notFoundHint')}</p>
        {backLink}
      </div>
    )
  const year = new Intl.NumberFormat(i18n.resolvedLanguage, { useGrouping: false }).format(2026)
  return (
    <div className='space-y-5 text-neutral-900'>
      {backLink}
      <nav
        aria-label={t('managerTeam.breadcrumb')}
        className='flex flex-wrap items-center gap-2 text-sm text-neutral-500'
      >
        <Link to={back} className='hover:text-brand-600'>
          {t('manager.licenseReview')}
        </Link>
        <ChevronRight size={14} aria-hidden='true' />
        <Link to={back} className='hover:text-brand-600'>
          {t('assignmentDetail.cycle', { quarter: new Intl.NumberFormat(i18n.resolvedLanguage).format(2), year })}
        </Link>
        <ChevronRight size={14} aria-hidden='true' />
        <span aria-current='page' className='font-medium text-neutral-900'>
          {t('assignmentDetail.title')}
        </span>
      </nav>
      <p className='max-w-3xl text-xs leading-relaxed text-neutral-500'>
        {t(assignment.id === 'AR-1' ? 'assignmentDetail.sample' : 'assignmentDetail.partial')}
      </p>
      <article className='w-full max-w-3xl overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm'>
        <div className='border-b border-neutral-200 px-6 py-4'>
          <h1 className='text-lg font-semibold'>{t('assignmentDetail.title')}</h1>
        </div>
        <div className='space-y-6 px-4 py-5 sm:px-6'>
          <AssignmentSummary assignment={assignment} />
          <AssignmentDecision key={assignment.id} />
        </div>
      </article>
    </div>
  )
}
