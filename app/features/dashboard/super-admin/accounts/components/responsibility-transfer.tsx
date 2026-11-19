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
import { AdminField, AdminFormDialog } from '../../shared/components/admin-form'
import { AdminSelect } from '../../shared/components/admin-select'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
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
  const [departmentSearch, setDepartmentSearch] = useState('')
  const [departmentLabel, setDepartmentLabel] = useState('')
  const debouncedDepartmentSearch = useDebouncedValue(departmentSearch, 300)
  const departments = useDepartmentList({
    page: departmentPage,
    pageSize: 20,
    ...(debouncedDepartmentSearch ? { search: debouncedDepartmentSearch } : {})
  })
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
          <AdminSelect
            required
            value={departmentId}
            onChange={(next, option) => {
              setDepartmentId(next)
              setDepartmentLabel(option?.label ?? '')
              setApplication(null)
              setSoftwarePage(1)
            }}
            onSearchChange={(text) => {
              setDepartmentSearch(text)
              setDepartmentPage(1)
            }}
            selectedLabel={departmentLabel}
            loading={departments.isFetching}
            options={(departments.data?.data?.items ?? []).map((item) => ({
              value: item.id,
              label: item.name,
              description: item.code
            }))}
            placeholder={translate('ui.pickDepartment')}
          />
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
            <AdminSelect
              required
              value={application?.id ?? ''}
              onChange={(_, option) => setApplication(option ? { id: option.value, name: option.label } : null)}
              selectedLabel={application?.name}
              loading={software.isFetching}
              options={apps.map((item) => ({ value: item.id, label: item.name }))}
              placeholder={translate('ui.pickApplication')}
              emptyText={translate('ui.noApplications')}
            />
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
          <AdminSelect
            required
            value={target?.id ?? ''}
            onChange={(_, option) => setTarget(option ? { id: option.value, name: option.label } : null)}
            selectedLabel={target?.name}
            loading={admins.isFetching}
            options={(admins.data?.data?.items ?? []).map((item) => ({ value: item.employeeId, label: item.fullName }))}
            placeholder={translate('ui.pickItAdmin')}
          />
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
