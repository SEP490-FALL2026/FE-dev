import { Building2, TriangleAlert, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDashboardFormat } from '../../../dashboard-ui'
import { groupDepartmentIssues, organizationFacts, setupProgress, type SetupStep } from '../overview-model'

export function SetupSummary({ steps }: { steps: SetupStep[] }) {
  const { t: translate } = useTranslation('admin')
  const { formatNumber } = useDashboardFormat()
  const progress = setupProgress(steps)
  const facts = organizationFacts(steps)
  const departments = groupDepartmentIssues(steps)
  return (
    <div className='space-y-4'>
      <section
        className='admin-overview-surface space-y-3 rounded-lg p-4 sm:p-5'
        aria-label={translate('overview.redesign.readiness')}
      >
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div className='min-w-0 flex-1 basis-56'>
            <h2 className='text-base font-semibold leading-tight tracking-tight [text-wrap:balance]'>
              {translate(
                progress.total && progress.complete === progress.total
                  ? 'overview.redesign.readyTitle'
                  : 'overview.redesign.inProgressTitle'
              )}
            </h2>
            <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
              {progress.total
                ? translate('overview.redesign.progressSummary', { complete: progress.complete, total: progress.total })
                : translate('overview.redesign.noProgress')}
            </p>
          </div>
          {progress.percent !== null && (
            <p className='shrink-0 text-right font-mono text-xl font-semibold tabular-nums'>
              {translate('overview.redesign.percent', { value: progress.percent })}
            </p>
          )}
        </div>
        {progress.percent !== null && (
          <div
            role='progressbar'
            aria-label={translate('overview.redesign.progressLabel')}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress.percent}
            aria-valuetext={translate('overview.redesign.progressSummary', {
              complete: progress.complete,
              total: progress.total
            })}
            className='h-1.5 overflow-hidden rounded-sm bg-surface-subtle'
          >
            <div className='h-full bg-primary' style={{ width: `${progress.percent}%` }} />
          </div>
        )}
      </section>
      <dl className='kpi-tone-grid grid grid-cols-1 gap-3 sm:grid-cols-3'>
        {[
          {
            key: 'activeDepartments',
            label: translate('overview.facts.activeDepartments'),
            value: facts?.activeDepartments,
            icon: Building2
          },
          {
            key: 'activeEmployees',
            label: translate('overview.facts.activeEmployees'),
            value: facts?.activeEmployees,
            icon: Users
          },
          {
            key: 'attention',
            label: translate('overview.redesign.departmentsNeedingAttention'),
            value: steps.length ? departments.length : undefined,
            icon: TriangleAlert
          }
        ].map(({ key, label, value, icon: Icon }) => (
          <div key={key} className='admin-overview-surface rounded-lg p-4 sm:p-5'>
            <div className='flex min-h-10 items-start justify-between gap-3'>
              <dt className='max-w-40 text-sm leading-snug text-muted-foreground'>{label}</dt>
              <span
                className='kpi-chip grid size-10 shrink-0 place-items-center rounded-lg'
                data-tone={key === 'attention' && value ? 'warning' : undefined}
              >
                <Icon aria-hidden strokeWidth={1.5} className='size-5' />
              </span>
            </div>
            <dd
              className={`mt-3 text-right font-mono text-2xl font-semibold tracking-tight tabular-nums ${key === 'attention' && value ? 'text-warning-ink' : 'text-foreground'}`}
            >
              {value === undefined ? translate('overview.redesign.notReported') : formatNumber(value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
