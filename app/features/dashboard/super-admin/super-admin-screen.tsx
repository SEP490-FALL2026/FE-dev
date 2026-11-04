import type { SuperAdminSelectTab, SuperAdminTabKey } from './super-admin-nav'
import { useSearchParams } from 'react-router'
import { SuperAdminOverviewView } from './overview/views/super-admin-overview-view'
import { SuperAdminAccountsView } from './accounts/views/super-admin-accounts-view'
import { SuperAdminDepartmentsView } from './departments/views/super-admin-departments-view'
import { SuperAdminPersonnelView } from './personnel/views/super-admin-personnel-view'
import { SuperAdminTransferView } from './transfer/views/super-admin-transfer-view'
import { SuperAdminSettingsView } from './settings/views/super-admin-settings-view'
import { SuperAdminRemindersView } from './reminders/views/super-admin-reminders-view'
import { SuperAdminOperationsView } from './operations/views/super-admin-operations-view'
import { SuperAdminAuditView } from './audit/views/super-admin-audit-view'
import './super-admin.css'

export function SuperAdminScreen({ tab, onSelectTab }: { tab: SuperAdminTabKey; onSelectTab: SuperAdminSelectTab }) {
  return (
    <div className='admin-workspace mx-auto w-full max-w-[1600px]'>
      <SuperAdminContent tab={tab} onSelectTab={onSelectTab} />
    </div>
  )
}

function SuperAdminContent({ tab, onSelectTab }: { tab: SuperAdminTabKey; onSelectTab: SuperAdminSelectTab }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const accountId = searchParams.get('id') ?? undefined
  const accountSection = searchParams.get('section') === 'responsibilities' ? 'responsibilities' : 'accounts'
  const invite = searchParams.get('action') === 'invite'
  switch (tab) {
    case 'accounts':
      return (
        <SuperAdminAccountsView
          key={`${accountId ?? 'list'}:${accountSection}:${invite}`}
          accountId={accountId}
          section={accountSection}
          invite={invite}
          onCloseInvite={() => {
            setSearchParams(
              (previous) => {
                const next = new URLSearchParams(previous)
                next.delete('action')
                return next
              },
              { replace: true }
            )
          }}
          onCloseAccount={() => {
            setSearchParams(
              (previous) => {
                const next = new URLSearchParams(previous)
                next.delete('id')
                return next
              },
              { replace: true }
            )
          }}
        />
      )
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
