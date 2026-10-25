import { i18n } from '~/shared/i18n/i18n'

const departmentKeys: Record<string, string> = {
  'Toàn công ty': 'company',
  'Kỹ thuật phần mềm': 'engineering',
  'Thiết kế & Marketing': 'designMarketing',
  'Tài chính Kế toán': 'finance'
}

export function itAdminDepartmentLabel(value: string): string {
  const key = departmentKeys[value]
  return key ? i18n.t(`dashboard:itAdmin.demoDepartments.${key}`, { defaultValue: value }) : value
}
