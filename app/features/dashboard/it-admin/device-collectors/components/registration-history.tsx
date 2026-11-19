import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeviceRegistrationList } from '~/shared/api/generated/operations/devices/device-registration-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'
import { DevicePage } from './device-page'

export function RegistrationHistory({
  id,
  onClose,
  onCredentials
}: {
  id: string
  onClose: () => void
  onCredentials: (registrationId: string) => void
}) {
  const { t: translate } = useTranslation('itDevices')
  const { formatDate, formatDateTime } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const query = useDeviceRegistrationList(id, { page, pageSize: 20 })
  const data = query.data?.data
  return (
    <DevicePage title={translate('history')} backLabel={translate('backToDevice')} onBack={onClose}>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border rounded-lg border border-border bg-surface px-5'>
            {data.items.map((item) => (
              <article key={item.id} className='space-y-4 py-5'>
                <h3 className='break-words font-medium'>{item.holder?.fullName ?? translate('noHolder')}</h3>
                {item.holder && <p className='font-mono text-xs text-muted-foreground'>{item.holder.employeeCode}</p>}
                <dl className='grid gap-4 text-sm sm:grid-cols-2'>
                  <div>
                    <dt className='text-muted-foreground'>{translate('registeredFrom')}</dt>
                    <dd>{formatDate(item.validFrom)}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{translate('validUntil')}</dt>
                    <dd>{item.validUntil ? formatDate(item.validUntil) : translate('openRegistration')}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{translate('endCause')}</dt>
                    <dd>
                      {item.endCause
                        ? translate(`values.${item.endCause}`, { defaultValue: translate('unknown') })
                        : translate('openRegistration')}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{translate('signatureRecorded')}</dt>
                    <dd>{translate(item.signatureRecorded ? 'yes' : 'no')}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{translate('acknowledgedFrom')}</dt>
                    <dd>
                      {item.acknowledgedFrom ? formatDateTime(item.acknowledgedFrom) : translate('notAcknowledged')}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{translate('lastAcceptedAt')}</dt>
                    <dd>{item.lastAcceptedAt ? formatDateTime(item.lastAcceptedAt) : translate('noCollection')}</dd>
                  </div>
                </dl>
                <button type='button' className={itButtonClass} onClick={() => onCredentials(item.id)}>
                  {translate('credentials')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && (
        <ItPagination
          page={page}
          pageSize={20}
          total={data.pagination.totalItems}
          onChange={setPage}
          disabled={query.isFetching}
        />
      )}
    </DevicePage>
  )
}
