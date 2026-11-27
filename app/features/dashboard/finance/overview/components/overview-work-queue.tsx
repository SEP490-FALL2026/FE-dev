import { ArrowUpRight, CalendarRange, FileCheck2, FileInput, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBudgetProposalList } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { useBudgetVersionList } from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import { usePurchaseInvoiceList } from '~/shared/api/generated/operations/purchase-invoices/purchase-invoice-list'
import { PurchaseInvoiceListState } from '~/shared/api/generated/model/purchase-invoices/purchaseInvoiceListState'
import type { FinanceTabKey } from '../../enums'
import { financeAreas } from '../../finance-nav'
import { FinanceSection } from '../../shared/components/finance-ui'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

const shortcutTabs: readonly FinanceTabKey[] = ['cost-centers', 'saas-cost']

export function OverviewWorkQueue({ onSelectTab }: { onSelectTab: (tab: FinanceTabKey) => void }) {
  const { t: translate } = useTranslation('finance')
  const { formatNumber } = useWorkspaceFormat()
  const invoices = usePurchaseInvoiceList({ state: PurchaseInvoiceListState.SUBMITTED, page: 1, pageSize: 1 })
  const proposals = useBudgetProposalList({ state: 'SUBMITTED', page: 1, pageSize: 1 })
  const versions = useBudgetVersionList({ state: 'DRAFT', page: 1, pageSize: 1 })
  const cards: ReadonlyArray<{
    label: 'proposals' | 'versions' | 'invoicesAwaitingSignature'
    icon: LucideIcon
    query: typeof proposals | typeof versions | typeof invoices
    tab: FinanceTabKey
  }> = [
    { label: 'invoicesAwaitingSignature', icon: FileCheck2, query: invoices, tab: 'purchase-invoices' },
    { label: 'proposals', icon: FileInput, query: proposals, tab: 'annual-proposals' },
    { label: 'versions', icon: CalendarRange, query: versions, tab: 'budget-negotiation' }
  ]
  return (
    <FinanceSection title={translate('overviewHint')}>
      <div className='grid gap-3 lg:grid-cols-3'>
        {cards.map((card) => {
          const Icon = card.icon
          const count = !card.query.isError ? card.query.data?.data?.pagination.totalItems : undefined
          return (
            <button
              type='button'
              key={card.tab}
              aria-busy={card.query.isPending || undefined}
              onClick={() => onSelectTab(card.tab)}
              className='group flex min-w-0 items-start gap-3 rounded-lg border border-border/70 bg-surface p-4 text-left shadow-sm transition-colors duration-150 hover:border-primary/40 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none active:bg-primary-soft'
            >
              <Icon aria-hidden className='mt-0.5 size-5 shrink-0 text-primary-ink' strokeWidth={1.5} />
              <span className='min-w-0 flex-1 space-y-2'>
                <span className='block text-sm font-medium'>{translate(card.label)}</span>
                <span className='block font-mono text-2xl leading-none font-semibold tabular-nums'>
                  {card.query.isPending ? (
                    <>
                      <span aria-hidden className='block h-6 w-12 animate-pulse rounded-md bg-surface-subtle' />
                      <span className='sr-only'>{translate('loading')}</span>
                    </>
                  ) : count === undefined ? (
                    <span className='font-sans text-sm font-normal text-muted-foreground'>
                      {translate('countUnavailable')}
                    </span>
                  ) : (
                    formatNumber(count)
                  )}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                strokeWidth={1.5}
                className='size-4 shrink-0 text-muted-foreground group-hover:text-primary-ink'
              />
            </button>
          )
        })}
      </div>
    </FinanceSection>
  )
}

export function OverviewShortcuts({ onSelectTab }: { onSelectTab: (tab: FinanceTabKey) => void }) {
  const { t: translate } = useTranslation('finance')
  const shortcuts = financeAreas.flatMap((area) => area.tabs).filter((tab) => shortcutTabs.includes(tab.key))
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
