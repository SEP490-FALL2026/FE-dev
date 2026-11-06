import { ArrowUpRight, CalendarRange, FileInput, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBudgetProposalList } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { useBudgetVersionList } from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import type { FinanceTabKey } from '../../enums'
import { financeNavItems } from '../../finance-nav'
import { FinanceQueryState, FinanceSection } from '../../shared/components/finance-ui'

const shortcutTabs: readonly FinanceTabKey[] = ['cost-centers', 'vendor-tax', 'saas-cost']

export function OverviewWorkQueue({ onSelectTab }: { onSelectTab: (tab: FinanceTabKey) => void }) {
  const { t: translate } = useTranslation('finance')
  const proposals = useBudgetProposalList({ state: 'SUBMITTED', page: 1, pageSize: 1 })
  const versions = useBudgetVersionList({ state: 'DRAFT', page: 1, pageSize: 1 })
  const cards: ReadonlyArray<{
    label: 'proposals' | 'versions'
    icon: LucideIcon
    query: typeof proposals | typeof versions
    tab: FinanceTabKey
  }> = [
    { label: 'proposals', icon: FileInput, query: proposals, tab: 'annual-proposals' },
    { label: 'versions', icon: CalendarRange, query: versions, tab: 'budget-negotiation' }
  ]
  return (
    <FinanceSection title={translate('overviewHint')}>
      <div className='grid gap-4 sm:grid-cols-2'>
        {cards.map((card) => {
          const Icon = card.icon
          const count = card.query.data?.data?.pagination.totalItems ?? 0
          return (
            <section
              key={card.tab}
              aria-label={translate(card.label)}
              className='rounded-lg border border-border/70 bg-surface p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-150 hover:border-primary/40 hover:shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_4px_12px_-4px_rgba(0,0,0,0.08)]'
            >
              <FinanceQueryState query={card.query}>
                <button
                  type='button'
                  onClick={() => onSelectTab(card.tab)}
                  className='group -m-1 flex w-[calc(100%+0.5rem)] flex-col gap-4 rounded-md p-1 text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none active:bg-primary-soft/60'
                >
                  <span className='flex w-full items-center justify-between gap-3'>
                    <span className='grid size-9 place-items-center rounded-md bg-primary-soft text-primary-ink'>
                      <Icon aria-hidden className='size-4' strokeWidth={1.5} />
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      strokeWidth={1.5}
                      className='size-4 text-muted-foreground transition-colors duration-150 group-hover:text-primary'
                    />
                  </span>
                  <span className='space-y-1'>
                    <span className='block font-mono text-3xl leading-none font-semibold tracking-tight tabular-nums'>
                      {count}
                    </span>
                    <span className='block text-sm text-muted-foreground transition-colors duration-150 group-hover:text-foreground'>
                      {translate(card.label)}
                    </span>
                  </span>
                </button>
              </FinanceQueryState>
            </section>
          )
        })}
      </div>
    </FinanceSection>
  )
}

export function OverviewShortcuts({ onSelectTab }: { onSelectTab: (tab: FinanceTabKey) => void }) {
  const { t: translate } = useTranslation('finance')
  const shortcuts = financeNavItems.filter((tab) => shortcutTabs.includes(tab.key))
  return (
    <FinanceSection title={translate('shortcuts')}>
      <ul className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
        {shortcuts.map((tab) => {
          const Icon = tab.icon
          return (
            <li key={tab.key}>
              <button
                type='button'
                onClick={() => onSelectTab(tab.key)}
                className='flex min-h-12 w-full items-center gap-3 rounded-lg border border-border/70 bg-surface px-4 text-left text-sm font-medium transition-colors duration-150 hover:border-primary/40 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none active:border-primary/50 active:bg-primary-soft active:text-primary-ink'
              >
                <Icon aria-hidden className='size-4 shrink-0 text-muted-foreground' strokeWidth={1.5} />
                <span className='truncate'>{translate(tab.translationKey)}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </FinanceSection>
  )
}
