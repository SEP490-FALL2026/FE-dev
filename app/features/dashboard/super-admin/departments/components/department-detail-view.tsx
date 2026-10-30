import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartmentGet, useDepartmentMemberList } from '~/shared/api/generated/operations/departments'
import { useDashboardFormat } from '../../../dashboard-ui'
import { AdminQueryState, AdminEmpty } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { adminButtonClass } from '../../shared/components/admin-form'
import { DepartmentStatus } from '../enums/department-status'
import { DepartmentWarning } from '../enums/department-warning'
import { MemberStatus } from '../enums/member-status'
import { MemberWorkState } from '../enums/member-work-state'
import { DepartmentForm } from './department-form'
import { DepartmentActionForm, type DepartmentAction } from './department-action-form'
import { ProjectsPanel } from './projects-panel'

export function DepartmentDetailView({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate } = useTranslation('adminOrganization')
  const { formatDate, formatNumber } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [action, setAction] = useState<DepartmentAction | 'edit' | null>(null)
  const [tab, setTab] = useState<'members' | 'projects'>('members')
  const query = useDepartmentGet(id)
  const members = useDepartmentMemberList(id, { page, pageSize: 20 })
  const department = query.data?.data
  const active = department?.status === DepartmentStatus.ACTIVE
  return (
    <div className='grid gap-6'>
      <button type='button' className={`${adminButtonClass} justify-self-start`} onClick={onBack}>
        {translate('back')}
      </button>
      <AdminQueryState query={query}>
        {!department && <AdminEmpty />}
        {department && (
          <>
            <header className='flex flex-wrap items-start justify-between gap-4'>
              <div>
                <p className='font-mono text-sm text-muted-foreground'>{department.code}</p>
                <h1 className='text-2xl font-semibold'>{department.name}</h1>
                <p className='mt-2 max-w-3xl whitespace-pre-wrap text-sm text-muted-foreground'>
                  {department.function}
                </p>
              </div>
              {active && (
                <details className='relative'>
                  <summary className={`${adminButtonClass} cursor-pointer`}>{translate('actionsLabel')}</summary>
                  <div className='absolute right-0 z-10 mt-2 grid min-w-60 gap-1 rounded-md border border-border bg-surface p-2 shadow-lg'>
                    <button className={adminButtonClass} type='button' onClick={() => setAction('edit')}>
                      {translate('editDepartment')}
                    </button>
                    <button className={adminButtonClass} type='button' onClick={() => setAction('assignHead')}>
                      {translate('actions.assignHead')}
                    </button>
                    {department.head && (
                      <button className={adminButtonClass} type='button' onClick={() => setAction('vacateHead')}>
                        {translate('actions.vacateHead')}
                      </button>
                    )}
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
            <dl className='grid gap-5 rounded-lg border border-border p-5 sm:grid-cols-2 lg:grid-cols-3'>
              {[
                [
                  translate('status'),
                  Object.values(DepartmentStatus).includes(department.status)
                    ? translate(`departmentStatus.${department.status}`)
                    : translate('unknown')
                ],
                [translate('head'), department.head?.fullName ?? translate('unassigned')],
                [
                  translate('successor'),
                  department.successor
                    ? `${department.successor.fullName} · ${formatDate(department.successor.since)}`
                    : translate('unassigned')
                ],
                [translate('itAdmin'), department.itAdmin?.fullName ?? translate('unassigned')],
                [translate('costCenter'), department.costCenter?.name ?? translate('unassigned')],
                [translate('members'), formatNumber(department.memberCount)]
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className='text-sm text-muted-foreground'>{label}</dt>
                  <dd className='mt-1 font-medium'>{value}</dd>
                </div>
              ))}
            </dl>
            {!!department.warnings.length && (
              <ul className='list-inside list-disc text-sm text-warning'>
                {department.warnings.map((warning) => (
                  <li key={warning}>
                    {Object.values(DepartmentWarning).includes(warning)
                      ? translate(`warnings.${warning}`)
                      : translate('unknown')}
                  </li>
                ))}
              </ul>
            )}
            <section className='grid gap-3'>
              <h2 className='font-semibold'>{translate('headHistory')}</h2>
              {!department.headHistory.length && (
                <p className='text-sm text-muted-foreground'>{translate('noHistory')}</p>
              )}
              {department.headHistory.map((head) => (
                <div
                  key={`${head.employeeId}-${head.validFrom}`}
                  className='flex flex-wrap justify-between gap-3 border-b border-border py-2 text-sm'
                >
                  <span>
                    {head.fullName} · {head.employeeCode}
                  </span>
                  <span className='font-mono tabular-nums'>
                    {formatDate(head.validFrom)} · {head.validTo ? formatDate(head.validTo) : translate('ongoing')}
                  </span>
                </div>
              ))}
              {department.headHistoryHasMore && (
                <p className='text-sm text-muted-foreground'>{translate('historyLimited')}</p>
              )}
            </section>
            <nav className='flex gap-3 border-b border-border pb-3'>
              {(['members', 'projects'] as const).map((value) => (
                <button
                  key={value}
                  type='button'
                  aria-pressed={tab === value}
                  className={adminButtonClass}
                  onClick={() => setTab(value)}
                >
                  {translate(value)}
                </button>
              ))}
            </nav>
            {tab === 'members' ? (
              <section className='grid gap-4'>
                <p className='text-sm text-muted-foreground'>{translate('membersHelp')}</p>
                <AdminQueryState query={members}>
                  {!members.data?.data?.items.length && <AdminEmpty />}
                  <div className='grid gap-3'>
                    {members.data?.data?.items.map((member) => (
                      <article
                        key={member.employeeCode}
                        className='flex flex-wrap justify-between gap-3 rounded-md border border-border p-4 text-sm'
                      >
                        <div>
                          <h3 className='font-medium'>{member.fullName}</h3>
                          <p className='font-mono text-muted-foreground'>{member.employeeCode}</p>
                          <p>
                            {Object.values(MemberStatus).includes(member.status)
                              ? translate(`memberStatus.${member.status}`)
                              : translate('unknown')}{' '}
                            ·{' '}
                            {Object.values(MemberWorkState).includes(member.workState)
                              ? translate(`workState.${member.workState}`)
                              : translate('unknown')}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-mono tabular-nums'>{formatDate(member.memberSince)}</p>
                          <p>{translate(member.hasWorkEmail ? 'hasEmail' : 'noEmail')}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                  <AdminPagination
                    pagination={members.data?.data?.pagination}
                    onPageChange={setPage}
                    disabled={members.isFetching}
                  />
                </AdminQueryState>
              </section>
            ) : (
              <ProjectsPanel departmentId={id} />
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
