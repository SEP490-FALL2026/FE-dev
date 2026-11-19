import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSeatMonthChargeList } from '~/shared/api/generated/operations/seat-month-charges'
import { useSubscriptionList } from '~/shared/api/generated/operations/subscriptions'
import {
  FinanceEmpty,
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceSelect,
  FinanceToolbar,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { CostCenterPicker } from '../components/cost-center-picker'

const months = Array.from({ length: 12 }, (_, index) => index + 1)
const validYear = (value: string) => /^\d{4}$/.test(value) && Number(value) >= 2000 && Number(value) <= 2100

export function FinanceSeatChargesView() {
  const { t: translate, i18n } = useTranslation('financeReview')
  const now = new Date()
  const [year, setYear] = useState(String(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()))
  const [month, setMonth] = useState(String(now.getMonth() === 0 ? 12 : now.getMonth()))
  const [costCenterId, setCostCenterId] = useState('')
  const [subscriptionId, setSubscriptionId] = useState('')
  const [page, setPage] = useState(1)
  // The seat-month and its pool line only carry the subscription id: the names come from the catalogue.
  const subscriptions = useSubscriptionList({ pageSize: 100 })
  const ready = validYear(year)
  const query = useSeatMonthChargeList(
    {
      year: Number(year),
      month: Number(month),
      page,
      pageSize: 20,
      ...(costCenterId ? { costCenterId } : {}),
      ...(subscriptionId ? { subscriptionId } : {})
    },
    { query: { enabled: ready } }
  )
  const result = query.data?.data
  const money = (value: { amount: string; currency: string } | null | undefined) => formatMoney(value, i18n.language)
  const subscriptionNames = new Map(
    (subscriptions.data?.data?.items ?? []).map((item) => [item.id, `${item.applicationName} · ${item.planName}`])
  )
  const subscriptionName = (id: string) => subscriptionNames.get(id) ?? translate('ui.unknownSubscription')
  const subscriptionOptions = [
    { value: '', label: translate('seats.allSubscriptions') },
    ...(subscriptions.data?.data?.items ?? []).map((item) => ({
      value: item.id,
      label: item.applicationName,
      description: item.planName
    }))
  ]
  const reset = () => setPage(1)

  return (
    <FinancePage title={translate('seats.title')} description={translate('seats.description')}>
      <FinanceToolbar>
        <div className='sm:w-32'>
          <FinanceField label={translate('year')} floatingError error={ready ? null : translate('yearInvalid')}>
            <input
              type='number'
              inputMode='numeric'
              min={2000}
              max={2100}
              aria-invalid={!ready || undefined}
              placeholder={translate('ui.yearPlaceholder', { year: now.getFullYear() })}
              className={`${financeInputClass} font-mono tabular-nums`}
              value={year}
              onChange={(event) => {
                setYear(event.target.value)
                reset()
              }}
            />
          </FinanceField>
        </div>
        <div className='sm:w-36'>
          <FinanceField label={translate('month')}>
            <FinanceSelect
              value={month}
              placeholder={translate('ui.monthPlaceholder')}
              onChange={(event) => {
                setMonth(event.target.value)
                reset()
              }}
            >
              {months.map((value) => (
                <option key={value} value={value}>
                  {translate('monthName', { month: value })}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
        <div className='sm:w-64'>
          <FinanceField label={translate('costCenter')}>
            <CostCenterPicker
              value={costCenterId}
              allLabel={translate('allCostCenters')}
              placeholder={translate('ui.costCenterFilterPlaceholder')}
              onChange={(next) => {
                setCostCenterId(next)
                reset()
              }}
            />
          </FinanceField>
        </div>
        <div className='sm:w-72 sm:flex-1'>
          <FinanceField label={translate('seats.subscription')}>
            <FinanceSelect
              value={subscriptionId}
              options={subscriptionOptions}
              loading={subscriptions.isFetching}
              placeholder={translate('ui.subscriptionFilterPlaceholder')}
              onValueChange={(next) => {
                setSubscriptionId(next)
                reset()
              }}
            />
          </FinanceField>
        </div>
      </FinanceToolbar>
      {!ready ? (
        <FinanceEmpty message={translate('seats.chooseMonth')} />
      ) : (
        <FinanceQueryState query={query}>
          {(result?.items.length ?? 0) === 0 && (result?.poolLines.length ?? 0) === 0 ? (
            <FinanceEmpty message={translate('seats.empty')} />
          ) : (
            <>
              <FinanceSection title={translate('ui.seatLines')}>
                <FinanceTable
                  items={result?.items ?? []}
                  rowKey={(item) => item.id}
                  columns={[
                    {
                      key: 'subscription',
                      label: translate('seats.subscription'),
                      render: (item) => subscriptionName(item.subscriptionId)
                    },
                    {
                      key: 'employee',
                      label: translate('seats.employee'),
                      render: (item) =>
                        item.employee ? `${item.employee.fullName} (${item.employee.employeeCode})` : '—'
                    },
                    {
                      key: 'department',
                      label: translate('seats.department'),
                      render: (item) => item.department?.name ?? '—'
                    },
                    {
                      key: 'costCenter',
                      label: translate('costCenter'),
                      render: (item) =>
                        item.costCenter
                          ? `${item.costCenter.code} · ${item.costCenter.name}`
                          : translate('noCostCenter')
                    },
                    {
                      key: 'days',
                      label: translate('seats.days'),
                      numeric: true,
                      align: 'center',
                      render: (item) => `${item.days}/${item.daysInMonth}`
                    },
                    {
                      key: 'monthlyPrice',
                      label: translate('seats.monthlyPrice'),
                      numeric: true,
                      render: (item) => money(item.monthlyPrice)
                    },
                    { key: 'amount', label: translate('amount'), numeric: true, render: (item) => money(item.amount) },
                    {
                      key: 'applied',
                      label: translate('seats.appliedToCommitment'),
                      numeric: true,
                      render: (item) => money(item.appliedToCommitment)
                    }
                  ]}
                />
                <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
              </FinanceSection>
              {(result?.poolLines.length ?? 0) > 0 && (
                <FinanceSection title={translate('seats.poolTitle')}>
                  <p className='text-sm leading-relaxed text-muted-foreground [text-wrap:pretty]'>
                    {translate('seats.poolHint')}
                  </p>
                  <FinanceTable
                    items={result?.poolLines ?? []}
                    rowKey={(line) => line.subscriptionId}
                    columns={[
                      {
                        key: 'subscription',
                        label: translate('seats.subscription'),
                        render: (line) => subscriptionName(line.subscriptionId)
                      },
                      {
                        key: 'paid',
                        label: translate('seats.paid'),
                        numeric: true,
                        render: (line) => (line.paid ? money(line.paid) : translate('seats.paidUnknown'))
                      },
                      {
                        key: 'invoiced',
                        label: translate('seats.invoiced'),
                        numeric: true,
                        render: (line) => money(line.invoiced)
                      },
                      {
                        key: 'allocated',
                        label: translate('seats.allocated'),
                        numeric: true,
                        render: (line) => money(line.allocated)
                      },
                      {
                        key: 'withoutCostCenter',
                        label: translate('seats.withoutCostCenter'),
                        numeric: true,
                        render: (line) => money(line.withoutCostCenter)
                      },
                      {
                        key: 'unallocated',
                        label: translate('seats.unallocated'),
                        numeric: true,
                        render: (line) => money(line.unallocated)
                      }
                    ]}
                  />
                </FinanceSection>
              )}
            </>
          )}
        </FinanceQueryState>
      )}
    </FinancePage>
  )
}
