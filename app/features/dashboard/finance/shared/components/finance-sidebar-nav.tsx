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
  const buttonClass =
    'flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors duration-150 hover:bg-surface-subtle'
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
                className={`${buttonClass} ${activeTab === area.tabs[0].key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
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
              className={`${buttonClass} text-muted-foreground`}
              aria-expanded={open}
              onClick={() => setExpanded((current) => ({ ...current, [area.key]: !open }))}
            >
              <Icon aria-hidden className='size-4 shrink-0' strokeWidth={1.5} />
              <span className='flex-1'>{translate(`areas.${area.key}`)}</span>
              <ChevronDown
                aria-hidden
                strokeWidth={1.5}
                className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>
            {open && (
              <ul className='ml-5 space-y-1 border-l border-border pl-3'>
                {area.tabs.map((tab) => {
                  const TabIcon = tab.icon
                  return (
                    <li key={tab.key}>
                      <button
                        type='button'
                        aria-current={activeTab === tab.key ? 'page' : undefined}
                        className={`${buttonClass} ${activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
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
