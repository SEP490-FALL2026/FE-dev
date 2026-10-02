import { Building2, Download, FileSpreadsheet, ShieldCheck, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { employeeProfileData } from '../employee-data'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeProfileViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}

export function EmployeeProfileView({ onSelectTab }: EmployeeProfileViewProps) {
  const { t } = useTranslation('dashboard')
  const { personal, organization, privacy } = employeeProfileData

  return (
    <div className='space-y-6'>
      {/* Page Heading */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.profile.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.profile.subtitle')}</p>
      </div>

      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left Column: Personal + Org Info */}
        <div className='space-y-6 lg:col-span-7'>
          {/* Personal Info */}
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
            <div className='flex items-center gap-2 text-foreground'>
              <User aria-hidden='true' className='size-5 text-primary' />
              <h2 className='text-base font-bold'>{t('employee.profile.personalInfoTitle')}</h2>
            </div>
            <div className='mt-4 divide-y divide-border/70 text-xs'>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldFullName')}</span>
                <span className='font-bold text-foreground'>{personal.fullName}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldEmployeeId')}</span>
                <span className='font-mono font-bold text-foreground'>{personal.employeeId}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldEmail')}</span>
                <span className='font-medium text-foreground'>{personal.email}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldPosition')}</span>
                <span className='font-bold text-primary'>{personal.position}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldPhone')}</span>
                <span className='text-foreground'>{personal.phone}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldJoinDate')}</span>
                <span className='text-foreground'>{personal.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Org Info */}
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
            <div className='flex items-center gap-2 text-foreground'>
              <Building2 aria-hidden='true' className='size-5 text-primary' />
              <h2 className='text-base font-bold'>{t('employee.profile.organizationTitle')}</h2>
            </div>
            <div className='mt-4 divide-y divide-border/70 text-xs'>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldCompany')}</span>
                <span className='font-bold text-foreground'>{organization.company}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldDepartment')}</span>
                <span className='font-medium text-foreground'>{organization.department}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldDirectManager')}</span>
                <span className='font-bold text-foreground'>{organization.directManager}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldCostCenter')}</span>
                <span className='font-mono text-muted-foreground'>{organization.costCenter}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldOffice')}</span>
                <span className='text-foreground'>{organization.office}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Privacy & Transparency Guarantees */}
        <div className='space-y-6 lg:col-span-5'>
          <div className='rounded-2xl border border-primary/25 bg-surface p-6 shadow-sm space-y-4'>
            <div className='flex items-center gap-2 text-primary'>
              <ShieldCheck aria-hidden='true' className='size-5' />
              <h2 className='text-sm font-bold text-foreground'>{t('employee.profile.dataPrivacyTitle')}</h2>
            </div>
            <p className='text-xs leading-relaxed text-muted-foreground'>{t('employee.profile.privacyDesc')}</p>

            <div className='rounded-xl border border-border/80 bg-surface-subtle/50 p-3.5 space-y-2 text-xs'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldMonitoredApps')}</span>
                <span className='font-bold text-foreground'>
                  {t('employee.profile.appsCount', { count: privacy.monitoredAppsCount })}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>{t('employee.profile.fieldRetention')}</span>
                <span className='font-bold text-foreground'>
                  {t('employee.profile.daysCount', { count: privacy.dataRetentionDays })}
                </span>
              </div>
            </div>

            <div className='space-y-2.5 pt-2'>
              <button
                className='flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-foreground transition hover:border-primary hover:bg-primary-soft/50 hover:text-primary'
                onClick={() => onSelectTab('data-export')}
                type='button'
              >
                <div className='flex items-center gap-2.5'>
                  <Download aria-hidden='true' className='size-4 text-primary' />
                  <span>{t('employee.profile.actExportData')}</span>
                </div>
              </button>

              <button
                className='flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-foreground transition hover:border-primary hover:bg-primary-soft/50 hover:text-primary'
                onClick={() => onSelectTab('data-usage')}
                type='button'
              >
                <div className='flex items-center gap-2.5'>
                  <FileSpreadsheet aria-hidden='true' className='size-4 text-primary' />
                  <span>{t('employee.profile.actViewUsage')}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
