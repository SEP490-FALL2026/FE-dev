import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  RotateCcw,
  XCircle
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, PageHeader, Panel, PanelTitle, Pill } from '../../../dashboard-ui'
import { type SuccessorCandidate, successorCandidates } from '../../super-admin-data'

export function SuperAdminTransferView() {
  const { t } = useTranslation('dashboard')
  const [candidates] = useState<SuccessorCandidate[]>(successorCandidates)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    successorCandidates.find((c) => c.isEligible)?.id || ''
  )
  const [password, setPassword] = useState('')
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [transferCompleted, setTransferCompleted] = useState(false)
  const [transferError, setTransferError] = useState<string | null>(null)

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId)

  const handleStartTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    setTransferError(null)

    if (!selectedCandidate) {
      setTransferError(t('superAdmin.transfer.errorSelectCandidate'))
      return
    }

    if (!selectedCandidate.isEligible) {
      setTransferError(t('superAdmin.transfer.errorCandidateIneligible', { name: selectedCandidate.name }))
      return
    }

    if (!password) {
      setTransferError(t('superAdmin.transfer.errorPasswordRequired'))
      return
    }

    setConfirmModalOpen(true)
  }

  const handleConfirmTransfer = () => {
    setConfirmModalOpen(false)
    setTransferCompleted(true)
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        code={t('superAdmin.transfer.headerCode')}
        subtitle={t('superAdmin.transfer.headerSubtitle')}
        title={t('superAdmin.transfer.headerTitle')}
      />

      {/* Irreversible Action Warning */}
      <div className='flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-warning'>
        <AlertTriangle className='mt-0.5 size-5 shrink-0' />
        <div className='text-xs'>
          <h2 className='font-bold text-foreground'>{t('superAdmin.transfer.warningTitle')}</h2>
          <p className='mt-1 text-muted-foreground'>
            {t('superAdmin.transfer.warningText1')}{' '}
            <strong>{t('superAdmin.transfer.warningHighlight1')}</strong>
            {t('superAdmin.transfer.warningText2')}{' '}
            <strong>{t('superAdmin.transfer.warningHighlight2')}</strong>
            {t('superAdmin.transfer.warningText3')}
          </p>
        </div>
      </div>

      {transferCompleted ? (
        <Panel className='border-success/40 bg-success/5 text-center py-10'>
          <span className='mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success'>
            <CheckCircle2 className='size-8' />
          </span>
          <h2 className='mt-4 text-xl font-bold text-foreground'>{t('superAdmin.transfer.completedTitle')}</h2>
          <p className='mt-2 max-w-md mx-auto text-xs text-muted-foreground'>
            {t('superAdmin.transfer.completedDesc', { name: selectedCandidate?.name ?? '' })}
          </p>
          <div className='mt-6'>
            <a
              className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90'
              href='/login'
            >
              {t('superAdmin.transfer.reloginBtn')}
            </a>
          </div>
        </Panel>
      ) : (
        <form onSubmit={handleStartTransfer} className='space-y-6'>
          {transferError && (
            <div className='flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs font-semibold text-danger'>
              <XCircle className='size-4 shrink-0' />
              <span>{transferError}</span>
            </div>
          )}

          {/* Candidate Selection List */}
          <Panel>
            <PanelTitle
              hint={t('superAdmin.transfer.step1Hint')}
              title={t('superAdmin.transfer.step1Title')}
            />

            <div className='mt-4 space-y-3'>
              {candidates.map((candidate) => {
                const isSelected = candidate.id === selectedCandidateId
                return (
                  <label
                    className={`flex cursor-pointer items-start justify-between rounded-xl border p-4 transition ${
                      isSelected
                        ? 'border-primary bg-primary-soft/30 shadow-sm'
                        : 'border-border bg-surface hover:border-border/80'
                    } ${!candidate.isEligible ? 'opacity-70' : ''}`}
                    key={candidate.id}
                  >
                    <div className='flex items-start gap-3'>
                      <input
                        checked={isSelected}
                        className='mt-1 text-primary focus:ring-primary'
                        disabled={!candidate.isEligible}
                        name='candidate'
                        onChange={() => setSelectedCandidateId(candidate.id)}
                        type='radio'
                      />
                      <div>
                        <div className='flex items-center gap-2'>
                          <span className='font-bold text-foreground'>{candidate.name}</span>
                          <span className='font-mono text-xs text-muted-foreground'>
                            ({candidate.employeeCode})
                          </span>
                          {candidate.isEligible ? (
                            <Pill tone='success'>{t('superAdmin.transfer.eligibleSodBadge')}</Pill>
                          ) : (
                            <Pill tone='danger'>{t('superAdmin.transfer.ineligibleBadge')}</Pill>
                          )}
                        </div>
                        <p className='mt-0.5 text-xs text-muted-foreground'>
                          {candidate.position} · {candidate.department} · {candidate.email}
                        </p>
                        {candidate.ineligibleReason && (
                          <p className='mt-1 text-xs font-semibold text-danger'>
                            {candidate.ineligibleReason}
                          </p>
                        )}
                      </div>
                    </div>

                    {candidate.isEligible && isSelected && (
                      <span className='grid size-6 place-items-center rounded-full bg-primary text-primary-foreground'>
                        <CheckCircle2 className='size-4' />
                      </span>
                    )}
                  </label>
                )
              })}
            </div>
          </Panel>

          {/* Password confirmation */}
          <Panel>
            <PanelTitle
              hint={t('superAdmin.transfer.step2Hint')}
              title={t('superAdmin.transfer.step2Title')}
            />

            <div className='mt-4 max-w-md'>
              <label className='block text-xs font-bold text-foreground'>
                {t('superAdmin.transfer.passwordLabel')}
              </label>
              <div className='relative mt-1'>
                <Lock className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                <input
                  className='w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none'
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('superAdmin.transfer.passwordPlaceholder')}
                  type='password'
                  value={password}
                />
              </div>
            </div>
          </Panel>

          {/* Action button */}
          <div className='flex justify-end pt-2'>
            <button
              className='inline-flex items-center gap-2 rounded-xl bg-warning px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-warning/90 disabled:opacity-50'
              disabled={!selectedCandidate?.isEligible}
              type='submit'
            >
              <RotateCcw className='size-4' />
              {t('superAdmin.transfer.proceedTransferBtn')}
            </button>
          </div>
        </form>
      )}

      {/* Confirmation Dialog */}
      {confirmModalOpen && selectedCandidate && (
        <Dialog
          hint={t('superAdmin.transfer.dialogHint')}
          onClose={() => setConfirmModalOpen(false)}
          title={t('superAdmin.transfer.dialogTitle')}
        >
          <div className='space-y-4 text-xs'>
            <div className='rounded-xl border border-warning/30 bg-warning/10 p-4 text-warning'>
              <p className='font-bold text-foreground'>{t('superAdmin.transfer.dialogQuestion')}</p>
              <p className='mt-1 text-muted-foreground'>
                {t('superAdmin.transfer.dialogDetailPrefix')}
                <strong>{selectedCandidate.name} ({selectedCandidate.employeeCode})</strong>
                {t('superAdmin.transfer.dialogDetailSuffix')}
              </p>
            </div>

            <div className='flex justify-end gap-2 pt-2'>
              <button
                className='rounded-xl border border-border px-4 py-2 font-bold text-foreground hover:bg-surface-subtle'
                onClick={() => setConfirmModalOpen(false)}
                type='button'
              >
                {t('superAdmin.transfer.cancelBtn')}
              </button>
              <button
                className='rounded-xl bg-danger px-4 py-2 font-bold text-white hover:bg-danger/90'
                onClick={handleConfirmTransfer}
                type='button'
              >
                {t('superAdmin.transfer.confirmBtn')}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  )
}
