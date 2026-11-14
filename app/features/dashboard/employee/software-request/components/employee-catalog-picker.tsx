import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequestableApplicationGet } from '~/shared/api/generated/operations/requestable-software/requestable-application-get'
import type { WorkspaceChoice } from '~/shared/ui/workspace-choice-select'
import { EmployeeQueryState } from '../../shared/components/employee-api-ui'
import { EmployeeCatalogApplication } from './employee-catalog-application'
import { EmployeeCatalogPlans, type CatalogPlan } from './employee-catalog-plans'
import { CATALOG_SENSITIVITY } from '../enums/catalog-sensitivity'
import { EmployeeDepartmentApplication } from './employee-department-application'
import type { MyDepartmentSoftwareListResponseDtoDataItemsItem } from '~/shared/api/generated/model/department-software-list/myDepartmentSoftwareListResponseDtoDataItemsItem'

export function EmployeeCatalogPicker({
  value,
  onChange,
  disabled,
  invalid,
  allowDraft = true,
  onSelectPlanId,
  initialPlanId = ''
}: {
  value: CatalogPlan | null
  onChange: (plan: CatalogPlan | null) => void
  disabled: boolean
  invalid?: boolean
  allowDraft?: boolean
  onSelectPlanId?: (id: string) => void
  initialPlanId?: string
}) {
  const { t: translate } = useTranslation('employee')
  const { t: flow } = useTranslation('requestFlow')
  const [scope, setScope] = useState<'department' | 'all'>(initialPlanId ? 'all' : 'department')
  const [chosenApplication, setApplication] = useState<WorkspaceChoice | null>(null)
  const [departmentEntry, setDepartmentEntry] = useState<MyDepartmentSoftwareListResponseDtoDataItemsItem | null>(null)
  const application =
    chosenApplication ?? (value ? { value: value.application.id, label: value.application.name } : null)
  const query = useRequestableApplicationGet(application?.value ?? '', { query: { enabled: !!application } })
  const details = !query.isError ? query.data?.data : null
  return (
    <section aria-label={translate('catalog.selection')} className='space-y-4 border-b border-border/60 pb-5'>
      <div className='flex flex-wrap items-center gap-2' role='group' aria-label={flow('departmentSoftware.scope')}>
        {(['department', 'all'] as const).map((option) => (
          <button
            key={option}
            type='button'
            disabled={disabled}
            aria-pressed={scope === option}
            onClick={() => setScope(option)}
            className='min-h-11 rounded-md px-3 text-sm font-medium transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary aria-pressed:bg-primary-soft aria-pressed:text-primary-ink disabled:opacity-50'
          >
            {flow(`departmentSoftware.${option}`)}
          </button>
        ))}
      </div>
      {scope === 'department' && (
        <p className='max-w-prose text-sm text-muted-foreground'>{flow('departmentSoftware.hint')}</p>
      )}
      <div className='grid items-start gap-5 sm:grid-cols-2'>
        {scope === 'department' ? (
          <EmployeeDepartmentApplication
            value={application}
            selectedEntry={departmentEntry}
            disabled={disabled}
            onSelect={(entry) => {
              setDepartmentEntry(entry)
              setApplication({ value: entry.applicationId, label: entry.applicationName })
              onChange(null)
              if (entry.planId) onSelectPlanId?.(entry.planId)
            }}
          />
        ) : (
          <EmployeeCatalogApplication
            value={application}
            disabled={disabled}
            onChange={(choice) => {
              if (choice.value === application?.value) return
              setDepartmentEntry(null)
              setApplication(choice)
              onChange(null)
            }}
          />
        )}
        <EmployeeCatalogPlans
          key={application?.value ?? 'none'}
          applicationId={application?.value ?? ''}
          disabled={disabled || !details}
          value={value}
          invalid={invalid}
          allowDraft={allowDraft}
          onChange={(plan) =>
            onChange(plan && details ? { ...plan, canSubmit: plan.canSubmit && details.canSubmit } : null)
          }
        />
      </div>
      {application && (
        <>
          <EmployeeQueryState query={query} empty={!details} emptyTitle={translate('catalog.noDetails')} />
          {details && (
            <dl className='grid gap-4 rounded-md bg-surface-subtle/70 p-4 text-sm sm:grid-cols-3'>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('catalog.vendor')}</dt>
                <dd className='mt-1 truncate font-medium' title={details.vendorName ?? undefined}>
                  {details.vendorName ?? translate('noValue')}
                </dd>
              </div>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('catalog.functionalGroup')}</dt>
                <dd className='mt-1 truncate font-medium' title={details.functionalGroup?.name}>
                  {details.functionalGroup?.name ?? translate('noValue')}
                </dd>
              </div>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('catalog.sensitivity')}</dt>
                <dd className='mt-1 font-medium'>
                  {Object.values(CATALOG_SENSITIVITY).includes(details.dataSensitivity)
                    ? translate(`catalog.sensitivities.${details.dataSensitivity}`)
                    : translate('unknownStatus')}
                </dd>
              </div>
            </dl>
          )}
        </>
      )}
    </section>
  )
}
