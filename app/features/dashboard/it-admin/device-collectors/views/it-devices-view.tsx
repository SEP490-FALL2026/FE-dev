import { useState } from 'react'
import { DeviceStopRequests } from '../components/device-stop-requests'
import { Laptop } from 'lucide-react'
import { ItPageHeader, ItSegmented } from '../../shared/components/it-page-header'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDeviceList } from '~/shared/api/generated/operations/devices/device-list'
import {
  departmentList,
  getDepartmentListQueryKey
} from '~/shared/api/generated/operations/departments/department-list'
import {
  departmentTechnicalMemberList,
  getDepartmentTechnicalMemberListQueryKey
} from '~/shared/api/generated/operations/departments/department-technical-member-list'
import { useCatalogSearch } from '~/shared/hooks/use-catalog-search'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ItField, itInputClass, itPrimaryClass } from '../../shared/components/it-form'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { DeviceState } from '../enums/device-state'
import { DeviceCreateDialog } from '../components/device-forms'
import { DeviceDetail } from '../components/device-detail'
import { AllowlistView } from '../components/allowlist-view'
import { MyDevices } from '../components/my-devices'
import { DeviceSection } from '../enums/device-section'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'

export function ItDevicesView({ initialId }: { initialId?: string }) {
  const { t: translate } = useTranslation('itDevices')
  const [params, setParams] = useSearchParams()
  const view =
    params.get('deviceView') === 'stopRequests'
      ? 'stopRequests'
      : params.get('deviceView') === 'mine'
        ? 'mine'
        : params.get('deviceView') === 'allowlist'
          ? 'allowlist'
          : 'registry'
  return (
    <section className='space-y-6'>
      <ItPageHeader icon={Laptop} title={translate('title')} subtitle={translate('subtitle')}>
        <ItSegmented
          label={translate('title')}
          value={view}
          items={(['registry', 'mine'] as const).map((key) => ({
            key,
            label: translate(key)
          }))}
          onChange={(value) =>
            setParams((previous) => {
              const next = new URLSearchParams(previous)
              if (value === 'registry') next.delete('deviceView')
              else next.set('deviceView', value)
              return next
            })
          }
        />
      </ItPageHeader>
      <div hidden={view !== 'registry'}>
        <Registry initialId={initialId} active={view === 'registry'} />
      </div>
      {view === 'stopRequests' ? (
        <DeviceStopRequests />
      ) : view === 'mine' ? (
        <MyDevices />
      ) : view === 'allowlist' ? (
        <AllowlistView />
      ) : null}
    </section>
  )
}

