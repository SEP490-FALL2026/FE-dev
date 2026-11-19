import { useTranslation } from 'react-i18next'
import { ArrowLeft, Boxes, CheckCircle2, MessageSquare } from 'lucide-react'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { useSaasIssueGet } from '~/shared/api/generated/operations/saas-issues/saas-issue-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  EmployeeButton,
  EmployeeQueryState,
  EmployeeSection,
  EmployeeStatus
} from '../../shared/components/employee-api-ui'

export function EmployeeIssueDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate } = useTranslation('employee')
  const { formatDateTime } = useDashboardFormat()
  const query = useSaasIssueGet(id, { query: { enabled: !!id } })
  const issue = !query.isError ? query.data?.data : undefined
  return (
    <div className='space-y-6'>
      <EmployeePageHeader
        title={translate('issueDetail')}
        icon={MessageSquare}
        actions={
          <EmployeeButton onClick={onBack}>
            <ArrowLeft aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('back')}
          </EmployeeButton>
        }
      />
      <div className='w-full max-w-5xl'>
        <div className='min-w-0'>
          <EmployeeSection title={issue?.plan.applicationName ?? translate('redesign.softwareDetails')}>
            <EmployeeQueryState query={query} empty={!issue} />
            {issue && (
              <div className='space-y-5'>
                {/* Spotlight Banner */}
                <div className='flex items-center gap-3.5 rounded-xl border border-border/60 bg-surface-subtle/50 p-4'>
                  <span
                    aria-hidden='true'
                    className='grid size-12 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft text-primary-ink'
                  >
                    <Boxes strokeWidth={1.5} className='size-6' />
                  </span>
                  <div className='min-w-0 flex-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <h2 className='truncate text-lg font-bold text-foreground' title={issue.plan.applicationName}>
                        {issue.plan.applicationName}
                      </h2>
                      <EmployeeStatus value={issue.state} />
                    </div>
                    <p className='truncate font-mono text-xs text-muted-foreground' title={issue.code}>
                      {issue.code}
                    </p>
                  </div>
                </div>

                {/* Issue Description */}
                <dl className='space-y-1.5'>
                  <dt className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    {translate('description')}
                  </dt>
                  <dd className='rounded-xl border border-border/60 bg-surface-subtle/50 p-4 text-sm leading-relaxed text-foreground'>
                    <p className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{issue.description}</p>
                  </dd>
                </dl>

                {/* Resolution Callout if resolved */}
                {issue.resolution && (
                  <div
                    role='status'
                    className='flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4 text-success-ink'
                  >
                    <CheckCircle2 strokeWidth={1.5} className='mt-0.5 size-5 shrink-0 text-success' />
                    <div className='min-w-0 flex-1 space-y-1'>
                      <h3 className='text-xs font-semibold uppercase tracking-wider text-success'>
                        {translate('resolution')}
                      </h3>
                      <p className='whitespace-pre-wrap text-sm leading-relaxed [overflow-wrap:anywhere]'>
                        {issue.resolution}
                      </p>
                    </div>
                  </div>
                )}

                {/* Issue Details List */}
                <dl className='space-y-3 rounded-xl border border-border/60 bg-surface p-4 text-sm'>
                  <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5'>
                    <dt className='text-xs text-muted-foreground'>{translate('category')}</dt>
                    <dd className='text-sm font-medium'>
                      {translate(`statuses.${issue.category}`, { defaultValue: translate('noValue') })}
                    </dd>
                  </div>
                  <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5'>
                    <dt className='text-xs text-muted-foreground'>{translate('impact')}</dt>
                    <dd className='text-sm font-medium'>
                      {translate(`statuses.${issue.impact}`, { defaultValue: translate('noValue') })}
                    </dd>
                  </div>
                  <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5'>
                    <dt className='text-xs text-muted-foreground'>{translate('occurredAt')}</dt>
                    <dd className='font-mono text-xs tabular-nums text-foreground'>
                      {formatDateTime(issue.occurredAt)}
                    </dd>
                  </div>
                  <div className='flex flex-wrap items-center justify-between gap-2 pb-1'>
                    <dt className='text-xs text-muted-foreground'>{translate('dueOn')}</dt>
                    <dd className='font-mono text-xs tabular-nums text-foreground'>
                      {formatDateTime(issue.responseDueOn)}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </EmployeeSection>
        </div>
      </div>
    </div>
  )
}
