import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppUserList } from '~/shared/api/generated/operations/app-users/app-user-list'
import { AdminField, adminInputClass } from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'

export function DepartmentHeadPicker({
  departmentId,
  effectiveFrom,
  errorId
}: {
  departmentId: string
  effectiveFrom: string
  errorId?: string
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<{ id: string; label: string } | null>(null)
  const query = useAppUserList(
    {
      role: 'MANAGER',
      departmentId,
      memberOn: effectiveFrom,
      status: 'ACTIVE',
      activationState: 'ACTIVATED',
      page,
      pageSize: 20
    },
    { query: { enabled: Boolean(effectiveFrom), retry: false } }
  )
  const candidates =
    query.data?.data?.items.filter(
      (account) =>
        account.employee &&
        account.roles.includes('MANAGER') &&
        !account.roles.includes('SPENDING_APPROVER') &&
        !account.roles.includes('SUPER_ADMIN')
    ) ?? []
  return (
    <div className='space-y-3'>
      <AdminField label={translate('editor.chooseHead')}>
        <select
          required
          name='employeeId'
          className={adminInputClass}
          value={selected?.id ?? ''}
          aria-busy={query.isFetching}
          aria-invalid={Boolean(errorId)}
          aria-describedby={errorId}
          onChange={(event) => {
            const employee = candidates.find((account) => account.employee?.id === event.target.value)?.employee
            setSelected(employee ? { id: employee.id, label: `${employee.employeeCode} — ${employee.fullName}` } : null)
          }}
        >
          <option value=''>{translate('editor.chooseHeadPlaceholder')}</option>
          {selected && !candidates.some((account) => account.employee?.id === selected.id) && (
            <option value={selected.id}>{selected.label}</option>
          )}
          {candidates.map(
            (account) =>
              account.employee && (
                <option key={account.id} value={account.employee.id}>
                  {`${account.employee.employeeCode} — ${account.employee.fullName}`}
                </option>
              )
          )}
        </select>
      </AdminField>
      <p className='text-xs text-muted-foreground'>{translate('editor.managerHelp')}</p>
      <AdminQueryState query={query}>
        {!candidates.length && <AdminEmpty />}
        <AdminPagination pagination={query.data?.data?.pagination} onPageChange={setPage} disabled={query.isFetching} />
      </AdminQueryState>
    </div>
  )
}
