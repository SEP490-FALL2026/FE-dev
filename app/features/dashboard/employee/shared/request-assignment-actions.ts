import { PROVISIONING_TYPE } from '~/entities/request/enums/provisioning-type'
import { MySoftwarePageResponseDtoDataItemsItemStatus as STATUS } from '~/shared/api/generated/model/me/mySoftwarePageResponseDtoDataItemsItemStatus'
import type { MySoftwarePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/me/mySoftwarePageResponseDtoDataItemsItem'

/** Navigation eligibility only; pending requests and final eligibility are checked by the server. */
export function canSelectRequestAssignment(item: MySoftwarePageResponseDtoDataItemsItem, mode: string) {
  const held = item.status === STATUS.ACTIVE || item.status === STATUS.EXPIRED
  return (
    held &&
    (mode === 'return' ||
      (mode === 'renewal' &&
        item.provisioningType !== PROVISIONING_TYPE.K4 &&
        !!item.expectedEndDate &&
        !item.successorAssignmentId))
  )
}
