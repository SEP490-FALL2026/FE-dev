import { ArrowLeft, Check, Info, Paperclip, Trash2, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'

import { teamRequests } from '~/entities/request/manager-requests-demo'
import { useDocumentTitle } from '~/shared/lib/use-document-title'

import { ApprovalFlow } from './components/approval-flow'
import { RequestDownload } from './components/request-download'
import { RequestFields } from './components/request-fields'
import { RequestSummary } from './components/request-summary'
import { RequesterInformation } from './components/requester-information'
import { suppliedRequestDetail } from './request-approval-demo'

export function RequestApprovalPage({ requestId }: { requestId: string }) {
  const { t } = useTranslation()
  const { search } = useLocation()
  const request = teamRequests.find((item) => item.id === requestId)
  const fullDetail = request?.id === suppliedRequestDetail.id
  const backTo = `/manager/team-requests${search}`
  useDocumentTitle(t('requestApproval.documentTitle', { id: requestId }))
  const back = (
    <Link
      to={backTo}
      className='inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-brand-bg'
    >
      <ArrowLeft size={16} aria-hidden='true' />
      {t('requestApproval.back')}
    </Link>
  )
  if (!request)
    return (
      <div className='space-y-4'>
        <h1 className='text-2xl font-bold'>{t('requestApproval.missing')}</h1>
        <p className='text-sm text-neutral-500'>{t('requestApproval.missingHint')}</p>
        {back}
      </div>
    )
  return (
    <div className='space-y-8'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>{t('requestApproval.title')}</h1>
          <p className='mt-1 text-sm text-neutral-500'>{t('requestApproval.subtitle')}</p>
        </div>
        <RequestDownload request={request} />
      </div>
      <p className='text-xs leading-relaxed text-neutral-500'>
        {t('requestApproval.sample')}
        {!fullDetail && <span className='ml-1'>{t('requestApproval.partial')}</span>}
      </p>
      <div className='grid items-start gap-8 xl:grid-cols-3'>
        <div className='space-y-6 xl:col-span-2'>
          <RequestSummary request={request} />
          <RequestFields request={request} />
          <section className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
            <h2 className='mb-4 text-base font-bold'>{t('requestApproval.additional')}</h2>
            <p className='flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-500'>
              <Info size={20} aria-hidden='true' className='shrink-0 text-blue-500' />
              {t(fullDetail ? 'requestApproval.noAdditional' : 'requestApproval.unknown')}
            </p>
          </section>
          <section className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
            <h2 className='mb-4 flex items-center gap-2 text-base font-bold'>
              <Paperclip size={16} aria-hidden='true' className='text-neutral-500' />
              {t('requestApproval.attachments')}
            </h2>
            <p className='text-sm text-neutral-500'>
              {t(fullDetail ? 'requestApproval.noAttachments' : 'requestApproval.unknown')}
            </p>
          </section>
          <div className='space-y-4 pt-4'>
            <p className='text-xs leading-relaxed text-neutral-500'>{t('teamRequests.unavailable')}</p>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              {back}
              <div className='flex flex-wrap gap-4'>
                <button
                  type='button'
                  disabled
                  title={t('teamRequests.unavailable')}
                  className='inline-flex items-center gap-2 rounded-lg border border-danger px-5 py-2.5 text-sm font-semibold text-danger disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <Trash2 size={16} aria-hidden='true' />
                  {t('requestApproval.reject')}
                </button>
                <button
                  type='button'
                  disabled
                  title={t('teamRequests.unavailable')}
                  className='inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <Check size={16} aria-hidden='true' />
                  {t('requestApproval.approve')}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='space-y-6'>
          <ApprovalFlow request={request} />
          <RequesterInformation request={request} />
          <aside className='rounded-xl border border-brand-200 bg-brand-50 p-5'>
            <h2 className='mb-3 flex items-center gap-2 text-sm font-bold'>
              <TriangleAlert size={20} aria-hidden='true' className='text-brand-500' />
              {t('requestApproval.notes')}
            </h2>
            <ul className='list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-500 marker:text-brand-500'>
              <li>{t('requestApproval.noteReview')}</li>
              <li>{t('requestApproval.noteReject')}</li>
            </ul>
            {fullDetail && <p className='mt-4 text-xs leading-relaxed'>{t('requestApproval.dateNote')}</p>}
          </aside>
        </div>
      </div>
    </div>
  )
}
