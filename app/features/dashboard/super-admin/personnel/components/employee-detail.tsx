import { useId, useState, type ReactNode } from 'react'
import { BriefcaseBusiness, History, ShieldCheck, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { EmployeeDetailResponseDtoDataAccountRolesItem } from '~/shared/api/generated/model/employees'
import { AccountDetailResponseDtoDataInvitationDeliveryStatus } from '~/shared/api/generated/model/app-users'
import { useEmployeeGet } from '~/shared/api/generated/operations/employees/employee-get'
import { useAppUserGet } from '~/shared/api/generated/operations/app-users/app-user-get'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { AdminFormDialog, adminButtonClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { PersonnelCode } from '../../shared/components/personnel-list'
import { employeeWorkStates } from '../enums/employee-work-state'
import { EmployeePlacementForm } from './employee-placement-form'
import { EmployeeEventForm, type EmployeeEventKind } from './employee-event-form'
import { SuperAdminTransferView } from '../../transfer/views/super-admin-transfer-view'

export function EmployeeDetail({
  employeeId,
  onClose,
  onCorrect,
  renderAccountDetail
}: {
  employeeId: string
  onClose: () => void
  onCorrect: (employeeId: string) => void
  renderAccountDetail?: (id: string, onClose: () => void) => ReactNode
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const { t: translateAccounts } = useTranslation('adminAccounts')
  const { formatDate } = useWorkspaceFormat()
  const navigate = useNavigate()
  const query = useEmployeeGet(employeeId, { query: { retry: false } })
  const employee = query.data?.data
  const accountId = employee?.account?.id
  const accountQuery = useAppUserGet(accountId ?? '', { query: { enabled: !!accountId, retry: false } })
  const [placing, setPlacing] = useState(false)
  const [eventKind, setEventKind] = useState<EmployeeEventKind | null>(null)
  const [transferHistory, setTransferHistory] = useState(false)
  const [managingAccount, setManagingAccount] = useState(false)
  const sectionId = useId()
  const canPlace =
    !!employee?.unplaced &&
    employee.status === 'ACTIVE' &&
    (employee.workState === 'WORKING' || employee.workState === 'ON_LONG_LEAVE') &&
    !query.isFetching &&
    !query.isError
  if (placing && employee)
    return <EmployeePlacementForm employee={employee} blocked={!canPlace} onClose={() => setPlacing(false)} />
  if (eventKind && employee)
    return <EmployeeEventForm employee={employee} kind={eventKind} onClose={() => setEventKind(null)} />
  if (transferHistory && employee)
    return <SuperAdminTransferView employeeId={employee.id} onClose={() => setTransferHistory(false)} />
  if (managingAccount && accountId && renderAccountDetail)
    return renderAccountDetail(accountId, () => setManagingAccount(false))
  return (
    <AdminFormDialog
      page
      title={translate('directory.details')}
      wide
      pending={false}
      onClose={onClose}
      submitLabel={translate('directory.correct')}
      submitDisabled={!employee || query.isFetching || query.isError}
      onSubmit={(event) => {
        event.preventDefault()
        if (employee) onCorrect(employee.id)
      }}
    >
      <AdminQueryState query={query}>
        {!employee ? (
          <p className='text-sm text-muted-foreground'>{translate('directory.notFound')}</p>
        ) : (
          <>
            <div className='space-y-5'>
              <header className='flex min-w-0 flex-wrap items-center gap-4 rounded-lg border border-primary/20 bg-primary-soft p-5 sm:p-6'>
                <span className='grid size-12 shrink-0 place-items-center rounded-lg bg-surface text-primary-ink'>
                  <UserRound aria-hidden className='size-6' strokeWidth={1.5} />
                </span>
                <div className='min-w-0 flex-1'>
                  <h3
                    title={employee.fullName}
                    className='break-words text-xl font-semibold text-foreground sm:text-2xl'
                  >
                    {employee.fullName}
                  </h3>
                  <p className='mt-1 font-mono text-sm tabular-nums text-muted-foreground'>{employee.employeeCode}</p>
                </div>
                <div className='shrink-0 rounded-md border border-border bg-surface px-3 py-2'>
                  <PersonnelCode code={employee.workState} values={employeeWorkStates} />
                </div>
              </header>
              <div className='grid min-w-0 items-start gap-5 lg:grid-cols-2'>
                <section
                  aria-labelledby={`${sectionId}-official`}
                  className='min-w-0 space-y-5 rounded-lg border border-border bg-surface p-5'
                >
                  <h3
                    id={`${sectionId}-official`}
                    className='flex items-center gap-2 border-b border-border pb-3 text-base font-semibold text-foreground'
                  >
                    <BriefcaseBusiness aria-hidden className='size-5 text-primary-ink' strokeWidth={1.5} />
                    {translate('directory.official')}
                  </h3>
                  <dl className='grid min-w-0 gap-x-5 gap-y-5 text-sm sm:grid-cols-2'>
                    <div>
                      <dt className='text-muted-foreground'>{translate('fields.workEmail')}</dt>
                      <dd
                        title={employee.workEmail ?? undefined}
                        className='mt-1 break-all font-medium text-foreground'
                      >
                        {employee.workEmail ?? translate('directory.none')}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-muted-foreground'>{translate('fields.jobTitle')}</dt>
                      <dd
                        title={employee.jobTitle ?? undefined}
                        className='mt-1 break-words font-medium text-foreground'
                      >
                        {employee.jobTitle ?? translate('directory.none')}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-muted-foreground'>{translate('fields.employmentType')}</dt>
                      <dd className='mt-1 font-medium text-foreground'>
                        {translate(`codes.${employee.employmentType}`, { defaultValue: translate('unknown') })}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-muted-foreground'>{translate('fields.hireDate')}</dt>
                      <dd className='mt-1 font-mono font-medium tabular-nums text-foreground'>
                        {formatDate(employee.hireDate)}
                      </dd>
                    </div>
                    <div className='sm:col-span-2'>
                      <dt className='text-muted-foreground'>{translate('directory.department')}</dt>
                      <dd title={employee.department?.name} className='mt-1 break-words font-medium text-foreground'>
                        {employee.department
                          ? `${employee.department.code} · ${employee.department.name}`
                          : translate('directory.unplaced')}
                      </dd>
                    </div>
                  </dl>
                  {canPlace && (
                    <button type='button' className={adminButtonClass} onClick={() => setPlacing(true)}>
                      {translate('directory.place')}
                    </button>
                  )}
                </section>
                <section
                  aria-labelledby={`${sectionId}-account`}
                  className='min-w-0 space-y-5 rounded-lg border border-border bg-surface p-5'
                >
                  <h3
                    id={`${sectionId}-account`}
                    className='flex items-center gap-2 border-b border-border pb-3 text-base font-semibold text-foreground'
                  >
                    <ShieldCheck aria-hidden className='size-5 text-primary-ink' strokeWidth={1.5} />
                    {translate('directory.account')}
                  </h3>
                  {employee.account ? (
                    <>
                      <div className='flex flex-wrap items-center gap-2'>
                        <span
                          className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium ${employee.account.status === 'ACTIVE' ? 'bg-success/10 text-success-ink' : 'bg-surface-subtle text-foreground'}`}
                        >
                          <span
                            aria-hidden
                            className={`size-1.5 rounded-full ${employee.account.status === 'ACTIVE' ? 'bg-success' : 'bg-muted-foreground'}`}
                          />
                          {translate(
                            employee.account.status === 'ACTIVE'
                              ? 'directory.activeAccount'
                              : employee.account.status === 'LOCKED'
                                ? 'directory.lockedAccount'
                                : 'unknown'
                          )}
                        </span>
                        <span className='rounded-md bg-surface-subtle px-3 py-1.5 text-xs font-medium text-foreground'>
                          {translate(
                            employee.account.activationState === 'ACTIVATED'
                              ? 'directory.activated'
                              : employee.account.activationState === 'INVITED'
                                ? 'directory.invited'
                                : 'unknown'
                          )}
                        </span>
                      </div>
                      <dl className='text-sm'>
                        <dt className='text-muted-foreground'>{translate('directory.roles')}</dt>
                        <dd className='mt-1 font-semibold text-foreground'>
                          {employee.account.roles
                            .map((role) =>
                              Object.values(EmployeeDetailResponseDtoDataAccountRolesItem).includes(role)
                                ? translateAccounts(`roles.${role}`)
                                : translate('directory.unknownRole')
                            )
                            .join(', ') || translate('directory.none')}
                        </dd>
                      </dl>
                      <AdminQueryState query={accountQuery}>
                        {accountQuery.data?.data && (
                          <>
                            <dl className='grid min-w-0 gap-x-5 gap-y-5 text-sm sm:grid-cols-2'>
                              <div>
                                <dt className='text-muted-foreground'>{translateAccounts('loginEmail')}</dt>
                                <dd className='mt-1 break-all font-medium text-foreground'>
                                  {accountQuery.data.data.loginEmail}
                                </dd>
                              </div>
                              <div>
                                <dt className='text-muted-foreground'>{translateAccounts('createdAt')}</dt>
                                <dd className='mt-1 font-mono font-medium tabular-nums text-foreground'>
                                  {formatDate(accountQuery.data.data.createdAt)}
                                </dd>
                              </div>
                            </dl>
                            {accountQuery.data.data.invitation && (
                              <div className='space-y-2 rounded-md bg-surface-subtle p-4 text-sm text-foreground'>
                                <p>
                                  {translateAccounts(accountQuery.data.data.invitation.usable ? 'usable' : 'expired')} ·{' '}
                                  {translateAccounts('expiresAt', {
                                    date: formatDate(accountQuery.data.data.invitation.expiresAt)
                                  })}
                                </p>
                                {accountQuery.data.data.invitation.delivery && (
                                  <>
                                    <p>
                                      {translateAccounts('delivery')}:{' '}
                                      {Object.values(AccountDetailResponseDtoDataInvitationDeliveryStatus).includes(
                                        accountQuery.data.data.invitation.delivery.status
                                      )
                                        ? translateAccounts(
                                            `deliveryStatuses.${accountQuery.data.data.invitation.delivery.status}`
                                          )
                                        : translateAccounts('unknown')}
                                    </p>
                                    <p>
                                      {translateAccounts('attempts', {
                                        count: accountQuery.data.data.invitation.delivery.attempts
                                      })}
                                    </p>
                                    {accountQuery.data.data.invitation.delivery.sentAt && (
                                      <p>
                                        {translateAccounts('sentAt', {
                                          date: formatDate(accountQuery.data.data.invitation.delivery.sentAt)
                                        })}
                                      </p>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                            <div className='space-y-2 border-t border-border pt-4'>
                              <h4 className='font-semibold text-foreground'>{translateAccounts('roleHistory')}</h4>
                              {accountQuery.data.data.roleHistory.length ? (
                                <ul className='divide-y divide-border'>
                                  {accountQuery.data.data.roleHistory.map((entry, index) => (
                                    <li className='py-2 text-sm' key={`${entry.role}-${entry.grantedAt}-${index}`}>
                                      {translateAccounts(`roles.${entry.role}`, {
                                        defaultValue: translate('directory.unknownRole')
                                      })}
                                      <span className='block text-xs text-muted-foreground'>
                                        {formatDate(entry.grantedAt)} ·{' '}
                                        {entry.revokedAt ? formatDate(entry.revokedAt) : translateAccounts('current')}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className='text-sm text-muted-foreground'>{translateAccounts('none')}</p>
                              )}
                              {accountQuery.data.data.roleHistoryHasMore && (
                                <p className='text-xs text-muted-foreground'>{translateAccounts('historyLimited')}</p>
                              )}
                            </div>
                          </>
                        )}
                      </AdminQueryState>
                      {accountId && (
                        <button
                          type='button'
                          className={adminButtonClass}
                          onClick={() =>
                            renderAccountDetail
                              ? setManagingAccount(true)
                              : void navigate(`/dashboard/super-admin?tab=accounts&id=${encodeURIComponent(accountId)}`)
                          }
                        >
                          {translate('directory.openAccount')}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className='text-sm text-muted-foreground'>{translate('directory.noAccount')}</p>
                  )}
                </section>
              </div>
              <section className='space-y-3 rounded-lg border border-border bg-surface p-5'>
                <h3 className='text-base font-semibold'>{translate('employeeEvents')}</h3>
                <div className='flex flex-wrap gap-2'>
                  <button
                    type='button'
                    className={adminButtonClass}
                    disabled={employee.status !== 'ACTIVE'}
                    onClick={() => setEventKind('leave')}
                  >
                    {translate('startLeave')}
                  </button>
                  <button
                    type='button'
                    className={adminButtonClass}
                    disabled={employee.status !== 'ACTIVE'}
                    onClick={() => setEventKind('offboarding')}
                  >
                    {translate('recordOffboarding')}
                  </button>
                  <button
                    type='button'
                    className={adminButtonClass}
                    disabled={employee.status !== 'ACTIVE' || employee.unplaced}
                    onClick={() => setEventKind('transfer')}
                  >
                    {translate('recordTransfer')}
                  </button>
                  <button type='button' className={adminButtonClass} onClick={() => setTransferHistory(true)}>
                    {translate('transferHistory')}
                  </button>
                </div>
              </section>
              <section
                aria-labelledby={`${sectionId}-history`}
                className='min-w-0 space-y-4 rounded-lg border border-border bg-surface p-5'
              >
                <h3
                  id={`${sectionId}-history`}
                  className='flex items-center gap-2 border-b border-border pb-3 text-base font-semibold text-foreground'
                >
                  <History aria-hidden className='size-5 text-primary-ink' strokeWidth={1.5} />
                  {translate('directory.history')}
                </h3>
                {!employee.placements.length ? (
                  <p className='text-sm text-muted-foreground'>{translate('directory.historyEmpty')}</p>
                ) : (
                  <ul className='divide-y divide-border/60'>
                    {employee.placements.map((placement) => (
                      <li
                        key={`${placement.department.id}-${placement.validFrom}`}
                        className='flex flex-wrap items-center justify-between gap-2 py-3 text-sm'
                      >
                        <p
                          title={placement.department.name}
                          className='min-w-0 break-words font-medium text-foreground'
                        >
                          {placement.department.name}
                        </p>
                        <p className='text-right font-mono text-xs tabular-nums text-muted-foreground'>
                          {formatDate(placement.validFrom)}
                          {' → '}
                          {placement.validTo ? formatDate(placement.validTo) : translate('directory.current')}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                {employee.placementsHasMore && (
                  <p className='text-xs text-muted-foreground'>{translate('directory.historyMore')}</p>
                )}
              </section>
            </div>
          </>
        )}
      </AdminQueryState>
    </AdminFormDialog>
  )
}
