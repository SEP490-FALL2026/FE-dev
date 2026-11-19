import type {
  OnboardingChecklistResponseDtoDataStepsItem,
  OnboardingChecklistResponseDtoDataStepsItemWarningsItem
} from '~/shared/api/generated/model/onboarding'
import { SETUP_STATUS } from './enums/setup-status'

export type SetupStep = OnboardingChecklistResponseDtoDataStepsItem
export type SetupWarning = OnboardingChecklistResponseDtoDataStepsItemWarningsItem
export interface DepartmentIssue {
  code: string
  name: string
  warnings: SetupWarning['code'][]
}

export function groupDepartmentIssues(steps: SetupStep[]): DepartmentIssue[] {
  const departments = new Map<string, DepartmentIssue>()
  for (const warning of steps.flatMap((step) => step.warnings ?? [])) {
    const department = departments.get(warning.departmentCode) ?? {
      code: warning.departmentCode,
      name: warning.departmentName,
      warnings: []
    }
    if (!department.warnings.includes(warning.code)) department.warnings.push(warning.code)
    departments.set(department.code, department)
  }
  return [...departments.values()]
}

export function setupProgress(steps: SetupStep[]) {
  const supported = steps.filter(
    (step) =>
      step.status === SETUP_STATUS.DONE ||
      step.status === SETUP_STATUS.INCOMPLETE ||
      step.status === SETUP_STATUS.BLOCKED
  )
  const complete = supported.filter((step) => step.status === SETUP_STATUS.DONE).length
  return {
    complete,
    total: supported.length,
    percent: supported.length ? Math.round((complete / supported.length) * 100) : null
  }
}

export function organizationFacts(steps: SetupStep[]) {
  const facts = steps.find((step) => step.step === 1)?.facts
  return facts && 'activeDepartments' in facts ? facts : undefined
}
