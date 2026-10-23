import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCheck,
  CheckCircle2,
  FileQuestion,
  Link2,
  Search,
  ShieldAlert,
  UserCheck,
  UserX,
  X,
  XCircle
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { itUnmatchedProfiles, type UnmatchedProfile } from '../it-admin-data'
import type { ItAdminTabKey } from '../it-admin-nav'

type ItUnmatchedIdentitiesViewProps = {
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItUnmatchedIdentitiesView({ onSelectTab }: ItUnmatchedIdentitiesViewProps = {}) {
  const { t } = useTranslation('dashboard')
  const [profiles, setProfiles] = useState<UnmatchedProfile[]>(itUnmatchedProfiles)
  const [selectedProfile, setSelectedProfile] = useState<UnmatchedProfile>(itUnmatchedProfiles[0])
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false)
  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState<string>('')
  const [duplicateError, setDuplicateError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [confirmerName, setConfirmerName] = useState('Nguyễn Phú Hoàng (IT Admin)')

  const metricCounts = {
    conflict: profiles.filter((p) => p.status === 'conflict').length,
    ignored: 12,
    matched: '1,102',
    total: profiles.length
  }

  const statusConfig: Record<UnmatchedProfile['status'], { label: string; tone: string }> = {
    conflict: {
      label: t('itAdmin.unmatchedIdentities.badgeConflict'),
      tone: 'bg-danger/10 text-danger border-danger/25'
    },
    noCandidate: {
      label: t('itAdmin.unmatchedIdentities.badgeNoCandidate'),
      tone: 'bg-muted/40 text-muted-foreground border-border'
    },
    suggested: {
      label: t('itAdmin.unmatchedIdentities.colCandidate'),
      tone: 'bg-primary-soft text-primary border-primary/25'
    }
  }

  const handleOpenMatchModal = () => {
    setDuplicateError(null)
    if (selectedProfile.candidate && !selectedProfile.candidate.includes('|')) {
      setSelectedCandidate(selectedProfile.candidate)
    } else {
      setSelectedCandidate('')
    }
    setIsMatchModalOpen(true)
  }

  const handleConfirmMatch = () => {
    // Quy tắc một tài khoản AI chỉ thuộc về một nhân sự công ty
    if (selectedCandidate.includes('NV-0042') && selectedProfile.id === 'UQ-0186') {
      setDuplicateError(
        'Quy tắc chống trùng lặp: Nhân viên NV-0042 đã được liên kết với email an.nguyen@saas-sentry.test. Một tài khoản AI không thể gán đồng thời cho hai nhân sự khác nhau!'
      )
      return
    }

    const matchedEmployee = selectedCandidate || searchEmployeeQuery || 'Nhân viên đã xác minh'

    setProfiles((prev) =>
      prev.map((p) =>
        p.id === selectedProfile.id
          ? {
              ...p,
              candidate: `${matchedEmployee} (Đã khớp thủ công)`,
              confidence: '100% (Xác nhận)',
              status: 'suggested'
            }
          : p
      )
    )

    setSelectedProfile((prev) => ({
      ...prev,
      candidate: `${matchedEmployee} (Đã khớp thủ công)`,
      confidence: '100% (Xác nhận)',
      status: 'suggested'
    }))

    setIsMatchModalOpen(false)
    setToastMessage(`Đã ghi nhận ánh xạ tài khoản AI ${selectedProfile.raw} → ${matchedEmployee}`)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleIgnore = () => {
    setToastMessage(`Đã giữ mục ${selectedProfile.id} lại trong hàng đợi (không dùng để kết luận).`)
    setTimeout(() => setToastMessage(null), 2500)
  }

  return (
    <div className='space-y-6'>
      {/* Toast */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-success/30 bg-success/15 px-5 py-3.5 shadow-xl backdrop-blur-md animate-[slideUp_0.3s_ease-out]'>
          <CheckCircle2 className='size-5 text-success' />
          <div>
            <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
          <span className='size-2 rounded-full bg-primary' />
          Khớp định danh tài khoản người dùng
        </div>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.unmatchedIdentities.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.unmatchedIdentities.subtitle')}</p>
      </div>

      {/* Metrics */}
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <UserX aria-hidden='true' className='size-4 text-warning' />
            <span>{t('itAdmin.unmatchedIdentities.metricTotal')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricCounts.total}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <CheckCircle2 aria-hidden='true' className='size-4 text-success' />
            <span>{t('itAdmin.unmatchedIdentities.metricMatched')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricCounts.matched}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <AlertOctagon aria-hidden='true' className='size-4 text-danger' />
            <span>{t('itAdmin.unmatchedIdentities.metricConflict')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricCounts.conflict}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <CheckCheck aria-hidden='true' className='size-4 text-primary' />
            <span>{t('itAdmin.unmatchedIdentities.metricIgnored')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricCounts.ignored}</p>
        </div>
      </div>

      {/* Main Two-column View */}
      <div className='grid gap-6 lg:grid-cols-[1.6fr_1fr]'>
        {/* Table List */}
        <div className='overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
              <tr>
                <th className='p-3 font-semibold'>{t('itAdmin.unmatchedIdentities.colId')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.unmatchedIdentities.colRaw')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.unmatchedIdentities.colNormalized')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.unmatchedIdentities.colCandidate')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.unmatchedIdentities.colConfidence')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.unmatchedIdentities.colStatus')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {profiles.map((profile) => {
                const isSelected = selectedProfile.id === profile.id
                const cfg = statusConfig[profile.status]

                return (
                  <tr
                    className={`cursor-pointer transition hover:bg-surface-subtle/80 ${
                      isSelected ? 'bg-primary-soft/30' : ''
                    }`}
                    key={profile.id}
                    onClick={() => setSelectedProfile(profile)}
                  >
                    <td className='p-3 font-mono font-bold text-foreground'>{profile.id}</td>
                    <td className='p-3 font-mono text-foreground'>{profile.raw}</td>
                    <td className='p-3 font-mono text-muted-foreground'>{profile.normalized}</td>
                    <td className='p-3'>
                      {profile.candidate ? (
                        <div>
                          <span className='font-semibold text-foreground'>{profile.candidate}</span>
                          {profile.candidateDepartment && (
                            <span className='block text-[0.7rem] text-muted-foreground'>
                              {profile.candidateDepartment}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className='italic text-muted-foreground'>
                          {t('itAdmin.unmatchedIdentities.badgeNoCandidate')}
                        </span>
                      )}
                    </td>
                    <td className='p-3 font-semibold text-foreground'>{profile.confidence ?? '-'}</td>
                    <td className='p-3'>
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${cfg.tone}`}>
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Profile Detail Card */}
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div className='flex items-center justify-between border-b border-border pb-3'>
            <div>
              <span className='text-xs font-mono font-bold text-primary'>{selectedProfile.id}</span>
              <h2 className='text-base font-bold text-foreground'>{selectedProfile.raw}</h2>
            </div>
            <span
              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                statusConfig[selectedProfile.status].tone
              }`}
            >
              {statusConfig[selectedProfile.status].label}
            </span>
          </div>

          <div className='mt-4 space-y-3 text-xs'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.unmatchedIdentities.colNormalized')}:</span>
              <span className='font-mono font-semibold text-foreground'>{selectedProfile.normalized}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.unmatchedIdentities.colConfidence')}:</span>
              <span className='font-semibold text-foreground'>{selectedProfile.confidence ?? '-'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.unmatchedIdentities.colCandidate')}:</span>
              <span className='font-semibold text-foreground'>
                {selectedProfile.candidate ?? t('itAdmin.unmatchedIdentities.badgeNoCandidate')}
              </span>
            </div>
          </div>

          <div className='mt-6 border-t border-border pt-4'>
            {selectedProfile.status === 'conflict' ? (
              <div className='rounded-xl border border-danger/30 bg-danger/10 p-3'>
                <div className='flex items-start gap-2'>
                  <AlertOctagon aria-hidden='true' className='mt-0.5 size-4 text-danger shrink-0' />
                  <div>
                    <p className='text-xs text-danger font-bold'>Xung đột định danh cần xác minh</p>
                    <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                      Hệ thống phát hiện nhiều ứng viên có độ tương đồng. Cần IT Admin đối chiếu hồ sơ thực tế để phân bổ đúng tài khoản AI.
                    </p>
                  </div>
                </div>
              </div>
            ) : selectedProfile.status === 'noCandidate' ? (
              <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                <div className='flex items-start gap-2'>
                  <FileQuestion aria-hidden='true' className='mt-0.5 size-4 text-muted-foreground shrink-0' />
                  <div>
                    <p className='text-xs text-muted-foreground font-bold'>Chưa tìm thấy nhân sự phù hợp</p>
                    <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                      Email phụ hoặc tài khoản chuyên gia AI thuê ngoài chưa có trong danh mục. Hãy tìm kiếm thủ công trong danh bạ.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className='rounded-xl border border-primary/20 bg-primary-soft/40 p-3'>
                <div className='flex items-start gap-2'>
                  <UserCheck aria-hidden='true' className='mt-0.5 size-4 text-primary shrink-0' />
                  <div>
                    <p className='text-xs text-primary font-bold'>Gợi ý nhân sự có độ tin cậy cao</p>
                    <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                      Khớp theo quy tắc email nội bộ và họ tên. Sẵn sàng liên kết vào hồ sơ nhân viên.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className='mt-4 flex gap-2'>
              <button
                className='flex-1 rounded-xl bg-primary py-2.5 text-center text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
                onClick={handleOpenMatchModal}
                type='button'
              >
                <span className='inline-flex items-center gap-1.5'>
                  <Link2 aria-hidden='true' className='size-3.5' />
                  <span>Liên kết tài khoản AI</span>
                </span>
              </button>
              <button
                className='rounded-xl border border-border bg-surface px-3 py-2.5 text-xs font-semibold hover:border-danger hover:text-danger'
                onClick={handleIgnore}
                type='button'
              >
                <span className='inline-flex items-center gap-1.5'>
                  <XCircle aria-hidden='true' className='size-3.5' />
                  <span>{t('itAdmin.unmatchedIdentities.actIgnore')}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MANUAL MATCH MODAL ─── */}
      {isMatchModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
          <div className='relative w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
            <div className='flex items-start justify-between border-b border-border pb-4'>
              <div>
                <span className='rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary'>
                  Đối chiếu danh tính AI
                </span>
                <h2 className='mt-1 text-base font-bold text-foreground'>
                  Xác nhận liên kết tài khoản AI thủ công
                </h2>
                <p className='text-xs text-muted-foreground'>
                  Gắn định danh tài khoản AI <strong className='text-foreground'>{selectedProfile.raw}</strong> vào nhân viên
                </p>
              </div>
              <button
                className='rounded-lg p-1.5 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setIsMatchModalOpen(false)}
                type='button'
              >
                <X className='size-5' />
              </button>
            </div>

            {duplicateError && (
              <div className='mt-4 rounded-xl border border-danger/30 bg-danger/10 p-3'>
                <div className='flex items-start gap-2'>
                  <AlertTriangle className='mt-0.5 size-4 text-danger shrink-0' />
                  <p className='text-xs text-danger font-medium leading-relaxed'>{duplicateError}</p>
                </div>
              </div>
            )}

            <div className='mt-4 space-y-4 text-xs'>
              {/* Candidates selection */}
              <div>
                <label className='block font-bold text-foreground'>Ứng viên gợi ý từ hệ thống:</label>
                {selectedProfile.status === 'conflict' ? (
                  <div className='mt-2 space-y-2'>
                    {[
                      { dept: 'Product Team', name: 'Trần Quang Huy (NV-0128)', rate: '82%' },
                      { dept: 'Operations', name: 'Trần Huy (NV-0245)', rate: '80%' }
                    ].map((c) => (
                      <button
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                          selectedCandidate === c.name
                            ? 'border-primary bg-primary-soft/30 ring-1 ring-primary'
                            : 'border-border bg-surface hover:border-primary/40'
                        }`}
                        key={c.name}
                        onClick={() => setSelectedCandidate(c.name)}
                        type='button'
                      >
                        <div>
                          <span className='font-bold text-foreground'>{c.name}</span>
                          <span className='ml-2 text-muted-foreground'>· {c.dept}</span>
                        </div>
                        <span className='rounded bg-primary/10 px-2 py-0.5 font-bold text-primary'>{c.rate}</span>
                      </button>
                    ))}
                  </div>
                ) : selectedProfile.candidate ? (
                  <div className='mt-2 rounded-xl border border-primary/30 bg-primary-soft/20 p-3 flex items-center justify-between'>
                    <div>
                      <span className='font-bold text-foreground'>{selectedProfile.candidate}</span>
                      {selectedProfile.candidateDepartment && (
                        <span className='ml-2 text-muted-foreground'>· {selectedProfile.candidateDepartment}</span>
                      )}
                    </div>
                    <span className='font-mono font-bold text-success'>{selectedProfile.confidence}</span>
                  </div>
                ) : (
                  <p className='mt-1 italic text-muted-foreground'>Không có ứng viên tự động</p>
                )}
              </div>

              {/* Search Employee Directory */}
              <div>
                <label className='block font-bold text-foreground'>Tìm trong danh bạ nhân viên công ty:</label>
                <div className='relative mt-1.5'>
                  <Search className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
                  <input
                    className='w-full rounded-xl border border-border bg-background pr-4 pl-9 py-2 text-xs text-foreground outline-none focus:border-primary'
                    onChange={(e) => setSearchEmployeeQuery(e.target.value)}
                    placeholder='Tìm theo mã NV, tên hoặc email (ví dụ: NV-0042, Nguyễn Văn An)...'
                    type='text'
                    value={searchEmployeeQuery}
                  />
                </div>
              </div>

              {/* Confirmer Info */}
              <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-muted-foreground'>Người xác nhận (IT Admin):</span>
                  <span className='font-bold text-foreground'>{confirmerName}</span>
                </div>
              </div>
            </div>

            <div className='mt-6 flex justify-end gap-3 border-t border-border pt-4'>
              <button
                className='rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-surface-subtle'
                onClick={() => setIsMatchModalOpen(false)}
                type='button'
              >
                Hủy bỏ
              </button>
              <button
                className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover'
                onClick={handleConfirmMatch}
                type='button'
              >
                <CheckCircle2 className='size-3.5' />
                <span>Xác nhận liên kết tài khoản AI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
