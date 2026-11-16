import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentList } from '~/shared/api/generated/operations/departments/department-list'
import { useDepartmentSoftwareList } from '~/shared/api/generated/operations/department-software-list/department-software-list'
import { AdminField, adminInputClass } from '../../shared/components/admin-form'
import { AdminEmpty, AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'

/** Super Admin may read department software, but may not query the IT catalog. */
export function ApplicationPicker({ onSelect }: { onSelect: (id: string, name: string) => void }) {
  const { t: translate } = useTranslation('admin')
  const [departmentId, setDepartmentId] = useState('')
  const [departmentPage, setDepartmentPage] = useState(1)
  const [softwarePage, setSoftwarePage] = useState(1)
  const [selection, setSelection] = useState({ id: '', name: '' })
  const departments = useDepartmentList({ page: departmentPage, pageSize: 20 })
  const software = useDepartmentSoftwareList(
    departmentId,
    { page: softwarePage, pageSize: 20 },
    { query: { enabled: Boolean(departmentId) } }
  )
  const applications = [
    ...new Map((software.data?.data?.items ?? []).map((item) => [item.applicationId, item])).values()
  ]
  return (
    <div className='space-y-3'>
      <AdminQueryState query={departments}>
        <AdminField
          label={translate('ghostSeats.thresholds.department')}
          description={translate('ghostSeats.thresholds.departmentHelp')}
        >
          <select
            required
            className={adminInputClass}
            value={departmentId}
            onChange={(event) => {
              setDepartmentId(event.target.value)
              setSoftwarePage(1)
              setSelection({ id: '', name: '' })
              onSelect('', '')
            }}
          >
            <option value=''>{translate('ghostSeats.thresholds.choose')}</option>
            {departmentId && !departments.data?.data?.items.some((department) => department.id === departmentId) && (
              <option value={departmentId}>{translate('ghostSeats.thresholds.currentSelection')}</option>
            )}
            {departments.data?.data?.items.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminPagination
          pagination={departments.data?.data?.pagination}
          onPageChange={setDepartmentPage}
          disabled={departments.isFetching}
        />
      </AdminQueryState>
      {departmentId ? (
        <AdminQueryState query={software}>
          <AdminField
            label={translate('ghostSeats.thresholds.application')}
            description={translate('ghostSeats.thresholds.applicationHelp')}
          >
            <select
              required
              value={selection.id}
              className={adminInputClass}
              onChange={(event) => {
                const application = applications.find((item) => item.applicationId === event.target.value)
                const next = { id: application?.applicationId ?? '', name: application?.applicationName ?? '' }
                setSelection(next)
                onSelect(next.id, next.name)
              }}
            >
              <option value=''>{translate('ghostSeats.thresholds.choose')}</option>
              {selection.id && !applications.some((application) => application.applicationId === selection.id) && (
                <option value={selection.id}>{selection.name}</option>
              )}
              {applications.map((application) => (
                <option key={application.applicationId} value={application.applicationId}>
                  {application.applicationName}
                </option>
              ))}
            </select>
          </AdminField>
          {!applications.length && <AdminEmpty />}
          <AdminPagination
            pagination={software.data?.data?.pagination}
            onPageChange={setSoftwarePage}
            disabled={software.isFetching}
          />
        </AdminQueryState>
      ) : (
        <p className='text-sm text-muted-foreground'>{translate('ghostSeats.thresholds.chooseDepartment')}</p>
      )}
    </div>
  )
}
