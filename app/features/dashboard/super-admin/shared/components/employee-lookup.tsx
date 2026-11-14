import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { employeeList, getEmployeeListQueryKey } from '~/shared/api/generated/operations/employees/employee-list'
import { appUserList, getAppUserListQueryKey } from '~/shared/api/generated/operations/app-users/app-user-list'
import { AdminQueryState } from './admin-query-state'
import { adminInputClass } from './admin-form'

export function EmployeeLookup({
  name,
  required,
  initial = '',
  initialLabel = '',
  purpose = 'personnel',
  invalid = false,
  descriptionId
}: {
  name: string
  required: boolean
  initial?: string
  initialLabel?: string
  purpose?: 'personnel' | 'leadership' | 'itAdmin'
  invalid?: boolean
  descriptionId?: string
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const [selected, setSelected] = useState(initial)
  const query = useQuery({
    queryKey: [
      ...(purpose === 'personnel' ? getEmployeeListQueryKey() : getAppUserListQueryKey()),
      'employee-select',
      purpose
    ],
    queryFn: async ({ signal }) => {
      const items: { id: string; employeeCode: string; fullName: string }[] = []
      let page = 1
      let totalPages: number
      do {
        if (purpose === 'personnel') {
          const response = await employeeList({ page, pageSize: 100 }, undefined, signal)
          if (!response.data) throw new Error('Employee list unavailable')
          items.push(...response.data.items)
          totalPages = response.data.pagination.totalPages
        } else {
          const response = await appUserList(
            {
              page,
              pageSize: 100,
              status: 'ACTIVE',
              activationState: 'ACTIVATED',
              role: purpose === 'itAdmin' ? 'IT_ADMIN' : 'MANAGER'
            },
            undefined,
            signal
          )
          if (!response.data) throw new Error('Account list unavailable')
          items.push(
            ...response.data.items.flatMap((account) =>
              account.employee &&
              !account.roles.includes('SUPER_ADMIN') &&
              (purpose !== 'leadership' ||
                (account.roles.includes('MANAGER') && !account.roles.includes('SPENDING_APPROVER'))) &&
              (purpose !== 'itAdmin' || account.roles.includes('IT_ADMIN'))
                ? [account.employee]
                : []
            )
          )
          totalPages = response.data.pagination.totalPages
        }
        page += 1
      } while (page <= totalPages)
      return items
    }
  })
  const items = query.data ?? []
  return (
    <div className='grid gap-2'>
      <select
        aria-label={translate(name === 'successorEmployeeId' ? 'fields.successorEmployeeId' : 'fields.employeeId')}
        name={name}
        aria-invalid={invalid || undefined}
        aria-describedby={descriptionId}
        aria-busy={query.isFetching}
        required={required}
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        className={adminInputClass}
      >
        <option value=''>{translate(required ? 'choose' : 'noSelection')}</option>
        {initial && selected === initial && !items.some((item) => item.id === initial) && (
          <option value={initial}>{initialLabel || translate('currentSelection')}</option>
        )}
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {translate('employeeOption', { code: item.employeeCode, name: item.fullName })}
          </option>
        ))}
      </select>
      {(query.isPending || query.isError) && <AdminQueryState query={query}>{null}</AdminQueryState>}
    </div>
  )
}
