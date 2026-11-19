import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { PlanListProvisioningType } from '../enums/provisioning-type'

import type { ApplicationPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/applications'
import { usePlanList } from '~/shared/api/generated/operations/plans'
import { useApplicationGet } from '~/shared/api/generated/operations/applications'
import {
  FinanceButton,
  FinanceDrawer,
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { FinanceCatalogSubscriptions } from './finance-catalog-subscriptions'
import { CatalogEnumFilter } from './catalog-enum-filter'
import { CatalogPlanDetail } from './catalog-plan-detail'

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
  const [openPlan, setOpenPlan] = useState<{ id: string; name: string } | null>(null)
  const detail = useApplicationGet(application.id).data?.data
  const plans = usePlanList({
    applicationId: application.id,
    provisioningType: provisioningType || undefined,
    page,
    pageSize: 10
  })
  const enumLabel = (value?: string | null) =>
    value ? translate(`enum.${value}`, { defaultValue: translate('unavailable') }) : '—'
  return (
    <FinanceDrawer title={application.name} onClose={onClose}>
      <FinanceSection title={translate('overview')}>
        <FinanceStatGrid>
          <FinanceStat
            label={translate('kind')}
            value={<span className='font-sans'>{enumLabel(application.kind)}</span>}
          />
          <FinanceStat
            label={translate('vendor')}
            value={<span className='font-sans'>{application.vendor?.name ?? '—'}</span>}
          />
          <FinanceStat label={translate('status')} value={<FinanceStatus value={application.status} />} />
          {detail && (
            <>
              <FinanceStat
                label={translate('catalogDetail.functionalGroup')}
                value={<span className='font-sans'>{detail.functionalGroup?.name ?? translate('unavailable')}</span>}
              />
              <FinanceStat
                label={translate('catalogDetail.responsibleItAdmin')}
                value={
                  <span className='font-sans'>{detail.responsibleItAdmin?.fullName ?? translate('unavailable')}</span>
                }
              />
              <FinanceStat
                label={translate('catalogDetail.dataSensitivity')}
                value={<span className='font-sans'>{enumLabel(detail.dataSensitivity)}</span>}
              />
            </>
          )}
        </FinanceStatGrid>
      </FinanceSection>
      <FinanceSection title={translate('plans')}>
        <CatalogEnumFilter
          label={translate('provisioningType')}
          options={PlanListProvisioningType}
          value={provisioningType}
          className='max-w-xs'
          onChange={(value) => {
            setProvisioningType(value)
            setPage(1)
          }}
        />
        <FinanceQueryState query={plans}>
          <FinanceTable
            items={plans.data?.data?.items ?? []}
            rowKey={(item) => item.id}
            onOpen={(item) => setOpenPlan({ id: item.id, name: item.name })}
            columns={[
              { key: 'name', label: translate('plan'), render: (item) => item.name },
              {
                key: 'provisioning',
                label: translate('provisioningType'),
                render: (item) => enumLabel(item.provisioningType)
              },
              { key: 'pricing', label: translate('pricingModel'), render: (item) => enumLabel(item.pricingModel) }
            ]}
          />
          <FinancePagination pagination={plans.data?.data?.pagination} onPageChange={setPage} />
        </FinanceQueryState>
      </FinanceSection>
      {plan && (
        <div className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary-soft px-4 py-2 text-sm text-primary-ink'>
          <span className='min-w-0 truncate'>{translate('filteredByPlan', { name: plan.name })}</span>
          <FinanceButton variant='ghost' onClick={() => setPlan(null)}>
            <X aria-hidden className='size-4' strokeWidth={1.5} />
            {translate('clearPlanFilter')}
          </FinanceButton>
        </div>
      )}
      {openPlan && (
        <CatalogPlanDetail
          planId={openPlan.id}
          name={openPlan.name}
          onShowSubscriptions={() => {
            setPlan(openPlan)
            setOpenPlan(null)
          }}
          onClose={() => setOpenPlan(null)}
        />
      )}
      <FinanceCatalogSubscriptions key={plan?.id ?? application.id} applicationId={application.id} planId={plan?.id} />
    </FinanceDrawer>
  )
}
