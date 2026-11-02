import { useTranslation } from 'react-i18next'
import { useBudgetProposalList } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import { useBudgetVersionList } from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import { useFinanceReviewList } from '~/shared/api/generated/operations/finance-reviews/finance-review-list'
import { useBudgetInformationList } from '~/shared/api/generated/operations/budget-information/budget-information-list'
import type { FinanceTabKey } from '../../enums'
import { FinancePage, FinanceQueryState } from '../../shared/components/finance-ui'

export function FinanceOverviewView({ onSelectTab }: { onSelectTab: (tab: FinanceTabKey) => void }) {
  const { t: translate } = useTranslation('finance')
  const proposals = useBudgetProposalList({ state: 'SUBMITTED', page: 1, pageSize: 1 })
  const versions = useBudgetVersionList({ state: 'DRAFT', page: 1, pageSize: 1 })
  const reviews = useFinanceReviewList({ state: 'PENDING', page: 1, pageSize: 1 })
  const questions = useBudgetInformationList({ state: 'OPEN', page: 1, pageSize: 1 })
  const cards = [
    { label: 'proposals', query: proposals, tab: 'annual-proposals' },
    { label: 'versions', query: versions, tab: 'budget-negotiation' },
    { label: 'reviews', query: reviews, tab: 'budget-check' },
    { label: 'questions', query: questions, tab: 'budget-questions' }
  ] as const
  return (
    <FinancePage title={translate('overview')}>
      <h2 className='text-sm font-medium text-muted-foreground [text-wrap:balance]'>{translate('overviewHint')}</h2>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {cards.map((card) => (
          <section key={card.tab} className='rounded-lg border border-border bg-surface p-4'>
            <h3 className='mb-3 text-sm font-medium [text-wrap:balance]'>{translate(card.label)}</h3>
            <FinanceQueryState query={card.query}>
              <button
                type='button'
                onClick={() => onSelectTab(card.tab)}
                className='min-h-11 w-full text-left text-3xl font-semibold text-primary tabular-nums'
              >
                {card.query.data?.data?.pagination.totalItems ?? 0}
              </button>
            </FinanceQueryState>
          </section>
        ))}
      </div>
    </FinancePage>
  )
}
