import { Check, Clock, Info, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const choices = [
  { key: 'keep', icon: Check, tone: 'bg-success/10 text-success' },
  { key: 'reclaim', icon: Trash2, tone: 'bg-danger/10 text-danger' },
  { key: 'exempt', icon: Clock, tone: 'bg-brand-100 text-brand-600' }
] as const

export function AssignmentDecision() {
  const { t, i18n } = useTranslation()
  const [decision, setDecision] = useState<(typeof choices)[number]['key']>('keep')
  const [reason, setReason] = useState('')
  const [info, setInfo] = useState(false)
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  return (
    <section aria-label={t('assignmentDetail.decision')} className='space-y-4 border-t border-neutral-200 pt-5'>
      <div className='flex items-center justify-between'>
        <h2 className='text-sm font-semibold'>{t('assignmentDetail.decision')}</h2>
        <button
          type='button'
          onClick={() => setInfo(!info)}
          aria-label={t('assignmentDetail.info')}
          aria-expanded={info}
          aria-controls='assignment-decision-info'
          className='rounded-md p-1 text-neutral-500 hover:bg-brand-100 hover:text-brand-600'
        >
          <Info size={16} aria-hidden='true' />
        </button>
      </div>
      {info && (
        <p
          id='assignment-decision-info'
          className='rounded-lg bg-brand-bg p-3 text-xs leading-relaxed text-neutral-500'
        >
          {t('assignmentDetail.infoText')}
        </p>
      )}
      <fieldset>
        <legend className='sr-only'>{t('assignmentDetail.chooseDecision')}</legend>
        <div className='grid gap-3 sm:grid-cols-3'>
          {choices.map((choice) => (
            <label
              key={choice.key}
              className={`relative flex cursor-pointer flex-col items-center rounded-lg border p-4 transition-colors focus-within:ring-2 focus-within:ring-brand-500 ${decision === choice.key ? 'border-brand-500 bg-brand-100/25 ring-1 ring-brand-500' : 'border-neutral-200 hover:bg-brand-bg'}`}
            >
              <input
                type='radio'
                name='assignment-decision'
                value={choice.key}
                checked={decision === choice.key}
                onChange={() => setDecision(choice.key)}
                aria-label={t(`assignmentDetail.choices.${choice.key}`)}
                className='sr-only'
              />
              <span className={`mb-2 flex size-10 items-center justify-center rounded-full ${choice.tone}`}>
                <choice.icon size={24} aria-hidden='true' />
              </span>
              <span className='text-sm font-medium'>{t(`assignmentDetail.choices.${choice.key}`)}</span>
              <span className='mt-1 text-center text-xs text-neutral-500'>
                {t(`assignmentDetail.choiceHints.${choice.key}`)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor='assignment-reason' className='mb-2 block text-sm font-medium'>
          {t('assignmentDetail.reason')}
          <span aria-hidden='true' className='ml-1 text-danger'>
            *
          </span>
        </label>
        <div className='relative'>
          <textarea
            id='assignment-reason'
            required
            maxLength={250}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            placeholder={t('assignmentDetail.reasonPlaceholder')}
            aria-describedby='assignment-reason-count assignment-submit-hint'
            className='block w-full resize-y rounded-lg border border-neutral-200 bg-brand-bg p-3 pb-7 text-sm outline-brand-500'
          />
          <p id='assignment-reason-count' className='absolute right-3 bottom-2 text-xs text-neutral-500'>
            {t('assignmentDetail.reasonCount', { used: number.format(reason.length), limit: number.format(250) })}
          </p>
        </div>
      </div>
      <p id='assignment-submit-hint' className='text-xs leading-relaxed text-neutral-500'>
        {t('assignmentDetail.draftHint')}
      </p>
      <button
        type='button'
        disabled
        aria-describedby='assignment-submit-hint'
        className='w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50'
      >
        {t('assignmentDetail.submit')}
      </button>
    </section>
  )
}
