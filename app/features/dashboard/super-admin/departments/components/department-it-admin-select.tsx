import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { appUserList, getAppUserListQueryKey } from '~/shared/api/generated/operations/app-users/app-user-list'
import { AdminField } from '../../shared/components/admin-form'
import { AdminSelect } from '../../shared/components/admin-select'
import { AdminQueryState } from '../../shared/components/admin-query-state'

export function DepartmentItAdminSelect({
  initialId = '',
  initialLabel = '',
  invalid,
  descriptionId,
  onReadyChange
}: {
  initialId?: string
  initialLabel?: string
  invalid?: boolean
  descriptionId?: string
  onReadyChange: (ready: boolean) => void
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const [selected, setSelected] = useState(initialId)
  const query = useQuery({
    queryKey: [...getAppUserListQueryKey(), 'eligible-department-it-admins'],
    retry: false,
    queryFn: async ({ signal }) => {
      const accounts = []
      let page = 1
      let totalPages: number
      do {
        const response = await appUserList(
          { role: 'IT_ADMIN', status: 'ACTIVE', activationState: 'ACTIVATED', page, pageSize: 100 },
          undefined,
          signal
        )
        if (!response.data) throw new Error('IT administrator list is unavailable')
        accounts.push(...response.data.items)
        totalPages = response.data.pagination.totalPages
        page += 1
      } while (page <= totalPages)
      return accounts.filter((account) => account.employee && account.roles.includes('IT_ADMIN'))
    }
  })
  useEffect(
    () => onReadyChange(query.isSuccess && !query.isFetching),
    [onReadyChange, query.isSuccess, query.isFetching]
  )
  const options = (query.data ?? []).flatMap((account) =>
    account.employee
      ? [{ value: account.employee.id, label: account.employee.fullName, description: account.employee.employeeCode }]
      : []
  )
  return (
    <div className='grid gap-2'>
      <AdminField label={translate('itAdminId')}>
        <AdminSelect
          name='itAdminEmployeeId'
          value={selected}
          onChange={setSelected}
          invalid={invalid}
          aria-describedby={descriptionId}
          options={options}
          loading={query.isFetching}
          clearable
          selectedLabel={selected && selected === initialId ? initialLabel : undefined}
          placeholder={translate('ui.pickItAdmin')}
          emptyText={translate('ui.noItAdminMatch')}
        />
      </AdminField>
      {(query.isPending || query.isError) && <AdminQueryState query={query}>{null}</AdminQueryState>}
    </div>
  )
}
