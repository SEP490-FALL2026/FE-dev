import type { ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { MySoftwarePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/me/mySoftwarePageResponseDtoDataItemsItem'
import { useRequestableApplicationGet } from '~/shared/api/generated/operations/requestable-software/requestable-application-get'
import { useRequestablePlanGet } from '~/shared/api/generated/operations/requestable-software/requestable-plan-get'
import { DetailDrawer } from '~/shared/ui/detail-drawer'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeQueryState } from '../../shared/components/employee-api-ui'
import { getEmployeeError } from '../../shared/hooks/employee-errors'
import { EmployeeSoftwareRightStatus } from './employee-software-right-status'

type CatalogQuery = Pick<UseQueryResult, 'isPending' | 'isError' | 'isFetching' | 'error' | 'refetch'>

function DetailField({ label, children, date = false }: { label: string; children: ReactNode; date?: boolean }) {
  return (
    <div className='min-w-0 space-y-1.5'>
      <dt className='text-xs text-muted-foreground'>{label}</dt>
      <dd className={`text-sm break-words ${date ? 'font-mono tabular-nums' : ''}`}>{children}</dd>
    </div>
  )
}

function CatalogSection({
  title,
  query,
  hasData,
  children
}: {
  title: string
  query: CatalogQuery
  hasData: boolean
  children: ReactNode
}) {
  const { t: translate } = useTranslation('employee')
  const status = getEmployeeError(query.error).status
  // Requestable catalog entries can disappear while the existing right is still held.
  const unavailable =
    (query.isError && [403, 404, 409].includes(status ?? 0)) || (!query.isPending && !query.isError && !hasData)
  return (
    <section aria-label={title} className='space-y-4 border-t border-border/60 pt-6'>
      <h3 className='text-sm font-semibold'>{title}</h3>
      {query.isPending ? (
        <div role='status' aria-label={translate('loading')} className='grid gap-4 sm:grid-cols-2'>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} aria-hidden className='space-y-2 motion-safe:animate-pulse'>
              <div className='h-3 w-24 rounded bg-surface-subtle' />
              <div className='h-4 w-32 rounded bg-surface-subtle' />
            </div>
          ))}
        </div>
      ) : unavailable ? (
        <p className='text-sm leading-relaxed text-muted-foreground'>
          {translate('softwareRightDetails.catalogUnavailable')}
        </p>
      ) : query.isError ? (
        <EmployeeQueryState query={query} />
      ) : (
        children
      )}
    </section>
  )
}

export function EmployeeSoftwareRightDetails({
  right,
  asOf,
  onClose
}: {
  right: MySoftwarePageResponseDtoDataItemsItem
  asOf: string
  onClose: () => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatDate } = useDashboardFormat()
  const applicationQuery = useRequestableApplicationGet(right.application.id)
  const planQuery = useRequestablePlanGet(right.plan.id)
  const application = applicationQuery.data?.data
  const plan = planQuery.data?.data
  const noValue = translate('noValue')
  return (
    <DetailDrawer
      title={translate('softwareRightDetails.title')}
      closeLabel={translate('softwareRightDetails.close')}
      onClose={onClose}
    >
      <div className='space-y-6'>
        <div className='space-y-3'>
          <div className='min-w-0 space-y-1'>
            <h3 className='text-xl leading-tight font-semibold break-words'>{right.application.name}</h3>
            <p className='text-sm break-words text-muted-foreground'>{right.plan.name}</p>
          </div>
          <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
            <EmployeeSoftwareRightStatus status={right.status} />
            <span className='text-xs text-muted-foreground'>
              {translate('softwareRights.asOf', { date: formatDate(asOf) })}
            </span>
          </div>
        </div>
        <section
          aria-label={translate('softwareRightDetails.access')}
          className='space-y-4 border-t border-border/60 pt-6'
        >
          <h3 className='text-sm font-semibold'>{translate('softwareRightDetails.access')}</h3>
          <dl className='grid gap-x-6 gap-y-5 sm:grid-cols-2'>
            <DetailField label={translate('softwareRightDetails.provisioning')}>
              {translate(`softwareRightDetails.provisioningTypes.${right.provisioningType}`, {
                defaultValue: translate('unknownStatus')
              })}
            </DetailField>
            <DetailField label={translate('softwareRightDetails.effectiveFrom')} date>
              {formatDate(right.effectiveFrom)}
            </DetailField>
            <DetailField label={translate('softwareRights.grantedOn')} date={!!right.grantedOn}>
              {right.grantedOn
                ? formatDate(right.grantedOn)
                : right.effectiveFromLabel || translate('softwareRights.noGrantDate')}
            </DetailField>
            <DetailField label={translate('expiresOn')} date={!!right.expectedEndDate}>
              {right.expectedEndDate ? formatDate(right.expectedEndDate) : translate('softwareRights.noEndDate')}
            </DetailField>
            {right.validUntil && (
              <DetailField label={translate('softwareRights.validUntil')} date>
                {formatDate(right.validUntil)}
              </DetailField>
            )}
          </dl>
          {right.expiringSoon && <p className='text-sm text-warning'>{translate('softwareRights.expiringSoon')}</p>}
          {right.successorAssignmentId && (
            <p className='text-sm text-muted-foreground'>{translate('softwareRightDetails.renewed')}</p>
          )}
        </section>
        <CatalogSection
          title={translate('softwareRightDetails.application')}
          query={applicationQuery}
          hasData={!!application}
        >
          {application && (
            <dl className='grid gap-x-6 gap-y-5 sm:grid-cols-2'>
              <DetailField label={translate('catalog.vendor')}>{application.vendorName || noValue}</DetailField>
              <DetailField label={translate('catalog.kind')}>
                {translate(`catalog.kinds.${application.kind}`, { defaultValue: translate('unknownStatus') })}
              </DetailField>
              <DetailField label={translate('catalog.functionalGroup')}>
                {application.functionalGroup?.name || noValue}
              </DetailField>
              <DetailField label={translate('catalog.sensitivity')}>
                {translate(`catalog.sensitivities.${application.dataSensitivity}`, {
                  defaultValue: translate('unknownStatus')
                })}
              </DetailField>
            </dl>
          )}
        </CatalogSection>
        <CatalogSection title={translate('softwareRightDetails.plan')} query={planQuery} hasData={!!plan}>
          {plan && (
            <dl className='grid gap-x-6 gap-y-5 sm:grid-cols-2'>
              <DetailField label={translate('requestExtras.plan.sharing')}>
                {plan.sharingPolicy
                  ? translate(`requestExtras.plan.sharingValues.${plan.sharingPolicy}`, {
                      defaultValue: translate('unknownStatus')
                    })
                  : noValue}
              </DetailField>
              <DetailField label={translate('requestExtras.plan.dataLoss')}>
                {translate(plan.dataLossOnRemoval ? 'requestExtras.plan.yes' : 'requestExtras.plan.no')}
              </DetailField>
            </dl>
          )}
        </CatalogSection>
      </div>
    </DetailDrawer>
  )
}
