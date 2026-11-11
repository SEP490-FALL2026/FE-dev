import { useTranslation } from 'react-i18next'
import type { MySoftwarePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/me/mySoftwarePageResponseDtoDataItemsItem'
import { SOFTWARE_RIGHT_STATUS } from '../enums/software-right-status'

const statusTone: Record<string, string> = {
  [SOFTWARE_RIGHT_STATUS.ACTIVE]: 'bg-success/10 text-success',
  [SOFTWARE_RIGHT_STATUS.UPCOMING]: 'bg-primary-soft text-primary-ink',
  [SOFTWARE_RIGHT_STATUS.PROVISIONING]: 'bg-primary-soft text-primary-ink',
  [SOFTWARE_RIGHT_STATUS.EXPIRED]: 'bg-warning/10 text-warning',
  [SOFTWARE_RIGHT_STATUS.REVOKING]: 'bg-warning/10 text-warning',
  [SOFTWARE_RIGHT_STATUS.ENDING]: 'bg-warning/10 text-warning',
  [SOFTWARE_RIGHT_STATUS.ENDED]: 'bg-surface-subtle text-muted-foreground'
}

export function EmployeeSoftwareRightStatus({ status }: { status: MySoftwarePageResponseDtoDataItemsItem['status'] }) {
  const { t: translate } = useTranslation('employee')
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${statusTone[status] ?? 'bg-surface-subtle text-muted-foreground'}`}
    >
      <span aria-hidden className='size-1.5 rounded-full bg-current' />
      {Object.values(SOFTWARE_RIGHT_STATUS).some((knownStatus) => knownStatus === status)
        ? translate(`softwareRights.statuses.${status}`)
        : translate('unknownStatus')}
    </span>
  )
}
