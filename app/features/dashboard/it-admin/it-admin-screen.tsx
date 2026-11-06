import type { ItAdminTabKey } from './enums'
import './it-admin.css'
import { useSearchParams } from 'react-router'
import { ItRenewalsView } from './renewals/views/it-renewals-view'
import { ItPurchaseDocumentsView } from './purchases/views/it-purchase-documents-view'
import { ItTransfersView } from './transfers/views/it-transfers-view'
import { ItOverviewView } from './overview/views/it-overview-view'
import { ItProvisioningView } from './provisioning/views/it-provisioning-view'
import { ItDeptCatalogView } from './dept-catalog/views/it-dept-catalog-view'
import { ItOffboardingView } from './offboarding/views/it-offboarding-view'
import { ItSaasIssuesView } from './saas-issues/views/it-saas-issues-view'
import { ItShadowItView } from './shadow-it/views/it-shadow-it-view'
import { ItUnavailableView } from './shared/components/it-unavailable-view'
import { ItDevicesView } from './device-collectors/views/it-devices-view'
import { TaskScope } from './provisioning/enums/task-scope'

export function ItAdminScreen({
  tab,
  itemId,
  onSelectTab
}: {
  tab: ItAdminTabKey
  itemId?: string
  onSelectTab: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}) {
  return (
    <div className='it-workspace'>
      <ItAdminContent tab={tab} itemId={itemId} onSelectTab={onSelectTab} />
    </div>
  )
}

function ItAdminContent({
  tab,
  itemId,
  onSelectTab
}: {
  tab: ItAdminTabKey
  itemId?: string
  onSelectTab: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}) {
  const [params] = useSearchParams()
  switch (tab) {
    case 'overview':
      return <ItOverviewView onSelectTab={onSelectTab} />
    case 'provisioning':
      return (
        <ItProvisioningView
          key={itemId ?? tab}
          initialTaskId={itemId}
          initialScope={params.get('scope') === 'ALL' ? TaskScope.ALL : TaskScope.MINE}
          initialQueue={
            params.get('queue') === 'grants' ? 'grants' : params.get('queue') === 'expiry' ? 'expiry' : 'tasks'
          }
          onSelectTab={onSelectTab}
        />
      )
    case 'dept-catalog':
      return (
        <ItDeptCatalogView
          onSelectTab={onSelectTab}
          initialView={params.get('view') === 'terms' ? 'terms' : 'applications'}
        />
      )
    case 'offboarding':
      return (
        <ItOffboardingView
          key={itemId ?? tab}
          initialCaseId={itemId}
          initialState={params.get('state') === 'HANDING_OVER' ? 'HANDING_OVER' : undefined}
          onSelectTab={onSelectTab}
        />
      )
    case 'saas-issues':
      return (
        <ItSaasIssuesView
          key={itemId ?? tab}
          initialIssueId={itemId}
          initialScope={params.get('scope') === 'all' ? 'all' : 'assigned'}
        />
      )
    case 'renewals':
      return (
        <ItRenewalsView
          key={itemId ?? tab}
          initialId={itemId}
          initialView={params.get('view') === 'subscriptions' ? 'subscriptions' : 'cases'}
        />
      )
    case 'purchase-documents':
      return <ItPurchaseDocumentsView />
    case 'transfers':
      return <ItTransfersView key={itemId ?? tab} initialId={itemId} />
    case 'shadow-it':
      return <ItShadowItView key={itemId ?? tab} initialRequestId={itemId} onSelectTab={onSelectTab} />
    case 'device-collectors':
      return <ItDevicesView key={itemId ?? tab} initialId={itemId} />
    default:
      return <ItUnavailableView tab={tab} />
  }
}
