import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Boxes,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  History,
  Info,
  Laptop,
  Layers,
  MessageSquare,
  Package,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Terminal,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  initialItDeptUsageSummaries,
  initialItEmployeeUsageRecords,
  type ItDeptUsageSummary,
  type ItEmployeeUsageRecord,
  type TokenTrendPoint
} from '../it-admin-data'
import type { ItAdminTabKey } from '../it-admin-nav'

export type ItDeviceCollectorsViewProps = {
  initialDeptId?: string
  initialEmployeeId?: string
  fromTab?: string
  alertId?: string
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItDeviceCollectorsView({
  initialDeptId,
  initialEmployeeId,
  fromTab,
  alertId,
  onSelectTab
}: ItDeviceCollectorsViewProps) {
  const { t } = useTranslation('dashboard')

  const [deptSummaries] = useState<ItDeptUsageSummary[]>(initialItDeptUsageSummaries)
  const [employeeRecords] = useState<ItEmployeeUsageRecord[]>(initialItEmployeeUsageRecords)

  // Navigation: Level 1 (Phòng ban & Danh sách nhân sự) -> Level 2 (Chi tiết đo lường của nhân sự)
  const [selectedDeptId, setSelectedDeptId] = useState<string>(initialDeptId || 'dept-eng')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(initialEmployeeId || null)

  // Token timeframe tab for AI Agent telemetry: Day, Week, Month
  const [tokenTimeframe, setTokenTimeframe] = useState<'day' | 'week' | 'month'>('week')
  const [searchQuery, setSearchQuery] = useState('')

  // Prompt View Modal
  const [selectedPrompt, setSelectedPrompt] = useState<{ tool: string; prompt: string; response: string } | null>(null)
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const currentDept = deptSummaries.find((d) => d.departmentId === selectedDeptId)
  const currentEmployee = employeeRecords.find((e) => e.id === selectedEmployeeId)

  // Filter employees inside selected department
  const filteredEmployees = employeeRecords.filter((emp) => {
    if (emp.departmentId !== selectedDeptId) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.software.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  // Get active token dataset based on timeframe
  const activeTokenPoints: TokenTrendPoint[] = currentEmployee?.tokenAnalytics
    ? tokenTimeframe === 'day'
      ? currentEmployee.tokenAnalytics.dayData
      : tokenTimeframe === 'week'
        ? currentEmployee.tokenAnalytics.weekData
        : currentEmployee.tokenAnalytics.monthData
    : []

  const maxTokenValue = Math.max(...activeTokenPoints.map((p) => p.totalTokens), 1)

  return (
    <div className='space-y-6'>
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-success/40 bg-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl'>
          <CheckCircle2 className='size-5 text-success shrink-0' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
          <span className='size-2 rounded-full bg-primary' />
          Dữ liệu đo lường & Bộ thu thập thiết bị
        </div>
        <h1 className='mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          Theo dõi Sử dụng & Đo lường Token AI Agent
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Thu thập mức độ hoạt động thực tế, xu hướng tăng trưởng hoặc thụt lùi token qua ngày, tuần, tháng phục vụ tối ưu hóa bản quyền.
        </p>
      </div>

      {/* Breadcrumb Navigation */}
      <nav aria-label='Breadcrumb' className='flex items-center gap-2 text-sm text-muted-foreground'>
        <button
          className={`font-semibold hover:text-foreground transition ${
            !selectedEmployeeId ? 'text-primary font-bold' : ''
          }`}
          onClick={() => setSelectedEmployeeId(null)}
          type='button'
        >
          Dữ liệu theo phòng ban
        </button>

        {currentDept && (
          <>
            <ChevronRight className='size-4' />
            <button
              className={`font-semibold hover:text-foreground transition ${
                !selectedEmployeeId ? 'text-foreground font-bold' : ''
              }`}
              onClick={() => setSelectedEmployeeId(null)}
              type='button'
            >
              {currentDept.departmentName}
            </button>
          </>
        )}

        {currentEmployee && (
          <>
            <ChevronRight className='size-4' />
            <span className='font-bold text-foreground'>
              Chi tiết: {currentEmployee.name} ({currentEmployee.software})
            </span>
          </>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* CHI TIẾT SỬ DỤNG & ĐO LƯỜNG TOKEN CỦA NHÂN SỰ                             */}
      {/* ========================================================================= */}
      {currentEmployee ? (
        <div className='space-y-6'>
          {/* Back to License Optimization Banner (When navigated from Optimization) */}
          {fromTab === 'license-optimization' && (
            <div className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary-soft/40 p-4 shadow-sm'>
              <div className='flex items-center gap-3'>
                <button
                  className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition'
                  onClick={() => onSelectTab?.('license-optimization', alertId ? { alertId } : undefined)}
                  type='button'
                >
                  <ArrowLeft className='size-4' />
                  <span>Quay lại Tối ưu bản quyền</span>
                </button>
                <div>
                  <p className='text-xs font-bold text-foreground'>
                    Đang đối chiếu dữ liệu đo lường từ Cảnh báo tối ưu bản quyền
                  </p>
                  <p className='text-[0.7rem] text-muted-foreground'>
                    Xem xét lượng token tăng/giảm và tần suất thao tác của {currentEmployee.name}, sau đó quay lại để xử lý Thu hồi hoặc Giữ lại kèm lý do.
                  </p>
                </div>
              </div>

              <button
                className='text-xs font-bold text-primary hover:underline'
                onClick={() => onSelectTab?.('license-optimization', alertId ? { alertId } : undefined)}
                type='button'
              >
                Trở lại xử lý ngay →
              </button>
            </div>
          )}

          {/* Top Bar for Employee Details */}
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <button
                className='inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-foreground transition hover:bg-surface-subtle shadow-sm'
                onClick={() => {
                  if (fromTab === 'license-optimization') {
                    onSelectTab?.('license-optimization', alertId ? { alertId } : undefined)
                  } else {
                    setSelectedEmployeeId(null)
                  }
                }}
                type='button'
              >
                <ArrowLeft className='size-4 text-primary' />
                <span>
                  {fromTab === 'license-optimization' ? 'Quay lại Tối ưu bản quyền' : 'Quay lại danh sách nhân sự'}
                </span>
              </button>

              <div>
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-bold text-muted-foreground'>{currentEmployee.departmentName}</span>
                  <span className='rounded-md bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary'>
                    {currentEmployee.software}
                  </span>
                  {currentEmployee.tokenAnalytics?.isAgent && (
                    <span className='inline-flex items-center gap-1 rounded-md bg-purple-500/10 text-purple-600 px-2 py-0.5 text-xs font-bold border border-purple-500/20'>
                      <Sparkles className='size-3' />
                      <span>AI Agent / Trợ lý thông minh</span>
                    </span>
                  )}
                </div>
                <h1 className='text-xl font-bold tracking-tight text-foreground sm:text-2xl mt-1'>
                  {currentEmployee.name} ({currentEmployee.email})
                </h1>
              </div>
            </div>

            <div className='flex items-center gap-2 text-xs'>
              <span className='text-muted-foreground'>Lần hoạt động cuối:</span>
              <span className='font-bold text-foreground bg-surface-subtle px-3 py-1.5 rounded-xl border border-border'>
                {currentEmployee.lastUsed}
              </span>
            </div>
          </div>

          {/* AI AGENT TOKEN USAGE & GROWTH / DECLINE CHART (THEO YÊU CẦU ĐẶC BIỆT) */}
          {currentEmployee.tokenAnalytics ? (
            <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-6'>
              {/* Header with Timeframe selector & Growth Status */}
              <div className='flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/80'>
                <div>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-base font-bold text-foreground'>
                      Biểu đồ mức độ sử dụng Token của AI Agent
                    </h3>
                    {currentEmployee.tokenAnalytics.growthStatus === 'increasing' ? (
                      <span className='inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-bold text-success'>
                        <TrendingUp className='size-4' />
                        <span>Tăng trưởng +{currentEmployee.tokenAnalytics.growthRate}%</span>
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger/10 px-3 py-1 text-xs font-bold text-danger'>
                        <TrendingDown className='size-4' />
                        <span>Thụt lùi {Math.abs(currentEmployee.tokenAnalytics.growthRate)}% (Ít sử dụng)</span>
                      </span>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Theo dõi lượng token Input/Output tiêu thụ theo từng mốc thời gian để phát hiện tài khoản nhàn rỗi hoặc hoạt động tích cực
                  </p>
                </div>

                {/* Day / Week / Month Tabs */}
                <div className='flex items-center gap-1 rounded-xl border border-border bg-surface-subtle p-1 text-xs font-semibold'>
                  <button
                    className={`rounded-lg px-3 py-1.5 transition ${
                      tokenTimeframe === 'day'
                        ? 'bg-primary text-primary-foreground font-bold shadow'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setTokenTimeframe('day')}
                    type='button'
                  >
                    Theo ngày
                  </button>
                  <button
                    className={`rounded-lg px-3 py-1.5 transition ${
                      tokenTimeframe === 'week'
                        ? 'bg-primary text-primary-foreground font-bold shadow'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setTokenTimeframe('week')}
                    type='button'
                  >
                    Theo tuần
                  </button>
                  <button
                    className={`rounded-lg px-3 py-1.5 transition ${
                      tokenTimeframe === 'month'
                        ? 'bg-primary text-primary-foreground font-bold shadow'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setTokenTimeframe('month')}
                    type='button'
                  >
                    Theo tháng
                  </button>
                </div>
              </div>

              {/* KPI Mini Stats for Active Timeframe */}
              <div className='grid gap-4 sm:grid-cols-3'>
                <div className='rounded-xl border border-border bg-surface-subtle p-4'>
                  <span className='text-xs text-muted-foreground'>Token kỳ này ({tokenTimeframe === 'day' ? 'Hôm nay' : tokenTimeframe === 'week' ? 'Tuần này' : 'Tháng này'}):</span>
                  <p className='text-2xl font-black text-foreground mt-1'>
                    {currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].current.toLocaleString()}
                  </p>
                  <span className='text-[0.7rem] text-muted-foreground mt-0.5 block'>
                    So với kỳ trước: {currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].previous.toLocaleString()}
                  </span>
                </div>

                <div className='rounded-xl border border-border bg-surface-subtle p-4'>
                  <span className='text-xs text-muted-foreground'>Mức biến động lượng token:</span>
                  <div className='flex items-center gap-2 mt-1'>
                    {currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].percent >= 0 ? (
                      <TrendingUp className='size-5 text-success' />
                    ) : (
                      <TrendingDown className='size-5 text-danger' />
                    )}
                    <span
                      className={`text-2xl font-black ${
                        currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].percent >= 0
                          ? 'text-success'
                          : 'text-danger'
                      }`}
                    >
                      {currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].percent > 0 ? '+' : ''}
                      {currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].percent}%
                    </span>
                  </div>
                  <span className='text-[0.7rem] text-muted-foreground mt-0.5 block'>
                    {currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].percent < 0
                      ? 'Xu hướng sử dụng suy giảm mạnh'
                      : 'Đang duy trì tần suất sử dụng tốt'}
                  </span>
                </div>

                <div className='rounded-xl border border-border bg-surface-subtle p-4'>
                  <span className='text-xs text-muted-foreground'>Tổng Input / Output cộng dồn:</span>
                  <p className='text-2xl font-black text-foreground mt-1'>
                    {(currentEmployee.inputTokens + currentEmployee.outputTokens).toLocaleString()}
                  </p>
                  <span className='text-[0.7rem] text-muted-foreground mt-0.5 block'>
                    Input: {currentEmployee.inputTokens.toLocaleString()} · Output: {currentEmployee.outputTokens.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className='space-y-2 pt-2'>
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <span>Biểu đồ cột tiêu thụ Token ({tokenTimeframe === 'day' ? '7 ngày trong tuần' : tokenTimeframe === 'week' ? '4 tuần trong tháng' : '3 tháng gần nhất'})</span>
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-1.5'>
                      <span className='size-3 rounded-sm bg-primary/70' />
                      <span>Input Tokens</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <span className='size-3 rounded-sm bg-primary' />
                      <span>Output Tokens</span>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-7 gap-3 pt-6 pb-2 items-end min-h-[220px] rounded-xl border border-border/80 bg-surface-subtle/50 px-4'>
                  {activeTokenPoints.map((point) => {
                    const totalPercent = Math.max((point.totalTokens / maxTokenValue) * 100, point.totalTokens > 0 ? 8 : 2)
                    const inputShare = point.totalTokens > 0 ? (point.inputTokens / point.totalTokens) * 100 : 50

                    return (
                      <div className='flex flex-col items-center gap-2 h-full justify-end group' key={point.label}>
                        <div className='opacity-0 group-hover:opacity-100 transition text-[0.65rem] font-mono font-bold text-foreground text-center'>
                          {point.totalTokens.toLocaleString()}
                        </div>
                        <div
                          className='w-full max-w-[42px] rounded-t-lg bg-surface flex flex-col justify-end overflow-hidden border border-border shadow-sm'
                          style={{ height: `${totalPercent}%` }}
                        >
                          <div
                            className='w-full bg-primary/60 transition'
                            style={{ height: `${inputShare}%` }}
                            title={`Input: ${point.inputTokens.toLocaleString()}`}
                          />
                          <div
                            className='w-full bg-primary transition'
                            style={{ height: `${100 - inputShare}%` }}
                            title={`Output: ${point.outputTokens.toLocaleString()}`}
                          />
                        </div>
                        <span className='text-xs font-semibold text-foreground'>{point.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {/* Summary Metric Cards */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
              <span className='text-xs font-semibold text-muted-foreground'>Tổng thời lượng thao tác</span>
              <p className='mt-2 text-2xl font-bold text-foreground'>
                {Math.floor(currentEmployee.durationMinutes / 60)}h {currentEmployee.durationMinutes % 60}m
              </p>
              <span className='text-[0.7rem] text-muted-foreground block mt-1'>
                Tần suất: {currentEmployee.frequency}
              </span>
            </div>

            <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
              <span className='text-xs font-semibold text-muted-foreground'>Số ngày có hoạt động</span>
              <p className='mt-2 text-2xl font-bold text-foreground'>
                {currentEmployee.activeDays} <span className='text-xs text-muted-foreground font-normal'>ngày / 30 ngày</span>
              </p>
              <span className='text-[0.7rem] text-muted-foreground block mt-1'>
                Lần dùng cuối: {currentEmployee.lastUsed}
              </span>
            </div>

            <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-semibold text-muted-foreground'>Token ghi nhận</span>
                {currentEmployee.isEstimatedTokens && (
                  <span className='rounded bg-warning/10 px-1.5 py-0.5 text-[0.65rem] font-bold text-warning border border-warning/20'>
                    Ước tính
                  </span>
                )}
              </div>
              <p className='mt-2 text-2xl font-bold text-foreground'>
                {(currentEmployee.inputTokens + currentEmployee.outputTokens).toLocaleString()}
              </p>
              <span className='text-[0.7rem] text-muted-foreground block mt-1'>
                Input: {currentEmployee.inputTokens.toLocaleString()} · Output: {currentEmployee.outputTokens.toLocaleString()}
              </span>
            </div>

            <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
              <span className='text-xs font-semibold text-muted-foreground'>Nguồn thu thập dữ liệu</span>
              <p className='mt-2 text-xs font-bold text-foreground truncate' title={currentEmployee.tokenSource}>
                {currentEmployee.tokenSource}
              </p>
              <span className='text-[0.7rem] text-muted-foreground block mt-1'>
                Cập nhật tự động qua API
              </span>
            </div>
          </div>

          {/* Grid: Sessions Timeline + Prompt History */}
          <div className='grid gap-6 lg:grid-cols-2'>
            {/* Sessions Timeline */}
            <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
              <div className='flex items-center justify-between pb-3 border-b border-border/80'>
                <div>
                  <h3 className='text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground'>
                    Dòng thời gian phiên làm việc (Sessions)
                  </h3>
                  <p className='text-xs text-muted-foreground mt-0.5'>Thời điểm bắt đầu/kết thúc, ứng dụng và thiết bị</p>
                </div>
                <Clock className='size-4 text-muted-foreground' />
              </div>

              <div className='space-y-3'>
                {currentEmployee.sessions.length === 0 ? (
                  <div className='rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground'>
                    Không có phiên thao tác nào được ghi nhận trong 30 ngày qua
                  </div>
                ) : (
                  currentEmployee.sessions.map((ses) => (
                    <div
                      className='rounded-xl border border-border bg-surface-subtle p-3.5 space-y-1.5 text-xs'
                      key={ses.id}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='font-bold text-foreground'>{ses.app}</span>
                        <span className='rounded bg-primary-soft px-2 py-0.5 text-[0.68rem] font-bold text-primary'>
                          Thời lượng: {ses.duration}
                        </span>
                      </div>
                      <div className='flex items-center justify-between text-[0.7rem] text-muted-foreground'>
                        <span>Từ: {ses.startTime} — Đến: {ses.endTime}</span>
                        <span>{ses.device}</span>
                      </div>
                      <div className='text-[0.65rem] text-muted-foreground'>
                        Nguồn: {ses.source}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Prompt History */}
            <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
              <div className='flex items-center justify-between pb-3 border-b border-border/80'>
                <div>
                  <h3 className='text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground'>
                    Lịch sử câu lệnh (Prompt History)
                  </h3>
                  <p className='text-xs text-muted-foreground mt-0.5'>Chỉ hiển thị khi kênh thu thập có dữ liệu thực tế</p>
                </div>
                <Terminal className='size-4 text-muted-foreground' />
              </div>

              {currentEmployee.promptHistory === null ? (
                <div className='rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground space-y-2'>
                  <Shield className='size-8 mx-auto opacity-40' />
                  <p className='text-sm font-bold text-foreground'>Không có dữ liệu câu lệnh cho khoảng này</p>
                  <p className='text-xs leading-relaxed max-w-sm mx-auto'>
                    Nguồn thu thập telemetry từ công cụ ({currentEmployee.tokenSource}) có chính sách bảo mật không lưu trữ nội dung câu lệnh hoặc mã nguồn.
                  </p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {currentEmployee.promptHistory.map((prm) => (
                    <div
                      className='rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2 text-xs'
                      key={prm.id}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='font-bold text-foreground'>{prm.tool}</span>
                        <span className='text-[0.7rem] text-muted-foreground'>{prm.time}</span>
                      </div>
                      <p className='text-muted-foreground italic font-mono bg-surface p-2.5 rounded-lg border border-border/60'>
                        "{prm.promptPreview}"
                      </p>
                      <div className='flex items-center justify-between pt-1'>
                        <span className='text-[0.65rem] text-muted-foreground'>Nội dung nhạy cảm được che mặc định</span>
                        <button
                          className='flex items-center gap-1 text-xs font-bold text-primary hover:underline'
                          onClick={() => {
                            setSelectedPrompt({
                              tool: prm.tool,
                              prompt: prm.fullPrompt,
                              response: prm.response
                            })
                            setIsPromptModalOpen(true)
                          }}
                          type='button'
                        >
                          <Eye className='size-3.5' />
                          <span>Xem toàn bộ nội dung</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* DANH SÁCH PHÒNG BAN VÀ NHÂN SỰ                                            */
        /* ========================================================================= */
        <div className='space-y-6'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              Dữ liệu sử dụng theo phòng ban
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Mức hoạt động tổng hợp, thời lượng thao tác và thống kê mức độ tiêu thụ token của từng bộ phận
            </p>
          </div>

          {/* Department Cards Grid */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {deptSummaries.map((dept) => {
              const isSelected = selectedDeptId === dept.departmentId

              return (
                <div
                  className={`rounded-2xl border p-5 shadow-sm transition cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary-soft/40 ring-2 ring-primary'
                      : 'border-border bg-surface hover:border-primary/50'
                  }`}
                  key={dept.departmentId}
                  onClick={() => setSelectedDeptId(dept.departmentId)}
                >
                  <div className='flex items-center justify-between'>
                    <h3 className='text-base font-bold text-foreground'>{dept.departmentName}</h3>
                    <span className='text-xs text-muted-foreground'>{dept.peopleWithData} nhân sự</span>
                  </div>

                  <div className='mt-4 grid grid-cols-2 gap-2 text-xs'>
                    <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                      <span className='text-[0.65rem] text-muted-foreground block'>Thiết bị theo dõi</span>
                      <span className='text-base font-bold text-foreground'>{dept.devicesActive}</span>
                    </div>
                    <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                      <span className='text-[0.65rem] text-muted-foreground block'>Tổng thời lượng</span>
                      <span className='text-base font-bold text-foreground'>{dept.totalDurationHours}h</span>
                    </div>
                    <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                      <span className='text-[0.65rem] text-muted-foreground block'>Tổng số phiên</span>
                      <span className='text-base font-bold text-foreground'>{dept.totalSessions}</span>
                    </div>
                    <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                      <span className='text-[0.65rem] text-muted-foreground block'>Lượng Token đo được</span>
                      <span className='text-base font-bold text-primary'>{dept.totalTokens}</span>
                    </div>
                  </div>

                  <div className='mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground'>
                    <span>Đồng bộ: {dept.lastSync}</span>
                    <span className='font-bold text-primary'>Chọn xem phòng →</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Employee List inside Selected Department */}
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
            <div className='flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/80'>
              <div>
                <h3 className='text-base font-bold text-foreground'>
                  Danh sách nhân sự — {currentDept?.departmentName}
                </h3>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  Bấm vào từng nhân sự để mở màn hình đo lường chi tiết và biểu đồ token AI Agent
                </p>
              </div>

              <div className='flex items-center gap-3'>
                <div className='relative w-64'>
                  <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                  <input
                    className='h-9 w-full rounded-xl border border-border bg-surface-subtle pl-9 pr-3 text-xs outline-none focus:border-primary'
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Tìm theo tên nhân viên, phần mềm...'
                    type='search'
                    value={searchQuery}
                  />
                </div>
              </div>
            </div>

            {/* Employees Table */}
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead className='border-b border-border bg-surface-subtle/80 text-[0.7rem] uppercase tracking-wider text-muted-foreground'>
                  <tr>
                    <th className='px-4 py-3'>Nhân viên</th>
                    <th className='px-3 py-3'>Phần mềm / Agent</th>
                    <th className='px-3 py-3 text-center'>Số ngày dùng</th>
                    <th className='px-3 py-3 text-center'>Thời lượng</th>
                    <th className='px-3 py-3 text-center'>Token</th>
                    <th className='px-4 py-3 text-center'>Xu hướng Token</th>
                    <th className='px-4 py-3 text-right'>Hành động</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border/60'>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td className='px-4 py-8 text-center text-muted-foreground' colSpan={7}>
                        Không có nhân viên nào phù hợp với bộ lọc
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr
                        className='cursor-pointer transition hover:bg-surface-subtle/80'
                        key={emp.id}
                        onClick={() => setSelectedEmployeeId(emp.id)}
                      >
                        <td className='px-4 py-3.5'>
                          <span className='font-bold text-foreground block'>{emp.name}</span>
                          <span className='text-[0.68rem] text-muted-foreground'>{emp.email}</span>
                        </td>
                        <td className='px-3 py-3.5'>
                          <div className='flex items-center gap-1.5'>
                            <span className='rounded bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary'>
                              {emp.software}
                            </span>
                            {emp.tokenAnalytics?.isAgent && (
                              <span title='AI Agent' className='inline-flex items-center'>
                                <Sparkles className='size-3 text-purple-500' />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className='px-3 py-3.5 text-center font-semibold text-foreground'>
                          {emp.activeDays} ngày
                        </td>
                        <td className='px-3 py-3.5 text-center text-muted-foreground'>
                          {Math.floor(emp.durationMinutes / 60)}h {emp.durationMinutes % 60}m
                        </td>
                        <td className='px-3 py-3.5 text-center font-bold text-foreground'>
                          {(emp.inputTokens + emp.outputTokens).toLocaleString()}
                        </td>
                        <td className='px-4 py-3.5 text-center'>
                          {emp.tokenAnalytics ? (
                            emp.tokenAnalytics.growthStatus === 'increasing' ? (
                              <span className='inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-[0.68rem] font-bold text-success border border-success/20'>
                                <TrendingUp className='size-3' />
                                <span>+{emp.tokenAnalytics.growthRate}%</span>
                              </span>
                            ) : (
                              <span className='inline-flex items-center gap-1 rounded-md bg-danger/10 px-2 py-0.5 text-[0.68rem] font-bold text-danger border border-danger/20'>
                                <TrendingDown className='size-3' />
                                <span>{emp.tokenAnalytics.growthRate}%</span>
                              </span>
                            )
                          ) : (
                            <span className='text-muted-foreground text-[0.68rem]'>—</span>
                          )}
                        </td>
                        <td className='px-4 py-3.5 text-right'>
                          <button
                            className='flex items-center gap-1 ml-auto rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedEmployeeId(emp.id)
                            }}
                            type='button'
                          >
                            <span>Xem chi tiết</span>
                            <ChevronRight className='size-3.5' />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: XEM NỘI DUNG PROMPT VÀ PHẢN HỒI (AUDIT BẢO MẬT)                    */}
      {/* ========================================================================= */}
      {isPromptModalOpen && selectedPrompt && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-primary'>
                <Terminal className='size-5' />
                <h3 className='text-base font-bold text-foreground'>
                  Chi tiết nội dung câu lệnh & Phản hồi ({selectedPrompt.tool})
                </h3>
              </div>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setIsPromptModalOpen(false)}
                type='button'
              >
                <X className='size-5' />
              </button>
            </div>

            <div className='space-y-3 text-xs'>
              <div>
                <span className='font-bold text-foreground block mb-1'>Câu lệnh người dùng (User Prompt):</span>
                <div className='rounded-xl border border-border bg-surface-subtle p-3.5 font-mono leading-relaxed text-foreground'>
                  {selectedPrompt.prompt}
                </div>
              </div>

              <div>
                <span className='font-bold text-foreground block mb-1'>Phản hồi từ AI Agent (Model Response):</span>
                <div className='rounded-xl border border-border bg-surface-subtle p-3.5 leading-relaxed text-muted-foreground max-h-48 overflow-y-auto'>
                  {selectedPrompt.response}
                </div>
              </div>

              <p className='text-[0.68rem] text-muted-foreground italic'>
                * Thao tác xem nội dung này đã được ghi vào nhật ký kiểm toán bảo mật thông tin nội bộ.
              </p>
            </div>

            <div className='flex items-center justify-end pt-3 border-t border-border'>
              <button
                className='rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                onClick={() => setIsPromptModalOpen(false)}
                type='button'
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
