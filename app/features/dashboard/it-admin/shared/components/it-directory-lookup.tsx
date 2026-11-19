import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentList } from '~/shared/api/generated/operations/departments/department-list'
import { useDepartmentTechnicalMemberList } from '~/shared/api/generated/operations/departments/department-technical-member-list'
import { useDebouncedValue } from '~/shared/lib/use-debounced-value'
import { useAccumulatedOptions } from '../hooks/use-accumulated-options'
import { ItChoiceSelect } from './it-choice-select'

const PAGE_SIZE = 50

/**
 * Picks a department (server search over `departmentList`) or a working person: department first, then one of its
 * technical members (`departmentTechnicalMemberList`, which is scoped by BE to departments the IT Admin manages).
 */
export function ItDirectoryLookup({
  mode,
  value,
  onSelect,
  label,
  hint,
  required = false,
  clearable = false
}: {
  mode: 'department' | 'employee'
  value: string
  onSelect: (id: string) => void
  /** Label of the final pick; defaults to "Department" / "Employee". */
  label?: string
  hint?: string
  required?: boolean
  clearable?: boolean
}) {
  const { t: translate } = useTranslation('itAdmin')
  const [departmentId, setDepartmentId] = useState('')
  if (mode === 'department')
    return (
      <DepartmentPicker
        label={label ?? translate('directory.department')}
        hint={hint}
        required={required}
        clearable={clearable}
        value={value}
        onChange={onSelect}
      />
    )
  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      <DepartmentPicker
        label={translate('directory.department')}
        required={required}
        value={departmentId}
        onChange={(next) => {
          setDepartmentId(next)
          if (value) onSelect('')
        }}
      />
      <MemberPicker
        departmentId={departmentId}
        label={label ?? translate('directory.employee')}
        hint={hint ?? translate('directory.scopeHint')}
        required={required}
        clearable={clearable}
        value={value}
        onChange={onSelect}
      />
    </div>
  )
}

function DepartmentPicker({
  label,
  hint,
  value,
  onChange,
  required,
  clearable = false
}: {
  label: string
  hint?: string
  value: string
  onChange: (id: string) => void
  required: boolean
  clearable?: boolean
}) {
  const { t: translate } = useTranslation('itAdmin')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const [page, setPage] = useState(1)
  const query = useDepartmentList({ status: 'ACTIVE', search: debouncedSearch || undefined, page, pageSize: PAGE_SIZE })
  const options = useAccumulatedOptions({
    page,
    items: query.data?.data?.items,
    resetKey: debouncedSearch,
    onReset: () => setPage(1),
    toOption: (item) => ({ value: item.id, label: item.name, description: item.code })
  })
  return (
    <ItChoiceSelect
      label={label}
      hint={hint}
      placeholder={translate('directory.departmentPlaceholder')}
      emptyText={translate('directory.noDepartments')}
      required={required}
      clearable={clearable}
      value={value}
      options={options}
      loading={query.isFetching}
      disabled={query.isError}
      onSearchChange={setSearch}
      hasMore={page * PAGE_SIZE < (query.data?.data?.pagination.totalItems ?? 0)}
      onLoadMore={() => setPage((current) => current + 1)}
      onChange={onChange}
    />
  )
}

function MemberPicker({
  departmentId,
  label,
  hint,
  value,
  onChange,
  required,
  clearable
}: {
  departmentId: string
  label: string
  hint: string
  value: string
  onChange: (id: string) => void
  required: boolean
  clearable: boolean
}) {
  const { t: translate } = useTranslation('itAdmin')
  const [page, setPage] = useState(1)
  const query = useDepartmentTechnicalMemberList(
    departmentId,
    { page, pageSize: PAGE_SIZE },
    { query: { enabled: !!departmentId } }
  )
  const options = useAccumulatedOptions({
    page,
    items: query.data?.data?.items,
    resetKey: departmentId,
    onReset: () => setPage(1),
    toOption: (item) =>
      item.employmentStatus === 'WORKING' ? { value: item.id, label: item.fullName, description: item.code } : null
  })
  return (
    <ItChoiceSelect
      label={label}
      hint={query.isError ? translate('directory.noAccess') : hint}
      placeholder={translate(departmentId ? 'directory.employeePlaceholder' : 'directory.pickDepartmentFirst')}
      emptyText={translate('directory.noEmployees')}
      required={required}
      clearable={clearable}
      value={value}
      options={options}
      loading={query.isFetching}
      disabled={!departmentId || query.isError}
      hasMore={page * PAGE_SIZE < (query.data?.data?.pagination.totalItems ?? 0)}
      onLoadMore={() => setPage((current) => current + 1)}
      onChange={onChange}
    />
  )
}
