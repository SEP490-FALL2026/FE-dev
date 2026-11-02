import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { itAdminMenuItems } from '../../it-admin-nav'
import type { ItAdminTabKey } from '../../enums'

export function ItSidebarNav({
  activeTab,
  activeParent,
  openSections,
  onSelectTab,
  toggleSection
}: {
  activeTab: ItAdminTabKey
  activeParent: string
  openSections: Record<string, boolean>
  onSelectTab: (tab: ItAdminTabKey) => void
  toggleSection: (key: string) => void
}) {
  const { t: translate } = useTranslation('itAdmin')
  return (
    <ul className='space-y-1.5'>
      {itAdminMenuItems.map((item) => {
        const Icon = item.icon
        const directTab = item.directTabKey
        if (directTab)
          return (
            <li key={item.key}>
              <button
                type='button'
                aria-current={activeTab === directTab ? 'page' : undefined}
                className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${activeTab === directTab ? 'bg-primary-soft text-primary' : 'text-muted-foreground hover:bg-surface'}`}
                onClick={() => onSelectTab(directTab)}
              >
                <Icon aria-hidden strokeWidth={1.5} className='size-4 shrink-0' />
                {translate(`navigation.${item.translationKey}`)}
              </button>
            </li>
          )
        const expanded = openSections[item.key] ?? false
        return (
          <li key={item.key} className='space-y-1'>
            <button
              type='button'
              aria-expanded={expanded}
              onClick={() => toggleSection(item.key)}
              className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${activeParent === item.key ? 'bg-primary-soft/50 text-primary' : 'text-muted-foreground hover:bg-surface'}`}
            >
              <span className='flex min-w-0 items-center gap-3'>
                <Icon aria-hidden strokeWidth={1.5} className='size-4 shrink-0' />
                <span className='truncate' title={translate(`navigation.${item.translationKey}`)}>
                  {translate(`navigation.${item.translationKey}`)}
                </span>
              </span>
              <ChevronDown
                aria-hidden
                strokeWidth={1.5}
                className={`size-4 shrink-0 ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
            {expanded && (
              <ul className='ml-5 space-y-1 border-l border-border pl-2'>
                {item.children?.map((child) => {
                  const ChildIcon = child.icon
                  return (
                    <li key={child.key}>
                      <button
                        type='button'
                        aria-current={activeTab === child.key ? 'page' : undefined}
                        onClick={() => onSelectTab(child.key)}
                        className={`flex min-h-11 w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium transition-colors ${activeTab === child.key ? 'bg-primary-soft text-primary' : 'text-muted-foreground hover:bg-surface'}`}
                      >
                        <ChildIcon aria-hidden strokeWidth={1.5} className='size-4 shrink-0' />
                        <span className='truncate' title={translate(`navigation.${child.translationKey}`)}>
                          {translate(`navigation.${child.translationKey}`)}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}