function Registry({ initialId, active }: { initialId?: string; active: boolean }) {
  const { t: translate } = useTranslation('itDevices')
  const { t: translatePlaceholder } = useTranslation('itPlaceholders')
  const { formatDateTime } = useWorkspaceFormat()
  const { draft, setDraft, search, page, setPage } = useCatalogSearch()
  const [state, setState] = useState<DeviceState>()
  const [holder, setHolder] = useState('')
  const [department, setDepartment] = useState('')
  const [params, setParams] = useSearchParams()
  const selected = params.get('deviceId') ?? (params.get('deviceList') === 'true' ? undefined : initialId)
  const section = Object.values(DeviceSection).find((value) => value === params.get('deviceSection')) ?? 'detail'
  const navigate = (id?: string, nextSection?: DeviceSection, registrationId?: string, credentialBack?: 'history') =>
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      for (const key of ['deviceId', 'deviceSection', 'deviceRegistration', 'deviceBack']) next.delete(key)
      if (id) next.set('deviceId', id)
      if (nextSection && nextSection !== 'detail') next.set('deviceSection', nextSection)
      if (registrationId) next.set('deviceRegistration', registrationId)
      if (credentialBack) next.set('deviceBack', credentialBack)
      if (!id) {
        next.delete('id')
        next.set('deviceList', 'true')
      }
      return next
    })
  const [create, setCreate] = useState(false)
  const departments = useQuery({
    queryKey: [...getDepartmentListQueryKey({ status: 'ACTIVE' }), 'device-holder-filter'],
    enabled: active && !selected,
    queryFn: async ({ signal }) => {
      const items = []
      let page = 1
      let totalPages = 1
      while (page <= totalPages) {
        const result = await departmentList({ status: 'ACTIVE', page, pageSize: 100 }, undefined, signal)
        if (!result.data) throw new Error('Missing department page')
        items.push(...result.data.items)
        totalPages = result.data.pagination.totalPages
        page++
      }
      return items
    }
  })
  const members = useQuery({
    queryKey: [...getDepartmentTechnicalMemberListQueryKey(department), 'device-holder-filter'],
    enabled: active && !selected && !!department,
    queryFn: async ({ signal }) => {
      const items = []
      let page = 1
      let totalPages = 1
      while (page <= totalPages) {
        const result = await departmentTechnicalMemberList(department, { page, pageSize: 100 }, undefined, signal)
        if (!result.data) throw new Error('Missing member page')
        items.push(...result.data.items)
        totalPages = result.data.pagination.totalPages
        page++
      }
      return items.filter((item) => item.employmentStatus === 'WORKING')
    }
  })
  const query = useDeviceList(
    {
      page,
      pageSize: 20,
      ...(search ? { search } : {}),
      ...(state ? { state } : {}),
      ...(/^[0-9a-fA-F-]{36}$/.test(holder) ? { holderEmployeeId: holder } : {})
    },
    { query: { enabled: active && !selected } }
  )
  const data = query.data?.data
  if (selected)
    return (
      <DeviceDetail
        key={selected}
        id={selected}
        section={section}
        registrationId={params.get('deviceRegistration') ?? undefined}
        credentialBack={params.get('deviceBack') === 'history' ? 'history' : undefined}
        onNavigate={(nextSection, registrationId, credentialBack) =>
          navigate(selected, nextSection, registrationId, credentialBack)
        }
        onClose={() => navigate()}
      />
    )
  return (
    <div className='space-y-4'>
      <div className='soft-panel grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4 [&>.it-form-field]:row-span-3 [&>.it-form-field]:grid-rows-subgrid'>
        <ItField label={translate('search')} hint={translate('hints.search')}>
          <input
            placeholder={translatePlaceholder('searchDevice')}
            className={itInputClass}
            type='search'
            maxLength={100}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </ItField>
        <ItChoiceSelect
          label={translate('filterDepartment')}
          value={department}
          hint={translate('hints.filterDepartment')}
          disabled={departments.isPending || departments.isError}
          options={[
            { value: '', label: translate('allDepartments') },
            ...(departments.data ?? []).map((item) => ({ value: item.id, label: item.name }))
          ]}
          onChange={(value) => {
            setDepartment(value)
            setHolder('')
            setPage(1)
          }}
        />
        <ItChoiceSelect
          label={translate('filterHolder')}
          value={holder}
          hint={translate(department ? 'hints.holderFilter' : 'hints.chooseDepartmentFirst')}
          disabled={!department || members.isPending || members.isError}
          options={[
            { value: '', label: translate('allHolders') },
            ...(members.data ?? []).map((item) => ({ value: item.id, label: item.fullName, description: item.code }))
          ]}
          onChange={(value) => {
            setHolder(value)
            setPage(1)
          }}
        />
        <ItChoiceSelect
          label={translate('state')}
          hint={translate('hints.collectionState')}
          value={state ?? ''}
          onChange={(next) => {
            setState(Object.values(DeviceState).find((value) => value === next))
            setPage(1)
          }}
          options={[
            { value: '', label: translate('all') },
            ...Object.values(DeviceState).map((value) => ({ value, label: translate(`values.${value}`) }))
          ]}
        />
      </div>
      {departments.isError && <ItQueryState query={departments}>{null}</ItQueryState>}
      {department && members.isError && <ItQueryState query={members}>{null}</ItQueryState>}
      <div className='flex justify-end'>
        <button type='button' className={itPrimaryClass} onClick={() => setCreate(true)}>
          {translate('create')}
        </button>
      </div>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='overflow-x-auto rounded-lg border border-border bg-surface'>
            <table className='w-full text-sm'>
              <thead className='border-b border-border text-xs text-muted-foreground'>
                <tr>
                  {(['assetCode', 'hostname', 'holderEmployeeId', 'state', 'lastAcceptedAt'] as const).map((key) => (
                    <th className='px-4 py-3 text-left font-medium' key={key}>
                      {translate(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-border/40'>
                {data.items.map((item) => (
                  <tr key={item.id} className='hover:bg-surface-subtle/50'>
                    <td className='px-4 py-3'>
                      <button
                        type='button'
                        className='max-w-48 truncate font-medium text-primary-ink underline-offset-4 hover:underline'
                        title={item.assetCode}
                        onClick={() => navigate(item.id)}
                      >
                        {item.assetCode}
                      </button>
                    </td>
                    <td className='max-w-48 truncate px-4 py-3' title={item.hostname}>
                      {item.hostname}
                    </td>
                    <td className='max-w-48 truncate px-4 py-3' title={item.holder?.fullName}>
                      {item.holder?.fullName ?? translate('noData')}
                    </td>
                    <td className='px-4 py-3'>
                      {translate(`values.${item.state}`, { defaultValue: translate('unknown') })}
                    </td>
                    <td className='px-4 py-3'>
                      {item.collection?.lastAcceptedAt
                        ? formatDateTime(item.collection.lastAcceptedAt)
                        : translate('noCollection')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && (
        <ItPagination
          page={page}
          total={data.pagination.totalItems}
          pageSize={20}
          onChange={setPage}
          disabled={query.isFetching}
        />
      )}
      {create && <DeviceCreateDialog onClose={() => setCreate(false)} />}
    </div>
  )
}
