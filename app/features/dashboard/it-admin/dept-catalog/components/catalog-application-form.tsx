import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ApplicationDetailResponseDtoData } from '~/shared/api/generated/model/applications'
import { CreateApplicationBodyDtoDataSensitivity } from '~/shared/api/generated/model/applications/createApplicationBodyDtoDataSensitivity'
import { CreateApplicationBodyDtoPlanProvisioningType } from '~/shared/api/generated/model/applications/createApplicationBodyDtoPlanProvisioningType'
import { useApplicationCreate } from '~/shared/api/generated/operations/applications/application-create'
import { useApplicationUpdate } from '~/shared/api/generated/operations/applications/application-update'
import { getApplicationListQueryKey } from '~/shared/api/generated/operations/applications/application-list'
import { getApplicationGetQueryKey } from '~/shared/api/generated/operations/applications/application-get'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { CatalogFunctionalGroupPicker } from './catalog-functional-groups'
export const uuidPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
const dataSensitivities = Object.values(CreateApplicationBodyDtoDataSensitivity)
const provisioningTypes = Object.values(CreateApplicationBodyDtoPlanProvisioningType)

export function CatalogApplicationForm({
  application,
  onClose
}: {
  application?: NonNullable<ApplicationDetailResponseDtoData>
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itCatalog')
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
        const sensitivityValue = String(form.get('sensitivity'))
        const dataSensitivity = dataSensitivities.find((value) => value === sensitivityValue)
        if (!name || !dataSensitivity) return
        const data = {
          name,
          dataSensitivity,
          domains: String(form.get('domains') ?? '')
            .split('\n')
            .map((value) => value.trim())
            .filter(Boolean),
          ...(functionalGroupId ? { functionalGroupId } : {})
        }
        if (application) {
          update.mutate({ id: application.id, data })
          return
        }
        const planName = String(form.get('planName') ?? '').trim()
        const provisioningType = provisioningTypes.find((value) => value === form.get('provisioningType'))
        const vendorName = String(form.get('vendor') ?? '').trim()
        if (!planName || !provisioningType) return
        create.mutate({
          data: { ...data, ...(vendorName ? { vendorName } : {}), plan: { name: planName, provisioningType } }
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
        <>
          <ItField label={translate('vendor')} hint={translate('help.vendor')}>
            <input
              placeholder={translate('placeholders.vendor')}
              name='vendor'
              maxLength={1000}
              className={itInputClass}
            />
          </ItField>
          <div className='grid gap-4 sm:grid-cols-2'>
            <ItField label={translate('planName')} hint={translate('help.planName')}>
              <input
                placeholder={translate('placeholders.plan')}
                name='planName'
                required
                maxLength={1000}
                className={itInputClass}
              />
            </ItField>
            <ItField label={translate('provisioning')} hint={translate('help.provisioning')}>
              <select name='provisioningType' required defaultValue='K1' className={itInputClass}>
                {provisioningTypes.map((value) => (
                  <option key={value} value={value}>
                    {translate(`enums.${value}`)}
                  </option>
                ))}
              </select>
            </ItField>
          </div>
        </>
      )}
      <CatalogFunctionalGroupPicker
        value={functionalGroupId}
        initial={application?.functionalGroup}
        onChange={setFunctionalGroupId}
      />
      <fieldset>
        <legend>{translate('sensitivity')}</legend>
        <p className='text-xs font-normal text-muted-foreground'>{translate('help.sensitivity')}</p>
        {dataSensitivities.map((value) => (
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
    </ItFormDialog>
  )
}
