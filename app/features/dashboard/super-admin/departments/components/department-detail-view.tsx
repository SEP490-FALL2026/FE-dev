import {
  AlertTriangle,
  ArrowLeft,
  Edit2,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Panel, PanelTitle } from '../../../dashboard-ui'
import {
  type Department,
  type UserAccount,
  roleDefinitions
} from '../../super-admin-data'

export interface DepartmentDetailViewProps {
  selectedDept: Department
  currentDeptMembers: UserAccount[]
  onBack: () => void
  onOpenEditModal: () => void
  onOpenDeprecateModal: () => void
  onOpenAssignManagerModal: () => void
  onOpenAddMembersModal: () => void
  onRemoveMember: (member: UserAccount) => void
}

export function DepartmentDetailView({
  selectedDept,
  currentDeptMembers,
  onBack,
  onOpenEditModal,
  onOpenDeprecateModal,
  onOpenAssignManagerModal,
  onOpenAddMembersModal,
  onRemoveMember
}: DepartmentDetailViewProps) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <button
            className='grid size-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground transition'
            onClick={onBack}
            title={t('superAdmin.departmentsModule.detailView.backTitle')}
            type='button'
          >
            <ArrowLeft className='size-4' />
          </button>
          <div>
            <div className='flex items-center gap-2'>
              <span className='font-mono font-bold text-primary text-sm'>[{selectedDept.code}]</span>
              <h1 className='text-2xl font-bold tracking-tight text-foreground'>{selectedDept.name}</h1>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold ${
                  selectedDept.status === 'CONFIGURED'
                    ? 'border-success/30 bg-success/15 text-success'
                    : selectedDept.status === 'DEPRECATED'
                      ? 'border-border bg-surface-subtle text-muted-foreground'
                      : 'border-warning/30 bg-warning/15 text-warning'
                }`}
              >
                {selectedDept.status === 'CONFIGURED'
                  ? t('superAdmin.departmentsModule.statusConfigured')
                  : selectedDept.status === 'DEPRECATED'
                    ? t('superAdmin.departmentsModule.statusDeprecated')
                    : t('superAdmin.departmentsModule.statusIncomplete')}
              </span>
            </div>
            <p className='mt-0.5 text-xs text-muted-foreground'>{selectedDept.description}</p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle transition'
            onClick={onOpenEditModal}
            type='button'
          >
            <Edit2 className='size-3.5' />
            {t('superAdmin.departmentsModule.detailView.editInfoBtn')}
          </button>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/20 transition'
            onClick={onOpenDeprecateModal}
            type='button'
          >
            <Trash2 className='size-3.5' />
            {selectedDept.memberCount > 0
              ? t('superAdmin.departmentsModule.detailView.deprecateBtn')
              : t('superAdmin.departmentsModule.detailView.deleteBtn')}
          </button>
        </div>
      </div>

      {/* Department Manager Card */}
      <Panel>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-start gap-3'>
            <span className='grid size-11 place-items-center rounded-2xl bg-info/15 text-info'>
              <UserCheck className='size-5' />
            </span>
            <div>
              <div className='flex items-center gap-2'>
                <span className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                  {t('superAdmin.departmentsModule.detailView.managerHeading')}
                </span>
                <span className='rounded bg-info/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-info'>
                  {t('superAdmin.departmentsModule.detailView.managerLimit')}
                </span>
              </div>

              {selectedDept.managerName ? (
                <div className='mt-1'>
                  <p className='text-base font-bold text-foreground'>{selectedDept.managerName}</p>
                  <p className='text-xs text-muted-foreground font-mono'>{selectedDept.managerEmail}</p>
                </div>
              ) : (
                <div className='mt-1'>
                  <p className='text-sm font-bold text-warning flex items-center gap-1.5'>
                    <AlertTriangle className='size-4' />
                    {t('superAdmin.departmentsModule.detailView.managerMissingTitle')}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {t('superAdmin.departmentsModule.detailView.managerMissingDesc')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition shrink-0'
            onClick={onOpenAssignManagerModal}
            type='button'
          >
            <UserCheck className='size-3.5' />
            <span>
              {selectedDept.managerId
                ? t('superAdmin.departmentsModule.detailView.changeManagerNow')
                : t('superAdmin.departmentsModule.detailView.assignManagerNow')}
            </span>
          </button>
        </div>
      </Panel>

      {/* Members of Department */}
      <Panel>
        <PanelTitle
          action={
            <button
              className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition shrink-0'
              onClick={onOpenAddMembersModal}
              type='button'
            >
              <UserPlus className='size-3.5' />
              <span>{t('superAdmin.departmentsModule.detailView.addMemberBtn')}</span>
            </button>
          }
          hint={t('superAdmin.departmentsModule.detailView.membersHint')}
          title={t('superAdmin.departmentsModule.detailView.membersHeading', {
            count: currentDeptMembers.length
          })}
        />

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
              <tr>
                <th className='p-3 font-semibold'>{t('superAdmin.departmentsModule.detailView.colEmpCode')}</th>
                <th className='p-3 font-semibold'>{t('superAdmin.departmentsModule.detailView.colFullName')}</th>
                <th className='p-3 font-semibold'>{t('superAdmin.departmentsModule.detailView.colWorkEmail')}</th>
                <th className='p-3 font-semibold text-center'>{t('superAdmin.departmentsModule.detailView.colUniqueRole')}</th>
                <th className='p-3 font-semibold text-center'>{t('superAdmin.departmentsModule.detailView.colStatus')}</th>
                <th className='p-3 font-semibold text-right'>{t('superAdmin.departmentsModule.detailView.colAction')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {currentDeptMembers.map((member) => {
                const isManager = member.id === selectedDept.managerId
                const roleDef = roleDefinitions[member.role]

                return (
                  <tr className='transition hover:bg-surface-subtle/60' key={member.id}>
                    <td className='p-3 font-mono font-bold text-muted-foreground'>{member.employeeCode}</td>
                    <td className='p-3'>
                      <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-foreground'>{member.name}</span>
                        {isManager && (
                          <span className='rounded bg-info/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-info'>
                            {t('superAdmin.departmentsModule.detailView.headOfDeptBadge')}
                          </span>
                        )}
                      </div>
                      <span className='text-[0.7rem] text-muted-foreground'>{member.position}</span>
                    </td>
                    <td className='p-3 font-mono text-muted-foreground'>{member.email}</td>
                    <td className='p-3 text-center'>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-bold ${
                          roleDef.colorTone === 'primary'
                            ? 'border-primary/30 bg-primary/15 text-primary'
                            : roleDef.colorTone === 'info'
                              ? 'border-info/30 bg-info/15 text-info'
                              : roleDef.colorTone === 'warning'
                                ? 'border-warning/30 bg-warning/15 text-warning'
                                : roleDef.colorTone === 'success'
                                  ? 'border-success/30 bg-success/15 text-success'
                                  : 'border-border bg-surface-subtle text-muted-foreground'
                        }`}
                      >
                        {roleDef.name}
                      </span>
                    </td>
                    <td className='p-3 text-center'>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-bold ${
                          member.status === 'ACTIVE'
                            ? 'border-success/30 bg-success/15 text-success'
                            : member.status === 'INVITED'
                              ? 'border-warning/30 bg-warning/15 text-warning'
                              : 'border-danger/30 bg-danger/15 text-danger'
                        }`}
                      >
                        {member.status === 'ACTIVE'
                          ? t('superAdmin.departmentsModule.detailView.statusActive')
                          : member.status === 'INVITED'
                            ? t('superAdmin.departmentsModule.detailView.statusInvited')
                            : t('superAdmin.departmentsModule.detailView.statusLocked')}
                      </span>
                    </td>
                    <td className='p-3 text-right'>
                      {!isManager ? (
                        <button
                          className='inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-2 py-1 text-[0.7rem] font-semibold text-danger hover:bg-danger/20 transition'
                          onClick={() => onRemoveMember(member)}
                          type='button'
                        >
                          <UserMinus className='size-3' />
                          {t('superAdmin.departmentsModule.detailView.removeBtn')}
                        </button>
                      ) : (
                        <span className='text-[0.7rem] text-muted-foreground italic'>
                          {t('superAdmin.departmentsModule.detailView.replaceManagerFirst')}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}

              {currentDeptMembers.length === 0 && (
                <tr>
                  <td className='p-8 text-center text-muted-foreground' colSpan={6}>
                    {t('superAdmin.departmentsModule.detailView.emptyMembers')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
