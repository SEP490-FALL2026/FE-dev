import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { deviceCreate } from '~/shared/api/generated/operations/devices/device-create'
import { deviceHolderChange } from '~/shared/api/generated/operations/devices/device-holder-change'
import { deviceRetire } from '~/shared/api/generated/operations/devices/device-retire'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { ItDirectoryLookup } from '../../shared/components/it-directory-lookup'
import { useDeviceFeedback } from '../hooks/use-device-feedback'

export function DeviceCreateDialog({ onClose }: { onClose: () => void }) {
  const { t: translate } = useTranslation('itDevices')
  const [draft, setDraft] = useState({ assetCode: '', hostname: '', os: '', holderEmployeeId: '', handedOverOn: '' })
  const feedback = useDeviceFeedback(undefined, undefined, onClose)
  const mutation = useMutation({
    mutationFn: (body: Parameters<typeof deviceCreate>[0]) => deviceCreate(body),
    retry: false,
    ...feedback
  })
  return (
    <ItFormDialog
      wide
      title={translate('create')}
      onClose={onClose}
      pending={mutation.isPending}
      submitLabel={translate('create')}
      onSubmit={(event) => {
        event.preventDefault()
        const { handedOverOn, ...body } = draft
        mutation.mutate({ ...body, ...(handedOverOn ? { handedOverOn } : {}) })
      }}
    >
      {(['assetCode', 'hostname', 'os', 'holderEmployeeId', 'handedOverOn'] as const).map((field) => (
        <ItField key={field} label={translate(field)} hint={translate(`hints.${field}`)}>
          <input
            className={itInputClass}
            value={draft[field]}
            required={field !== 'handedOverOn'}
            type={field === 'handedOverOn' ? 'date' : 'text'}
            maxLength={field === 'assetCode' || field === 'os' ? 60 : field === 'hostname' ? 63 : undefined}
            pattern={field === 'holderEmployeeId' ? '[0-9a-fA-F-]{36}' : undefined}
            onChange={(event) => setDraft({ ...draft, [field]: event.target.value })}
          />
        </ItField>
      ))}
      <ItDirectoryLookup mode='employee' onSelect={(holderEmployeeId) => setDraft({ ...draft, holderEmployeeId })} />
    </ItFormDialog>
  )
}

export function DeviceActionDialog({
  device,
  action,
  onClose
}: {
  device: { id: string; registrationId: string | null }
  action: 'holder' | 'retire'
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itDevices')
  const [value, setValue] = useState('')
  const feedback = useDeviceFeedback(device.id, device.registrationId, onClose)
  const mutation = useMutation({
    mutationFn: async () =>
      action === 'holder'
        ? deviceHolderChange(device.id, { holderEmployeeId: value })
        : deviceRetire(device.id, { reason: value }),
    retry: false,
    ...feedback
  })
  return (
    <ItFormDialog
      title={translate(action)}
      onClose={onClose}
      pending={mutation.isPending}
      danger={action === 'retire'}
      submitLabel={translate(action)}
      onSubmit={(event) => {
        event.preventDefault()
        mutation.mutate()
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate(`hints.${action}`)}</p>
      <ItField
        label={translate(action === 'holder' ? 'holderEmployeeId' : 'reason')}
        hint={translate(action === 'holder' ? 'hints.holderEmployeeId' : 'hints.reason')}
      >
        <input
          className={itInputClass}
          required
          maxLength={action === 'retire' ? 1000 : undefined}
          pattern={action === 'holder' ? '[0-9a-fA-F-]{36}' : undefined}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </ItField>
      {action === 'holder' && <ItDirectoryLookup mode='employee' onSelect={setValue} />}
    </ItFormDialog>
  )
}
