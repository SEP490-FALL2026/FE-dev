import { DecisionBodyDtoDecision } from '~/shared/api/generated/model/budget-versions/decisionBodyDtoDecision'

export const versionDecision = DecisionBodyDtoDecision
export type VersionDecision = (typeof versionDecision)[keyof typeof versionDecision]
