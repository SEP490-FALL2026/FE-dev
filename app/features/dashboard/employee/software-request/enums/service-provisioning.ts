import { RequestablePlanResponseDtoDataProvisioningType as PROVISIONING_TYPE } from '~/shared/api/generated/model/requestable-software/requestablePlanResponseDtoDataProvisioningType'

export function supportsServiceAccount(type: string) {
  return [PROVISIONING_TYPE.K1, PROVISIONING_TYPE.K2, PROVISIONING_TYPE.K3, PROVISIONING_TYPE.K5].some(
    (value) => value === type
  )
}
