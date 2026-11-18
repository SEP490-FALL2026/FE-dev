import { BellRing, Laptop, List, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { EmployeeButton } from '../../shared/components/employee-api-ui'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { EmployeeSegmented } from '../../shared/components/employee-layout'
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
      <EmployeeSegmented
        label={translate('accessLists.label')}
        value={list}
        options={Object.values(ACCESS_LIST).map((option) => ({
          value: option,
          label: translate(`accessLists.${option}`),
          icon: listIcons[option]
        }))}
        onChange={(option) =>
          setParams((previous) => {
            const next = new URLSearchParams(previous)
            next.set('accessList', option)
            for (const key of ['softwarePage', 'page', 'returnsPage']) next.delete(key)
            return next
          })
        }
      />
      {list === ACCESS_LIST.SOFTWARE && <EmployeeSoftwareRights />}
      {list === ACCESS_LIST.EXPIRY && <EmployeeExpiryReminders onSelectTab={onSelectTab} />}
      {list === ACCESS_LIST.RETURNS && <EmployeeAccessReturns onSelectTab={onSelectTab} />}
    </div>
  )
}
