import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  areaBadge,
  areaTabs,
  financeAreaOf,
  financeAreas,
  type FinanceArea,
  type FinanceAreaKey,
  type FinanceTabKey
} from '../../finance-nav'

interface FinanceSidebarNavProps {
  activeTab: FinanceTabKey
  onSelectTab: (tab: FinanceTabKey) => void
}

/**
 * The five Finance areas. An area with one screen is a direct link; the others expand in place to list their
 * screens, like the IT Admin menu. The area holding the open screen starts expanded.
 */
export function FinanceSidebarNav({ activeTab, onSelectTab }: FinanceSidebarNavProps) {
  const activeArea = financeAreaOf(activeTab)
  const [openAreas, setOpenAreas] = useState<Partial<Record<FinanceAreaKey, boolean>>>({})
  const isOpen = (area: FinanceArea) => openAreas[area.key] ?? area.key === activeArea.key

  return (
    <ul className='space-y-1.5'>
      {financeAreas.map((area) =>
        areaTabs(area).length === 1 ? (
          <DirectItem
            area={area}
            isCurrent={activeTab === areaTabs(area)[0].key}
            key={area.key}
            onSelect={() => onSelectTab(areaTabs(area)[0].key)}
          />
        ) : (
          <ExpandableItem
            activeTab={activeTab}
            area={area}
            isOpen={isOpen(area)}
            isParentActive={area.key === activeArea.key}
            key={area.key}
            onSelectTab={onSelectTab}
            onToggle={() => setOpenAreas((current) => ({ ...current, [area.key]: !isOpen(area) }))}
          />
        )
      )}
    </ul>
  )
}

function DirectItem({ area, isCurrent, onSelect }: { area: FinanceArea; isCurrent: boolean; onSelect: () => void }) {
  const { t } = useTranslation('dashboard')
  const Icon = area.icon

  return (
    <li>
      <button
        aria-current={isCurrent ? 'page' : undefined}
        className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${
          isCurrent
            ? 'bg-primary text-primary-foreground shadow-[0_10px_25px_var(--theme-primary-soft)]'
            : 'text-muted-foreground hover:bg-surface hover:text-foreground'
        }`}
        onClick={onSelect}
        type='button'
      >
        <Icon aria-hidden='true' className='size-[1.125rem] shrink-0' />
        {t(`finance.nav.areas.${area.key}`)}
      </button>
    </li>
  )
}

function ExpandableItem({
  activeTab,
  area,
  isOpen,
  isParentActive,
  onSelectTab,
  onToggle
}: {
  activeTab: FinanceTabKey
  area: FinanceArea
  isOpen: boolean
  isParentActive: boolean
  onSelectTab: (tab: FinanceTabKey) => void
  onToggle: () => void
}) {
  const { t } = useTranslation('dashboard')
  const Icon = area.icon
  const badge = areaBadge(area)

  return (
    <li className='space-y-1'>
      <button
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${
          isParentActive
            ? 'border border-primary/20 bg-primary-soft/50 font-bold text-primary'
            : 'text-muted-foreground hover:bg-surface hover:text-foreground'
        }`}
        onClick={onToggle}
        type='button'
      >
        <span className='flex min-w-0 items-center gap-3'>
          <Icon aria-hidden='true' className='size-[1.125rem] shrink-0' />
          <span className='truncate'>{t(`finance.nav.areas.${area.key}`)}</span>
        </span>
        <span className='flex shrink-0 items-center gap-1.5'>
          {badge !== undefined && !isOpen && (
            <span className='inline-flex items-center rounded-md bg-surface-subtle px-1.5 py-0.5 text-[0.65rem] font-bold text-muted-foreground'>
              {badge}
            </span>
          )}
          <ChevronDown
            aria-hidden='true'
            className={`size-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {isOpen && (
        <div className='ml-4 border-l-2 border-border/70 pt-0.5 pl-2.5'>
          <ul className='space-y-1'>
            {area.tabs.map((tab) => {
              const isCurrent = activeTab === tab.key
              const TabIcon = tab.icon

              return (
                <li key={tab.key}>
                  <button
                    aria-current={isCurrent ? 'page' : undefined}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${
                      isCurrent
                        ? 'bg-primary font-bold text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                    }`}
                    onClick={() => onSelectTab(tab.key)}
                    type='button'
                  >
                    <span className='flex min-w-0 items-center gap-2'>
                      <TabIcon
                        aria-hidden='true'
                        className={`size-3.5 shrink-0 ${isCurrent ? 'opacity-100' : 'opacity-80'}`}
                      />
                      <span className='truncate'>{t(`finance.nav.${tab.translationKey}`)}</span>
                    </span>
                    {tab.badge !== undefined && (
                      <span
                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[0.65rem] font-bold ${
                          isCurrent ? 'bg-white/20 text-white' : 'bg-surface-subtle text-muted-foreground'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </li>
  )
}
