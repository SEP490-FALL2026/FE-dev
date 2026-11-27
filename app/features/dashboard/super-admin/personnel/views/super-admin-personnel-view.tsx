import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { MailPlus, UserPlus, UsersRound } from 'lucide-react'
import { adminButtonClass, adminPrimaryClass } from '../../shared/components/admin-form'
import { AdminPageHeader, AdminSegmented } from '../../shared/components/admin-page-header'
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
export function SuperAdminPersonnelView({
  onInviteAccount,
  renderAccountDetail
}: {
  onInviteAccount?: () => void
  renderAccountDetail?: (id: string, onClose: () => void) => ReactNode
}) {
  const { t: translate } = useTranslation('adminPersonnel')
  const { t: translateAccounts } = useTranslation('adminAccounts')
  const navigate = useNavigate()
  const formPage = useLocation().pathname.startsWith('/dashboard/super-admin/personnel/')
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedPanel = searchParams.get('section')
  const tab: keyof typeof panels =
    requestedPanel === 'imports' ||
    requestedPanel === 'leaves' ||
    requestedPanel === 'offboarding' ||
    requestedPanel === 'notices'
      ? requestedPanel
      : 'employees'
  const Selected = panels[tab]
  const showDirectoryActions = !formPage && tab === 'employees' && !searchParams.get('employeeId')
  const selectSection = (key: keyof typeof panels) =>
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('tab', 'personnel')
      next.set('section', key)
      if (key !== 'employees') next.delete('employeeId')
      for (const field of ['importId', 'noticeId', 'offboardingId', 'longLeaveId', 'transferId', 'personnelView'])
        next.delete(field)
      return next
    })
  return (
    <div className='space-y-6'>
      <AdminPageHeader
        icon={UsersRound}
        title={translate('title')}
        subtitle={formPage ? undefined : translate(`ui.sectionHint.${tab}`)}
        actions={
          showDirectoryActions && (
            <>
              {onInviteAccount && (
                <button type='button' className={adminButtonClass} onClick={onInviteAccount}>
                  <MailPlus aria-hidden strokeWidth={1.5} className='size-4' />
                  {translateAccounts('invite')}
                </button>
              )}
              <button
                type='button'
                className={adminPrimaryClass}
                onClick={() => void navigate('/dashboard/super-admin/personnel/new')}
              >
                <UserPlus aria-hidden strokeWidth={1.5} className='size-4' />
                {translate('createEmployee')}
              </button>
            </>
          )
        }
      >
        {!formPage && (
          <AdminSegmented
            label={translate('title')}
            value={tab}
            onChange={selectSection}
            items={(Object.keys(panels) as (keyof typeof panels)[]).map((key) => ({ key, label: translate(key) }))}
          />
        )}
      </AdminPageHeader>
      {formPage || tab === 'employees' ? <EmployeePanel renderAccountDetail={renderAccountDetail} /> : <Selected />}
    </div>
  )
}
