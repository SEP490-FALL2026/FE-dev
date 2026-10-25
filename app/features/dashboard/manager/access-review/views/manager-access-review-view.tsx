import { AppWindow, ChevronDown, Download, ExternalLink, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MOCK_ACCESS_REVIEW, MOCK_TEAM_MEMBERS } from '../../manager-data'
import type { ManagerTabKey } from '../../manager-nav'
import { downloadUsageWorkbook } from '../../usage-workbook'

interface Props {
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerAccessReviewView({ onSelectTab }: Props) {
  const { t, i18n } = useTranslation('dashboard')
  const [openEmployeeId, setOpenEmployeeId] = useState<string | null>(null)
  const employees = Array.from(new Set(MOCK_ACCESS_REVIEW.map((item) => item.employeeId))).map((id) => ({
    id,
    items: MOCK_ACCESS_REVIEW.filter((item) => item.employeeId === id),
    member: MOCK_TEAM_MEMBERS.find((member) => member.id === id)
  }))

  const exportUsage = (employeeId: string) => {
    const member = MOCK_TEAM_MEMBERS.find((person) => person.id === employeeId)
    if (!member) return
    downloadUsageWorkbook(member, {
      activeMinutes: t('manager.accessReview.exportMinutes'),
      creditsConsumed: t('manager.employeeDetail.creditsConsumed'),
      creditsLimit: t('manager.employeeDetail.creditsLimit'),
      dayPeriod: t('manager.employeeDetail.periodDayLabel'),
      plan: t('manager.accessReview.colPlan'),
      period: t('manager.employeeDetail.periodLabel'),
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
  }

  return (
    <div className='space-y-6'>
      <header>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {t('manager.accessReview.title')}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('manager.accessReview.subtitle')}</p>
      </header>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <p className='text-sm text-muted-foreground'>{t('manager.accessReview.employeeCount')}</p>
          <p className='mt-2 text-3xl font-bold text-foreground'>{employees.length}</p>
        </div>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <p className='text-sm text-muted-foreground'>{t('manager.accessReview.toolCount')}</p>
          <p className='mt-2 text-3xl font-bold text-foreground'>{MOCK_ACCESS_REVIEW.length}</p>
        </div>
      </div>

      <section className='space-y-3' aria-label={t('manager.accessReview.employeeList')}>
        {employees.map(({ id, items, member }) => {
          const open = openEmployeeId === id
          return (
            <article className='overflow-hidden rounded-2xl border border-border bg-surface shadow-sm' key={id}>
              <button
                aria-controls={`access-review-${id}`}
                aria-expanded={open}
                className='flex w-full items-center justify-between gap-4 px-5 py-5 text-left hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary'
                onClick={() => setOpenEmployeeId(open ? null : id)}
                type='button'
              >
                <span className='flex min-w-0 items-center gap-3'>
                  <span className='grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary'>
                    <Users aria-hidden='true' className='size-5' />
                  </span>
                  <span className='min-w-0'>
                    <span className='block font-bold text-foreground'>{items[0].employeeName}</span>
                    <span className='block text-sm text-muted-foreground'>{items[0].jobTitle}</span>
                  </span>
                </span>
                <span className='flex shrink-0 items-center gap-3 text-sm text-muted-foreground'>
                  <span>{t('manager.accessReview.toolsForEmployee', { count: items.length })}</span>
                  <ChevronDown
                    aria-hidden='true'
                    className={`size-5 transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </span>
              </button>

              {open && (
                <div className='space-y-4 border-t border-border p-5' id={`access-review-${id}`}>
                  <div className='flex flex-wrap gap-2'>
                    <button
                      className='inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                      onClick={() => onSelectTab('employee-detail', { id, from: 'access-review' })}
                      type='button'
                    >
                      <ExternalLink aria-hidden='true' className='size-4' />
                      {t('manager.accessReview.viewFrequency')}
                    </button>
                    <button
                      className='inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50'
                      disabled={!member}
                      onClick={() => exportUsage(id)}
                      type='button'
                    >
                      <Download aria-hidden='true' className='size-4' />
                      {t('manager.accessReview.exportUsage')}
                    </button>
                  </div>
                  <p className='text-xs text-muted-foreground'>{t('manager.accessReview.usageDataLimit')}</p>
                  <div className='overflow-x-auto'>
                    <table className='w-full min-w-[640px] text-left text-sm'>
                      <caption className='sr-only'>
                        {t('manager.accessReview.toolsCaption', { name: items[0].employeeName })}
                      </caption>
                      <thead>
                        <tr className='border-b border-border text-muted-foreground'>
                          <th className='px-3 py-3 font-semibold'>{t('manager.accessReview.colSoftware')}</th>
                          <th className='px-3 py-3 font-semibold'>{t('manager.accessReview.colPlan')}</th>
                          <th className='px-3 py-3 font-semibold'>{t('manager.accessReview.colLastActive')}</th>
                          <th className='px-3 py-3 text-right font-semibold'>{t('manager.accessReview.colActions')}</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-border'>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td className='px-3 py-4'>
                              <span className='flex items-center gap-2 font-semibold text-foreground'>
                                <AppWindow
                                  aria-hidden='true'
                                  className='size-8 rounded-lg border border-primary/20 bg-primary-soft/60 p-1.5 text-primary'
                                />
                                {item.softwareName}
                              </span>
                            </td>
                            <td className='px-3 py-4 text-muted-foreground'>{item.plan}</td>
                            <td className='px-3 py-4 text-muted-foreground'>
                              <time dateTime={item.lastActiveDate}>
                                {new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-US' : 'vi-VN').format(
                                  new Date(`${item.lastActiveDate}T00:00:00`)
                                )}
                              </time>
                            </td>
                            <td className='px-3 py-4 text-right'>
                              <button
                                aria-describedby={`revoke-help-${id}`}
                                className='rounded-lg border border-border px-3 py-2 font-semibold text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60'
                                disabled
                                type='button'
                              >
                                {t('manager.accessReview.requestRevoke')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className='text-xs text-muted-foreground' id={`revoke-help-${id}`}>
                    {t('manager.accessReview.requestUnavailable')}
                  </p>
                  <p className='text-xs text-muted-foreground'>{t('manager.accessReview.usageNote')}</p>
                </div>
              )}
            </article>
          )
        })}
      </section>
    </div>
  )
}
