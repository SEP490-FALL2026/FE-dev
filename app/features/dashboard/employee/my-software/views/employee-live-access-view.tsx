import { BellRing, Laptop, List, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { EmployeeButton } from '../../shared/components/employee-api-ui'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import type { EmployeeTabKey } from '../../enums'
import { ACCESS_LIST, getAccessList } from '../access-list'
import { EmployeeAccessReturns } from '../components/employee-access-returns'
import { EmployeeExpiryReminders } from '../components/employee-expiry-reminders'
import { EmployeeSoftwareRights } from '../components/employee-software-rights'

const listIcons = { software: List, expiry: BellRing, returns: Undo2 }

export function EmployeeLiveAccessView({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const [params, setParams] = useSearchParams()
  const list = getAccessList(params.get('accessList'))
  return (
    <div className='space-y-6'>
      <EmployeePageHeader
        title={translate('mySoftware')}
        description={translate('redesign.accessHint')}
        icon={Laptop}
        actions={
          <EmployeeButton primary onClick={() => onSelectTab('create-request', { mode: 'return' })}>
            <Undo2 aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('redesign.returnAction')}
          </EmployeeButton>
        }
      />
      <div
        role='group'
        aria-label={translate('accessLists.label')}
        className='flex flex-wrap gap-1 border-b border-border/60 pb-3'
      >
        {Object.values(ACCESS_LIST).map((option) => {
          const Icon = listIcons[option]
          return (
            <button
              key={option}
              type='button'
              aria-pressed={list === option}
              className={`inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${list === option ? 'bg-primary-soft text-primary-ink' : 'text-muted-foreground hover:bg-surface-subtle'}`}
              onClick={() =>
                setParams((previous) => {
                  const next = new URLSearchParams(previous)
                  next.set('accessList', option)
                  for (const key of ['softwarePage', 'page', 'returnsPage']) next.delete(key)
                  return next
                })
              }
            >
              <Icon aria-hidden strokeWidth={1.5} className='size-4' />
              {translate(`accessLists.${option}`)}
            </button>
          )
        })}
      </div>
      {list === ACCESS_LIST.SOFTWARE && <EmployeeSoftwareRights />}
      {list === ACCESS_LIST.EXPIRY && <EmployeeExpiryReminders onSelectTab={onSelectTab} />}
      {list === ACCESS_LIST.RETURNS && <EmployeeAccessReturns onSelectTab={onSelectTab} />}
    </div>
  )
}
