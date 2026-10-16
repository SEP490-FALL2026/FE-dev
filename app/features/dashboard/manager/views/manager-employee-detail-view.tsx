import { AppWindow, ArrowLeft, Download, Plus, ShieldAlert, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MOCK_ACCESS_REVIEW, MOCK_TEAM_MEMBERS } from '../manager-data'
import type { ManagerTabKey } from '../manager-nav'
import { downloadUsageWorkbook } from '../usage-workbook'

interface Props {
  backToReview?: boolean
  employeeId?: string
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerEmployeeDetailView({
  backToReview = false,
  employeeId = 'EMP-01',
  formatCurrency,
  onSelectTab
}: Props) {
  const { t, i18n } = useTranslation('dashboard')
  const member = MOCK_TEAM_MEMBERS.find((person) => person.id === employeeId)
  const backLabel = t(backToReview ? 'manager.employeeDetail.backToReview' : 'manager.employeeDetail.backToTeam')
  const back = () => onSelectTab(backToReview ? 'access-review' : 'my-team')

  if (!member) {
    return (
      <div className='space-y-4'>
        <h1 className='text-2xl font-bold text-foreground'>{t('manager.employeeDetail.notFound')}</h1>
        <button className='rounded-xl border border-border px-4 py-2 text-foreground' onClick={back} type='button'>
          {backLabel}
        </button>
      </div>
    )
  }

  const locale = i18n.language === 'en' ? 'en-US' : 'vi-VN'
  const date = (value: string) => new Intl.DateTimeFormat(locale).format(new Date(`${value}T00:00:00`))
  const number = new Intl.NumberFormat(locale)
  const tools = [...member.assignedSoftware].sort((a, b) => a.activeMinutes30d - b.activeMinutes30d)
  const inactiveTools = tools.filter((tool) => tool.activeMinutes30d === 0)
  const totalCost = tools.reduce((sum, tool) => sum + tool.monthlyCost, 0)
  const reviewCost = inactiveTools.reduce((sum, tool) => sum + tool.monthlyCost, 0)

  const exportUsage = () =>
    downloadUsageWorkbook(member, {
      activeMinutes: t('manager.accessReview.exportMinutes'),
      plan: t('manager.accessReview.colPlan'),
      sheetName: t('manager.accessReview.exportSheet'),
      software: t('manager.accessReview.colSoftware'),
      status: t('manager.accessReview.exportStatus'),
      title: t('manager.accessReview.exportTitle'),
      usageActive: t('manager.employeeDetail.usageActive'),
      usageInactive: t('manager.employeeDetail.usageInactive'),
      usageLow: t('manager.employeeDetail.usageLow')
    })

  return (
    <div className='space-y-6'>
      <header className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex items-start gap-3'>
          <button
            aria-label={backLabel}
            className='grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            onClick={back}
            type='button'
          >
            <ArrowLeft aria-hidden='true' className='size-5' />
          </button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              {t('manager.employeeDetail.usageTitle', { name: member.name })}
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>{t('manager.employeeDetail.usageSubtitle')}</p>
          </div>
        </div>
        <div className='flex flex-wrap gap-2 sm:justify-end'>
          <button
            className='inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            onClick={exportUsage}
            type='button'
          >
            <Download aria-hidden='true' className='size-4' />
            {t('manager.accessReview.exportUsage')}
          </button>
          {!backToReview && (
            <button
              className='inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
              onClick={() => onSelectTab('create-employee-request', { employeeId: member.id })}
              type='button'
            >
              <Plus aria-hidden='true' className='size-4' />
              {t('manager.employeeDetail.assignBtn')}
            </button>
          )}
        </div>
      </header>

      <section
        aria-labelledby='usage-heading'
        className='space-y-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5'
      >
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h2 className='text-lg font-bold text-foreground' id='usage-heading'>
              {t('manager.employeeDetail.softwareTableTitle')}
            </h2>
            <p className='mt-1 text-sm text-muted-foreground'>{t('manager.employeeDetail.usageDataNote')}</p>
          </div>
          <span className='w-fit rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary-ink'>
            {t('manager.employeeDetail.toolsCount', { count: tools.length })}
          </span>
        </div>

        {inactiveTools.length > 0 && (
          <div className='flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4'>
            <ShieldAlert aria-hidden='true' className='mt-0.5 size-5 shrink-0 text-warning' />
            <div>
              <p className='font-semibold text-foreground'>{t('manager.employeeDetail.reviewNoticeTitle')}</p>
              <p className='mt-1 text-sm text-muted-foreground'>
                {t('manager.employeeDetail.reviewNoticeDesc', { count: inactiveTools.length })}
              </p>
            </div>
          </div>
        )}

        <div className='overflow-x-auto'>
          <table className='w-full min-w-[880px] text-left text-sm'>
            <caption className='sr-only'>{t('manager.employeeDetail.usageTitle', { name: member.name })}</caption>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='px-3 py-3 font-semibold'>{t('manager.employeeDetail.colSoftware')}</th>
                <th className='px-3 py-3 font-semibold'>{t('manager.employeeDetail.colPlan')}</th>
                <th className='px-3 py-3 text-right font-semibold'>{t('manager.employeeDetail.colActiveMinutes')}</th>
                <th className='px-3 py-3 font-semibold'>{t('manager.employeeDetail.colLastActive')}</th>
                <th className='px-3 py-3 font-semibold'>{t('manager.employeeDetail.colUsageStatus')}</th>
                <th className='px-3 py-3 text-right font-semibold'>{t('manager.employeeDetail.colCost')}</th>
                <th className='px-3 py-3 text-right font-semibold'>{t('manager.employeeDetail.colActions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {tools.map((tool) => {
                const lastActive = MOCK_ACCESS_REVIEW.find(
                  (item) => item.employeeId === member.id && item.softwareName === tool.name
                )?.lastActiveDate
                return (
                  <tr key={tool.id} className='hover:bg-surface-subtle/50'>
                    <td className='px-3 py-4'>
                      <span className='flex items-center gap-2'>
                        <AppWindow
                          aria-hidden='true'
                          className='size-9 shrink-0 rounded-lg border border-primary/20 bg-primary-soft/60 p-2 text-primary'
                        />
                        <span>
                          <span className='block font-semibold text-foreground'>{tool.name}</span>
                          <span className='block text-xs text-muted-foreground'>
                            {t('manager.employeeDetail.assignedOn', { date: date(tool.assignedDate) })}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td className='px-3 py-4 text-muted-foreground'>{tool.plan}</td>
                    <td className='px-3 py-4 text-right font-semibold text-foreground'>
                      {t('manager.employeeDetail.minutesDisplay', { value: number.format(tool.activeMinutes30d) })}
                    </td>
                    <td className='px-3 py-4 text-muted-foreground'>
                      {lastActive ? (
                        <time dateTime={lastActive}>{date(lastActive)}</time>
                      ) : (
                        t('manager.employeeDetail.noLastActiveData')
                      )}
                    </td>
                    <td className='px-3 py-4'>
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${tool.status === 'ACTIVE' ? 'bg-success/10 text-success' : tool.status === 'LOW_USAGE' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}
                      >
                        {t(
                          tool.status === 'ACTIVE'
                            ? 'manager.employeeDetail.usageActive'
                            : tool.status === 'LOW_USAGE'
                              ? 'manager.employeeDetail.usageLow'
                              : 'manager.employeeDetail.usageInactive'
                        )}
                      </span>
                    </td>
                    <td className='px-3 py-4 text-right font-semibold text-foreground'>
                      {formatCurrency(tool.monthlyCost)}
                    </td>
                    <td className='px-3 py-4 text-right'>
                      {tool.activeMinutes30d === 0 ? (
                        <button
                          className='rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60'
                          disabled
                          type='button'
                        >
                          {t('manager.employeeDetail.actRevoke')}
                        </button>
                      ) : (
                        <span className='text-xs text-muted-foreground'>{t('manager.employeeDetail.actNormal')}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className='text-xs text-muted-foreground'>{t('manager.employeeDetail.usageLimitNote')}</p>
        {inactiveTools.length > 0 && (
          <p className='text-xs text-muted-foreground'>{t('manager.accessReview.requestUnavailable')}</p>
        )}
      </section>

      <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]'>
        <section
          aria-labelledby='employee-profile-heading'
          className='rounded-2xl border border-border bg-surface p-5 shadow-sm'
        >
          <div className='flex items-center gap-3 border-b border-border pb-4'>
            <UserRound
              aria-hidden='true'
              className='size-11 rounded-xl border border-primary/20 bg-primary-soft/60 p-2.5 text-primary'
            />
            <div>
              <h2 className='font-bold text-foreground' id='employee-profile-heading'>
                {t('manager.employeeDetail.profileTitle')}
              </h2>
              <p className='text-sm text-muted-foreground'>
                {member.name} · {member.jobTitle}
              </p>
            </div>
          </div>
          <dl className='mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2'>
            <div>
              <dt className='text-muted-foreground'>{t('manager.employeeDetail.labelEmail')}</dt>
              <dd className='break-all font-medium text-foreground'>{member.email}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{t('manager.employeeDetail.labelDepartment')}</dt>
              <dd className='font-medium text-foreground'>{member.department}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{t('manager.employeeDetail.labelTeam')}</dt>
              <dd className='font-medium text-foreground'>{member.team}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{t('manager.employeeDetail.labelCode')}</dt>
              <dd className='font-medium text-foreground'>{member.code}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{t('manager.employeeDetail.labelCostCenter')}</dt>
              <dd className='font-medium text-foreground'>{member.costCenter}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{t('manager.employeeDetail.labelJoined')}</dt>
              <dd className='font-medium text-foreground'>{date(member.joined)}</dd>
            </div>
          </dl>
        </section>
        <aside className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <h2 className='font-bold text-foreground'>{t('manager.employeeDetail.costSummaryTitle')}</h2>
          <p className='mt-3 text-sm text-muted-foreground'>{t('manager.employeeDetail.kpiMonthlySpend')}</p>
          <p className='mt-1 text-2xl font-bold text-foreground'>{formatCurrency(totalCost)}</p>
          <p className='mt-4 text-sm text-muted-foreground'>{t('manager.employeeDetail.reviewCostLabel')}</p>
          <p className='mt-1 text-xl font-semibold text-foreground'>{formatCurrency(reviewCost)}</p>
          <p className='mt-2 text-xs text-muted-foreground'>{t('manager.employeeDetail.reviewCostNote')}</p>
        </aside>
      </div>
    </div>
  )
}
