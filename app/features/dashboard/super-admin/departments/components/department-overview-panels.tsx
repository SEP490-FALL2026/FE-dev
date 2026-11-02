import { Building2, History, LoaderCircle, ShieldCheck, TriangleAlert } from 'lucide-react'
import type { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import type { DepartmentResponseDtoData } from '~/shared/api/generated/model'
import { useDashboardFormat } from '../../../dashboard-ui'
import { DepartmentWarning } from '../enums/department-warning'
import { DepartmentSection } from './department-section'
import { adminButtonClass } from '../../shared/components/admin-form'

export function DepartmentOverviewPanels({
  department,
  onViewHistory,
  historyOpening,
  historyOpen
}: {
  department: NonNullable<DepartmentResponseDtoData>
  onViewHistory: MouseEventHandler<HTMLButtonElement>
  historyOpening: boolean
  historyOpen: boolean
}) {
  const { t: translate } = useTranslation('adminOrganization')
  const { formatDate } = useDashboardFormat()
  return (
    <>
      <div className='grid items-start gap-5 lg:grid-cols-2'>
        <DepartmentSection title={translate('departmentDetails')} icon={Building2}>
          <dl className='grid gap-5'>
            <div>
              <dt className='text-xs font-medium text-muted-foreground'>{translate('function')}</dt>
              <dd className='mt-2 whitespace-pre-wrap text-sm leading-relaxed [overflow-wrap:anywhere]'>
                {department.function || translate('noFunction')}
              </dd>
            </div>
            <div className='border-t border-border/70 pt-4'>
              <dt className='text-xs font-medium text-muted-foreground'>{translate('costCenter')}</dt>
              <dd
                className='mt-2 truncate text-sm font-semibold'
                title={department.costCenter?.name ?? translate('unassigned')}
              >
                {department.costCenter?.name ?? translate('unassigned')}
              </dd>
            </div>
          </dl>
        </DepartmentSection>
        <DepartmentSection title={translate('responsibilities')} icon={ShieldCheck}>
          <dl className='divide-y divide-border/70'>
            {(
              [
                ['head', department.head?.fullName ?? translate('unassigned')],
                ['successor', department.successor?.fullName ?? translate('unassigned')],
                ['itAdmin', department.itAdmin?.fullName ?? translate('unassigned')]
              ] as const
            ).map(([labelKey, value]) => (
              <div
                key={labelKey}
                className='grid min-w-0 gap-1.5 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-4'
              >
                <dt className='text-sm text-muted-foreground'>{translate(labelKey)}</dt>
                <dd className='min-w-0'>
                  <p className='truncate text-sm font-semibold' title={value}>
                    {value}
                  </p>
                  {labelKey === 'successor' && department.successor && (
                    <p className='mt-1 text-xs text-muted-foreground'>
                      {translate('effectiveFrom')}:{' '}
                      <span className='font-mono tabular-nums'>{formatDate(department.successor.since)}</span>
                    </p>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <button
            type='button'
            aria-haspopup='dialog'
            aria-expanded={historyOpen}
            aria-busy={historyOpening}
            disabled={historyOpening || historyOpen}
            className={`${adminButtonClass} mt-5 w-full`}
            onClick={onViewHistory}
          >
            {historyOpening ? (
              <LoaderCircle aria-hidden className='size-4 animate-spin motion-reduce:animate-none' strokeWidth={1.5} />
            ) : (
              <History aria-hidden className='size-4' strokeWidth={1.5} />
            )}
            {translate(historyOpening ? 'openingHeadHistory' : 'viewHeadHistory')}
          </button>
        </DepartmentSection>
      </div>
      {!!department.warnings.length && (
        <DepartmentSection title={translate('needsAttention')} icon={TriangleAlert}>
          <ul className='grid gap-2 text-sm text-warning-ink'>
            {department.warnings.map((warning) => (
              <li key={warning} className='flex items-start gap-2 rounded-md bg-warning/10 px-3 py-2.5'>
                <TriangleAlert aria-hidden className='mt-0.5 size-4 shrink-0' strokeWidth={1.5} />
                {Object.values(DepartmentWarning).includes(warning)
                  ? translate(`warnings.${warning}`)
                  : translate('unknown')}
              </li>
            ))}
          </ul>
        </DepartmentSection>
      )}
    </>
  )
}
