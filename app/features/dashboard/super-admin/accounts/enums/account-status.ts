import { AccountDetailResponseDtoDataStatus } from '~/shared/api/generated/model/app-users/accountDetailResponseDtoDataStatus'
import { activationStates } from './activation-state'

export const accountStatuses = Object.values(AccountDetailResponseDtoDataStatus)
export function hasKnownAccountState(status: string, activation: string) {
  return accountStatuses.some((value) => value === status) && activationStates.some((value) => value === activation)
}
