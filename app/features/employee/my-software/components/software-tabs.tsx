import { useTranslation } from 'react-i18next'

import type { SoftwareTabType } from '../my-software.types'

interface SoftwareTabsProps {
  activeTab: SoftwareTabType
  onTabChange: (tab: SoftwareTabType) => void
  counts: Record<SoftwareTabType, number>
}

interface TabConfig {
  key: SoftwareTabType
  labelKey: string
}

const tabs: TabConfig[] = [
  { key: 'all', labelKey: 'mySoftware.tabs.all' },
  { key: 'active', labelKey: 'mySoftware.tabs.active' },
  { key: 'expiringSoon', labelKey: 'mySoftware.tabs.expiringSoon' },
  { key: 'pending', labelKey: 'mySoftware.tabs.pending' },
  { key: 'returned', labelKey: 'mySoftware.tabs.returned' }
]

export function SoftwareTabs({ activeTab, onTabChange, counts }: SoftwareTabsProps) {
  const { t } = useTranslation()

  return (
    <div className='flex gap-6 overflow-x-auto border-b border-neutral-200'>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key
        const count = counts[tab.key] ?? 0

        return (
          <button
            className={`flex items-center gap-2 whitespace-nowrap pb-3 text-sm font-medium transition-colors ${
              isActive
                ? 'border-b-2 border-brand-500 text-brand-500'
                : 'border-b-2 border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            type='button'
          >
            {t(tab.labelKey)}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                isActive ? 'bg-brand-100 text-brand-600' : 'border border-neutral-200 bg-white text-neutral-500'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
