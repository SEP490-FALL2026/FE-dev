import { ExternalLink, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import type { DetailTab } from '../employee-detail-demo'
import { EmployeeActivity } from './employee-activity'
import { EmployeeRequest } from './employee-request'

export function EmployeeSidebar({
  detailed,
  pending,
  onTab,
  employeeId
}: {
  detailed: boolean
  pending: number
  onTab: (tab: DetailTab) => void
  employeeId: string
}) {
  const { t } = useTranslation()
  return (
    <aside className='space-y-6'>
      <section className='rounded-xl border border-neutral-200 bg-white shadow-xs'>
        <div className='flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3'>
          <h2 className='text-sm font-semibold'>{t('employeeDetail.pendingTitle', { count: pending })}</h2>
          <button
            type='button'
            onClick={() => onTab('requests')}
            className='text-xs font-medium text-brand-600 hover:underline'
          >
            {t('employeeDetail.viewAll')}
          </button>
        </div>
        <div className='p-4'>
          {detailed ? (
            <EmployeeRequest onView={() => onTab('requests')} />
          ) : (
            <p className='text-xs text-neutral-500'>{t('employeeDetail.noRequests')}</p>
          )}
        </div>
      </section>
      <section className='rounded-xl border border-neutral-200 bg-white shadow-xs'>
        <div className='flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3'>
          <h2 className='text-sm font-semibold'>{t('employeeDetail.recentActivity')}</h2>
          <button
            type='button'
            onClick={() => onTab('history')}
            className='text-xs font-medium text-brand-600 hover:underline'
          >
            {t('employeeDetail.viewAll')}
          </button>
        </div>
        <div className='p-4'>
          {detailed ? (
            <EmployeeActivity />
          ) : (
            <p className='text-xs text-neutral-500'>{t('employeeDetail.missingDescription')}</p>
          )}
        </div>
      </section>
      <section className='rounded-xl border border-neutral-200 bg-white p-4 shadow-xs'>
        <h2 className='mb-3 text-sm font-semibold'>{t('employeeDetail.quickActions')}</h2>
        <div className='space-y-2'>
          <Link
            to={`/manager/create-request?employee=${employeeId}`}
            className='flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-brand-600 shadow-xs hover:bg-brand-100'
          >
            <ExternalLink size={14} aria-hidden='true' />
            {t('employeeDetail.createRequest')}
          </Link>
          {[{ key: 'startReview', icon: RefreshCw }].map(({ key, icon: Icon }) => (
            <button
              key={key}
              type='button'
              disabled
              title={t('employeeDetail.workflowUnavailable')}
              className='flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-brand-600 shadow-xs disabled:cursor-not-allowed'
            >
              <Icon size={14} aria-hidden='true' />
              {t(`employeeDetail.${key}`)}
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}
