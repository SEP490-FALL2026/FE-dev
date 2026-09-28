import { LayoutGrid } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { RequestSummaryData } from '../review-request.types'

interface RequestSummaryCardProps {
  requestType?: string
  summary?: Partial<RequestSummaryData>
}

export function RequestSummaryCard({ requestType = 'new-software', summary }: RequestSummaryCardProps) {
  const { t } = useTranslation()

  const getRequestTypeValue = () => {
    if (summary?.requestType) return summary.requestType
    if (requestType === 'temporary-renewal') return t('reviewRequest.types.temporaryRenewal')
    if (requestType === 'return-license') return t('reviewRequest.types.returnLicense')
    return t('reviewRequest.types.newSoftware')
  }

  const items = [
    {
      id: 'requestType',
      label: t('reviewRequest.summary.requestType'),
      value: getRequestTypeValue()
    },
    {
      id: 'requestedBy',
      label: t('reviewRequest.summary.requestedBy'),
      value: summary?.requestedBy || t('reviewRequest.summary.requestedByValue')
    },
    {
      id: 'software',
      label: t('reviewRequest.summary.software'),
      value: summary?.software || t('reviewRequest.summary.softwareValue')
    },
    {
      id: 'department',
      label: t('reviewRequest.summary.department'),
      value: summary?.department || t('reviewRequest.summary.departmentValue')
    },
    {
      id: 'plan',
      label: t('reviewRequest.summary.plan'),
      value: summary?.plan || t('reviewRequest.summary.planValue')
    },
    {
      id: 'email',
      label: t('reviewRequest.summary.email'),
      value: summary?.email || t('reviewRequest.summary.emailValue')
    },
    {
      id: 'vendor',
      label: t('reviewRequest.summary.vendor'),
      value: summary?.vendor || t('reviewRequest.summary.vendorValue')
    },
    {
      id: 'requestDate',
      label: t('reviewRequest.summary.requestDate'),
      value: summary?.requestDate || t('reviewRequest.summary.requestDateValue')
    }
  ]

  return (
    <div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <div className='mb-6 flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-500'>
          <LayoutGrid className='h-5 w-5' />
        </div>
        <h2 className='text-lg font-semibold text-neutral-900'>{t('reviewRequest.summary.title')}</h2>
      </div>

      <div className='grid grid-cols-2 gap-x-12 gap-y-6 text-sm'>
        {items.map((item) => (
          <div key={item.id}>
            <div className='mb-1 text-neutral-500'>{item.label}</div>
            <div className='font-medium text-neutral-900'>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
