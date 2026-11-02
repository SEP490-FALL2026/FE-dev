import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlanListProvisioningType } from '../enums/provisioning-type'

import type { ApplicationPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/applications'
import { usePlanList } from '~/shared/api/generated/operations/plans'
import {
  FinanceButton,
  FinanceDrawer,
  FinanceField,
  FinancePagination,
  FinanceQueryState,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { FinanceCatalogSubscriptions } from './finance-catalog-subscriptions'

export function FinanceCatalogDetail({
  application,
  onClose
}: {
  application: ApplicationPageResponseDtoDataItemsItem
  onClose: () => void
}) {
  const { t: translate } = useTranslation('financeSettings')
  const [page, setPage] = useState(1)
  const [provisioningType, setProvisioningType] = useState<PlanListProvisioningType | ''>('')
  const [plan, setPlan] = useState<{ id: string; name: string } | null>(null)
  const plans = usePlanList({
    applicationId: application.id,
    provisioningType: provisioningType || undefined,
    page,
    pageSize: 10
  })
  return (
    <FinanceDrawer title={application.name} onClose={onClose}>
      <h3 className='font-semibold'>{translate('plans')}</h3>
      <FinanceField label={translate('provisioningType')}>
        <select
          className={financeInputClass}
          value={provisioningType}
          onChange={(event) => {
            setProvisioningType(
              Object.values(PlanListProvisioningType).find((value) => value === event.target.value) ?? ''
            )
            setPage(1)
          }}
        >
          <option value=''>{translate('all')}</option>
          {Object.values(PlanListProvisioningType).map((value) => (
            <option key={value} value={value}>
              {translate(`enum.${value}`)}
            </option>
          ))}
        </select>
      </FinanceField>
      <FinanceQueryState query={plans}>
        <FinanceTable
          items={plans.data?.data?.items ?? []}
          rowKey={(item) => item.id}
          onOpen={setPlan}
          columns={[
            { key: 'name', label: translate('plan'), render: (item) => item.name },
            {
              key: 'provisioning',
              label: translate('provisioningType'),
              render: (item) => translate(`enum.${item.provisioningType}`, { defaultValue: translate('unavailable') })
            },
            {
              key: 'pricing',
              label: translate('pricingModel'),
              render: (item) =>
                item.pricingModel
                  ? translate(`enum.${item.pricingModel}`, { defaultValue: translate('unavailable') })
                  : '—'
            }
          ]}
        />
        <FinancePagination pagination={plans.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
      {plan && (
        <div className='flex items-center gap-3 text-sm'>
          <span>
            {translate('plan')}: {plan.name}
          </span>
          <FinanceButton onClick={() => setPlan(null)}>{translate('all')}</FinanceButton>
        </div>
      )}
      <FinanceCatalogSubscriptions key={plan?.id ?? application.id} applicationId={application.id} planId={plan?.id} />
    </FinanceDrawer>
  )
}
