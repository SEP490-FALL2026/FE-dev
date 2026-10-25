import { Clock, MessageSquareText, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
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
import type { FinanceAnswer } from '../../approvals-data'

const opinionTones: Record<NonNullable<FinanceAnswer['opinion']>, Tone> = {
  NO_BUDGET: 'warning',
  OVER: 'danger',
  WITHIN: 'success'
}

/** FR-3.14 (2): the optional budget info request and Finance's reference-only answer, shown as a short thread. */
export function FinanceOpinionPanel({
  answer,
  disabled,
  onAsk
}: {
  answer?: FinanceAnswer
  disabled: boolean
  onAsk: () => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()

  return (
    <Panel>
      <PanelTitle
        action={
          answer?.opinion && <Pill tone={opinionTones[answer.opinion]}>{t(`finance.opinion.${answer.opinion}`)}</Pill>
        }
        hint={t('approvals.request.financeHint')}
        title={t('approvals.request.financeTitle')}
      />

      {answer ? (
        <ol className='mt-4 space-y-3 text-xs'>
          <li className='rounded-xl border border-border bg-background p-3'>
            <p className='text-[0.7rem] font-bold text-muted-foreground'>
              {t('approvals.request.yourQuestion', { time: formatDate(answer.askedAt) })}
            </p>
            {answer.question && <p className='mt-1 text-foreground'>{answer.question}</p>}
          </li>
          {answer.opinion ? (
            <li className='rounded-xl border-l-4 border-info bg-info/5 p-3'>
              <p className='text-[0.7rem] font-bold text-info'>
                {t('approvals.request.financeReplied', {
                  name: answer.answeredBy ?? t('approvals.request.financeTeam'),
                  time: answer.answeredAt ? formatDate(answer.answeredAt) : ''
                })}
              </p>
              <p className='mt-1.5'>
                <Pill tone={opinionTones[answer.opinion]}>{t(`finance.opinion.${answer.opinion}`)}</Pill>
              </p>
              {answer.note && <p className='mt-1.5 text-foreground'>{answer.note}</p>}
            </li>
          ) : (
            <li className='flex items-center gap-2 rounded-xl border border-dashed border-border p-3 text-muted-foreground'>
              <Clock aria-hidden='true' className='size-3.5 shrink-0' />
              {t('approvals.request.financeWaiting')}
            </li>
          )}
          <li className='text-[0.7rem] text-muted-foreground'>{t('approvals.request.referenceOnly')}</li>
        </ol>
      ) : (
        <div className='mt-4 space-y-3'>
          <p className='text-xs text-muted-foreground'>{t('approvals.request.notAsked')}</p>
          <button className={`${secondaryButtonClassName} w-full`} disabled={disabled} onClick={onAsk} type='button'>
            <MessageSquareText aria-hidden='true' className='size-3.5' />
            {t('approvals.request.askFinance')}
          </button>
        </div>
      )}
    </Panel>
  )
}

export function AskFinanceDialog({
  costCenter,
  onClose,
  onSend
}: {
  costCenter: string
  onClose: () => void
  onSend: (question: string) => void
}) {
  const { t } = useTranslation('dashboard')
  const [question, setQuestion] = useState('')
  const [showError, setShowError] = useState(false)

  return (
    <Dialog
      hint={t('approvals.request.financeHint')}
      onClose={onClose}
      title={t('approvals.request.askDialogTitle', { costCenter })}
    >
      <form
        className='space-y-3'
        onSubmit={(event) => {
          event.preventDefault()
          if (question.trim().length === 0) {
            setShowError(true)
            return
          }
          onSend(question.trim())
        }}
      >
        <label className='text-xs font-bold' htmlFor='finance-question'>
          {t('approvals.request.questionLabel')}
        </label>
        <textarea
          className={`${inputClassName} min-h-24`}
          id='finance-question'
          onChange={(event) => setQuestion(event.target.value)}
          value={question}
        />
        {showError && question.trim().length === 0 && (
          <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
            {t('approvals.request.questionRequired')}
          </p>
        )}
        <div className='flex flex-wrap justify-end gap-2 pt-2'>
          <button className={secondaryButtonClassName} onClick={onClose} type='button'>
            {t('ui.cancel')}
          </button>
          <button className={primaryButtonClassName} type='submit'>
            <Send aria-hidden='true' className='size-3.5' />
            {t('approvals.request.sendQuestion')}
          </button>
        </div>
      </form>
    </Dialog>
  )
}

export function RejectDialog({
  onClose,
  onReject,
  reference
}: {
  onClose: () => void
  onReject: (reason: string) => void
  reference: string
}) {
  const { t } = useTranslation('dashboard')
  const [reason, setReason] = useState('')
  const [showError, setShowError] = useState(false)

  return (
    <Dialog
      hint={t('approvals.request.rejectHint')}
      onClose={onClose}
      title={t('approvals.request.rejectDialogTitle', { reference })}
    >
      <form
        className='space-y-3'
        onSubmit={(event) => {
          event.preventDefault()
          if (reason.trim().length === 0) {
            setShowError(true)
            return
          }
          onReject(reason.trim())
        }}
      >
        <label className='text-xs font-bold' htmlFor='reject-reason'>
          {t('approvals.request.rejectReason')}
        </label>
        <textarea
          className={`${inputClassName} min-h-24`}
          id='reject-reason'
          onChange={(event) => setReason(event.target.value)}
          value={reason}
        />
        {showError && reason.trim().length === 0 && (
          <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
            {t('approvals.reasonRequired')}
          </p>
        )}
        <div className='flex flex-wrap justify-end gap-2 pt-2'>
          <button className={secondaryButtonClassName} onClick={onClose} type='button'>
            {t('ui.cancel')}
          </button>
          <button className={dangerButtonClassName} type='submit'>
            {t('approvals.request.confirmReject')}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
