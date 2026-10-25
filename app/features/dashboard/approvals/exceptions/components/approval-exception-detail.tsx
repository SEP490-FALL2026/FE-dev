import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  InfoRow,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  dangerButtonClassName,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat,
  type Tone
} from '../../../dashboard-ui'
import { budgetChecks, type BudgetException } from '../../../finance/annual-budget-data'
import { decideBudgetException } from '../../../finance/annual-budget-store'

export type ApprovalStatus = 'approved' | 'pending' | 'rejected'
type Approval = { approved: boolean; at: string; by: string; reason?: string }

export const approvalStatusTones: Record<ApprovalStatus, Tone> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'danger'
}

export const approvalStatusOf = (approval?: { approved: boolean }): ApprovalStatus =>
  approval ? (approval.approved ? 'approved' : 'rejected') : 'pending'

/** APV-07 decision panel shared by exceptions and adjustments: approve, or reject with a required reason. */
export function ApprovalDecisionPanel({
  approval,
  idPrefix,
  onDecide
}: {
  approval?: Approval
  idPrefix: string
  onDecide: (approved: boolean, reason?: string) => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [showReasonError, setShowReasonError] = useState(false)
  const fieldId = `${idPrefix}-reject-reason`

  return (
    <Panel>
      <PanelTitle title={t('budgetPlan.approverExceptions.decisionTitle')} />
      <div className='mt-4 space-y-3 text-xs'>
        {approval ? (
          <Notice icon={approval.approved ? CheckCircle2 : XCircle} tone={approval.approved ? 'success' : 'danger'}>
            <p className='font-bold'>
              {t(
                approval.approved
                  ? 'budgetPlan.approverExceptions.notice.approved'
                  : 'budgetPlan.approverExceptions.notice.rejected'
              )}
            </p>
            <p className='mt-0.5'>
              {t('budgetPlan.approverExceptions.notice.by', { by: approval.by, time: formatDate(approval.at) })}
            </p>
            {approval.reason && (
              <p className='mt-0.5'>{t('budgetPlan.approverExceptions.notice.reason', { reason: approval.reason })}</p>
            )}
          </Notice>
        ) : rejecting ? (
          <form
            className='space-y-2'
            onSubmit={(event) => {
              event.preventDefault()
              if (reason.trim().length === 0) {
                setShowReasonError(true)
                return
              }
              onDecide(false, reason.trim())
            }}
          >
            <label className='font-bold' htmlFor={fieldId}>
              {t('budgetPlan.approverExceptions.reasonLabel')}
            </label>
            <textarea
              className={`${inputClassName} min-h-20`}
              id={fieldId}
              onChange={(event) => setReason(event.target.value)}
              value={reason}
            />
            {showReasonError && (
              <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
                {t('budgetPlan.approverExceptions.reasonRequired')}
              </p>
            )}
            <div className='flex flex-wrap gap-2'>
              <button className={dangerButtonClassName} type='submit'>
                {t('budgetPlan.approverExceptions.confirmReject')}
              </button>
              <button className={secondaryButtonClassName} onClick={() => setRejecting(false)} type='button'>
                {t('ui.cancel')}
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className='text-muted-foreground'>{t('budgetPlan.approverExceptions.decisionHint')}</p>
            <div className='grid gap-2 sm:grid-cols-2'>
              <button className={primaryButtonClassName} onClick={() => onDecide(true)} type='button'>
                <CheckCircle2 aria-hidden='true' className='size-3.5' />
                {t('budgetPlan.approverExceptions.approve')}
              </button>
              <button className={dangerButtonClassName} onClick={() => setRejecting(true)} type='button'>
                <XCircle aria-hidden='true' className='size-3.5' />
                {t('budgetPlan.approverExceptions.reject')}
              </button>
            </div>
          </>
        )}
      </div>
    </Panel>
  )
}

/** APV-07 exception detail: the failed request, Finance's resolution and proposed top-up, and the budget check. */
export function ApprovalExceptionDetail({
  exception,
  formatCurrency,
  onBack
}: {
  exception: BudgetException
  formatCurrency: (value: number) => string
  onBack: () => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const check = budgetChecks.find((item) => item.id === exception.checkId)
  const status = approvalStatusOf(exception.approval)
  const resolution = exception.resolution

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={onBack}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('budgetPlan.approverExceptions.backToList')}
      </button>

      <PageHeader
        actions={
          <span className='flex flex-wrap gap-2'>
            <Pill tone='warning'>{t(`budgetPlan.check.result.${exception.kind}`)}</Pill>
            <Pill tone={approvalStatusTones[status]}>{t(`budgetPlan.approverExceptions.status.${status}`)}</Pill>
          </span>
        }
        subtitle={`${exception.requestCode} · ${exception.costCenter} · ${exception.manager}`}
        title={exception.software}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]'>
        <div className='min-w-0 space-y-6'>
          <Panel>
            <PanelTitle title={t('budgetPlan.approverExceptions.exception.problemTitle')} />
            <p className='mt-3 text-xs text-foreground'>{exception.detail}</p>
            <div className='mt-3 divide-y divide-border'>
              <InfoRow
                label={t('budgetPlan.approverExceptions.exception.kind')}
                value={t(`budgetPlan.check.result.${exception.kind}`)}
              />
              <InfoRow
                label={t('budgetPlan.approverExceptions.exception.amount')}
                value={formatCurrency(exception.amount)}
              />
              <InfoRow label={t('budgetPlan.approverExceptions.exception.costCenter')} value={exception.costCenter} />
              <InfoRow label={t('budgetPlan.approverExceptions.exception.manager')} value={exception.manager} />
              <InfoRow label={t('budgetPlan.approverExceptions.exception.requestCode')} value={exception.requestCode} />
              <InfoRow
                label={t('budgetPlan.approverExceptions.exception.raisedAt')}
                value={formatDate(exception.raisedAt)}
              />
            </div>
          </Panel>

          <Panel>
            <PanelTitle title={t('budgetPlan.approverExceptions.exception.checkTitle')} />
            {check ? (
              <div className='mt-3 divide-y divide-border'>
                <InfoRow
                  label={t('budgetPlan.approverExceptions.exception.checkedAt')}
                  value={formatDate(check.checkedAt)}
                />
                <InfoRow
                  label={t('budgetPlan.approverExceptions.exception.checkAmount')}
                  value={formatCurrency(check.amount)}
                />
                <InfoRow
                  label={t('budgetPlan.approverExceptions.exception.remainingBefore')}
                  value={
                    check.remainingBefore !== null
                      ? formatCurrency(check.remainingBefore)
                      : t('budgetPlan.approverExceptions.exception.remainingUnknown')
                  }
                />
                {check.remainingBefore !== null && check.amount > check.remainingBefore && (
                  <InfoRow
                    label={t('budgetPlan.approverExceptions.exception.shortfall')}
                    value={<span className='text-danger'>{formatCurrency(check.amount - check.remainingBefore)}</span>}
                  />
                )}
              </div>
            ) : (
              <p className='mt-3 text-xs text-muted-foreground'>
                {t('budgetPlan.approverExceptions.exception.noCheck')}
              </p>
            )}
          </Panel>
        </div>

        <div className='space-y-6'>
          {resolution && (
            <Panel>
              <PanelTitle title={t('budgetPlan.approverExceptions.exception.financeTitle')} />
              <div className='mt-3 divide-y divide-border'>
                <InfoRow
                  label={t('budgetPlan.approverExceptions.exception.option')}
                  value={t(`budgetPlan.exceptions.action.${resolution.action}`)}
                />
                <InfoRow
                  label={t('budgetPlan.approverExceptions.exception.proposedTopUp')}
                  value={
                    resolution.topUp !== undefined
                      ? formatCurrency(resolution.topUp)
                      : t('budgetPlan.approverExceptions.exception.noTopUp')
                  }
                />
                {resolution.targetCostCenter && (
                  <InfoRow
                    label={t('budgetPlan.approverExceptions.exception.target')}
                    value={resolution.targetCostCenter}
                  />
                )}
                <InfoRow
                  label={t('budgetPlan.approverExceptions.exception.resolvedAt')}
                  value={formatDate(resolution.at)}
                />
              </div>
              <div className='mt-3 space-y-1 text-xs'>
                <p className='font-bold text-foreground'>{t('budgetPlan.approverExceptions.exception.note')}</p>
                <p className='text-muted-foreground'>{resolution.note}</p>
              </div>
            </Panel>
          )}

          <ApprovalDecisionPanel
            approval={exception.approval}
            idPrefix={`exception-${exception.id}`}
            onDecide={(approved, reason) => decideBudgetException(exception.id, approved, reason)}
          />
        </div>
      </div>
    </div>
  )
}
