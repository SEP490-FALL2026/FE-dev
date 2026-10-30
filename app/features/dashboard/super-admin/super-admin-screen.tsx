import type { SuperAdminSelectTab, SuperAdminTabKey } from './super-admin-nav'
import { SuperAdminOverviewView } from './overview/views/super-admin-overview-view'
import { SuperAdminAccountsView } from './accounts/views/super-admin-accounts-view'
import { SuperAdminDepartmentsView } from './departments/views/super-admin-departments-view'
import { SuperAdminPersonnelView } from './personnel/views/super-admin-personnel-view'
import { SuperAdminTransferView } from './transfer/views/super-admin-transfer-view'
import { SuperAdminSettingsView } from './settings/views/super-admin-settings-view'
import { SuperAdminRemindersView } from './reminders/views/super-admin-reminders-view'
import { SuperAdminOperationsView } from './operations/views/super-admin-operations-view'
import { SuperAdminAuditView } from './audit/views/super-admin-audit-view'

export function SuperAdminScreen({ tab, onSelectTab }: { tab: SuperAdminTabKey; onSelectTab: SuperAdminSelectTab }) {
  switch (tab) {
    case 'accounts':
      return <SuperAdminAccountsView />
    case 'departments':
      return <SuperAdminDepartmentsView />
    case 'personnel':
      return <SuperAdminPersonnelView />
    case 'transfer':
      return <SuperAdminTransferView />
    case 'settings':
      return <SuperAdminSettingsView />
    case 'reminders':
      return <SuperAdminRemindersView />
    case 'operations':
      return <SuperAdminOperationsView />
    case 'audit-trail':
      return <SuperAdminAuditView />
    default:
      return <SuperAdminOverviewView onSelectTab={onSelectTab} />
  }
}
