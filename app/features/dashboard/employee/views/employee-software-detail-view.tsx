import { AlertCircle, ArrowLeft, ArrowRightLeft, CalendarPlus, Check, Copy, Key, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { employeeSoftwareItems } from '../employee-data'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeSoftwareDetailViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  softwareId?: string
}

export function EmployeeSoftwareDetailView({
  formatCurrency,
  onSelectTab,
  softwareId = '1'
}: EmployeeSoftwareDetailViewProps) {
  const { t } = useTranslation('dashboard')
  const [copied, setCopied] = useState(false)

  const software = employeeSoftwareItems.find((s) => s.id === softwareId)

  if (!software) {
    return (
      <div className='rounded-2xl border border-border bg-surface p-6 sm:p-8'>
        <h1 className='text-2xl font-bold text-foreground'>{t('employee.softwareDetail.notFoundTitle')}</h1>
        <p className='mt-2 text-sm text-muted-foreground'>{t('employee.softwareDetail.notFoundDescription')}</p>
        <button
          className='mt-5 min-h-11 rounded-xl border border-border px-4 text-sm font-semibold text-foreground hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
          onClick={() => onSelectTab('my-software')}
          type='button'
        >
          {t('employee.softwareDetail.backToList')}
        </button>
      </div>
    )
  }

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(software.licenseKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='space-y-6'>
      {/* Back button & Breadcrumb */}
      <div>
        <button
          className='inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground'
          onClick={() => onSelectTab('my-software')}
          type='button'
        >
          <ArrowLeft aria-hidden='true' className='size-4' />
          <span>{t('employee.softwareDetail.backToList')}</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6'>
        <div className='flex min-w-0 items-center gap-4'>
          <img
            alt={software.name}
            className='size-14 rounded-2xl border border-border bg-surface object-contain p-2 shadow-xs'
            src={software.logoUrl}
          />
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2.5'>
              <h1 className='text-2xl font-bold tracking-tight text-foreground'>{software.name}</h1>
              {software.status === 'active' ? (
                <span className='inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-xs font-bold text-success'>
                  <span className='size-1.5 rounded-full bg-success' />
                  {t('employee.mySoftware.statusActive')}
                </span>
              ) : (
                <span className='inline-flex items-center gap-1.5 rounded-full border border-warning/25 bg-warning/10 px-2.5 py-0.5 text-xs font-bold text-warning'>
                  <span className='size-1.5 rounded-full bg-warning' />
                  {t('employee.mySoftware.statusExpiring')}
                </span>
              )}
            </div>
            <p className='mt-0.5 text-xs text-muted-foreground'>
              {software.vendor} · {software.plan} · {software.category}
            </p>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <button
            className='inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-subtle'
            onClick={() => onSelectTab('temporary-renewal', { softwareId: software.id })}
            type='button'
          >
            <CalendarPlus aria-hidden='true' className='size-4 text-warning' />
            <span>{t('employee.softwareDetail.actRenew')}</span>
          </button>
          <button
            className='inline-flex items-center gap-2 rounded-xl border border-danger/25 bg-danger/10 px-3.5 py-2 text-xs font-semibold text-danger transition hover:bg-danger/20'
            onClick={() => onSelectTab('return-license', { softwareId: software.id })}
            type='button'
          >
            <RotateCcw aria-hidden='true' className='size-4' />
            <span>{t('employee.softwareDetail.actReturn')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Info + License Key & Actions */}
      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left Column: General & License Info */}
        <div className='space-y-6 lg:col-span-8'>
          {/* General Information Card */}
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
            <h2 className='text-sm font-bold text-foreground'>{t('employee.softwareDetail.tabGeneral')}</h2>
            <p className='mt-2 text-xs leading-relaxed text-muted-foreground'>{software.description}</p>

            <div className='mt-6 grid gap-4 sm:grid-cols-2'>
              <div className='rounded-xl border border-border/70 bg-surface-subtle/40 p-3.5'>
                <p className='text-[0.7rem] font-semibold text-muted-foreground'>
                  {t('employee.softwareDetail.assignedDate')}
                </p>
                <p className='mt-1 text-sm font-bold text-foreground'>{software.assignedDate}</p>
              </div>

              <div className='rounded-xl border border-border/70 bg-surface-subtle/40 p-3.5'>
                <p className='text-[0.7rem] font-semibold text-muted-foreground'>
                  {t('employee.mySoftware.colExpiration')}
                </p>
                <p className='mt-1 text-sm font-bold text-foreground'>
                  {software.expirationDate || t('employee.mySoftware.noExpiration')}
                </p>
              </div>

              <div className='rounded-xl border border-border/70 bg-surface-subtle/40 p-3.5'>
                <p className='text-[0.7rem] font-semibold text-muted-foreground'>
                  {t('employee.softwareDetail.costPerMonth')}
                </p>
                <p className='mt-1 text-sm font-bold text-primary'>{formatCurrency(software.costPerMonth)}</p>
              </div>

              <div className='rounded-xl border border-border/70 bg-surface-subtle/40 p-3.5'>
                <p className='text-[0.7rem] font-semibold text-muted-foreground'>
                  {t('employee.overview.usageSummary.title')}
                </p>
                <div className='mt-1 flex items-center gap-2'>
                  <div className='h-2 flex-1 overflow-hidden rounded-full bg-border'>
                    <div className='h-full bg-primary' style={{ width: `${software.usage}%` }} />
                  </div>
                  <span className='text-xs font-bold text-foreground'>{software.usage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* License Key Box */}
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
            <div className='flex items-center gap-2'>
              <Key aria-hidden='true' className='size-4 text-primary' />
              <h2 className='text-sm font-bold text-foreground'>{t('employee.softwareDetail.licenseKey')}</h2>
            </div>
            <div className='mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-subtle/70 px-4 py-3 font-mono text-sm font-bold text-foreground'>
              <span className='min-w-0 break-all'>{software.licenseKey}</span>
              <button
                aria-label={t(copied ? 'employee.softwareDetail.copySuccess' : 'employee.softwareDetail.copyAction')}
                className='inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1 text-sm font-sans font-semibold text-foreground transition hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                onClick={handleCopyKey}
                type='button'
              >
                {copied ? (
                  <>
                    <Check aria-hidden='true' className='size-3.5 text-success' />
                    <span className='text-success'>{t('employee.softwareDetail.copySuccess')}</span>
                  </>
                ) : (
                  <>
                    <Copy aria-hidden='true' className='size-3.5' />
                    <span>{t('employee.softwareDetail.copyAction')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Operations */}
        <div className='space-y-6 lg:col-span-4'>
          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
            <h2 className='text-xs font-bold text-foreground'>{t('employee.overview.quickActions.title')}</h2>
            <div className='mt-3 space-y-2'>
              <button
                className='flex w-full items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2.5 text-left text-xs font-semibold text-foreground transition hover:bg-surface-subtle'
                onClick={() => onSelectTab('create-request')}
                type='button'
              >
                <div className='flex items-center gap-2.5'>
                  <ArrowRightLeft aria-hidden='true' className='size-4 text-primary' />
                  <span>{t('employee.softwareDetail.actUpgrade')}</span>
                </div>
              </button>

              <button
                className='flex w-full items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2.5 text-left text-xs font-semibold text-foreground transition hover:bg-surface-subtle'
                onClick={() => onSelectTab('temporary-renewal', { softwareId: software.id })}
                type='button'
              >
                <div className='flex items-center gap-2.5'>
                  <CalendarPlus aria-hidden='true' className='size-4 text-warning' />
                  <span>{t('employee.softwareDetail.actRenew')}</span>
                </div>
              </button>

              <button
                className='flex w-full items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2.5 text-left text-xs font-semibold text-foreground transition hover:bg-surface-subtle'
                onClick={() => onSelectTab('return-license', { softwareId: software.id })}
                type='button'
              >
                <div className='flex items-center gap-2.5'>
                  <RotateCcw aria-hidden='true' className='size-4 text-danger' />
                  <span>{t('employee.softwareDetail.actReturn')}</span>
                </div>
              </button>
            </div>
          </div>

          <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
            <div className='flex items-center gap-2 text-warning'>
              <AlertCircle aria-hidden='true' className='size-4' />
              <h2 className='text-xs font-bold text-foreground'>{t('employee.softwareDetail.actReportIssue')}</h2>
            </div>
            <p className='mt-1 text-[0.72rem] text-muted-foreground'>{t('employee.softwareDetail.supportDesc')}</p>
            <button
              className='mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-muted-foreground disabled:cursor-not-allowed'
              disabled
              type='button'
            >
              {t('employee.softwareDetail.actSubmitTicket')}
            </button>
            <p className='mt-2 text-sm text-muted-foreground'>{t('employee.softwareDetail.supportUnavailable')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
