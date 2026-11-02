import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetInformationList } from '~/shared/api/generated/operations/budget-information/budget-information-list'
import type { InformationListResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-information/informationListResponseDtoDataItemsItem'
import {
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceList } from '../../shared/hooks/use-finance-list'
import type { FinanceTabKey } from '../../enums'
import { QuestionFilter } from '../enums/question-filter'
import { FinanceQuestionAnswer } from '../components/finance-question-answer'

export function FinanceBudgetQuestionsView({
  itemId,
  onSelectTab
}: {
  itemId?: string
  onSelectTab?: (tab: FinanceTabKey, extra?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('financeSpend')
  const list = useFinanceList()
  const [state, setState] = useState<QuestionFilter | ''>('')
  const [selected, setSelected] = useState<InformationListResponseDtoDataItemsItem>()
  const [closed, setClosed] = useState(false)
  const query = useBudgetInformationList({ page: list.page, pageSize: list.pageSize, ...(state ? { state } : {}) })
  const items = query.data?.data?.items ?? []
  const targetId = onSelectTab ? itemId : (selected?.id ?? (closed ? undefined : itemId))
  const active = items.find((item) => item.id === targetId) ?? (selected?.id === targetId ? selected : undefined)
  const open = (item: InformationListResponseDtoDataItemsItem) => {
    setSelected(item)
    setClosed(false)
    onSelectTab?.('budget-questions', { id: item.id })
  }
  return (
    <FinancePage title={translate('questions.title')}>
      <FinanceField label={translate('common.state')}>
        <select
          aria-label={translate('common.state')}
          className={financeInputClass}
          value={state}
          onChange={(event) => {
            setState(event.target.value as QuestionFilter | '')
            list.setPage(1)
          }}
        >
          <option value=''>{translate('common.all')}</option>
          {Object.values(QuestionFilter).map((value) => (
            <option key={value} value={value}>
              {translate(`codes.${value}`)}
            </option>
          ))}
        </select>
      </FinanceField>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={items}
          rowKey={(item) => item.id}
          onOpen={open}
          columns={[
            { key: 'request', label: translate('common.request'), render: (item) => item.requestId },
            { key: 'question', label: translate('questions.question'), render: (item) => item.question },
            { key: 'askedBy', label: translate('questions.askedBy'), render: (item) => item.askedBy.fullName },
            { key: 'state', label: translate('common.state'), render: (item) => <FinanceStatus value={item.state} /> },
            {
              key: 'answer',
              label: translate('questions.answer'),
              render: (item) => <FinanceStatus value={item.answer?.value} />
            }
          ]}
        />
        <FinancePagination pagination={query.data?.data?.pagination} onPageChange={list.setPage} />
        {itemId && !active && !closed && (
          <p className='text-sm text-muted-foreground'>{translate('questions.locate')}</p>
        )}
      </FinanceQueryState>
      {active && (
        <FinanceQuestionAnswer
          key={active.id}
          item={active}
          fresh={!query.isFetching && !query.isError && items.some((item) => item.id === active.id)}
          onClose={() => {
            setSelected(undefined)
            setClosed(true)
            onSelectTab?.('budget-questions')
          }}
        />
      )}
    </FinancePage>
  )
}
