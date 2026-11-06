import { useTranslation } from 'react-i18next'
import { financeNavItems, financeNavTab, type FinanceTabKey } from '../../finance-nav'

const buttonClass =
  'flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none'
const activeClass = 'bg-primary text-primary-foreground shadow-[0_10px_25px_var(--theme-primary-soft)]'
const idleClass =
  'text-muted-foreground hover:bg-surface-subtle hover:text-foreground active:bg-primary-soft active:text-primary-ink'

export function FinanceSidebarNav({
  activeTab,
  onSelectTab
}: {
  activeTab: FinanceTabKey
  onSelectTab: (tab: FinanceTabKey) => void
}) {
  const { t: translate } = useTranslation('finance')
  const current = financeNavTab(activeTab)
  return (
    <ul className='space-y-1'>
      {financeNavItems.map((item) => {
        const Icon = item.icon
        const active = current === item.key
        return (
          <li key={item.key}>
            <button
              type='button'
              aria-current={active ? 'page' : undefined}
              className={`${buttonClass} ${active ? activeClass : idleClass}`}
              onClick={() => onSelectTab(item.key)}
            >
              <Icon aria-hidden className='size-4 shrink-0' strokeWidth={1.5} />
              <span className='truncate'>{translate(item.translationKey)}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
