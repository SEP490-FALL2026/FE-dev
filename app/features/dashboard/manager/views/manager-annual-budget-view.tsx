import { Check, FileText, Info, Paperclip, Send, Trash2 } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { MOCK_TEAM_MEMBERS } from '../manager-data'

export function ManagerAnnualBudgetView() {
  const { i18n, t } = useTranslation('dashboard')
  const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN'
  const number = new Intl.NumberFormat(locale)
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
    year: 'numeric'
  })
  const formatDate = (value: string) => dateFormatter.format(new Date(`${value}T00:00:00Z`))
  const team = MOCK_TEAM_MEMBERS[0]
  const [budgetDate, setBudgetDate] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const canSubmit = Boolean(budgetDate) && attachments.length > 0 && !submitted

  const handleAttachments = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? [])
    setAttachments((current) => [
      ...current,
      ...selected.filter(
        (file) => !current.some((existing) => existing.name === file.name && existing.size === file.size)
      )
    ])
    setSubmitted(false)
    event.target.value = ''
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (canSubmit) setSubmitted(true)
  }

  const steps = [
    { title: t('manager.annualBudget.stepManager'), detail: t('manager.annualBudget.stepManagerDetail') },
    { title: t('manager.annualBudget.stepFinance'), detail: t('manager.annualBudget.stepFinanceDetail') },
    { title: t('manager.annualBudget.stepApprover'), detail: t('manager.annualBudget.stepApproverDetail') },
    { title: t('manager.annualBudget.stepBudget'), detail: t('manager.annualBudget.stepBudgetDetail') }
  ]

  return (
    <div className='mx-auto max-w-7xl space-y-6 pb-8'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <span className='inline-flex rounded-full border border-primary/25 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-ink'>
            {t('manager.annualBudget.eyebrow')}
          </span>
          <h1 className='mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('manager.annualBudget.title')}
          </h1>
          <p className='mt-2 max-w-3xl text-sm leading-6 text-muted-foreground'>{t('manager.annualBudget.subtitle')}</p>
        </div>
        <span className='rounded-full border border-warning/25 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning-ink'>
          {t('manager.annualBudget.previewBadge')}
        </span>
      </header>

      <section
        aria-label={t('manager.annualBudget.workflowLabel')}
        className='rounded-2xl border border-border bg-surface p-5 shadow-sm'
      >
        <ol className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {steps.map((step, index) => (
            <li className='flex items-start gap-3' key={step.title}>
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${index === 0 ? 'bg-primary text-primary-foreground' : 'border border-border bg-surface-subtle text-muted-foreground'}`}
              >
                {number.format(index + 1)}
              </span>
              <div>
                <p className='text-sm font-semibold text-foreground'>{step.title}</p>
                <p className='mt-1 text-xs leading-5 text-muted-foreground'>{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {submitted && (
        <div
          aria-live='polite'
          className='flex gap-3 rounded-2xl border border-success/25 bg-success/10 p-4 text-sm text-success'
        >
          <Check aria-hidden='true' className='mt-0.5 size-5 shrink-0' />
          <p>{t('manager.annualBudget.submittedPreview')}</p>
        </div>
      )}

      <form className='space-y-6' onSubmit={handleSubmit}>
        <section className='rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6'>
          <div className='flex items-start gap-3'>
            <Info aria-hidden='true' className='mt-0.5 size-5 shrink-0 text-primary' />
            <div>
              <h2 className='text-base font-bold text-foreground'>{t('manager.annualBudget.contextTitle')}</h2>
              <p className='mt-1 text-sm text-muted-foreground'>{t('manager.annualBudget.contextDescription')}</p>
            </div>
          </div>
          <div className='mt-5 grid gap-5 border-t border-border pt-5 sm:grid-cols-2 sm:gap-6'>
            <dl>
              <dt className='text-xs text-muted-foreground'>{t('manager.annualBudget.department')}</dt>
              <dd className='mt-1 flex h-11 items-center rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground'>
                {team.department}
              </dd>
            </dl>
            <div>
              <label className='text-xs text-muted-foreground' htmlFor='annual-budget-date'>
                {t('manager.annualBudget.budgetDate')}
              </label>
              <input
                className='mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                id='annual-budget-date'
                onChange={(event) => {
                  setBudgetDate(event.target.value)
                  setSubmitted(false)
                }}
                required
                type='date'
                value={budgetDate}
              />
              <p className='mt-1 text-xs text-muted-foreground'>{t('manager.annualBudget.budgetDateHint')}</p>
            </div>
          </div>
        </section>

        <section className='rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h2 className='text-base font-bold text-foreground'>{t('manager.annualBudget.documentsTitle')}</h2>
              <p className='mt-1 max-w-2xl text-sm leading-6 text-muted-foreground'>
                {t('manager.annualBudget.documentsDescription')}
              </p>
            </div>
            <span className='rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-semibold text-muted-foreground'>
              {t('manager.annualBudget.documentCountValue', { count: attachments.length })}
            </span>
          </div>
          <label
            className='mt-5 flex min-h-16 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary-soft/40 px-4 text-sm font-semibold text-primary-ink hover:bg-primary-soft'
            htmlFor='annual-budget-files'
          >
            <Paperclip aria-hidden='true' className='size-4' />
            {t('manager.annualBudget.attachFiles')}
          </label>
          <input
            accept='.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg'
            aria-label={t('manager.annualBudget.attachFiles')}
            className='sr-only'
            id='annual-budget-files'
            multiple
            onChange={handleAttachments}
            type='file'
          />
          {attachments.length === 0 ? (
            <p className='mt-5 rounded-xl border border-border bg-surface-subtle/30 p-5 text-center text-sm text-muted-foreground'>
              {t('manager.annualBudget.noDocuments')}
            </p>
          ) : (
            <ul className='mt-5 grid gap-3 sm:grid-cols-2'>
              {attachments.map((file, index) => (
                <li
                  className='flex min-w-0 items-center gap-3 rounded-xl border border-border bg-surface-subtle/50 px-4 py-3 text-sm'
                  key={`${file.name}-${file.size}`}
                >
                  <FileText aria-hidden='true' className='size-5 shrink-0 text-primary' />
                  <span className='min-w-0 flex-1 truncate text-foreground' title={file.name}>
                    {file.name}
                  </span>
                  <button
                    aria-label={t('manager.annualBudget.removeFile', { name: file.name })}
                    className='grid size-10 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger'
                    onClick={() => {
                      setAttachments((current) => current.filter((_, position) => position !== index))
                      setSubmitted(false)
                    }}
                    type='button'
                  >
                    <Trash2 aria-hidden='true' className='size-4' />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className='rounded-2xl border border-primary/25 bg-primary-soft/25 p-5 sm:p-6'>
          <div className='flex flex-wrap items-start justify-between gap-5'>
            <div>
              <h2 className='text-base font-bold text-foreground'>{t('manager.annualBudget.summaryTitle')}</h2>
              <dl className='mt-4 grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2'>
                <div>
                  <dt className='text-muted-foreground'>{t('manager.annualBudget.budgetDate')}</dt>
                  <dd className='mt-1 font-semibold text-foreground'>
                    {budgetDate ? formatDate(budgetDate) : t('manager.annualBudget.dateNotSelected')}
                  </dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>{t('manager.annualBudget.documentCount')}</dt>
                  <dd className='mt-1 font-semibold text-foreground'>{number.format(attachments.length)}</dd>
                </div>
              </dl>
            </div>
            <div className='w-full sm:max-w-64'>
              <button
                className='inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
                disabled={!canSubmit}
                type='submit'
              >
                <Send aria-hidden='true' className='size-4' />
                {t('manager.annualBudget.submit')}
              </button>
              {!canSubmit && !submitted && (
                <p className='mt-2 text-xs text-muted-foreground'>{t('manager.annualBudget.submitHint')}</p>
              )}
            </div>
          </div>
          <p className='mt-5 border-t border-primary/15 pt-4 text-xs leading-5 text-muted-foreground'>
            {t('manager.annualBudget.financeOwnsCost')}
          </p>
        </section>
      </form>
    </div>
  )
}
