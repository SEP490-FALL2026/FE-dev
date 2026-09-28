import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import { SubmissionTimelineSidebar } from './components/submission-timeline-sidebar'
import { SuccessHeroPanel } from './components/success-hero-panel'
import { SuccessSummaryPanel } from './components/success-summary-panel'

export function SubmissionSuccessPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const requestType = searchParams.get('type') || 'new-software'
  const requestId = searchParams.get('id') || 'REQ-1027'

  const getPreviousRoute = () => {
    if (requestType === 'temporary-renewal') return '/employee/create-request/temporary-renewal'
    if (requestType === 'return-license') return '/employee/create-request/return-license'
    return '/employee/create-request/new-software'
  }

  const getPreviousLabel = () => {
    if (requestType === 'temporary-renewal') return t('submissionSuccess.breadcrumbs.temporaryRenewal')
    if (requestType === 'return-license') return t('submissionSuccess.breadcrumbs.returnLicense')
    return t('submissionSuccess.breadcrumbs.newSoftware')
  }

  return (
    <div className='mx-auto max-w-6xl pb-10'>
      {/* Breadcrumbs */}
      <nav
        aria-label={t('submissionSuccess.breadcrumbs.submissionSuccess')}
        className='mb-6 flex items-center gap-2 text-sm text-neutral-500'
      >
        <Link className='transition-colors hover:text-neutral-900' to='/employee/dashboard'>
          {t('submissionSuccess.breadcrumbs.dashboard')}
        </Link>
        <ChevronRight className='h-3.5 w-3.5' />
        <Link className='transition-colors hover:text-neutral-900' to='/employee/create-request'>
          {t('submissionSuccess.breadcrumbs.createRequest')}
        </Link>
        <ChevronRight className='h-3.5 w-3.5' />
        <Link className='transition-colors hover:text-neutral-900' to={getPreviousRoute()}>
          {getPreviousLabel()}
        </Link>
        <ChevronRight className='h-3.5 w-3.5' />
        <span className='font-semibold text-neutral-900'>{t('submissionSuccess.breadcrumbs.submissionSuccess')}</span>
      </nav>

      {/* Main Layout: Left Main Success Panel, Right Timeline Sidebar */}
      <div className='flex flex-col items-start gap-6 lg:flex-row'>
        {/* Left: Main Success Panel */}
        <div className='flex-1 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs'>
          <SuccessHeroPanel requestId={requestId} />
          <SuccessSummaryPanel requestId={requestId} requestType={requestType} />
        </div>

        {/* Right: Timeline Sidebar */}
        <SubmissionTimelineSidebar />
      </div>
    </div>
  )
}
