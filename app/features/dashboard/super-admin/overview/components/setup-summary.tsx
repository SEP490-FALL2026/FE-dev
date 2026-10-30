import { Building2, CircleCheck, ShieldCheck, TriangleAlert, Users } from 'lucide-react'
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
        className='admin-overview-hero relative overflow-hidden rounded-lg px-6 py-6 sm:px-8 sm:py-7'
        aria-label={translate('overview.redesign.readiness')}
      >
        <div className='flex items-center justify-between gap-4 sm:gap-6'>
          <div className='min-w-0 max-w-lg'>
            <div className='mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-widest opacity-75'>
              <ShieldCheck aria-hidden strokeWidth={1.5} className='size-4' />
              {translate('overview.redesign.organizationHealth')}
            </div>
            <h2 className='text-xl font-semibold leading-tight tracking-tight [text-wrap:balance] sm:text-2xl'>
              {translate(
                progress.total && progress.complete === progress.total
                  ? 'overview.redesign.readyTitle'
                  : 'overview.redesign.inProgressTitle'
              )}
            </h2>
            <p className='mt-3 max-w-md text-sm leading-relaxed opacity-75'>
              {progress.total
                ? translate('overview.redesign.progressSummary', { complete: progress.complete, total: progress.total })
                : translate('overview.redesign.noProgress')}
            </p>
            <div className='mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs'>
              <span className='flex items-center gap-1.5'>
                <CircleCheck aria-hidden strokeWidth={1.5} className='size-4 text-success' />
                {translate('overview.redesign.completedStages', { count: progress.complete })}
              </span>
              <span className='flex items-center gap-1.5'>
                <span aria-hidden className='size-2 rounded-full bg-primary' />
                {translate('overview.redesign.remainingStages', { count: progress.total - progress.complete })}
              </span>
            </div>
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
              className='relative grid size-24 shrink-0 place-items-center self-center sm:size-36'
            >
              <svg aria-hidden viewBox='0 0 120 120' className='absolute inset-0 size-full -rotate-90'>
                <circle cx='60' cy='60' r='52' fill='none' stroke='currentColor' strokeOpacity='0.12' strokeWidth='7' />
                <circle
                  cx='60'
                  cy='60'
                  r='52'
                  fill='none'
                  stroke='var(--theme-primary)'
                  strokeWidth='7'
                  strokeLinecap='round'
                  pathLength='100'
                  strokeDasharray={`${progress.percent} 100`}
                />
              </svg>
              <div className='text-center'>
                <p className='font-mono text-2xl font-semibold tabular-nums sm:text-3xl'>
                  {translate('overview.redesign.percent', { value: progress.percent })}
                </p>
                <p className='mt-1 text-xs opacity-75'>{translate('overview.redesign.completeLabel')}</p>
              </div>
            </div>
          )}
        </div>
      </section>
      <dl className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
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
              <Icon
                aria-hidden
                strokeWidth={1.5}
                className={`size-5 shrink-0 ${key === 'attention' && value ? 'text-warning-ink' : 'text-primary-ink'}`}
              />
            </div>
            <dd
              className={`mt-4 text-right font-mono text-3xl font-semibold tracking-tight tabular-nums ${key === 'attention' && value ? 'text-warning-ink' : 'text-foreground'}`}
            >
              {value === undefined ? translate('overview.redesign.notReported') : formatNumber(value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
