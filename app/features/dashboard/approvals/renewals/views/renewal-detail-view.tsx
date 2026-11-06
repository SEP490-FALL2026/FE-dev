import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionRenewalGet } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-get'
import type { ApprovalTabKey } from '../../enums'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsButton, ApprovalsEmpty, ApprovalsPage } from '../../shared/components/approvals-ui'
import { RenewalDecisionRecord } from '../components/renewal-decision-record'
import { RenewalOverview } from '../components/renewal-overview'
import { renewalFilterParams, useRenewalFilters } from '../hooks/use-renewal-filters'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Full-page detail of one renewal case at ?tab=renewal&id=<renewalId>. */
export function RenewalDetailView({
  renewalId,
  onSelectTab
}: {
  renewalId: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('approvalsRenewal')
  const filters = useRenewalFilters()
  const validId = UUID_PATTERN.test(renewalId)
  const query = useSubscriptionRenewalGet(renewalId, { query: { enabled: validId } })
  const renewal = query.data?.data?.renewal

  const backButton = (
    <ApprovalsButton onClick={() => onSelectTab('renewal', renewalFilterParams(filters))}>
      <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
      {translate('back')}
    </ApprovalsButton>
  )

  return (
    <ApprovalsPage
      title={renewal?.subscription.applicationName ?? translate('detailTitle')}
      description={renewal?.subscription.planName}
      actions={backButton}
    >
      {!validId ? (
        <ApprovalsEmpty message={translate('invalidId')} />
      ) : (
        <ApprovalsQueryState query={query}>
          {renewal ? (
            <div className='space-y-6'>
              <RenewalOverview renewal={renewal} />
              <p className='text-sm text-muted-foreground'>{translate('readOnly')}</p>
              <RenewalDecisionRecord renewal={renewal} />
            </div>
          ) : (
            <ApprovalsEmpty />
          )}
        </ApprovalsQueryState>
      )}
    </ApprovalsPage>
  )
}
