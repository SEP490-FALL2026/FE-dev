import { ArrowLeft, ChevronRight, EllipsisVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'

import { teamMembers } from '~/entities/user/team-members-demo'
import { useDocumentTitle } from '~/shared/lib/use-document-title'

import { EmployeeContentPanel } from './components/employee-content-panel'
import { EmployeeMetrics } from './components/employee-metrics'
import { EmployeeProfile } from './components/employee-profile'
import { EmployeeSidebar } from './components/employee-sidebar'
import { EmployeeTabs } from './components/employee-tabs'
import { detailTabs, employeeDetailDemo, type DetailTab } from './employee-detail-demo'

export function EmployeeDetailPage({ employeeId }: { employeeId: string }) {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const member = teamMembers.find((item) => item.id === employeeId)
  useDocumentTitle(t('employeeDetail.documentTitle', { name: member?.name ?? t('employeeDetail.notFound') }))
  const selected = detailTabs.find((tab) => tab === params.get('tab')) ?? 'assigned'
  const setTab = (tab: DetailTab) => {
    const next = new URLSearchParams(params)
    next.set('tab', tab)
    setParams(next)
  }
  const backParams = new URLSearchParams(params)
  backParams.delete('tab')
  const back = `/manager/my-team${backParams.size ? `?${backParams}` : ''}`
  const backLink = (
    <Link to={back} className='inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:underline'>
      <ArrowLeft size={16} aria-hidden='true' />
      {t('employeeDetail.back')}
    </Link>
  )
  if (!member)
    return (
      <section className='rounded-xl border border-neutral-200 bg-white p-8'>
        <h1 className='text-2xl font-bold'>{t('employeeDetail.notFound')}</h1>
        <p className='my-4 text-sm text-neutral-500'>{t('employeeDetail.notFoundDescription')}</p>
        {backLink}
      </section>
    )
  const detailed = member.id === employeeDetailDemo.employeeId
  return (
    <>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
        <div>
          <nav
            aria-label={t('managerTeam.breadcrumb')}
            className='mb-2 flex flex-wrap items-center gap-2 text-sm text-neutral-500'
          >
            <Link to='/manager/dashboard' className='hover:text-brand-600'>
              {t('manager.dashboard')}
            </Link>
            <ChevronRight size={12} aria-hidden='true' />
            <Link to={back} className='hover:text-brand-600'>
              {t('manager.team')}
            </Link>
            <ChevronRight size={12} aria-hidden='true' />
            <span aria-current='page' className='font-medium text-neutral-900'>
              {t('employeeDetail.title')}
            </span>
          </nav>
          <h1 className='text-2xl font-bold'>{t('employeeDetail.title')}</h1>
          <p className='mt-1 text-sm text-neutral-500'>{t('employeeDetail.subtitle')}</p>
        </div>
        <details className='relative self-start sm:self-auto'>
          <summary className='flex cursor-pointer list-none items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-xs'>
            {t('employeeDetail.actions')}
            <EllipsisVertical size={16} aria-hidden='true' />
          </summary>
          <div className='absolute left-0 z-10 mt-2 w-64 space-y-2 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm sm:right-0 sm:left-auto'>
            {backLink}
            <Link
              to={`/manager/create-request?employee=${member.id}`}
              className='block text-left text-xs text-brand-600 hover:underline'
            >
              {t('employeeDetail.createRequest')}
            </Link>
            <button
              type='button'
              disabled
              title={t('employeeDetail.workflowUnavailable')}
              className='block text-left text-xs text-neutral-500 disabled:cursor-not-allowed'
            >
              {t('employeeDetail.startReview')}
            </button>
          </div>
        </details>
      </div>
      <EmployeeProfile member={member} detailed={detailed} />
      <EmployeeMetrics member={member} detailed={detailed} />
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        <div className='min-w-0 space-y-6 xl:col-span-2'>
          <EmployeeTabs selected={selected} onChange={setTab} />
          <EmployeeContentPanel key={member.id} selected={selected} detailed={detailed} onTab={setTab} />
        </div>
        <EmployeeSidebar detailed={detailed} pending={member.pendingRequests} onTab={setTab} employeeId={member.id} />
      </div>
      <p className='text-xs text-neutral-500'>{t('employeeDetail.demo')}</p>
    </>
  )
}
