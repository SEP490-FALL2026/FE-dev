import { ArrowLeft, DollarSign, Plus, ShieldCheck, Sparkles, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MOCK_TEAM_MEMBERS } from '../manager-data'
import type { ManagerTabKey } from '../manager-nav'

interface ManagerEmployeeDetailViewProps {
  employeeId?: string
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerEmployeeDetailView({
  employeeId = 'EMP-01',
  formatCurrency,
  onSelectTab
}: ManagerEmployeeDetailViewProps) {
  const { t } = useTranslation('dashboard')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const member = MOCK_TEAM_MEMBERS.find((m) => m.id === employeeId) || MOCK_TEAM_MEMBERS[0]

  const totalCost = member.assignedSoftware.reduce((sum, s) => sum + s.monthlyCost, 0)
  const inactiveCount = member.assignedSoftware.filter((s) => s.status === 'INACTIVE').length

  const handleRequestRevoke = (softwareName: string) => {
    setSuccessMsg(t('manager.employeeDetail.revokeRequestedMsg', { software: softwareName }))
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  return (
    <div className='space-y-6'>
      {/* Header & Back Button */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <button
            className='inline-flex items-center justify-center rounded-xl border border-border bg-surface p-2 text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground'
            onClick={() => onSelectTab('my-team')}
            type='button'
          >
            <ArrowLeft className='size-5' />
          </button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              {t('manager.employeeDetail.title')}
            </h1>
            <p className='mt-0.5 text-xs text-muted-foreground'>
              {t('manager.employeeDetail.subtitle', { name: member.name, code: member.code })}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
            onClick={() => onSelectTab('create-employee-request', { employeeId: member.id })}
            type='button'
          >
            <Plus className='size-4' />
            <span>{t('manager.employeeDetail.assignBtn')}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className='flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-xs font-medium text-success'>
          <ShieldCheck className='size-4 shrink-0' />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Member Profile & KPI Card */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
          <div className='flex items-center gap-3 border-b border-border pb-4'>
            <span className='flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-2xl'>
              {member.avatar}
            </span>
            <div className='min-w-0'>
              <h2 className='truncate font-bold text-base text-foreground'>{member.name}</h2>
              <p className='truncate text-xs text-muted-foreground'>{member.jobTitle}</p>
              <span className='mt-1 inline-block rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success'>
                {member.status === 'ACTIVE'
                  ? t('manager.team.statusActive')
                  : member.status === 'ON_LEAVE'
                    ? t('manager.team.statusOnLeave')
                    : t('manager.team.statusOffboarding')}
              </span>
            </div>
          </div>

          <div className='space-y-2.5 text-xs'>
            <div className='flex justify-between py-1'>
              <span className='text-muted-foreground'>{t('manager.employeeDetail.labelEmail')}:</span>
              <span className='font-mono font-medium text-foreground'>{member.email}</span>
            </div>
            <div className='flex justify-between py-1'>
              <span className='text-muted-foreground'>{t('manager.employeeDetail.labelCode')}:</span>
              <span className='font-mono font-bold text-foreground'>{member.code}</span>
            </div>
            <div className='flex justify-between py-1'>
              <span className='text-muted-foreground'>{t('manager.employeeDetail.labelDepartment')}:</span>
              <span className='font-medium text-foreground'>{member.department}</span>
            </div>
            <div className='flex justify-between py-1'>
              <span className='text-muted-foreground'>{t('manager.employeeDetail.labelTeam')}:</span>
              <span className='font-medium text-foreground'>{member.team}</span>
            </div>
            <div className='flex justify-between py-1'>
              <span className='text-muted-foreground'>{t('manager.employeeDetail.labelCostCenter')}:</span>
              <span className='font-mono font-bold text-foreground'>{member.costCenter}</span>
            </div>
            <div className='flex justify-between py-1'>
              <span className='text-muted-foreground'>{t('manager.employeeDetail.labelJoined')}:</span>
              <span className='font-mono text-muted-foreground'>{member.joined}</span>
            </div>
          </div>
        </div>

        {/* 2 Summary KPI Cards */}
        <div className='lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('manager.employeeDetail.kpiLicenses')}
              </span>
              <div className='rounded-lg bg-primary-soft p-2 text-primary'>
                <User className='size-5' />
              </div>
            </div>
            <p className='text-3xl font-extrabold text-foreground'>{member.assignedSoftware.length}</p>
            <p className='text-xs text-muted-foreground'>
              {t('manager.employeeDetail.kpiLicensesSub', { count: member.assignedSoftware.length })}
            </p>
          </div>

          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('manager.employeeDetail.kpiMonthlySpend')}
              </span>
              <div className='rounded-lg bg-warning/10 p-2 text-warning'>
                <DollarSign className='size-5' />
              </div>
            </div>
            <p className='text-3xl font-extrabold text-foreground'>{formatCurrency(totalCost)}</p>
            <p className='text-xs text-muted-foreground'>
              {inactiveCount > 0 ? (
                <span className='text-danger font-medium'>
                  {t('manager.employeeDetail.kpiInactiveAlert', { count: inactiveCount })}
                </span>
              ) : (
                <span>{t('manager.employeeDetail.kpiSpendHealthy')}</span>
              )}
            </p>
          </div>

          {/* Underutilized Warning Banner if any */}
          {inactiveCount > 0 && (
            <div className='sm:col-span-2 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-xs flex items-start gap-3'>
              <Sparkles className='size-5 text-warning shrink-0 mt-0.5' />
              <div>
                <p className='font-bold text-foreground'>{t('manager.employeeDetail.wasteBannerTitle')}</p>
                <p className='mt-0.5 text-muted-foreground leading-relaxed'>
                  {t('manager.employeeDetail.wasteBannerDesc', { count: inactiveCount })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assigned Software List */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
        <h2 className='text-sm font-bold text-foreground'>{t('manager.employeeDetail.softwareTableTitle')}</h2>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-3 px-4 font-semibold'>{t('manager.employeeDetail.colSoftware')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.employeeDetail.colPlan')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.employeeDetail.colAssignedDate')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('manager.employeeDetail.colUsageStatus')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('manager.employeeDetail.colActiveMinutes')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('manager.employeeDetail.colCost')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('manager.employeeDetail.colActions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {member.assignedSoftware.map((item) => (
                <tr key={item.id} className='transition hover:bg-surface-subtle/50'>
                  <td className='py-3 px-4'>
                    <div className='flex items-center gap-2.5'>
                      <span className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-base'>
                        {item.logo}
                      </span>
                      <span className='font-bold text-foreground'>{item.name}</span>
                    </div>
                  </td>

                  <td className='py-3 px-4 text-muted-foreground'>{item.plan}</td>
                  <td className='py-3 px-4 font-mono text-muted-foreground'>{item.assignedDate}</td>

                  <td className='py-3 px-4 text-center'>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                        item.status === 'ACTIVE'
                          ? 'bg-success/10 text-success'
                          : item.status === 'LOW_USAGE'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {item.status === 'ACTIVE'
                        ? t('manager.employeeDetail.usageActive')
                        : item.status === 'LOW_USAGE'
                          ? t('manager.employeeDetail.usageLow')
                          : t('manager.employeeDetail.usageInactive')}
                    </span>
                  </td>

                  <td className='py-3 px-4 text-right font-mono font-medium text-foreground'>
                    {t('manager.employeeDetail.minutesUnit', { count: item.activeMinutes30d })}
                  </td>

                  <td className='py-3 px-4 text-right font-bold text-foreground'>{formatCurrency(item.monthlyCost)}</td>

                  <td className='py-3 px-4 text-right'>
                    {item.status === 'INACTIVE' ? (
                      <button
                        className='rounded-lg bg-danger/10 px-2.5 py-1 text-xs font-bold text-danger transition hover:bg-danger hover:text-white'
                        onClick={() => handleRequestRevoke(item.name)}
                        type='button'
                      >
                        {t('manager.employeeDetail.actRevoke')}
                      </button>
                    ) : (
                      <span className='text-[11px] text-muted-foreground italic'>
                        {t('manager.employeeDetail.actNormal')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
