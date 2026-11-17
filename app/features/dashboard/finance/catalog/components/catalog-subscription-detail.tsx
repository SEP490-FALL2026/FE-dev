import { useTranslation } from 'react-i18next'
import { useSubscriptionGet } from '~/shared/api/generated/operations/subscriptions'
import {
  FinanceDrawer,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { formatDay } from '../../shared/finance-date'
import { formatMoney } from '../../shared/finance-money'
import { SubscriptionAdjustmentPanel } from '../../subscription-renewals/components/subscription-adjustment-panel'
import { useOwnerLabel } from '../../subscription-renewals/hooks/use-owner-label'
import { CatalogFacts } from './catalog-facts'

/**
 * One subscription, read only. Finance sees the money side (price, quantity, period, tax estimate) and the seats; the
 * vendor admins, owner email and admin note stay with IT Admin. A shared-pool term subscription also shows its
 * adjustment point.
 */
export function CatalogSubscriptionDetail({
  subscriptionId,
  planName,
  onClose
}: {
  subscriptionId: string
  planName: string
  onClose: () => void
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const query = useSubscriptionGet(subscriptionId)
  const ownerLabel = useOwnerLabel()
  const subscription = query.data?.data
  const none = translate('unavailable')
  const day = (value: string | null | undefined) => formatDay(value, i18n.language)
  const yesNo = (value: boolean) => translate(value ? 'yes' : 'no')
  const money = (value: { amount: string; currency: string } | null | undefined) =>
    value ? formatMoney(value, i18n.language) : translate('noPrice')
  const showsAdjustment = subscription?.kind === 'TERM' && subscription.status === 'ACTIVE'

  return (
    <FinanceDrawer
      title={translate('catalogDetail.subscriptionTitle', { plan: subscription?.planName ?? planName })}
      onClose={onClose}
    >
      <FinanceQueryState query={query}>
        {subscription && (
          <>
            <FinanceStatGrid>
              <FinanceStat label={translate('status')} value={<FinanceStatus value={subscription.status} />} />
              <FinanceStat label={translate('unitPrice')} value={money(subscription.unitPrice)} />
              <FinanceStat label={translate('purchasedQuantity')} value={subscription.purchasedQuantity ?? none} />
            </FinanceStatGrid>
            {subscription.missing.length > 0 && (
              <p role='status' className='text-sm text-warning-ink'>
                {translate('catalogDetail.missing', {
                  fields: subscription.missing
                    .map((field) => translate(`enum.${field}`, { defaultValue: field }))
                    .join(', ')
                })}
              </p>
            )}
            <FinanceSection title={translate('catalogDetail.periodTitle')}>
              <CatalogFacts
                rows={[
                  [translate('renewals.owner'), ownerLabel(subscription.ownerDepartmentId)],
                  [translate('vendor'), subscription.vendor?.name ?? none],
                  [translate('kind'), translate(`enum.${subscription.kind}`, { defaultValue: subscription.kind })],
                  [
                    translate('billingCycle'),
                    subscription.billingCycle
                      ? translate(`enum.${subscription.billingCycle}`, { defaultValue: subscription.billingCycle })
                      : none
                  ],
                  [translate('renewals.startDate'), day(subscription.startDate)],
                  [translate('renewals.endDate'), day(subscription.endDate)],
                  [translate('renewalDate'), day(subscription.renewalDate)],
                  [translate('autoRenew'), yesNo(subscription.autoRenew)],
                  [translate('catalogDetail.noticeDeadline'), day(subscription.noticeDeadline?.value)],
                  [translate('renewals.midTermReduction'), yesNo(subscription.allowsMidTermReduction)],
                  [translate('catalogDetail.vendorMinimumSeats'), subscription.vendorMinimumSeats ?? none],
                  [translate('originalPrice'), subscription.originalPrice ? money(subscription.originalPrice) : none],
                  [translate('catalogDetail.responsibleItAdmin'), subscription.responsibleItAdmin?.fullName ?? none]
                ]}
              />
            </FinanceSection>
            {subscription.seats && (
              <FinanceSection title={translate('catalogDetail.seatsTitle')}>
                <FinanceStatGrid columns={4}>
                  <FinanceStat
                    label={translate('catalogDetail.seatsPurchased')}
                    value={subscription.seats.purchased ?? none}
                  />
                  <FinanceStat label={translate('catalogDetail.seatsAssigned')} value={subscription.seats.assigned} />
                  <FinanceStat label={translate('catalogDetail.seatsFree')} value={subscription.seats.free ?? none} />
                  <FinanceStat
                    label={translate('catalogDetail.seatsInRevocation')}
                    value={subscription.seats.inRevocation}
                  />
                </FinanceStatGrid>
              </FinanceSection>
            )}
            {subscription.taxEstimate && (
              <FinanceSection title={translate('estimate')}>
                <FinanceStatGrid columns={4}>
                  <FinanceStat
                    label={translate('estimatedCost')}
                    value={money({ amount: subscription.taxEstimate.estimatedCost, currency: 'VND' })}
                  />
                  <FinanceStat
                    label={translate('taxAmount')}
                    value={money({ amount: subscription.taxEstimate.taxAmount, currency: 'VND' })}
                  />
                  <FinanceStat
                    label={translate('deductibleTaxAmount')}
                    value={money({ amount: subscription.taxEstimate.deductibleTaxAmount, currency: 'VND' })}
                  />
                  <FinanceStat
                    label={translate('nonDeductibleTaxAmount')}
                    value={money({ amount: subscription.taxEstimate.nonDeductibleTaxAmount, currency: 'VND' })}
                  />
                </FinanceStatGrid>
                <p className='text-xs text-muted-foreground'>{translate('estimateHint')}</p>
              </FinanceSection>
            )}
            {showsAdjustment && <SubscriptionAdjustmentPanel subscriptionId={subscription.id} />}
          </>
        )}
      </FinanceQueryState>
    </FinanceDrawer>
  )
}
