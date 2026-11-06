import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useDeviceCredentialList } from '~/shared/api/generated/operations/device-credentials/device-credential-list'
import { deviceCredentialRevocationCreate } from '~/shared/api/generated/operations/device-credentials/device-credential-revocation-create'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ItDetailDialog } from '../../shared/components/it-detail-dialog'
import { ItField, ItFormDialog, itButtonClass, itInputClass } from '../../shared/components/it-form'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { useDeviceFeedback } from '../hooks/use-device-feedback'

export function CredentialList({
  deviceId,
  registrationId,
  onClose
}: {
  deviceId: string
  registrationId: string
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itDevices')
  const { formatDateTime } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string>()
  const [reason, setReason] = useState('')
  const query = useDeviceCredentialList(registrationId, { page, pageSize: 20 })
  const feedback = useDeviceFeedback(deviceId, registrationId, () => {
    setSelected(undefined)
    setReason('')
  })
  const mutation = useMutation({
    mutationFn: () => deviceCredentialRevocationCreate(selected!, { reason }),
    retry: false,
    ...feedback
  })
  const data = query.data?.data
  if (selected)
    return (
      <ItFormDialog
        title={translate('revoke')}
        pending={mutation.isPending}
        onClose={() => setSelected(undefined)}
        submitLabel={translate('revoke')}
        danger
        onSubmit={(event) => {
          event.preventDefault()
          mutation.mutate()
        }}
      >
        <ItField label={translate('reason')} hint={translate('hints.reason')}>
          <input
            className={itInputClass}
            required
            maxLength={1000}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </ItField>
      </ItFormDialog>
    )
  return (
    <ItDetailDialog title={translate('credentials')} onClose={onClose}>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/40'>
            {data.items.map((item) => (
              <article key={item.id} className='space-y-3 py-4 text-sm'>
                <p>{translate(`values.${item.collectorKind}`, { defaultValue: translate('unknown') })}</p>
                <dl className='grid grid-cols-2 gap-3'>
                  {(['issuedAt', 'expiresAt', 'lastAcceptedAt', 'revokedAt'] as const).map((key) => (
                    <div key={key}>
                      <dt className='text-muted-foreground'>{translate(key)}</dt>
                      <dd>{item[key] ? formatDateTime(item[key]) : translate('noData')}</dd>
                    </div>
                  ))}
                  {item.revocationReason && (
                    <div className='col-span-2'>
                      <dt className='text-muted-foreground'>{translate('revocationReason')}</dt>
                      <dd className='break-words'>{item.revocationReason}</dd>
                    </div>
                  )}
                </dl>
                {!item.revokedAt && (
                  <button className={itButtonClass} onClick={() => setSelected(item.id)} type='button'>
                    {translate('revoke')}
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
        {data && (
          <ItPagination
            page={page}
            total={data.pagination.totalItems}
            pageSize={20}
            onChange={setPage}
            disabled={query.isFetching}
          />
        )}
      </ItQueryState>
    </ItDetailDialog>
  )
}
