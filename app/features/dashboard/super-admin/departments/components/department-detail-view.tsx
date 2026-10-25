import {
  AlertTriangle,
  ArrowLeft,
  Edit2,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus
} from 'lucide-react'
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
  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <button
            className='grid size-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground transition'
            onClick={onBack}
            title='Quay lại danh sách phòng ban'
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
                  ? 'Đã cấu hình'
                  : selectedDept.status === 'DEPRECATED'
                    ? 'Ngừng dùng'
                    : 'Chưa hoàn tất: chưa có Manager'}
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
            Sửa thông tin
          </button>
          <button
            className='inline-flex items-center gap-1.5 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/20 transition'
            onClick={onOpenDeprecateModal}
            type='button'
          >
            <Trash2 className='size-3.5' />
            {selectedDept.memberCount > 0 ? 'Ngừng dùng phòng' : 'Xóa phòng ban'}
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
                  Người quản lý phòng ban (Manager)
                </span>
                <span className='rounded bg-info/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-info'>
                  Tối đa 1 Manager
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
                    Phòng ban chưa có Manager
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Nhân viên trong phòng không thể gửi yêu cầu phê duyệt cho đến khi chỉ định Manager.
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
            <span>{selectedDept.managerId ? 'Thay đổi Manager' : 'Chỉ định Manager'}</span>
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
              <span>Thêm thành viên</span>
            </button>
          }
          hint='Xếp nhân viên vào phòng ban không làm thay đổi vai trò (role) của họ'
          title={`Danh sách thành viên trực thuộc (${currentDeptMembers.length})`}
        />

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
              <tr>
                <th className='p-3 font-semibold'>Mã NV</th>
                <th className='p-3 font-semibold'>Họ và tên</th>
                <th className='p-3 font-semibold'>Email công việc</th>
                <th className='p-3 font-semibold text-center'>Role duy nhất</th>
                <th className='p-3 font-semibold text-center'>Trạng thái</th>
                <th className='p-3 font-semibold text-right'>Thao tác</th>
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
                            Trưởng phòng
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
                          ? 'Đang hoạt động'
                          : member.status === 'INVITED'
                            ? 'Chờ kích hoạt'
                            : 'Bị khóa'}
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
                          Gỡ
                        </button>
                      ) : (
                        <span className='text-[0.7rem] text-muted-foreground italic'>Cần thay Manager trước</span>
                      )}
                    </td>
                  </tr>
                )
              })}

              {currentDeptMembers.length === 0 && (
                <tr>
                  <td className='p-8 text-center text-muted-foreground' colSpan={6}>
                    Phòng ban chưa có thành viên nào. Bấm <strong>Thêm thành viên</strong> để xếp nhân sự vào phòng.
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
