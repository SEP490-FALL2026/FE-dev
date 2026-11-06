import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ApplicationDetailResponseDtoData } from '~/shared/api/generated/model/applications'
import { DeclareApplicationBodyDtoKind } from '~/shared/api/generated/model/applications/declareApplicationBodyDtoKind'
import { DeclareApplicationBodyDtoDataSensitivity } from '~/shared/api/generated/model/applications/declareApplicationBodyDtoDataSensitivity'
import { useApplicationCreate } from '~/shared/api/generated/operations/applications/application-create'
import { useApplicationUpdate } from '~/shared/api/generated/operations/applications/application-update'
import { getApplicationListQueryKey } from '~/shared/api/generated/operations/applications/application-list'
import { getApplicationGetQueryKey } from '~/shared/api/generated/operations/applications/application-get'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { ItDirectoryLookup } from '../../shared/components/it-directory-lookup'
import { CatalogFunctionalGroupPicker } from './catalog-functional-groups'
export const uuidPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
export function CatalogApplicationForm({
  application,
  onClose
}: {
  application?: NonNullable<ApplicationDetailResponseDtoData>
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itCatalog')
  const [selectedKind, setSelectedKind] = useState('SAAS')
  const [ownerId, setOwnerId] = useState(application?.businessOwner.employeeId ?? '')
  const [functionalGroupId, setFunctionalGroupId] = useState(application?.functionalGroup?.id ?? '')
  const feedback = useItMutationFeedback(
    [getApplicationListQueryKey(), ...(application ? [getApplicationGetQueryKey(application.id)] : [])],
    onClose
  )
  const create = useApplicationCreate({ mutation: feedback })
  const update = useApplicationUpdate({ mutation: feedback })
  return (
    <ItFormDialog
      wide
      title={translate(application ? 'edit' : 'add')}
      pending={create.isPending || update.isPending}
      onClose={onClose}
      submitLabel={translate('save')}
      onSubmit={(event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        const name = String(form.get('name') ?? '').trim()
        const owner = String(form.get('owner') ?? '').trim()
        const sensitivityValue = String(form.get('sensitivity'))
        const dataSensitivity = Object.values(DeclareApplicationBodyDtoDataSensitivity).find(
          (value) => value === sensitivityValue
        )
        const kind = Object.values(DeclareApplicationBodyDtoKind).find((value) => value === form.get('kind'))
        if (!name || !dataSensitivity || (!application && !kind)) return
        const data = {
          name,
          businessOwnerEmployeeId: owner,
          dataSensitivity,
          domains: String(form.get('domains') ?? '')
            .split('\n')
            .map((value) => value.trim())
            .filter(Boolean),
          communication: {
            personToPersonMessaging: form.has('personToPersonMessaging'),
            callsOrMeetings: form.has('callsOrMeetings'),
            mailbox: form.has('mailbox')
          }
        }
        if (application)
          update.mutate({ id: application.id, data: { ...data, functionalGroupId: functionalGroupId || null } })
        else if (kind)
          create.mutate({
            data: {
              ...data,
              kind,
              ...(functionalGroupId ? { functionalGroupId } : {}),
              ...(kind !== 'INTERNAL' ? { vendorName: String(form.get('vendor') ?? '').trim() } : {})
            }
          })
      }}
    >
      <ItField label={translate('name')} hint={translate('help.name')}>
        <input
          placeholder={translate('placeholders.application')}
          name='name'
          required
          maxLength={1000}
          defaultValue={application?.name}
          className={itInputClass}
        />
      </ItField>
      {!application && (
        <fieldset className='space-y-2'>
          <legend>{translate('kind')}</legend>
          <p className='text-xs font-normal text-muted-foreground'>{translate('help.kind')}</p>
          {Object.values(DeclareApplicationBodyDtoKind).map((value) => (
            <label key={value} className='mr-4 inline-flex items-center gap-2'>
              <input
                type='radio'
                name='kind'
                value={value}
                defaultChecked={value === 'SAAS'}
                onChange={() => setSelectedKind(value)}
              />
              {translate(`enums.${value}`)}
            </label>
          ))}
          <ItField label={translate('vendor')} hint={translate('help.vendor')}>
            <input
              placeholder={translate('placeholders.vendor')}
              name='vendor'
              required={selectedKind !== 'INTERNAL'}
              disabled={selectedKind === 'INTERNAL'}
              maxLength={1000}
              className={itInputClass}
            />
          </ItField>
        </fieldset>
      )}
      <ItField label={translate('owner')} hint={translate('help.owner')}>
        <input
          placeholder={translate('placeholders.employeeId')}
          name='owner'
          required
          pattern={uuidPattern}
          value={ownerId}
          onChange={(event) => setOwnerId(event.target.value)}
          className={itInputClass}
        />
      </ItField>
      <ItDirectoryLookup mode='employee' onSelect={setOwnerId} />
      <CatalogFunctionalGroupPicker
        value={functionalGroupId}
        initial={application?.functionalGroup}
        onChange={setFunctionalGroupId}
      />
      <fieldset>
        <legend>{translate('sensitivity')}</legend>
        <p className='text-xs font-normal text-muted-foreground'>{translate('help.sensitivity')}</p>
        {Object.values(DeclareApplicationBodyDtoDataSensitivity).map((value) => (
          <label key={value} className='mr-4 inline-flex min-h-11 items-center gap-2'>
            <input
              type='radio'
              name='sensitivity'
              value={value}
              defaultChecked={value === (application?.dataSensitivity ?? 'MEDIUM')}
            />
            {translate(`enums.${value}`)}
          </label>
        ))}
      </fieldset>
      <ItField label={translate('domains')} hint={translate('help.domains')}>
        <textarea
          placeholder={translate('placeholders.domains')}
          name='domains'
          defaultValue={application?.domains.join('\n')}
          className={itInputClass}
        />
      </ItField>
      <fieldset>
        <legend>{translate('communication')}</legend>
        <p className='text-xs font-normal text-muted-foreground'>{translate('help.communication')}</p>
        {(['personToPersonMessaging', 'callsOrMeetings', 'mailbox'] as const).map((key) => (
          <label key={key} className='flex min-h-11 items-center gap-2'>
            <input type='checkbox' name={key} defaultChecked={application?.communication[key]} />
            {translate(key)}
          </label>
        ))}
      </fieldset>
    </ItFormDialog>
  )
}
