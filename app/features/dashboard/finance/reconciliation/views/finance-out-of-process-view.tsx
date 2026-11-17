import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OutOfProcessCaseListState } from '~/shared/api/generated/model/out-of-process-cases'
import type { OutOfProcessListResponseDtoDataItemsItem } from '~/shared/api/generated/model/out-of-process-cases'
import { useCostCenterList } from '~/shared/api/generated/operations/cost-centers'
import { useOutOfProcessCaseList } from '~/shared/api/generated/operations/out-of-process-cases'
import {
  FinanceButton,
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSelect,
  FinanceStatus,
  FinanceToolbar
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { useFinanceList } from '../../shared/hooks/use-finance-list'
import { OutOfProcessCloseDialog } from '../components/out-of-process-close-dialog'

type CaseItem = OutOfProcessListResponseDtoDataItemsItem

export function FinanceOutOfProcessView() {
  const { t: translate, i18n } = useTranslation('financePurchases')
  const { page, pageSize, setPage } = useFinanceList()
  const [state, setState] = useState<OutOfProcessCaseListState | ''>(OutOfProcessCaseListState.OPEN)
  const [closing, setClosing] = useState<CaseItem | null>(null)
  const query = useOutOfProcessCaseList({ page, pageSize, ...(state ? { state } : {}) })
  const costCenters = useCostCenterList({ pageSize: 100 })
  const costCenterName = (item: CaseItem) => {
    if (!item.amount) return translate('none')
    if (!item.costCenterId) return translate('outOfProcess.unallocated')
    const found = costCenters.data?.data?.items.find((costCenter) => costCenter.id === item.costCenterId)
    return found ? `${found.code} · ${found.name}` : translate('none')
  }
  const result = query.data?.data
  return (
    <FinancePage title={translate('outOfProcess.title')} description={translate('outOfProcess.description')}>
      <FinanceToolbar>
        <div className='sm:w-56'>
          <FinanceField label={translate('outOfProcess.state')}>
            <FinanceSelect
              value={state}
              onChange={(event) => {
                setState(Object.values(OutOfProcessCaseListState).find((value) => value === event.target.value) ?? '')
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {Object.values(OutOfProcessCaseListState).map((value) => (
                <option key={value} value={value}>
                  {translate(`outOfProcess.states.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
      </FinanceToolbar>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(item) => item.id}
          columns={[
            {
              key: 'application',
              label: translate('outOfProcess.application'),
              render: (item) => item.application?.name ?? translate('none')
            },
            {
              key: 'state',
              label: translate('outOfProcess.state'),
              render: (item) => (
                <FinanceStatus value={item.state} label={translate(`outOfProcess.states.${item.state}`)} />
              )
            },
            {
              key: 'outcome',
              label: translate('outOfProcess.outcome'),
              render: (item) => (item.outcome ? translate(`outOfProcess.outcomes.${item.outcome}`) : translate('none'))
            },
            {
              key: 'amount',
              label: translate('outOfProcess.amount'),
              numeric: true,
              render: (item) => (item.amount ? formatMoney(item.amount, i18n.language) : translate('none'))
            },
            { key: 'costCenter', label: translate('outOfProcess.costCenter'), render: costCenterName },
            {
              key: 'asset',
              label: translate('outOfProcess.companyAsset'),
              render: (item) =>
                item.companyAsset === null
                  ? translate('none')
                  : item.companyAsset
                    ? translate('outOfProcess.yes')
                    : translate('outOfProcess.no')
            },
            {
              key: 'revocation',
              label: translate('outOfProcess.revocation'),
              render: (item) =>
                item.state === 'CLOSED' || !item.revocation.required
                  ? translate('outOfProcess.revocationNone')
                  : item.revocation.due
                    ? translate('outOfProcess.revocationDue')
                    : translate('outOfProcess.revocationWaiting', { date: item.revocation.waitUntil ?? '—' })
            },
            {
              key: 'concluded',
              label: translate('outOfProcess.concludedOn'),
              numeric: true,
              render: (item) => item.concludedOn ?? translate('none')
            },
            {
              key: 'opened',
              label: translate('outOfProcess.openedAt'),
              numeric: true,
              render: (item) => item.openedAt.slice(0, 10)
            },
            {
              key: 'note',
              label: translate('outOfProcess.noteLabel'),
              render: (item) =>
                item.note ? (
                  <span title={item.note} className='block max-w-56 truncate'>
                    {item.note}
                  </span>
                ) : (
                  translate('none')
                )
            },
            {
              key: 'actions',
              label: '',
              actions: true,
              render: (item) =>
                item.state === 'OPEN' ? (
                  <FinanceButton onClick={() => setClosing(item)}>{translate('outOfProcess.close')}</FinanceButton>
                ) : null
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
      {closing && <OutOfProcessCloseDialog item={closing} onClose={() => setClosing(null)} />}
    </FinancePage>
  )
}
