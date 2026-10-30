import { GrantRoleBodyDtoRole } from '~/shared/api/generated/model/app-users/grantRoleBodyDtoRole'

export const directRoles = [
  GrantRoleBodyDtoRole.IT_ADMIN,
  GrantRoleBodyDtoRole.FINANCE,
  GrantRoleBodyDtoRole.EMPLOYEE
] as const
export type DirectRole = (typeof directRoles)[number]
