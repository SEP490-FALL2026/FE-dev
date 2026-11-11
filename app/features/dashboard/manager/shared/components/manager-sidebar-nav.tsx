import { useTranslation } from 'react-i18next'
import { managerNavItems, type ManagerTabKey } from '../../manager-nav'

const groups = [
  { label: 'overview', tabs: ['overview'] },
  { label: 'work', tabs: ['team-requests', 'weekly-batch', 'subscription-renewals'] },
  { label: 'department', tabs: ['my-team', 'team-software', 'create-employee-request', 'annual-budget'] }
] as const

export function ManagerSidebarNav({
  activeParent,
  onSelectTab
}: {
  activeParent: string
  onSelectTab: (tab: ManagerTabKey) => void
}) {
  const { t } = useTranslation('manager')
  return (
    <div className='space-y-5'>
      {groups.map((group) => (
        <section key={group.label} aria-label={t(`requestUx.navigation.${group.label}`)} className='space-y-2'>
          <h2 className='px-3.5 text-xs font-medium text-muted-foreground'>
            {t(`requestUx.navigation.${group.label}`)}
          </h2>
          <ul className='space-y-1'>
            {group.tabs.map((key) => {
              const item = managerNavItems.find((item) => item.key === key)!
              const Icon = item.icon
              const active = activeParent === item.key
              return (
                <li key={item.key}>
                  <button
                    type='button'
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onSelectTab(item.key)}
                    className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-surface hover:text-foreground'}`}
                  >
                    <Icon aria-hidden className='size-[1.125rem] shrink-0' strokeWidth={1.5} />
                    <span className='min-w-0 truncate' title={t(item.liveLabel)}>
                      {t(item.liveLabel)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
