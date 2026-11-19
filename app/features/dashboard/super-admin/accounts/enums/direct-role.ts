import { ChangeRoleBodyDtoRole } from '~/shared/api/generated/model/app-users/changeRoleBodyDtoRole'

export const directRoles = [
  ChangeRoleBodyDtoRole.IT_ADMIN,
  ChangeRoleBodyDtoRole.FINANCE,
  ChangeRoleBodyDtoRole.EMPLOYEE,
  ChangeRoleBodyDtoRole.MANAGER,
  ChangeRoleBodyDtoRole.SPENDING_APPROVER
] as const
export type DirectRole = (typeof directRoles)[number]
