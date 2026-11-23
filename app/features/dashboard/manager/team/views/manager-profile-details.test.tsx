import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ManagerProfileDetails } from './manager-profile-details'

vi.mock('../../../dashboard-ui', () => ({ useDashboardFormat: () => ({ formatDate: (value: string) => value }) }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
vi.mock('~/shared/api/generated/operations/me/me-get', () => ({
  useMeGet: () => ({
    data: {
      data: {
        employee: { id: 'employee', department: { name: 'Engineering', code: 'ENG' } },
        managerScope: { departmentCode: 'ENG', departmentName: 'Engineering' },
        roles: ['MANAGER']
      }
    }
  })
}))
vi.mock('~/shared/api/generated/operations/employees/employee-get', () => ({
  useEmployeeGet: () => ({ data: undefined, isError: false })
}))

describe('manager profile details', () => {
  it('shows the manager scope and current department', () => {
    render(<ManagerProfileDetails />)
    expect(screen.getByText('ENG · Engineering')).toBeInTheDocument()
    expect(screen.getByText('profile.managerScope')).toBeInTheDocument()
  })
})
