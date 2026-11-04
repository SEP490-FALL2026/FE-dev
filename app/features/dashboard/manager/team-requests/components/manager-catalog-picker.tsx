import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { isResourceId } from '../../shared/manager-identifiers'
import { useRequestableApplicationGet } from '~/shared/api/generated/operations/requestable-software/requestable-application-get'
import { useRequestablePlanGet } from '~/shared/api/generated/operations/requestable-software/requestable-plan-get'
import type { RequestablePlanResponseDtoData } from '~/shared/api/generated/model/requestable-software/requestablePlanResponseDtoData'
import type { WorkspaceChoice } from '~/shared/ui/workspace-choice-select'
import { ManagerQueryState } from '../../shared/components/manager-api-ui'
import { ManagerCatalogApplication } from './manager-catalog-application'
import { ManagerCatalogPlans } from './manager-catalog-plans'
import { CATALOG_SENSITIVITY } from '../enums/catalog-sensitivity'

export type ManagerCatalogPlan = NonNullable<RequestablePlanResponseDtoData>
export function ManagerCatalogPicker({
  value,
  onChange,
  disabled,
  invalid
}: {
  value: ManagerCatalogPlan | null
  onChange: (plan: ManagerCatalogPlan | null) => void
  disabled: boolean
  invalid?: boolean
}) {
  const { t: translate } = useTranslation('employee')
  const { t: managerTranslate } = useTranslation('manager')
  const [chosenApplication, setApplication] = useState<WorkspaceChoice | null>(null)
  const [params] = useSearchParams()
  const [selectedId, setSelectedId] = useState(() =>
    isResourceId(params.get('planId') ?? '') ? (params.get('planId') ?? '') : ''
  )
  const planQuery = useRequestablePlanGet(selectedId, { query: { enabled: !!selectedId } })
  const plan = !planQuery.isError ? planQuery.data?.data : null
  const application = chosenApplication ?? (plan ? { value: plan.application.id, label: plan.application.name } : null)
  const applicationQuery = useRequestableApplicationGet(application?.value ?? '', { query: { enabled: !!application } })
  const details = !applicationQuery.isError ? applicationQuery.data?.data : null
  useEffect(() => {
    onChange(
      plan && details && plan.application.id === application?.value
        ? { ...plan, canSubmit: plan.canSubmit && details.canSubmit }
        : null
    )
  }, [plan, details, application?.value, onChange])
  return (
    <section aria-label={translate('catalog.selection')} className='space-y-4'>
      <div className='grid items-start gap-5 sm:grid-cols-2'>
        <ManagerCatalogApplication
          value={application}
          disabled={disabled}
          onChange={(choice) => {
            if (choice.value === application?.value) return
            setApplication(choice)
            setSelectedId('')
            onChange(null)
          }}
        />
        <ManagerCatalogPlans
          key={application?.value ?? 'none'}
          applicationId={application?.value ?? ''}
          disabled={disabled || !details}
          value={value}
          invalid={invalid}
          onChange={(row) => {
            if (row?.id === selectedId) return
            if (application && !chosenApplication) setApplication(application)
            setSelectedId(row?.id ?? '')
            onChange(null)
          }}
        />
      </div>
      {application && (
        <ManagerQueryState query={applicationQuery} empty={!details} emptyTitle={translate('catalog.noDetails')} />
      )}
      {details && (
        <dl className='grid gap-4 rounded-md bg-surface-subtle p-4 text-sm sm:grid-cols-3'>
          <div>
            <dt className='text-xs text-muted-foreground'>{translate('catalog.vendor')}</dt>
            <dd className='mt-1 truncate' title={details.vendorName ?? undefined}>
              {details.vendorName ?? translate('noValue')}
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>{translate('catalog.functionalGroup')}</dt>
            <dd className='mt-1 truncate' title={details.functionalGroup?.name}>
              {details.functionalGroup?.name ?? translate('noValue')}
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>{translate('catalog.sensitivity')}</dt>
            <dd className='mt-1'>
              {Object.values(CATALOG_SENSITIVITY).includes(details.dataSensitivity)
                ? translate(`catalog.sensitivities.${details.dataSensitivity}`)
                : translate('unknownStatus')}
            </dd>
          </div>
        </dl>
      )}
      {!!selectedId && (
        <ManagerQueryState query={planQuery} empty={!plan} emptyTitle={translate('catalog.noDetails')} />
      )}
      {value && (
        <dl className='grid gap-4 text-sm sm:grid-cols-2'>
          <div>
            <dt className='text-xs text-muted-foreground'>{managerTranslate('integration.sharing')}</dt>
            <dd>
              {value.sharingPolicy
                ? managerTranslate(
                    `integration.sharingValues.${value.sharingPolicy}` as 'integration.sharingValues.ALLOWED',
                    { defaultValue: managerTranslate('unknownStatus') }
                  )
                : managerTranslate('notReported')}
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>{managerTranslate('integration.dataLoss')}</dt>
            <dd>{managerTranslate(value.dataLossOnRemoval ? 'integration.yes' : 'integration.no')}</dd>
          </div>
        </dl>
      )}
    </section>
  )
}
