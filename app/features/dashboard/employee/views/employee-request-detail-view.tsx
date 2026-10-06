import { ArrowLeft, CheckCircle2, Clock, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { employeeRequestItems } from '../employee-data'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeRequestDetailViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  requestId?: string
}

export function EmployeeRequestDetailView({ onSelectTab, requestId = 'REQ-1024' }: EmployeeRequestDetailViewProps) {
  const { t } = useTranslation('dashboard')

  const request = employeeRequestItems.find((r) => r.id === requestId)

  if (!request) {
    return (
      <div className='rounded-2xl border border-border bg-surface p-6 sm:p-8'>
        <h1 className='text-2xl font-bold text-foreground'>{t('employee.requestDetail.notFoundTitle')}</h1>
        <p className='mt-2 text-sm text-muted-foreground'>{t('employee.requestDetail.notFoundDescription')}</p>
        <button
          className='mt-5 min-h-11 rounded-xl border border-border px-4 text-sm font-semibold text-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
          onClick={() => onSelectTab('my-requests')}
          type='button'
        >
          {t('employee.requestDetail.backToList')}
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Back button */}
      <div>
        <button
          className='inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground'
          onClick={() => onSelectTab('my-requests')}
          type='button'
        >
          <ArrowLeft aria-hidden='true' className='size-4' />
          <span>{t('employee.requestDetail.backToList')}</span>
        </button>
      </div>

      {/* Header Card */}
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6'>
        <div className='flex min-w-0 items-center gap-4'>
          <img
            alt={request.softwareName}
            className='size-12 rounded-xl border border-border bg-surface object-contain p-2 shadow-xs'
            src={request.softwareLogoUrl}
          />
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-3'>
              <h1 className='font-mono text-xl font-bold tracking-tight text-foreground'>{request.id}</h1>
              {request.status === 'approved' ? (
                <span className='rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-xs font-bold text-success'>
                  {t('employee.myRequests.statusApproved')}
                </span>
              ) : request.status === 'completed' ? (
                <span className='rounded-full border border-info/25 bg-info/10 px-2.5 py-0.5 text-xs font-bold text-info'>
                  {t('employee.myRequests.statusCompleted')}
                </span>
              ) : request.status === 'rejected' ? (
                <span className='rounded-full border border-danger/25 bg-danger/10 px-2.5 py-0.5 text-xs font-bold text-danger-ink'>
                  {t('employee.myRequests.statusRejected')}
                </span>
              ) : request.status === 'cancelled' ? (
                <span className='rounded-full border border-border bg-surface-subtle px-2.5 py-0.5 text-xs font-bold text-foreground'>
                  {t('employee.myRequests.statusCancelled')}
                </span>
              ) : (
                <span className='rounded-full border border-warning/25 bg-warning/10 px-2.5 py-0.5 text-xs font-bold text-warning-ink'>
                  {t('employee.myRequests.statusPending')}
                </span>
              )}
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              {t('employee.requestDetail.headerMeta', {
                software: request.softwareName,
                plan: request.plan,
                date: request.submittedDate,
                time: request.submittedTime
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Approval Workflow & Request Details */}
      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left Column: Request Details & History */}
        <div className='space-y-6 lg:col-span-7'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
            <h2 className='text-sm font-bold text-foreground'>{t('employee.requestDetail.infoTitle')}</h2>
            <div className='mt-4 space-y-3.5 text-sm'>
              <div className='flex flex-wrap items-center justify-between gap-1 border-b border-border/70 pb-3'>
                <span className='text-muted-foreground'>{t('employee.requestDetail.software')}</span>
                <span className='font-bold text-foreground'>{request.softwareName}</span>
              </div>
              <div className='flex flex-wrap items-center justify-between gap-1 border-b border-border/70 pb-3'>
                <span className='text-muted-foreground'>{t('employee.requestDetail.plan')}</span>
                <span className='font-medium text-foreground'>{request.plan}</span>
              </div>
              <div className='flex flex-wrap items-center justify-between gap-1 border-b border-border/70 pb-3'>
                <span className='text-muted-foreground'>{t('employee.requestDetail.project')}</span>
                <span className='font-medium text-foreground'>{request.project}</span>
              </div>
              <div className='flex flex-wrap items-center justify-between gap-1 border-b border-border/70 pb-3'>
                <span className='text-muted-foreground'>{t('employee.requestDetail.currentApprover')}</span>
                <span className='font-bold text-primary'>{request.currentApprover}</span>
              </div>
              <div>
                <span className='text-muted-foreground'>{t('employee.requestDetail.reason')}</span>
                <p className='mt-1.5 rounded-xl border border-border/70 bg-surface-subtle/50 p-3.5 leading-relaxed text-foreground'>
                  {request.businessReason}
                </p>
              </div>
            </div>
          </div>

          {/* History / Audit Log */}
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
            <h2 className='text-sm font-bold text-foreground'>{t('employee.requestDetail.historyTitle')}</h2>
            <div className='mt-4 space-y-4'>
              {request.history.map((h, i) => (
                <div className='flex items-start gap-3 text-xs' key={i}>
                  <span className='mt-0.5 grid size-6 place-items-center rounded-full bg-primary-soft text-primary'>
                    <UserCheck aria-hidden='true' className='size-3.5' />
                  </span>
                  <div>
                    <p className='font-bold text-foreground'>
                      {h.stage} - <span className='font-normal text-muted-foreground'>{h.actor}</span>
                    </p>
                    {h.comment && <p className='mt-0.5 text-muted-foreground italic'>"{h.comment}"</p>}
                    <p className='mt-0.5 text-[0.68rem] text-muted-foreground'>{h.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Approval Stepper Progress */}
        <div className='space-y-6 lg:col-span-5'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
            <h2 className='text-sm font-bold text-foreground'>{t('employee.requestDetail.progressTitle')}</h2>
            <div className='mt-6 space-y-6 border-l-2 border-border/80 pl-4 ml-2'>
              <div className='relative'>
                <span className='absolute -left-[1.4rem] top-0 grid size-5 place-items-center rounded-full bg-success text-white'>
                  <CheckCircle2 aria-hidden='true' className='size-3.5' />
                </span>
                <p className='text-xs font-bold text-foreground'>{t('employee.requestDetail.step1Title')}</p>
                <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>{t('employee.requestDetail.step1Desc')}</p>
              </div>

              <div className='relative'>
                <span className='absolute -left-[1.4rem] top-0 grid size-5 place-items-center rounded-full bg-success text-white'>
                  <CheckCircle2 aria-hidden='true' className='size-3.5' />
                </span>
                <p className='text-xs font-bold text-foreground'>{t('employee.requestDetail.step2Title')}</p>
                <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>{t('employee.requestDetail.step2Desc')}</p>
              </div>

              <div className='relative'>
                <span
                  className={`absolute -left-[1.4rem] top-0 grid size-5 place-items-center rounded-full ${
                    request.status === 'pending'
                      ? 'bg-warning text-white'
                      : request.status === 'approved' || request.status === 'completed'
                        ? 'bg-success text-white'
                        : 'bg-muted-foreground text-white'
                  }`}
                >
                  <Clock aria-hidden='true' className='size-3.5' />
                </span>
                <p className='text-xs font-bold text-foreground'>{t('employee.requestDetail.step3Title')}</p>
                <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>{t('employee.requestDetail.step3Desc')}</p>
              </div>

              <div className='relative'>
                <span className='absolute -left-[1.4rem] top-0 grid size-5 place-items-center rounded-full bg-surface border border-border text-muted-foreground'>
                  <span className='size-1.5 rounded-full bg-muted-foreground/50' />
                </span>
                <p className='text-xs font-bold text-muted-foreground'>{t('employee.requestDetail.step4Title')}</p>
                <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>{t('employee.requestDetail.step4Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
