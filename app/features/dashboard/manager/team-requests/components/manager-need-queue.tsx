import { Boxes, Filter } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useNeedDecisionList } from '~/shared/api/generated/operations/need-decisions/need-decision-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import {
  ManagerField,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { NEED_QUEUE_TYPE } from '../enums/need-queue-type'

export function ManagerNeedQueue({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate } = useTranslation('manager')
  const { t: employeeTranslate } = useTranslation('employee')
  const { formatDate, formatNumber } = useDashboardFormat()
  const [params, setParams] = useSearchParams()
  const paging = useManagerPage('needPage')
  const type = Object.values(NEED_QUEUE_TYPE).find((value) => value === params.get('needType'))
  const query = useNeedDecisionList({ page: paging.page, pageSize: paging.pageSize, ...(type ? { type } : {}) })
  const data = !query.isError ? query.data?.data : null
  return (
    <ManagerSection title={translate('needQueue')}>
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-surface-subtle/50 p-3.5'>
        <div className='flex items-center gap-2'>
          <span
            aria-hidden='true'
            className='grid size-8 shrink-0 place-items-center rounded-lg border border-border/60 bg-surface text-muted-foreground'
          >
            <Filter strokeWidth={1.5} className='size-4' />
          </span>
          <span className='text-xs font-semibold text-foreground'>{translate('integration.requestType')}</span>
        </div>
        <div className='w-full sm:w-64'>
          <select
            aria-label={translate('integration.requestType')}
            className={managerInputClass}
            value={type ?? ''}
            onChange={(event) =>
              setParams((previous) => {
                const next = new URLSearchParams(previous)
                if (event.target.value) next.set('needType', event.target.value)
                else next.delete('needType')
                next.set('needPage', '1')
                return next
              })
            }
          >
            <option value=''>{translate('all')}</option>
            {Object.values(NEED_QUEUE_TYPE).map((value) => (
              <option key={value} value={value}>
                {employeeTranslate(`statuses.${value}`, {
                  defaultValue: translate('unknownStatus')
                })}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ManagerDataTable
        label={translate('needQueue')}
        items={data?.items ?? []}
        rowKey={(row) => row.stepId}
        onOpen={(row) => onOpen(row.requestId)}
        emptyState={
          <ManagerQueryState query={query} empty={!data?.items.length} emptyTitle={translate('integration.noNeed')} />
        }
        columns={[
          {
            key: 'software',
            label: translate('application'),
            render: (row) => (
              <div className='flex items-center gap-3'>
                <span
                  aria-hidden='true'
                  className='grid size-8 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary-soft text-primary-ink'
                >
                  <Boxes strokeWidth={1.5} className='size-4' />
                </span>
                <div className='min-w-0'>
                  <p
                    className='max-w-64 truncate font-medium text-foreground'
                    title={row.plan?.applicationName ?? row.softwareName ?? undefined}
                  >
                    {row.plan?.applicationName ?? row.softwareName ?? translate('notReported')}
                  </p>
                  <p className='max-w-64 truncate text-xs text-muted-foreground' title={row.businessReasonExcerpt}>
                    {row.businessReasonExcerpt}
                  </p>
                </div>
              </div>
            )
          },
          {
            key: 'requester',
            label: translate('integration.requester'),
            render: (row) => (
              <p className='max-w-48 truncate' title={row.requester.fullName}>
                {row.requester.fullName}
              </p>
            )
          },
          {
            key: 'beneficiary',
            label: translate('participants'),
            render: (row) => (
              <p className='max-w-48 truncate' title={row.beneficiary?.fullName}>
                {row.beneficiary?.fullName ??
                  translate('integration.people', { count: row.lineCount, number: formatNumber(row.lineCount) })}
              </p>
            )
          },
          { key: 'due', label: translate('integration.dueOn'), align: 'right', render: (row) => formatDate(row.dueOn) },
          {
            key: 'status',
            label: translate('status'),
            render: (row) => (
              <ManagerStatus value={row.stepKind === 'NEED' ? 'AWAITING_NEED' : (row.stepKind ?? 'AWAITING_NEED')} />
            )
          }
        ]}
      />
      <ManagerPagination pagination={data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </ManagerSection>
  )
}
