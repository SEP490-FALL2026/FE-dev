/* eslint-disable project/no-hardcoded-ui-text */
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  Building2,
  Shield,
  UserCheck,
  Users
} from 'lucide-react'
import { PageHeader, Panel, PanelTitle, StatTile } from '../../dashboard-ui'
import {
  initialDepartments,
  initialReminderPolicy,
  initialUserAccounts
} from '../super-admin-data'
import type { SuperAdminTabKey } from '../super-admin-nav'

interface SuperAdminOverviewViewProps {
  onSelectTab: (tab: SuperAdminTabKey) => void
}

export function SuperAdminOverviewView({ onSelectTab }: SuperAdminOverviewViewProps) {
  const totalAccounts = initialUserAccounts.length
  const activeAccounts = initialUserAccounts.filter((a) => a.status === 'ACTIVE').length
  const unassignedAccounts = initialUserAccounts.filter((a) => !a.departmentId).length

  const totalDepts = initialDepartments.length
  const configuredDepts = initialDepartments.filter((d) => d.status === 'CONFIGURED').length
  const incompleteDepts = initialDepartments.filter((d) => d.status === 'INCOMPLETE')

  const spendingApprover = initialUserAccounts.find((a) => a.role === 'SPENDING_APPROVER')
  const financeUser = initialUserAccounts.find((a) => a.role === 'FINANCE')
  const itAdminUser = initialUserAccounts.find((a) => a.role === 'IT_ADMIN')

  return (
    <div className='space-y-6'>
      <PageHeader
        code='Quản trị hệ thống'
        subtitle='Tổng quan cơ cấu tổ chức doanh nghiệp, quản lý phòng ban, tài khoản người dùng và thiết lập phân quyền.'
        title='Tổng quan Quản trị Hệ thống'
      />

      {/* KPI Stats Grid */}
      <section aria-label='Chỉ số cơ cấu tổ chức' className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatTile
          action='Xem danh sách phòng ban'
          hint={`${configuredDepts} đã hoàn tất · ${incompleteDepts.length} chờ bổ nhiệm Quản lý`}
          icon={Building2}
          label='Tổng số phòng ban'
          onClick={() => onSelectTab('departments')}
          tone={incompleteDepts.length > 0 ? 'warning' : 'primary'}
          value={String(totalDepts)}
        />
        <StatTile
          action='Xem danh sách tài khoản'
          hint={`${activeAccounts} tài khoản đang hoạt động`}
          icon={Users}
          label='Tổng số tài khoản'
          onClick={() => onSelectTab('accounts')}
          tone={unassignedAccounts > 0 ? 'info' : 'primary'}
          value={String(totalAccounts)}
        />
        <StatTile
          action='Xem phân quyền vai trò'
          hint={`Duyệt chi: ${spendingApprover?.name || 'Chưa gán'} · Kế toán: ${financeUser?.name || 'Chưa gán'}`}
          icon={Shield}
          label='Người duyệt chi ngân sách'
          onClick={() => onSelectTab('accounts')}
          tone='success'
          value={spendingApprover?.name || 'Chưa chỉ định'}
        />
        <StatTile
          action='Cấu hình thời hạn nhắc'
          hint={`Tự động nhắc nhở sau ${initialReminderPolicy.noticeDays * 24} giờ`}
          icon={BellRing}
          label='Thời hạn nhắc Quản lý'
          onClick={() => onSelectTab('reminders')}
          tone='neutral'
          value={`${initialReminderPolicy.noticeDays} ngày`}
        />
      </section>

      {/* Organizational Structure Summary */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Left Column: Department Roster */}
        <div className='lg:col-span-2 space-y-4'>
          <Panel>
            <div className='border-b border-border pb-3'>
              <PanelTitle
                action={
                  <button
                    className='inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-surface-subtle transition'
                    onClick={() => onSelectTab('departments')}
                    type='button'
                  >
                    <span>Xem tất cả</span>
                    <ArrowRight className='size-3' />
                  </button>
                }
                hint='Danh sách phòng ban trực thuộc và Quản lý phụ trách phê duyệt'
                title='Cơ cấu phòng ban doanh nghiệp'
              />
            </div>

            <div className='mt-4 overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
                  <tr>
                    <th className='p-3 font-semibold'>Mã & Phòng ban</th>
                    <th className='p-3 font-semibold'>Quản lý phụ trách</th>
                    <th className='p-3 font-semibold text-center'>Số thành viên</th>
                    <th className='p-3 font-semibold text-center'>Trạng thái</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {initialDepartments.map((dept) => {
                    const isConfigured = dept.status === 'CONFIGURED'

                    return (
                      <tr className='transition hover:bg-surface-subtle/60' key={dept.id}>
                        <td className='p-3'>
                          <span className='font-mono font-bold text-primary mr-1.5'>[{dept.code}]</span>
                          <span className='font-bold text-foreground'>{dept.name}</span>
                        </td>
                        <td className='p-3'>
                          {dept.managerName ? (
                            <div className='flex items-center gap-1.5'>
                              <UserCheck className='size-3.5 text-info' />
                              <span className='font-semibold text-foreground'>{dept.managerName}</span>
                            </div>
                          ) : (
                            <span className='inline-flex items-center gap-1 font-bold text-warning'>
                              <AlertTriangle className='size-3' />
                              Chưa có Quản lý
                            </span>
                          )}
                        </td>
                        <td className='p-3 text-center font-mono font-bold text-foreground'>
                          {dept.memberCount}
                        </td>
                        <td className='p-3 text-center'>
                          <span
                            className={`inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-bold ${
                              isConfigured
                                ? 'border-success/30 bg-success/15 text-success'
                                : 'border-warning/30 bg-warning/15 text-warning'
                            }`}
                          >
                            {isConfigured ? 'Đang hoạt động' : 'Chưa có Quản lý'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* Right Column: Roles Governance Snapshot */}
        <div className='space-y-4'>
          <Panel>
            <div className='border-b border-border pb-3'>
              <PanelTitle
                action={
                  <button
                    className='text-xs font-bold text-primary hover:underline'
                    onClick={() => onSelectTab('accounts')}
                    type='button'
                  >
                    Chi tiết
                  </button>
                }
                hint='Phân quyền các vị trí quản trị và phê duyệt quan trọng'
                title='Phân nhiệm vai trò trọng yếu'
              />
            </div>

            <div className='mt-4 space-y-3'>
              {/* Spending Approver */}
              <div className='rounded-xl border border-primary/20 bg-primary-soft/30 p-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold text-primary'>Người duyệt chi ngân sách</span>
                  <span className='rounded bg-primary/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-primary'>
                    Duy nhất 1 người
                  </span>
                </div>
                <p className='mt-1 text-xs font-bold text-foreground'>{spendingApprover?.name}</p>
                <p className='text-[0.7rem] text-muted-foreground'>{spendingApprover?.position} · {spendingApprover?.email}</p>
              </div>

              {/* Finance */}
              <div className='rounded-xl border border-warning/20 bg-warning/10 p-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold text-warning'>Tài chính / Kế toán</span>
                  <span className='rounded bg-warning/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-warning'>
                    Kiểm soát chi phí
                  </span>
                </div>
                <p className='mt-1 text-xs font-bold text-foreground'>{financeUser?.name}</p>
                <p className='text-[0.7rem] text-muted-foreground'>{financeUser?.position} · {financeUser?.email}</p>
              </div>

              {/* IT Admin */}
              <div className='rounded-xl border border-success/20 bg-success/10 p-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold text-success'>Quản trị CNTT</span>
                  <span className='rounded bg-success/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-success'>
                    Cấp phát & Bản quyền
                  </span>
                </div>
                <p className='mt-1 text-xs font-bold text-foreground'>{itAdminUser?.name}</p>
                <p className='text-[0.7rem] text-muted-foreground'>{itAdminUser?.position} · {itAdminUser?.email}</p>
              </div>

              {/* SLA Policy Preview */}
              <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold text-foreground'>Chính sách thời hạn nhắc Quản lý</span>
                  <button
                    className='text-[0.7rem] font-bold text-primary hover:underline'
                    onClick={() => onSelectTab('reminders')}
                    type='button'
                  >
                    Sửa đổi
                  </button>
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Tự động gửi thông báo tới Quản lý phòng ban khi yêu cầu chờ quá <strong>{initialReminderPolicy.noticeDays} ngày ({initialReminderPolicy.noticeDays * 24} giờ)</strong>.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
