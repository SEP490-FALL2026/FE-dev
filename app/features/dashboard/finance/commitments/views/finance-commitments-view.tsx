import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetCommitmentList } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-list'
import type { CommitmentListResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-commitments/commitmentListResponseDtoDataItemsItem'
import {
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSearch,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { useFinanceList } from '../../shared/hooks/use-finance-list'
import type { FinanceTabKey } from '../../enums'
import { CommitmentAttached } from '../enums/commitment-attached'
import { FinanceCommitmentDetail } from '../components/finance-commitment-detail'

export function FinanceCommitmentsView({
  itemId,
  onSelectTab
}: {
  itemId?: string
  onSelectTab?: (tab: FinanceTabKey, extra?: Record<string, string>) => void
}) {
  const { t: translate, i18n } = useTranslation('financeSpend')
  const list = useFinanceList()
  const [attached, setAttached] = useState<CommitmentAttached | ''>('')
  const [requestId, setRequestId] = useState('')
  const [selected, setSelected] = useState<CommitmentListResponseDtoDataItemsItem>()
  const [closed, setClosed] = useState(false)
  const yearValid = !list.year || (/^\d{4}$/.test(list.year) && Number(list.year) >= 2000 && Number(list.year) <= 2200)
  const requestValid = !requestId || /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(requestId)
  const query = useBudgetCommitmentList(
    {
      page: list.page,
      pageSize: list.pageSize,
      ...(attached ? { attached } : {}),
      ...(list.year && yearValid ? { year: Number(list.year) } : {}),
      ...(requestId && requestValid ? { requestId } : {})
    },
    { query: { enabled: yearValid && requestValid } }
  )
  const items = query.data?.data?.items ?? []
  const targetId = onSelectTab ? itemId : (selected?.id ?? (closed ? undefined : itemId))
  const active = items.find((item) => item.id === targetId) ?? (selected?.id === targetId ? selected : undefined)
  const open = (item: CommitmentListResponseDtoDataItemsItem) => {
    setSelected(item)
    setClosed(false)
    onSelectTab?.('commitments', { id: item.id })
  }
  return (
    <FinancePage title={translate('commitments.title')}>
      <div className='flex flex-wrap items-end gap-3'>
        <FinanceField label={translate('commitments.attachment')}>
          <select
            aria-label={translate('commitments.attachment')}
            className={financeInputClass}
            value={attached}
            onChange={(event) => {
              setAttached(event.target.value as CommitmentAttached | '')
              list.setPage(1)
            }}
          >
            <option value=''>{translate('common.all')}</option>
            <option value={CommitmentAttached.true}>{translate('commitments.attached')}</option>
            <option value={CommitmentAttached.false}>{translate('commitments.unattached')}</option>
          </select>
        </FinanceField>
        <FinanceSearch
          label={translate('common.year')}
          placeholder={translate('common.year')}
          value={list.year}
          onChange={list.setYear}
        />
        <FinanceSearch
          label={translate('common.request')}
          placeholder={translate('review.lookupPlaceholder')}
          value={requestId}
          onChange={(value) => {
            setRequestId(value)
            list.setPage(1)
          }}
        />
      </div>
      {(!yearValid || !requestValid) && (
        <p className='text-sm text-destructive' role='status'>
          {translate('common.invalidFilter')}
        </p>
      )}
      {yearValid && requestValid && (
        <FinanceQueryState query={query}>
          <FinanceTable
            items={items}
            rowKey={(item) => item.id}
            onOpen={open}
            columns={[
              { key: 'request', label: translate('common.request'), render: (item) => item.requestId },
              { key: 'costCenter', label: translate('common.costCenter'), render: (item) => item.costCenter.name },
              { key: 'year', label: translate('common.year'), numeric: true, render: (item) => item.year },
              {
                key: 'amount',
                label: translate('common.amount'),
                numeric: true,
                render: (item) => formatMoney(item.amount, i18n.language)
              },
              {
                key: 'held',
                label: translate('commitments.held'),
                numeric: true,
                render: (item) => formatMoney(item.held, i18n.language)
              },
              {
                key: 'released',
                label: translate('commitments.released'),
                numeric: true,
                render: (item) => formatMoney(item.released, i18n.language)
              },
              {
                key: 'attachment',
                label: translate('commitments.attachment'),
                render: (item) => translate(item.attached ? 'commitments.attached' : 'commitments.unattached')
              },
              { key: 'state', label: translate('common.state'), render: (item) => <FinanceStatus value={item.state} /> }
            ]}
          />
          <FinancePagination pagination={query.data?.data?.pagination} onPageChange={list.setPage} />
          {itemId && !active && !closed && (
            <p className='text-sm text-muted-foreground'>{translate('commitments.locate')}</p>
          )}
        </FinanceQueryState>
      )}
      {active && (
        <FinanceCommitmentDetail
          key={active.id}
          item={active}
          fresh={
            !query.isFetching &&
            !query.isError &&
            yearValid &&
            requestValid &&
            items.some((item) => item.id === active.id)
          }
          onClose={() => {
            setSelected(undefined)
            setClosed(true)
            onSelectTab?.('commitments')
          }}
        />
      )}
    </FinancePage>
  )
}
