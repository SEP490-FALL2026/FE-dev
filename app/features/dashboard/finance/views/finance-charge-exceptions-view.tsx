import { FileText, Forward, Paperclip, ReceiptText, ShieldAlert, Wrench } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  FilterChips,
  InfoRow,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat,
  type Tone
} from '../../dashboard-ui'
import { chargeExceptions, type ChargeException, type ExceptionStatus } from '../finance-data'

type ExceptionFilter = 'all' | ExceptionStatus

const statusTones: Record<ExceptionStatus, Tone> = {
  BASIS_LINKED: 'success',
  BILLING_ERROR: 'neutral',
  CHECKING: 'warning',
  SENT_TO_APPROVER: 'info'
}

export function FinanceChargeExceptionsView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const [items, setItems] = useState<ChargeException[]>(chargeExceptions)
  const [filter, setFilter] = useState<ExceptionFilter>('CHECKING')
  const [selectedId, setSelectedId] = useState(chargeExceptions[0].id)
  const [billingNote, setBillingNote] = useState('')
  const [showBillingForm, setShowBillingForm] = useState(false)
  const [showNoteError, setShowNoteError] = useState(false)

  const visible = items.filter((item) => filter === 'all' || item.status === filter)
  const selected = items.find((item) => item.id === selectedId) ?? items[0]
  const count = (status: ExceptionStatus) => items.filter((item) => item.status === status).length

  const update = (id: string, patch: Partial<ChargeException>) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))

  const selectItem = (id: string) => {
    setSelectedId(id)
    setBillingNote('')
    setShowBillingForm(false)
    setShowNoteError(false)
  }

  const closeAsBillingError = () => {
    if (billingNote.trim().length === 0) {
      setShowNoteError(true)
      return
    }
    update(selected.id, { closeNote: billingNote.trim(), status: 'BILLING_ERROR' })
    setShowBillingForm(false)
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        code='UF-12 · FIN-07'
        subtitle={t('finance.exceptions.subtitle')}
        title={t('finance.exceptions.title')}
      />

      <Notice icon={ShieldAlert} tone='info'>
        {t('finance.exceptions.ruleNotice')}
      </Notice>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'>
        <Panel className='h-fit'>
          <FilterChips<ExceptionFilter>
            label={t('finance.exceptions.filterLabel')}
            onChange={setFilter}
            options={[
              { count: count('CHECKING'), label: t('finance.exceptions.status.CHECKING'), value: 'CHECKING' },
              {
                count: count('SENT_TO_APPROVER'),
                label: t('finance.exceptions.status.SENT_TO_APPROVER'),
                value: 'SENT_TO_APPROVER'
              },
              {
                count: count('BASIS_LINKED'),
                label: t('finance.exceptions.status.BASIS_LINKED'),
                value: 'BASIS_LINKED'
              },
              {
                count: count('BILLING_ERROR'),
                label: t('finance.exceptions.status.BILLING_ERROR'),
                value: 'BILLING_ERROR'
              },
              { label: t('ui.all'), value: 'all' }
            ]}
            value={filter}
          />
          <ul className='mt-4 space-y-2'>
            {visible.map((item) => (
              <li key={item.id}>
                <button
                  aria-current={item.id === selected.id ? 'true' : undefined}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    item.id === selected.id
                      ? 'border-primary bg-primary-soft/40'
                      : 'border-border hover:border-primary/40 hover:bg-surface-subtle/60'
                  }`}
                  onClick={() => selectItem(item.id)}
                  type='button'
                >
                  <div className='flex items-center justify-between gap-2'>
                    <span className='font-mono text-xs font-bold text-primary'>{item.code}</span>
                    <Pill tone={statusTones[item.status]}>{t(`finance.exceptions.status.${item.status}`)}</Pill>
                  </div>
                  <div className='mt-1 flex items-center justify-between gap-2'>
                    <p className='truncate text-sm font-bold text-foreground'>{item.vendor}</p>
                    <span className='text-sm font-bold'>{formatCurrency(item.amount)}</span>
                  </div>
                  <p className='mt-1 text-xs text-muted-foreground'>{t(`finance.exceptions.reason.${item.reason}`)}</p>
                </button>
              </li>
            ))}
            {visible.length === 0 && (
              <li className='rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground'>
                {t('finance.exceptions.empty')}
              </li>
            )}
          </ul>
        </Panel>

        <Panel>
          <PanelTitle
            action={
              <Pill tone={statusTones[selected.status]}>{t(`finance.exceptions.status.${selected.status}`)}</Pill>
            }
            hint={`${selected.code} · ${formatDate(selected.date)} · ${t('finance.exceptions.card', { last4: selected.cardLast4 })}`}
            title={selected.vendor}
          />

          <div className='mt-4 grid gap-4 md:grid-cols-2'>
            <div className='rounded-xl border border-border bg-background p-4'>
              <p className='text-xs font-bold'>{t('finance.exceptions.chargeTitle')}</p>
              <div className='mt-2 divide-y divide-border'>
                <InfoRow label={t('finance.exceptions.amount')} value={formatCurrency(selected.amount)} />
                {selected.approvedAmount !== undefined && (
                  <>
                    <InfoRow
                      label={t('finance.exceptions.approvedAmount')}
                      value={formatCurrency(selected.approvedAmount)}
                    />
                    <InfoRow
                      label={t('finance.exceptions.excess')}
                      value={
                        <span className='text-danger'>{formatCurrency(selected.amount - selected.approvedAmount)}</span>
                      }
                    />
                  </>
                )}
                <InfoRow
                  label={t('finance.exceptions.reasonLabel')}
                  value={<Pill tone='warning'>{t(`finance.exceptions.reason.${selected.reason}`)}</Pill>}
                />
              </div>
              <p className='mt-3 text-[0.7rem] text-muted-foreground'>{t('finance.exceptions.unallocatedNote')}</p>
            </div>

            <div className='rounded-xl border border-border bg-background p-4'>
              <p className='text-xs font-bold'>{t('finance.exceptions.basisTried')}</p>
              <ul className='mt-2 space-y-1.5 text-xs text-muted-foreground'>
                {selected.basisTried.map((basis) => (
                  <li className='flex items-start gap-1.5' key={basis}>
                    <ReceiptText aria-hidden='true' className='mt-px size-3.5 shrink-0' />
                    {basis}
                  </li>
                ))}
              </ul>
              {selected.itNote && (
                <div className='mt-3 rounded-lg bg-surface-subtle p-2.5 text-xs'>
                  <p className='flex items-center gap-1.5 font-bold'>
                    <Wrench aria-hidden='true' className='size-3.5' />
                    {t('finance.exceptions.itNote')}
                  </p>
                  <p className='mt-1 text-muted-foreground'>{selected.itNote}</p>
                </div>
              )}
            </div>
          </div>

          <div className='mt-4 rounded-xl border border-border p-4'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <p className='text-xs font-bold'>
                {t('finance.exceptions.evidence', { count: selected.evidence.length })}
              </p>
              {selected.status === 'CHECKING' && (
                <label className={`${secondaryButtonClassName} cursor-pointer`}>
                  <Paperclip aria-hidden='true' className='size-3.5' />
                  {t('finance.exceptions.attach')}
                  <input
                    className='sr-only'
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) update(selected.id, { evidence: [...selected.evidence, file.name] })
                    }}
                    type='file'
                  />
                </label>
              )}
            </div>
            <ul className='mt-2 space-y-1 text-xs'>
              {selected.evidence.map((file) => (
                <li className='flex items-center gap-1.5 font-mono text-muted-foreground' key={file}>
                  <FileText aria-hidden='true' className='size-3.5' />
                  {file}
                </li>
              ))}
            </ul>
          </div>

          <div className='mt-5 border-t border-border pt-5'>
            {selected.status === 'CHECKING' ? (
              <div className='space-y-3'>
                <p className='text-xs font-bold'>{t('finance.exceptions.resultTitle')}</p>
                <div className='flex flex-wrap gap-2'>
                  <button
                    className={primaryButtonClassName}
                    onClick={() => update(selected.id, { status: 'SENT_TO_APPROVER' })}
                    type='button'
                  >
                    <Forward aria-hidden='true' className='size-3.5' />
                    {t('finance.exceptions.sendToApprover')}
                  </button>
                  <button
                    className={secondaryButtonClassName}
                    onClick={() => setShowBillingForm((open) => !open)}
                    type='button'
                  >
                    {t('finance.exceptions.billingError')}
                  </button>
                </div>
                <p className='text-[0.7rem] text-muted-foreground'>{t('finance.exceptions.linkedByIt')}</p>

                {showBillingForm && (
                  <form
                    className='space-y-2 rounded-xl border border-border bg-background p-3'
                    onSubmit={(event) => {
                      event.preventDefault()
                      closeAsBillingError()
                    }}
                  >
                    <label className='text-xs font-bold' htmlFor='billing-note'>
                      {t('finance.exceptions.billingNote')}
                    </label>
                    <textarea
                      className={`${inputClassName} min-h-20`}
                      id='billing-note'
                      onChange={(event) => setBillingNote(event.target.value)}
                      value={billingNote}
                    />
                    {showNoteError && (
                      <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
                        {t('finance.exceptions.billingNoteRequired')}
                      </p>
                    )}
                    <button className={primaryButtonClassName} type='submit'>
                      {t('finance.exceptions.closeBillingError')}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <Notice
                icon={statusTones[selected.status] === 'success' ? ReceiptText : Forward}
                tone={statusTones[selected.status]}
              >
                <p>{t(`finance.exceptions.outcome.${selected.status}`)}</p>
                {selected.closeNote && <p className='mt-1 italic'>{selected.closeNote}</p>}
              </Notice>
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}
