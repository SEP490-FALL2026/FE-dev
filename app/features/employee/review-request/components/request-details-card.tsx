import { FileText, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { RequestDetailsData } from '../review-request.types'

interface RequestDetailsCardProps {
  requestType?: string
  details?: Partial<RequestDetailsData>
}

export function RequestDetailsCard({ requestType = 'new-software', details }: RequestDetailsCardProps) {
  const { t } = useTranslation()

  const getRows = () => {
    if (requestType === 'temporary-renewal') {
      return [
        {
          id: 'businessReason',
          label: t('reviewRequest.details.businessReason'),
          value: details?.businessReason || t('reviewRequest.details.temporaryRenewalReasonValue')
        },
        {
          id: 'project',
          label: t('reviewRequest.details.project'),
          value: details?.project || t('reviewRequest.details.projectValue')
        },
        {
          id: 'costCenter',
          label: t('reviewRequest.details.costCenter'),
          value: details?.costCenter || t('reviewRequest.details.costCenterValue')
        },
        {
          id: 'currentExpiration',
          label: t('reviewRequest.details.currentExpiration'),
          value: t('reviewRequest.details.currentExpirationValue')
        },
        {
          id: 'newExpiration',
          label: t('reviewRequest.details.newExpiration'),
          value: details?.requiredUntil || t('reviewRequest.details.newExpirationValue')
        },
        {
          id: 'additionalNotes',
          label: t('reviewRequest.details.additionalNotes'),
          value: t('reviewRequest.details.temporaryRenewalNotesValue')
        }
      ]
    }

    if (requestType === 'return-license') {
      return [
        {
          id: 'businessReason',
          label: t('reviewRequest.details.businessReason'),
          value: details?.businessReason || t('reviewRequest.details.returnLicenseReasonValue')
        },
        {
          id: 'project',
          label: t('reviewRequest.details.project'),
          value: details?.project || t('reviewRequest.details.projectValue')
        },
        {
          id: 'costCenter',
          label: t('reviewRequest.details.costCenter'),
          value: details?.costCenter || t('reviewRequest.details.costCenterValue')
        },
        {
          id: 'assignedDate',
          label: t('reviewRequest.details.assignedDate'),
          value: t('reviewRequest.details.assignedDateValue')
        },
        {
          id: 'expirationDate',
          label: t('reviewRequest.details.expirationDate'),
          value: t('reviewRequest.details.expirationDateValue')
        },
        {
          id: 'additionalNotes',
          label: t('reviewRequest.details.additionalNotes'),
          value: t('reviewRequest.details.returnLicenseNotesValue')
        }
      ]
    }

    return [
      {
        id: 'businessReason',
        label: t('reviewRequest.details.businessReason'),
        value: details?.businessReason || t('reviewRequest.details.businessReasonValue')
      },
      {
        id: 'project',
        label: t('reviewRequest.details.project'),
        value: details?.project || t('reviewRequest.details.projectValue')
      },
      {
        id: 'costCenter',
        label: t('reviewRequest.details.costCenter'),
        value: details?.costCenter || t('reviewRequest.details.costCenterValue')
      },
      {
        id: 'requiredFrom',
        label: t('reviewRequest.details.requiredFrom'),
        value: details?.requiredFrom || t('reviewRequest.details.requiredFromValue')
      },
      {
        id: 'requiredUntil',
        label: t('reviewRequest.details.requiredUntil'),
        value: details?.requiredUntil || t('reviewRequest.details.requiredUntilValue')
      }
    ]
  }

  const rows = getRows()

  return (
    <div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <div className='mb-6 flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-500'>
          <FileText className='h-5 w-5' />
        </div>
        <h2 className='text-lg font-semibold text-neutral-900'>{t('reviewRequest.details.title')}</h2>
      </div>

      <div className='mb-6 space-y-5 text-sm'>
        {rows.map((row) => (
          <div className='grid grid-cols-4 gap-4' key={row.id}>
            <div className='col-span-1 text-neutral-500'>{row.label}</div>
            <div className='col-span-3 font-medium leading-relaxed text-neutral-900'>{row.value}</div>
          </div>
        ))}
      </div>

      {/* Info Alert */}
      <div className='flex gap-3 rounded-lg border border-brand-200 bg-brand-50 p-4'>
        <Info className='mt-0.5 h-5 w-5 shrink-0 text-brand-500' />
        <div>
          <h4 className='text-sm font-semibold text-brand-600'>{t('reviewRequest.details.alertTitle')}</h4>
          <p className='mt-1 text-sm text-neutral-600'>{t('reviewRequest.details.alertDescription')}</p>
        </div>
      </div>
    </div>
  )
}
