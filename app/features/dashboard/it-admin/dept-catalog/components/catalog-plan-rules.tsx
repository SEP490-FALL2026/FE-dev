import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreateApplicationBodyDtoPlanControlLevel } from '~/shared/api/generated/model/applications/createApplicationBodyDtoPlanControlLevel'
import { CreateApplicationBodyDtoPlanSharingPolicy } from '~/shared/api/generated/model/applications/createApplicationBodyDtoPlanSharingPolicy'
import type { CreateApplicationBodyDtoPlan } from '~/shared/api/generated/model/applications'
import { ItField, itInputClass } from '../../shared/components/it-form'

export function readPlanRules(values: FormData, provisioningType: CreateApplicationBodyDtoPlan['provisioningType']) {
  const controlLevel = Object.values(CreateApplicationBodyDtoPlanControlLevel).find(
    (value) => value === values.get('controlLevel')
  )
  const sharingPolicy = Object.values(CreateApplicationBodyDtoPlanSharingPolicy).find(
    (value) => value === values.get('sharingPolicy')
  )
  const dataLossOnRemoval = values.has('dataLossOnRemoval')
  const revocationNote = String(values.get('revocationNote') ?? '').trim()
  if ((provisioningType !== 'K5' && !controlLevel) || (dataLossOnRemoval && !revocationNote)) return null
  return {
    ...(provisioningType !== 'K5' && controlLevel ? { controlLevel } : {}),
    ...(sharingPolicy ? { sharingPolicy } : {}),
    dataLossOnRemoval,
    ...(revocationNote ? { revocationNote } : {}),
    ...(provisioningType === 'K4' ? { hasAdminConsole: values.has('hasAdminConsole') } : {})
  }
}

export function CatalogPlanRules({ provisioningType }: { provisioningType: string }) {
  const { t: translate } = useTranslation('itCatalog')
  const [dataLoss, setDataLoss] = useState(false)
  return (
    <div className='space-y-4'>
      {provisioningType && provisioningType !== 'K5' && (
        <fieldset>
          <legend className='font-medium'>
            {translate('controlLevel')}{' '}
            <span aria-hidden='true' className='text-danger'>
              *
            </span>
          </legend>
          {Object.values(CreateApplicationBodyDtoPlanControlLevel).map((value) => (
            <label key={value} className='mr-4 inline-flex min-h-11 items-center gap-2'>
              <input type='radio' name='controlLevel' value={value} required />
              {translate(`planRules.control.${value}`)}
            </label>
          ))}
        </fieldset>
      )}
      <fieldset>
        <legend className='font-medium'>{translate('planRules.sharing')}</legend>
        {Object.values(CreateApplicationBodyDtoPlanSharingPolicy).map((value) => (
          <label key={value} className='mr-4 inline-flex min-h-11 items-center gap-2'>
            <input type='radio' name='sharingPolicy' value={value} />
            {translate(`planRules.sharingValues.${value}`)}
          </label>
        ))}
      </fieldset>
      {provisioningType === 'K4' && (
        <label className='flex min-h-11 items-center gap-2'>
          <input type='checkbox' name='hasAdminConsole' />
          {translate('planRules.adminConsole')}
        </label>
      )}
      <label className='flex min-h-11 items-center gap-2'>
        <input
          type='checkbox'
          name='dataLossOnRemoval'
          checked={dataLoss}
          onChange={(event) => setDataLoss(event.target.checked)}
        />
        {translate('planRules.dataLoss')}
      </label>
      {dataLoss && (
        <ItField label={translate('planRules.note')} hint={translate('help.revocationNote')}>
          <textarea name='revocationNote' required maxLength={2000} className={itInputClass} />
        </ItField>
      )}
    </div>
  )
}
