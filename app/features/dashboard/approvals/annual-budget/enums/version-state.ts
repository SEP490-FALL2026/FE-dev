import { VersionResponseDtoDataVersionState } from '~/shared/api/generated/model/budget-versions/versionResponseDtoDataVersionState'

export const versionState = VersionResponseDtoDataVersionState
export type VersionState = (typeof versionState)[keyof typeof versionState]
