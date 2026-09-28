import { CheckCircle2, MoreVertical, Settings, User, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import type { RequestStatus, RequestStep, RequestType, SoftwareRequestItem } from '../my-requests.types'

interface RequestsTableProps {
  items: SoftwareRequestItem[]
}

function RequestTypeBadge({ type }: { type: RequestType }) {
  const { t } = useTranslation()

  switch (type) {
    case 'newSoftware':
      return (
        <span className='inline-flex rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-status-active'>
          {t('myRequests.types.newSoftware')}
        </span>
      )
    case 'changePlan':
      return (
        <span className='inline-flex rounded-md bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-600'>
          {t('myRequests.types.changePlan')}
        </span>
      )
    case 'renewal':
      return (
        <span className='inline-flex rounded-md border border-brand-200/60 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600'>
          {t('myRequests.types.renewal')}
        </span>
      )
  }
}

function StepIndicator({ step }: { step: RequestStep }) {
  const { t } = useTranslation()

  const renderIcon = () => {
    switch (step.iconType) {
      case 'user':
        return <User className='h-5 w-5 text-brand-500' />
      case 'gear':
        return <Settings className='h-5 w-5 text-amber-500' />
      case 'check':
        return <CheckCircle2 className='h-5 w-5 text-status-active' />
      case 'xmark':
        return step.status === 'rejected' ? (
          <XCircle className='h-5 w-5 text-rose-500' />
        ) : (
          <XCircle className='h-5 w-5 text-neutral-400' />
        )
    }
  }

  return (
    <div className='flex items-center gap-2.5'>
      <div className='flex h-6 w-6 shrink-0 items-center justify-center'>{renderIcon()}</div>
      <div>
        <div className='text-sm font-medium text-neutral-900'>{t(step.nameKey)}</div>
        <div className='text-xs text-neutral-500'>{t(step.descriptionKey)}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const { t } = useTranslation()

  switch (status) {
    case 'pending':
      return (
        <span className='inline-flex rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-600'>
          {t('myRequests.status.pending')}
        </span>
      )
    case 'approved':
      return (
        <span className='inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-status-active'>
          {t('myRequests.status.approved')}
        </span>
      )
    case 'completed':
      return (
        <span className='inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-status-active'>
          {t('myRequests.status.completed')}
        </span>
      )
    case 'rejected':
      return (
        <span className='inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600'>
          {t('myRequests.status.rejected')}
        </span>
      )
    case 'cancelled':
      return (
        <span className='inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600'>
          {t('myRequests.status.cancelled')}
        </span>
      )
  }
}

export function RequestsTable({ items }: RequestsTableProps) {
  const { t } = useTranslation()

  if (items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-xs'>
        <p className='text-base font-semibold text-neutral-900'>{t('myRequests.table.emptyTitle')}</p>
        <p className='mt-1 text-sm text-neutral-500'>{t('myRequests.table.emptyDescription')}</p>
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs'>
      <div className='overflow-x-auto'>
        <table className='w-full text-left text-sm whitespace-nowrap'>
          <thead className='border-b border-neutral-200 bg-neutral-50/70 text-xs font-semibold tracking-wider text-neutral-500 uppercase'>
            <tr>
              <th className='px-6 py-4' scope='col'>
                {t('myRequests.table.requestId')}
              </th>
              <th className='px-6 py-4' scope='col'>
                {t('myRequests.table.software')}
              </th>
              <th className='px-6 py-4' scope='col'>
                {t('myRequests.table.requestType')}
              </th>
              <th className='px-6 py-4' scope='col'>
                {t('myRequests.table.submitted')}
              </th>
              <th className='px-6 py-4' scope='col'>
                {t('myRequests.table.currentStep')}
              </th>
              <th className='px-6 py-4' scope='col'>
                {t('myRequests.table.status')}
              </th>
              <th className='px-6 py-4 text-right' scope='col'>
                {t('myRequests.table.action')}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-neutral-200 bg-white'>
            {items.map((item) => (
              <tr
                className={`transition-colors hover:bg-neutral-50/60 ${
                  item.highlight ? 'border-l-4 border-l-brand-500' : ''
                }`}
                key={item.id}
              >
                {/* Request ID */}
                <td className='px-6 py-5 whitespace-nowrap'>
                  <Link
                    className='font-semibold text-brand-600 hover:text-brand-700 hover:underline'
                    to={`/employee/my-requests/${item.id}`}
                  >
                    {item.id}
                  </Link>
                </td>

                {/* Software */}
                <td className='px-6 py-5 whitespace-nowrap'>
                  <div className='flex items-center gap-3'>
                    <img
                      alt={item.softwareName}
                      className='h-6 w-6 rounded object-contain'
                      src={item.softwareLogoUrl}
                    />
                    <span className='font-medium text-neutral-900'>{item.softwareName}</span>
                  </div>
                </td>

                {/* Request Type */}
                <td className='px-6 py-5 whitespace-nowrap'>
                  <RequestTypeBadge type={item.requestType} />
                </td>

                {/* Submitted */}
                <td className='px-6 py-5 text-sm whitespace-nowrap text-neutral-600'>
                  <div className='font-medium text-neutral-900'>{item.submittedDate}</div>
                  <div className='text-xs text-neutral-500'>{item.submittedTime}</div>
                </td>

                {/* Current Step */}
                <td className='px-6 py-5 whitespace-nowrap'>
                  <StepIndicator step={item.currentStep} />
                </td>

                {/* Status */}
                <td className='px-6 py-5 whitespace-nowrap'>
                  <StatusBadge status={item.status} />
                </td>

                {/* Action */}
                <td className='px-6 py-5 text-right whitespace-nowrap'>
                  <div className='flex items-center justify-end gap-3'>
                    <Link
                      className='rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-900 transition-colors hover:border-brand-200 hover:bg-brand-50'
                      to={`/employee/my-requests/${item.id}`}
                    >
                      {t('myRequests.table.viewDetails')}
                    </Link>
                    <button
                      aria-label={t('myRequests.table.moreOptions')}
                      className='p-1 text-neutral-400 transition-colors hover:text-neutral-700'
                      type='button'
                    >
                      <MoreVertical className='h-4 w-4' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
