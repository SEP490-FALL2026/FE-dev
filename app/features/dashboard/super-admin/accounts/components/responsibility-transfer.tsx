import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentList } from '~/shared/api/generated/operations/departments/department-list'
import {
  useDepartmentSoftwareList,
  getDepartmentSoftwareListQueryKey
} from '~/shared/api/generated/operations/department-software-list/department-software-list'
import { useItAdminList } from '~/shared/api/generated/operations/it-admins/it-admin-list'
import { useApplicationResponsibilityTransfer } from '~/shared/api/generated/operations/applications/application-responsibility-transfer'
import { getSuperAdminDashboardGetQueryKey } from '~/shared/api/generated/operations/dashboards/super-admin-dashboard-get'
import { AdminField, AdminFormDialog, adminInputClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'

export function ResponsibilityTransfer({ onClose }: { onClose: () => void }) {
  const { t: translate } = useTranslation('adminAccounts')
  const [departmentId, setDepartmentId] = useState('')
  const [departmentPage, setDepartmentPage] = useState(1)
  const [softwarePage, setSoftwarePage] = useState(1)
  const [adminPage, setAdminPage] = useState(1)
  const [application, setApplication] = useState<{ id: string; name: string } | null>(null)
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null)
  const departments = useDepartmentList({ page: departmentPage, pageSize: 20 })
  const software = useDepartmentSoftwareList(
    departmentId,
    { page: softwarePage, pageSize: 20 },
    { query: { enabled: Boolean(departmentId) } }
  )
  const admins = useItAdminList({ page: adminPage, pageSize: 20 })
  const feedback = useAdminMutationFeedback(
    [getDepartmentSoftwareListQueryKey(departmentId), getSuperAdminDashboardGetQueryKey()],
    onClose
  )
  const mutation = useApplicationResponsibilityTransfer({ mutation: { ...feedback, retry: false } })
  const apps = Array.from(
    new Map(
      (software.data?.data?.items ?? []).map((item) => [
        item.applicationId,
        { id: item.applicationId, name: item.applicationName }
      ])
    ).values()
  )
  return (
    <AdminFormDialog
      page
      title={translate('applicationHandover.title')}
      pending={mutation.isPending}
      onClose={onClose}
      submitLabel={translate('applicationHandover.submit')}
      submitDisabled={
        !application || !target || software.isFetching || admins.isFetching || software.isError || admins.isError
      }
      onSubmit={(event) => {
        event.preventDefault()
        if (!application || !target || mutation.isPending) return
        mutation.mutate({ id: application.id, data: { toItAdminEmployeeId: target.id } })
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate('applicationHandover.help')}</p>
      <AdminQueryState query={departments}>
        <AdminField
          label={translate('applicationHandover.department')}
          required
          description={translate('applicationHandover.departmentHelp')}
        >
          <select
            required
            className={adminInputClass}
            value={departmentId}
            onChange={(event) => {
              setDepartmentId(event.target.value)
              setApplication(null)
              setSoftwarePage(1)
            }}
          >
            <option value=''>{translate('all')}</option>
            {departments.data?.data?.items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminPagination
          pagination={departments.data?.data?.pagination}
          onPageChange={(page) => {
            setDepartmentPage(page)
            setDepartmentId('')
            setApplication(null)
          }}
          disabled={departments.isFetching}
        />
      </AdminQueryState>
      {departmentId && (
        <AdminQueryState query={software}>
          <AdminField
            label={translate('applicationHandover.application')}
            required
            description={translate('applicationHandover.applicationHelp')}
          >
            <select
              required
              className={adminInputClass}
              value={application?.id ?? ''}
              onChange={(event) => setApplication(apps.find((item) => item.id === event.target.value) ?? null)}
            >
              <option value=''>{translate('all')}</option>
              {application && !apps.some((item) => item.id === application.id) && (
                <option value={application.id}>{application.name}</option>
              )}
              {apps.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminPagination
            pagination={software.data?.data?.pagination}
            onPageChange={setSoftwarePage}
            disabled={software.isFetching}
          />
        </AdminQueryState>
      )}
      <AdminQueryState query={admins}>
        <AdminField
          label={translate('applicationHandover.target')}
          required
          description={translate('applicationHandover.targetHelp')}
        >
          <select
            required
            className={adminInputClass}
            value={target?.id ?? ''}
            onChange={(event) => {
              const item = admins.data?.data?.items.find((item) => item.employeeId === event.target.value)
              setTarget(item ? { id: item.employeeId, name: item.fullName } : null)
            }}
          >
            <option value=''>{translate('all')}</option>
            {target && !admins.data?.data?.items.some((item) => item.employeeId === target.id) && (
              <option value={target.id}>{target.name}</option>
            )}
            {admins.data?.data?.items.map((item) => (
              <option key={item.employeeId} value={item.employeeId}>
                {item.fullName}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminPagination
          pagination={admins.data?.data?.pagination}
          onPageChange={setAdminPage}
          disabled={admins.isFetching}
        />
      </AdminQueryState>
    </AdminFormDialog>
  )
}
