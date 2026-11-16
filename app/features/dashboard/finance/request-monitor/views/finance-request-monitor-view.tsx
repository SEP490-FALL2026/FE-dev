import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessRequestListType, AccessRequestListView } from '~/shared/api/generated/model/access-requests'
import { useAccessRequestList } from '~/shared/api/generated/operations/access-requests'
import {
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSelect,
  FinanceStatus,
  FinanceToolbar,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceDepartments } from '../../shared/hooks/use-finance-departments'
import { useFinanceList } from '../../shared/hooks/use-finance-list'
import type { FinanceTabKey } from '../../enums'
import { RequestMonitorDetail } from '../components/request-monitor-detail'

interface Props {
  itemId?: string
  onSelectTab?: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}

/** States a Request can be in once its spend was approved or it left the flow; the BE filter takes one state. */
const STATE_FILTERS = [
  'AWAITING_EXECUTION',
  'EXECUTING',
  'COMPLETED',
  'FAILED',
  'AWAITING_IT_CLOSE',
  'WITHDRAWN',
  'CANCELLED'
] as const

/** Read-only list of the Requests Finance oversees: the ones whose spend was approved (a commitment exists). */
export function FinanceRequestMonitorView({ itemId, onSelectTab }: Props) {
  if (itemId) return <RequestMonitorDetail id={itemId} onBack={() => onSelectTab?.('request-monitor')} />
  return <RequestList onSelectTab={onSelectTab} />
}

function RequestList({ onSelectTab }: Pick<Props, 'onSelectTab'>) {
  const { t: translate } = useTranslation('financeRequests')
  const { page, pageSize, setPage } = useFinanceList()
  const [view, setView] = useState<AccessRequestListView | ''>('')
  const [type, setType] = useState<AccessRequestListType | ''>('')
  const [state, setState] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const { departments } = useFinanceDepartments()
  const rangeInvalid = Boolean(from && to && from > to)
  const query = useAccessRequestList(
    {
      page,
      pageSize,
      ...(view ? { view } : {}),
      ...(type ? { type } : {}),
      ...(state ? { state } : {}),
      ...(departmentId ? { departmentId } : {}),
      ...(from ? { from: `${from}T00:00:00+07:00` } : {}),
      ...(to ? { to: `${to}T23:59:59+07:00` } : {})
    },
    { query: { enabled: !rangeInvalid } }
  )
  const result = query.data?.data
  return (
    <FinancePage title={translate('title')} description={translate('description')}>
      <FinanceToolbar>
        <div className='sm:w-52'>
          <FinanceField label={translate('view.label')}>
            <FinanceSelect
              value={view}
              onChange={(event) => {
                setView(Object.values(AccessRequestListView).find((value) => value === event.target.value) ?? '')
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {Object.values(AccessRequestListView).map((value) => (
                <option key={value} value={value}>
                  {translate(`view.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
        <div className='sm:w-52'>
          <FinanceField label={translate('type.label')}>
            <FinanceSelect
              value={type}
              onChange={(event) => {
                setType(Object.values(AccessRequestListType).find((value) => value === event.target.value) ?? '')
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {Object.values(AccessRequestListType).map((value) => (
                <option key={value} value={value}>
                  {translate(`type.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
        <div className='sm:w-56'>
          <FinanceField label={translate('stateLabel')}>
            <FinanceSelect
              value={state}
              onChange={(event) => {
                setState(event.target.value)
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {STATE_FILTERS.map((value) => (
                <option key={value} value={value}>
                  {translate(`state.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
        <div className='sm:w-56'>
          <FinanceField label={translate('department')}>
            <FinanceSelect
              value={departmentId}
              onChange={(event) => {
                setDepartmentId(event.target.value)
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
        <div className='sm:w-40'>
          <FinanceField label={translate('from')}>
            <input
              type='date'
              className={financeInputClass}
              value={from}
              onChange={(event) => {
                setFrom(event.target.value)
                setPage(1)
              }}
            />
          </FinanceField>
        </div>
        <div className='sm:w-40'>
          <FinanceField
            label={translate('to')}
            floatingError
            error={rangeInvalid ? translate('dateRangeInvalid') : null}
          >
            <input
              type='date'
              aria-invalid={rangeInvalid}
              min={from || undefined}
              className={financeInputClass}
              value={to}
              onChange={(event) => {
                setTo(event.target.value)
                setPage(1)
              }}
            />
          </FinanceField>
        </div>
      </FinanceToolbar>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(request) => request.id}
          onOpen={(request) => onSelectTab?.('request-monitor', { id: request.id })}
          columns={[
            {
              key: 'software',
              label: translate('software'),
              render: (request) => (
                <div className='min-w-0'>
                  <div className='truncate font-medium text-foreground'>
                    {request.softwareName ?? request.plan?.applicationName ?? translate('none')}
                  </div>
                  <div className='text-xs text-muted-foreground'>{translate(`type.${request.type}`)}</div>
                </div>
              )
            },
            {
              key: 'department',
              label: translate('department'),
              render: (request) => request.department.name
            },
            {
              key: 'requester',
              label: translate('requester'),
              render: (request) => request.requester.fullName
            },
            {
              key: 'beneficiary',
              label: translate('beneficiary'),
              render: (request) =>
                request.lineCount > 1
                  ? translate('groupLines', { count: request.lineCount })
                  : (request.beneficiary?.fullName ?? translate('none'))
            },
            {
              key: 'term',
              label: translate('termMonths'),
              numeric: true,
              render: (request) => request.termMonths ?? translate('longTerm')
            },
            {
              key: 'state',
              label: translate('stateLabel'),
              render: (request) => (
                <FinanceStatus
                  value={request.state}
                  label={translate(`state.${request.state}`, { defaultValue: request.state })}
                />
              )
            },
            {
              key: 'reserve',
              label: translate('reserveUsed'),
              render: (request) => (request.reserveUsed ? translate('yes') : translate('no'))
            },
            {
              key: 'submittedAt',
              label: translate('submittedAt'),
              numeric: true,
              render: (request) => new Date(request.submittedAt).toLocaleDateString()
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinancePage>
  )
}
