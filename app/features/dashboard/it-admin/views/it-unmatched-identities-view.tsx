import { AlertOctagon, CheckCheck, CheckCircle2, FileQuestion, Link2, UserCheck, UserX, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { itUnmatchedProfiles, type UnmatchedProfile } from '../it-admin-data'

export function ItUnmatchedIdentitiesView() {
  const { t } = useTranslation('dashboard')
  const [selectedProfile, setSelectedProfile] = useState<UnmatchedProfile>(itUnmatchedProfiles[0])

  const metricCounts = {
    conflict: 3,
    ignored: 12,
    matched: '1,099',
    total: 146
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

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.unmatchedIdentities.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.unmatchedIdentities.subtitle')}</p>
      </div>

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

      <div className='grid gap-6 lg:grid-cols-[1.6fr_1fr]'>
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
              {itUnmatchedProfiles.map((profile) => {
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
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${cfg.tone}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

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
                  <p className='text-xs text-danger font-medium'>{t('itAdmin.unmatchedIdentities.badgeConflict')}</p>
                </div>
              </div>
            ) : selectedProfile.status === 'noCandidate' ? (
              <div className='rounded-xl border border-border bg-surface-subtle p-3'>
                <div className='flex items-start gap-2'>
                  <FileQuestion aria-hidden='true' className='mt-0.5 size-4 text-muted-foreground shrink-0' />
                  <p className='text-xs text-muted-foreground'>{t('itAdmin.unmatchedIdentities.badgeNoCandidate')}</p>
                </div>
              </div>
            ) : (
              <div className='rounded-xl border border-primary/20 bg-primary-soft/40 p-3'>
                <div className='flex items-start gap-2'>
                  <UserCheck aria-hidden='true' className='mt-0.5 size-4 text-primary shrink-0' />
                  <p className='text-xs text-muted-foreground'>{t('itAdmin.unmatchedIdentities.colCandidate')}</p>
                </div>
              </div>
            )}

            <div className='mt-4 flex gap-2'>
              <button
                className={`flex-1 rounded-xl py-2.5 text-center text-xs font-bold shadow-sm transition ${
                  selectedProfile.status === 'conflict'
                    ? 'cursor-not-allowed bg-muted text-muted-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary-hover'
                }`}
                disabled={selectedProfile.status === 'conflict'}
                type='button'
              >
                <span className='inline-flex items-center gap-1.5'>
                  <Link2 aria-hidden='true' className='size-3.5' />
                  <span>{t('itAdmin.unmatchedIdentities.actMatchSingle')}</span>
                </span>
              </button>
              <button
                className='rounded-xl border border-border bg-surface px-3 py-2.5 text-xs font-semibold hover:border-danger hover:text-danger'
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
    </div>
  )
}
