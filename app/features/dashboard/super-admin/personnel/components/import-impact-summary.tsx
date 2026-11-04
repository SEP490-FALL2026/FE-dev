import { useTranslation } from 'react-i18next'
import { TriangleAlert, UsersRound } from 'lucide-react'
import type { EmployeeImportResponseDtoDataSummary } from '~/shared/api/generated/model/employee-imports'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

export function ImportImpactSummary({ summary }: { summary: EmployeeImportResponseDtoDataSummary }) {
  const { t: translate } = useTranslation('adminPersonnel')
  const { formatNumber } = useWorkspaceFormat()
  return (
    <section aria-label={translate('importImpact.title')} className='grid gap-4 border-t border-border/70 pt-4'>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <dl>
            <dt className='text-sm text-muted-foreground'>{translate('importImpact.unplaced')}</dt>
            <dd className='mt-1 text-right font-mono text-2xl font-semibold tabular-nums'>
              {formatNumber(summary.newUnplaced)}
            </dd>
          </dl>
          {summary.newUnplaced > 0 && (
            <p className='text-xs text-muted-foreground'>{translate('importImpact.unplacedHelp')}</p>
          )}
        </div>
        {summary.newPeopleByDepartment.length > 0 && (
          <div className='space-y-2'>
            <h4 className='text-sm font-medium'>{translate('importImpact.byDepartment')}</h4>
            <dl className='divide-y divide-border/60'>
              {summary.newPeopleByDepartment.map((department) => (
                <div key={department.departmentCode} className='flex items-center justify-between gap-4 py-2 text-sm'>
                  <dt title={department.departmentCode} className='max-w-48 truncate font-mono text-xs'>
                    {department.departmentCode}
                  </dt>
                  <dd className='text-right font-mono tabular-nums'>{formatNumber(department.count)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
      {summary.departmentsWithoutHead.length > 0 && (
        <section className='space-y-2 rounded-md bg-warning/10 p-3'>
          <h4 className='flex items-center gap-2 text-sm font-medium text-warning-ink'>
            <TriangleAlert aria-hidden strokeWidth={1.5} className='size-4 shrink-0' />
            {translate('importImpact.missingHeads')}
          </h4>
          <p className='text-xs text-muted-foreground'>{translate('importImpact.missingHeadsHelp')}</p>
          <ul className='grid gap-2'>
            {summary.departmentsWithoutHead.map((department) => (
              <li key={department.code} className='flex min-w-0 items-center justify-between gap-3 text-sm'>
                <span title={department.name} className='truncate'>
                  {department.name}
                </span>
                <span title={department.code} className='max-w-32 truncate text-right font-mono text-xs'>
                  {department.code}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {summary.reviewQueue.total > 0 && (
        <details className='rounded-md border border-border/70'>
          <summary className='min-h-11 cursor-pointer rounded-md px-3 py-3 text-sm font-medium outline-none transition-colors hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-primary'>
            <span className='inline-flex items-center gap-2'>
              <UsersRound aria-hidden strokeWidth={1.5} className='size-4' />
              {translate('importImpact.reviewTitle', { count: summary.reviewQueue.total })}
            </span>
          </summary>
          <div className='space-y-3 border-t border-border/70 p-3'>
            <p className='text-sm text-muted-foreground'>{translate('importImpact.reviewHelp')}</p>
            <p className='text-xs text-muted-foreground'>
              {translate('importImpact.reviewShown', {
                shown: formatNumber(summary.reviewQueue.items.length),
                total: formatNumber(summary.reviewQueue.total)
              })}
            </p>
            <ul className='divide-y divide-border/60'>
              {summary.reviewQueue.items.map((employee) => (
                <li
                  key={employee.employeeCode}
                  className='flex min-w-0 items-center justify-between gap-4 py-2 text-sm'
                >
                  <span className='min-w-0'>
                    <span title={employee.fullName} className='block truncate font-medium'>
                      {employee.fullName}
                    </span>
                    <span
                      title={employee.employeeCode}
                      className='block truncate font-mono text-xs text-muted-foreground'
                    >
                      {employee.employeeCode}
                    </span>
                  </span>
                  <span className='shrink-0 text-right font-mono text-xs tabular-nums'>
                    {translate('importImpact.seats', { count: employee.seats })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}
    </section>
  )
}
