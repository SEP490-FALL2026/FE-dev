import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  dangerButtonClassName,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat
} from '../../../dashboard-ui'
import type { OptimizationOpportunity } from '../../../finance/optimization-data'
import { decideOptimization } from '../../../finance/optimization-store'
import {
  OptimizationEvidencePanel,
  OptimizationSavingsPanel,
  OptimizationStatusNotice,
  optimizationKindTones,
  optimizationStatusTones
} from '../../../finance/cost-optimization/components/optimization-parts'

/** APV-04 detail: the approver approves or rejects one Finance proposal; rejecting needs a reason. */
export function ApprovalOptimizationDetail({
  formatCurrency,
  item,
  onBack
}: {
  formatCurrency: (value: number) => string
  item: OptimizationOpportunity
  onBack: () => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [showReasonError, setShowReasonError] = useState(false)

  const confirmReject = () => {
    if (reason.trim().length === 0) {
      setShowReasonError(true)
      return
    }
    decideOptimization(item.id, false, reason.trim())
  }

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={onBack}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('approvals.optimization.backToList')}
      </button>

      <PageHeader
        actions={
          <span className='flex flex-wrap gap-2'>
            <Pill tone={optimizationKindTones[item.kind]}>{t(`finance.optimization.kind.${item.kind}`)}</Pill>
            <Pill tone={optimizationStatusTones[item.status]}>{t(`finance.optimization.status.${item.status}`)}</Pill>
          </span>
        }
        subtitle={`${item.code} · ${item.costCenter}`}
        title={item.app}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]'>
        <OptimizationEvidencePanel item={item} />

        <div className='space-y-6'>
          <OptimizationSavingsPanel formatCurrency={formatCurrency} item={item} />

          <Panel>
            <PanelTitle
              hint={item.sentAt ? t('approvals.optimization.sentBy', { time: formatDate(item.sentAt) }) : undefined}
              title={t('approvals.optimization.decisionTitle')}
            />
            <div className='mt-4 space-y-3 text-xs'>
              <p className='text-muted-foreground'>
                <span className='font-bold text-foreground'>{t('finance.optimization.financeNote')}: </span>
                {item.financeNote ?? t('approvals.optimization.noNote')}
              </p>

              {item.status !== 'SENT' ? (
                <OptimizationStatusNotice item={item} />
              ) : rejecting ? (
                <form
                  className='space-y-2'
                  onSubmit={(event) => {
                    event.preventDefault()
                    confirmReject()
                  }}
                >
                  <label className='font-bold' htmlFor='optimization-reject-reason'>
                    {t('approvals.optimization.rejectReason')}
                  </label>
                  <textarea
                    className={`${inputClassName} min-h-20`}
                    id='optimization-reject-reason'
                    onChange={(event) => setReason(event.target.value)}
                    value={reason}
                  />
                  {showReasonError && (
                    <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
                      {t('approvals.optimization.reasonRequired')}
                    </p>
                  )}
                  <div className='flex gap-2'>
                    <button className={dangerButtonClassName} type='submit'>
                      {t('approvals.optimization.confirmReject')}
                    </button>
                    <button className={secondaryButtonClassName} onClick={() => setRejecting(false)} type='button'>
                      {t('ui.cancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className='text-muted-foreground'>{t('approvals.optimization.decisionHint')}</p>
                  <div className='grid gap-2 sm:grid-cols-2'>
                    <button
                      className={primaryButtonClassName}
                      onClick={() => decideOptimization(item.id, true)}
                      type='button'
                    >
                      <CheckCircle2 aria-hidden='true' className='size-3.5' />
                      {t('approvals.optimization.approve')}
                    </button>
                    <button className={secondaryButtonClassName} onClick={() => setRejecting(true)} type='button'>
                      <XCircle aria-hidden='true' className='size-3.5' />
                      {t('approvals.optimization.reject')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
