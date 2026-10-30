import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useSearchParams } from 'react-router'
import type { SuperAdminTabKey } from '../../super-admin-nav'
import { EmployeePanel } from '../components/employee-panel'
import { ImportPanel } from '../components/import-panel'
import { LeavePanel } from '../components/leave-panel'
import { OffboardingPanel } from '../components/offboarding-panel'
import { NoticePanel } from '../components/notice-panel'

const panels = {
  employees: EmployeePanel,
  imports: ImportPanel,
  leaves: LeavePanel,
  offboarding: OffboardingPanel,
  notices: NoticePanel
}
export function SuperAdminPersonnelView({ onSelectTab }: { onSelectTab?: (tab: SuperAdminTabKey) => void }) {
  const { t: translate } = useTranslation('adminPersonnel')
  const formPage = useLocation().pathname.startsWith('/dashboard/super-admin/personnel/')
  const [searchParams] = useSearchParams()
  const requestedPanel = searchParams.get('section')
  const [tab, setTab] = useState<keyof typeof panels>(
    requestedPanel === 'imports' ||
      requestedPanel === 'leaves' ||
      requestedPanel === 'offboarding' ||
      requestedPanel === 'notices'
      ? requestedPanel
      : 'employees'
  )
  const Selected = panels[tab]
  return (
    <div className='space-y-5'>
      <h1 className='text-2xl font-semibold'>{translate('title')}</h1>
      {!formPage && (
        <nav aria-label={translate('title')} className='flex flex-wrap gap-2 border-b border-border pb-3'>
          {(Object.keys(panels) as (keyof typeof panels)[]).map((key) => (
            <button
              key={key}
              type='button'
              aria-pressed={tab === key}
              className={`min-h-11 rounded-md px-4 py-2 text-sm ${tab === key ? 'bg-primary-soft text-primary' : 'hover:bg-surface-subtle'}`}
              onClick={() => setTab(key)}
            >
              {translate(key)}
            </button>
          ))}
          {onSelectTab && (
            <button
              className='min-h-11 rounded-md px-4 py-2 text-sm hover:bg-surface-subtle'
              onClick={() => onSelectTab('transfer')}
            >
              {translate('transfers')}
            </button>
          )}
        </nav>
      )}
      {formPage ? <EmployeePanel /> : <Selected />}
    </div>
  )
}
