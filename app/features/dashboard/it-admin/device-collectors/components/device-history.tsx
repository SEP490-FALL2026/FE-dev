import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import type { DeviceDetailResponseDtoData } from '~/shared/api/generated/model/devices'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

export function DeviceHistory({ device }: { device: NonNullable<DeviceDetailResponseDtoData> }) {
  const { t: translate } = useTranslation('itDevices')
  const { formatDate } = useWorkspaceFormat()
  const row = (key: ParseKeys<'itDevices'>, value: string | null | undefined) => (
    <div key={key} className='grid gap-1 border-b border-border/40 py-3 sm:grid-cols-2'>
      <dt className='text-sm text-muted-foreground'>{translate(key)}</dt>
      <dd className='break-words text-sm'>{value || translate('noData')}</dd>
    </div>
  )
  return (
    <dl>
      {row('assetCode', device.assetCode)}
      {row('hostname', device.hostname)}
      {row('os', device.os)}
      {row('holderEmployeeId', device.holder ? `${device.holder.fullName} (${device.holder.employeeCode})` : null)}
      {row('state', translate(`values.${device.state}`, { defaultValue: translate('unknown') }))}
      {row('registeredFrom', device.registeredFrom && formatDate(device.registeredFrom))}
      {row('acknowledgedFrom', device.acknowledgedFrom && formatDate(device.acknowledgedFrom))}
      {row('signatureRecorded', translate(device.signatureRecorded ? 'yes' : 'no'))}
      {device.latestSignatureRecord && (
        <>
          {row('latestSignatureRecord', String(device.latestSignatureRecord.noticeVersionNumber))}
          {row('documentId', device.latestSignatureRecord.documentId)}
          {row('recordedAt', formatDate(device.latestSignatureRecord.recordedAt))}
        </>
      )}
      {device.latestAcknowledgement && (
        <>
          {row('latestAcknowledgement', String(device.latestAcknowledgement.noticeVersionNumber))}
          {row('acknowledgedAt', formatDate(device.latestAcknowledgement.acknowledgedAt))}
        </>
      )}
      {device.lastEnd && (
        <>
          {row('lastEnd', device.lastEnd.holder.fullName)}
          {row('endedAt', formatDate(device.lastEnd.endedAt))}
          {row('endCause', translate(`values.${device.lastEnd.endCause}`, { defaultValue: translate('unknown') }))}
        </>
      )}
      {device.retiredAt && row('retire', formatDate(device.retiredAt))}
      {device.retirementReason && row('retirementReason', device.retirementReason)}
    </dl>
  )
}
