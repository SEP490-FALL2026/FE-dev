import { AppWindow, ArrowLeft, Bot, ChevronDown, Download, ShieldAlert, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MOCK_TEAM_MEMBERS } from '../../manager-data'
import type { ManagerTabKey } from '../../manager-nav'
import { downloadUsageWorkbook } from '../../usage-workbook'

interface Props {
  backToReview?: boolean
  employeeId?: string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerEmployeeDetailView({ backToReview = false, employeeId = 'EMP-01', onSelectTab }: Props) {
  const { t, i18n } = useTranslation('dashboard')
  const [openToolId, setOpenToolId] = useState<string | null>(null)
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
  const dateTime = (value: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  const number = new Intl.NumberFormat(locale)
  const tools = member.assignedSoftware
  const inactiveTools = tools.filter((tool) => tool.kind !== 'ai-agent' && tool.activeMinutes30d === 0)

  const exportUsage = () =>
    downloadUsageWorkbook(member, {
      activeMinutes: t('manager.accessReview.exportMinutes'),
      creditsConsumed: t('manager.employeeDetail.creditsConsumed'),
      creditsLimit: t('manager.employeeDetail.creditsLimit'),
      dayPeriod: t('manager.employeeDetail.periodDayLabel'),
      period: t('manager.employeeDetail.periodLabel'),
      plan: t('manager.accessReview.colPlan'),
      requestPeriod: t('manager.employeeDetail.periodRequestLabel'),
      sessionEnd: t('manager.employeeDetail.sessionEnd'),
      sessionStart: t('manager.employeeDetail.sessionStart'),
      sheetName: t('manager.accessReview.exportSheet'),
      software: t('manager.accessReview.colSoftware'),
      status: t('manager.accessReview.exportStatus'),
      title: t('manager.accessReview.exportTitle'),
      usageActive: t('manager.employeeDetail.usageActive'),
      usageAgentActive: t('manager.employeeDetail.agentAllocated'),
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

        <div className='space-y-3'>
          {tools.map((tool) => {
            const isAgent = tool.kind === 'ai-agent'
            const toolKey = `${member.id}:${tool.id}`
            const open = openToolId === toolKey
            return (
              <article className='overflow-hidden rounded-xl border border-border bg-surface' key={tool.id}>
                <div className='flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between'>
                  <div className='flex min-w-0 items-start gap-3'>
                    <span className='grid size-11 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft/60 text-primary'>
                      {isAgent ? (
                        <Bot aria-hidden='true' className='size-5' />
                      ) : (
                        <AppWindow aria-hidden='true' className='size-5' />
                      )}
                    </span>
                    <div className='min-w-0'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <h3 className='font-bold text-foreground'>{tool.name}</h3>
                        <span className='rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary-ink'>
                          {t(isAgent ? 'manager.employeeDetail.typeAgent' : 'manager.employeeDetail.typeSoftware')}
                        </span>
                      </div>
                      <p className='mt-1 text-sm text-muted-foreground'>{tool.plan}</p>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {t('manager.employeeDetail.assignedOn', { date: date(tool.assignedDate) })}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-wrap items-center gap-x-5 gap-y-3 lg:justify-end'>
                    <div className='min-w-32'>
                      <p className='text-xs text-muted-foreground'>
                        {t(
                          isAgent ? 'manager.employeeDetail.creditsConsumed' : 'manager.employeeDetail.colActiveMinutes'
                        )}
                      </p>
                      <p className='mt-1 text-base font-bold tabular-nums text-foreground'>
                        {isAgent
                          ? t('manager.employeeDetail.creditsDisplay', {
                              value: number.format(tool.creditUsage.consumed)
                            })
                          : t('manager.employeeDetail.minutesDisplay', { value: number.format(tool.activeMinutes30d) })}
                      </p>
                    </div>
                    {!isAgent && (
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold ${tool.status === 'ACTIVE' ? 'bg-success/10 text-success' : tool.status === 'LOW_USAGE' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}
                      >
                        {t(
                          tool.status === 'ACTIVE'
                            ? 'manager.employeeDetail.usageActive'
                            : tool.status === 'LOW_USAGE'
                              ? 'manager.employeeDetail.usageLow'
                              : 'manager.employeeDetail.usageInactive'
                        )}
                      </span>
                    )}
                    <button
                      aria-controls={`usage-detail-${member.id}-${tool.id}`}
                      aria-expanded={open}
                      aria-label={t(
                        open ? 'manager.employeeDetail.hideDetailFor' : 'manager.employeeDetail.viewDetailFor',
                        { name: tool.name }
                      )}
                      className='inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/25 bg-primary-soft/40 px-3 text-sm font-semibold text-primary-ink transition hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                      onClick={() => setOpenToolId(open ? null : toolKey)}
                      type='button'
                    >
                      {t(open ? 'manager.employeeDetail.hideDetail' : 'manager.employeeDetail.viewDetail')}
                      <ChevronDown
                        aria-hidden='true'
                        className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {open && (
                  <div
                    className='border-t border-border bg-surface-subtle/40 p-4 sm:p-5'
                    id={`usage-detail-${member.id}-${tool.id}`}
                  >
                    {isAgent ? (
                      <div className='space-y-4'>
                        <h4 className='font-bold text-foreground'>{t('manager.employeeDetail.agentDetailTitle')}</h4>
                        <dl className='grid gap-3 sm:grid-cols-3'>
                          <div className='rounded-xl border border-border bg-surface p-3'>
                            <dt className='text-xs text-muted-foreground'>
                              {t('manager.employeeDetail.creditsConsumed')}
                            </dt>
                            <dd className='mt-1 text-lg font-bold tabular-nums text-foreground'>
                              {number.format(tool.creditUsage.consumed)}
                            </dd>
                          </div>
                          <div className='rounded-xl border border-border bg-surface p-3'>
                            <dt className='text-xs text-muted-foreground'>
                              {t('manager.employeeDetail.creditsLimit')}
                            </dt>
                            <dd className='mt-1 text-lg font-bold tabular-nums text-foreground'>
                              {number.format(tool.creditUsage.limit)}
                            </dd>
                          </div>
                          <div className='rounded-xl border border-border bg-surface p-3'>
                            <dt className='text-xs text-muted-foreground'>{t('manager.employeeDetail.periodLabel')}</dt>
                            <dd className='mt-1 text-sm font-semibold text-foreground'>
                              {tool.creditUsage.period.kind === 'day'
                                ? t('manager.employeeDetail.periodDay', { date: date(tool.creditUsage.period.date) })
                                : t('manager.employeeDetail.periodRequest', {
                                    code: tool.creditUsage.period.requestCode
                                  })}
                            </dd>
                          </div>
                        </dl>
                        <div aria-hidden='true' className='h-2.5 overflow-hidden rounded-full bg-primary-soft'>
                          <div
                            className='h-full rounded-full bg-primary'
                            style={{
                              width: `${tool.creditUsage.limit > 0 ? Math.min(100, (tool.creditUsage.consumed / tool.creditUsage.limit) * 100) : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className='space-y-3'>
                        <h4 className='font-bold text-foreground'>{t('manager.employeeDetail.sessionDetailTitle')}</h4>
                        <dl className='grid gap-3 sm:grid-cols-2'>
                          <div className='rounded-xl border border-border bg-surface p-3'>
                            <dt className='text-xs text-muted-foreground'>
                              {t('manager.employeeDetail.sessionStart')}
                            </dt>
                            <dd className='mt-1 font-semibold text-foreground'>
                              <time dateTime={tool.latestSession.startedAt}>
                                {dateTime(tool.latestSession.startedAt)}
                              </time>
                            </dd>
                          </div>
                          <div className='rounded-xl border border-border bg-surface p-3'>
                            <dt className='text-xs text-muted-foreground'>{t('manager.employeeDetail.sessionEnd')}</dt>
                            <dd className='mt-1 font-semibold text-foreground'>
                              <time dateTime={tool.latestSession.endedAt}>{dateTime(tool.latestSession.endedAt)}</time>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
        <p className='text-xs text-muted-foreground'>{t('manager.employeeDetail.usageLimitNote')}</p>
        {inactiveTools.length > 0 && (
          <p className='text-xs text-muted-foreground'>{t('manager.accessReview.requestUnavailable')}</p>
        )}
      </section>

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
        <dl className='mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3'>
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
    </div>
  )
}
