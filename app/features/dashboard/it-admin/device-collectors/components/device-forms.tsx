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
  const { t: translatePlaceholder } = useTranslation('itPlaceholders')
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
      submitDisabled={!draft.holderEmployeeId}
      onSubmit={(event) => {
        event.preventDefault()
        if (!draft.holderEmployeeId) return
        const { handedOverOn, ...body } = draft
        mutation.mutate({ ...body, ...(handedOverOn ? { handedOverOn } : {}) })
      }}
    >
      {(['assetCode', 'hostname', 'os', 'handedOverOn'] as const).map((field) => (
        <ItField key={field} label={translate(field)} hint={translate(`hints.${field}`)}>
          <input
            placeholder={translatePlaceholder(`device.${field}`)}
            className={itInputClass}
            value={draft[field]}
            required={field !== 'handedOverOn'}
            type={field === 'handedOverOn' ? 'date' : 'text'}
            maxLength={field === 'assetCode' || field === 'os' ? 60 : field === 'hostname' ? 63 : undefined}
            onChange={(event) => setDraft({ ...draft, [field]: event.target.value })}
          />
        </ItField>
      ))}
      <ItDirectoryLookup
        mode='employee'
        required
        label={translate('holderEmployeeId')}
        hint={translate('hints.holderEmployeeId')}
        value={draft.holderEmployeeId}
        onSelect={(holderEmployeeId) => setDraft((current) => ({ ...current, holderEmployeeId }))}
      />
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
  const { t: translatePlaceholder } = useTranslation('itPlaceholders')
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
      submitDisabled={action === 'holder' && !value}
      onSubmit={(event) => {
        event.preventDefault()
        if (value) mutation.mutate()
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate(`hints.${action}`)}</p>
      {action === 'holder' ? (
        <ItDirectoryLookup
          mode='employee'
          required
          label={translate('holderEmployeeId')}
          hint={translate('hints.holderEmployeeId')}
          value={value}
          onSelect={setValue}
        />
      ) : (
        <ItField label={translate('reason')} hint={translate('hints.reason')}>
          <input
            placeholder={translatePlaceholder('reason')}
            className={itInputClass}
            required
            maxLength={1000}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </ItField>
      )}
    </ItFormDialog>
  )
}
