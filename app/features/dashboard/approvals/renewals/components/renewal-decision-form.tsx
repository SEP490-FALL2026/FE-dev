import { useTranslation } from 'react-i18next'
import type { SubscriptionRenewalResponseDtoDataRenewal } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalResponseDtoDataRenewal'

/** Confirmation now belongs to the owner department head, not the spending approver. */
export function RenewalDecisionForm({ renewal }: { renewal: SubscriptionRenewalResponseDtoDataRenewal }) {
  const { t: translate } = useTranslation('approvalsRenewal')
  return (
    <p role='status' data-renewal-id={renewal.id} className='text-sm text-muted-foreground'>
      {translate('errors.notDecider')}
    </p>
  )
}
