import { ProposalResponseDtoDataProposalState } from '~/shared/api/generated/model/budget-proposals/proposalResponseDtoDataProposalState'

export const proposalState = ProposalResponseDtoDataProposalState
export type ProposalState = (typeof proposalState)[keyof typeof proposalState]
