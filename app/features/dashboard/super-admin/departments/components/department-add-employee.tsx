import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { employeeList, getEmployeeListQueryKey } from '~/shared/api/generated/operations/employees/employee-list'
import { useEmployeeFirstPlacement } from '~/shared/api/generated/operations/employees/employee-first-placement'
import { getDepartmentGetQueryKey } from '~/shared/api/generated/operations/departments/department-get'
import { getDepartmentMemberListQueryKey } from '~/shared/api/generated/operations/departments/department-member-list'
import { AdminField, AdminFormDialog, adminInputClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { usePersonnelMutationFeedback } from '../../shared/hooks/use-personnel-mutation-feedback'

export function DepartmentAddEmployee({
  departmentId,
  departmentEffectiveFrom,
  onClose
}: {
  departmentId: string
  departmentEffectiveFrom: string
  onClose: () => void
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const [employeeId, setEmployeeId] = useState('')
  const [effectiveFrom, setEffectiveFrom] = useState('')
  const query = useQuery({
    queryKey: [...getEmployeeListQueryKey(), 'unplaced-for-department'],
    queryFn: async ({ signal }) => {
      let page = 1
      let totalPages: number
      const items = []
      do {
        const response = await employeeList({ unplaced: 'true', page, pageSize: 100 }, undefined, signal)
        if (!response.data) throw new Error('Employee list is unavailable')
        items.push(...response.data.items)
        totalPages = response.data.pagination.totalPages
        page += 1
      } while (page <= totalPages)
      return items.filter(
        (employee) =>
          employee.unplaced && employee.status === 'ACTIVE' && ['WORKING', 'ON_LONG_LEAVE'].includes(employee.workState)
      )
    }
  })
  const selected = query.data?.find((employee) => employee.id === employeeId)
  const today = useMemo(
    () => new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
    []
  )
  const minDate = [today, departmentEffectiveFrom, selected?.hireDate ?? today].sort().at(-1) ?? today
  const feedback = usePersonnelMutationFeedback(
    [getEmployeeListQueryKey(), getDepartmentGetQueryKey(departmentId), getDepartmentMemberListQueryKey(departmentId)],
    onClose
  )
  const mutation = useEmployeeFirstPlacement({ mutation: { ...feedback, retry: false } })
  return (
    <AdminFormDialog
      page
      title={translate('addEmployee')}
      pending={mutation.isPending}
      onClose={onClose}
      submitLabel={translate('addEmployee')}
      submitDisabled={!selected || !effectiveFrom || effectiveFrom < minDate || query.isFetching || query.isError}
      onSubmit={(event) => {
        event.preventDefault()
        if (selected && effectiveFrom >= minDate && !query.isFetching && !mutation.isPending)
          mutation.mutate({ id: selected.id, data: { departmentId, effectiveFrom } })
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate('addEmployeeHelp')}</p>
      <AdminQueryState query={query}>
        <AdminField label={translate('employeeId')}>
          <select
            required
            className={adminInputClass}
            value={employeeId}
            onChange={(event) => setEmployeeId(event.target.value)}
          >
            <option value=''>{translate('chooseEmployee')}</option>
            {query.data?.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName} · {employee.employeeCode}
              </option>
            ))}
          </select>
        </AdminField>
      </AdminQueryState>
      <AdminField label={translate('effectiveFrom')}>
        <input
          type='date'
          required
          min={minDate}
          className={adminInputClass}
          value={effectiveFrom}
          onChange={(event) => setEffectiveFrom(event.target.value)}
        />
      </AdminField>
    </AdminFormDialog>
  )
}
