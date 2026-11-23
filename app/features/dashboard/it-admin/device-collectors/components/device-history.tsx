import { Activity, Laptop, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import type { DeviceDetailResponseDtoData } from '~/shared/api/generated/model/devices'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

export function DeviceHistory({ device }: { device: NonNullable<DeviceDetailResponseDtoData> }) {
  const { t: translate } = useTranslation('itDevices')
  const { formatDate, formatDateTime } = useWorkspaceFormat()
  const row = (key: ParseKeys<'itDevices'>, value: string | null | undefined) => (
    <div key={key} className='space-y-1'>
      <dt className='text-sm text-muted-foreground'>{translate(key)}</dt>
      <dd className='break-words text-sm font-medium text-foreground'>{value || translate('noData')}</dd>
    </div>
  )
  const panel = 'space-y-4 rounded-lg border border-border bg-surface p-5'
  const heading = 'flex items-center gap-2 text-base font-semibold'
  return (
    <div className='grid items-start gap-4 lg:grid-cols-2'>
      <section aria-labelledby='device-information-title' className={panel}>
        <h3 id='device-information-title' className={heading}>
          <Laptop aria-hidden className='size-4 text-primary' />
          {translate('deviceInformation')}
        </h3>
        <dl className='grid gap-5 sm:grid-cols-2'>
          {row('assetCode', device.assetCode)}
          {row('hostname', device.hostname)}
          {row('os', device.os)}
          {device.retiredAt && row('retire', formatDate(device.retiredAt))}
          {device.retirementReason && row('retirementReason', device.retirementReason)}
        </dl>
      </section>
      <section aria-labelledby='device-holder-title' className={panel}>
        <h3 id='device-holder-title' className={heading}>
          <UserRound aria-hidden className='size-4 text-primary' />
          {translate('holderAndHandover')}
        </h3>
        <dl className='grid gap-5 sm:grid-cols-2'>
          {row(
            'holderEmployeeId',
            device.holder ? `${device.holder.fullName} (${device.holder.employeeCode})` : translate('noHolder')
          )}
          {row('registeredFrom', device.registeredFrom && formatDate(device.registeredFrom))}
          {device.lastEnd && row('lastEnd', device.lastEnd.holder.fullName)}
          {device.lastEnd && row('endedAt', formatDate(device.lastEnd.endedAt))}
          {device.lastEnd &&
            row('endCause', translate(`values.${device.lastEnd.endCause}`, { defaultValue: translate('unknown') }))}
        </dl>
      </section>
      <section aria-labelledby='device-collection-title' className={`${panel} lg:col-span-2`}>
        <h3 id='device-collection-title' className={heading}>
          <Activity aria-hidden className='size-4 text-primary' />
          {translate('collectionActivity')}
        </h3>
        <dl className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
          <div className='space-y-1'>
            <dt className='text-sm text-muted-foreground'>{translate('state')}</dt>
            <dd>
              <span className='inline-flex rounded-md bg-primary-soft px-2.5 py-1 text-sm font-medium text-primary-ink'>
                {translate(`values.${device.state}`, { defaultValue: translate('unknown') })}
              </span>
            </dd>
          </div>
          {row(
            'lastAcceptedAt',
            device.collection?.lastAcceptedAt
              ? formatDateTime(device.collection.lastAcceptedAt)
              : translate('noCollection')
          )}
          {row('acknowledgedFrom', device.acknowledgedFrom && formatDate(device.acknowledgedFrom))}
          {device.latestAcknowledgement &&
            row('latestAcknowledgement', String(device.latestAcknowledgement.noticeVersionNumber))}
          {device.latestAcknowledgement &&
            row('acknowledgedAt', formatDate(device.latestAcknowledgement.acknowledgedAt))}
        </dl>
        <p className='text-sm text-muted-foreground'>{translate('hints.collectionState')}</p>
      </section>
    </div>
  )
}
