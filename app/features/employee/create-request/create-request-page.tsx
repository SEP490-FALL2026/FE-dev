import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { ApprovalNoticeBanner } from './components/approval-notice-banner'
import { RequestTypeCard } from './components/request-type-card'
import type { RequestTypeCardItem } from './create-request.types'

const requestTypeOptions: RequestTypeCardItem[] = [
  {
    id: 'new-software',
    titleKey: 'createRequest.types.newSoftware.title',
    descriptionKey: 'createRequest.types.newSoftware.description',
    calloutKey: 'createRequest.types.newSoftware.callout',
    iconType: 'plus',
    themeColor: 'blue',
    targetPath: '/employee/create-request/new-software'
  },
  {
    id: 'change-plan',
    titleKey: 'createRequest.types.changePlan.title',
    descriptionKey: 'createRequest.types.changePlan.description',
    calloutKey: 'createRequest.types.changePlan.callout',
    iconType: 'arrows-swap',
    themeColor: 'emerald',
    targetPath: '/employee/create-request'
  },
  {
    id: 'temporary-renewal',
    titleKey: 'createRequest.types.temporaryRenewal.title',
    descriptionKey: 'createRequest.types.temporaryRenewal.description',
    calloutKey: 'createRequest.types.temporaryRenewal.callout',
    iconType: 'clock',
    themeColor: 'purple',
    targetPath: '/employee/create-request/temporary-renewal'
  },
  {
    id: 'return-license',
    titleKey: 'createRequest.types.returnLicense.title',
    descriptionKey: 'createRequest.types.returnLicense.description',
    calloutKey: 'createRequest.types.returnLicense.callout',
    iconType: 'rotate-ccw',
    themeColor: 'orange',
    targetPath: '/employee/create-request/return-license'
  }
]

export function CreateRequestPage() {
  const { t } = useTranslation()

  return (
    <div className='mx-auto max-w-5xl space-y-8'>
      {/* Breadcrumbs */}
      <nav
        aria-label={t('createRequest.breadcrumbs.ariaLabel')}
        className='flex items-center gap-2 text-sm text-neutral-500'
      >
        <Link
          className='font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline'
          to='/employee/dashboard'
        >
          {t('createRequest.breadcrumbs.home')}
        </Link>
        <ChevronRight className='h-4 w-4 text-neutral-400' />
        <span className='text-neutral-700'>{t('createRequest.breadcrumbs.current')}</span>
      </nav>

      {/* Page Heading */}
      <div>
        <h1 className='mb-2 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl'>
          {t('createRequest.header.title')}
        </h1>
        <p className='text-base text-neutral-600 md:text-lg'>{t('createRequest.header.subtitle')}</p>
      </div>

      {/* 2x2 Grid of Request Types */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {requestTypeOptions.map((item) => (
          <RequestTypeCard item={item} key={item.id} />
        ))}
      </div>

      {/* Bottom Approval Banner */}
      <ApprovalNoticeBanner />
    </div>
  )
}
