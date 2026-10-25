import { AlertTriangle, ArrowRight, BellRing, Building2, Shield, UserCheck, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader, Panel, PanelTitle, StatTile } from '../../../dashboard-ui'
import { initialDepartments, initialReminderPolicy, initialUserAccounts } from '../../super-admin-data'
import type { SuperAdminTabKey } from '../../super-admin-nav'

interface SuperAdminOverviewViewProps {
  onSelectTab: (tab: SuperAdminTabKey) => void
}

export function SuperAdminOverviewView({ onSelectTab }: SuperAdminOverviewViewProps) {
  const { t } = useTranslation('dashboard')
  const totalAccounts = initialUserAccounts.length
  const activeAccounts = initialUserAccounts.filter((a) => a.status === 'ACTIVE').length
  const unassignedAccounts = initialUserAccounts.filter((a) => !a.departmentId).length

  const totalDepts = initialDepartments.length
  const configuredDepts = initialDepartments.filter((d) => d.status === 'CONFIGURED').length
  const incompleteDepts = initialDepartments.filter((d) => d.status === 'INCOMPLETE')

  const spendingApprover = initialUserAccounts.find((a) => a.role === 'SPENDING_APPROVER')
  const financeUser = initialUserAccounts.find((a) => a.role === 'FINANCE')
  const itAdminUser = initialUserAccounts.find((a) => a.role === 'IT_ADMIN')
  const demoDepartmentNames: Record<string, string> = {
    ENG: t('superAdmin.departments.ENG'),
    FIN: t('superAdmin.departments.FIN'),
    DES: t('superAdmin.departments.DES'),
    MKT: t('superAdmin.departments.MKT'),
    HR: t('superAdmin.departments.HR'),
    EXEC: t('superAdmin.departments.EXEC')
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        code={t('superAdmin.overview.code')}
        subtitle={t('superAdmin.overview.subtitle')}
        title={t('superAdmin.overview.title')}
      />

      {/* KPI Stats Grid */}
      <section aria-label={t('superAdmin.overview.metricsLabel')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatTile
          action={t('superAdmin.overview.departmentListAction')}
          hint={t('superAdmin.overview.configuredDepartments', {
            configured: configuredDepts,
            incomplete: incompleteDepts.length
          })}
          icon={Building2}
          label={t('superAdmin.overview.totalDepartments')}
          onClick={() => onSelectTab('departments')}
          tone={incompleteDepts.length > 0 ? 'warning' : 'primary'}
          value={String(totalDepts)}
        />
        <StatTile
          action={t('superAdmin.overview.accountListAction')}
          hint={t('superAdmin.overview.activeAccounts', { count: activeAccounts })}
          icon={Users}
          label={t('superAdmin.overview.totalAccounts')}
          onClick={() => onSelectTab('accounts')}
          tone={unassignedAccounts > 0 ? 'info' : 'primary'}
          value={String(totalAccounts)}
        />
        <StatTile
          action={t('superAdmin.overview.roleAssignmentsAction')}
          hint={t('superAdmin.overview.approverAndFinance', {
            approver: spendingApprover?.name || t('superAdmin.overview.unassigned'),
            finance: financeUser?.name || t('superAdmin.overview.unassigned')
          })}
          icon={Shield}
          label={t('superAdmin.overview.spendingApprover')}
          onClick={() => onSelectTab('accounts')}
          tone='success'
          value={spendingApprover?.name || t('superAdmin.overview.unspecified')}
        />
        <StatTile
          action={t('superAdmin.overview.reminderSettingsAction')}
          hint={t('superAdmin.overview.reminderAfterHours', { hours: initialReminderPolicy.noticeDays * 24 })}
          icon={BellRing}
          label={t('superAdmin.overview.managerReminderDeadline')}
          onClick={() => onSelectTab('reminders')}
          tone='neutral'
          value={t('superAdmin.overview.days', { count: initialReminderPolicy.noticeDays })}
        />
      </section>

      {/* Organizational Structure Summary */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Left Column: Department Roster */}
        <div className='lg:col-span-2 space-y-4'>
          <Panel>
            <div className='border-b border-border pb-3'>
              <PanelTitle
                action={
                  <button
                    className='inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-surface-subtle transition'
                    onClick={() => onSelectTab('departments')}
                    type='button'
                  >
                    <span>{t('superAdmin.overview.viewAll')}</span>
                    <ArrowRight className='size-3' />
                  </button>
                }
                hint={t('superAdmin.overview.departmentsHint')}
                title={t('superAdmin.overview.departmentStructure')}
              />
            </div>

            <div className='mt-4 overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
                  <tr>
                    <th className='p-3 font-semibold'>{t('superAdmin.overview.departmentCodeAndName')}</th>
                    <th className='p-3 font-semibold'>{t('superAdmin.overview.responsibleManager')}</th>
                    <th className='p-3 font-semibold text-center'>{t('superAdmin.overview.memberCount')}</th>
                    <th className='p-3 font-semibold text-center'>{t('superAdmin.overview.status')}</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {initialDepartments.map((dept) => {
                    const isConfigured = dept.status === 'CONFIGURED'

                    return (
                      <tr className='transition hover:bg-surface-subtle/60' key={dept.id}>
                        <td className='p-3'>
                          <span className='font-mono font-bold text-primary mr-1.5'>[{dept.code}]</span>
                          <span className='font-bold text-foreground'>
                            {demoDepartmentNames[dept.code] ?? dept.name}
                          </span>
                        </td>
                        <td className='p-3'>
                          {dept.managerName ? (
                            <div className='flex items-center gap-1.5'>
                              <UserCheck className='size-3.5 text-info' />
                              <span className='font-semibold text-foreground'>{dept.managerName}</span>
                            </div>
                          ) : (
                            <span className='inline-flex items-center gap-1 font-bold text-warning'>
                              <AlertTriangle className='size-3' />
                              {t('superAdmin.overview.noManager')}
                            </span>
                          )}
                        </td>
                        <td className='p-3 text-center font-mono font-bold text-foreground'>{dept.memberCount}</td>
                        <td className='p-3 text-center'>
                          <span
                            className={`inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-bold ${
                              isConfigured
                                ? 'border-success/30 bg-success/15 text-success'
                                : 'border-warning/30 bg-warning/15 text-warning'
                            }`}
                          >
                            {isConfigured ? t('superAdmin.overview.active') : t('superAdmin.overview.noManager')}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* Right Column: Roles Governance Snapshot */}
        <div className='space-y-4'>
          <Panel>
            <div className='border-b border-border pb-3'>
              <PanelTitle
                action={
                  <button
                    className='text-xs font-bold text-primary hover:underline'
                    onClick={() => onSelectTab('accounts')}
                    type='button'
                  >
                    {t('superAdmin.overview.details')}
                  </button>
                }
                hint={t('superAdmin.overview.keyRolesHint')}
                title={t('superAdmin.overview.keyRoles')}
              />
            </div>

            <div className='mt-4 space-y-3'>
              {/* Spending Approver */}
              <div className='rounded-xl border border-primary/20 bg-primary-soft/30 p-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold text-primary'>{t('superAdmin.overview.spendingApprover')}</span>
                  <span className='rounded bg-primary/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-primary'>
                    {t('superAdmin.overview.onePersonOnly')}
                  </span>
                </div>
                <p className='mt-1 text-xs font-bold text-foreground'>{spendingApprover?.name}</p>
                <p className='text-[0.7rem] text-muted-foreground'>
                  {t('superAdmin.positions.SPENDING_APPROVER')} · {spendingApprover?.email}
                </p>
              </div>

              {/* Finance */}
              <div className='rounded-xl border border-warning/20 bg-warning/10 p-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold text-warning'>{t('superAdmin.overview.finance')}</span>
                  <span className='rounded bg-warning/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-warning'>
                    {t('superAdmin.overview.expenseControl')}
                  </span>
                </div>
                <p className='mt-1 text-xs font-bold text-foreground'>{financeUser?.name}</p>
                <p className='text-[0.7rem] text-muted-foreground'>
                  {t('superAdmin.positions.FINANCE')} · {financeUser?.email}
                </p>
              </div>

              {/* IT Admin */}
              <div className='rounded-xl border border-success/20 bg-success/10 p-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold text-success'>{t('superAdmin.overview.itAdmin')}</span>
                  <span className='rounded bg-success/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-success'>
                    {t('superAdmin.overview.provisioningAndLicenses')}
                  </span>
                </div>
                <p className='mt-1 text-xs font-bold text-foreground'>{itAdminUser?.name}</p>
                <p className='text-[0.7rem] text-muted-foreground'>
                  {t('superAdmin.positions.IT_ADMIN')} · {itAdminUser?.email}
                </p>
              </div>

              {/* SLA Policy Preview */}
              <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold text-foreground'>
                    {t('superAdmin.overview.managerReminderPolicy')}
                  </span>
                  <button
                    className='text-[0.7rem] font-bold text-primary hover:underline'
                    onClick={() => onSelectTab('reminders')}
                    type='button'
                  >
                    {t('superAdmin.overview.edit')}
                  </button>
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {t('superAdmin.overview.reminderPolicyDescription')}{' '}
                  <strong>
                    {t('superAdmin.overview.reminderPolicyDuration', {
                      days: initialReminderPolicy.noticeDays,
                      hours: initialReminderPolicy.noticeDays * 24
                    })}
                  </strong>
                  .
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
