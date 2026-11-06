import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { financeAreaOf, financeAreas, type FinanceAreaKey, type FinanceTabKey } from '../../finance-nav'

export function FinanceSidebarNav({
  activeTab,
  onSelectTab
}: {
  activeTab: FinanceTabKey
  onSelectTab: (tab: FinanceTabKey) => void
}) {
  const { t: translate } = useTranslation('finance')
  const [expanded, setExpanded] = useState<Partial<Record<FinanceAreaKey, boolean>>>({})
  const currentArea = financeAreaOf(activeTab).key
  const activeClass = 'bg-primary text-primary-foreground shadow-[0_10px_25px_var(--theme-primary-soft)]'
  const idleClass =
    'text-muted-foreground hover:bg-surface-subtle hover:text-foreground active:bg-primary-soft active:text-primary-ink'
  const buttonClass =
    'flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none'
  return (
    <ul className='space-y-1'>
      {financeAreas.map((area) => {
        const Icon = area.icon
        const open = expanded[area.key] ?? area.key === currentArea
        if (area.tabs.length === 1)
          return (
            <li key={area.key}>
              <button
                type='button'
                aria-current={activeTab === area.tabs[0].key ? 'page' : undefined}
                className={`${buttonClass} ${activeTab === area.tabs[0].key ? activeClass : idleClass}`}
                onClick={() => onSelectTab(area.tabs[0].key)}
              >
                <Icon aria-hidden className='size-4 shrink-0' strokeWidth={1.5} />
                {translate(area.tabs[0].translationKey)}
              </button>
            </li>
          )
        return (
          <li key={area.key}>
            <button
              type='button'
              className={`${buttonClass} ${area.key === currentArea ? 'text-foreground hover:bg-surface-subtle active:bg-primary-soft' : idleClass}`}
              aria-expanded={open}
              onClick={() => setExpanded((current) => ({ ...current, [area.key]: !open }))}
            >
              <Icon
                aria-hidden
                className={`size-4 shrink-0 ${area.key === currentArea ? 'text-primary' : ''}`}
                strokeWidth={1.5}
              />
              <span className='flex-1'>{translate(`areas.${area.key}`)}</span>
              <ChevronDown
                aria-hidden
                strokeWidth={1.5}
                className={`size-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
              />
            </button>
            {open && (
              <ul className='mt-1 ml-5 space-y-1 border-l border-border/70 pl-3'>
                {area.tabs.map((tab) => {
                  const TabIcon = tab.icon
                  return (
                    <li key={tab.key}>
                      <button
                        type='button'
                        aria-current={activeTab === tab.key ? 'page' : undefined}
                        className={`${buttonClass} ${activeTab === tab.key ? activeClass : idleClass}`}
                        onClick={() => onSelectTab(tab.key)}
                      >
                        <TabIcon aria-hidden className='size-4 shrink-0' strokeWidth={1.5} />
                        <span className='truncate'>{translate(tab.translationKey)}</span>
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
