import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { ArrowLeft, Building2, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments'
import { useDashboardFormat } from '../../../dashboard-ui'
import { AdminQueryState, AdminEmpty } from '../../shared/components/admin-query-state'
import { adminButtonClass } from '../../shared/components/admin-form'
import { DepartmentStatus } from '../enums/department-status'
import { DepartmentForm } from './department-form'
import { DepartmentOverviewPanels } from './department-overview-panels'
import { DepartmentMembersPanel } from './department-members-panel'
import { DepartmentHeadHistory } from './department-head-history'
import { DepartmentActionForm, type DepartmentAction } from './department-action-form'

export function DepartmentDetailView({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate } = useTranslation('adminOrganization')
  const { formatNumber } = useDashboardFormat()
  const [action, setAction] = useState<DepartmentAction | 'edit' | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyOpening, setHistoryOpening] = useState(false)
  const historyOpenLock = useRef(false)
  const historyTrigger = useRef<HTMLButtonElement>(null)
  const openHistory = (event: MouseEvent<HTMLButtonElement>) => {
    if (historyOpenLock.current) return
    historyTrigger.current = event.currentTarget
    historyOpenLock.current = true
    setHistoryOpening(true)
    setHistoryOpen(true)
  }
  const historyReady = useCallback(() => setHistoryOpening(false), [])
  const closeHistory = useCallback(() => {
    setHistoryOpening(false)
    setHistoryOpen(false)
  }, [])
  useEffect(() => {
    if (!historyOpen && historyOpenLock.current) {
      historyOpenLock.current = false
      historyTrigger.current?.focus()
    }
  }, [historyOpen])
  const query = useDepartmentGet(id)
  const department = query.data?.data
  const active = department?.status === DepartmentStatus.ACTIVE
  return (
    <div className='grid gap-5'>
      <button type='button' className={`${adminButtonClass} justify-self-start`} onClick={onBack}>
        <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
        {translate('back')}
      </button>
      <AdminQueryState query={query}>
        {!department && <AdminEmpty />}
        {department && (
          <>
            <header className='flex min-w-0 flex-wrap items-center gap-5 rounded-lg border border-t-4 border-border/80 border-t-primary/60 bg-surface p-5 shadow-sm sm:p-6'>
              <div className='flex w-full min-w-0 items-center gap-4 sm:w-auto sm:flex-1'>
                <span className='grid size-14 shrink-0 place-items-center rounded-md bg-primary-soft text-primary-ink'>
                  <Building2 aria-hidden className='size-7' strokeWidth={1.5} />
                </span>
                <div className='min-w-0'>
                  <p className='truncate font-mono text-xs text-muted-foreground' title={department.code}>
                    {department.code}
                  </p>
                  <h1 className='mt-1 break-words text-2xl leading-tight font-semibold tracking-tight [overflow-wrap:anywhere] [text-wrap:balance]'>
                    {department.name}
                  </h1>
                  <p className='mt-2 inline-flex items-center gap-2 text-xs font-medium'>
                    <span
                      aria-hidden
                      className={`size-1.5 rounded-full ${active ? 'bg-success' : 'bg-muted-foreground'}`}
                    />
                    {Object.values(DepartmentStatus).includes(department.status)
                      ? translate(`departmentStatus.${department.status}`)
                      : translate('unknown')}
                  </p>
                </div>
              </div>
              <div className='ml-auto border-l border-border/80 pl-5 text-right'>
                <p className='font-mono text-3xl leading-none font-semibold tabular-nums'>
                  {formatNumber(department.memberCount)}
                </p>
                <p className='mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground'>
                  <UsersRound aria-hidden className='size-3.5' strokeWidth={1.5} />
                  {translate('members')}
                </p>
              </div>
              {active && (
                <details className='relative'>
                  <summary
                    className={`${adminButtonClass} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
                  >
                    {translate('actionsLabel')}
                  </summary>
                  <div className='absolute right-0 z-10 mt-2 grid min-w-60 gap-1 rounded-md border border-border bg-surface p-2 shadow-lg'>
                    <button className={adminButtonClass} type='button' onClick={() => setAction('edit')}>
                      {translate('editDepartment')}
                    </button>
                    {department.head && !department.successor && (
                      <button
                        className={adminButtonClass}
                        type='button'
                        onClick={() => setAction('designateSuccessor')}
                      >
                        {translate('actions.designateSuccessor')}
                      </button>
                    )}
                    {department.successor && (
                      <button className={adminButtonClass} type='button' onClick={() => setAction('clearSuccessor')}>
                        {translate('actions.clearSuccessor')}
                      </button>
                    )}
                    <button
                      className={`${adminButtonClass} text-danger`}
                      type='button'
                      onClick={() => setAction('deactivate')}
                    >
                      {translate('actions.deactivate')}
                    </button>
                  </div>
                </details>
              )}
            </header>
            <DepartmentOverviewPanels
              department={department}
              onViewHistory={openHistory}
              historyOpening={historyOpening}
              historyOpen={historyOpen}
            />
            <DepartmentMembersPanel key={id} id={id} />
            {historyOpen && (
              <DepartmentHeadHistory department={department} onClose={closeHistory} onReady={historyReady} />
            )}
            {action === 'edit' && <DepartmentForm department={department} onClose={() => setAction(null)} />}
            {action && action !== 'edit' && (
              <DepartmentActionForm department={department} action={action} onClose={() => setAction(null)} />
            )}
          </>
        )}
      </AdminQueryState>
    </div>
  )
}
