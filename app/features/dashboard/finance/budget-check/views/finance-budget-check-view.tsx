import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFinanceReviewList } from '~/shared/api/generated/operations/finance-reviews/finance-review-list'
import type { FinanceTabKey } from '../../enums'
import {
  FinanceButton,
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSearch,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceList } from '../../shared/hooks/use-finance-list'
import { formatMoney } from '../../shared/finance-money'
import { ReviewQueueState } from '../enums/review-queue-state'
import { FinanceReviewDetail } from '../components/finance-review-detail'

export function FinanceBudgetCheckView({
  itemId,
  onSelectTab
}: {
  itemId?: string
  onSelectTab?: (tab: FinanceTabKey, extra?: Record<string, string>) => void
}) {
  const { t: translate, i18n } = useTranslation('financeSpend')
  const list = useFinanceList()
  const [state, setState] = useState<ReviewQueueState | ''>('')
  const [selected, setSelected] = useState<string>()
  const [lookup, setLookup] = useState('')
  const query = useFinanceReviewList({ page: list.page, pageSize: list.pageSize, ...(state ? { state } : {}) })
  const open = (id: string) => {
    setSelected(id)
    onSelectTab?.('budget-check', { id })
  }
  const activeId = onSelectTab ? itemId : (selected ?? itemId)
  const validId = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(lookup.trim())
  return (
    <FinancePage title={translate('review.title')}>
      <div className='flex flex-wrap items-end gap-3'>
        <FinanceField label={translate('common.state')}>
          <select
            aria-label={translate('common.state')}
            className={financeInputClass}
            value={state}
            onChange={(event) => {
              setState(event.target.value as ReviewQueueState | '')
              list.setPage(1)
            }}
          >
            <option value=''>{translate('common.all')}</option>
            {Object.values(ReviewQueueState).map((value) => (
              <option key={value} value={value}>
                {translate(`codes.${value}`)}
              </option>
            ))}
          </select>
        </FinanceField>
        <FinanceSearch
          label={translate('review.lookup')}
          placeholder={translate('review.lookupPlaceholder')}
          value={lookup}
          onChange={setLookup}
        />
        <FinanceButton disabled={!validId} onClick={() => open(lookup.trim())}>
          {translate('common.open')}
        </FinanceButton>
      </div>
      <p className='text-sm text-muted-foreground'>{translate('review.reviewerNotice')}</p>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={query.data?.data?.items ?? []}
          rowKey={(item) => item.stepId}
          onOpen={(item) => open(item.requestId)}
          columns={[
            { key: 'request', label: translate('common.request'), render: (item) => item.requestId },
            { key: 'requester', label: translate('common.requester'), render: (item) => item.requester.fullName },
            { key: 'costCenter', label: translate('common.costCenter'), render: (item) => item.costCenter.code },
            {
              key: 'amount',
              label: translate('common.amount'),
              numeric: true,
              render: (item) =>
                item.amount ? formatMoney(item.amount, i18n.language) : translate('common.unavailable')
            },
            {
              key: 'code',
              label: translate('review.checkCode'),
              render: (item) => <FinanceStatus value={item.primaryCode} />
            },
            { key: 'state', label: translate('common.state'), render: (item) => <FinanceStatus value={item.state} /> }
          ]}
        />
        <FinancePagination pagination={query.data?.data?.pagination} onPageChange={list.setPage} />
      </FinanceQueryState>
      {activeId && (
        <FinanceReviewDetail
          key={activeId}
          requestId={activeId}
          onClose={() => {
            setSelected('')
            onSelectTab?.('budget-check')
          }}
        />
      )}
    </FinancePage>
  )
}
