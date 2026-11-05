import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useSpendApprovalList } from '~/shared/api/generated/operations/spend-approvals/spend-approval-list'
import type { ApprovalTabKey } from '../../enums'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import {
  ApprovalsButton,
  ApprovalsField,
  ApprovalsPage,
  ApprovalsPagination,
  ApprovalsSearch,
  ApprovalsSection,
  ApprovalsStatus,
  ApprovalsToolbar,
  approvalsInputClass
} from '../../shared/components/approvals-ui'
import { formatMoney } from '../../shared/approvals-money'
import { useDashboardFormat } from '../../../dashboard-ui'

const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim())

function LookupForm({
  label,
  placeholder,
  submitLabel,
  onOpen
}: {
  label: string
  placeholder: string
  submitLabel: string
  onOpen: (id: string) => void
}) {
  const [value, setValue] = useState('')
  return (
    <form
      className='flex items-end gap-2'
      onSubmit={(event) => {
        event.preventDefault()
        if (isUuid(value)) onOpen(value.trim())
      }}
    >
      <div className='min-w-0 flex-1'>
        <ApprovalsField label={label}>
          <input
            className={`${approvalsInputClass} font-mono text-xs tabular-nums md:text-xs`}
            placeholder={placeholder}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </ApprovalsField>
      </div>
      <ApprovalsButton type='submit' disabled={!isUuid(value)}>
        {submitLabel}
      </ApprovalsButton>
    </form>
  )
}

export function ApprovalQueueView({
  onSelectTab
}: {
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate, i18n } = useTranslation('approvalsSpend')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { formatDate } = useDashboardFormat()
  const query = useSpendApprovalList({ page, pageSize: 20 })
  const items = query.data?.data?.items ?? []
  const term = search.trim().toLocaleLowerCase(i18n.language)
  const filtered = term
    ? items.filter((item) =>
        [
          item.plan?.applicationName,
          item.plan?.planName,
          item.softwareName,
          item.requestId,
          item.requester.fullName,
          item.costCenter.code
        ].some((value) => value?.toLocaleLowerCase(i18n.language).includes(term))
      )
    : items
  return (
    <ApprovalsPage
      title={translate('queue')}
      description={
        query.data?.data ? translate('queueTotal', { count: query.data.data.pagination.totalItems }) : undefined
      }
    >
      <ApprovalsToolbar>
        <ApprovalsSearch
          label={translate('pageSearch')}
          placeholder={translate('pagePlaceholder')}
          value={search}
          onChange={setSearch}
        />
      </ApprovalsToolbar>
      <p className='text-xs text-muted-foreground'>{translate('pageScope')}</p>
      <ApprovalsQueryState query={query}>
        <ApprovalsTable
          items={filtered}
          rowKey={(item) => item.stepId}
          onOpen={(item) => onSelectTab('request', { id: item.requestId })}
          columns={[
            {
              key: 'software',
              label: translate('software'),
              render: (item) => (
                <span title={item.plan?.applicationName ?? item.softwareName ?? item.requestId}>
                  {item.plan?.applicationName ?? item.softwareName ?? item.requestId}
                </span>
              )
            },
            {
              key: 'requester',
              label: translate('requester'),
              render: (item) => <span title={item.requester.fullName}>{item.requester.fullName}</span>
            },
            { key: 'costCenter', label: translate('costCenter'), render: (item) => item.costCenter.code },
            {
              key: 'amount',
              label: translate('amount'),
              numeric: true,
              render: (item) => (item.amount ? formatMoney(item.amount, i18n.language) : translate('unavailable'))
            },
            { key: 'check', label: translate('check'), render: (item) => <ApprovalsStatus value={item.primaryCode} /> },
            {
              key: 'batch',
              label: translate('batchId'),
              numeric: true,
              render: (item) =>
                item.batchId ? (
                  <Link
                    className='text-primary underline-offset-4 hover:underline'
                    title={item.batchId}
                    to={`?tab=batch&id=${encodeURIComponent(item.batchId)}`}
                  >
                    {translate('batchLink')}
                  </Link>
                ) : (
                  translate('unavailable')
                )
            },
            {
              key: 'dueOn',
              label: translate('dueOn'),
              numeric: true,
              render: (item) => formatDate(item.dueOn)
            },
            {
              key: 'openedAt',
              label: translate('openedAt'),
              numeric: true,
              render: (item) => formatDate(item.openedAt)
            }
          ]}
        />
        <ApprovalsPagination
          pagination={query.data?.data?.pagination}
          onPageChange={(nextPage) => {
            setSearch('')
            setPage(nextPage)
          }}
        />
      </ApprovalsQueryState>
      <ApprovalsSection title={translate('lookupTitle')}>
        <div className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 md:grid-cols-2'>
          <LookupForm
            label={translate('openId')}
            placeholder={translate('idPlaceholder')}
            submitLabel={translate('open')}
            onOpen={(id) => onSelectTab('request', { id })}
          />
          <LookupForm
            label={translate('batchId')}
            placeholder={translate('batchPlaceholder')}
            submitLabel={translate('batchOpen')}
            onOpen={(id) => onSelectTab('batch', { id })}
          />
        </div>
      </ApprovalsSection>
    </ApprovalsPage>
  )
}
