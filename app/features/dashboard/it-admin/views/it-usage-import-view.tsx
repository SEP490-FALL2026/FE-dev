import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Upload,
  UploadCloud,
  UserCheck,
  UserX,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { itUsageSources, type UsageDataSource } from '../it-admin-data'
import type { ItAdminTabKey } from '../it-admin-nav'

type ItUsageImportViewProps = {
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItUsageImportView({ onSelectTab }: ItUsageImportViewProps = {}) {
  const { t } = useTranslation('dashboard')
  const [sources, setSources] = useState<UsageDataSource[]>(itUsageSources)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1)

  // Wizard form state
  const [selectedApp, setSelectedApp] = useState('OpenAI Admin Center (ChatGPT & Codex)')
  const [sourceType, setSourceType] = useState<'csv' | 'api' | 'collector'>('csv')
  const [isCommApp, setIsCommApp] = useState(false)
  const [coverageStart, setCoverageStart] = useState('2025-01-01')
  const [coverageEnd, setCoverageEnd] = useState('2025-01-15')
  const [uploadedFile, setUploadedFile] = useState<string | null>('openai_enterprise_usage_jan2025.csv')
  const [fileHash, setFileHash] = useState('sha256:7f4b82c91a0e...')
  const [isCommitting, setIsCommitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const metricValues = {
    connected: sources.length,
    events: '264.2K',
    healthy: sources.filter((s) => s.status === 'active').length,
    outdated: sources.filter((s) => s.status === 'needsUpdate').length
  }

  const appOptions = [
    { comm: false, id: 'openai', name: 'OpenAI Admin Center (ChatGPT & Codex)', type: 'Báo cáo sử dụng CSV' },
    { comm: false, id: 'anthropic', name: 'Anthropic Console (Claude Enterprise)', type: 'Kết nối tự động API' },
    { comm: false, id: 'gemini', name: 'Google Gemini & Vertex AI Workspace', type: 'Kết nối tự động API' },
    { comm: false, id: 'copilot', name: 'GitHub Copilot Organization Metrics', type: 'Nhật ký Git & Tiện ích IDE' },
    { comm: false, id: 'cursor', name: 'Cursor AI Workspace Analytics', type: 'Báo cáo sử dụng CSV' },
    { comm: true, id: 'chatbot', name: 'Chatbot AI hội thoại nội bộ', type: 'Chỉ theo dõi thành viên (Bảo vệ riêng tư)' }
  ]

  const handleAppChange = (appName: string) => {
    setSelectedApp(appName)
    const opt = appOptions.find((a) => a.name === appName)
    setIsCommApp(opt ? opt.comm : false)
  }

  const handleCommitImport = () => {
    setIsCommitting(true)
    setTimeout(() => {
      setIsCommitting(false)
      setIsWizardOpen(false)
      setWizardStep(1)
      setToastMessage('Đã ghi nhận 1,248 dòng hoạt động vào dữ liệu tài khoản AI thành công!')
      // Update the source sync time in memory
      setSources((prev) =>
        prev.map((s) =>
          s.name === selectedApp ? { ...s, lastSync: 'Vừa xong', status: 'active', coverage: `${coverageStart} – ${coverageEnd}` } : s
        )
      )
      setTimeout(() => setToastMessage(null), 4000)
    }, 1400)
  }

  const statusConfig: Record<UsageDataSource['status'], { label: string; tone: string }> = {
    active: {
      label: t('itAdmin.usageImport.statusActive'),
      tone: 'bg-success/10 text-success border-success/25'
    },
    blocked: {
      label: t('itAdmin.usageImport.statusBlocked'),
      tone: 'bg-muted/40 text-muted-foreground border-border'
    },
    needsUpdate: {
      label: t('itAdmin.usageImport.statusNeedsUpdate'),
      tone: 'bg-warning/15 text-warning border-warning/30'
    }
  }

  return (
    <div className='space-y-6'>
      {/* Toast */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-success/30 bg-success/15 px-5 py-3.5 shadow-xl backdrop-blur-md animate-[slideUp_0.3s_ease-out]'>
          <CheckCircle2 className='size-5 text-success' />
          <div>
            <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
            {onSelectTab && (
              <button
                className='ml-3 text-xs font-bold text-primary underline'
                onClick={() => onSelectTab('unmatched-identities')}
                type='button'
              >
                Xử lý 3 định danh chưa khớp ngay →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
            <span className='size-2 rounded-full bg-primary' />
            Thu thập & Đối chiếu hoạt động AI
          </div>
          <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.usageImport.title')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.usageImport.subtitle')}</p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
            onClick={() => {
              setIsWizardOpen(true)
              setWizardStep(1)
            }}
            type='button'
          >
            <UploadCloud aria-hidden='true' className='size-4' />
            <span>Nhập dữ liệu hoạt động AI mới</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <Database aria-hidden='true' className='size-4 text-primary' />
            <span>{t('itAdmin.usageImport.metricConnected')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricValues.connected}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <CheckCircle2 aria-hidden='true' className='size-4 text-success' />
            <span>{t('itAdmin.usageImport.metricHealthy')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricValues.healthy}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <Clock aria-hidden='true' className='size-4 text-warning' />
            <span>{t('itAdmin.usageImport.metricOutdated')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricValues.outdated}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <RefreshCw aria-hidden='true' className='size-4 text-info' />
            <span>{t('itAdmin.usageImport.metricEvents')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricValues.events}</p>
        </div>
      </div>

      {/* AI Privacy & Prompt Protection Notice */}
      <div className='rounded-2xl border border-primary/20 bg-primary-soft/30 p-4 shadow-sm'>
        <div className='flex items-start gap-3'>
          <ShieldAlert aria-hidden='true' className='mt-0.5 size-5 shrink-0 text-primary' />
          <div>
            <h2 className='text-sm font-bold text-foreground'>Quy chuẩn bảo vệ quyền riêng tư & Bảo mật dữ liệu AI</h2>
            <p className='mt-1 text-xs text-muted-foreground leading-relaxed'>
              Hệ thống <strong className='text-foreground'>chỉ thu thập tần suất & thời điểm kích hoạt AI</strong> để đánh giá nhu cầu phân bổ giấy phép. Tuyệt đối <strong className='text-foreground'>không thu thập nội dung câu lệnh (prompt), lịch sử trò chuyện hoặc mã nguồn</strong> của nhân viên. Dữ liệu này chỉ phục vụ tối ưu hóa chi phí bản quyền, không dùng làm thước đo năng suất cá nhân.
            </p>
          </div>
        </div>
      </div>

      {/* Usage Sources Table */}
      <div className='rounded-2xl border border-border bg-surface shadow-sm'>
        <div className='flex items-center justify-between border-b border-border p-4'>
          <div>
            <h2 className='text-base font-bold text-foreground'>{t('itAdmin.usageImport.sourcesTitle')}</h2>
            <p className='text-xs text-muted-foreground'>Danh sách các nguồn thu thập bằng chứng sử dụng đang kết nối</p>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
              <tr>
                <th className='p-3 font-semibold'>{t('itAdmin.usageImport.colSource')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.usageImport.colType')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.usageImport.colCoverage')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.usageImport.colLastSync')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.usageImport.colStatus')}</th>
                <th className='p-3 font-semibold text-right'>{t('itAdmin.provisioning.colActions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {sources.map((source) => {
                const cfg = statusConfig[source.status]

                return (
                  <tr className='transition hover:bg-surface-subtle/60' key={source.id}>
                    <td className='p-3 font-semibold text-foreground'>{source.name}</td>
                    <td className='p-3 text-muted-foreground'>{source.type}</td>
                    <td className='p-3 font-mono text-muted-foreground'>{source.coverage}</td>
                    <td className='p-3 text-muted-foreground'>{source.lastSync}</td>
                    <td className='p-3'>
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${cfg.tone}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className='p-3 text-right'>
                      <button
                        className='inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold hover:border-primary hover:text-primary transition'
                        onClick={() => {
                          setSelectedApp(source.name)
                          setIsCommApp(source.status === 'blocked')
                          setIsWizardOpen(true)
                          setWizardStep(1)
                        }}
                        type='button'
                      >
                        <span>Cập nhật</span>
                        <ArrowUpRight aria-hidden='true' className='size-3' />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── IMPORT WIZARD MODAL ─── */}
      {isWizardOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-3xl rounded-2xl border border-border bg-surface p-6 shadow-2xl overflow-y-auto max-h-[90vh]'>
            {/* Header */}
            <div className='flex items-start justify-between border-b border-border pb-4'>
              <div>
                <div className='flex items-center gap-2'>
                  <span className='rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary'>
                    Quy trình nhập dữ liệu Bước {wizardStep}/4
                  </span>
                  <h2 className='text-lg font-bold text-foreground'>
                    {wizardStep === 1 && 'Bước 1: Chọn công cụ AI & Nguồn dữ liệu'}
                    {wizardStep === 2 && 'Bước 2: Định nghĩa hoạt động AI & Định danh'}
                    {wizardStep === 3 && 'Bước 3: Tải tệp dữ liệu & Khoảng thời gian'}
                    {wizardStep === 4 && 'Bước 4: Xem trước & Xác nhận ghi dữ liệu'}
                  </h2>
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Quy trình tiếp nhận bằng chứng sử dụng tài khoản AI có kiểm soát dữ liệu và bảo mật
                </p>
              </div>
              <button
                className='rounded-lg p-1.5 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setIsWizardOpen(false)}
                type='button'
              >
                <X className='size-5' />
              </button>
            </div>

            {/* Stepper Dots */}
            <div className='mt-4 flex items-center justify-between border-b border-border pb-4'>
              {[
                { label: 'Chọn nguồn AI', s: 1 },
                { label: 'Định nghĩa', s: 2 },
                { label: 'Tải file', s: 3 },
                { label: 'Xem trước', s: 4 }
              ].map((st) => (
                <div className='flex items-center gap-2' key={st.s}>
                  <span
                    className={`grid size-6 place-items-center rounded-full text-xs font-bold ${
                      wizardStep === st.s
                        ? 'bg-primary text-primary-foreground'
                        : wizardStep > st.s
                          ? 'bg-success text-white'
                          : 'bg-surface-subtle text-muted-foreground border border-border'
                    }`}
                  >
                    {wizardStep > st.s ? '✓' : st.s}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      wizardStep === st.s ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Select App & Source */}
            {wizardStep === 1 && (
              <div className='mt-5 space-y-4'>
                <div>
                  <label className='block text-xs font-bold text-foreground'>Chọn công cụ AI trong danh mục *</label>
                  <select
                    className='mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-foreground outline-none focus:border-primary'
                    onChange={(e) => handleAppChange(e.target.value)}
                    value={selectedApp}
                  >
                    {appOptions.map((opt) => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name} ({opt.type})
                      </option>
                    ))}
                  </select>
                </div>

                {isCommApp ? (
                  <div className='rounded-xl border border-warning/30 bg-warning/5 p-4'>
                    <div className='flex items-start gap-3'>
                      <ShieldAlert className='mt-0.5 size-5 shrink-0 text-warning' />
                      <div>
                        <h4 className='text-sm font-bold text-warning'>Công cụ AI nội bộ có chính sách bảo mật riêng</h4>
                        <p className='mt-1 text-xs text-muted-foreground'>
                          Hệ thống <strong className='text-foreground'>chặn thu thập dữ liệu hội thoại chi tiết</strong> của {selectedApp}. Chỉ cho phép đồng bộ danh sách thành viên được cấp quyền để bảo vệ quyền riêng tư.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className='block text-xs font-bold text-foreground'>Loại nguồn cung cấp bằng chứng</label>
                    <div className='mt-2 grid gap-3 sm:grid-cols-3'>
                      {[
                        { desc: 'Tải file CSV/JSON từ trang quản trị hãng AI', id: 'csv', title: 'File xuất từ Admin Portal' },
                        { desc: 'Kết nối API trực tiếp từ nhà cung cấp AI', id: 'api', title: 'Kết nối API trực tiếp' },
                        { desc: 'Tổng hợp từ tiện ích IDE / Trình duyệt công ty', id: 'collector', title: 'Bộ thu thập thiết bị' }
                      ].map((t) => (
                        <button
                          className={`rounded-xl border p-3 text-left transition ${
                            sourceType === t.id
                              ? 'border-primary bg-primary-soft/30 ring-1 ring-primary'
                              : 'border-border bg-surface-subtle/50 hover:border-primary/40'
                          }`}
                          key={t.id}
                          onClick={() => setSourceType(t.id as typeof sourceType)}
                          type='button'
                        >
                          <span className='text-xs font-bold text-foreground'>{t.title}</span>
                          <span className='mt-1 block text-[0.7rem] text-muted-foreground'>{t.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Template & Activity Definition */}
            {wizardStep === 2 && (
              <div className='mt-5 space-y-4'>
                <div className='rounded-xl border border-primary/20 bg-primary-soft/30 p-3.5'>
                  <div className='flex items-start gap-2.5'>
                    <Info className='mt-0.5 size-4 shrink-0 text-primary' />
                    <p className='text-xs text-muted-foreground'>
                      Bắt buộc khai báo định nghĩa hoạt động để hệ thống nhận diện đúng các tài khoản AI ít hoặc không kích hoạt.
                    </p>
                  </div>
                </div>

                <div className='grid gap-3 sm:grid-cols-2'>
                  <div>
                    <label className='block text-xs font-bold text-foreground'>Trường định danh người dùng (Identity Key)</label>
                    <input
                      className='mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground'
                      defaultValue='user_principal_name (Email công ty)'
                      readOnly
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-bold text-foreground'>Định dạng thời gian & Múi giờ nguồn</label>
                    <input
                      className='mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground'
                      defaultValue='YYYY-MM-DD HH:mm:ss (UTC → Chuyển sang GMT+7)'
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-foreground'>Định nghĩa hành vi hoạt động (Activity Events)</label>
                  <div className='mt-2 space-y-2 rounded-xl border border-border bg-surface-subtle/40 p-3 text-xs'>
                    <div className='flex items-center justify-between'>
                      <span className='font-semibold text-foreground'>Gửi prompt, nhận phản hồi AI, gợi ý mã code trong IDE</span>
                      <span className='rounded bg-success/15 px-2 py-0.5 text-[0.65rem] font-bold text-success'>Tính hoạt động</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-semibold text-foreground'>Tạo phiên làm việc mới, kích hoạt AI Agent</span>
                      <span className='rounded bg-success/15 px-2 py-0.5 text-[0.65rem] font-bold text-success'>Tính hoạt động</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-semibold text-muted-foreground'>Xác thực SSO tự động ngầm (Không phát sinh tương tác AI)</span>
                      <span className='rounded bg-muted/40 px-2 py-0.5 text-[0.65rem] font-bold text-muted-foreground'>Bỏ qua (Không tính)</span>
                    </div>
                  </div>
                </div>

                <div className='rounded-xl border border-border bg-surface-subtle/50 p-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold text-foreground'>
                    <UserCheck className='size-4 text-primary' />
                    <span>Thông báo minh bạch: Đã gửi thông báo chính sách tối ưu tài khoản AI cho nhân viên</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Upload File & Declare Coverage Window */}
            {wizardStep === 3 && (
              <div className='mt-5 space-y-4'>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <div>
                    <label className='block text-xs font-bold text-foreground'>Ngày bắt đầu bao phủ (Coverage Start) *</label>
                    <input
                      className='mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground'
                      onChange={(e) => setCoverageStart(e.target.value)}
                      type='date'
                      value={coverageStart}
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-bold text-foreground'>Ngày kết thúc bao phủ (Coverage End) *</label>
                    <input
                      className='mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground'
                      onChange={(e) => setCoverageEnd(e.target.value)}
                      type='date'
                      value={coverageEnd}
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-foreground'>Tệp dữ liệu báo cáo (CSV / JSON)</label>
                  <div className='mt-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft/10 p-6 text-center'>
                    <FileSpreadsheet className='mx-auto size-8 text-primary' />
                    <p className='mt-2 text-xs font-bold text-foreground'>{uploadedFile}</p>
                    <p className='mt-0.5 text-[0.7rem] font-mono text-muted-foreground'>{fileHash}</p>
                    <span className='mt-2 inline-flex items-center gap-1 text-[0.7rem] font-semibold text-success'>
                      <CheckCircle2 className='size-3' /> File hợp lệ, không trùng lặp mã kiểm tra hash
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preview with Source Limits */}
            {wizardStep === 4 && (
              <div className='mt-5 space-y-4'>
                <div className='rounded-xl border border-info/25 bg-info/5 p-3.5'>
                  <p className='text-xs text-info font-medium'>
                    <strong>Bản xem trước bắt buộc:</strong> Chưa có dữ liệu nào được ghi vào cơ sở dữ liệu cho tới khi IT Admin nhấn Xác nhận.
                  </p>
                </div>

                <div className='grid gap-3 sm:grid-cols-3'>
                  <div className='rounded-xl border border-success/30 bg-success/5 p-3.5 text-center'>
                    <span className='text-[0.7rem] text-muted-foreground'>Dòng hợp lệ sẽ ghi</span>
                    <p className='text-xl font-bold text-success'>1,248</p>
                    <span className='text-[0.65rem] text-muted-foreground'>Gắn vào dữ liệu tài khoản</span>
                  </div>
                  <div className='rounded-xl border border-warning/30 bg-warning/5 p-3.5 text-center'>
                    <span className='text-[0.7rem] text-muted-foreground'>Định danh chưa khớp</span>
                    <p className='text-xl font-bold text-warning'>3</p>
                    <span className='text-[0.65rem] text-muted-foreground'>Chuyển sang hàng đợi đối chiếu</span>
                  </div>
                  <div className='rounded-xl border border-danger/30 bg-danger/5 p-3.5 text-center'>
                    <span className='text-[0.7rem] text-muted-foreground'>Dòng lỗi cú pháp</span>
                    <p className='text-xl font-bold text-danger'>2</p>
                    <button className='mt-0.5 inline-flex items-center gap-1 text-[0.65rem] font-bold text-danger hover:underline' type='button'>
                      <Download className='size-3' /> Tải file lỗi log
                    </button>
                  </div>
                </div>

                <div className='rounded-xl border border-border bg-surface-subtle p-3 text-xs space-y-1.5'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Công cụ AI mục tiêu:</span>
                    <span className='font-bold text-foreground'>{selectedApp}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Khoảng thời gian bao phủ:</span>
                    <span className='font-mono font-bold text-foreground'>{coverageStart} – {coverageEnd}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Quy tắc đồng bộ:</span>
                    <span className='text-foreground'>Dữ liệu đợt mới nhất được ưu tiên ghi nhận, lưu vết kiểm toán đầy đủ</span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className='mt-6 flex items-center justify-between border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-surface-subtle'
                onClick={() => {
                  if (wizardStep === 1) setIsWizardOpen(false)
                  else setWizardStep((prev) => (prev - 1) as typeof wizardStep)
                }}
                type='button'
              >
                {wizardStep === 1 ? 'Đóng' : 'Quay lại'}
              </button>

              <div className='flex items-center gap-2'>
                {wizardStep < 4 ? (
                  <button
                    className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover disabled:opacity-50'
                    disabled={isCommApp}
                    onClick={() => setWizardStep((prev) => (prev + 1) as typeof wizardStep)}
                    type='button'
                  >
                    <span>Tiếp tục</span>
                    <ArrowRight className='size-3.5' />
                  </button>
                ) : (
                  <button
                    className='inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover disabled:opacity-60'
                    disabled={isCommitting}
                    onClick={handleCommitImport}
                    type='button'
                  >
                    {isCommitting ? <Loader2 className='size-4 animate-spin' /> : <CheckCircle2 className='size-4' />}
                    <span>{isCommitting ? 'Đang ghi dữ liệu...' : 'Xác nhận ghi dữ liệu (Confirm Commit)'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
