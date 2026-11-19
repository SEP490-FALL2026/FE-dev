import { ArrowLeft, Unlock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import {
  FinanceButton,
  FinanceEmpty,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import type { FinanceTabKey } from '../../enums'
import {
  useCommitmentInvoices,
  useCommitmentLookup,
  useCommitmentReleases,
  type CommitmentHints
} from '../hooks/use-finance-commitments'

const MATCH_RESULTS = ['MATCHED', 'TAX_ONLY', 'PRICE_QUANTITY_EXCEPTION'] as const

function hintsFrom(searchParams: URLSearchParams): CommitmentHints {
  const year = Number(searchParams.get('year'))
  return {
    requestId: searchParams.get('request') ?? undefined,
    costCenterId: searchParams.get('cc') ?? undefined,
    year: Number.isInteger(year) && year >= 2000 && year <= 2200 ? year : undefined
  }
}

/**
 * One commitment on its own screen: what was held, spent and released, the invoices that spent it and the releases made.
 * The API has no read-by-id for a commitment, so the facts come from the list; invoices and releases have their own routes.
 */
export function FinanceCommitmentDetailView({
  itemId,
  onSelectTab
}: {
  itemId?: string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t: translate, i18n } = useTranslation('finance')
  const [searchParams] = useSearchParams()
  const hints = hintsFrom(searchParams)
  const [invoicePage, setInvoicePage] = useState(1)
  const lookup = useCommitmentLookup(itemId, hints)
  const invoices = useCommitmentInvoices(itemId, invoicePage)
  const releases = useCommitmentReleases(itemId)
  const commitment = lookup.data ?? undefined
  const back = () => onSelectTab('commitments')
  const money = (value: { amount: string; currency: string }) => formatMoney(value, i18n.language)
  const releasable = Boolean(commitment && commitment.state !== 'RELEASED' && Number(commitment.held.amount) > 0)

  return (
    <FinancePage
      title={translate('commitmentDetail.title')}
      actions={
        <>
          <FinanceButton variant='ghost' onClick={back}>
            <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
            {translate('commitmentRelease.back')}
          </FinanceButton>
          {commitment && releasable && (
            <FinanceButton
              variant='primary'
              onClick={() => onSelectTab('commitment-release', { id: commitment.id, request: commitment.requestId })}
            >
              <Unlock aria-hidden className='size-4' strokeWidth={1.5} />
              {translate('releaseRemainder')}
            </FinanceButton>
          )}
        </>
      }
    >
      <FinanceQueryState query={lookup}>
        {commitment ? (
          <>
            <FinanceStatGrid columns={4}>
              <FinanceStat label={translate('commitmentRelease.amount')} value={money(commitment.amount)} />
              <FinanceStat label={translate('held')} value={money(commitment.held)} />
              <FinanceStat label={translate('commitmentDetail.spent')} value={money(commitment.invoiced)} />
              <FinanceStat label={translate('commitmentRelease.released')} value={money(commitment.released)} />
            </FinanceStatGrid>
            <dl className='grid gap-3 text-sm sm:grid-cols-2'>
              <div>
                <dt className='text-muted-foreground'>{translate('commitmentDetail.costCenter')}</dt>
                <dd className='font-medium text-foreground'>
                  {commitment.costCenter.name}
                  <span className='ml-2 font-mono text-[11px] text-muted-foreground'>{commitment.costCenter.code}</span>
                </dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>{translate('commitmentDetail.year')}</dt>
                <dd className='font-mono tabular-nums'>{commitment.year}</dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>{translate('commitmentDetail.state')}</dt>
                <dd className='space-y-1'>
                  <FinanceStatus value={commitment.state} />
                  {!commitment.attached && (
                    <p className='text-xs text-warning-ink'>{translate('commitmentDetail.unattached')}</p>
                  )}
                </dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>{translate('commitmentDetail.request')}</dt>
                <dd className='space-y-1'>
                  <div className='font-medium text-foreground'>
                    {commitment.request?.software.name ?? translate('commitmentDetail.noRequest')}
                    {commitment.request?.plan?.name && (
                      <span className='ml-2 text-xs font-normal text-muted-foreground'>
                        {commitment.request.plan.name}
                      </span>
                    )}
                  </div>
                  {commitment.request && (
                    <div className='text-xs text-muted-foreground'>
                      {commitment.request.requester.fullName} ·{' '}
                      {translate('commitmentDetail.beneficiaries', { count: commitment.request.beneficiaryCount })}
                    </div>
                  )}
                  <FinanceButton
                    variant='secondary'
                    onClick={() => onSelectTab('request-monitor', { id: commitment.requestId })}
                  >
                    {translate('commitmentDetail.openRequest')}
                  </FinanceButton>
                </dd>
              </div>
            </dl>
            {commitment.hasDiscrepancy && (
              <p role='status' className='text-sm text-danger'>
                {translate('commitmentDetail.discrepancy')}
              </p>
            )}
          </>
        ) : (
          <FinanceEmpty message={translate('commitmentRelease.notFound')} />
        )}
      </FinanceQueryState>

      <FinanceSection title={translate('commitmentDetail.invoices')}>
        <p className='text-sm text-muted-foreground'>{translate('commitmentDetail.invoicesHint')}</p>
        <FinanceQueryState query={invoices}>
          <FinanceTable
            items={invoices.data?.items ?? []}
            rowKey={(invoice) => invoice.id}
            columns={[
              {
                key: 'number',
                label: translate('commitmentDetail.invoiceNumber'),
                render: (invoice) => invoice.number
              },
              {
                key: 'period',
                label: translate('commitmentDetail.servicePeriod'),
                numeric: true,
                render: (invoice) => invoice.servicePeriodMonth ?? '—'
              },
              {
                key: 'label',
                label: translate('commitmentDetail.label'),
                render: (invoice) => (invoice.label ? translate(`commitmentDetail.labels.${invoice.label}`) : '—')
              },
              {
                key: 'source',
                label: translate('commitmentDetail.paymentSource'),
                render: (invoice) =>
                  invoice.paymentSource ? translate(`commitmentDetail.paymentSources.${invoice.paymentSource}`) : '—'
              },
              {
                key: 'actual',
                label: translate('commitmentDetail.actualCost'),
                numeric: true,
                render: (invoice) => money(invoice.actualCost)
              },
              {
                key: 'match',
                label: translate('commitmentDetail.matchResult'),
                render: (invoice) =>
                  MATCH_RESULTS.some((result) => result === invoice.matchResult) ? (
                    <FinanceStatus
                      value={invoice.matchResult}
                      label={translate(`commitmentDetail.matchResults.${invoice.matchResult}`)}
                    />
                  ) : (
                    translate('commitmentDetail.unknown')
                  )
              },
              {
                key: 'issued',
                label: translate('commitmentDetail.issuedOn'),
                numeric: true,
                render: (invoice) => invoice.issuedOn
              }
            ]}
          />
          <FinancePagination pagination={invoices.data?.pagination} onPageChange={setInvoicePage} />
        </FinanceQueryState>
      </FinanceSection>

      <FinanceSection title={translate('commitmentRelease.history')}>
        <FinanceQueryState query={releases}>
          <FinanceTable
            items={releases.data ?? []}
            rowKey={(release) => release.id}
            columns={[
              {
                key: 'amount',
                label: translate('commitmentRelease.amount'),
                numeric: true,
                render: (release) => money(release.amount)
              },
              {
                key: 'reason',
                label: translate('commitmentRelease.reasonLabel'),
                render: (release) =>
                  release.reasonText ??
                  translate(`commitmentRelease.reasons.${release.reason}`, { defaultValue: release.reason })
              },
              {
                key: 'by',
                label: translate('commitmentRelease.by'),
                render: (release) => release.releasedBy?.fullName ?? translate('commitmentRelease.system')
              },
              {
                key: 'at',
                label: translate('commitmentRelease.at'),
                numeric: true,
                render: (release) => new Date(release.releasedAt).toLocaleString(i18n.language)
              }
            ]}
          />
        </FinanceQueryState>
      </FinanceSection>
    </FinancePage>
  )
}
