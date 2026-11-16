import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ApplicationDetailResponseDtoData } from '~/shared/api/generated/model/applications'
import { CreateApplicationBodyDtoPlanProvisioningType } from '~/shared/api/generated/model/applications/createApplicationBodyDtoPlanProvisioningType'
import { useApplicationCreate } from '~/shared/api/generated/operations/applications/application-create'
import { useApplicationUpdate } from '~/shared/api/generated/operations/applications/application-update'
import { getApplicationListQueryKey } from '~/shared/api/generated/operations/applications/application-list'
import { getApplicationGetQueryKey } from '~/shared/api/generated/operations/applications/application-get'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'

export const uuidPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'

export function CatalogApplicationForm({
  application,
  onClose
}: {
  application?: NonNullable<ApplicationDetailResponseDtoData>
  onClose: () => void
}) {
  const { t } = useTranslation('itCatalog')
  const [provisioning, setProvisioning] = useState('')
  const feedback = useItMutationFeedback(
    [getApplicationListQueryKey(), ...(application ? [getApplicationGetQueryKey(application.id)] : [])],
    onClose
  )
  const create = useApplicationCreate({ mutation: feedback })
  const update = useApplicationUpdate({ mutation: feedback })
  return (
    <ItFormDialog
      wide
      title={t(application ? 'edit' : 'add')}
      pending={create.isPending || update.isPending}
      onClose={onClose}
      submitLabel={t('save')}
      onSubmit={(event) => {
        event.preventDefault()
        if (create.isPending || update.isPending) return
        const form = new FormData(event.currentTarget)
        const name = String(form.get('name') ?? '').trim()
        if (!name) return
        if (application) {
          update.mutate({ id: application.id, data: { name } })
          return
        }
        const planName = String(form.get('planName') ?? '').trim()
        const provision = Object.values(CreateApplicationBodyDtoPlanProvisioningType).find(
          (value) => value === form.get('provision')
        )
        const vendorName = String(form.get('vendor') ?? '').trim()
        if (!planName || !provision) return
        create.mutate({
          data: { name, ...(vendorName ? { vendorName } : {}), plan: { name: planName, provisioningType: provision } }
        })
      }}
    >
      <ItField label={t('name')} hint={t('help.name')}>
        <input name='name' required maxLength={1000} defaultValue={application?.name} className={itInputClass} />
      </ItField>
      {!application && (
        <>
          <ItField label={t('vendor')} hint={t('help.vendor')}>
            <input
              name='vendor'
              required={!!provisioning && provisioning !== 'K5'}
              maxLength={1000}
              className={itInputClass}
            />
          </ItField>
          <ItField label={t('planName')} hint={t('applicationPlanHint')}>
            <input name='planName' required maxLength={1000} className={itInputClass} />
          </ItField>
          <fieldset className='space-y-2'>
            <legend>
              {t('applicationProvision')}{' '}
              <span aria-hidden='true' className='text-danger'>
                *
              </span>
            </legend>
            <p className='text-sm text-muted-foreground'>{t('applicationProvisionHint')}</p>
            {Object.values(CreateApplicationBodyDtoPlanProvisioningType).map((value) => (
              <label key={value} className='flex min-h-11 items-center gap-3'>
                <input type='radio' name='provision' value={value} required onChange={() => setProvisioning(value)} />
                {t(`applicationProvisionValues.${value}`)}
              </label>
            ))}
          </fieldset>
        </>
      )}
    </ItFormDialog>
  )
}
