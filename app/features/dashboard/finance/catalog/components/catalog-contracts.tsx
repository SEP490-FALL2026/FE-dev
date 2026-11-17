import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContractListStatus } from '~/shared/api/generated/model/contracts'
import { useContractGet, useContractList } from '~/shared/api/generated/operations/contracts'
import { useUsageSourceListOfContract } from '~/shared/api/generated/operations/usage-sources'
import {
  FinanceButton,
  FinanceDrawer,
  FinanceEmpty,
  FinancePagination,
  FinanceQueryState,
  FinanceSearch,
  FinanceSection,
  FinanceStatus,
  FinanceToolbar
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatDay } from '../../shared/finance-date'
import { useFinanceSearch } from '../../shared/hooks/use-finance-search'
import { useDocumentLink } from '../../purchase-invoices/hooks/use-document-link'
import { CatalogEnumFilter } from './catalog-enum-filter'
import { CatalogFacts } from './catalog-facts'

const statusTone = (status: string) =>
  status === 'ACTIVE' ? 'ACTIVE' : status === 'EXPIRED' ? 'REJECTED' : status === 'INCOMPLETE' ? 'MISSING' : 'DRAFT'

/** Contracts with vendors, read only: which subscriptions they cover, their files and the usage sources tied to them. */
export function CatalogContracts() {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const { search, setSearch, debouncedSearch } = useFinanceSearch()
  const [status, setStatus] = useState<ContractListStatus | ''>('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null)
  const query = useContractList({
    search: debouncedSearch || undefined,
    status: status || undefined,
    page,
    pageSize: 20
  })
  const day = (value: string | null | undefined) => formatDay(value, i18n.language)
  return (
    <>
      <FinanceToolbar>
        <FinanceSearch
          label={translate('contracts.search')}
          placeholder={translate('contracts.searchPlaceholder')}
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
        />
        <CatalogEnumFilter
          label={translate('status')}
          options={ContractListStatus}
          labelPrefix='contracts.statuses'
          value={status}
          onChange={(value) => {
            setStatus(value)
            setPage(1)
          }}
        />
      </FinanceToolbar>
      <FinanceQueryState query={query}>
        <FinanceTable
          items={query.data?.data?.items ?? []}
          rowKey={(item) => item.id}
          onOpen={(item) => setSelected({ id: item.id, name: item.name })}
          columns={[
            { key: 'name', label: translate('contracts.name'), render: (item) => item.name },
            {
              key: 'vendor',
              label: translate('vendor'),
              render: (item) => item.vendor?.name ?? translate('unavailable')
            },
            {
              key: 'effective',
              label: translate('contracts.effective'),
              render: (item) => `${day(item.effectiveFrom)} – ${day(item.effectiveTo)}`
            },
            {
              key: 'status',
              label: translate('status'),
              render: (item) => (
                <FinanceStatus value={statusTone(item.status)} label={translate(`contracts.statuses.${item.status}`)} />
              )
            },
            {
              key: 'subscriptions',
              label: translate('contracts.subscriptionCount'),
              align: 'center',
              render: (item) => item.subscriptionCount
            }
          ]}
        />
        <FinancePagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
      {selected && <ContractDetail id={selected.id} name={selected.name} onClose={() => setSelected(null)} />}
    </>
  )
}

function ContractDetail({ id, name, onClose }: { id: string; name: string; onClose: () => void }) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const query = useContractGet(id)
  const [sourcePage, setSourcePage] = useState(1)
  const sources = useUsageSourceListOfContract(id, { page: sourcePage, pageSize: 10 })
  const link = useDocumentLink()
  const contract = query.data?.data?.contract
  const none = translate('unavailable')
  const day = (value: string | null | undefined) => formatDay(value, i18n.language)
  const truncated = contract?.truncated

  return (
    <FinanceDrawer title={contract?.name ?? name} onClose={onClose}>
      <FinanceQueryState query={query}>
        {contract && (
          <>
            <FinanceSection title={translate('overview')}>
              <CatalogFacts
                rows={[
                  [translate('contracts.number'), contract.number ?? none],
                  [translate('vendor'), contract.vendor?.name ?? none],
                  [
                    translate('status'),
                    <FinanceStatus
                      key='status'
                      value={statusTone(contract.status)}
                      label={translate(`contracts.statuses.${contract.status}`)}
                    />
                  ],
                  [translate('contracts.effective'), `${day(contract.effectiveFrom)} – ${day(contract.effectiveTo)}`],
                  ...(contract.note ? ([[translate('contracts.note'), contract.note]] as const) : [])
                ]}
              />
            </FinanceSection>
            <FinanceSection title={translate('contracts.subscriptions')}>
              <FinanceTable
                items={contract.subscriptions}
                rowKey={(item) => item.subscriptionId}
                columns={[
                  {
                    key: 'plan',
                    label: translate('plan'),
                    render: (item) => `${item.applicationName} · ${item.planName}`
                  },
                  {
                    key: 'period',
                    label: translate('subscriptionPeriod'),
                    render: (item) => `${day(item.startDate)} – ${day(item.endDate)}`
                  },
                  { key: 'status', label: translate('status'), render: (item) => <FinanceStatus value={item.status} /> }
                ]}
              />
            </FinanceSection>
            <FinanceSection title={translate('contracts.documents')}>
              {contract.documents.length === 0 ? (
                <FinanceEmpty message={translate('contracts.noDocuments')} />
              ) : (
                <ul className='divide-y divide-border/60 rounded-lg border border-border/70'>
                  {contract.documents.map((document) => (
                    <li key={document.id} className='flex flex-wrap items-center justify-between gap-3 px-4 py-2.5'>
                      <span className='min-w-0 text-sm wrap-break-word'>{document.fileName}</span>
                      <FinanceButton variant='ghost' disabled={link.isPending} onClick={() => link.mutate(document.id)}>
                        {translate('contracts.openFile')}
                      </FinanceButton>
                    </li>
                  ))}
                </ul>
              )}
            </FinanceSection>
            {truncated && (truncated.subscriptions || truncated.documents) && (
              <p role='note' className='text-xs text-muted-foreground'>
                {translate('listTruncated')}
              </p>
            )}
          </>
        )}
      </FinanceQueryState>
      <FinanceSection title={translate('contracts.usageSources')}>
        <FinanceQueryState query={sources}>
          {(sources.data?.data?.items ?? []).length === 0 ? (
            <FinanceEmpty message={translate('contracts.noUsageSources')} />
          ) : (
            <FinanceTable
              items={sources.data?.data?.items ?? []}
              rowKey={(item) => item.id}
              columns={[
                { key: 'name', label: translate('name'), render: (item) => item.name },
                { key: 'application', label: translate('application'), render: (item) => item.application.name },
                {
                  key: 'status',
                  label: translate('status'),
                  render: (item) => <FinanceStatus value={item.status} label={translate(`enum.${item.status}`)} />
                }
              ]}
            />
          )}
          <FinancePagination pagination={sources.data?.data?.pagination} onPageChange={setSourcePage} />
        </FinanceQueryState>
      </FinanceSection>
    </FinanceDrawer>
  )
}
