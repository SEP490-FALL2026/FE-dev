import { useId, useState } from 'react'
import { ArrowRight, Check, ChevronDown, CircleDashed, LockKeyhole, Minus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { SuperAdminSelectTab } from '../../super-admin-nav'
import { adminButtonClass } from '../../shared/components/admin-form'
import { AdminEmpty } from '../../shared/components/admin-query-state'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { SetupStep } from '../overview-model'
import { SETUP_STATUS } from '../enums/setup-status'

function SetupStage({ step, onSelectTab }: { step: SetupStep; onSelectTab: SuperAdminSelectTab }) {
  const { t: translate } = useTranslation('admin')
  const { formatNumber } = useDashboardFormat()
  const [open, setOpen] = useState(step.step === 1 && step.status !== SETUP_STATUS.DONE)
  const sectionId = useId()
  const triggerId = useId()
  const done = step.status === SETUP_STATUS.DONE
  const unavailable = step.status === SETUP_STATUS.NOT_AVAILABLE
  const Icon = done ? Check : unavailable ? Minus : step.status === SETUP_STATUS.BLOCKED ? LockKeyhole : CircleDashed
  const facts = step.facts
  const stats: Array<[string, number]> = []
  if (facts && 'applications' in facts) stats.push([translate('overview.redesign.applications'), facts.applications])
  if (facts && 'plans' in facts)
    stats.push(
      [translate('overview.redesign.plans'), facts.plans],
      [translate('overview.redesign.subscriptions'), facts.subscriptions]
    )
  if (facts && 'assignments' in facts) stats.push([translate('overview.redesign.assignments'), facts.assignments])
  if (facts && 'activeDepartments' in facts)
    stats.push(
      [translate('overview.facts.activeDepartments'), facts.activeDepartments],
      [translate('overview.facts.activeEmployees'), facts.activeEmployees],
      [translate('overview.facts.departmentsWithoutCostCenter'), facts.departmentsWithoutCostCenter]
    )
  return (
    <li className='relative pb-5 pl-12 last:pb-0'>
      <span
        aria-hidden
        className={`absolute top-1 left-0 z-10 grid size-8 place-items-center rounded-md border ${done ? 'border-success/25 bg-success/10 text-success-ink' : unavailable ? 'border-border bg-surface-subtle text-muted-foreground' : 'border-primary/25 bg-primary-soft text-primary-ink'}`}
      >
        <Icon strokeWidth={1.5} className='size-4' />
      </span>
      <button
        type='button'
        id={triggerId}
        aria-expanded={open}
        aria-controls={sectionId}
        onClick={() => setOpen(!open)}
        className='flex min-h-11 w-full items-start justify-between gap-3 rounded-md py-1 text-left outline-offset-4 hover:text-primary-ink focus-visible:outline-2 focus-visible:outline-primary'
      >
        <span>
          <span className='block text-sm font-semibold'>
            {translate(`overview.stepNames.${step.step}`, { defaultValue: step.key })}
          </span>
          <span className={`mt-1 block text-xs ${done ? 'text-success-ink' : 'text-muted-foreground'}`}>
            {translate(`overview.setupStates.${step.status}`, { defaultValue: translate('unknown') })}
          </span>
        </span>
        <ChevronDown
          aria-hidden
          strokeWidth={1.5}
          className={`mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={sectionId}
        role='region'
        aria-label={translate(`overview.stepNames.${step.step}`, { defaultValue: step.key })}
        hidden={!open}
        className='mt-3 space-y-3 rounded-md bg-surface-subtle/70 p-4'
      >
        {!!stats.length && (
          <dl className='grid gap-3 sm:grid-cols-2'>
            {stats.map(([label, value]) => (
              <div key={label} className='flex items-start justify-between gap-4 text-sm'>
                <dt className='text-muted-foreground'>{label}</dt>
                <dd className='text-right font-mono font-medium tabular-nums'>{formatNumber(value)}</dd>
              </div>
            ))}
          </dl>
        )}
        {facts && 'closed' in facts && (
          <p className='text-sm text-muted-foreground'>
            {translate(facts.closed ? 'overview.redesign.baselineClosed' : 'overview.redesign.baselineOpen')}
          </p>
        )}
        {step.reasons.map((reason) => (
          <p key={reason} className='text-sm leading-relaxed text-muted-foreground'>
            {translate(`overview.setupReasons.${reason}`, { defaultValue: translate('overview.missing') })}
          </p>
        ))}
        <p className='text-xs font-medium text-muted-foreground'>
          {translate(
            unavailable
              ? 'overview.redesign.unreleasedStage'
              : step.step === 1
                ? 'overview.redesign.ownerSuperAdmin'
                : 'overview.redesign.ownerItAdmin'
          )}
        </p>
        {step.step === 1 && step.reasons.includes('NO_DEPARTMENT') && (
          <button
            type='button'
            className={adminButtonClass}
            onClick={() => onSelectTab('departments', { action: 'create' })}
          >
            {translate('overview.redesign.createDepartment')}
            <ArrowRight aria-hidden strokeWidth={1.5} className='size-4' />
          </button>
        )}
        {step.step === 1 &&
          (step.reasons.includes('NO_EMPLOYEE') || (facts && 'latestImport' in facts && facts.latestImport)) && (
            <button
              type='button'
              className={adminButtonClass}
              onClick={() =>
                onSelectTab('personnel', {
                  section: 'imports',
                  ...(facts && 'latestImport' in facts && facts.latestImport ? { importId: facts.latestImport.id } : {})
                })
              }
            >
              {translate(
                facts && 'latestImport' in facts && facts.latestImport
                  ? 'overview.redesign.reviewImport'
                  : 'overview.redesign.importEmployees'
              )}
              <ArrowRight aria-hidden strokeWidth={1.5} className='size-4' />
            </button>
          )}
      </div>
    </li>
  )
}

export function SetupChecklist({ steps, onSelectTab }: { steps: SetupStep[]; onSelectTab: SuperAdminSelectTab }) {
  const { t: translate } = useTranslation('admin')
  return (
    <section className='admin-overview-surface rounded-lg p-5 sm:p-6' aria-labelledby='admin-setup-checklist'>
      <h2 id='admin-setup-checklist' className='text-base font-semibold'>
        {translate('overview.checklist')}
      </h2>
      <p className='mt-1.5 text-sm text-muted-foreground'>{translate('overview.redesign.expandHint')}</p>
      {steps.length ? (
        <ol className='relative mt-6 before:absolute before:top-4 before:bottom-6 before:left-4 before:border-l before:border-border'>
          {steps.map((step) => (
            <SetupStage key={step.step} step={step} onSelectTab={onSelectTab} />
          ))}
        </ol>
      ) : (
        <AdminEmpty />
      )}
    </section>
  )
}
