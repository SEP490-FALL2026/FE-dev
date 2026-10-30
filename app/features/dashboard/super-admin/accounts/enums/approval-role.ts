import { ApprovalRolesResponseDtoDataItemsItemRole } from '~/shared/api/generated/model/approval-roles/approvalRolesResponseDtoDataItemsItemRole'

export const approvalRoles = Object.values(ApprovalRolesResponseDtoDataItemsItemRole)
export type ApprovalRole = (typeof approvalRoles)[number]
