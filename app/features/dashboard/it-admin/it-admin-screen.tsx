import type { ItAdminTabKey } from './enums'
import { ItOverviewView } from './overview/views/it-overview-view'
import { ItProvisioningView } from './provisioning/views/it-provisioning-view'
import { ItDeptCatalogView } from './dept-catalog/views/it-dept-catalog-view'
import { ItOffboardingView } from './offboarding/views/it-offboarding-view'
import { ItSaasIssuesView } from './saas-issues/views/it-saas-issues-view'
import { ItShadowItView } from './shadow-it/views/it-shadow-it-view'
import { ItUnavailableView } from './shared/components/it-unavailable-view'

export function ItAdminScreen({
  tab,
  itemId,
  onSelectTab
}: {
  tab: ItAdminTabKey
  itemId?: string
  onSelectTab: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}) {
  switch (tab) {
    case 'overview':
      return <ItOverviewView onSelectTab={onSelectTab} />
    case 'provisioning':
      return <ItProvisioningView key={itemId ?? tab} initialTaskId={itemId} onSelectTab={onSelectTab} />
    case 'dept-catalog':
      return <ItDeptCatalogView onSelectTab={onSelectTab} />
    case 'offboarding':
      return <ItOffboardingView key={itemId ?? tab} initialCaseId={itemId} onSelectTab={onSelectTab} />
    case 'saas-issues':
      return <ItSaasIssuesView key={itemId ?? tab} initialIssueId={itemId} />
    case 'shadow-it':
      return <ItShadowItView key={itemId ?? tab} initialRequestId={itemId} onSelectTab={onSelectTab} />
    default:
      return <ItUnavailableView tab={tab} />
  }
}
