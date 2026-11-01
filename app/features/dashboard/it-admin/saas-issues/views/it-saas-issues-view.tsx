import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSaasIssueList } from '~/shared/api/generated/operations/saas-issues/saas-issue-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, itInputClass, itButtonClass } from '../../shared/components/it-form'
import { ISSUE_STATE, knownIssueState, type IssueState } from '../enums/issue-state'
import { IssueDetail } from '../components/issue-detail'

export function ItSaasIssuesView({ initialIssueId }: { initialIssueId?: string }) {
  const { t: translate } = useTranslation('itIssues')
  const { formatDateTime } = useDashboardFormat()
  const [state, setState] = useState<IssueState | ''>('')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState(initialIssueId)
  const query = useSaasIssueList({ scope: 'all', page, pageSize: 20, ...(state ? { state } : {}) })
  const result = query.data?.data
  if (selectedId) return <IssueDetail id={selectedId} onClose={() => setSelectedId(undefined)} />
  return (
    <div className='space-y-5'>
      <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('title')}</h1>
      <div className='max-w-xs'>
        <ItField label={translate('state')}>
          <select
            className={itInputClass}
            value={state}
            onChange={(event) => {
              const value = event.target.value
              if (value === '') {
                setState('')
                setPage(1)
              } else if (knownIssueState(value)) {
                setState(value)
                setPage(1)
              }
            }}
          >
            <option value=''>{translate('all')}</option>
            {Object.values(ISSUE_STATE).map((value) => (
              <option key={value} value={value}>
                {translate(`states.${value}`)}
              </option>
            ))}
          </select>
        </ItField>
      </div>
      <ItQueryState query={query}>
        <div className='overflow-x-auto rounded-lg border border-border bg-surface'>
          {!result?.items.length ? (
            <ItEmpty />
          ) : (
            <table className='w-full min-w-[700px] text-sm'>
              <thead className='border-b border-border text-left text-xs text-muted-foreground'>
                <tr>
                  <th className='p-4 text-right'>{translate('code')}</th>
                  <th className='p-4'>{translate('reporter')}</th>
                  <th className='p-4'>{translate('plan')}</th>
                  <th className='p-4'>{translate('state')}</th>
                  <th className='p-4 text-right'>{translate('due')}</th>
                  <th className='p-4 text-right'>{translate('details')}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/40'>
                {result.items.map((issue) => (
                  <tr key={issue.id} className='hover:bg-surface-subtle'>
                    <td className='p-4 text-right font-mono tabular-nums'>{issue.code}</td>
                    <td className='max-w-48 truncate p-4' title={issue.reporter.fullName}>
                      {issue.reporter.fullName}
                    </td>
                    <td
                      className='max-w-56 truncate p-4'
                      title={`${issue.plan.applicationName} / ${issue.plan.planName}`}
                    >
                      {issue.plan.applicationName} / {issue.plan.planName}
                    </td>
                    <td className='p-4'>
                      {translate(`states.${knownIssueState(issue.state) ? issue.state : 'UNKNOWN'}`)}
                    </td>
                    <td className={`p-4 text-right font-mono tabular-nums ${issue.overdue ? 'text-danger' : ''}`}>
                      {formatDateTime(issue.responseDueOn)}
                    </td>
                    <td className='sticky right-0 bg-surface p-4 text-right'>
                      <button type='button' className={itButtonClass} onClick={() => setSelectedId(issue.id)}>
                        {translate('details')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {result && (
          <ItPagination
            page={page}
            total={result.pagination.totalItems}
            pageSize={20}
            onChange={setPage}
            disabled={query.isFetching}
          />
        )}
      </ItQueryState>
    </div>
  )
}
