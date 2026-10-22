import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  KeyRound,
  RotateCcw,
  Server,
  Settings,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  UserX
} from 'lucide-react'
import { PageHeader, Panel, PanelTitle, Pill, StatTile } from '../../dashboard-ui'
import {
  initialAdminAccounts,
  initialAuditLogs,
  initialBackgroundJobs,
  initialSystemSettings
} from '../super-admin-data'
import type { SuperAdminTabKey } from '../super-admin-nav'

interface SuperAdminOverviewViewProps {
  onSelectTab: (tab: SuperAdminTabKey) => void
}

export function SuperAdminOverviewView({ onSelectTab }: SuperAdminOverviewViewProps) {
  const totalAccounts = initialAdminAccounts.length
  const invitedAccounts = initialAdminAccounts.filter((a) => a.status === 'INVITED').length
  const lockedAccounts = initialAdminAccounts.filter((a) => a.status === 'LOCKED').length
  const activeAccounts = initialAdminAccounts.filter((a) => a.status === 'ACTIVE').length
  const runningJobs = initialBackgroundJobs.filter((j) => j.status === 'RUNNING').length

  return (
    <div className='space-y-6'>
      <PageHeader
        code='ADM-20'
        subtitle='Trung tâm điều hành và kiểm soát phân quyền hệ thống. Quản trị tài khoản, thiết lập quy chuẩn phê duyệt và giám sát nhật ký tuân thủ SoD.'
        title='Tổng quan Quản trị Hệ thống'
      />

      {/* SoD Notice Banner */}
      <div className='flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary-soft/40 p-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-start gap-3'>
          <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground'>
            <ShieldCheck aria-hidden='true' className='size-5' />
          </span>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-sm font-bold text-foreground'>Nguyên tắc Phân tách Trách nhiệm (SoD-1 & QĐ-44)</h2>
              <Pill tone='primary'>Bảo vệ nghiêm ngặt</Pill>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              Hệ thống duy trì đúng <strong>01 Super Admin</strong> duy nhất. Super Admin không kiêm nhiệm IT Admin, Kế toán (Finance) hoặc Người duyệt chi, và không thể tự chỉnh sửa tài khoản cá nhân.
            </p>
          </div>
        </div>
        <button
          className='inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-primary/30 bg-surface px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-foreground'
          onClick={() => onSelectTab('transfer')}
          type='button'
        >
          <RotateCcw className='size-3.5' />
          Chuyển giao vai trò
        </button>
      </div>

      {/* KPI Stats Grid */}
      <section aria-label='Chỉ số tài khoản và cấu hình' className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatTile
          action='Xem danh sách tài khoản'
          hint={`${activeAccounts} đang hoạt động, ${invitedAccounts} chờ kích hoạt`}
          icon={Users}
          label='Tổng số tài khoản'
          onClick={() => onSelectTab('accounts')}
          tone='primary'
          value={String(totalAccounts)}
        />
        <StatTile
          action='Gửi lại lời mời'
          hint='Chờ người dùng tự kích hoạt mật khẩu'
          icon={Clock}
          label='Tài khoản chờ kích hoạt'
          onClick={() => onSelectTab('accounts')}
          tone={invitedAccounts > 0 ? 'warning' : 'neutral'}
          value={String(invitedAccounts)}
        />
        <StatTile
          action='Xem chi tiết cấu hình'
          hint={`SLA: ${initialSystemSettings.slaHours}h · Dự phòng: ${initialSystemSettings.fallbackApproverName.split(' ')[0]}`}
          icon={Settings}
          label='Người duyệt chi chỉ định'
          onClick={() => onSelectTab('settings')}
          tone='info'
          value={initialSystemSettings.primaryApproverName.split(' (')[0]}
        />
        <StatTile
          action='Tra cứu nhật ký'
          hint={`${runningJobs} tác vụ đang chạy · ${initialBackgroundJobs.length} lịch trình`}
          icon={Server}
          label='Tác vụ nền hệ thống'
          onClick={() => onSelectTab('audit-trail')}
          tone='success'
          value={`${initialBackgroundJobs.length} tác vụ`}
        />
      </section>

      {/* Admin Action Shortcuts */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Panel className='flex flex-col justify-between transition hover:border-primary/40'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='grid size-10 place-items-center rounded-xl bg-primary/10 text-primary'>
                <UserPlus className='size-5' />
              </span>
              <span className='font-mono text-xs font-bold text-muted-foreground'>ADM-21</span>
            </div>
            <h3 className='mt-3 text-base font-bold text-foreground'>Quản lý Tài khoản & Phân quyền</h3>
            <p className='mt-1 text-xs text-muted-foreground'>
              Tạo tài khoản từ hồ sơ nhân viên đã có, gán vai trò trực tiếp, gửi lại lời mời kích hoạt và khóa/mở khóa tài khoản.
            </p>
          </div>
          <button
            className='mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline'
            onClick={() => onSelectTab('accounts')}
            type='button'
          >
            Quản lý tài khoản
            <ArrowRight className='size-3.5' />
          </button>
        </Panel>

        <Panel className='flex flex-col justify-between transition hover:border-primary/40'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='grid size-10 place-items-center rounded-xl bg-info/10 text-info'>
                <Settings className='size-5' />
              </span>
              <span className='font-mono text-xs font-bold text-muted-foreground'>ADM-02</span>
            </div>
            <h3 className='mt-3 text-base font-bold text-foreground'>Cấu hình Người duyệt & Tham số</h3>
            <p className='mt-1 text-xs text-muted-foreground'>
              Chỉ định Người duyệt chi, người thay thế khi xung đột, thiết lập SLA, ngưỡng cảnh báo seat và loại kỳ ngân sách.
            </p>
          </div>
          <button
            className='mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-info hover:underline'
            onClick={() => onSelectTab('settings')}
            type='button'
          >
            Mở bảng cấu hình
            <ArrowRight className='size-3.5' />
          </button>
        </Panel>

        <Panel className='flex flex-col justify-between transition hover:border-primary/40'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='grid size-10 place-items-center rounded-xl bg-warning/15 text-warning'>
                <KeyRound className='size-5' />
              </span>
              <span className='font-mono text-xs font-bold text-muted-foreground'>ADM-22</span>
            </div>
            <h3 className='mt-3 text-base font-bold text-foreground'>Chuyển giao vai trò Super Admin</h3>
            <p className='mt-1 text-xs text-muted-foreground'>
              Bàn giao toàn bộ quyền Super Admin cho một nhân sự kế nhiệm đủ điều kiện trong 01 giao dịch nguyên tử duy nhất.
            </p>
          </div>
          <button
            className='mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-warning hover:underline'
            onClick={() => onSelectTab('transfer')}
            type='button'
          >
            Thực hiện chuyển giao
            <ArrowRight className='size-3.5' />
          </button>
        </Panel>
      </div>

      {/* Two columns: Recent Audit Logs & System Health */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Recent Audit Logs (FR-8.3) */}
        <Panel>
          <PanelTitle
            action={
              <button
                className='text-xs font-bold text-primary hover:underline'
                onClick={() => onSelectTab('audit-trail')}
                type='button'
              >
                Xem toàn bộ nhật ký
              </button>
            }
            hint='Nhật ký ghi vết chỉ-ghi-thêm ghi nhận mọi biến động cấu hình và tài khoản'
            title='Nhật ký Kiểm toán gần nhất (Audit Trail)'
          />
          <div className='mt-4 divide-y divide-border'>
            {initialAuditLogs.slice(0, 4).map((log) => (
              <div className='flex items-start gap-3 py-3' key={log.id}>
                <span
                  className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg text-xs ${
                    log.status === 'SUCCESS' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                  }`}
                >
                  {log.status === 'SUCCESS' ? (
                    <CheckCircle2 className='size-4' />
                  ) : (
                    <AlertTriangle className='size-4' />
                  )}
                </span>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='truncate text-xs font-bold text-foreground'>{log.action}</p>
                    <span className='text-[0.7rem] text-muted-foreground'>{log.timestamp.split(' ')[1]}</span>
                  </div>
                  <p className='mt-0.5 truncate text-[0.7rem] text-muted-foreground'>
                    Tác nhân: <span className='font-semibold text-foreground'>{log.actorName}</span> ({log.actorRole}) · Đối tượng: {log.target}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Background Jobs & System Health (FR-8.4) */}
        <Panel>
          <PanelTitle
            action={
              <button
                className='text-xs font-bold text-primary hover:underline'
                onClick={() => onSelectTab('audit-trail')}
                type='button'
              >
                Quản trị tác vụ
              </button>
            }
            hint='Theo dõi lịch chạy và số lượng bản ghi của các tiến trình tự động'
            title='Trạng thái Tác vụ Nền (Background Jobs)'
          />
          <div className='mt-4 space-y-3'>
            {initialBackgroundJobs.map((job) => (
              <div
                className='flex items-center justify-between rounded-xl border border-border bg-surface-subtle/50 p-3'
                key={job.id}
              >
                <div className='min-w-0'>
                  <div className='flex items-center gap-2'>
                    <p className='truncate text-xs font-bold text-foreground'>{job.name}</p>
                    <Pill tone={job.status === 'RUNNING' ? 'primary' : 'success'}>
                      {job.status === 'RUNNING' ? 'Đang chạy' : 'Thành công'}
                    </Pill>
                  </div>
                  <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                    Lịch: {job.schedule} · Đã xử lý: {job.processedRecords} bản ghi
                  </p>
                </div>
                <div className='text-right text-[0.7rem] text-muted-foreground'>
                  <span>Lần chạy cuối: {job.lastRunAt.split(' ')[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
