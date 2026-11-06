import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeviceList } from '~/shared/api/generated/operations/devices/device-list'
import { useCatalogSearch } from '~/shared/hooks/use-catalog-search'
import { ItField, itButtonClass, itInputClass, itPrimaryClass } from '../../shared/components/it-form'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { DeviceState } from '../enums/device-state'
import { DeviceCreateDialog } from '../components/device-forms'
import { DeviceDetail } from '../components/device-detail'
import { AllowlistView } from '../components/allowlist-view'
import { MyDevices } from '../components/my-devices'

export function ItDevicesView({ initialId }: { initialId?: string }) {
  const { t: translate } = useTranslation('itDevices')
  const [view, setView] = useState<'registry' | 'mine' | 'allowlist'>('registry')
  return (
    <section className='space-y-6'>
      <header>
        <h1 className='text-2xl font-semibold'>{translate('title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{translate('subtitle')}</p>
      </header>
      <div className='flex flex-wrap gap-2'>
        {(['registry', 'mine', 'allowlist'] as const).map((value) => (
          <button
            key={value}
            type='button'
            className={itButtonClass}
            aria-pressed={view === value}
            onClick={() => setView(value)}
          >
            {translate(value)}
          </button>
        ))}
      </div>
      {view === 'registry' ? <Registry initialId={initialId} /> : view === 'mine' ? <MyDevices /> : <AllowlistView />}
    </section>
  )
}

function Registry({ initialId }: { initialId?: string }) {
  const { t: translate } = useTranslation('itDevices')
  const { draft, setDraft, search, page, setPage } = useCatalogSearch()
  const [state, setState] = useState<DeviceState>()
  const [holder, setHolder] = useState('')
  const [selected, setSelected] = useState(initialId)
  const [create, setCreate] = useState(false)
  const query = useDeviceList({
    page,
    pageSize: 20,
    ...(search ? { search } : {}),
    ...(state ? { state } : {}),
    ...(/^[0-9a-fA-F-]{36}$/.test(holder) ? { holderEmployeeId: holder } : {})
  })
  const data = query.data?.data
  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-end gap-3'>
        <div className='min-w-48 flex-1'>
          <ItField label={translate('search')}>
            <input
              className={itInputClass}
              type='search'
              maxLength={100}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
          </ItField>
        </div>
        <div className='min-w-48 flex-1'>
          <ItField label={translate('holderEmployeeId')}>
            <input
              className={itInputClass}
              value={holder}
              onChange={(event) => {
                setHolder(event.target.value)
                setPage(1)
              }}
            />
          </ItField>
        </div>
        <ItField label={translate('state')}>
          <select
            className={itInputClass}
            value={state ?? ''}
            onChange={(event) => {
              setState(Object.values(DeviceState).find((value) => value === event.target.value))
              setPage(1)
            }}
          >
            <option value=''>{translate('all')}</option>
            {Object.values(DeviceState).map((value) => (
              <option key={value} value={value}>
                {translate(`values.${value}`)}
              </option>
            ))}
          </select>
        </ItField>
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
                  {(['assetCode', 'hostname', 'holderEmployeeId', 'state'] as const).map((key) => (
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
                        onClick={() => setSelected(item.id)}
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
      {selected && <DeviceDetail id={selected} onClose={() => setSelected(undefined)} />}
    </div>
  )
}
