import { useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import type { ApplicationDetailResponseDtoData } from '~/shared/api/generated/model/applications'
import type { CreatedApplicationResponseDtoDataPlan } from '~/shared/api/generated/model/applications'
import { CreateApplicationBodyDtoPlanProvisioningType } from '~/shared/api/generated/model/applications/createApplicationBodyDtoPlanProvisioningType'
import { useApplicationCreate } from '~/shared/api/generated/operations/applications/application-create'
import { useApplicationUpdate } from '~/shared/api/generated/operations/applications/application-update'
import { getApplicationListQueryKey } from '~/shared/api/generated/operations/applications/application-list'
import { getApplicationGetQueryKey } from '~/shared/api/generated/operations/applications/application-get'
import { getPlanListQueryKey } from '~/shared/api/generated/operations/plans/plan-list'
import { useFunctionalGroupList } from '~/shared/api/generated/operations/functional-groups/functional-group-list'
import { CreateApplicationBodyDtoDataSensitivity } from '~/shared/api/generated/model/applications/createApplicationBodyDtoDataSensitivity'
import { ItField, ItFormDialog, itInputClass, itButtonClass } from '../../shared/components/it-form'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { ItPagination } from '../../shared/components/it-pagination'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { CatalogPlanRules, readPlanRules } from './catalog-plan-rules'

export const uuidPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'

export function CatalogApplicationForm({
  application,
  onClose,
  onCreated,
  onUseExisting
}: {
  application?: NonNullable<ApplicationDetailResponseDtoData>
  onClose: () => void
  onCreated?: (plan: CreatedApplicationResponseDtoDataPlan) => void
  onUseExisting?: (name: string) => void
}) {
  const { t } = useTranslation('itCatalog')
  const { t: translatePlaceholder } = useTranslation('itPlaceholders')
  const [provisioning, setProvisioning] = useState('')
  const [groupId, setGroupId] = useState('')
  const [sensitivity, setSensitivity] = useState('')
  const [groupPage, setGroupPage] = useState(1)
  const [duplicateName, setDuplicateName] = useState('')
  const groups = useFunctionalGroupList(
    { status: 'ACTIVE', page: groupPage, pageSize: 100 },
    { query: { enabled: !application } }
  )
  const feedback = useItMutationFeedback(
    [
      getApplicationListQueryKey(),
      getPlanListQueryKey(),
      ...(application ? [getApplicationGetQueryKey(application.id)] : [])
    ],
    application ? onClose : undefined
  )
  const create = useApplicationCreate({
    mutation: {
      ...feedback,
      onError: async (error) => {
        if (
          axios.isAxiosError<{ error?: { code?: string; details?: { existing?: { name?: unknown } } } }>(error) &&
          error.response?.data?.error?.code === 'APPLICATION.DUPLICATE'
        ) {
          const existing = error.response.data.error.details?.existing
          setDuplicateName(
            existing && typeof existing === 'object' && 'name' in existing && typeof existing.name === 'string'
              ? existing.name
              : ''
          )
        }
        await feedback.onError(error)
      },
      onSuccess: async (response) => {
        await feedback.onSuccess()
        if (response.data?.plan && onCreated) onCreated(response.data.plan)
        else onClose()
      }
    }
  })
  const update = useApplicationUpdate({ mutation: feedback })
  return (
    <ItFormDialog
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
          const logoUrl = String(form.get('logoUrl') ?? '').trim()
          update.mutate({
            id: application.id,
            data: { name, ...(logoUrl !== (application.logoUrl ?? '') ? { logoUrl: logoUrl || null } : {}) }
          })
          return
        }
        const planName = String(form.get('planName') ?? '').trim()
        const provision = Object.values(CreateApplicationBodyDtoPlanProvisioningType).find(
          (value) => value === form.get('provision')
        )
        const vendorName = String(form.get('vendor') ?? '').trim()
        const rules = provision ? readPlanRules(form, provision) : null
        const logoUrl = String(form.get('logoUrl') ?? '').trim()
        const homepageUrl = String(form.get('homepageUrl') ?? '').trim()
        const domains = String(form.get('domains') ?? '')
          .split(/\r?\n/)
          .map((domain) => domain.trim())
          .filter(Boolean)
        const dataSensitivity = Object.values(CreateApplicationBodyDtoDataSensitivity).find(
          (value) => value === sensitivity
        )
        if (!planName || !provision || provision === 'K3' || !rules) return
        create.mutate({
          data: {
            name,
            ...(vendorName ? { vendorName } : {}),
            ...(homepageUrl ? { homepageUrl } : {}),
            ...(logoUrl ? { logoUrl } : {}),
            ...(domains.length ? { domains } : {}),
            ...(groupId ? { functionalGroupId: groupId } : {}),
            ...(dataSensitivity ? { dataSensitivity } : {}),
            plan: { name: planName, provisioningType: provision, ...rules }
          }
        })
      }}
    >
      <ItField label={t('name')} hint={t('help.name')}>
        <input
          placeholder={translatePlaceholder('appName')}
          name='name'
          required
          maxLength={1000}
          defaultValue={application?.name}
          className={itInputClass}
        />
      </ItField>
      {application && (
        <ItField label={t('creation.logo')} hint={t('creation.logoHint')}>
          <input
            placeholder={translatePlaceholder('logoUrl')}
            name='logoUrl'
            type='url'
            pattern='https://\S+'
            maxLength={500}
            defaultValue={application.logoUrl ?? ''}
            className={itInputClass}
          />
        </ItField>
      )}
      {!application && (
        <>
          {duplicateName && onUseExisting && (
            <button type='button' className={itButtonClass} onClick={() => onUseExisting(duplicateName)}>
              {t('creation.useExisting', { name: duplicateName })}
            </button>
          )}
          <h2 className='section-accent text-lg font-semibold tracking-tight'>{t('creation.applicationSection')}</h2>
          {provisioning !== 'K5' && (
            <ItField label={t('vendor')} hint={t('help.vendor')}>
              <input
                placeholder={translatePlaceholder('vendor')}
                name='vendor'
                required={!!provisioning}
                maxLength={1000}
                className={itInputClass}
              />
            </ItField>
          )}
          <div className='grid gap-4 sm:grid-cols-2 [&>.it-form-field]:row-span-3 [&>.it-form-field]:grid-rows-subgrid'>
            <ItField label={t('creation.homepage')}>
              <input
                placeholder={translatePlaceholder('homepageUrl')}
                name='homepageUrl'
                type='url'
                maxLength={1000}
                className={itInputClass}
              />
            </ItField>
            <ItField label={t('creation.logo')} hint={t('creation.logoHint')}>
              <input
                placeholder={translatePlaceholder('logoUrl')}
                name='logoUrl'
                type='url'
                pattern='https://\S+'
                maxLength={500}
                className={itInputClass}
              />
            </ItField>
            <ItChoiceSelect
              label={t('groups.field')}
              value={groupId}
              options={[
                { value: '', label: t('groups.none') },
                ...(groups.data?.data?.items ?? []).map((group) => ({ value: group.id, label: group.name }))
              ]}
              onChange={setGroupId}
            />
            <ItChoiceSelect
              label={t('sensitivity')}
              value={sensitivity}
              options={[
                { value: '', label: t('creation.optional') },
                ...Object.values(CreateApplicationBodyDtoDataSensitivity).map((value) => ({
                  value,
                  label: t(`enums.${value}`)
                }))
              ]}
              onChange={setSensitivity}
            />
          </div>
          {groups.isError && (
            <p role='status' className='text-sm text-muted-foreground'>
              {t('creation.groupsUnavailable')}
            </p>
          )}
          {groups.data?.data && groups.data.data.pagination.totalItems > 100 && (
            <ItPagination
              page={groupPage}
              pageSize={100}
              total={groups.data.data.pagination.totalItems}
              onChange={setGroupPage}
            />
          )}
          <ItField label={t('domains')}>
            <textarea
              name='domains'
              maxLength={10000}
              className={itInputClass}
              placeholder={t('placeholders.domains')}
            />
          </ItField>
          <h2 className='section-accent text-lg font-semibold tracking-tight'>{t('creation.planSection')}</h2>
          <ItField label={t('planName')} hint={t('applicationPlanHint')}>
            <input
              placeholder={translatePlaceholder('planName')}
              name='planName'
              required
              maxLength={1000}
              className={itInputClass}
            />
          </ItField>
          <fieldset className='space-y-2'>
            <legend>
              {t('applicationProvision')}{' '}
              <span aria-hidden='true' className='text-danger'>
                *
              </span>
            </legend>
            <p className='text-sm text-muted-foreground'>{t('applicationProvisionHint')}</p>
            {Object.values(CreateApplicationBodyDtoPlanProvisioningType)
              .filter((value) => value !== 'K3')
              .map((value) => (
                <label key={value} className='flex min-h-11 items-center gap-3'>
                  <input type='radio' name='provision' value={value} required onChange={() => setProvisioning(value)} />
                  {t(`applicationProvisionValues.${value}`)}
                </label>
              ))}
          </fieldset>
          {provisioning && <CatalogPlanRules key={provisioning} provisioningType={provisioning} />}
        </>
      )}
    </ItFormDialog>
  )
}
